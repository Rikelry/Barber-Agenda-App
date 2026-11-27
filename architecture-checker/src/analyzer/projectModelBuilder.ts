import type { ProjectScanResult } from "../core/types.js";
import type { ParsedFile } from "../parser/typescriptTypes.js";
import type { ProjectModel } from "../core/projectModel.js";

export function buildProjectModel(
    scanResult: ProjectScanResult,
    parsedFiles: ParsedFile[],
): ProjectModel {
    const parsedFilesMap = new Map(
        parsedFiles.map((file) => [file.filePath, file]),
    );

    const files = scanResult.files.map((file) => {
        const parsedFile = parsedFilesMap.get(file.relativePath);

        if (!parsedFile) {
            throw new Error(
                `Não foi possível encontrar os dados do parser para: ${file.relativePath}`,
            );
        }

        return {
            ...file,
            imports: parsedFile.imports,
            declarations: parsedFile.declarations,
            constructors: parsedFile.constructors,
            instantiations: parsedFile.instantiations,
            variables: parsedFile.variables,
        };
    });

    const totalImports = files.reduce(
        (total, file) => total + file.imports.length,
        0,
    );

    const totalDeclarations = files.reduce(
        (total, file) => total + file.declarations.length,
        0,
    );

    return {
        rootPath: scanResult.rootPath,
        files,
        directories: scanResult.directories,
        detectedLayers: scanResult.detectedLayers,
        statistics: {
            totalFiles: files.length,
            totalImports,
            totalDeclarations,
        },
        violations: [],
    };
}
