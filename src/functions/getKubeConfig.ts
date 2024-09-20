import { KubeConfig } from "@kubernetes/client-node";
import * as os from "os";
import path from "path";

export function getKubeConfig(
  kubeConfigPath: string,
  context: string,
  namespace: string
) {
  try {
    const homeDirectory = os.homedir();
    const configFile = path.resolve(homeDirectory, kubeConfigPath);

    const kc = new KubeConfig();
    kc.loadFromFile(configFile);

    if (!kc.contexts) {
      throw new Error("No contexts found in kubeconfig.");
    }

    // Find the current context
    const currentContext = kc.contexts.find((ctx) => ctx.name === context);

    if (!currentContext) {
      throw new Error(`Context ${context} not found in kubeconfig.`);
    }

    // Clone the context and set the namespace
    const newContext = { ...currentContext, namespace };

    // Remove the old context and add the new one
    kc.contexts = kc.contexts.filter((ctx) => ctx.name !== context);
    kc.contexts.push(newContext);

    // Set the new context as the current context
    kc.setCurrentContext(context);

    const cc = kc.getCurrentContext();
    console.log(
      `Current context set to: ${cc}, Namespace set to: ${namespace}`
    );

    return kc;
  } catch (error) {
    console.error("Error setting current context:", error);
    return false;
  }
}
