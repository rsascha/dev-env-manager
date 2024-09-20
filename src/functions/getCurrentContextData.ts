import { KubeConfig } from "@kubernetes/client-node";

export function getCurrentContextData(kc: KubeConfig) {
  try {
    const context = kc.getCurrentContext();
    const contextObject = kc.getContextObject(context);

    if (!contextObject) {
      console.error("Failed to get context object.");
      return;
    }

    const { namespace } = contextObject;

    return { namespace, context, contextObject };
  } catch (error) {
    console.error("Error getting current namespace:", error);
    return;
  }
}
