import type {
    ArchitectureLayer,
    ArchitectureViolation,
    ProjectFile,
    ViolationSeverity,
} from "../core/types.js";

export interface SeverityCounts {
    total: number;
    errors: number;
    warnings: number;
    infos: number;
}

export const SEVERITY_ORDER: ViolationSeverity[] = [
    "error",
    "warning",
    "info",
];

export function groupViolationsBySeverity(
    violations: ArchitectureViolation[],
): Record<ViolationSeverity, ArchitectureViolation[]> {
    const groups: Record<ViolationSeverity, ArchitectureViolation[]> = {
        error: [],
        warning: [],
        info: [],
    };

    for (const violation of violations) {
        groups[violation.severity].push(violation);
    }

    return groups;
}

export function countBySeverity(
    violations: ArchitectureViolation[],
): SeverityCounts {
    const counts: SeverityCounts = {
        total: violations.length,
        errors: 0,
        warnings: 0,
        infos: 0,
    };

    for (const violation of violations) {
        switch (violation.severity) {
            case "error":
                counts.errors++;
                break;
            case "warning":
                counts.warnings++;
                break;
            case "info":
                counts.infos++;
                break;
        }
    }

    return counts;
}

export function countFilesByLayer(
    files: Pick<ProjectFile, "layer">[],
): Record<ArchitectureLayer, number> {
    const counts: Record<ArchitectureLayer, number> = {
        view: 0,
        viewmodel: 0,
        usecase: 0,
        model: 0,
        infra: 0,
        di: 0,
        routes: 0,
        unknown: 0,
    };

    for (const file of files) {
        counts[file.layer]++;
    }

    return counts;
}

/** Exit codes: 0 sem avisos/erros, 1 com warnings, 2 com erros. */
export function computeExitCode(
    violations: ArchitectureViolation[],
): 0 | 1 | 2 {
    if (violations.some((violation) => violation.severity === "error")) {
        return 2;
    }

    if (violations.some((violation) => violation.severity === "warning")) {
        return 1;
    }

    return 0;
}
