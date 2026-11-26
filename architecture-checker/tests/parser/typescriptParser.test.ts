import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { parseTypeScriptFile } from "../../src/parser/typescriptParser.js";

import type { ProjectFile } from "../../src/core/types.js";
import type {
    ImportInfo,
    ParsedFile,
} from "../../src/parser/typescriptTypes.js";

/**
 * Campos propostos que ainda NÃO existem no modelo. Os testes abaixo validam
 * o comportamento esperado contra estes nomes; enquanto o parser não os
 * preencher, os cenários correspondentes permanecem falhando (sem skip).
 *
 * @todo ImportInfo.importedNames — nomes originais/exportados de cada binding
 *       nomeado (necessário para `import { A as B }`).
 * @todo ImportInfo.typeOnlyNames — bindings importados como tipo por
 *       especificador (`import { type A, B }`).
 * @todo ParsedFile.exports — coleção de `export ...` e reexports
 *       (`export { a }`, `export { a as b }`, `export { A } from`, `export * from`,
 *       `export default`).
 */
interface ProposedExportInfo {
    exportedName: string;
    localName?: string;
    moduleSpecifier?: string;
    isTypeOnly: boolean;
    isNamespace: boolean;
}

type ImportInfoWithProposedFields = ImportInfo & {
    importedNames: string[];
    typeOnlyNames: string[];
};

type ParsedFileWithProposedFields = ParsedFile & {
    exports: ProposedExportInfo[];
};

let tempDir: string;
let fileCounter = 0;

beforeAll(async () => {
    tempDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "architecture-checker-parser-"),
    );
});

afterAll(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
});

async function parseSource(source: string): Promise<ParsedFile> {
    fileCounter += 1;

    const name = `source-${fileCounter}.ts`;
    const absolutePath = path.join(tempDir, name);

    await fs.writeFile(absolutePath, source, "utf-8");

    const projectFile: ProjectFile = {
        absolutePath,
        relativePath: name,
        extension: ".ts",
        layer: "unknown",
    };

    return parseTypeScriptFile(projectFile);
}

describe("parseTypeScriptFile — imports", () => {
    it("import { A } from './a' captura o binding nomeado", async () => {
        const parsed = await parseSource(`import { A } from "./a";`);
        const info = parsed.imports[0];

        expect(info.moduleSpecifier).toBe("./a");
        expect(info.namedImports).toEqual(["A"]);
        expect(info.isTypeOnly).toBe(false);
        expect(info.defaultImport).toBeUndefined();
        expect(info.namespaceImport).toBeUndefined();
    });

    it("import type { A } marca isTypeOnly", async () => {
        const parsed = await parseSource(`import type { A } from "./a";`);
        const info = parsed.imports[0];

        expect(info.namedImports).toEqual(["A"]);
        expect(info.isTypeOnly).toBe(true);
    });

    it("import { type A, B } distingue tipo e valor por especificador", async () => {
        const parsed = await parseSource(`import { type A, B } from "./a";`);
        const info = parsed.imports[0] as ImportInfoWithProposedFields;

        expect(info.namedImports).toEqual(["A", "B"]);
        expect(info.isTypeOnly).toBe(false);
        expect(info.typeOnlyNames).toEqual(["A"]);
    });

    it("import { A as B } expõe o local B e o exportado A", async () => {
        const parsed = await parseSource(`import { A as B } from "./a";`);
        const info = parsed.imports[0] as ImportInfoWithProposedFields;

        expect(info.namedImports).toEqual(["B"]);
        expect(info.importedNames).toEqual(["A"]);
    });

    it("import A from './a' captura o import default", async () => {
        const parsed = await parseSource(`import A from "./a";`);
        const info = parsed.imports[0];

        expect(info.defaultImport).toBe("A");
        expect(info.namedImports).toEqual([]);
    });

    it("import * as ns from './a' captura o namespace", async () => {
        const parsed = await parseSource(`import * as ns from "./a";`);
        const info = parsed.imports[0];

        expect(info.namespaceImport).toBe("ns");
    });

    it("import './efeito' registra o import de efeito", async () => {
        const parsed = await parseSource(`import "./efeito";`);
        const info = parsed.imports[0];

        expect(info.moduleSpecifier).toBe("./efeito");
        expect(info.namedImports).toEqual([]);
        expect(info.defaultImport).toBeUndefined();
        expect(info.namespaceImport).toBeUndefined();
    });
});

describe("parseTypeScriptFile — exports", () => {
    it("export const a = new A() marca a variável como exportada", async () => {
        const parsed = await parseSource(`export const a = new A();`);
        const variable = parsed.variables[0];

        expect(variable.name).toBe("a");
        expect(variable.isExported).toBe(true);
        expect(variable.initializer?.kind).toBe("new");
        expect(variable.initializer?.name).toBe("A");
    });

    it("const a = new A(); export { a } marca a variável como exportada", async () => {
        const parsed = await parseSource(`const a = new A();\nexport { a };`);

        expect(parsed.variables[0].name).toBe("a");
        expect(parsed.variables[0].isExported).toBe(true);
    });

    it("const a = new A(); export { a as b } exporta como b", async () => {
        const parsed = (await parseSource(
            `const a = new A();\nexport { a as b };`,
        )) as ParsedFileWithProposedFields;

        expect(parsed.exports).toEqual([
            {
                exportedName: "b",
                localName: "a",
                isTypeOnly: false,
                isNamespace: false,
            },
        ]);
    });

    it("export { A } from './a' registra o reexport", async () => {
        const parsed = (await parseSource(
            `export { A } from "./a";`,
        )) as ParsedFileWithProposedFields;

        expect(parsed.exports).toEqual([
            {
                exportedName: "A",
                localName: "A",
                moduleSpecifier: "./a",
                isTypeOnly: false,
                isNamespace: false,
            },
        ]);
    });

    it("export * from './a' registra o reexport de namespace", async () => {
        const parsed = (await parseSource(
            `export * from "./a";`,
        )) as ParsedFileWithProposedFields;

        expect(parsed.exports).toEqual([
            {
                exportedName: "*",
                moduleSpecifier: "./a",
                isTypeOnly: false,
                isNamespace: true,
            },
        ]);
    });

    it("export default new A() registra o export default de expressão", async () => {
        const parsed = (await parseSource(
            `export default new A();`,
        )) as ParsedFileWithProposedFields;

        expect(parsed.exports).toEqual([
            {
                exportedName: "default",
                isTypeOnly: false,
                isNamespace: false,
            },
        ]);
    });

    it("export default class A {} registra o export default nomeado", async () => {
        const parsed = (await parseSource(
            `export default class A {}`,
        )) as ParsedFileWithProposedFields;

        expect(parsed.exports).toEqual([
            {
                exportedName: "default",
                localName: "A",
                isTypeOnly: false,
                isNamespace: false,
            },
        ]);
    });
});

describe("parseTypeScriptFile — instanciações", () => {
    it("captura new dentro de função, arrow, método, objeto e argumento aninhado", async () => {
        const parsed = await parseSource(`
            function withFunction() {
                return new A();
            }

            const withArrow = () => new B();

            class Holder {
                create() {
                    return new C();
                }
            }

            const withObject = { instance: new D() };

            const nested = new A(new B());
        `);

        const names = parsed.instantiations.map(
            (instantiation) => instantiation.name,
        );

        expect(names).toContain("A");
        expect(names).toContain("B");
        expect(names).toContain("C");
        expect(names).toContain("D");

        const outer = parsed.instantiations.find(
            (instantiation) =>
                instantiation.name === "A" &&
                (instantiation.arguments?.length ?? 0) === 1,
        );

        expect(outer).toBeDefined();
        expect(outer?.arguments?.[0].kind).toBe("new");
        expect(outer?.arguments?.[0].name).toBe("B");
    });

    it("captura new ns.A() com o nome qualificado", async () => {
        const parsed = await parseSource(`const a = new ns.A();`);

        expect(
            parsed.instantiations.map((instantiation) => instantiation.name),
        ).toContain("ns.A");
    });
});
