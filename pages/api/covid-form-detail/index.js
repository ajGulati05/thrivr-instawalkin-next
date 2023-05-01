import axios from 'axios';
import CryptoJS from 'crypto-js';
const VERSION = process.env.BASE_VERSION;
const PREFIX = process.env.BASE_PREFIX;
const BASE = process.env.API_URL;

const getDecrypted = (data) => {
  data = CryptoJS.enc.Base64.parse(data);
  let encryptData = data.toString(CryptoJS.enc.Utf8);
  encryptData = JSON.parse(encryptData);
  let iv = CryptoJS.enc.Base64.parse(encryptData.iv);
  var decrypted = CryptoJS.AES.decrypt(
    encryptData.value,
    CryptoJS.enc.Base64.parse(process.env.FORM_DECRYPT_KEY),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
  return decrypted;
};

export default async (req, res) => {
  try {
    const { id } = req.body;
    const response = await axios({
      method: 'GET',
      url: `${BASE}/${PREFIX}/${VERSION}/covid-forms/${id}`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: req.headers.authorization,
      },
    });
    if (response) {
      console.log(response);
    }
  } catch (e) {
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
