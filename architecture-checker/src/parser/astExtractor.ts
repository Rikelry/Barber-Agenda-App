import type { ProjectFile } from "../core/types.js";
import type { ParsedFile } from "./typescriptTypes.js";
import { parseTypeScriptFile } from "./typescriptParser.js";

export async function extractProjectAst(
  files: ProjectFile[],
): Promise<ParsedFile[]> {
  const parsedFiles: ParsedFile[] = [];

  for (const file of files) {
    const parsedFile = await parseTypeScriptFile(file);
    parsedFiles.push(parsedFile);
  }

  return parsedFiles;
}
