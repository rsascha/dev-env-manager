import { findConfigFile } from "./findConfigFile";
import { EnvironmentConfigFile } from "../types";
import * as fs from "fs";

export async function loadConfigFile(): Promise<EnvironmentConfigFile | null> {
  const configFileName = "environment.config.json";
  const configFilePath = await findConfigFile(configFileName);

  if (!configFilePath) {
    return null;
  }

  try {
    const fileContent = await fs.promises.readFile(configFilePath, "utf8");
    return JSON.parse(fileContent) as EnvironmentConfigFile;
  } catch (error) {
    console.error(`Error reading or parsing the config file: ${error}`);
    return null;
  }
}
