import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import { EnvironmentSecret } from "../types";
import { getCurrentContextData, getRepositoryRoot } from ".";
import path from "path";
import * as fs from "fs";

export async function downloadSecretFromK8s(
  kc: KubeConfig,
  secret: EnvironmentSecret
) {
  const { name, localPath } = secret;

  const { namespace } = getCurrentContextData(kc) || {};
  if (!namespace) {
    console.error("Failed to get namespace from context object.");
    return;
  }

  const repoRoot = getRepositoryRoot();
  if (!repoRoot) {
    console.error("Failed to find repository root.");
    return;
  }

  console.log(`Downloading secret:`);
  console.log(`- ${name}`);
  console.log(`- to store content to file: ${localPath}`);

  const coreApi = kc.makeApiClient(CoreV1Api);
  try {
    const secretData = await coreApi.readNamespacedSecret(name, namespace);

    if (!secretData.body.data || !secretData.body.data.secretData) {
      console.error(`Secret not found in k8s.`);
      return;
    }

    const secretDataDecoded = Buffer.from(
      secretData.body.data.secretData,
      "base64"
    ).toString("utf8");

    const secretFilePath = path.resolve(repoRoot, localPath);
    fs.writeFileSync(secretFilePath, secretDataDecoded);
    console.log(`Downloaded secret ${name} to ${localPath}`);
  } catch (error) {
    console.error("Failed to download secret from k8s:", error);
  }
}
