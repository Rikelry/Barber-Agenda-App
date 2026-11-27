#!/usr/bin/env node

import * as ts from "typescript";

import { scanProject } from "../scanner/projectScanner.js";
import { extractProjectAst } from "../parser/astExtractor.js";
import { buildProjectModel } from "../analyzer/projectModelBuilder.js";
import { loadProjectTypeScriptConfig } from "../analyzer/projectConfigLoader.js";
import { resolveProjectImports } from "../analyzer/importResolver.js";
import { validateHeuristics } from "../analyzer/heuristicRules.js";
import { validateLayerDependencies } from "../analyzer/layerDependencyRules.js";
import { validateDIComposition } from "../analyzer/diCompositionRules.js";
import {
    SEVERITY_ORDER,
    computeExitCode,
    countBySeverity,
    countFilesByLayer,
    buildJsonReport,
    groupViolationsBySeverity,
} from "./report.js";

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");

function log(...values: unknown[]): void {
    if (!jsonMode) {
        console.log(...values);
    }
}

function showHelp(): void {
    console.log(`
Architecture Checker

Uso:
  architecture-checker <caminho-do-projeto>

Opções:
  --help       Exibe esta ajuda
  --version    Exibe a versão
  --json       Emite o relatório em JSON

Exemplo:
  architecture-checker ../meu-app [--json]
`);
}

async function main(): Promise<void> {
    if (args.includes("--help") || args.length === 0) {
        showHelp();
        return;
    }

    if (args.includes("--version")) {
        console.log("Architecture Checker v1.0.0");
        return;
    }

    const projectPath = args.find((arg) => !arg.startsWith("--"));

    if (!projectPath || projectPath.startsWith("--")) {
        console.error("Informe o caminho do projeto.");
        process.exitCode = 1;
        return;
    }

    try {
        log("\nArchitecture Checker");
        log("Iniciando varredura...\n");

        const scanResult = await scanProject(projectPath);

        log("\nCarregando configuração TypeScript...");

        const projectConfig = loadProjectTypeScriptConfig(
            scanResult.rootPath,
        );

        log("Configuração TypeScript carregada com sucesso.");
        log(
            "Resolução de módulos:",
            ts.ModuleResolutionKind[projectConfig.options.moduleResolution ?? ts.ModuleResolutionKind.Node10],
        );

        log("Arquivos encontrados:", scanResult.files.length);
        log("Diretórios encontrados:", scanResult.directories.length);

        log("\nCamadas identificadas:");

        for (const layer of scanResult.detectedLayers) {
            log(`- ${layer}`);
        }

        log("\nAnalisando código TypeScript...");

        const parsedFiles = await extractProjectAst(scanResult.files);

        log("\nConstruindo Project Model...");

        const initialProjectModel = buildProjectModel(
            scanResult,
            parsedFiles,
        );

        log("\nResolvendo imports...");

        const resolvedProjectModel = resolveProjectImports(
            initialProjectModel,
            projectConfig.options,
        );

        const layerValidatedProject = validateLayerDependencies(
            resolvedProjectModel,
        );

        const diValidatedProject = validateDIComposition(
            layerValidatedProject,
        );
        const projectModel = {
            ...diValidatedProject,
            violations: [
                ...diValidatedProject.violations,
                ...validateHeuristics(diValidatedProject),
            ],
        };

        log("\nResultado da análise:");

        log("Arquivos no modelo:", projectModel.statistics.totalFiles);
        log("Imports registrados:", projectModel.statistics.totalImports);
        log(
            "Declarações registradas:",
            projectModel.statistics.totalDeclarations,
        );

        const filesByLayer = countFilesByLayer(projectModel.files);

        log("\nArquivos por camada:");

        for (const layer of projectModel.detectedLayers) {
            log(`- ${layer}: ${filesByLayer[layer]}`);
        }

        const resolutionStats = projectModel.files.reduce(
            (stats, file) => {
                for (const importInfo of file.imports) {
                    switch (importInfo.resolutionStatus) {
                        case "internal":
                            stats.internal++;
                            break;
                        case "external":
                            stats.external++;
                            break;
                        case "asset":
                            stats.assets++;
                            break;
                        case "unresolved":
                            stats.unresolved++;
                            break;
                    }
                }

                return stats;
            },
            {
                internal: 0,
                external: 0,
                assets: 0,
                unresolved: 0,
            },
        );

        log("\nResultado da resolução de imports:");
        log("Internos:", resolutionStats.internal);
        log("Externos:", resolutionStats.external);
        log("Recursos:", resolutionStats.assets);
        log("Não resolvidos:", resolutionStats.unresolved);

        log("\nExemplos de imports não resolvidos:");

        let unresolvedCount = 0;

        for (const file of projectModel.files) {
            for (const importInfo of file.imports) {
                if (importInfo.resolutionStatus === "unresolved") {
                    log(
                        `${file.relativePath} -> ${importInfo.moduleSpecifier} (linha ${importInfo.line})`,
                    );

                    unresolvedCount++;

                    if (unresolvedCount >= 20) {
                        break;
                    }
                }
            }

            if (unresolvedCount >= 20) {
                break;
            }
        }

        const violationCounts = countBySeverity(projectModel.violations);
        const violationsBySeverity = groupViolationsBySeverity(
            projectModel.violations,
        );

        log("\nResultado das regras arquiteturais:");
        log("Total:", violationCounts.total);
        log("Erros:", violationCounts.errors);
        log("Warnings:", violationCounts.warnings);
        log("Informações:", violationCounts.infos);

        for (const severity of SEVERITY_ORDER) {
            const violations = violationsBySeverity[severity];

            if (violations.length === 0) {
                continue;
            }

            log(`\n${severity.toUpperCase()} (${violations.length}):`);

            for (const violation of violations) {
                log(`- ${violation.ruleId}`);
                log(`  Arquivo: ${violation.filePath}`);
                log(`  Linha: ${violation.line ?? "Não identificada"}`);
                log(`  Descrição: ${violation.message}`);

                if (violation.suggestion) {
                    log(`  Sugestão: ${violation.suggestion}`);
                }
            }
        }

        process.exitCode = computeExitCode(projectModel.violations);
        if (jsonMode) {
            console.log(JSON.stringify(buildJsonReport(projectModel), null, 2));
            return;
        }

        log(`\nCódigo de saída: ${process.exitCode}`);
        log("\nProject Model construído com sucesso.");
    } catch (error) {
        console.error("\nErro completo durante a análise:");
        console.error(error);
        process.exitCode = 1;
    }
}

main();
