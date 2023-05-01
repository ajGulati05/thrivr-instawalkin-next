const generateSitemap = require('../../../scripts/generate-sitemap');

export default async (req, res) => {
  generateSitemap();

  res.status(200).json({
    status: true,
    message: 'sitemap updated',
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
