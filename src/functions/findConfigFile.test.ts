import * as fs from "fs";
import * as path from "path";
import { findConfigFile } from "./findConfigFile";
import { getRepositoryRoot } from "./getRepositoryRoot";

// Mocks
jest.mock("fs");
jest.mock("./getRepositoryRoot");

describe("findConfigFile", () => {
  const mockExistsSync = fs.existsSync as jest.Mock;
  const mockGetRepositoryRoot = getRepositoryRoot as jest.Mock;

  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(jest.fn());
    jest.spyOn(console, "error").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the correct file path if the config file exists", async () => {
    const filename = "config.json";
    const mockRepoRoot = "/home/user/project";

    // Mock the repository root and file existence
    mockGetRepositoryRoot.mockReturnValue(mockRepoRoot);
    mockExistsSync.mockReturnValue(true);

    const result = await findConfigFile(filename);

    const expectedFilePath = path.join(mockRepoRoot, filename);
    expect(result).toBe(expectedFilePath); // Expect it to return the correct file path
    expect(mockGetRepositoryRoot).toHaveBeenCalled(); // Ensure repository root was called
    expect(mockExistsSync).toHaveBeenCalledWith(expectedFilePath); // Ensure file existence was checked
  });

  it("should return null if the repository root is not found", async () => {
    const filename = "config.json";

    // Mock the repository root to return null
    mockGetRepositoryRoot.mockReturnValue(null);

    const result = await findConfigFile(filename);

    expect(result).toBeNull(); // Should return null if no repository root
    expect(mockGetRepositoryRoot).toHaveBeenCalled(); // Ensure repository root was called
    expect(mockExistsSync).not.toHaveBeenCalled(); // File existence should not be checked
  });

  it("should return null if the config file does not exist", async () => {
    const filename = "config.json";
    const mockRepoRoot = "/home/user/project";

    // Mock the repository root and file existence
    mockGetRepositoryRoot.mockReturnValue(mockRepoRoot);
    mockExistsSync.mockReturnValue(false); // Simulate that the file does not exist

    const result = await findConfigFile(filename);

    expect(result).toBeNull(); // Should return null if file doesn't exist
    expect(mockGetRepositoryRoot).toHaveBeenCalled(); // Ensure repository root was called
    expect(mockExistsSync).toHaveBeenCalledWith(
      path.join(mockRepoRoot, filename)
    ); // Ensure file existence was checked
  });
});
