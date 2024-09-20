import { uploadSecretToK8s } from "./uploadSecretToK8s";
import { EnvironmentSecret } from "../types";
import { KubeConfig } from "@kubernetes/client-node";
import inquirer from "inquirer";

export async function handleSecretsUpload(
  kubeConfig: KubeConfig,
  secrets: EnvironmentSecret[]
) {
  const fileChoices = secrets.map((secret) => ({
    name: secret.localPath,
    value: secret,
  }));

  const answers = (await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFiles",
      message: "Select the files you want to upload to k8s:",
      choices: fileChoices,
    },
  ])) as { selectedFiles: EnvironmentSecret[] };

  if (answers.selectedFiles.length < 1) {
    console.log("No files selected for upload.");
    return;
  }

  for (const secret of answers.selectedFiles) {
    await uploadSecretToK8s(kubeConfig, secret);
  }
}
