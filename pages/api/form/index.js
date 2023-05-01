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

export const createIntakeFormAuthService = async (req, res) => {
  let payload = {
    name: getEncrypted(req.name),
    address: getEncrypted(req.address),
    phone: getEncrypted(req.phone),
    birthdate: getEncrypted(req.birthdate),
    medical_conditions: getEncrypted(req.medical_conditions),
    care: getEncrypted(req.care),
    surgery: getEncrypted(req.surgery),
    fractures: getEncrypted(req.fractures),
    illness: getEncrypted(req.illness),
    motor_workplace: getEncrypted(req.motor_workplace),
    tests: getEncrypted(req.tests),
  };
  if (req.referred_by) payload['referred_by'] = getEncrypted(req.referred_by);
  if (req.physician_name)
    payload['physician_name'] = getEncrypted(req.physician_name);
  if (req.allergies) payload['allergies'] = getEncrypted(req.allergies);
  if (req.current_medications)
    payload['current_medications'] = getEncrypted(req.current_medications);
  if (req.relieves) payload['relieves'] = getEncrypted(req.relieves);
  if (req.aggravates) payload['aggravates'] = getEncrypted(req.aggravates);
  if (req.sports_activities)
    payload['sports_activities'] = getEncrypted(req.sports_activities);
  try {
    let response = await axios({
      method: 'POST',
      url: `${BASE}/${PREFIX}/${VERSION}/intake-forms`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      data: {
        ...payload,
      },
    });
    //return res.status(response.status).json({ ...response.data });
  } catch (e) {
    if (e.response.data) {
      return res.status(e.response.status).json({ ...e.response.data });
    }
    return res
      .status(200)
      .json({ status: false, errors: 'Internal Server Error' });
  }
};

export const createCovidFormAuthService = async (req, res) => {
  const { payload, query } = req;
  let data = {
    name: getEncrypted(payload.name),
    testing: getEncrypted(JSON.stringify(payload.testing)),
    exposure: getEncrypted(payload.exposure),
    travel: getEncrypted(JSON.stringify(payload.travel)),
    symptoms: getEncrypted(JSON.stringify(payload.symptoms)),
    contact: getEncrypted(payload.contact),
    actions: getEncrypted(JSON.stringify(payload.actions)),
    modifier: 'U',
    active: 1,
    consent: 1,
  };
  if (payload.precautions)
    data['precautions'] = getEncrypted(payload.precautions);
  try {
    let response = await axios({
      method: 'POST',
      url: `${BASE}/${PREFIX}/${VERSION}/covid-forms/create?booking=${query.booking}&expires=${query.expires}&instauuid=${query.instauuid}&therapist_name=${query.therapist_name}&signature=${query.signature}`,
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
      },
      data: {
        ...data,
      },
    });
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
