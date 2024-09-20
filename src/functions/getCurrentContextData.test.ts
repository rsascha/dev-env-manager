import { Context, KubeConfig } from "@kubernetes/client-node";
import { getCurrentContextData } from ".";

// Mock the KubeConfig class
jest.mock("@kubernetes/client-node");

describe("getCurrentContextData", () => {
  let kc: jest.Mocked<KubeConfig>;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock KubeConfig methods
    kc = new KubeConfig() as jest.Mocked<KubeConfig>;
    kc.getCurrentContext.mockReturnValue("test-context");
  });

  it("should return the correct context data when context object exists", () => {
    const mockContextObject = { namespace: "test-namespace" } as Context;

    // Mock getContextObject to return a valid context object
    kc.getContextObject.mockReturnValue(mockContextObject);

    const result = getCurrentContextData(kc);

    expect(result).toEqual({
      namespace: "test-namespace",
      context: "test-context",
      contextObject: mockContextObject,
    });

    expect(kc.getCurrentContext).toHaveBeenCalled();
    expect(kc.getContextObject).toHaveBeenCalledWith("test-context");
  });

  it("should log an error and return undefined if context object is not found", () => {
    // Mock getContextObject to return null
    kc.getContextObject.mockReturnValue(null);

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = getCurrentContextData(kc);

    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to get context object."
    );
    expect(kc.getCurrentContext).toHaveBeenCalled();
    expect(kc.getContextObject).toHaveBeenCalledWith("test-context");

    // Restore the original console.error behavior
    consoleErrorSpy.mockRestore();
  });

  it("should log an error and return undefined if an exception occurs", () => {
    // Mock getContextObject to throw an error
    kc.getContextObject.mockImplementation(() => {
      throw new Error("Test error");
    });

    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = getCurrentContextData(kc);

    expect(result).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting current namespace:",
      expect.any(Error)
    );
    expect(kc.getCurrentContext).toHaveBeenCalled();
    expect(kc.getContextObject).toHaveBeenCalledWith("test-context");

    // Restore the original console.error behavior
    consoleErrorSpy.mockRestore();
  });
});
