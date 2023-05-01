import CryptoJS from 'crypto-js';

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
    const { queryParams } = req.body;
    const response = queryParams;

    if (response) {
      let payload = {
        actions: getDecrypted(response?.actions),
        contact: getDecrypted(response?.contact),
        exposure: getDecrypted(response?.exposure),
        name: getDecrypted(response?.name),
        symptoms: JSON.parse(getDecrypted(response?.symptoms)),
        testing: JSON.parse(getDecrypted(response?.testing)),
        travel: JSON.parse(getDecrypted(response?.travel)),
      };

      if (response?.precautions)
        payload['precautions'] = getDecrypted(response?.precautions);

      if (payload?.status) payload['status'] = getDecrypted(response?.status);

      return res.status(200).json(payload);
    }
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
