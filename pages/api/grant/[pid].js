import axios from 'axios';
const VERSION = process.env.BASE_VERSION;
const PREFIX = process.env.BASE_PREFIX;
const BASE = process.env.API_URL;

export default async (req, res) => {
  if (req.method === 'POST') {
    const {
      query: { pid },
    } = req;

    let payload = {
      ...req.body,
      client_secret: process.env.CLIENT_SECRET_AUTH,
      client_id: process.env.CLIENT_ID_AUTH,
    };
    try {
      let response = await axios({
        method: 'POST',
        url: `${BASE}/${PREFIX}/${VERSION}/${pid}`,
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
        },
        data: {
          ...payload,
        },
      });
      return res.status(response.status).json({ ...response.data });
    } catch (e) {
      if (e.response.data) {
        return res.status(e.response.status).json({ ...e.response.data });
      }
      return res
        .status(200)
        .json({ status: false, errors: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ errors: 'Invalid Method', status: false });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
