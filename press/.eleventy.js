export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => `${data.page.fileSlug}.html`,
  });
  return {
    dir: {
      input: "posts", // Your .md lives here
      //output: "../client/public/rollopress", // Direct output to Rollo public
      includes: "../_includes",        // force _includes to be in press/_includes
    },
    markdownTemplateEngine: "njk", // Optional: use Nunjucks for inline templating
    htmlTemplateEngine: "njk",
  };
}
