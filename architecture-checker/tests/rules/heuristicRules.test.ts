import { describe, expect, it } from "vitest";

import {
    validateDomainContracts,
    validateHeuristics,
    validateInfraErrorHandling,
    validateInfraImplementsContract,
    validateViewBusinessLogic,
    validateViewHasViewModel,
    validateViewNavigation,
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

    it("não deve gerar violação quando a tela usa um viewmodel por valor", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/barbeiros.tsx",
                layer: "view",
                imports: [
                    importFrom(
                        "@/viewmodel/useBarbeirosViewModel",
                        "/project/src/viewmodel/useBarbeirosViewModel.ts",
                        {
                            namedImports: ["useBarbeirosViewModel"],
                            valueReferences: ["useBarbeirosViewModel"],
                        },
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

    it("deve gerar violação quando a tela só importa o viewmodel (sem usá-lo por valor)", () => {
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

        const violations = validateViewHasViewModel(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_VIEW_001",
            severity: "warning",
            filePath: "src/view/barbeiros.tsx",
        });
    });

    it("deve gerar violação quando a tela importa apenas o tipo do viewmodel", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/barbeiros.tsx",
                layer: "view",
                imports: [
                    importFrom(
                        "@/viewmodel/useBarbeirosViewModel",
                        "/project/src/viewmodel/useBarbeirosViewModel.ts",
                        {
                            namedImports: ["BarbeirosState"],
                            typeOnlyNames: ["BarbeirosState"],
                            typeReferences: ["BarbeirosState"],
                        },
                    ),
                ],
            },
            {
                relativePath: "src/viewmodel/useBarbeirosViewModel.ts",
                layer: "viewmodel",
            },
        ]);

        expect(validateViewHasViewModel(project)).toHaveLength(1);
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

describe("HEUR_VIEW_BUSINESS_001 — View deve delegar regras temporais", () => {
    it("deve gerar warning para criação de Date diretamente em uma tela", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/agenda.tsx",
                layer: "view",
                instantiations: [newExpression("Date", 18)],
            },
        ]);

        const violations = validateViewBusinessLogic(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_VIEW_BUSINESS_001",
            severity: "warning",
            filePath: "src/view/agenda.tsx",
            line: 18,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar warning para Date em camadas que não são View", () => {
        const project = createProjectModel([
            {
                relativePath: "src/viewmodel/useAgendaViewModel.ts",
                layer: "viewmodel",
                instantiations: [newExpression("Date", 12)],
            },
        ]);

        expect(validateViewBusinessLogic(project)).toHaveLength(0);
    });

    it("não deve gerar warning para componentes reutilizáveis", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/components/DateLabel.tsx",
                layer: "view",
                instantiations: [newExpression("Date", 7)],
            },
        ]);

        expect(validateViewBusinessLogic(project)).toHaveLength(0);
    });

    it("deve incluir a regra no agregador de heurísticas", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/agenda.tsx",
                layer: "view",
                imports: [
                    importFrom(
                        "@/viewmodel/useAgendaViewModel",
                        "/project/src/viewmodel/useAgendaViewModel.ts",
                        { namedImports: ["useAgendaViewModel"] },
                    ),
                ],
                instantiations: [newExpression("Date", 18)],
            },
            {
                relativePath: "src/viewmodel/useAgendaViewModel.ts",
                layer: "viewmodel",
            },
        ]);

        expect(
            validateHeuristics(project).some(
                (violation) =>
                    violation.ruleId === "HEUR_VIEW_BUSINESS_001",
            ),
        ).toBe(true);
    });
});

describe("HEUR_VIEW_NAV_001 — View não deve importar expo-router", () => {
    it("deve gerar violação quando a View importa expo-router", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/agenda.tsx",
                layer: "view",
                imports: [
                    importFrom("expo-router", "expo-router", {
                        namedImports: ["router"],
                        line: 3,
                        resolvedFilePath: undefined,
                        resolutionStatus: "external",
                    }),
                ],
            },
        ]);

        const violations = validateViewNavigation(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_VIEW_NAV_001",
            severity: "warning",
            filePath: "src/view/agenda.tsx",
            line: 3,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar violação quando a View não importa expo-router", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/agenda.tsx",
                layer: "view",
                imports: [
                    importFrom(
                        "@/viewmodel/useAgendaViewModel",
                        "/project/src/viewmodel/useAgendaViewModel.ts",
                        {
                            namedImports: ["useAgendaViewModel"],
                            valueReferences: ["useAgendaViewModel"],
                        },
                    ),
                ],
            },
            {
                relativePath: "src/viewmodel/useAgendaViewModel.ts",
                layer: "viewmodel",
            },
        ]);

        expect(validateViewNavigation(project)).toHaveLength(0);
    });

    it("não deve gerar violação quando a navegação fica no ViewModel", () => {
        const project = createProjectModel([
            {
                relativePath: "src/viewmodel/useAgendaViewModel.ts",
                layer: "viewmodel",
                imports: [
                    importFrom("expo-router", "expo-router", {
                        namedImports: ["router"],
                        resolvedFilePath: undefined,
                        resolutionStatus: "external",
                    }),
                ],
            },
        ]);

        expect(validateViewNavigation(project)).toHaveLength(0);
    });

    it("deve incluir a regra no agregador de heurísticas", () => {
        const project = createProjectModel([
            {
                relativePath: "src/view/agenda.tsx",
                layer: "view",
                imports: [
                    importFrom("expo-router", "expo-router", {
                        namedImports: ["router"],
                        resolvedFilePath: undefined,
                        resolutionStatus: "external",
                    }),
                ],
            },
        ]);

        expect(
            validateHeuristics(project).some(
                (violation) => violation.ruleId === "HEUR_VIEW_NAV_001",
            ),
        ).toBe(true);
    });
});

describe("HEUR_INFRA_CONTRACT_001 — Infra deve implementar um contrato", () => {
    it("deve gerar violação para classe em infra sem contrato implementado", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/infra/datasources/httpAppointmentDataSource.ts",
                layer: "infra",
                declarations: [
                    classDeclaration("HttpAppointmentDataSource", 12),
                ],
            },
        ]);

        const violations = validateInfraImplementsContract(project);

        expect(violations).toHaveLength(1);
        expect(violations[0]).toMatchObject({
            ruleId: "HEUR_INFRA_CONTRACT_001",
            severity: "warning",
            filePath:
                "src/infra/datasources/httpAppointmentDataSource.ts",
            line: 12,
        });
        expect(violations[0].suggestion).toBeTruthy();
    });

    it("não deve gerar violação quando a classe implementa um contrato", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/infra/datasources/httpAppointmentDataSource.ts",
                layer: "infra",
                declarations: [
                    {
                        name: "HttpAppointmentDataSource",
                        kind: "class",
                        line: 12,
                        isExported: true,
                        heritage: ["IAppointmentDataSource"],
                    },
                ],
            },
        ]);

        expect(validateInfraImplementsContract(project)).toHaveLength(0);
    });

    it("não deve gerar violação para classes em outras camadas", () => {
        const project = createProjectModel([
            {
                relativePath: "src/model/datasources/appointmentDataSource.ts",
                layer: "model",
                declarations: [classDeclaration("LegacyDataSource", 4)],
            },
        ]);

        expect(validateInfraImplementsContract(project)).toHaveLength(0);
    });

    it("deve incluir a regra no agregador de heurísticas", () => {
        const project = createProjectModel([
            {
                relativePath:
                    "src/infra/datasources/httpAppointmentDataSource.ts",
                layer: "infra",
                declarations: [
                    classDeclaration("HttpAppointmentDataSource", 12),
                ],
            },
        ]);

        expect(
            validateHeuristics(project).some(
                (violation) =>
                    violation.ruleId === "HEUR_INFRA_CONTRACT_001",
            ),
        ).toBe(true);
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
