import { downloadSecretFromK8s } from "./downloadSecretFromK8s";
import { getCurrentContextData } from "./getCurrentContextData";
import { getRepositoryRoot } from "./getRepositoryRoot";
import { EnvironmentSecret } from "../types";
import { CoreV1Api, KubeConfig, V1Secret } from "@kubernetes/client-node";
import * as fs from "fs";
import { IncomingMessage } from "http";
import path from "path";

// Mocks
jest.mock("@kubernetes/client-node");
jest.mock("./getCurrentContextData");
jest.mock("./getRepositoryRoot");
jest.mock("fs");

describe("downloadSecretFromK8s", () => {
  let kc: KubeConfig;
  let secret: EnvironmentSecret;
  let coreApi: jest.Mocked<CoreV1Api>;

  beforeEach(() => {
    kc = new KubeConfig();
    secret = {
      name: "test-secret",
      localPath: "some/local/path/.env",
    };

    // Mock Kubernetes API client
    coreApi = {
      readNamespacedSecret: jest.fn(),
    } as unknown as jest.Mocked<CoreV1Api>;

    (kc.makeApiClient as jest.Mock).mockReturnValue(coreApi);

    // Mock getCurrentContextData and getRepositoryRoot
    (getCurrentContextData as jest.Mock).mockReturnValue({
      namespace: "test-namespace",
    });
    (getRepositoryRoot as jest.Mock).mockReturnValue("/repo-root");

    // Mock fs
    (fs.writeFileSync as jest.Mock).mockImplementation(jest.fn());

    // Spy on console.log and console.error
    jest.spyOn(console, "log").mockImplementation(jest.fn());
    jest.spyOn(console, "error").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should download and write secret to a file", async () => {
    // Mock the secret data returned from Kubernetes
    coreApi.readNamespacedSecret.mockResolvedValue({
      response: {} as IncomingMessage,
      body: {
        data: {
          secretData: Buffer.from("my-secret-data").toString("base64"),
        },
      } as V1Secret,
    });

    await downloadSecretFromK8s(kc, secret);

    expect(coreApi.readNamespacedSecret).toHaveBeenCalledWith(
      "test-secret",
      "test-namespace"
    );

    const expectedFilePath = path.resolve("/repo-root", "some/local/path/.env");
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedFilePath,
      "my-secret-data"
    );
    expect(console.log).toHaveBeenCalledWith(
      `Downloaded secret test-secret to some/local/path/.env`
    );
  });

  it("should log an error if no namespace is found", async () => {
    (getCurrentContextData as jest.Mock).mockReturnValue(null);

    await downloadSecretFromK8s(kc, secret);

    expect(console.error).toHaveBeenCalledWith(
      "Failed to get namespace from context object."
    );
    expect(coreApi.readNamespacedSecret).not.toHaveBeenCalled();
  });

  it("should log an error if repository root is not found", async () => {
    (getRepositoryRoot as jest.Mock).mockReturnValue(null);

    await downloadSecretFromK8s(kc, secret);

    expect(console.error).toHaveBeenCalledWith(
      "Failed to find repository root."
    );
    expect(coreApi.readNamespacedSecret).not.toHaveBeenCalled();
  });

  it("should log an error if secret is not found in Kubernetes", async () => {
    coreApi.readNamespacedSecret.mockResolvedValue({
      response: {} as IncomingMessage,
      body: {
        data: {},
      } as V1Secret,
    });

    await downloadSecretFromK8s(kc, secret);

    expect(console.error).toHaveBeenCalledWith("Secret not found in k8s.");
  });

  it("should log an error if reading secret from Kubernetes fails", async () => {
    coreApi.readNamespacedSecret.mockRejectedValue(new Error("API error"));

    await downloadSecretFromK8s(kc, secret);

    expect(console.error).toHaveBeenCalledWith(
      "Failed to download secret from k8s:",
      expect.any(Error)
    );
  });
});
