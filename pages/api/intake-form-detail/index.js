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
      url: `${BASE}/${PREFIX}/${VERSION}/intake-forms/${id}`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: req.headers.authorization,
      },
    });
    if (response) {
      let payload = {
        name: getDecrypted(response.data.data.name),
        address: getDecrypted(response.data.data.address),
        phone: getDecrypted(response.data.data.phone),
        birthdate: getDecrypted(response.data.data.birthdate),
        medical_conditions: JSON.parse(
          getDecrypted(response.data.data.medical_conditions)
        ),
        care: JSON.parse(getDecrypted(response.data.data.care)),
        surgery: JSON.parse(getDecrypted(response.data.data.surgery)),
        fractures: JSON.parse(getDecrypted(response.data.data.fractures)),
        illness: JSON.parse(getDecrypted(response.data.data.illness)),
        motor_workplace: JSON.parse(
          getDecrypted(response.data.data.motor_workplace)
        ),
        tests: JSON.parse(getDecrypted(response.data.data.tests)),
        status: true,
      };
      if (response.data.data.referred_by)
        payload['referred_by'] = getDecrypted(response.data.data.referred_by);
      if (response.data.data.physician_name)
        payload['physician_name'] = getDecrypted(
          response.data.data.physician_name
        );
      if (response.data.data.allergies)
        payload['allergies'] = getDecrypted(response.data.data.allergies);
      if (response.data.data.current_medications)
        payload['current_medications'] = getDecrypted(
          response.data.data.current_medications
        );
      if (response.data.data.relieves)
        payload['relieves'] = getDecrypted(response.data.data.relieves);
      if (response.data.data.aggravates)
        payload['aggravates'] = getDecrypted(response.data.data.aggravates);
      if (response.data.data.sports_activities)
        payload['sports_activities'] = getDecrypted(
          response.data.data.sports_activities
        );
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
