#!/usr/bin/env node

import * as ts from "typescript";

import { scanProject } from "../scanner/projectScanner.js";
import { extractProjectAst } from "../parser/astExtractor.js";
import { buildProjectModel } from "../analyzer/projectModelBuilder.js";
import { loadProjectTypeScriptConfig } from "../analyzer/projectConfigLoader.js";
import { resolveProjectImports } from "../analyzer/importResolver.js";
import { validateLayerDependencies } from "../analyzer/layerDependencyRules.js";
import { validateDIComposition } from "../analyzer/diCompositionRules.js";

const args = process.argv.slice(2);

function showHelp(): void {
    console.log(`
Architecture Checker

Uso:
  architecture-checker <caminho-do-projeto>

Opções:
  --help       Exibe esta ajuda
  --version    Exibe a versão

Exemplo:
  architecture-checker ../meu-app
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

    const projectPath = args[0];

    if (!projectPath || projectPath.startsWith("--")) {
        console.error("Informe o caminho do projeto.");
        process.exitCode = 1;
        return;
    }

    try {
        console.log("\nArchitecture Checker");
        console.log("Iniciando varredura...\n");

        const scanResult = await scanProject(projectPath);

        console.log("\nCarregando configuração TypeScript...");

        const projectConfig = loadProjectTypeScriptConfig(
            scanResult.rootPath,
        );

        console.log("Configuração TypeScript carregada com sucesso.");
        console.log(
            "Resolução de módulos:",
            ts.ModuleResolutionKind[projectConfig.options.moduleResolution ?? ts.ModuleResolutionKind.Node10],
        );

        console.log("Arquivos encontrados:", scanResult.files.length);
        console.log("Diretórios encontrados:", scanResult.directories.length);

        console.log("\nCamadas identificadas:");

        for (const layer of scanResult.detectedLayers) {
            console.log(`- ${layer}`);
        }

        console.log("\nAnalisando código TypeScript...");

        const parsedFiles = await extractProjectAst(scanResult.files);

        console.log("\nConstruindo Project Model...");

        const initialProjectModel = buildProjectModel(
            scanResult,
            parsedFiles,
        );

        console.log("\nResolvendo imports...");

        const resolvedProjectModel = resolveProjectImports(
            initialProjectModel,
            projectConfig.options,
        );

        const layerValidatedProject = validateLayerDependencies(
            resolvedProjectModel,
        );

        const projectModel = validateDIComposition(
            layerValidatedProject,
        );

        console.log("\nResultado da análise:");

        console.log("Arquivos no modelo:", projectModel.statistics.totalFiles);
        console.log("Imports registrados:", projectModel.statistics.totalImports);
        console.log(
            "Declarações registradas:",
            projectModel.statistics.totalDeclarations,
        );

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

        console.log("\nResultado da resolução de imports:");
        console.log("Internos:", resolutionStats.internal);
        console.log("Externos:", resolutionStats.external);
        console.log("Recursos:", resolutionStats.assets);
        console.log("Não resolvidos:", resolutionStats.unresolved);

        console.log("\nExemplos de imports não resolvidos:");

        let unresolvedCount = 0;

        for (const file of projectModel.files) {
            for (const importInfo of file.imports) {
                if (importInfo.resolutionStatus === "unresolved") {
                    console.log(
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

        console.log("\nResultado das regras arquiteturais:");

        console.log(
            "Violações encontradas:",
            projectModel.violations.length,
        );

        for (const violation of projectModel.violations) {
            console.log(
                `[${violation.severity.toUpperCase()}] ${violation.ruleId}`,
            );

            console.log(`Arquivo: ${violation.filePath}`);
            console.log(`Linha: ${violation.line ?? "Não identificada"}`);
            console.log(`Descrição: ${violation.message}`);
            console.log(`Sugestão: ${violation.suggestion}`);
            console.log("");
        }

        console.log("\nCamadas disponíveis no modelo:");

        for (const layer of projectModel.detectedLayers) {
            console.log(`- ${layer}`);
        }

        console.log("\nProject Model construído com sucesso.");
    } catch (error) {
        console.error("\nErro completo durante a análise:");
        console.error(error);
        process.exitCode = 1;
    }
}

main();
