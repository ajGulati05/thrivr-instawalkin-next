import React from 'react';
import isEmpty from 'lodash.isempty';

const Sitemap = ({ sitemapData: data }) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${
        !isEmpty(data) && !isEmpty(data.staticPages)
          ? data.staticPages
              .map((route) => {
                return `
                  <url>
                      <loc>${`${process.env.WEBAPP_URL}${route}`}</loc>
                  </url>
              `;
              })
              .join('')
          : ''
      }

      ${
        !isEmpty(data) && !isEmpty(data.dynamicPages)
          ? data.dynamicPages
              .map((site) => {
                return `
                  <url>
                      <loc>${`${process.env.WEBAPP_URL}/massage-therapists/${site}`}</loc>
                  </url>
              `;
              })
              .join('')
          : ''
      }
  </urlset>`;
};

export async function getServerSideProps({ res }) {
  const generateSitemap = require('../scripts/generate-sitemap');
  const sitemapData = await generateSitemap();
  res.setHeader('Content-Type', 'text/xml');
  res.write(Sitemap({ sitemapData }));
  res.end();

  return { props: {} };
}

export default Sitemap;
