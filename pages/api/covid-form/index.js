import axios from 'axios';
import CryptoJS from 'crypto-js';
const VERSION = process.env.BASE_VERSION;
const PREFIX = process.env.BASE_PREFIX;
const BASE = process.env.API_URL;

const getEncrypted = (data) => {
  let iv = CryptoJS.lib.WordArray.random(16),
    key = CryptoJS.enc.Base64.parse(process.env.FORM_ENCRYPT_KEY);
  let options = {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };
  let encrypted = CryptoJS.AES.encrypt(data, key, options);
  encrypted = encrypted.toString();
  iv = CryptoJS.enc.Base64.stringify(iv);
  let result = {
    iv: iv,
    value: encrypted,
    mac: CryptoJS.HmacSHA256(iv + encrypted, key).toString(),
  };
  result = JSON.stringify(result);
  result = CryptoJS.enc.Utf8.parse(result);
  return CryptoJS.enc.Base64.stringify(result);
};

export default async (req, res) => {
  const { payload, query } = req.body;
  let data = {
    name: getEncrypted(payload.name),
    testing: getEncrypted(JSON.stringify(payload.testing)),
    exposure: getEncrypted(JSON.stringify(payload.exposure)),
    travel: getEncrypted(JSON.stringify(payload.travel)),
    symptoms: getEncrypted(JSON.stringify(payload.symptoms)),
    contact: getEncrypted(JSON.stringify(payload.contact)),
    actions: getEncrypted(JSON.stringify(payload.actions)),
    modifier: 'U',
  };
  if (payload.precautions)
    data['precautions'] = getEncrypted(payload.precautions);

  try {
    let response = await axios({
      method: 'POST',
      url: query.url,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      data: {
        ...data,
      },
    });

    return res.status(200).json(response.data);
  } catch (e) {
    console.log('ERROR: ', e.response);
    if (e.response.data) {
      return res.status(e.response.status).json({ ...e.response.data });
    }
    return res
      .status(200)
      .json({ status: false, errors: 'Internal Server Error' });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
