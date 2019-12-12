const path = require('path')

module.exports = {
  siteMetadata: {
    title: `Serverless 中文技术社区 - serverlesscloud.cn`,
    description: `Serverless中文技术社区是国内开发者技术交流社区。提供Serverless最新信息、实践案例、技术博客、组件文档、学习资源，帮助开发者快速应用Severless技术和解决开发中的问题。`,
    author: '',
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 800,
            },
          },
          {
            resolve: 'gatsby-remark-code-buttons',
            options: {
              toasterText: '代码复制成功',
              buttonText: '复制代码',
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-prismjs`,
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/content`,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@src': path.resolve(__dirname, 'src'),
        },
      },
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        trackingId: 'UA-151120017-1',
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Serverless 中文技术社区`,
        short_name: `ServerlessCN`,
        start_url: `/`,
        background_color: `#fd5750`,
        theme_color: `#fd5750`,
        display: `minimal-ui`,
        icon: `src/assets/images/icon-serverless-framework.png`, // This path is relative to the root of the site.
      },
    },
    // this plugin is awaful
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    `gatsby-plugin-remove-serviceworker`,
  ],
}
