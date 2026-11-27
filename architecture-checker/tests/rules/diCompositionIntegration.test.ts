import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import path from "node:path";

import { scanProject } from "../../src/scanner/projectScanner.js";
import { extractProjectAst } from "../../src/parser/astExtractor.js";
import { buildProjectModel } from "../../src/analyzer/projectModelBuilder.js";
import { resolveProjectImports } from "../../src/analyzer/importResolver.js";
import { validateDIComposition } from "../../src/analyzer/diCompositionRules.js";

async function analyzeFixture(projectName: string) {
    const projectPath = path.resolve(
        process.cwd(),
        "tests",
        "fixtures",
        projectName,
    );

    const scanResult = await scanProject(projectPath);
    const parsedFiles = await extractProjectAst(scanResult.files);
    const initialModel = buildProjectModel(scanResult, parsedFiles);

    const resolvedModel = resolveProjectImports(initialModel, {
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
    });

    return validateDIComposition(resolvedModel);
}

describe("Integração da composição de dependências", () => {
    it("não deve apontar violações quando os oito Use Cases são instanciados e exportados", async () => {
        const project = await analyzeFixture("di-valid-project");

        const violations = project.violations.filter(
            (violation) => violation.ruleId === "DI_COMPOSITION_001",
        );

        expect(violations).toHaveLength(0);
    });

    it("deve apontar quando um Use Case importado não é instanciado", async () => {
        const project = await analyzeFixture(
            "di-missing-instance-project",
        );

        const violations = project.violations.filter(
            (violation) => violation.ruleId === "DI_COMPOSITION_001",
        );

        expect(violations).toHaveLength(1);
        expect(violations[0].message).toContain("não foi instanciada");
    });

    it("deve apontar quando a instância criada não é exportada", async () => {
        const project = await analyzeFixture(
            "di-missing-export-project",
        );

        const violations = project.violations.filter(
            (violation) => violation.ruleId === "DI_COMPOSITION_001",
        );

        expect(violations).toHaveLength(1);
        expect(violations[0].message).toContain("não foi exportada");
    });
});
