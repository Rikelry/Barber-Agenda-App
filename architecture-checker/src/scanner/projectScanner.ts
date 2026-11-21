import fg from "fast-glob";
import path from "node:path";
import fs from "node:fs/promises";

import type {
  ArchitectureLayer,
  ProjectFile,
  ProjectScanResult,
} from "../core/types.js";

const IGNORED_PATHS = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.expo/**",
  "**/dist/**",
  "**/build/**",
  "**/coverage/**",
  "**/.next/**",
  "backend",
  "example",
  "architecture-checker",
];

function identifyLayer(relativePath: string): ArchitectureLayer {
  const segments = relativePath
    .split(path.sep)
    .map((segment) => segment.toLowerCase());

  // viewmodel precisa vir antes de view.
  if (segments.some((segment) => ["viewmodel", "viewmodels"].includes(segment))) {
    return "viewmodel";
  }

  if (segments.some((segment) => ["view", "views"].includes(segment))) {
    return "view";
  }

  if (segments.some((segment) => ["usecase", "usecases"].includes(segment))) {
    return "usecase";
  }

  if (segments.some((segment) => ["infra", "infrastructure"].includes(segment))) {
    return "infra";
  }

  if (segments.includes("model") || segments.includes("domain")) {
    return "model";
  }

  if (segments.includes("di") || segments.includes("container")) {
    return "di";
  }

  if (segments.includes("app")) {
    return "routes";
  }

  return "unknown";
}

export async function scanProject(
  projectPath: string,
): Promise<ProjectScanResult> {
  const rootPath = path.resolve(projectPath);

  let stats;

  try {
    stats = await fs.stat(rootPath);
  } catch {
    throw new Error(`O caminho informado não existe: ${rootPath}`);
  }

  if (!stats.isDirectory()) {
    throw new Error(`O caminho informado não é um diretório: ${rootPath}`);
  }

  const [filePaths, directoryPaths] = await Promise.all([
    fg("**/*.{ts,tsx,mts,cts}", {
      cwd: rootPath,
      ignore: IGNORED_PATHS,
      onlyFiles: true,
      followSymbolicLinks: false,
    }),

    fg("**/*", {
      cwd: rootPath,
      ignore: IGNORED_PATHS,
      onlyDirectories: true,
      followSymbolicLinks: false,
    }),
  ]);

  const files: ProjectFile[] = filePaths.map((filePath) => {
    const relativePath = filePath.split(path.sep).join(path.sep);

    return {
      absolutePath: path.join(rootPath, filePath),
      relativePath,
      extension: path.extname(filePath),
      layer: identifyLayer(filePath),
    };
  });

  const directories = directoryPaths.map((directoryPath) =>
    directoryPath.split(path.sep).join(path.sep),
  );

  const detectedLayers = [
    ...new Set(files.map((file) => file.layer).filter((layer) => layer !== "unknown")),
  ];

  return {
    rootPath,
    files,
    directories,
    detectedLayers,
  };
}
