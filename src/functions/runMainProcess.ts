import {
  getKubeConfig,
  handleSecretsDownload,
  handleSecretsUpload,
  loadConfigFile,
} from ".";

export async function runMainProcess() {
  const config = await loadConfigFile();

  if (!config) {
    console.error("Failed to load configuration.");
    return;
  }
  console.log("Config loaded.");

  const { kubeConfigPath, context, namespace, secrets } =
    config.environmentSettings;

  const kubeConfig = getKubeConfig(kubeConfigPath, context, namespace);

  if (!kubeConfig) {
    console.error("Failed to get KubeConfig.");
    return;
  }

  const args = process.argv;
  const hasDownloadFlag = args.includes("--download");
  if (hasDownloadFlag) {
    console.log("------------------------------------------------------");
    console.log("-          Downloading Environment Settings          -");
    console.log("------------------------------------------------------");
    await handleSecretsDownload(kubeConfig, secrets);
  } else {
    console.log("------------------------------------------------------");
    console.log("-          Uploading Environment Settings            -");
    console.log("------------------------------------------------------");
    await handleSecretsUpload(kubeConfig, secrets);
  }
}
