import type {
    AnalyzedProjectFile,
    ProjectModel,
} from "../core/projectModel.js";

import type { ImportInfo } from "../parser/typescriptTypes.js";

const RULE_ID = "DI_COMPOSITION_001";

interface ImportedBinding {
    /** Nome usado para verificar se o símbolo é referenciado no arquivo. */
    referenceName: string;
    /** Nome exato procurado nas instanciações ("new <newName>"). */
    newName: string;
    /** Rótulo exibido nas mensagens. */
    label: string;
}

function collectBindings(
    importInfo: ImportInfo,
    exportedClassNames: string[],
): ImportedBinding[] {
    const bindings: ImportedBinding[] = [];

    const exportedClassNamesSet = new Set(exportedClassNames);
    const typeOnlyNames = new Set(importInfo.typeOnlyNames ?? []);

    importInfo.namedImports.forEach((localName, index) => {
        // Bindings importados apenas como tipo não são composição.
        if (typeOnlyNames.has(localName)) {
            return;
        }

        // O nome exportado (com alias, `import { A as B }` → "A") precisa
        // corresponder a uma classe exportada pelo arquivo do Use Case; a
        // instanciação é procurada pelo nome local (namedImports → "B").
        const exportedName = importInfo.importedNames?.[index] ?? localName;

        if (!exportedClassNamesSet.has(exportedName)) {
            return;
        }

        bindings.push({
            referenceName: localName,
            newName: localName,
            label: localName,
        });
    });

    if (importInfo.defaultImport) {
        bindings.push({
            referenceName: importInfo.defaultImport,
            newName: importInfo.defaultImport,
            label: importInfo.defaultImport,
        });
    }

    if (importInfo.namespaceImport) {
        for (const className of exportedClassNames) {
            bindings.push({
                referenceName: importInfo.namespaceImport,
                newName: `${importInfo.namespaceImport}.${className}`,
                label: `${importInfo.namespaceImport}.${className}`,
            });
        }
    }

    return bindings;
}

/** Considera instanciada qualquer ocorrência de "new <newName>" no arquivo. */
function isInstantiated(
    containerFile: AnalyzedProjectFile,
    newName: string,
): boolean {
    return containerFile.instantiations.some(
        (instantiation) =>
            instantiation.kind === "new" &&
            instantiation.name === newName,
    );
}

export function validateDIComposition(
    projectModel: ProjectModel,
): ProjectModel {
    const violations: ProjectModel["violations"] = [];

    const filesByAbsolutePath = new Map(
        projectModel.files.map((file) => [
            file.absolutePath,
            file,
        ]),
    );

    for (const containerFile of projectModel.files) {
        if (containerFile.layer !== "di") {
            continue;
        }

        for (const importInfo of containerFile.imports) {
            if (
                importInfo.isTypeOnly ||
                importInfo.resolutionStatus !== "internal" ||
                !importInfo.resolvedFilePath
            ) {
                continue;
            }

            const importedFile = filesByAbsolutePath.get(
                importInfo.resolvedFilePath,
            );

            if (!importedFile || importedFile.layer !== "usecase") {
                continue;
            }

            const exportedUseCaseClasses = importedFile.declarations.filter(
                (declaration) =>
                    declaration.kind === "class" && declaration.isExported,
            );

            // Não é um módulo de composição de Use Cases.
            if (exportedUseCaseClasses.length === 0) {
                continue;
            }

            const bindings = collectBindings(
                importInfo,
                exportedUseCaseClasses.map(
                    (declaration) => declaration.name,
                ),
            );

            for (const binding of bindings) {
                const instantiated = isInstantiated(
                    containerFile,
                    binding.newName,
                );

                if (!instantiated) {
                    const referenced =
                        importInfo.valueReferences?.includes(
                            binding.referenceName,
                        ) ||
                        importInfo.typeReferences?.includes(
                            binding.referenceName,
                        );

                    // Referências de tipo e padrões de composição/factory
                    // podem ser válidos mesmo sem um `new` direto no container.
                    if (referenced) {
                        continue;
                    }

                    violations.push({
                        ruleId: RULE_ID,
                        severity: "error",
                        message:
                            `A classe ${binding.label} foi importada pelo container, mas não foi instanciada.`,
                        filePath: containerFile.relativePath,
                        line: importInfo.line,
                        suggestion:
                            `Instancie ${binding.label} no container e disponibilize sua instância.`,
                    });

                    continue;
                }

                // Só reporta "não exportada" quando a instância é atribuída a
                // uma variável de topo (instanciações em factory/função são
                // ignoradas).
                const instanceVariable = containerFile.variables.find(
                    (variable) =>
                        variable.initializer?.kind === "new" &&
                        variable.initializer.name === binding.newName,
                );

                if (instanceVariable && !instanceVariable.isExported) {
                    violations.push({
                        ruleId: RULE_ID,
                        severity: "error",
                        message:
                            `A instância de ${binding.label} foi criada, mas não foi exportada pelo container.`,
                        filePath: containerFile.relativePath,
                        line: instanceVariable.line,
                        suggestion:
                            `Exporte a variável que contém a instância de ${binding.label}.`,
                    });
                }
            }
        }
    }

    return {
        ...projectModel,
        violations: [
            ...projectModel.violations,
            ...violations,
        ],
    };
}
