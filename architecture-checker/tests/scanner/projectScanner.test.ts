import { describe, expect, it } from "vitest";

import { identifyLayer } from "../../src/scanner/projectScanner.js";

describe("identifyLayer — caminhos Windows", () => {
    it.each([
        ["src\\view\\LoginView.tsx", "view"],
        ["src\\viewmodel\\useLoginViewModel.ts", "viewmodel"],
        ["SRC\\VIEWMODELS\\useLoginViewModel.ts", "viewmodel"],
        ["src\\usecases\\loginUseCases.ts", "usecase"],
        ["src\\infra\\authDataSource.ts", "infra"],
        ["src\\app\\login.tsx", "routes"],
        ["src\\shared\\format.ts", "unknown"],
    ] as const)(
        "identifica a camada $1",
        (relativePath, expectedLayer) => {
            expect(identifyLayer(relativePath)).toBe(expectedLayer);
        },
    );
});
