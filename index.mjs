import { createHighlighter } from "shiki";

/**
 * @typedef PeisarShikiOptions
 * @property {import("shiki").BundledLanguage[]} [langs] default ["haml", "css", "js", "ts", "jsx", "tsx", "bash"]
 * @property {import("shiki").BundledTheme[]} [themes] default ["github-dark", "github-light"]
 * @property {boolean} [dualThemes] default false
 * @property {import("shiki").BundledTheme} [lightTheme]
 * @property {import("shiki").BundledTheme} [darkTheme]
 */

/**
 *
 * @param {PeisarShikiOptions} [opts]
 */
export async function peisarShiki(opts) {
  /** @type {import("shiki").BundledLanguage[]} */
  const defaultLangs = ["haml", "css", "js", "ts", "jsx", "tsx", "bash"];
  /** @type {import("shiki").BundledTheme[]} */
  const defaultThemes = ["github-dark", "github-light"];
  /** @type {import("shiki").BundledLanguage[]} */
  let langs = [];
  /** @type {import("shiki").BundledTheme[]} */
  let themes = [];
  let dualThemes = false;
  /** @type {import("shiki").BundledTheme|undefined} */
  let lightTheme = undefined;
  /** @type {import("shiki").BundledTheme|undefined} */
  let darkTheme = undefined;
  if (opts) {
    if (opts.langs) {
      langs = [...defaultLangs, ...opts.langs];
      langs = [...new Set(langs)];
    } else {
      langs = defaultLangs;
    }
    if (opts.themes) {
      themes = [...defaultThemes, ...opts.themes];
      themes = [...new Set(themes)];
    } else {
      themes = defaultThemes;
    }
    if (opts.dualThemes) dualThemes = true;
    if (opts.lightTheme) lightTheme = opts.lightTheme;
    if (opts.darkTheme) darkTheme = opts.darkTheme;
  }

  const useThemes =
    darkTheme && (!lightTheme || !darkTheme)
      ? { themes: { light: "github-light", dark: "github-dark" } }
      : darkTheme && lightTheme && darkTheme
        ? { themes: { light: lightTheme, dark: darkTheme } }
        : !dualThemes && lightTheme
          ? { theme: lightTheme }
          : { theme: lightTheme };

  const highlighter = await createHighlighter({
    langs,
    themes,
  });
  /** @type {import("@peisar/peisar_types").Visitor} */
  const visitor = {
    visitBlock(blocks) {
      for (const block of blocks) {
        if (block.type === "CodeBlock") {
          const lan = block.lang ?? "text";
          const code = block.code;
          const html = highlighter.codeToHtml(code, {
            lang: lan,
            ...useThemes,
          });
          return {
            replaceWith: [
              {
                type: "HtmlBlock",
                html: html,
                pos: block.pos,
              },
            ],
          };
        }
      }
      return { recurse: true };
    },
  };
  return visitor;
}
