import { getCurrentContextData, getRepositoryRoot } from ".";
import { EnvironmentSecret } from "../types";
import { CoreV1Api, KubeConfig } from "@kubernetes/client-node";
import * as fs from "fs";
import path from "path";

export async function uploadSecretToK8s(
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

  const envFilePath = path.resolve(repoRoot, localPath);
  const secretData = fs.readFileSync(envFilePath, "utf8");

  const secretManifest = {
    apiVersion: "v1",
    kind: "Secret",
    metadata: {
      name,
    },
    data: {
      secretData: Buffer.from(secretData).toString("base64"),
    },
  };

  console.log(`Uploading secret:`);
  console.log(`- ${name}`);
  console.log(`- from file: ${localPath}`);

  const coreApi = kc.makeApiClient(CoreV1Api);
  try {
    await coreApi.deleteNamespacedSecret(name, namespace);
    console.log(`Deleted existing secret.`);
  } catch (error) {
    console.warn(
      "Failed to delete existing secret, but okay. Maybe it didn't exist."
    );
  }

  try {
    await coreApi.createNamespacedSecret(namespace, secretManifest);
    console.log(`Uploaded secret.`);
  } catch (error: any) {
    if (error && error.body && error.body.message) {
      console.error("Failed to upload secret to k8s: ", error.body.message);
      return;
    }
    console.error("Failed to upload secret to k8s: ", error);
  }
}
