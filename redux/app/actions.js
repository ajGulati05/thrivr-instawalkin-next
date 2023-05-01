import * as types from './types';
import { statusCheck } from 'util/config';
import isEmpty from 'lodash.isempty';
import {
  getProjectPricing,
  getEndorsement,
  getManagerEndorsement,
  getReviews,
  getProjectPerTherapist,
  getPerTherapistData,
  getPerTherapistAvailability,
  bookAppointment,
  getSpecialities,
  getListedTherapists,
  getDiscountValid,
  getTeamListedTherapists,
  launchedCities,
  getBookingsList,
  bookingTip,
  bookingReceipt,
  addReviews,
  bookingDetail,
  initiateModifyAppointment,
  cancleAppointment,
  createGuests,
  getGuests,
  getRequestDemoSlot,
  setRequestDemoSlot,
  getIntakeFormsService,
  getCovidFormsService,
  intakeFormGrantService,
  covidFormGrantService,
  rescheduleAppointment,
  intakeFormDetailGrantService,
  consentIntakeFormService,
  covidFormDetailGrantService,
  consentCovidFormService,
  getEmailSignedUrlService,
  intakeFormGrantNoAuthService,
  intakeFormDetailGrantNoAuthService,
  covidFormDetailGrantNoAuthService,
} from 'services';
/* Loader Action */
export const loaderState = (payload) => async (dispatch) => {
  if (payload) {
    await dispatch({
      type: types.LOADER_INCREMENT,
    });
  } else {
    await dispatch({
      type: types.LOADER_DECREMENT,
    });
  }
};

export const handleTimekitModal = (payload, widget = null) => async (
  dispatch
) => {
  dispatch({
    type: types.TIMEKIT_MODAL_HANDLER,
    payload,
  });
  if (payload) {
    document.body.classList.add('modal-open');
    widget.init({
      app_key: process.env.TIMEKIT_BOOKING_APP_KEY,
      project_id: process.env.TIMEKIT_BOOKING_PROJECT_ID,
    });
  } else {
    document.body.classList.remove('modal-open');
  }
};

export const initializeTimekitWidget = (payload) => async (dispatch) => {
  dispatch({
    type: types.INITIALIZE_TIMEKIT_WIDGET,
    payload,
  });
};

export const googleMapInitial = (payload) => async (dispatch) => {
  dispatch({
    type: types.GOOGLEMAP_INITIALIZE,
    payload: { data: payload },
  });
};

export const getProductAndPricing = (payload, cache = false) => async (
  dispatch
) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.PRODUCTS_PRICE_INITIALIZE,
      cache,
    });
    let response = await getProjectPricing();

    if (statusCheck(response)) {
      await dispatch({
        type: types.PRODUCTS_PRICE_SUCCESS,
        payload: { data: response.data.data },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.PRODUCTS_PRICE_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getDefaultCities = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await launchedCities(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.LAUNCHED_CITIES_SUCCESS,
        payload: { data: response.data.data },
      });
      returnState = {
        status: true,
        message: response.data.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getBookingDetail = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await bookingDetail(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.BOOKING_DETAIL_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getBookingGuests = () => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await getGuests();
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_BOOKING_GUEST_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getValidDiscount = () => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await getDiscountValid();
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_DISCOUNT_VALID_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getRequestDemo = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await getRequestDemoSlot(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_REQUEST_DEMO_SUCCESS,
        payload: response.data.data,
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getIntakeForms = () => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await getIntakeFormsService();
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_INTAKE_FORM_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getIntakeFormsDetail = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await intakeFormDetailGrantService(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_INTAKE_FORM_DETAIL_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getIntakeFormsDetailNoAuth = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await intakeFormDetailGrantNoAuthService(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_INTAKE_FORM_DETAIL_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getCovidFormsDetail = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await covidFormDetailGrantNoAuthService(payload);
    if (response.status === 200) {
      await dispatch({
        type: types.GET_COVID_FORM_DETAIL_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const consentIntakeForm = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await consentIntakeFormService(payload);
    if (response?.status) {
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const consentCovidForm = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await consentCovidFormService(payload);
    if (statusCheck(response)) {
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};
export const getCovidForms = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await getCovidFormsService(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_COVID_FORM_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getEmailSignedUrl = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await getEmailSignedUrlService(payload);
    if (statusCheck(response)) {
      //console.log(response)
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch redux error');
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getManagerSpecialities = (cache = false) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.MANAGER_SPECIALIST_INITIALIZE,
      cache,
    });
    let response = await getSpecialities();

    if (statusCheck(response)) {
      await dispatch({
        type: types.MANAGER_SPECIALIST_SUCCESS,
        payload: { data: response.data.data },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.MANAGER_SPECIALIST_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getTherapists = (payload, cache = false) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };

  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.THERAPIST_LISTING_INITIALIZE,
      cache,
    });
    let response = await getListedTherapists(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.THERAPIST_LISTING_SUCCESS,
        payload: { data: response.data.data },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.THERAPIST_LISTING_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getTeamTherapists = (payload, cache = false) => async (
  dispatch
) => {
  let returnState = {
    status: false,
    data: null,
  };

  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.THERAPIST_LISTING_INITIALIZE,
      cache,
    });
    let response = await getTeamListedTherapists(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.THERAPIST_LISTING_SUCCESS,
        payload: { data: response.data.data },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.THERAPIST_LISTING_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getTherapistReview = (payload, cache = false) => async (
  dispatch
) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch({
      type: types.GET_REVIEWS_INITIALIZE,
      cache,
    });
    let response = await getReviews(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_REVIEWS_SUCCESS,
        payload: { data: response.data.data },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.GET_REVIEWS_ERROR,
      payload: { error },
    });
  }
  return returnState;
};

export const getProjectPricingPerTherapist = (payload, cache = false) => async (
  dispatch
) => {
  let returnState = {
    status: false,
    data: null,
  };

  try {
    dispatch(loaderState(true));
    await dispatch({
      type: types.GET_PROJECT_PRICING_THERAPIST_INITIALIZE,
      cache,
    });
    let response = await getProjectPerTherapist(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_PROJECT_PRICING_THERAPIST_SUCCESS,
        payload: { data: response.data.data },
      });

      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.GET_PROJECT_PRICING_THERAPIST_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));

  return returnState;
};

export const getAllEndorsements = () => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    let response = await getEndorsement();
    if (statusCheck(response)) {
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch error');
  }
  dispatch(loaderState(false));
  return returnState;
};

export const getManagerSpecificEndorsements = (params) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    let response = await getManagerEndorsement(params);
    if (statusCheck(response)) {
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    console.log(error, 'catch error');
  }
  dispatch(loaderState(false));
  return returnState;
};

export const getTherapistAvailability = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    await dispatch({
      type: types.THERAPIST_PER_AVALIABILITY_INITIALIZE,
    });
    let response = await getPerTherapistAvailability(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.THERAPIST_PER_AVALIABILITY_SUCCESS,
        payload: { data: response.data.data },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.THERAPIST_PER_AVALIABILITY_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const bookMassageAppoinment = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    await dispatch({
      type: types.BOOK_APPOINMENT_INITIALIZE,
    });
    let response = await bookAppointment(payload);
    if (response.status == 201) {
      returnState = {
        status: true,
        data: response.data,
      };
    }
    if (statusCheck(response)) {
      await dispatch({
        type: types.BOOK_APPOINMENT_SUCCESS,
        payload: response,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.BOOK_APPOINMENT_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const setRequestDemo = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    let response = await setRequestDemoSlot(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.REQUEST_DEMO_SUCCESS,
        payload: response,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.REQUEST_DEMO_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const createIntakeFormAuth = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await intakeFormGrantService(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.ADD_INTAKE_FORM_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.ADD_INTAKE_FORM_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const clearIntakeFormData = () => async (dispatch) => {
  dispatch({
    type: types.CLEAR_INTAKE_FORM_SUCCESS,
  });
};

export const createIntakeFormNoAuth = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await intakeFormGrantNoAuthService(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.ADD_INTAKE_FORM_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.ADD_INTAKE_FORM_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const createCovidFormAuth = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    let response = await covidFormGrantService(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.ADD_COVID_FORM_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.ADD_COVID_FORM_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const getBookingData = (cache = false) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    await dispatch(loaderState(true));
    await dispatch({
      type: types.GET_BOOKING_DATA_INITIALIZE,
      cache,
    });
    let response = await getBookingsList();
    if (statusCheck(response)) {
      await dispatch({
        type: types.GET_BOOKING_DATA_SUCCESS,
        payload: response.data,
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.GET_BOOKING_DATA_ERROR,
      payload: { error },
    });
  } finally {
    dispatch(loaderState(false));
  }
  return returnState;
};

export const addBookingTip = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
    error: null,
  };
  try {
    dispatch(loaderState(true));
    await dispatch({
      type: types.ADD_BOOKING_TIP_INITIALIZE,
    });
    let response = await bookingTip(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.ADD_BOOKING_TIP_SUCCESS,
        payload: response,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    returnState = {
      error: { error }.error.response.data.message,
    };
    dispatch({
      type: types.ADD_BOOKING_TIP_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const cancleBookingAppointment = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
  };
  try {
    dispatch(loaderState(true));
    let response = await cancleAppointment(payload);
    if (statusCheck(response)) {
      returnState = {
        status: true,
      };
    }
  } catch (error) {
    dispatch({
      type: types.CANCLE_BOOKING_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const rescheduleBookingAppointment = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    let response = await rescheduleAppointment(payload);
    if (statusCheck(response)) {
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.CANCLE_BOOKING_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const InitiateModifyBookingAppointment = (payload) => async (
  dispatch
) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    let response = await initiateModifyAppointment(payload);
    if (statusCheck(response)) {
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.INITIATE_MODIFY_BOOKING_ERROR,
      payload: { error: error.response?.data?.message ?? error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const addTherapistReview = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
    error: null,
  };
  try {
    dispatch(loaderState(true));
    let response = await addReviews(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.ADD_REVIEW_SUCCESS,
        payload: response,
      });
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    if (!isEmpty({ error }?.error?.response?.data?.errors?.comment)) {
      returnState = {
        error: { error }.error.response?.data?.errors?.comment[0],
      };
    } else {
      returnState = {
        error: { error }?.error?.response?.data?.errors,
      };
    }
    dispatch({
      type: types.ADD_REVIEW_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const blockTherapistData = () => async (dispatch) => {
  try {
    dispatch(loaderState(true));
    dispatch({
      type: types.BLOCK_THERAPIST_DATA,
    });
  } catch (error) {
    console.log(error, 'catch error');
  }
  dispatch(loaderState(false));
};

export const addBookingReceipt = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    msg: null,
  };
  try {
    dispatch(loaderState(true));
    await dispatch({
      type: types.ADD_BOOKING_RECEIPT_INITIALIZE,
    });
    let response = await bookingReceipt(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.ADD_BOOKING_RECEIPT_SUCCESS,
        payload: response,
      });
      returnState = {
        status: true,
        msg: response.data.message,
      };
    }
  } catch (error) {
    returnState = {
      error: { error }.error.response.data.message,
    };
    dispatch({
      type: types.ADD_BOOKING_RECEIPT_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const createBookingGuest = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    let response = await createGuests(payload);
    if (statusCheck(response)) {
      returnState = {
        status: true,
        data: response.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.ADD_BOOKING_GUEST_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

export const getTherapistData = (payload) => async (dispatch) => {
  let returnState = {
    status: false,
    data: null,
  };
  try {
    dispatch(loaderState(true));
    await dispatch({
      type: types.THERAPIST_PER_DATA_INITIALIZE,
    });
    let response = await getPerTherapistData(payload);
    if (statusCheck(response)) {
      await dispatch({
        type: types.THERAPIST_PER_DATA_SUCCESS,
        payload: {
          data: Array.isArray(response.data.data)
            ? response.data.data[0]
            : response.data.data,
        },
      });
      returnState = {
        status: true,
        data: response.data.data,
      };
    }
  } catch (error) {
    dispatch({
      type: types.THERAPIST_PER_DATA_ERROR,
      payload: { error },
    });
  }
  dispatch(loaderState(false));
  return returnState;
};

/* CLEAR APP ERROR ACTION */
export const clearAppErrorAction = () => async (dispatch) => {
  dispatch({
    type: types.APP_CLEAR_ERROR,
  });
};
