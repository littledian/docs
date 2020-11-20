const path = require('path');
const { createCompiler } = require('@mdx-js/mdx');
const parse = require('remark-parse');
const frontMatter = require('remark-frontmatter');
const visit = require('unist-util-visit');
const remove = require('unist-util-remove');
const yaml = require('yaml');

const getFileContentByDir = require('./getFileContentByDir');

function extractFrontmatter() {
  return function transformer(tree, file) {
    visit(tree, 'yaml', function visitor(node) {
      file.data.frontmatter = yaml.parse(node.value);
    });
    remove(tree, 'yaml');
  };
}

module.exports = () => {
  const mdxCompiler = createCompiler({
    remarkPlugins: [parse, frontMatter, extractFrontmatter]
  });

  const root = path.join(__dirname, '../pages');
  const fileContents = getFileContentByDir(root);
  const length = root.length;

  return fileContents.map((item) => {
    const { path: filePath, value } = item;
    const newValue = mdxCompiler.processSync(value);
    return {
      path: filePath.substring(length + 1).replace(/(.+)\.\w+$/, '$1'),
      value: newValue.data.frontmatter
    };
  });
};
