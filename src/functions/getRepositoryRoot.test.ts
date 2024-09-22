import { execSync } from "child_process";
import { getRepositoryRoot } from "./getRepositoryRoot";

// Mock execSync
jest.mock("child_process", () => ({
  execSync: jest.fn(),
}));

describe("getRepositoryRoot", () => {
  const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the repository root when git command succeeds", () => {
    // Arrange
    const mockRepoRoot = "/path/to/repo";
    mockExecSync.mockReturnValue(`${mockRepoRoot}\n`);

    // Act
    const result = getRepositoryRoot();

    // Assert
    expect(result).toBe(mockRepoRoot);
    expect(mockExecSync).toHaveBeenCalledWith("git rev-parse --show-toplevel", {
      encoding: "utf8",
    });
  });

  it("should return null and log an error when git command fails", () => {
    // Arrange
    const mockError = new Error("command failed");
    mockExecSync.mockImplementation(() => {
      throw mockError;
    });
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Act
    const result = getRepositoryRoot();

    // Assert
    expect(result).toBeNull();
    expect(mockExecSync).toHaveBeenCalledWith("git rev-parse --show-toplevel", {
      encoding: "utf8",
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error finding repository root:",
      mockError
    );

    // Cleanup
    consoleErrorSpy.mockRestore();
  });
});
