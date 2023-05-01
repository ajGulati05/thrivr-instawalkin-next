import Router from 'next/router';
import isEmpty from 'lodash.isempty';
import * as types from './types';
import { loaderState, getDefaultCities } from 'redux/app/actions';
import { v1 as uuidv1 } from 'uuid';
import { statusCheck } from 'util/config';
import {
  loginGrantService,
  logoutService,
  signupGrantService,
  forgotPasswordService,
  userProfileService,
  socialSigninGrantService,
  recommendedRMT,
  recommendedRMTSigned,
  resetPasswordService,
  userProfileUpdate,
  addNewCard,
  userProfileImageUpdate,
  defaultCard,
  deletePayCard,
  CreditCards,
  createNewCard,
  setNotification,
  getUserNotifications,
  updatePassword,
  checkAuthToken,
  emailUpdate,
} from 'services/index';
import { privateRoutePath } from 'containers/App/constant';

/* Auth Check */
export const checkAuth = (authStatus, path) => async (dispatch) => {
  let auth = true;
  if (!localStorage.getItem('gtag_id')) {
    let uuid = uuidv1();
    localStorage.setItem('gtag_id', uuid);
    await dispatch({
      type: types.GTAG_UNKNOWN_ID,
      payload: uuid,
    });
  } else {
    await dispatch({
      type: types.GTAG_UNKNOWN_ID,
      payload: localStorage.getItem('gtag_id'),
    });
  }

  try {
    if (!authStatus) {
      let authData = localStorage.getItem('auth');

      if (isEmpty(authData)) {
        if (privateRoutePath.includes(path)) {
          Router.replace(`/login?redirectFrom=${path}`);
        }

        auth = false;
      } else {
        let response = await checkAuthToken();
        if (response.data.status) {
          let data = JSON.parse(authData);
          await dispatch({
            type: types.AUTH_CHECK_SUCCESS,
            payload: { data },
          });

          await dispatch(getUserProfileData());
        } else {
          localStorage.removeItem('auth');
          Router.replace(`/login`);
        }
      }
    }
  } catch (err) {
    console.log(err);
    localStorage.removeItem('auth');
    Router.replace(`/login`);
  }
  // Global API
  dispatch(getDefaultCities());

  return auth;
};

export const googleOauthInitialize = (payload) => async (dispatch) => {
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.GOOGLEOAUTHLOAD,
      payload: { data: payload },
    });
  } catch (err) {
    console.log(err, 'google oauth error');
  } finally {
    await dispatch(loaderState(false));
  }
};

export const fbOauthInitialize = (payload) => async (dispatch) => {
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.FBOAUTHLOAD,
      payload: { data: payload },
    });
  } catch (err) {
    console.log(err, 'FB oauth error');
  } finally {
    await dispatch(loaderState(false));
  }
};

export const login = (payload, path) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.LOGIN_INITIALIZE,
    });
    let response = await loginGrantService(payload);

    if (statusCheck(response)) {
      // Localstorage auth setter
      setAuthApplicationStorage(response.data.data);
      await dispatch({
        type: types.LOGIN_SUCCESS,
        payload: { data: response.data.data.access_token },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
      dispatch(getUserProfileData());
      Router.replace(path);
    } else {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: { error: response.data.errors },
      });
    }
  } catch (error) {
    if (
      error.response &&
      !isEmpty(error.response.data) &&
      error.response.data.data
    ) {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: { error: error.response.data.data.errors },
      });
    } else {
      dispatch({
        type: types.LOGIN_ERROR,
        payload: { error },
      });
    }
  } finally {
    dispatch(clearError());
    dispatch(loaderState(false));
  }
  return returnState;
};

export const signup = (payload, path) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.SIGNUP_INITIALIZE,
    });
    let response = await signupGrantService(payload);

    if (statusCheck(response)) {
      // Localstorage auth setter
      setAuthApplicationStorage(response.data.data);
      await dispatch({
        type: types.SIGNUP_SUCCESS,
        payload: { data: response.data.data.access_token },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
      dispatch(getUserProfileData());
      Router.replace(path);
    }
  } catch (error) {
    if (typeof error.response.data.errors === 'object') {
      returnState = {
        status: false,
        error: error.response.data.errors,
      };
      dispatch({
        type: types.SIGNUP_ERROR,
        payload: { error: error.response.data.errors },
      });
    } else {
      dispatch({
        type: types.SIGNUP_ERROR,
        payload: { error },
      });
    }
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const socialLogin = (payload, path) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.SOCIALLOGIN_INITIALIZE,
    });
    let response = await socialSigninGrantService(payload);
    console.log(response, 'social login');
    if (statusCheck(response)) {
      // Localstorage auth setter
      setAuthApplicationStorage(response.data.data);
      await dispatch({
        type: types.LOGIN_SUCCESS,
        payload: { data: response.data.data.access_token },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
      dispatch(getUserProfileData());
      Router.replace(path);
    }
  } catch (error) {
    console.log(error, 'catch error');
    dispatch({
      type: types.LOGIN_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const forgotPassword = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: '',
  };
  try {
    await dispatch(loaderState(true));
    let response = await forgotPasswordService(payload);

    if (
      (response.status === 200 || response.status === 204) &&
      response.data.status
    ) {
      returnState = {
        status: true,
        message: response.data.message,
      };
      await dispatch({
        type: types.FORGOT_PASSWORD_SUCCESS,
      });
    }
  } catch (error) {
    await dispatch({
      type: types.FORGOT_PASSWORD_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const passwordReset = (payload, redirectFrom) => async (dispatch) => {
  let returnState = {
    status: false,
    message: '',
  };
  try {
    await dispatch(loaderState(true));
    let response = await resetPasswordService(payload);

    if (response.status === 200 && response.data.status) {
      returnState = {
        status: true,
        message: response.data.message,
      };

      await dispatch({
        type: types.RESET_PASSWORD_SUCCESS,
      });

      Router.replace(`/login?redirectFrom=${redirectFrom}`);
    }
  } catch (error) {
    await dispatch({
      type: types.RESET_PASSWORD_ERROR,
      payload: {
        error: error?.response?.data?.errors,
      },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getRecommendedRMT = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await recommendedRMT(payload);

    if (statusCheck(response)) {
      returnState = {
        status: true,
        message: response.data.message,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

/* 
------------------------------------------------------------
 AUTH ACTIONS
------------------------------------------------------------
*/

export const getRecommendedRMTSigned = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await recommendedRMTSigned(payload);

    if (statusCheck(response)) {
      returnState = {
        status: true,
        message: response.data.message,
      };
    }
  } catch (error) {
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getUserProfileData = (cache = false) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.USER_PROFILE_INITIALIZE,
      cache,
    });
    let response = await userProfileService();

    if (statusCheck(response)) {
      let { data } = response.data;
      await dispatch({
        type: types.USER_PROFILE_SUCCESS,
        payload: { data },
      });
      returnState = {
        status: true,
        data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.USER_PROFILE_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getCreditCards = () => async (dispatch) => {
  let returnState = {
    status: false,
    message: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await CreditCards();
    if (statusCheck(response) && response.data.status) {
      returnState = {
        status: true,
      };
      await dispatch({
        type: types.GET_CREDIT_CARD_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const profileUpdate = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: '',
  };
  try {
    await dispatch(loaderState(true));
    let response = await userProfileUpdate(payload);

    if (response.status === 200 && response.data.status) {
      returnState = {
        status: true,
        message: response.data.message,
      };
      await dispatch({
        type: types.PROFILE_UPDATE_SUCCESS,
      });
      dispatch(getUserProfileData(true));
    }
  } catch (error) {
    await dispatch({
      type: types.PROFILE_UPDATE_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const profileImageUpdate = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: '',
  };

  try {
    await dispatch(loaderState(true));
    let response = await userProfileImageUpdate(payload);
    if (response.status === 200 && response.data.status) {
      returnState = {
        status: true,
        message: response.data.message,
      };
      await dispatch({
        type: types.PROFILE_UPDATE_SUCCESS,
      });
      dispatch(getUserProfileData());
    }
  } catch (error) {
    await dispatch({
      type: types.PROFILE_UPDATE_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const userEmailUpdate = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: '',
  };

  try {
    await dispatch(loaderState(true));
    let response = await emailUpdate(payload);
    if (response.status === 200 && response.data.status) {
      returnState = {
        status: true,
        message: response.data.message,
      };
      await dispatch({
        type: types.EMAIL_UPDATE_SUCCESS,
      });
    }
  } catch (error) {
    await dispatch({
      type: types.EMAIL_UPDATE_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const notificationUpdate = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: '',
  };

  try {
    await dispatch(loaderState(true));
    await setNotification(payload);
    dispatch(getNotifications());
  } catch (error) {
    await dispatch({
      type: types.NOTIFICATION_UPDATE_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const resetPassword = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    message: '',
    error: null,
  };

  try {
    await dispatch(loaderState(true));
    let response = await updatePassword(payload);
    if (statusCheck(response) && response.data.status) {
      returnState = {
        status: true,
        message: response.data.message,
      };
    }
  } catch (error) {
    returnState = {
      status: false,
      error: error.response.data.error,
    };
    await dispatch({
      type: types.PASSWORD_UPDATE_ERROR,
      payload: { error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getNotifications = () => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await getUserNotifications();
    if (statusCheck(response) && response.data.status) {
      returnState = {
        status: true,
        data: response.data.data,
      };
      await dispatch({
        type: types.GET_USER_NOTIFICATION_SUCCESS,
        payload: response.data,
      });
    }
  } catch (error) {
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const addCard = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
  };
  try {
    await dispatch(loaderState(true));

    let response = await addNewCard(payload);
    if (response.status === 200) {
      returnState = {
        status: true,
      };
      let createCardData = {
        card_token: response.data.id,
        card_brand: response.data.card.brand,
        card_last_four: response.data.card.last4,
        native_pay: false,
        card_id: response.data.card.id,
      };
      dispatch(createCard(createCardData));
      // await dispatch({
      //   type: types.ADD_CARD_SUCCESS,
      //   payload: response.data
      // });
    }
  } catch (error) {
    await dispatch({
      type: types.ADD_CARD_ERROR,
      payload: { error: error?.response?.data?.error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const createCard = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
  };
  try {
    await dispatch(loaderState(true));
    let response = await createNewCard(payload);

    if (response.status === 200 && response.data.status) {
      returnState = {
        status: true,
      };

      dispatch(getCreditCards());
      dispatch(getUserProfileData());
    }
  } catch (error) {
    await dispatch({
      type: types.ADD_CARD_ERROR,
      payload: { error: error?.response?.data?.error },
    });
    dispatch(clearError());
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const logout = (path) => async (dispatch) => {
  let status = false;
  try {
    await dispatch(loaderState(true));
    let response = await logoutService();
    if (response.status === 200 || response.status === 204) {
      // Localstorage auth removal
      localStorage.removeItem('auth');
      await dispatch({
        type: types.LOGOUT_SUCCESS,
      });
      Router.replace(`/login?redirectFrom=${path}`);
    }
  } catch (error) {
    console.log(error, 'logout error');
  } finally {
    dispatch(loaderState(false));
  }
  return status;
};

export const changeDefaultCard = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
  };
  try {
    await dispatch(loaderState(true));
    let response = await defaultCard(payload);

    if (response.status === 200 && response.data.status) {
      returnState = {
        status: true,
      };

      dispatch(getCreditCards());
    }
  } catch (error) {
    console.log(error, 'card error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const deleteCard = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
  };
  try {
    await dispatch(loaderState(true));
    let response = await deletePayCard(payload);

    if (response.status === 200 && response.data.status) {
      returnState = {
        status: true,
      };

      dispatch(getCreditCards());
    }
  } catch (error) {
    console.log(error, 'delete card');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

/* 
------------------------------------------------------------
 HELPER ACTIONS
------------------------------------------------------------
*/

export const clearError = () => async (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: types.AUTH_CLEAR_ERRORS,
    });
  }, 3000);
};

export const setAuthApplicationStorage = (data) => {
  if (!isEmpty(data) && data.access_token && data.refresh_token) {
    let access_token = '',
      refresh_token = '';
    access_token = window.btoa(data.access_token);
    refresh_token = window.btoa(data.refresh_token);
    localStorage.setItem(
      'auth',
      JSON.stringify({ ...data, access_token, refresh_token })
    );
  }
};
