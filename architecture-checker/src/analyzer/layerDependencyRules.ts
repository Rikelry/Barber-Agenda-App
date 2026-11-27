import type { ArchitectureLayer } from "../core/types.js";
import type { ProjectModel } from "../core/projectModel.js";

const FORBIDDEN_DEPENDENCIES: Partial<
    Record<ArchitectureLayer, ArchitectureLayer[]>
> = {
    view: ["usecase", "infra", "di"],
    viewmodel: ["view", "infra"],
    usecase: ["view", "viewmodel", "di", "infra"],
    model: ["infra"],
    infra: ["view", "viewmodel", "usecase", "di"],
    di: ["view", "viewmodel"],
    routes: ["viewmodel", "usecase", "infra", "di", "model"],
};

const TYPE_ONLY_ALLOWED: Partial<
    Record<ArchitectureLayer, ArchitectureLayer[]>
> = {
    view: ["model"],
    viewmodel: ["model", "usecase"],
};

function isTypeOnlyAllowed(
    sourceLayer: ArchitectureLayer,
    targetLayer: ArchitectureLayer,
): boolean {
    const allowedTargets = TYPE_ONLY_ALLOWED[sourceLayer] ?? [];

    return allowedTargets.includes(targetLayer);
}

export function validateLayerDependencies(
    projectModel: ProjectModel,
): ProjectModel {
    const violations: ProjectModel["violations"] = [];

    const filesByAbsolutePath = new Map(
        projectModel.files.map((file) => [
            file.absolutePath,
            file,
        ]),
    );

    for (const file of projectModel.files) {
        for (const importInfo of file.imports) {
            if (
                importInfo.resolutionStatus !== "internal" ||
                !importInfo.resolvedFilePath
            ) {
                continue;
            }

            const targetFile = filesByAbsolutePath.get(
                importInfo.resolvedFilePath,
            );

            if (!targetFile) {
                continue;
            }

            const forbiddenTargets =
                FORBIDDEN_DEPENDENCIES[file.layer] ?? [];

            if (!forbiddenTargets.includes(targetFile.layer)) {
                continue;
            }

            if (
                importInfo.isTypeOnly &&
                isTypeOnlyAllowed(file.layer, targetFile.layer)
            ) {
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
