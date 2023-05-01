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
        name: getDecrypted(response?.name),
        address: getDecrypted(response?.address),
        phone: getDecrypted(response?.phone),
        birthdate: getDecrypted(response?.birthdate),
        medical_conditions: JSON.parse(
          getDecrypted(response?.medical_conditions)
        ),
        care: JSON.parse(getDecrypted(response?.care)),
        surgery: JSON.parse(getDecrypted(response?.surgery)),
        fractures: JSON.parse(getDecrypted(response?.fractures)),
        illness: JSON.parse(getDecrypted(response?.illness)),
        motor_workplace: JSON.parse(getDecrypted(response?.motor_workplace)),
        tests: JSON.parse(getDecrypted(response?.tests)),
        status: true,
      };
      if (response?.referred_by)
        payload['referred_by'] = getDecrypted(response?.referred_by);
      if (response?.physician_name)
        payload['physician_name'] = getDecrypted(response?.physician_name);
      if (response?.allergies)
        payload['allergies'] = getDecrypted(response?.allergies);
      if (response?.current_medications)
        payload['current_medications'] = getDecrypted(
          response?.current_medications
        );
      if (response?.relieves)
        payload['relieves'] = getDecrypted(response?.relieves);
      if (response?.aggravates)
        payload['aggravates'] = getDecrypted(response?.aggravates);
      if (response?.sports_activities)
        payload['sports_activities'] = getDecrypted(
          response?.sports_activities
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
