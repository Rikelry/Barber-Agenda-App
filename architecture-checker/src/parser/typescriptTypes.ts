// src/parser/typescriptTypes.ts

import type { ArchitectureLayer } from "../core/types.js";

export type ImportResolutionStatus =
  | "internal"
  | "external"
  | "asset"
  | "unresolved";

export interface ImportInfo {
  moduleSpecifier: string;
  namedImports: string[];
  importedNames?: string[];
  typeOnlyNames?: string[];
  valueReferences?: string[];
  typeReferences?: string[];
  defaultImport?: string;
  namespaceImport?: string;
  isTypeOnly: boolean;
  line: number;

  resolvedFilePath?: string;
  resolutionStatus?: ImportResolutionStatus;
}

export interface ExportInfo {
  exportedName: string;
  localName?: string;
  moduleSpecifier?: string;
  isTypeOnly: boolean;
  isNamespace: boolean;
}

export interface DeclarationInfo {
  name: string;
  kind: "interface" | "class" | "function" | "type" | "enum";
  line: number;
  isExported: boolean;
  heritage: string[];
  scopePath?: string[];
}

export interface ParsedFile {
  filePath: string;
  layer: ArchitectureLayer;
  imports: ImportInfo[];
  declarations: DeclarationInfo[];
  constructors: ConstructorInfo[];
  instantiations: ExpressionInfo[];
  variables: VariableInfo[];
  exports: ExportInfo[];
}

export interface ConstructorParameterInfo {
  name: string;
  type?: string;
}

export interface ConstructorInfo {
  className: string;
  line: number;
  parameters: ConstructorParameterInfo[];
}

export interface ExpressionInfo {
  kind: "new" | "identifier" | "other";
  text: string;
  name?: string;
  arguments?: ExpressionInfo[];
  line: number;
}

export interface VariableInfo {
  name: string;
  line: number;
  isExported: boolean;
  initializer?: ExpressionInfo;
}
