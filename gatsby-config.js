const path = require("path");
const pathPrefix = "/wiki";
const siteMetadata = {
  title: "Wiki By r0k",
  shortName: "r0k Wiki",
  description:
    "r0k의 개인위키",
  imageUrl: "/logo.png",
  siteUrl: "https://padawanr0k.github.io",
  fbAppId: "",
};
module.exports = {
  siteMetadata,
  pathPrefix,
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `./content`,
      },
    },
    {
      resolve: "gatsby-theme-primer-wiki",
      options: {
        nav: [

          {
            title: "Github",
            url: "https://github.com/padawanR0k",
          },
        ],
        editUrl: "https://github.com/padawanR0k/wiki/tree/master",
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: siteMetadata.title,
        short_name: siteMetadata.shortName,
        start_url: pathPrefix,
        background_color: `#f7f0eb`,
        display: `standalone`,
        icon: path.resolve(__dirname, "./static/logo.png"),
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: siteMetadata.siteUrl,
        sitemap: `${siteMetadata.siteUrl}/sitemap/sitemap-index.xml`,
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
  ],
};
