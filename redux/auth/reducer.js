import * as types from './types';

const initialState = {
  authToken: null,
  authRefreshToken: null,
  authenticated: false,
  userProfile: {},
  googleOauthRef: null,
  fbOauthRef: null,
  error: false,
  message: null,
  creditCards: {},
  gtagId: null,
  NotificationData: {},
};

export default (state = initialState, { type, payload, cache }) => {
  switch (type) {
    case types.AUTH_CHECK_SUCCESS:
      return {
        ...state,
        authToken: payload.data.access_token,
        authRefreshToken: payload.data.refresh_token,
        authenticated: true,
      };
    case types.LOGIN_INITIALIZE:
      return {
        ...state,
        authToken: null,
        authRefreshToken: null,
        authenticated: false,
        userProfile: {},
        error: false,
        message: null,
      };
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        authToken: payload.data,
        authenticated: true,
        error: false,
        message: null,
      };
    case types.LOGIN_ERROR:
      return {
        ...state,
        authToken: null,
        authenticated: false,
        error: payload.error,
        message: 'Login Failed',
      };
    case types.SIGNUP_INITIALIZE:
      return {
        ...state,
        authToken: null,
        authRefreshToken: null,
        authenticated: false,
        userProfile: {},
        error: false,
        message: null,
      };
    case types.SIGNUP_SUCCESS:
      return {
        ...state,
        authToken: payload.data,
        authenticated: true,
        error: false,
        message: null,
      };
    case types.SIGNUP_ERROR:
      return {
        ...state,
        authToken: null,
        authenticated: false,
        error: payload.error,
        message: 'Signup Failed',
      };
    case types.SOCIALLOGIN_INITIALIZE:
      return {
        ...state,
        authToken: null,
        authRefreshToken: null,
        authenticated: false,
        userProfile: {},
        error: false,
        message: null,
      };
    case types.SOCIALLOGIN_SUCCESS:
      return {
        ...state,
        authToken: payload.data,
        authenticated: true,
        error: false,
        message: null,
      };
    case types.SOCIALLOGIN_ERROR:
      return {
        ...state,
        authToken: null,
        authenticated: false,
        error: payload.error,
        message: 'Failed',
      };
    case types.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        message: 'Email Sent',
      };
    case types.FORGOT_PASSWORD_ERROR:
      return {
        ...state,
        error: payload.error,
        message: null,
      };
    case types.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        message: 'Password Reset Successfull',
      };
    case types.RESET_PASSWORD_ERROR:
      return {
        ...state,
        error: payload.error,
        message: null,
      };
    case types.USER_PROFILE_INITIALIZE:
      if (cache) {
        return {
          ...state,
          userProfile: { ...state.userProfile },
          error: false,
          message: null,
        };
      }
      return {
        ...state,
        userProfile: {},
        error: false,
        message: null,
      };
    case types.USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: payload.data,
        error: false,
        message: null,
      };
    case types.USER_PROFILE_ERROR:
      return {
        ...state,
        userProfile: { ...state.userProfile },
        error: payload.error,
        message: 'Profile Failed',
      };
    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        authToken: null,
        authRefreshToken: null,
        authenticated: false,
        userProfile: {},
        error: false,
        message: null,
      };
    case types.UNAUTHORIZATIONACTION:
      return {
        ...state,
        authToken: null,
        authRefreshToken: null,
        authenticated: false,
        userProfile: {},
        error: false,
        message: null,
      };
    case types.AUTH_CLEAR_ERRORS:
      return {
        ...state,
        error: false,
        message: null,
      };
    case types.PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        message: 'Your user profile has been updated.',
      };
    case types.PROFILE_UPDATE_ERROR:
      return {
        ...state,
        error: payload.error,
      };
    case types.PASSWORD_UPDATE_ERROR:
      return {
        ...state,
        error: payload.error,
      };
    case types.ADD_CARD_ERROR:
      return {
        ...state,
        error: payload?.error?.message,
      };
    case types.GET_CREDIT_CARD_SUCCESS:
      return {
        ...state,
        creditCards: payload.data,
      };
    case types.GOOGLEOAUTHLOAD:
      return {
        ...state,
        googleOauthRef: payload.data,
      };
    case types.FBOAUTHLOAD:
      return {
        ...state,
        fbOauthRef: payload.data,
      };
    case types.GET_USER_NOTIFICATION_SUCCESS:
      return {
        ...state,
        NotificationData: payload.data,
      };
    case types.GTAG_UNKNOWN_ID:
      return {
        ...state,
        gtagId: payload,
      };
    default:
      return state;
  }
};
