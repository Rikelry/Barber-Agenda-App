import { describe, expect, it } from "vitest";

import {
    SEVERITY_ORDER,
    buildJsonReport,
    computeExitCode,
    countBySeverity,
    countFilesByLayer,
    groupViolationsBySeverity,
} from "../../src/cli/report.js";

import type {
    ArchitectureViolation,
    ViolationSeverity,
} from "../../src/core/types.js";
import type { ProjectModel } from "../../src/core/projectModel.js";

function violation(
    severity: ViolationSeverity,
    ruleId = "TEST_001",
): ArchitectureViolation {
    return {
        ruleId,
        severity,
        message: `Violation ${ruleId}`,
        filePath: "src/view/example.tsx",
        line: 4,
        suggestion: "Review this dependency.",
    };
}

function projectModel(
    violations: ArchitectureViolation[],
): ProjectModel {
    return {
        rootPath: "/project",
        directories: [],
        detectedLayers: ["view", "infra"],
        statistics: {
            totalFiles: 2,
            totalImports: 3,
            totalDeclarations: 1,
        },
        violations,
        files: [
            {
                absolutePath: "/project/src/view/example.tsx",
                relativePath: "src/view/example.tsx",
                extension: ".tsx",
                layer: "view",
                imports: [
                    {
                        moduleSpecifier: "./viewmodel",
                        namedImports: ["useExampleViewModel"],
                        isTypeOnly: false,
                        line: 1,
                        resolutionStatus: "internal",
                    },
                    {
                        moduleSpecifier: "react",
                        namedImports: ["useState"],
                        isTypeOnly: false,
                        line: 2,
                        resolutionStatus: "external",
                    },
                ],
                declarations: [],
                constructors: [],
                instantiations: [],
                variables: [],
            },
            {
                absolutePath: "/project/src/infra/client.ts",
                relativePath: "src/infra/client.ts",
                extension: ".ts",
                layer: "infra",
                imports: [
                    {
                        moduleSpecifier: "./missing",
                        namedImports: [],
                        isTypeOnly: false,
                        line: 1,
                        resolutionStatus: "unresolved",
                    },
                ],
                declarations: [],
                constructors: [],
                instantiations: [],
                variables: [],
            },
        ],
    };
}

describe("relatório da CLI", () => {
    it("define a ordem de severidade do mais crítico ao informativo", () => {
        expect(SEVERITY_ORDER).toEqual(["error", "warning", "info"]);
    });

    it("agrupa violações sem perder sua ordem dentro de cada severidade", () => {
        const errors = violation("error", "ERROR_001");
        const warning = violation("warning", "WARNING_001");
        const info = violation("info", "INFO_001");

        const groups = groupViolationsBySeverity([
            warning,
            errors,
            info,
        ]);

        expect(groups).toEqual({
            error: [errors],
            warning: [warning],
            info: [info],
        });
    });

    it("conta cada severidade e o total", () => {
        expect(
            countBySeverity([
                violation("error"),
                violation("error", "ERROR_002"),
                violation("warning"),
                violation("info"),
            ]),
        ).toEqual({
            total: 4,
            errors: 2,
            warnings: 1,
            infos: 1,
        });
    });

    it("retorna contagens zeradas quando não há violações", () => {
        expect(countBySeverity([])).toEqual({
            total: 0,
            errors: 0,
            warnings: 0,
            infos: 0,
        });
    });

    it("conta arquivos por camada, incluindo camadas sem arquivos", () => {
        const counts = countFilesByLayer([
            { layer: "view" },
            { layer: "view" },
            { layer: "viewmodel" },
            { layer: "di" },
        ]);

        expect(counts.view).toBe(2);
        expect(counts.viewmodel).toBe(1);
        expect(counts.di).toBe(1);
        expect(counts.infra).toBe(0);
        expect(counts.unknown).toBe(0);
    });

    it("retorna exit code 0 sem warnings ou erros", () => {
        expect(computeExitCode([])).toBe(0);
        expect(computeExitCode([violation("info")])).toBe(0);
    });

    it("retorna exit code 1 quando há warning sem erro", () => {
        expect(computeExitCode([violation("warning")])).toBe(1);
    });

    it("prioriza exit code 2 quando há erro", () => {
        expect(
            computeExitCode([
                violation("warning"),
                violation("error"),
            ]),
        ).toBe(2);
    });

    it("monta um relatório JSON com estatísticas, severidades e violações", () => {
        const report = buildJsonReport(
            projectModel([
                violation("error", "LAYER_001"),
                violation("warning", "HEUR_001"),
            ]),
        );

        expect(report.rootPath).toBe("/project");
        expect(report.detectedLayers).toEqual(["view", "infra"]);
        expect(report.statistics).toMatchObject({
            totalFiles: 2,
            totalImports: 3,
            totalDeclarations: 1,
            filesByLayer: {
                view: 1,
                infra: 1,
                model: 0,
            },
            importsByResolution: {
                internal: 1,
                external: 1,
                assets: 0,
                unresolved: 1,
            },
        });
        expect(report.summary).toEqual({
            total: 2,
            errors: 1,
            warnings: 1,
            infos: 0,
        });
        expect(report.violations.map((item) => item.ruleId)).toEqual([
            "LAYER_001",
            "HEUR_001",
        ]);
    });
});
