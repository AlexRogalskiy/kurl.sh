const path = require('path');
const MonacoWebpackPlugin = require(`monaco-editor-webpack-plugin`);

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /bad-module/,
            use: loaders.null(),
          },
        ],
      },
      plugins: [
        new MonacoWebpackPlugin({
          languages: [
            "yaml",
            "json"
          ],
          features: [
            "coreCommands",
            "folding",
            "bracketMatching",
            "clipboard",
            "find",
            "colorDetector",
            "codelens"
          ]
        })
      ]
    });
  }
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const docsTemplate = path.resolve(__dirname, 'src/templates/DocsTemplate.js/');
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: docsTemplate,
      context: {}, // additional data can be passed via context
    })
  })
}

exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions
  // Make the front page match everything client side.
  // Normally your paths should be a bit more judicious.
  if (page.path === `/download`) {
    page.matchPath = `/download/*`
    createPage(page)
  }

  if (page.path === `/docs`) {
    page.matchPath = `/docs/*`
    createPage(page)
  }
}