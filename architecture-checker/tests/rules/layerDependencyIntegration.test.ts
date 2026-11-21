import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import path from "node:path";

import { scanProject } from "../../src/scanner/projectScanner.js";
import { extractProjectAst } from "../../src/parser/astExtractor.js";
import { buildProjectModel } from "../../src/analyzer/projectModelBuilder.js";
import { resolveProjectImports } from "../../src/analyzer/importResolver.js";
import { validateLayerDependencies } from "../../src/analyzer/layerDependencyRules.js";

async function analyzeFixture(projectName: string) {
    const projectPath = path.resolve(
        process.cwd(),
        "tests",
        "fixtures",
        projectName,
    );

    const scanResult = await scanProject(projectPath);
    const parsedFiles = await extractProjectAst(scanResult.files);

    const initialModel = buildProjectModel(
        scanResult,
        parsedFiles,
    );

    const resolvedModel = resolveProjectImports(
        initialModel,
        {
            module: ts.ModuleKind.ESNext,
            moduleResolution: ts.ModuleResolutionKind.Bundler,
        },
    );

    return validateLayerDependencies(resolvedModel);
}

describe("Integração das regras arquiteturais", () => {
    it("deve aprovar o projeto válido", async () => {
        const project = await analyzeFixture("valid-project");

        expect(project.violations).toHaveLength(0);
    });

    it("deve identificar violações no projeto inválido", async () => {
        const project = await analyzeFixture("invalid-project");

        expect(project.violations).toHaveLength(2);

        expect(
            project.violations.some(
                (violation) =>
                    violation.filePath.endsWith("AuthUseCase.ts"),
            ),
        ).toBe(true);

        expect(
            project.violations.some(
                (violation) =>
                    violation.filePath.endsWith("AuthView.ts"),
            ),
        ).toBe(true);
    });
});
