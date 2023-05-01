import axios from 'axios';
import isEmpty from 'lodash.isempty';
import Router from 'next/router';
import qs from 'qs';
const VERSION = process.env.BASE_VERSION;
const PREFIX = process.env.BASE_PREFIX;

const _getRefreshToken = () => {
  let authData = JSON.parse(localStorage.getItem('auth'));
  return authData.refresh_token;
};
const _setToken = (data) => {
  if (!isEmpty(data) && data.access_token && data.refresh_token) {
    let access_token = '',
      refresh_token = '';
    access_token = window.btoa(data.access_token);
    refresh_token = window.btoa(data.refresh_token);
    localStorage.setItem(
      'auth',
      JSON.stringify({ access_token, refresh_token })
    );
  }
};

// Axios Instance
const instawalkinAxios = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
});

const instawalkinAuthAxios = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'content-type': 'application/json',
    accept: 'application/json',
  },
});

const instawalkinStripeAxios = axios.create({
  baseURL: 'https://api.stripe.com',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

instawalkinAuthAxios.interceptors.request.use(function (config) {
  const auth = localStorage.getItem('auth');
  if (auth) {
    let { access_token } = JSON.parse(auth);
    config.headers.Authorization = auth
      ? `Bearer ${window.atob(access_token)}`
      : '';
  }
  return config;
});

instawalkinAuthAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Reject promise if usual error
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }
    /*
     * When response code is 401, try to refresh the token.
     * Eject the interceptor so it doesn't loop in case
     * token refresh causes the 401 response
     */
    instawalkinAuthAxios.interceptors.response.eject(instawalkinAuthAxios);
    return refreshTokenGrantService({
      refresh_token: window.atob(_getRefreshToken()),
    })
      .then((response) => {
        _setToken(response.data.data);
        error.response.config.headers['Authorization'] =
          'Bearer ' + response.data.data.access_token;
        return axios(error.response.config);
      })
      .catch((error) => {
        localStorage.removeItem('auth');
        Router.replace('/');
        return Promise.reject(error);
      });
  }
);

instawalkinStripeAxios.interceptors.request.use(function (config) {
  let stripe_key = process.env.STRIPE_KEY;
  config.headers.Authorization = stripe_key ? `Bearer ${stripe_key}` : '';
  return config;
});

/* Todo - Custom Toast on error */
instawalkinAxios.interceptors.response.use(function (res) {
  if (!isEmpty(res) && !isEmpty(res.data) && !isEmpty(res.data.errors)) {
    return Promise.reject(res.data.errors);
  }
  return res;
});

/* 
------------------------------------------------------------
 ROUTES
------------------------------------------------------------
*/

/* Add contact details */
export const addContactUs = (payload) => {
  return instawalkinAxios({
    method: 'POST',
    url: '/contact-us',
    data: {
      ...payload,
    },
  });
};

/* Log user details */
export const ctaRecordLogger = (payload) => {
  return instawalkinAxios({
    method: 'POST',
    url: '/ctarecord',
    data: {
      ...payload,
    },
  });
};

/* Get City Banner Data */
export const getCityBanner = () => {
  return instawalkinAxios({
    method: 'GET',
    url: `/city-banner`,
  });
};

/* Get Project and Pricing */
export const getProjectPricing = () => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/project-pricings`,
  });
};

/* Get Manager Specialist */
export const getSpecialities = () => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/specialities`,
  });
};

/* GET EMAIL With Signed URL */
export const getEmailSignedUrlService = (payload) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/thrivr-form-flows?${payload.url}`,
  });
};

/* Get Credit Cards */
export const CreditCards = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/credit-cards`,
  });
};

/* Get Listed Therapists */
export const getListedTherapists = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/availability/${params.projectId}/${
      params.date
    }/${params.timezone ? params.timezone : 'America_Regina'}/${
      params.lattitude
    }/${params.longitude}`,
  });
};

/* Get Team Listed Therapists */
export const getTeamListedTherapists = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/massage-practice/${params.city}/${params.team_slug}/${params.projectId}/${params.date}`,
  });
};

/* Reset Password */
export const resetPasswordService = (payload) => {
  return instawalkinAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/password/reset`,
    data: {
      ...payload,
    },
  });
};

/* Get Therapist Review */
export const getReviews = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/therapist/${params.slug}/reviews/${params.itemCount}/${params.filter}?page=${params.pageNumber}`,
  });
};

/* Get Manager Endorsements */
export const getManagerEndorsement = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/therapist/${params.slug}/endorsements`,
  });
};

/* Get Project Pricing per Therapist */
export const getProjectPerTherapist = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/project-pricings/${params.slug}`,
  });
};

/* Get Managers Data (individual) */
export const getPerTherapistData = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/${params.slug}/availability/${params.projectId}/${params.dateTime}/1`,
  });
};

/* Get Managers Availability (individual) */
export const getPerTherapistAvailability = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/${params.slug}/availability/${params.projectId}/${params.dateTime}/0`,
  });
};

/* Get Request Demo Slot */
export const getRequestDemoSlot = (params) => {
  return instawalkinAxios({
    method: 'GET',
    url: `/request-demo/${params.timezone}/${params.date}`,
  });
};

/* Set Request Demo Slot */
export const setRequestDemoSlot = (params) => {
  return instawalkinAxios({
    method: 'POST',
    url: `/request-demo/${params.timezone}`,
    data: params.payload,
  });
};

/* Book Appoinment */
export const bookAppointment = (params) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/book/${params.projectId}/${params.slug}/${params.managerspecialityId}`,
    data: params.payload,
  });
};

/* Modify Booking Cancel or Reschedule */
export const initiateModifyAppointment = (params) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/booking/${params.slug}/modify`,
    data: params.payload,
  });
};

/* Cancle Appointment */
export const cancleAppointment = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/booking/${payload.url}`,
  });
};

/* Reschedule Appointment */
export const rescheduleAppointment = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/${payload.url}`,
    data: payload.data,
  });
};

/* Create Guests */
export const createGuests = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/guests`,
    data: {
      ...payload,
    },
  });
};

/* Get Guests */
export const getGuests = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/guests`,
  });
};

/* Get Discount Valid */
export const getDiscountValid = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/discount-allowed`,
  });
};

/* Get Intake Forms */
export const getIntakeFormsService = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/intake-forms`,
  });
};

/* Get Intake Forms Detail */
export const getIntakeFormsDetailService = (payload) => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/intake-forms/${payload.id}`,
  });
};

/* Get Covid Forms Detail */
export const getCovidFormsService = (payload) => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/covid-forms/${payload.id}`,
  });
};

/* Get Endorsements */
export const getEndorsement = () => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/endorsements`,
  });
};

/* Recommended RMT - non auth */
export const recommendedRMT = (payload) => {
  return instawalkinAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/recommended-rmt`,
    data: {
      ...payload,
    },
  });
};

/* User email update */
export const emailUpdate = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/userprofile/update/email`,
    data: {
      ...payload,
    },
  });
};

/* GET Booking Detail */
export const bookingDetail = (params) => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/booking/${params.slug}`,
  });
};

/* Launched Cities */
export const launchedCities = () => {
  return instawalkinAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/launched-cities`,
  });
};

/* Forgot Password */
export const forgotPasswordService = (payload) => {
  return instawalkinAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/password/forgot`,
    data: {
      ...payload,
    },
  });
};

/* Create Intake Form */
export const createIntakeFormAuthService = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/intake-forms`,
    data: {
      ...payload,
    },
  });
};

/* Consent Intake Form */
export const consentIntakeFormService = (payload) => {
  return instawalkinAxios({
    method: 'POST',
    url: payload.url,
    data: payload.data,
  });
};

/* Consent Covid Form */
export const consentCovidFormService = (payload) => {
  return instawalkinAxios({
    method: 'POST',
    url: payload.url,
    data: payload.data,
  });
};

/* Create Covid Form */
export const createCovidFormAuthService = ({ payload, query }) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/covid-forms/create?booking=${query.booking}&expires=${query.expires}&instauuid=${query.instauuid}&therapist_name=${query.therapist_name}&signature=${query.signature}`,
    data: {
      ...payload,
    },
  });
};

/* 
------------------------------------------------------------
 GRANT ROUTES
------------------------------------------------------------
*/

/* Login Grant */
export const loginGrantService = (payload) => {
  return axios({
    method: 'POST',
    url: `/api/grant/login`,
    data: {
      ...payload,
    },
  });
};

/* Signup Grant */
export const signupGrantService = (payload) => {
  return axios({
    method: 'POST',
    url: `/api/grant/register`,
    data: {
      ...payload,
    },
  });
};

/* Social/Register Login Grant */
export const socialSigninGrantService = (payload) => {
  return axios({
    method: 'POST',
    url: `/api/grant/social-auth`,
    data: {
      ...payload,
      grant_type: 'social',
    },
  });
};

/* Refresh Token Grant */
export const refreshTokenGrantService = (payload) => {
  return axios({
    method: 'POST',
    url: `/api/grant/refresh`,
    data: {
      ...payload,
      grant_type: 'refresh_token',
      scope: '',
      customProvider: 'usersapi',
    },
  });
};

/* Intake Form Grant */
export const intakeFormGrantService = (payload) => {
  const auth = localStorage.getItem('auth');

  return axios({
    method: 'POST',
    url: `/api/intake-form`,
    headers: {
      Authorization: auth
        ? `Bearer ${window.atob(JSON.parse(auth).access_token)}`
        : null,
    },
    data: {
      requestPayload: {
        ...payload,
      },
    },
  });
};

/* Intake Form Grant No Auth */
export const intakeFormGrantNoAuthService = (payload) => {
  return axios({
    method: 'POST',
    url: `/api/intake-form-no-auth`,
    data: {
      requestPayload: {
        ...payload,
      },
    },
  });
};

/* Intake Form Detail Grant */
export const intakeFormDetailGrantService = (payload) => {
  const auth = localStorage.getItem('auth');
  return axios({
    method: 'POST',
    url: `/api/intake-form-detail`,
    headers: {
      Authorization: auth
        ? `Bearer ${window.atob(JSON.parse(auth).access_token)}`
        : null,
    },
    data: {
      id: payload.id,
    },
  });
};

/* Intake Form Detail Grant No Auth */
export const intakeFormDetailGrantNoAuthService = (payload) => {
  return axios({
    method: 'POST',
    url: `/api/intake-form-detail/noauth`,
    data: {
      queryParams: {
        ...payload,
      },
    },
  });
};

/* Covid Form Detail Grant No Auth */
export const covidFormDetailGrantNoAuthService = (payload) => {
  return axios({
    method: 'POST',
    url: `/api/covid-form-detail/noauth`,
    data: {
      queryParams: {
        ...payload,
      },
    },
  });
};

/* Covid Form Detail Grant */
export const covidFormDetailGrantService = (payload) => {
  const auth = localStorage.getItem('auth');
  return axios({
    method: 'POST',
    url: `/api/covid-form-detail`,
    headers: {
      Authorization: auth
        ? `Bearer ${window.atob(JSON.parse(auth).access_token)}`
        : null,
    },
    data: {
      id: payload.id,
    },
  });
};

/* Covid Form Grant */
export const covidFormGrantService = (payload) => {
  const auth = localStorage.getItem('auth');

  return axios({
    method: 'POST',
    url: `/api/covid-form`,
    headers: {
      Authorization: auth
        ? `Bearer ${window.atob(JSON.parse(auth).access_token)}`
        : null,
    },
    data: {
      ...payload,
    },
  });
};

/* 
------------------------------------------------------------
 AUTH ROUTES
------------------------------------------------------------
*/

/* Check Auth Token */
export const checkAuthToken = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/check-auth`,
  });
};

/* Logout */
export const logoutService = () => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/logout`,
  });
};

/* User Profile */
export const userProfileService = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/userprofile`,
  });
};

/* Get User Notifications */
export const getUserNotifications = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/notifications`,
  });
};

/* Get List Bookings */
export const getBookingsList = () => {
  return instawalkinAuthAxios({
    method: 'GET',
    url: `/${PREFIX}/${VERSION}/bookings`,
  });
};

/* User Profile Update */
export const userProfileUpdate = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/userprofile/update`,
    data: {
      ...payload,
    },
  });
};

/* Add Therapist Review */
export const addReviews = (params) => {
  const formData = new FormData();
  Object.keys(params.data).forEach((key) =>
    formData.append(key, params.data[key])
  );

  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/review/${params.type}/${params.slug}`,
    data: formData,
  });
};

/* User Profile Image Update */
export const userProfileImageUpdate = (payload) => {
  let formData = new FormData();
  formData.append('avatar', payload.avatar);
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/userprofile/image/update`,
    data: formData,
  });
};

/* Add New Card */
export const addNewCard = (payload) => {
  let cardData = qs.stringify(payload);
  return instawalkinStripeAxios({
    method: 'POST',
    url: '/v1/tokens',
    data: cardData,
  });
};

/* Create new card backend */
export const createNewCard = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/credit-cards/create`,
    data: {
      ...payload,
    },
  });
};

/* Set Notification */
export const setNotification = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/notifications/update`,
    data: {
      ...payload,
    },
  });
};

/* Update Password */
export const updatePassword = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/set/password`,
    data: {
      ...payload,
    },
  });
};

/* Cart Views */
export const cartViewService = (params) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/cart-views/${params.booking_slug}`,
    data: {
      future_massage_date: params.date_time,
    },
  });
};

/* Tip */
export const bookingTip = (params) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/booking/${params.booking_slug}/tip`,
    data: {
      tip_amount: params.tip_amount,
    },
  });
};

/* Tip */
export const bookingReceipt = (params) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/booking/${params.booking_slug}/receipt`,
  });
};

/* Delete Card */
export const deleteCard = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/credit-cards/delete`,
    data: {
      ...payload,
      native_pay: false,
    },
  });
};

/* Default Card */
export const defaultCard = (params) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/credit-cards/default/${params.id}`,
  });
};

/* Delete Card */
export const deletePayCard = (params) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/credit-cards/delete/${params.id}`,
  });
};

/* Recommended RMT - auth */
export const recommendedRMTSigned = (payload) => {
  return instawalkinAuthAxios({
    method: 'POST',
    url: `/${PREFIX}/${VERSION}/recommended-rmt-signed`,
    data: {
      ...payload,
    },
  });
};
