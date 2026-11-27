// src/core/types.ts

export type ArchitectureLayer =
  | "view"
  | "viewmodel"
  | "usecase"
  | "model"
  | "infra"
  | "di"
  | "routes"
  | "unknown";

export interface ProjectFile {
  absolutePath: string;
  relativePath: string;
  extension: string;
  layer: ArchitectureLayer;
}

export interface ProjectScanResult {
  rootPath: string;
  files: ProjectFile[];
  directories: string[];
  detectedLayers: ArchitectureLayer[];
}

export type ViolationSeverity = "error" | "warning" | "info";

export interface ArchitectureViolation {
  ruleId: string;
  severity: ViolationSeverity;
  message: string;
  filePath: string;
  line?: number;
  suggestion?: string;
}