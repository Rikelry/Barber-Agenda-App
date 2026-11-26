// src/analyzer/heuristicRules.ts
//
// Heurísticas arquiteturais (severidade "warning"). São checagens mais leves
// que as regras estruturais (LAYER_DEPENDENCY_001 / DI_COMPOSITION_001) e
// servem como indicativos de possíveis desvios de responsabilidade.

import type { ProjectModel } from "../core/projectModel.js";
import type { ImportInfo } from "../parser/typescriptTypes.js";
import type { ArchitectureViolation } from "../core/types.js";

const RULE_ID = {
    vmDI: "HEUR_VM_DI_001",
    vmUseCaseValueImport: "HEUR_VM_USECASE_001",
    domain: "HEUR_DOMAIN_001",
    view: "HEUR_VIEW_001",
    error: "HEUR_ERROR_001",
} as const;

/** Opções da heurística de contratos de domínio (HEUR_DOMAIN_001). */
export interface DomainRuleOptions {
    /** Arquivos cujo caminho casa com este padrão são isentos. Padrão: /error/i. */
    errorFilePattern?: RegExp;
}

/** Opções da heurística de View (HEUR_VIEW_001). */
export interface ViewRuleOptions {
    /** Pastas ignoradas pela heurística. Padrão: ["components"]. */
    ignoredFolders?: string[];
}

/** Opções agregadas repassadas às heurísticas que as aceitam. */
export interface HeuristicsOptions
    extends DomainRuleOptions,
        ViewRuleOptions {}

function indexByAbsolutePath(
    project: ProjectModel,
): Map<string, ProjectModel["files"][number]> {
    return new Map(
        project.files.map((file) => [file.absolutePath, file]),
    );
}

/** Import de valor interno, com arquivo de destino resolvido. */
function isInternalValueImport(importInfo: ImportInfo): boolean {
    return (
        !importInfo.isTypeOnly &&
        importInfo.resolutionStatus === "internal" &&
        importInfo.resolvedFilePath !== undefined
    );
}

/**
 * Nomes locais importados por valor (excluindo `import { type X }` e os
 * bindings listados em `typeOnlyNames`).
 */
function collectValueBindingNames(importInfo: ImportInfo): string[] {
    const typeOnlyNames = new Set(importInfo.typeOnlyNames ?? []);

    const names = importInfo.namedImports.filter(
        (name) => !typeOnlyNames.has(name),
    );

    if (importInfo.defaultImport) {
        names.push(importInfo.defaultImport);
    }

    if (importInfo.namespaceImport) {
        names.push(importInfo.namespaceImport);
    }

    return names;
}

/**
 * HEUR_VM_DI_001: um ViewModel não deve instanciar Use Cases diretamente
 * (`new XUseCases(...)`); deve recebê-los via container de injeção.
 */
export function validateViewModelDI(
    project: ProjectModel,
): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];
    const filesByAbsolutePath = indexByAbsolutePath(project);

    for (const file of project.files) {
        if (file.layer !== "viewmodel") {
            continue;
        }

        // Classes importadas por valor a partir de módulos da camada usecase.
        const useCaseClassNames = new Set<string>();

        for (const importInfo of file.imports) {
            if (!isInternalValueImport(importInfo)) {
                continue;
            }

            const importedFile = filesByAbsolutePath.get(
                importInfo.resolvedFilePath as string,
            );

            if (!importedFile || importedFile.layer !== "usecase") {
                continue;
            }

            for (const name of collectValueBindingNames(importInfo)) {
                useCaseClassNames.add(name);
            }
        }

        if (useCaseClassNames.size === 0) {
            continue;
        }

        for (const instantiation of file.instantiations) {
            if (
                instantiation.kind !== "new" ||
                !instantiation.name ||
                !useCaseClassNames.has(instantiation.name)
            ) {
                continue;
            }

            violations.push({
                ruleId: RULE_ID.vmDI,
                severity: "warning",
                message:
                    `O ViewModel instancia ${instantiation.name} diretamente, mas essa classe pertence ao Use Case.`,
                filePath: file.relativePath,
                line: instantiation.line,
                suggestion:
                    `Remova "new ${instantiation.name}(...)" do ViewModel e obtenha a instância de ${instantiation.name} pelo container de injeção de dependência.`,
            });
        }
    }

    return violations;
}

/**
 * HEUR_VM_USECASE_001: um ViewModel não deve importar valores de módulos de
 * Use Case (apenas tipos, via `import type` ou `import { type X }`).
 */
export function validateViewModelUseCaseValueImport(
    project: ProjectModel,
): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];
    const filesByAbsolutePath = indexByAbsolutePath(project);

    for (const file of project.files) {
        if (file.layer !== "viewmodel") {
            continue;
        }

        for (const importInfo of file.imports) {
            if (!isInternalValueImport(importInfo)) {
                continue;
            }

            const importedFile = filesByAbsolutePath.get(
                importInfo.resolvedFilePath as string,
            );

            if (!importedFile || importedFile.layer !== "usecase") {
                continue;
            }

            const valueNames = collectValueBindingNames(importInfo);

            if (valueNames.length === 0) {
                continue;
            }

            violations.push({
                ruleId: RULE_ID.vmUseCaseValueImport,
                severity: "warning",
                message:
                    `O ViewModel importa o valor ${valueNames.join(", ")} de um módulo de Use Case.`,
                filePath: file.relativePath,
                line: importInfo.line,
                suggestion:
                    `Importe apenas os tipos (use "import type") e acesse a funcionalidade via container de injeção de dependência.`,
            });
        }
    }

    return violations;
}

/**
 * HEUR_DOMAIN_001: a camada Model deve conter apenas contratos
 * (interface/type), não classes.
 */
export function validateDomainContracts(
    project: ProjectModel,
    options: DomainRuleOptions = {},
): ArchitectureViolation[] {
    const { errorFilePattern = /error/i } = options;

    const violations: ArchitectureViolation[] = [];

    for (const file of project.files) {
        if (file.layer !== "model") {
            continue;
        }

        // Arquivos de erro de domínio são isentos (classes são legítimas).
        if (errorFilePattern.test(file.relativePath)) {
            continue;
        }

        for (const declaration of file.declarations) {
            if (declaration.kind !== "class") {
                continue;
            }

            violations.push({
                ruleId: RULE_ID.domain,
                severity: "warning",
                message:
                    `A camada Model deve conter apenas contratos, mas ${declaration.name} é uma classe.`,
                filePath: file.relativePath,
                line: declaration.line,
                suggestion:
                    `Transforme ${declaration.name} em interface/type ou mova a implementação para a camada Infra.`,
            });
        }
    }

    return violations;
}

function isInIgnoredFolder(
    relativePath: string,
    ignoredFolders: string[],
): boolean {
    const segments = relativePath.split(/[\\/]/);

    return ignoredFolders.some((folder) => segments.includes(folder));
}

/**
 * HEUR_VIEW_001: toda View (tela) deve depender de um ViewModel.
 */
export function validateViewHasViewModel(
    project: ProjectModel,
    options: ViewRuleOptions = {},
): ArchitectureViolation[] {
    const { ignoredFolders = ["components"] } = options;

    const violations: ArchitectureViolation[] = [];
    const filesByAbsolutePath = indexByAbsolutePath(project);

    for (const file of project.files) {
        if (file.layer !== "view") {
            continue;
        }

        if (isInIgnoredFolder(file.relativePath, ignoredFolders)) {
            continue;
        }

        const dependsOnViewModel = file.imports.some((importInfo) => {
            if (!importInfo.resolvedFilePath) {
                return false;
            }

            const importedFile = filesByAbsolutePath.get(
                importInfo.resolvedFilePath,
            );

            return importedFile?.layer === "viewmodel";
        });

        if (dependsOnViewModel) {
            continue;
        }

        violations.push({
            ruleId: RULE_ID.view,
            severity: "warning",
            message:
                "A View não depende de nenhum ViewModel para delegar suas ações.",
            filePath: file.relativePath,
            line: 1,
            suggestion:
                "Crie/consuma um ViewModel (ex.: use<Screen>ViewModel) e delegue a ele as ações e o estado da tela.",
        });
    }

    return violations;
}

/**
 * HEUR_ERROR_001: a camada Infra deve lançar erros de domínio (DomainError),
 * não `Error` genérico.
 */
export function validateInfraErrorHandling(
    project: ProjectModel,
): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    for (const file of project.files) {
        if (file.layer !== "infra") {
            continue;
        }

        for (const instantiation of file.instantiations) {
            if (
                instantiation.kind !== "new" ||
                instantiation.name !== "Error"
            ) {
                continue;
            }

            violations.push({
                ruleId: RULE_ID.error,
                severity: "warning",
                message:
                    "A camada Infra lança um Error genérico (new Error(...)).",
                filePath: file.relativePath,
                line: instantiation.line,
                suggestion:
                    "Lance um erro de domínio (ex.: DomainError/ValidationError) em vez de Error genérico.",
            });
        }
    }

    return violations;
}

/**
 * Executa as cinco heurísticas e retorna todas as violações encontradas.
 */
export function validateHeuristics(
    project: ProjectModel,
    options: HeuristicsOptions = {},
): ArchitectureViolation[] {
    return [
        ...validateViewModelDI(project),
        ...validateViewModelUseCaseValueImport(project),
        ...validateDomainContracts(project, options),
        ...validateViewHasViewModel(project, options),
        ...validateInfraErrorHandling(project),
    ];
}
