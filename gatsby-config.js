const path = require("path");
const pathPrefix = "/";
const siteMetadata = {
  title: "Wiki By r0k",
  shortName: "r0k Wiki",
  description: "기록하고, 수정하고, 기록합니다",
  imageUrl: "/logo.png",
  siteUrl: "https://r0k.wiki",
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
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [
          'G-2FF0VXBSK5', // 설정 Google Analytics / GA
        ],
      },
    },
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
        editUrl: "https://github.com/padawanR0k/wiki/blob/master/content/",
        sidebarComponents: ["latest", "tag"],
        lastUpdatedText: "최근 수정 시각",
        shouldSupportLatest: true,
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
