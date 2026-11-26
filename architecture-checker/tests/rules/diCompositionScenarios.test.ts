import { describe, expect, it } from "vitest";
import * as ts from "typescript";
import path from "node:path";

import { scanProject } from "../../src/scanner/projectScanner.js";
import { extractProjectAst } from "../../src/parser/astExtractor.js";
import { buildProjectModel } from "../../src/analyzer/projectModelBuilder.js";
import { resolveProjectImports } from "../../src/analyzer/importResolver.js";
import { validateDIComposition } from "../../src/analyzer/diCompositionRules.js";

import type { ProjectModel } from "../../src/core/projectModel.js";

async function analyzeFixture(projectName: string): Promise<ProjectModel> {
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

function diViolations(project: ProjectModel): ProjectModel["violations"] {
    return project.violations.filter(
        (violation) => violation.ruleId === "DI_COMPOSITION_001",
    );
}

describe("Integração da composição de dependências — cenários válidos", () => {
    it("di-alias-valid: import { A as B } + export const b = new B()", async () => {
        const project = await analyzeFixture("di-alias-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });

    it("di-default-valid: import A from + export const a = new A()", async () => {
        const project = await analyzeFixture("di-default-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });

    it("di-namespace-valid: import * as ns + export const a = new ns.A()", async () => {
        const project = await analyzeFixture("di-namespace-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });

    it("di-deps-valid: export const a = new A(new B())", async () => {
        const project = await analyzeFixture("di-deps-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });

    it("di-export-list-valid: const a = new A(); export { a };", async () => {
        const project = await analyzeFixture("di-export-list-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });

    it("di-factory-valid: export function makeA() { return new A(); }", async () => {
        const project = await analyzeFixture("di-factory-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });

    it("di-type-only-valid: import { A } usado só como tipo, sem new", async () => {
        const project = await analyzeFixture("di-type-only-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });

    it("di-no-usecases-valid: container sem nenhum Use Case", async () => {
        const project = await analyzeFixture("di-no-usecases-valid-project");

        expect(diViolations(project)).toHaveLength(0);
    });
});

describe("Integração da composição de dependências — cenários com violação", () => {
    it("di-alias-missing-instance: import { A as B } sem instanciar", async () => {
        const project = await analyzeFixture(
            "di-alias-missing-instance-project",
        );

        const violations = diViolations(project);

        expect(violations).toHaveLength(1);
        expect(violations[0].message).toContain("não foi instanciada");
    });

    it("di-default-missing-instance: import A from sem instanciar", async () => {
        const project = await analyzeFixture(
            "di-default-missing-instance-project",
        );

        const violations = diViolations(project);

        expect(violations).toHaveLength(1);
        expect(violations[0].message).toContain("não foi instanciada");
    });

    it("di-namespace-missing-instance: import * as ns sem instanciar", async () => {
        const project = await analyzeFixture(
            "di-namespace-missing-instance-project",
        );

        const violations = diViolations(project);

        expect(violations).toHaveLength(1);
        expect(violations[0].message).toContain("não foi instanciada");
    });
});
