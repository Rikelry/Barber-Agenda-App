import type { ArchitectureLayer } from "../core/types.js";
import type { ProjectModel } from "../core/projectModel.js";

const FORBIDDEN_DEPENDENCIES: Partial<
    Record<ArchitectureLayer, ArchitectureLayer[]>
> = {
    view: ["usecase", "infra"],
    viewmodel: ["infra"],
    usecase: ["infra"],
    model: ["infra"],
    infra: ["view", "viewmodel"],
};

export function validateLayerDependencies(
    projectModel: ProjectModel,
): ProjectModel {
    const violations: ProjectModel["violations"] = [];

    for (const file of projectModel.files) {
        for (const importInfo of file.imports) {
            if (
                importInfo.resolutionStatus !== "internal" ||
                !importInfo.resolvedFilePath
            ) {
                continue;
            }

            const targetFile = projectModel.files.find(
                (candidate) =>
                    candidate.absolutePath === importInfo.resolvedFilePath,
            );

            if (!targetFile) {
                continue;
            }

            const forbiddenTargets =
                FORBIDDEN_DEPENDENCIES[file.layer] ?? [];

            if (!forbiddenTargets.includes(targetFile.layer)) {
                continue;
            }

            violations.push({
                ruleId: "LAYER_DEPENDENCY_001",
                severity: "error",
                message:
                    `A camada ${file.layer} não pode depender da camada ${targetFile.layer}.`,
                filePath: file.relativePath,
                line: importInfo.line,
                suggestion:
                    "Revise a direção da dependência conforme a arquitetura MVVM Sofisticada.",
            });
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
