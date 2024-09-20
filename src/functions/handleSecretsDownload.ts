import { downloadSecretFromK8s } from "./downloadSecretFromK8s";
import { EnvironmentSecret } from "../types";
import { KubeConfig } from "@kubernetes/client-node";

export async function handleSecretsDownload(
  kubeConfig: KubeConfig,
  secrets: EnvironmentSecret[]
) {
  for (const secret of secrets) {
    await downloadSecretFromK8s(kubeConfig, secret);
  }
}
