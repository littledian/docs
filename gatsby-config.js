module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true, // defaults to false
        allExtensions: true // defaults to false
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require('sass'),
        cssLoaderOptions: {
          modules: true,
          localIdentName: '[name]__[local]--[hash:base64:5]'
        }
      }
    },
    {
      resolve: 'gatsby-plugin-less',
      options: {
        javascriptEnabled: true
      }
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.svg$/
        }
      }
    },
    'gatsby-plugin-no-sourcemaps',
    'gatsby-theme-docz'
  ]
};
