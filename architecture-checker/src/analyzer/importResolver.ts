import * as ts from "typescript";
import path from "node:path";

import type { ProjectModel } from "../core/projectModel.js";
import type { ImportInfo } from "../parser/typescriptTypes.js";

const ASSET_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",
  ".mp4",
  ".mp3",
  ".pdf",
]);

function isAssetImport(moduleSpecifier: string): boolean {
  return ASSET_EXTENSIONS.has(path.extname(moduleSpecifier).toLowerCase());
}

function isExternalModule(resolvedFilePath: string): boolean {
  const normalizedPath = resolvedFilePath.replace(/\\/g, "/");

  return (
    normalizedPath.includes("/node_modules/") ||
    normalizedPath.startsWith("node:")
  );
}

/**
 * Verifica se o especificador casa com algum padrão de `paths` do tsconfig
 * (ex.: `@/*`). Serve para distinguir um alias interno que não resolveu de um
 * pacote externo (que não resolve porque o `node_modules` não está instalado).
 */
function matchesPathMapping(
  moduleSpecifier: string,
  compilerOptions: ts.CompilerOptions,
): boolean {
  const paths = compilerOptions.paths;

  if (!paths) {
    return false;
  }

  return Object.keys(paths).some((pattern) => {
    const starIndex = pattern.indexOf("*");

    if (starIndex === -1) {
      return pattern === moduleSpecifier;
    }

    const prefix = pattern.slice(0, starIndex);
    const suffix = pattern.slice(starIndex + 1);

    return (
      moduleSpecifier.length >= prefix.length + suffix.length &&
      moduleSpecifier.startsWith(prefix) &&
      moduleSpecifier.endsWith(suffix)
    );
  });
}

/**
 * Um especificador é "local" quando aponta para dentro do projeto por caminho
 * relativo/absoluto ou por alias de `paths`; qualquer outro é tratado como
 * pacote externo, mesmo sem resolver (ex.: `react-native` sem `node_modules`).
 */
function isLocalSpecifier(
  moduleSpecifier: string,
  compilerOptions: ts.CompilerOptions,
): boolean {
  return (
    moduleSpecifier.startsWith(".") ||
    moduleSpecifier.startsWith("/") ||
    matchesPathMapping(moduleSpecifier, compilerOptions)
  );
}

function resolveImport(
  importInfo: ImportInfo,
  containingFile: string,
  projectRoot: string,
  compilerOptions: ts.CompilerOptions,
): ImportInfo {
  if (isAssetImport(importInfo.moduleSpecifier)) {
    return {
      ...importInfo,
      resolutionStatus: "asset",
    };
  }

  const resolution = ts.resolveModuleName(
    importInfo.moduleSpecifier,
    containingFile,
    compilerOptions,
    ts.sys,
  );

  const resolvedFile = resolution.resolvedModule?.resolvedFileName;

  if (!resolvedFile) {
    return {
      ...importInfo,
      resolutionStatus: isLocalSpecifier(
        importInfo.moduleSpecifier,
        compilerOptions,
      )
        ? "unresolved"
        : "external",
    };
  }

  const absoluteResolvedPath = path.resolve(resolvedFile);

  if (isExternalModule(absoluteResolvedPath)) {
    return {
      ...importInfo,
      resolvedFilePath: absoluteResolvedPath,
      resolutionStatus: "external",
    };
  }

  const relativeToProject = path.relative(
    projectRoot,
    absoluteResolvedPath,
  );

  const isInsideProject =
    relativeToProject !== ".." &&
    !relativeToProject.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativeToProject);

  if (!isInsideProject) {
    return {
      ...importInfo,
      resolvedFilePath: absoluteResolvedPath,
      resolutionStatus: "external",
    };
  }

  return {
    ...importInfo,
    resolvedFilePath: absoluteResolvedPath,
    resolutionStatus: "internal",
  };
}

export function resolveProjectImports(
  projectModel: ProjectModel,
  compilerOptions: ts.CompilerOptions,
): ProjectModel {
  const files = projectModel.files.map((file) => ({
    ...file,
    imports: file.imports.map((importInfo) =>
      resolveImport(
        importInfo,
        file.absolutePath,
        projectModel.rootPath,
        compilerOptions,
      ),
    ),
  }));

  return {
    ...projectModel,
    files,
  };
}
