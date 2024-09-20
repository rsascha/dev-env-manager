import { execSync } from "child_process";

export function getRepositoryRoot(): string | null {
  try {
    const repoRoot = execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
    }).trim();
    return repoRoot;
  } catch (error) {
    console.error("Error finding repository root:", error);
    return null;
  }
}
