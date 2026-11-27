import * as ts from "typescript";

/**
 * TS6053: "File '{0}' not found." Ao carregar o tsconfig, esse erro costuma
 * indicar que o `extends` aponta para um pacote não instalado (ex.:
 * "expo/tsconfig.base"). Como a análise de camadas depende apenas de `paths` e
 * `baseUrl` locais, tratamos esse caso como aviso em vez de erro fatal.
 */
const MISSING_EXTENDS_FILE_CODE = 6053;

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

  if (!parsedConfig) {
    throw new Error(
      `Falha ao carregar a configuração TypeScript:\n${formatDiagnostics(errors, configHost)}`,
    );
  }

  const fatalErrors = errors.filter(
    (diagnostic) => diagnostic.code !== MISSING_EXTENDS_FILE_CODE,
  );

  if (fatalErrors.length > 0) {
    throw new Error(
      `Falha ao carregar a configuração TypeScript:\n${formatDiagnostics(fatalErrors, configHost)}`,
    );
  }

  if (errors.length > 0) {
    process.stderr.write(
      `Aviso: alguns arquivos estendidos pelo tsconfig não foram encontrados; ` +
        `a análise continuará com as opções locais.\n${formatDiagnostics(errors, configHost)}`,
    );
  }

  return parsedConfig;
}

function formatDiagnostics(
  diagnostics: ts.Diagnostic[],
  configHost: Pick<
    ts.ParseConfigFileHost,
    "getCurrentDirectory"
  >,
): string {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCurrentDirectory: configHost.getCurrentDirectory,
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => ts.sys.newLine,
  });
}
