#!/usr/bin/env node
/**
 * check-arquitetura.mjs — verificador de arquitetura do Barber Agenda.
 *
 * Node puro, sem dependências. Uma verificação para cada regra de estrutura,
 * de ouro e de importação do harness (AGENTS.md e docs/harness/).
 *
 * Uso:
 *   node scripts/check-arquitetura.mjs           # varre o projeto; exit 1 se houver erro
 *   node scripts/check-arquitetura.mjs --hook     # lê JSON do stdin, confere só o arquivo editado
 *   node scripts/check-arquitetura.mjs --stop     # varre tudo + npx tsc --noEmit
 *
 * Se um erro de arquitetura existir: sai com 1 (modo padrão) ou 2 (--hook/--stop).
 * Sem erros: imprime "Arquitetura OK" e sai com 0.
 *
 * Nunca edite este verificador, o AGENTS.md ou o design system para esconder um erro.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, sep, extname, basename, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const srcDir = join(root, "src");

const ALLOWED_SRC_DIRS = ["app", "view", "viewmodel", "usecase", "model", "infra", "di"];
const DATA_LIBS = ["@/infra", "async-storage", "firebase", "axios", "supabase"];
const TEST_FILE = /(\.(test|spec)\.(t|j)sx?$)|(__tests__[\\/])/;
const CAMEL_DIRS = ["view/components/", "usecase/", "model/", "infra/", "di/"];
const USECASE_NAME = /^(?:i[A-Z][A-Za-z0-9]*|[a-z][A-Za-z0-9]*)UseCases$/;

const errors = [];
const add = (rule, file, line, problem, fix, doc) =>
  errors.push({ rule, file, line: line || 1, problem, fix, doc });

/* ------------------------------- utilidades ------------------------------- */

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const relOf = (abs) => relative(root, abs).split(sep).join("/");

const cache = new Map();
function contentOf(abs) {
  if (!cache.has(abs)) {
    try {
      cache.set(abs, readFileSync(abs, "utf8"));
    } catch {
      cache.set(abs, "");
    }
  }
  return cache.get(abs);
}

const lineOf = (content, index) => content.slice(0, index).split("\n").length;

function eachMatch(content, re) {
  const out = [];
  const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
  let m;
  while ((m = r.exec(content)) !== null) {
    out.push({ m, index: m.index, line: lineOf(content, m.index) });
    if (m.index === r.lastIndex) r.lastIndex++;
  }
  return out;
}

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const srcFiles = () =>
  existsSync(srcDir) ? walk(srcDir).filter((f) => /\.(t|j)sx?$/.test(f) && !/\.d\.ts$/.test(f)) : [];

/* --------------------------------- regras --------------------------------- */

function applyGlobalRules(abs) {
  const content = contentOf(abs);
  const rel = relOf(abs);
  const isTsx = extname(abs) === ".tsx";

  // IMP-01 — imports relativos
  for (const { m, line } of eachMatch(content, /from\s+['"](\.[^'"]*)['"]/g)) {
    add("IMP-01", rel, line, `Import relativo "${m[1]}".`, 'Use o alias "@/..." em vez de "./" ou "../".', "docs/harness/02-convencoes-de-codigo.md");
  }
  for (const { m, line } of eachMatch(content, /(?:require|import)\s*\(\s*['"](\.[^'"]*)['"]/g)) {
    add("IMP-01", rel, line, `Import relativo "${m[1]}".`, 'Use o alias "@/..." em vez de "./" ou "../".', "docs/harness/02-convencoes-de-codigo.md");
  }

  // TS-01 — any
  for (const { m, line } of eachMatch(content, /(:\s*any\b|\bas\s+any\b|<any>|any\[\])/g)) {
    add("TS-01", rel, line, `Uso de "any" ("${m[0].trim()}").`, "Tipar corretamente; use unknown quando necessário.", "docs/harness/02-convencoes-de-codigo.md");
  }

  // TS-02 — React.FC
  for (const { line } of eachMatch(content, /React\.FC\b/g)) {
    add("TS-02", rel, line, "Uso de React.FC.", "Tipar as props com um type e anotar a função diretamente.", "docs/harness/02-convencoes-de-codigo.md");
  }

  // TS-03 — export default function
  for (const { line } of eachMatch(content, /export\s+default\s+function\b/g)) {
    add("TS-03", rel, line, "Uso de export default function.", "Componentes/hooks como função nomeada; a rota fina usa export default <Tela>.", "docs/harness/02-convencoes-de-codigo.md");
  }

  // TS-04 — interface em props (.tsx)
  if (isTsx) {
    for (const { m, line } of eachMatch(content, /interface\s+\w*Props\b/g)) {
      add("TS-04", rel, line, `Interface de props ("${m[0]}").`, "Use type para props em .tsx.", "docs/harness/02-convencoes-de-codigo.md");
    }
    // TS-05 — function para componente
    for (const { m, line } of eachMatch(content, /(?:\n|^)\s*(?:export\s+)?function\s+([A-Z]\w*)\s*\(/g)) {
      add("TS-05", rel, line, `Componente "${m[1]}" declarado com "function".`, "Declare o componente como const (ex.: const Nome = () => {...}).", "docs/harness/02-convencoes-de-codigo.md");
    }
  }

  // TERM-01 — termos proibidos
  for (const { m, line } of eachMatch(content, /\b(Repository|Connector)\b/g)) {
    add("TERM-01", rel, line, `Termo proibido "${m[0]}".`, "Use Entidade, DataSource, Service ou Use Case.", "docs/harness/02-convencoes-de-codigo.md");
  }
}

function applyAppRules(files) {
  const appPrefix = join(srcDir, "app") + sep;
  for (const abs of files) {
    if (!abs.startsWith(appPrefix)) continue;
    if (/^_layout\.(t|j)sx?$/.test(basename(abs))) continue;

    const rel = relOf(abs);
    const routeName = rel.replace(/^src\/app\//, "").replace(/\.(t|j)sx?$/, "");
    const content = contentOf(abs);

    const importRe = new RegExp(`import\\s+([A-Za-z_$][\\w$]*)\\s+from\\s+['"]@/view/${escRe(routeName)}['"]`);
    const im = content.match(importRe);
    if (!im) {
      add("APP-01", rel, 1, `Rota não importa a tela espelhada "@/view/${routeName}" com import padrão.`, `A rota fina deve conter: import X from "@/view/${routeName}"; export default X;`, "docs/harness/01-arquitetura-mvvm.md");
    } else if (!new RegExp(`export\\s+default\\s+${escRe(im[1])}\\s*;?`).test(content)) {
      add("APP-01", rel, 1, `Rota importa a tela mas não faz "export default ${im[1]};".`, `Adicione "export default ${im[1]};".`, "docs/harness/01-arquitetura-mvvm.md");
    }

    if (im) {
      const extra = content
        .split("\n")
        .map((l) => l.replace(/\/\/.*$/, "").trim())
        .filter((l) => l && !l.startsWith("/*") && !l.startsWith("*") && !l.startsWith("//"))
        .filter((l) => !/^import\s/.test(l) && !/^export\s+default\s/.test(l));
      if (extra.length > 0) {
        add("APP-01", rel, 1, "Rota fina contém código além do import da tela e do export default.", "Mova a lógica para src/view/ (tela) ou para a ViewModel.", "docs/harness/01-arquitetura-mvvm.md");
      }
    }

    if (!existsSync(join(srcDir, "view", routeName + ".tsx")) && !existsSync(join(srcDir, "view", routeName + ".ts"))) {
      add("APP-02", rel, 1, `Não existe a tela espelhada "src/view/${routeName}.tsx".`, `Crie src/view/${routeName}.tsx espelhando a rota 1:1.`, "docs/harness/01-arquitetura-mvvm.md");
    }
  }
}

function applyViewRules(files) {
  const viewPrefix = join(srcDir, "view") + sep;
  const viewFiles = files.filter((f) => f.startsWith(viewPrefix));
  for (const abs of viewFiles) {
    const content = contentOf(abs);
    const rel = relOf(abs);

    // VIEW-01 — View sem expo-router / try-catch / fetch / libs de dados
    for (const { line } of eachMatch(content, /from\s+['"]expo-router['"]/g)) {
      add("VIEW-01", rel, line, "A View importa 'expo-router'.", "Toda navegação deve ficar na ViewModel.", "docs/harness/01-arquitetura-mvvm.md");
    }
    for (const { line } of eachMatch(content, /\btry\s*\{|\bcatch\s*\(/g)) {
      add("VIEW-01", rel, line, "A View usa try/catch.", "Trate erros na ViewModel/Use Case; a View só renderiza.", "docs/harness/01-arquitetura-mvvm.md");
    }
    for (const { line } of eachMatch(content, /\bfetch\s*\(/g)) {
      add("VIEW-01", rel, line, "A View usa fetch().", "Faça o acesso a dados na infra e exponha via Use Case/ViewModel.", "docs/harness/01-arquitetura-mvvm.md");
    }
    for (const { m, line } of eachMatch(content, /from\s+['"]([^'"]+)['"]/g)) {
      if (DATA_LIBS.some((d) => m[1].startsWith(d))) {
        add("VIEW-01", rel, line, `A View importa "${m[1]}" (infra/biblioteca de dados).`, "Mova o acesso a dados para a infra e exponha via ViewModel.", "docs/harness/01-arquitetura-mvvm.md");
      }
    }
  }

  for (const abs of viewFiles) {
    const rel = relOf(abs);
    const relFromView = rel.replace(/^src\/view\//, "");
    const content = contentOf(abs);

    // subpastas (components/)
    if (relFromView.includes("/")) {
      if (!relFromView.startsWith("components/")) continue;

      // CMP-01 — export nomeado e sem ViewModel
      if (/export\s+default\b/.test(content)) {
        add("CMP-01", rel, 1, "Componente em view/components/ usa export default.", "Use export nomeado (ex.: export const Button = () => {...}).", "docs/harness/02-convencoes-de-codigo.md");
      }
      // Arquivos só de tipos (X.types.ts) e barris (index.ts com export *) também exportam por nome.
      if (!/export\s+(const|function|class|type|interface)\s+[A-Za-z_$]/.test(content) && !/export\s*(\{|\*)/.test(content)) {
        add("CMP-01", rel, 1, "Componente em view/components/ não tem export nomeado.", "Exporte o componente por nome.", "docs/harness/02-convencoes-de-codigo.md");
      }
      if (/@\/viewmodel/.test(content) || /use\w+ViewModel\s*\(/.test(content)) {
        add("CMP-01", rel, 1, "Componente em view/components/ usa uma ViewModel.", "Componentes visuais recebem dados por props; a ViewModel fica na tela.", "docs/harness/04-views-e-design-system.md");
      }
      continue;
    }

    if (relFromView === "theme.ts") continue;

    // VIEW-02 — View usando uma ViewModel
    if (!/const\s*\[\s*\w+\s*,\s*\w+\s*\]\s*=\s*use\w+ViewModel\s*\(/.test(content)) {
      add("VIEW-02", rel, 1, "A View não usa uma ViewModel (const [state, actions] = useXViewModel()).", "Consuma a ViewModel da tela: const [state, actions] = useXViewModel().", "docs/harness/01-arquitetura-mvvm.md");
    }

    // APP-02 — espelho view -> app
    const routeName = relFromView.replace(/\.(t|j)sx?$/, "");
    if (!existsSync(join(srcDir, "app", routeName + ".tsx")) && !existsSync(join(srcDir, "app", routeName + ".ts"))) {
      add("APP-02", rel, 1, `Não existe a rota espelhada "src/app/${routeName}.tsx".`, "Crie src/app/<rota>.tsx com a rota fina espelhando a tela.", "docs/harness/01-arquitetura-mvvm.md");
    }
  }

  // STYLE-01 — cor literal / número solto fora do theme.ts
  for (const abs of viewFiles) {
    const rel = relOf(abs);
    if (rel === "src/view/theme.ts") continue;
    const content = contentOf(abs);
    for (const { m, line } of eachMatch(content, /#[0-9a-fA-F]{3,8}\b/g)) {
      add("STYLE-01", rel, line, `Cor literal "${m[0]}" fora do theme.`, "Use tokens de cor do src/view/theme.ts.", "docs/harness/04-views-e-design-system.md");
    }
    for (const { line } of eachMatch(content, /\brgba?\s*\(/g)) {
      add("STYLE-01", rel, line, "Cor literal rgb()/rgba() fora do theme.", "Use tokens de cor do src/view/theme.ts.", "docs/harness/04-views-e-design-system.md");
    }
    for (const { index, line } of eachMatch(content, /\b(?:padding|margin|gap|rowGap|columnGap|borderRadius|fontSize)(?:Top|Bottom|Left|Right|Horizontal|Vertical)?\s*:\s*\d/g)) {
      const label = (content.slice(index).match(/^([A-Za-z]+)\s*:\s*(-?\d+(?:\.\d+)?)/) || []);
      const detalhe = label[1] ? `"${label[1]}" = ${label[2]}` : `"${content.slice(index).split(/[,\n}]/)[0].trim()}"`;
      add("STYLE-01", rel, line, `Número solto: ${detalhe} (propriedade "${label[1] ?? ""}").`, "Use tokens de espaçamento/raio/tipografia do theme.ts.", "docs/harness/04-views-e-design-system.md");
    }
  }
}

function applyViewModelRules(files) {
  const prefix = join(srcDir, "viewmodel") + sep;
  for (const abs of files.filter((f) => f.startsWith(prefix))) {
    const rel = relOf(abs);
    const base = basename(abs).replace(/\.(t|j)sx?$/, "");
    const m = base.match(/^use([A-Z]\w*)ViewModel$/);
    if (!m) {
      add("VM-01", rel, 1, `Nome de arquivo de ViewModel inválido ("${base}").`, "Use useXViewModel.ts, onde X é o nome da tela (ex.: useLoginViewModel.ts).", "docs/harness/01-arquitetura-mvvm.md");
      continue;
    }
    const X = m[1];
    const content = contentOf(abs);
    if (!new RegExp(`export\\s+type\\s+${X}State\\b`).test(content)) {
      add("VM-01", rel, 1, `Falta "export type ${X}State".`, `Declare export type ${X}State = {...}.`, "docs/harness/01-arquitetura-mvvm.md");
    }
    if (!new RegExp(`export\\s+type\\s+${X}Actions\\b`).test(content)) {
      add("VM-01", rel, 1, `Falta "export type ${X}Actions".`, `Declare export type ${X}Actions = {...}.`, "docs/harness/01-arquitetura-mvvm.md");
    }
    if (!new RegExp(`\\)\\s*:\\s*\\[\\s*${X}State\\s*,\\s*${X}Actions\\s*\\]`).test(content)) {
      add("VM-01", rel, 1, `A ViewModel não retorna a tupla [${X}State, ${X}Actions].`, `Anote o retorno como : [${X}State, ${X}Actions].`, "docs/harness/01-arquitetura-mvvm.md");
    }
  }
}

function applyUseCaseRules(files) {
  const prefix = join(srcDir, "usecase") + sep;
  for (const abs of files.filter((f) => f.startsWith(prefix))) {
    const rel = relOf(abs);
    const base = basename(abs).replace(/\.(t|j)sx?$/, "");
    const content = contentOf(abs);
    // Contrato (iXUseCases.ts) declara a interface; só a classe (xUseCases.ts) exige implements.
    const isContract = /^i[A-Z]/.test(base);
    for (const { m, line } of eachMatch(content, /from\s+['"]([^'"]+)['"]/g)) {
      // Além do domínio, a classe pode importar o próprio contrato (@/usecase/iXUseCases).
      if (!m[1].startsWith("@/model") && !/^@\/usecase\/i[A-Z]\w*UseCases$/.test(m[1])) {
        add("UC-01", rel, line, `Use Case importa "${m[1]}" (só pode importar @/model ou um contrato @/usecase/iXUseCases).`, "Mova a dependência para o domínio (model) e injete pelo construtor.", "docs/harness/01-arquitetura-mvvm.md");
      }
    }
    if (isContract) {
      if (!/export\s+interface\s+I[A-Z]\w*/.test(content)) {
        add("UC-01", rel, 1, "Contrato de Use Case não declara a interface.", 'Declare "export interface IXUseCases {...}".', "docs/harness/01-arquitetura-mvvm.md");
      }
    } else if (!/implements\s+I\w+/.test(content)) {
      add("UC-01", rel, 1, "Use Case não usa implements de um contrato.", "Implemente o contrato: class X implements IXUseCases.", "docs/harness/01-arquitetura-mvvm.md");
    }
    for (const { m, line } of eachMatch(content, /new\s+\w*(?:Service|DataSource)\s*\(/g)) {
      add("UC-01", rel, line, `Use Case instancia "${m[0].trim()}" diretamente.`, "Receba o contrato pelo construtor; o container conecta a infra.", "docs/harness/01-arquitetura-mvvm.md");
    }
  }
}

function applyModelRules(files) {
  const prefix = join(srcDir, "model") + sep;
  for (const abs of files.filter((f) => f.startsWith(prefix))) {
    const rel = relOf(abs);
    const content = contentOf(abs);
    for (const { m, line } of eachMatch(content, /from\s+['"]([^'"]+)['"]/g)) {
      if (!m[1].startsWith("@/model")) {
        add("MODEL-01", rel, line, `Model importa "${m[1]}" (só pode importar @/model).`, "Mantenha o domínio puro: sem React, Expo ou infraestrutura.", "docs/harness/01-arquitetura-mvvm.md");
      }
    }
  }
}

function applyInfraRules(files) {
  const prefix = join(srcDir, "infra") + sep;
  const forbidden = ["@/usecase", "@/viewmodel", "@/view", "@/di"];
  for (const abs of files.filter((f) => f.startsWith(prefix))) {
    const rel = relOf(abs);
    const content = contentOf(abs);
    for (const { m, line } of eachMatch(content, /from\s+['"]([^'"]+)['"]/g)) {
      if (forbidden.some((f) => m[1].startsWith(f))) {
        add("INFRA-01", rel, line, `Infra importa "${m[1]}".`, "A infra implementa contratos do model e não importa camadas superiores.", "docs/harness/01-arquitetura-mvvm.md");
      }
    }
  }
}

function applyDiRules(files) {
  for (const abs of files) {
    const rel = relOf(abs);
    if (rel === "src/di/container.ts" || TEST_FILE.test(rel)) continue;
    const content = contentOf(abs);
    for (const { m, line } of eachMatch(content, /from\s+['"](@\/infra[^'"]*)['"]/g)) {
      add("DI-01", rel, line, `Importa "${m[1]}" fora do container.`, "Só src/di/container.ts (e os testes) pode importar @/infra.", "docs/harness/01-arquitetura-mvvm.md");
    }
  }
}

function applyNamingRules(files) {
  for (const abs of files) {
    const rel = relOf(abs);
    if (!rel.startsWith("src/")) continue;
    const relInSrc = rel.replace(/^src\//, "");
    const base = basename(abs).replace(/\.(t|j)sx?$/, "");

    // USECASE-LUGAR — arquivo com "UseCase"/"UseCases" no nome fora de src/usecase/
    if (/UseCases?/.test(base) && !relInSrc.startsWith("usecase/")) {
      add("USECASE-LUGAR", rel, 1, `Arquivo "${base}" contém "UseCase(s)" fora de src/usecase/.`, "Contratos e implementações de Use Case ficam em src/usecase/; em model/ só entram entities, datasources, services e errors.", "docs/harness/02-convencoes-de-codigo.md");
    }

    // USECASE-NOME — nome em src/usecase/ deve ser iXUseCases.ts ou xUseCases.ts
    if (relInSrc.startsWith("usecase/") && !USECASE_NAME.test(base)) {
      add("USECASE-NOME", rel, 1, `Nome de arquivo "${base}" fora do padrão.`, "Use iXUseCases.ts (contrato) ou xUseCases.ts (implementação), no plural e em camelCase.", "docs/harness/02-convencoes-de-codigo.md");
    }

    // NOME-CAMELCASE — sem hífen nem underline nas camadas de código
    if (CAMEL_DIRS.some((d) => relInSrc.startsWith(d)) && /[-_]/.test(base)) {
      add("NOME-CAMELCASE", rel, 1, `Arquivo "${base}" usa hífen ou underline.`, "Use camelCase, sem hífen nem underline (ex.: textField.tsx, authSession.ts).", "docs/harness/02-convencoes-de-codigo.md");
    }
  }
}

function applyStructureRule() {
  if (!existsSync(srcDir)) return;
  for (const e of readdirSync(srcDir, { withFileTypes: true })) {
    if (e.isDirectory() && !ALLOWED_SRC_DIRS.includes(e.name)) {
      add("STR-01", `src/${e.name}`, 1, `Pasta "src/${e.name}/" não é permitida em src/.`, `Use apenas: ${ALLOWED_SRC_DIRS.join(", ")}.`, "docs/harness/01-arquitetura-mvvm.md");
    }
  }
}

function analyze() {
  errors.length = 0;
  const files = srcFiles();
  for (const abs of files) applyGlobalRules(abs);
  applyAppRules(files);
  applyViewRules(files);
  applyViewModelRules(files);
  applyUseCaseRules(files);
  applyModelRules(files);
  applyInfraRules(files);
  applyDiRules(files);
  applyNamingRules(files);
  applyStructureRule();
  errors.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
  return errors.slice();
}

function format(list) {
  return list
    .map((e) => `[${e.rule}] ${e.file}:${e.line}\n  Problema: ${e.problem}\n  Corrigir: ${e.fix}\n  Ref: ${e.doc}`)
    .join("\n\n");
}

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

/* ---------------------------------- main ---------------------------------- */

const args = process.argv.slice(2);

if (args.includes("--hook")) {
  let filePath = "";
  try {
    filePath = JSON.parse(readStdin())?.tool_input?.file_path ?? "";
  } catch {
    filePath = "";
  }
  if (!filePath) process.exit(0);
  const abs = isAbsolute(filePath) ? filePath : join(process.cwd(), filePath);
  const rel = relOf(abs);
  const errs = analyze().filter((e) => e.file === rel);
  if (errs.length) {
    process.stderr.write(format(errs) + "\n");
    process.exit(2);
  }
  process.exit(0);
}

if (args.includes("--stop")) {
  let input = {};
  try {
    input = JSON.parse(readStdin()) || {};
  } catch {
    input = {};
  }
  if (input.stop_hook_active === true) process.exit(0);

  const errs = analyze();
  let tscFailed = false;
  let tscOutput = "";
  try {
    execSync("npx tsc --noEmit", { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    tscFailed = true;
    tscOutput = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
  }

  if (errs.length || tscFailed) {
    let msg = "";
    if (errs.length) msg += format(errs) + "\n\n";
    if (tscFailed) msg += "npx tsc --noEmit falhou:\n" + tscOutput + "\n";
    process.stderr.write(msg);
    process.exit(2);
  }
  process.exit(0);
}

const errs = analyze();
if (errs.length) {
  process.stdout.write(format(errs) + "\n");
  process.exit(1);
}
process.stdout.write("Arquitetura OK\n");
process.exit(0);
