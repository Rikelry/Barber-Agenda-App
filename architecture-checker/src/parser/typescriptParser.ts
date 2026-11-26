import * as ts from "typescript";
import fs from "node:fs/promises";

import type { ProjectFile } from "../core/types.js";
import type {
    ConstructorInfo,
    DeclarationInfo,
    ExportInfo,
    ExpressionInfo,
    ImportInfo,
    ParsedFile,
    VariableInfo,
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
        const importedNames: string[] = [];
        const typeOnlyNames: string[] = [];
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
                    const localName = element.name.text;

                    namedImports.push(localName);
                    importedNames.push(
                        (element.propertyName ?? element.name).text,
                    );

                    if (element.isTypeOnly) {
                        typeOnlyNames.push(localName);
                    }
                }
            }
        }

        imports.push({
            moduleSpecifier: moduleSpecifier.text,
            namedImports,
            importedNames,
            typeOnlyNames,
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
    locallyExportedNames: Set<string>,
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

        const hasExportModifier =
            modifiers?.some(
                (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
            ) ?? false;

        declarations.push({
            name,
            kind,
            line: getLine(sourceFile, statement),
            isExported: hasExportModifier || locallyExportedNames.has(name),
            heritage,
        });
    }

    return declarations;
}

function extractConstructors(
    sourceFile: ts.SourceFile,
): ConstructorInfo[] {
    const constructors: ConstructorInfo[] = [];

    for (const statement of sourceFile.statements) {
        if (!ts.isClassDeclaration(statement) || !statement.name) {
            continue;
        }

        for (const member of statement.members) {
            if (!ts.isConstructorDeclaration(member)) {
                continue;
            }

            constructors.push({
                className: statement.name.text,
                line: getLine(sourceFile, member),
                parameters: member.parameters.map((parameter) => ({
                    name: parameter.name.getText(sourceFile),
                    type: parameter.type?.getText(sourceFile),
                })),
            });
        }
    }

    return constructors;
}

function extractExpression(
    expression: ts.Expression,
    sourceFile: ts.SourceFile,
): ExpressionInfo {
    if (ts.isNewExpression(expression)) {
        return {
            kind: "new",
            text: expression.getText(sourceFile),
            name: expression.expression.getText(sourceFile),
            arguments: (expression.arguments ?? []).map((argument) =>
                extractExpression(argument, sourceFile),
            ),
            line: getLine(sourceFile, expression),
        };
    }

    if (ts.isIdentifier(expression)) {
        return {
            kind: "identifier",
            text: expression.text,
            name: expression.text,
            line: getLine(sourceFile, expression),
        };
    }

    return {
        kind: "other",
        text: expression.getText(sourceFile),
        line: getLine(sourceFile, expression),
    };
}

function extractInstantiations(
    sourceFile: ts.SourceFile,
): ExpressionInfo[] {
    const instantiations: ExpressionInfo[] = [];

    function visit(node: ts.Node): void {
        if (ts.isNewExpression(node)) {
            instantiations.push(extractExpression(node, sourceFile));
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return instantiations;
}

function extractVariables(
    sourceFile: ts.SourceFile,
    locallyExportedNames: Set<string>,
): VariableInfo[] {
    const variables: VariableInfo[] = [];

    for (const statement of sourceFile.statements) {
        if (!ts.isVariableStatement(statement)) {
            continue;
        }

        const modifiers = ts.canHaveModifiers(statement)
            ? ts.getModifiers(statement)
            : undefined;

        const hasExportModifier =
            modifiers?.some(
                (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
            ) ?? false;

        for (const declaration of statement.declarationList.declarations) {
            if (!ts.isIdentifier(declaration.name)) {
                continue;
            }

            const name = declaration.name.text;

            variables.push({
                name,
                line: getLine(sourceFile, declaration),
                isExported:
                    hasExportModifier || locallyExportedNames.has(name),
                initializer: declaration.initializer
                    ? extractExpression(declaration.initializer, sourceFile)
                    : undefined,
            });
        }
    }

    return variables;
}

function getDeclarationName(statement: ts.Statement): string | undefined {
    if (
        ts.isClassDeclaration(statement) ||
        ts.isFunctionDeclaration(statement)
    ) {
        return statement.name?.text;
    }

    if (
        ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isEnumDeclaration(statement)
    ) {
        return statement.name.text;
    }

    return undefined;
}

function collectLocallyExportedNames(sourceFile: ts.SourceFile): Set<string> {
    const names = new Set<string>();

    for (const statement of sourceFile.statements) {
        if (
            !ts.isExportDeclaration(statement) ||
            statement.moduleSpecifier ||
            !statement.exportClause ||
            !ts.isNamedExports(statement.exportClause)
        ) {
            continue;
        }

        for (const element of statement.exportClause.elements) {
            names.add((element.propertyName ?? element.name).text);
        }
    }

    return names;
}

function extractExports(sourceFile: ts.SourceFile): ExportInfo[] {
    const exports: ExportInfo[] = [];

    for (const statement of sourceFile.statements) {
        if (ts.isExportDeclaration(statement)) {
            const moduleSpecifier =
                statement.moduleSpecifier &&
                ts.isStringLiteral(statement.moduleSpecifier)
                    ? statement.moduleSpecifier.text
                    : undefined;

            if (!statement.exportClause) {
                exports.push({
                    exportedName: "*",
                    moduleSpecifier,
                    isTypeOnly: statement.isTypeOnly,
                    isNamespace: true,
                });
                continue;
            }

            if (ts.isNamespaceExport(statement.exportClause)) {
                exports.push({
                    exportedName: statement.exportClause.name.text,
                    moduleSpecifier,
                    isTypeOnly: statement.isTypeOnly,
                    isNamespace: true,
                });
                continue;
            }

            for (const element of statement.exportClause.elements) {
                exports.push({
                    exportedName: element.name.text,
                    localName: (element.propertyName ?? element.name).text,
                    moduleSpecifier,
                    isTypeOnly: statement.isTypeOnly || element.isTypeOnly,
                    isNamespace: false,
                });
            }

            continue;
        }

        if (ts.isExportAssignment(statement)) {
            exports.push({
                exportedName: statement.isExportEquals ? "export=" : "default",
                isTypeOnly: false,
                isNamespace: false,
            });
            continue;
        }

        if (!ts.canHaveModifiers(statement)) {
            continue;
        }

        const modifiers = ts.getModifiers(statement);

        const hasExportModifier =
            modifiers?.some(
                (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
            ) ?? false;

        if (!hasExportModifier) {
            continue;
        }

        const hasDefaultModifier =
            modifiers?.some(
                (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
            ) ?? false;

        if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
                if (!ts.isIdentifier(declaration.name)) {
                    continue;
                }

                const name = declaration.name.text;

                exports.push({
                    exportedName: name,
                    localName: name,
                    isTypeOnly: false,
                    isNamespace: false,
                });
            }

            continue;
        }

        const name = getDeclarationName(statement);

        if (hasDefaultModifier) {
            exports.push({
                exportedName: "default",
                localName: name,
                isTypeOnly: false,
                isNamespace: false,
            });
            continue;
        }

        if (!name) {
            continue;
        }

        const isTypeOnly =
            ts.isInterfaceDeclaration(statement) ||
            ts.isTypeAliasDeclaration(statement);

        exports.push({
            exportedName: name,
            localName: name,
            isTypeOnly,
            isNamespace: false,
        });
    }

    return exports;
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

    const locallyExportedNames = collectLocallyExportedNames(sourceFile);

    return {
        filePath: file.relativePath,
        layer: file.layer,
        imports: extractImports(sourceFile),
        declarations: extractDeclarations(sourceFile, locallyExportedNames),
        constructors: extractConstructors(sourceFile),
        instantiations: extractInstantiations(sourceFile),
        variables: extractVariables(sourceFile, locallyExportedNames),
        exports: extractExports(sourceFile),
    };
}
