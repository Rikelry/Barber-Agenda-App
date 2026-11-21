import * as ts from "typescript";

export function loadProjectTypeScriptConfig(
  projectRoot: string,
): ts.ParsedCommandLine {
  const configPath = ts.findConfigFile(
    projectRoot,
    ts.sys.fileExists,
    "tsconfig.json",
  );

  if (!configPath) {
    throw new Error(
      `Não foi encontrado tsconfig.json em: ${projectRoot}`,
    );
  }

  const configDiagnostics: ts.Diagnostic[] = [];

  const configHost: ts.ParseConfigFileHost = {
    ...ts.sys,

    // A resolução deve considerar a raiz do projeto analisado.
    getCurrentDirectory: () => projectRoot,

    onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
      configDiagnostics.push(diagnostic);
    },
  };

  const parsedConfig = ts.getParsedCommandLineOfConfigFile(
    configPath,
    {},
    configHost,
  );

  const diagnostics = [
    ...configDiagnostics,
    ...(parsedConfig?.errors ?? []),
  ];

  const errors = diagnostics.filter(
    (diagnostic) =>
      diagnostic.category === ts.DiagnosticCategory.Error,
  );

  if (!parsedConfig || errors.length > 0) {
    const message = ts.formatDiagnosticsWithColorAndContext(
      errors,
      {
        getCurrentDirectory: configHost.getCurrentDirectory,
        getCanonicalFileName: (fileName) => fileName,
        getNewLine: () => ts.sys.newLine,
      },
    );

    throw new Error(
      `Falha ao carregar a configuração TypeScript:\n${message}`,
    );
  }

  return parsedConfig;
}
