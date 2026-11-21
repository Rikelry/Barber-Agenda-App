import { describe, expect, it } from "vitest";

import { validateDIComposition } from "../../src/analyzer/diCompositionRules.js";

import type { ProjectModel } from "../../src/core/projectModel.js";

function createProjectModel(
    isExported: boolean,
    includeInstantiation = true,
): ProjectModel {
    return {
        rootPath: "/project",
        directories: [],
        detectedLayers: ["di", "usecase"],
        statistics: {
            totalFiles: 2,
            totalImports: 1,
            totalDeclarations: 1,
        },
        violations: [],
        files: [
            {
                absolutePath: "/project/src/di/container.ts",
                relativePath: "src/di/container.ts",
                extension: ".ts",
                layer: "di",
                declarations: [],
                constructors: [],
                instantiations: includeInstantiation
                    ? [{
                        kind: "new",
                        name: "AuthUseCases",
                        text: "new AuthUseCases()",
                        arguments: [],
                        line: 5,
                    }]
                    : [],
                variables: includeInstantiation
                    ? [{
                        name: "authUseCases",
                        line: 5,
                        isExported,
                        initializer: {
                            kind: "new",
                            name: "AuthUseCases",
                            text: "new AuthUseCases()",
                            arguments: [],
                            line: 5,
                        },
                    }]
                    : [],
                imports: [
                    {
                        moduleSpecifier: "../usecase/authUseCases",
                        namedImports: ["AuthUseCases"],
                        isTypeOnly: false,
                        line: 1,
                        resolvedFilePath: "/project/src/usecase/authUseCases.ts",
                        resolutionStatus: "internal",
                    },
                ],
            },
            {
                absolutePath: "/project/src/usecase/authUseCases.ts",
                relativePath: "src/usecase/authUseCases.ts",
                extension: ".ts",
                layer: "usecase",
                declarations: [
                    {
                        name: "AuthUseCases",
                        kind: "class",
                        line: 3,
                        isExported: true,
                        heritage: [],
                    },
                ],
                constructors: [],
                instantiations: [],
                variables: [],
                imports: [],
            },
        ],
    };
}

describe("DI_COMPOSITION_001", () => {
    it("deve aprovar uma instância exportada de Use Case", () => {
        const project = createProjectModel(true);

        const result = validateDIComposition(project);

        expect(result.violations).toHaveLength(0);
    });

    it("deve detectar Use Case importado mas não instanciado", () => {
        const project = createProjectModel(false, false);

        const result = validateDIComposition(project);

        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].ruleId).toBe("DI_COMPOSITION_001");
        expect(result.violations[0].severity).toBe("error");
    });

    it("deve detectar instância não exportada", () => {
        const project = createProjectModel(false);

        const result = validateDIComposition(project);

        expect(result.violations).toHaveLength(1);
        expect(result.violations[0].message).toContain("não foi exportada");
    });
});
