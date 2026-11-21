import { describe, expect, it } from "vitest";

import { validateLayerDependencies } from "../../src/analyzer/layerDependencyRules.js";

import type { ProjectModel } from "../../src/core/projectModel.js";

function createProjectModel(
    sourceLayer: ProjectModel["files"][number]["layer"],
    targetLayer: ProjectModel["files"][number]["layer"],
): ProjectModel {
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
                        isTypeOnly: false,
                        line: 5,
                        resolvedFilePath: "/project/src/target.ts",
                        resolutionStatus: "internal",
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

describe("LAYER_DEPENDENCY_001", () => {
    it("deve detectar View importando Use Cases", () => {
        const project = createProjectModel("view", "usecase");

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].severity).toBe("error");
        expect(result.violations[0].filePath).toBe("src/source.ts");
        expect(result.violations[0].line).toBe(5);
    });

    it("deve detectar ViewModel importando Infra", () => {
        const project = createProjectModel("viewmodel", "infra");

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(1);
    });

    it("não deve detectar ViewModel importando DI", () => {
        const project = createProjectModel("viewmodel", "di");

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(0);
    });

    it("não deve detectar Use Cases importando Model", () => {
        const project = createProjectModel("usecase", "model");

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(0);
    });

    it("deve ignorar imports externos", () => {
        const project = createProjectModel("view", "usecase");

        project.files[0].imports[0].resolutionStatus = "external";

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(0);
    });

    it("deve detectar Infra importando Use Cases", () => {
        const project = createProjectModel("infra", "usecase");

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(1);
    });

    it("deve detectar Routes importando Infra", () => {
        const project = createProjectModel("routes", "infra");

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(1);
    });

    it("deve detectar Routes importando ViewModel", () => {
        const project = createProjectModel("routes", "viewmodel");

        const result = validateLayerDependencies(project);

        expect(result.violations).toHaveLength(1);
    });
});
