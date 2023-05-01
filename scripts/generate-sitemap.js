const isEmpty = require('lodash.isempty');
const globby = require('globby');
const axios = require('axios');

module.exports = async function generateSitemap() {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    'pages/**/*{.js,.mdx}',
    '!pages/_*.js',
    '!pages/api',
  ]);

  const dynamicRoute = await axios({
    baseURL: process.env.API_URL,
    method: 'GET',
    url: `/sitemap`,
  });

  const staticPages = pages.map((page) => {
    const path = page
      .replace('pages', '')
      .replace('.js', '')
      .replace('.mdx', '');
    const route = path === '/index' ? '' : path;

    return route;
  });

  const dynamicPages =
    !isEmpty(dynamicRoute.data) && !isEmpty(dynamicRoute.data.data)
      ? dynamicRoute.data.data.map((page) => {
          return page.site;
        })
      : '';

  return { staticPages, dynamicPages };
};
