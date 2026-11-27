import { describe, expect, it } from "vitest";
import path from "node:path";

import { loadProjectTypeScriptConfig } from "../../src/analyzer/projectConfigLoader.js";
import { resolveProjectImports } from "../../src/analyzer/importResolver.js";
import { buildProjectModel } from "../../src/analyzer/projectModelBuilder.js";
import { extractProjectAst } from "../../src/parser/astExtractor.js";
import { scanProject } from "../../src/scanner/projectScanner.js";

async function resolveFixtureProject() {
    const projectPath = path.resolve(
        process.cwd(),
        "tests",
        "fixtures",
        "import-resolution-project",
    );
    const scanResult = await scanProject(projectPath);
    const parsedFiles = await extractProjectAst(scanResult.files);
    const projectModel = buildProjectModel(scanResult, parsedFiles);
    const projectConfig = loadProjectTypeScriptConfig(projectPath);

    return resolveProjectImports(projectModel, projectConfig.options);
}

describe("resolução de imports do projeto", () => {
    it("resolve aliases definidos em paths no tsconfig", async () => {
        const project = await resolveFixtureProject();
        const viewFile = project.files.find(
            (file) => file.relativePath === "src/view/ExampleView.ts",
        );
        const aliasImport = viewFile?.imports.find(
            (importInfo) =>
                importInfo.moduleSpecifier ===
                "@/viewmodel/ExampleViewModel",
        );

        expect(aliasImport).toMatchObject({
            resolutionStatus: "internal",
            resolvedFilePath: path.resolve(
                project.rootPath,
                "src/viewmodel/ExampleViewModel.ts",
            ),
        });
    });

    it("marca como unresolved um alias cujo arquivo não existe", async () => {
        const project = await resolveFixtureProject();
        const viewFile = project.files.find(
            (file) => file.relativePath === "src/view/ExampleView.ts",
        );
        const missingImport = viewFile?.imports.find(
            (importInfo) =>
                importInfo.moduleSpecifier === "@/usecase/MissingUseCase",
        );

        expect(missingImport).toMatchObject({
            resolutionStatus: "unresolved",
        });
        expect(missingImport?.resolvedFilePath).toBeUndefined();
    });

    it("marca como external um pacote que não resolve (sem node_modules)", async () => {
        const project = await resolveFixtureProject();
        const viewFile = project.files.find(
            (file) => file.relativePath === "src/view/ExampleView.ts",
        );
        const packageImport = viewFile?.imports.find(
            (importInfo) => importInfo.moduleSpecifier === "react-native",
        );

        expect(packageImport).toMatchObject({
            resolutionStatus: "external",
        });
    });
});
