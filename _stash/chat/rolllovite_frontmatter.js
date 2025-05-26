md: new Processor(
  async (result, { owner, path }) => {
    const { parse } = await owner.import("@/rollolibs/yaml.js");
    const { parse: parse_md } = await owner.import("@/rollolibs/marked.js");

    // Simple frontmatter extraction
    const match = /^---\s*\n([\s\S]+?)\n---\s*\n*/.exec(result);
    const metadata = match ? parse(match[1]) : {};
    const content = match
      ? result.slice(match[0].length)
      : result;

    return {
      metadata,
      content: parse_md(content).trim(),
    };
  },
  { cache: true }
)