/**
 * Provider for loading files from disk.
 */
export interface FileLoaderProvider {
  /**
   * Load a file from disk.
   *
   * @param path - Path of the file to load.
   * @returns String representing the loaded file if it was found,
   * null otherwise.
   */
  load(path: string): string | null;
}
