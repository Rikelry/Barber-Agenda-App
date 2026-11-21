import type { ProjectModel } from "../core/projectModel.js";

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

            for (const importedName of importInfo.namedImports) {
                const useCaseClass = importedFile.declarations.find(
                    (declaration) =>
                        declaration.kind === "class" &&
                        declaration.name === importedName &&
                        declaration.isExported,
                );

                // Ignora interfaces, tipos e outras declarações.
                if (!useCaseClass) {
                    continue;
                }

                const instance = containerFile.variables.find(
                    (variable) =>
                        variable.initializer?.kind === "new" &&
                        variable.initializer.name === importedName,
                );

                if (!instance) {
                    violations.push({
                        ruleId: "DI_COMPOSITION_001",
                        severity: "error",
                        message:
                            `A classe ${importedName} foi importada pelo container, mas não foi instanciada.`,
                        filePath: containerFile.relativePath,
                        line: importInfo.line,
                        suggestion:
                            `Instancie ${importedName} no container e disponibilize sua instância.`,
                    });

                    continue;
                }

                if (!instance.isExported) {
                    violations.push({
                        ruleId: "DI_COMPOSITION_001",
                        severity: "error",
                        message:
                            `A instância de ${importedName} foi criada, mas não foi exportada pelo container.`,
                        filePath: containerFile.relativePath,
                        line: instance.line,
                        suggestion:
                            `Exporte a variável que contém a instância de ${importedName}.`,
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
