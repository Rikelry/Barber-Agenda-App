import { describe, expect, it } from "vitest";

import {
    validateDomainContracts,
    validateInfraErrorHandling,
    validateViewHasViewModel,
    validateViewModelDI,
    validateViewModelUseCaseValueImport,
} from "../../src/analyzer/heuristicRules.js";

import type { ProjectModel } from "../../src/core/projectModel.js";
import type { ArchitectureLayer } from "../../src/core/types.js";
import type {
    DeclarationInfo,
    ExpressionInfo,
    ImportInfo,
} from "../../src/parser/typescriptTypes.js";

interface FileSpec {
    relativePath: string;
    layer: ArchitectureLayer;
    imports?: ImportInfo[];
    declarations?: DeclarationInfo[];
    instantiations?: ExpressionInfo[];
}

function createProjectModel(files: FileSpec[]): ProjectModel {
    return {
        rootPath: "/project",
        directories: [],
        detectedLayers: [...new Set(files.map((file) => file.layer))],
        statistics: {
            totalFiles: files.length,
            totalImports: files.reduce(
                (total, file) => total + (file.imports?.length ?? 0),
                0,
            ),
            totalDeclarations: files.reduce(
                (total, file) => total + (file.declarations?.length ?? 0),
                0,
            ),
        },
        violations: [],
        files: files.map((file) => ({
            absolutePath: `/project/${file.relativePath}`,
            relativePath: file.relativePath,
            extension: file.relativePath.endsWith(".tsx") ? ".tsx" : ".ts",
            layer: file.layer,
            imports: file.imports ?? [],
            declarations: file.declarations ?? [],
            constructors: [],
            instantiations: file.instantiations ?? [],
            variables: [],
        })),
    };
}

function importFrom(
    moduleSpecifier: string,
    resolvedFilePath: string,
    overrides: Partial<ImportInfo> = {},
): ImportInfo {
    return {
        moduleSpecifier,
        namedImports: [],
        isTypeOnly: false,
        line: 2,
        resolvedFilePath,
        resolutionStatus: "internal",
        ...overrides,
    };
}

function newExpression(name: string, line: number): ExpressionInfo {
    return {
        kind: "new",
        text: `new ${name}()`,
        name,
        line,
    };
}

function classDeclaration(name: string, line: number): DeclarationInfo {
    return {
        name,
        kind: "class",
        line,
        isExported: true,
        heritage: [],
    };
}

describe("HEUR_VM_DI_001 — ViewModel não deve instanciar Use Cases", () => {
    it("deve gerar violação quando o ViewModel instancia um Use Case", () => {
        const project = createProjectModel([
            {
                relativePath: "src/viewmodel/useAuthViewModel.ts",
                layer: "viewmodel",
                imports: [
                    importFrom(
                        "@/usecase/authUseCases",
                        "/project/src/usecase/authUseCases.ts",
                        {
                            namedImports: ["AuthUseCases"],
                            importedNames: ["AuthUseCases"],
                            line: 3,
                        },
                    ),
                ],
                instantiations: [newExpression("AuthUseCases", 8)],
            },
            {
                relativePath: "src/usecase/authUseCases.ts",
                layer: "usecase",
            },
        ]);

        const violations = validateViewModelDI(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_VM_DI_001",
            severity: "warning",
            filePath: "src/viewmodel/useAuthViewModel.ts",
            line: 8,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar violação quando o ViewModel só importa o container DI", () => {
        const project = createProjectModel([
            {
                relativePath: "src/viewmodel/useAuthViewModel.ts",
                layer: "viewmodel",
                imports: [
                    importFrom(
                        "@/di/container",
                        "/project/src/di/container.ts",
                        { namedImports: ["authUseCases"] },
                    ),
                ],
            },
            {
                relativePath: "src/di/container.ts",
                layer: "di",
            },
        ]);

        expect(validateViewModelDI(project)).toHaveLength(0);
    });

    it("não deve gerar violação para import type de Use Case", () => {
        const project = createProjectModel([
            {
                relativePath: "src/viewmodel/useAuthViewModel.ts",
                layer: "viewmodel",
                imports: [
                    importFrom(
                        "@/usecase/iAuthUseCases",
                        "/project/src/usecase/iAuthUseCases.ts",
                        {
                            namedImports: ["IAuthUseCases"],
                            importedNames: ["IAuthUseCases"],
                            isTypeOnly: true,
                        },
                    ),
                ],
            },
            {
                relativePath: "src/usecase/iAuthUseCases.ts",
                layer: "usecase",
            },
        ]);

        expect(validateViewModelDI(project)).toHaveLength(0);
    });
});

describe("HEUR_VM_USECASE_001 — ViewModel não deve importar valor de Use Case", () => {
    it("deve gerar violação ao importar valor de um módulo de Use Case", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/viewmodel/useIndisponibilidadesViewModel.ts",
                layer: "viewmodel",
                imports: [
                    importFrom(
                        "@/usecase/appointmentUseCases",
                        "/project/src/usecase/appointmentUseCases.ts",
                        {
                            namedImports: ["toIsoDate"],
                            importedNames: ["toIsoDate"],
                            line: 6,
                        },
                    ),
                ],
            },
            {
                relativePath: "src/usecase/appointmentUseCases.ts",
                layer: "usecase",
            },
        ]);

        const violations = validateViewModelUseCaseValueImport(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_VM_USECASE_001",
            severity: "warning",
            filePath: "src/viewmodel/useIndisponibilidadesViewModel.ts",
            line: 6,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar violação com import type", () => {
        const project = createProjectModel([
            {
                relativePath: "src/viewmodel/useAuthViewModel.ts",
                layer: "viewmodel",
                imports: [
                    importFrom(
                        "@/usecase/iAuthUseCases",
                        "/project/src/usecase/iAuthUseCases.ts",
                        {
                            namedImports: ["IAuthUseCases"],
                            importedNames: ["IAuthUseCases"],
                            isTypeOnly: true,
                        },
                    ),
                ],
            },
            {
                relativePath: "src/usecase/iAuthUseCases.ts",
                layer: "usecase",
            },
        ]);

        expect(validateViewModelUseCaseValueImport(project)).toHaveLength(0);
    });

    it("não deve gerar violação com import { type X }", () => {
        const project = createProjectModel([
            {
                relativePath: "src/viewmodel/useAuthViewModel.ts",
                layer: "viewmodel",
                imports: [
                    importFrom(
                        "@/usecase/iAuthUseCases",
                        "/project/src/usecase/iAuthUseCases.ts",
                        {
                            namedImports: ["IAuthUseCases"],
                            importedNames: ["IAuthUseCases"],
                            typeOnlyNames: ["IAuthUseCases"],
                            isTypeOnly: false,
                        },
                    ),
                ],
            },
            {
                relativePath: "src/usecase/iAuthUseCases.ts",
                layer: "usecase",
            },
        ]);

        expect(validateViewModelUseCaseValueImport(project)).toHaveLength(0);
    });
});

describe("HEUR_DOMAIN_001 — Model não deve declarar classes", () => {
    it("deve gerar violação para declaração class na camada model", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/model/datasources/appointmentDataSource.ts",
                layer: "model",
                declarations: [
                    classDeclaration("HttpAppointmentDataSource", 4),
                ],
            },
        ]);

        const violations = validateDomainContracts(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_DOMAIN_001",
            severity: "warning",
            filePath: "src/model/datasources/appointmentDataSource.ts",
            line: 4,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar violação para arquivo de erros (nome contendo 'error')", () => {
        const project = createProjectModel([
            {
                relativePath: "src/model/errors.ts",
                layer: "model",
                declarations: [classDeclaration("DomainError", 3)],
            },
        ]);

        expect(validateDomainContracts(project)).toHaveLength(0);
    });

    it("não deve gerar violação para interface ou type", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/model/datasources/iAppointmentDataSource.ts",
                layer: "model",
                declarations: [
                    {
                        name: "IAppointmentDataSource",
                        kind: "interface",
                        line: 3,
                        isExported: true,
                        heritage: [],
                    },
                    {
                        name: "AppointmentId",
                        kind: "type",
                        line: 9,
                        isExported: true,
                        heritage: [],
                    },
                ],
            },
        ]);

        expect(validateDomainContracts(project)).toHaveLength(0);
    });
});

describe("HEUR_VIEW_001 — View (tela) deve depender de um ViewModel", () => {
    it("deve gerar violação para tela sem import resolvido de viewmodel", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/barbeiros.tsx",
                layer: "view",
            },
        ]);

        const violations = validateViewHasViewModel(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_VIEW_001",
            severity: "warning",
            filePath: "src/view/barbeiros.tsx",
            line: 1,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar violação quando a tela importa um viewmodel", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/barbeiros.tsx",
                layer: "view",
                imports: [
                    importFrom(
                        "@/viewmodel/useBarbeirosViewModel",
                        "/project/src/viewmodel/useBarbeirosViewModel.ts",
                        { namedImports: ["useBarbeirosViewModel"] },
                    ),
                ],
            },
            {
                relativePath: "src/viewmodel/useBarbeirosViewModel.ts",
                layer: "viewmodel",
            },
        ]);

        expect(validateViewHasViewModel(project)).toHaveLength(0);
    });

    it("não deve gerar violação para arquivos em pasta 'components'", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/components/TextField.tsx",
                layer: "view",
            },
        ]);

        expect(validateViewHasViewModel(project)).toHaveLength(0);
    });
});

describe("HEUR_ERROR_001 — Infra não deve lançar Error genérico", () => {
    it("deve gerar violação para 'new Error(' na camada infra", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/infra/datasources/httpAppointmentDataSource.ts",
                layer: "infra",
                instantiations: [newExpression("Error", 42)],
            },
        ]);

        const violations = validateInfraErrorHandling(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_ERROR_001",
            severity: "warning",
            filePath:
                "src/infra/datasources/httpAppointmentDataSource.ts",
            line: 42,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar violação para 'new DomainError('", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/infra/datasources/httpAppointmentDataSource.ts",
                layer: "infra",
                instantiations: [newExpression("DomainError", 42)],
            },
        ]);

        expect(validateInfraErrorHandling(project)).toHaveLength(0);
    });
});
