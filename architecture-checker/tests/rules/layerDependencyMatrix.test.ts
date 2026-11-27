import { describe, expect, it } from "vitest";

import { validateLayerDependencies } from "../../src/analyzer/layerDependencyRules.js";

import type { ProjectModel } from "../../src/core/projectModel.js";
import type { ArchitectureLayer } from "../../src/core/types.js";
import type { ImportResolutionStatus } from "../../src/parser/typescriptTypes.js";

interface ScenarioOptions {
    isTypeOnly?: boolean;
    resolutionStatus?: ImportResolutionStatus;
}

function createProjectModel(
    sourceLayer: ArchitectureLayer,
    targetLayer: ArchitectureLayer,
    options: ScenarioOptions = {},
): ProjectModel {
    const {
        isTypeOnly = false,
        resolutionStatus = "internal",
    } = options;

    return {
        rootPath: "/project",
        directories: [],
        detectedLayers: [sourceLayer, targetLayer],
        statistics: {
            totalFiles: 2,
            totalImports: 1,
            totalDeclarations: 0,
        },
        violations: [],
        files: [
            {
                absolutePath: "/project/src/source.ts",
                relativePath: "src/source.ts",
                extension: ".ts",
                layer: sourceLayer,
                declarations: [],
                imports: [
                    {
                        moduleSpecifier: "../target",
                        namedImports: [],
                        isTypeOnly,
                        line: 5,
                        resolvedFilePath:
                            resolutionStatus === "internal"
                                ? "/project/src/target.ts"
                                : undefined,
                        resolutionStatus,
                    },
                ],
            },
            {
                absolutePath: "/project/src/target.ts",
                relativePath: "src/target.ts",
                extension: ".ts",
                layer: targetLayer,
                declarations: [],
                imports: [],
            },
        ],
    };
}

function countViolations(
    sourceLayer: ArchitectureLayer,
    targetLayer: ArchitectureLayer,
    options?: ScenarioOptions,
): number {
    const project = createProjectModel(
        sourceLayer,
        targetLayer,
        options,
    );

    return validateLayerDependencies(project).violations.length;
}

describe("LAYER_DEPENDENCY_001 — matriz de dependências", () => {
    describe("deve gerar violação para import de valor", () => {
        it.each<[ArchitectureLayer, ArchitectureLayer]>([
            ["view", "infra"],
            ["view", "di"],
            ["view", "usecase"],
            ["viewmodel", "view"],
            ["viewmodel", "infra"],
            ["usecase", "view"],
            ["usecase", "viewmodel"],
            ["usecase", "di"],
            ["usecase", "infra"],
            ["infra", "view"],
            ["infra", "viewmodel"],
            ["infra", "usecase"],
            ["infra", "di"],
            ["di", "view"],
            ["di", "viewmodel"],
            ["routes", "viewmodel"],
            ["routes", "usecase"],
            ["routes", "infra"],
            ["routes", "di"],
            ["routes", "model"],
        ])(
            "%s → %s",
            (sourceLayer, targetLayer) => {
                expect(
                    countViolations(sourceLayer, targetLayer),
                ).toBe(1);
            },
        );
    });

    describe("não deve gerar violação", () => {
        it.each<[ArchitectureLayer, ArchitectureLayer, ScenarioOptions]>([
            ["view", "viewmodel", {}],
            ["view", "view", {}],
            ["view", "model", { isTypeOnly: true }],
            ["viewmodel", "di", {}],
            ["viewmodel", "model", {}],
            ["viewmodel", "usecase", { isTypeOnly: true }],
            ["usecase", "model", {}],
            ["usecase", "usecase", {}],
            ["infra", "model", {}],
            ["infra", "infra", {}],
            ["di", "infra", {}],
            ["di", "usecase", {}],
            ["di", "model", {}],
            ["routes", "view", {}],
        ])(
            "%s → %s",
            (sourceLayer, targetLayer, options) => {
                expect(
                    countViolations(sourceLayer, targetLayer, options),
                ).toBe(0);
            },
        );
    });

    describe("deve ignorar imports externos e não resolvidos", () => {
        it.each<[ImportResolutionStatus]>([
            ["external"],
            ["unresolved"],
        ])(
            "não deve reportar violação para resolutionStatus %s",
            (resolutionStatus) => {
                expect(
                    countViolations("view", "usecase", {
                        resolutionStatus,
                    }),
                ).toBe(0);
            },
        );
    });

    describe("casos type-only", () => {
        it("não deve gerar violação para import type de Model a partir de View", () => {
            expect(
                countViolations("view", "model", { isTypeOnly: true }),
            ).toBe(0);
        });

        it("deve gerar violação para import type de Infra a partir de View", () => {
            expect(
                countViolations("view", "infra", { isTypeOnly: true }),
            ).toBe(1);
        });
    });
});
