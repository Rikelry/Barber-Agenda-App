import { describe, expect, it } from "vitest";
import path from "node:path";

import { loadProjectTypeScriptConfig } from "../../src/analyzer/projectConfigLoader.js";

function fixturePath(name: string): string {
    return path.resolve(process.cwd(), "tests", "fixtures", name);
}

describe("carregamento da configuração TypeScript do projeto", () => {
    it("não deve falhar quando o 'extends' aponta para um pacote não instalado", () => {
        const config = loadProjectTypeScriptConfig(
            fixturePath("missing-extends-project"),
        );

        expect(config.options.paths?.["@/*"]).toEqual(["src/*"]);
    });

    it("deve carregar normalmente um tsconfig válido", () => {
        const config = loadProjectTypeScriptConfig(
            fixturePath("import-resolution-project"),
        );

        expect(config.options.paths?.["@/*"]).toEqual(["src/*"]);
    });
});
