import * as ts from "typescript";
import fs from "node:fs/promises";

import type { ProjectFile } from "../core/types.js";
import type {
    DeclarationInfo,
    ImportInfo,
    ParsedFile,
} from "./typescriptTypes.js";

function getLine(sourceFile: ts.SourceFile, node: ts.Node): number {
    return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
        .line + 1;
}

function extractImports(sourceFile: ts.SourceFile): ImportInfo[] {
    const imports: ImportInfo[] = [];

    for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement)) {
            continue;
        }

        const moduleSpecifier = statement.moduleSpecifier;

        if (!ts.isStringLiteral(moduleSpecifier)) {
            continue;
        }

        const importClause = statement.importClause;

        const namedImports: string[] = [];
        let defaultImport: string | undefined;
        let namespaceImport: string | undefined;

        if (importClause) {
            defaultImport = importClause.name?.text;

            const bindings = importClause.namedBindings;

            if (bindings && ts.isNamespaceImport(bindings)) {
                namespaceImport = bindings.name.text;
            }

            if (bindings && ts.isNamedImports(bindings)) {
                for (const element of bindings.elements) {
                    namedImports.push(element.name.text);
                }
            }
        }

        imports.push({
            moduleSpecifier: moduleSpecifier.text,
            namedImports,
            defaultImport,
            namespaceImport,
            isTypeOnly: importClause?.isTypeOnly ?? false,
            line: getLine(sourceFile, statement),
        });
    }

    return imports;
}

function extractDeclarations(
    sourceFile: ts.SourceFile,
): DeclarationInfo[] {
    const declarations: DeclarationInfo[] = [];

    for (const statement of sourceFile.statements) {
        let kind: DeclarationInfo["kind"] | undefined;
        let name: string | undefined;
        let heritage: string[] = [];

        if (ts.isInterfaceDeclaration(statement)) {
            kind = "interface";
            name = statement.name.text;
            heritage = statement.heritageClauses?.flatMap((clause) =>
                clause.types.map((type) => type.expression.getText(sourceFile)),
            ) ?? [];
        } else if (ts.isClassDeclaration(statement)) {
            kind = "class";
            name = statement.name?.text;
            heritage = statement.heritageClauses?.flatMap((clause) =>
                clause.types.map((type) => type.expression.getText(sourceFile)),
            ) ?? [];
        } else if (ts.isFunctionDeclaration(statement)) {
            kind = "function";
            name = statement.name?.text;
        } else if (ts.isTypeAliasDeclaration(statement)) {
            kind = "type";
            name = statement.name.text;
        } else if (ts.isEnumDeclaration(statement)) {
            kind = "enum";
            name = statement.name.text;
        }

        if (!kind || !name) {
            continue;
        }

        const modifiers = ts.canHaveModifiers(statement)
            ? ts.getModifiers(statement)
            : undefined;

        const isExported =
            modifiers?.some(
                (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
            ) ?? false;

        declarations.push({
            name,
            kind,
            line: getLine(sourceFile, statement),
            isExported,
            heritage,
        });
    }

    return declarations;
}

export async function parseTypeScriptFile(
    file: ProjectFile,
): Promise<ParsedFile> {
    const content = await fs.readFile(file.absolutePath, "utf-8");

    const sourceFile = ts.createSourceFile(
        file.absolutePath,
        content,
        ts.ScriptTarget.Latest,
        true,
        file.extension === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
    );

    return {
        filePath: file.relativePath,
        layer: file.layer,
        imports: extractImports(sourceFile),
        declarations: extractDeclarations(sourceFile),
    };
}
