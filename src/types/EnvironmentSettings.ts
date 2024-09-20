import { EnvironmentSecret } from "../types";

export interface EnvironmentSettings {
  kubeConfigPath: string;
  context: string;
  namespace: string;
  secrets: EnvironmentSecret[];
}
