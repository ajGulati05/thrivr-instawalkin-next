import axios from 'axios';
import CryptoJS from 'crypto-js';

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
  const { requestPayload } = req.body;
  let payload = {
    name: getEncrypted(requestPayload.name),
    address: getEncrypted(requestPayload.address),
    phone: getEncrypted(requestPayload.phone),
    birthdate: getEncrypted(requestPayload.birthdate),
    medical_conditions: getEncrypted(
      JSON.stringify(requestPayload.medical_conditions)
    ),
    care: getEncrypted(JSON.stringify(requestPayload.care)),
    surgery: getEncrypted(JSON.stringify(requestPayload.surgery)),
    fractures: getEncrypted(JSON.stringify(requestPayload.fractures)),
    illness: getEncrypted(JSON.stringify(requestPayload.illness)),
    motor_workplace: getEncrypted(
      JSON.stringify(requestPayload.motor_workplace)
    ),
    tests: getEncrypted(JSON.stringify(requestPayload.tests)),
    modifier: 'U',
  };
  if (requestPayload.referred_by)
    payload['referred_by'] = getEncrypted(requestPayload.referred_by);
  if (requestPayload.physician_name)
    payload['physician_name'] = getEncrypted(requestPayload.physician_name);
  if (requestPayload.allergies)
    payload['allergies'] = getEncrypted(requestPayload.allergies);
  if (requestPayload.current_medications)
    payload['current_medications'] = getEncrypted(
      requestPayload.current_medications
    );
  if (requestPayload.relieves)
    payload['relieves'] = getEncrypted(requestPayload.relieves);
  if (requestPayload.aggravates)
    payload['aggravates'] = getEncrypted(requestPayload.aggravates);
  if (requestPayload.sports_activities)
    payload['sports_activities'] = getEncrypted(
      requestPayload.sports_activities
    );
  try {
    const response = await axios({
      method: 'POST',
      url: requestPayload.url,
      data: {
        ...payload,
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
