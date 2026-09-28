export function peisarShiki(
  opts?: PeisarShikiOptions,
): Promise<import("@peisar/peisar_types").Visitor>;
export type PeisarShikiOptions = {
  /**
   * default ["haml", "css", "js", "ts", "jsx", "tsx", "bash"]
   */
  langs?: import("shiki").BundledLanguage[];
  /**
   * default ["github-dark", "github-light"]
   */
  themes?: import("shiki").BundledTheme[];
  /**
   * default false
   */
  dualThemes?: boolean;
  lightTheme?: import("shiki").BundledTheme;
  darkTheme?: import("shiki").BundledTheme;
};
