// src/core/projectModel.ts

import type {
    ArchitectureLayer,
    ProjectFile,
    ArchitectureViolation,
} from "./types.js";

import type {
    ImportInfo,
    DeclarationInfo,
    ConstructorInfo,
    ExpressionInfo,
    VariableInfo,
} from "../parser/typescriptTypes.js";

export interface AnalyzedProjectFile extends ProjectFile {
    imports: ImportInfo[];
    declarations: DeclarationInfo[];
    constructors: ConstructorInfo[];
    instantiations: ExpressionInfo[];
    variables: VariableInfo[];
}

export interface ProjectModel {
    rootPath: string;
    files: AnalyzedProjectFile[];
    directories: string[];
    detectedLayers: ArchitectureLayer[];
    statistics: {
        totalFiles: number;
        totalImports: number;
        totalDeclarations: number;
    };
    violations: ArchitectureViolation[];
}
