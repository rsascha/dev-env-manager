import * as fs from "fs";
import * as path from "path";
import { getRepositoryRoot } from ".";

export async function findConfigFile(filename: string): Promise<string | null> {
  const repoRoot = getRepositoryRoot();
  if (!repoRoot) {
    console.error("Failed to find repository root.");
    return null;
  }

  const filePath = path.join(repoRoot, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`Failed to find file: ${filePath}`);
    return null;
  }

  return filePath;
}
