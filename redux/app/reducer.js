import * as types from './types';
import { DefaultLocation } from '../../util/config';

const initialState = {
  loaderCount: 0,
  timekitModalFlag: false,
  timekitWidget: null,
  productPricingArr: [],
  specialistArr: [],
  therapistObj: {},
  defaultLaunchedCities: [...DefaultLocation],
  initialLocation: {
    ...DefaultLocation[0],
  },
  googleMapLoaded: false,
  therapistReview: {
    loader: false,
    reviews: {},
  },
  projectProcingPerTherapist: [],
  therapistPerAvailability: [],
  therapistIndividual: {},
  error: false,
  message: null,
  appoinmentBooked: {},
  bookingList: [],
  bookingDetail: {},
  bookingModify: {},
  guestList: [],
  intakeFormList: [],
  intakeFormDetail: {},
  covidFormDetail: {},
};

export default (state = initialState, { type, payload, cache }) => {
  switch (type) {
    case types.LOADER_INCREMENT:
      return {
        ...state,
        loaderCount: state.loaderCount + 1,
      };
    case types.LOADER_DECREMENT:
      return {
        ...state,
        loaderCount: state.loaderCount - 1,
      };
    case types.INITIALIZE_TIMEKIT_WIDGET:
      return {
        ...state,
        timekitWidget: payload,
        timekitModalFlag: null,
      };
    case types.TIMEKIT_MODAL_HANDLER:
      return {
        ...state,
        timekitModalFlag: payload,
      };
    case types.GOOGLEMAP_INITIALIZE:
      return {
        ...state,
        googleMapLoaded: payload.data,
      };
    case types.PRODUCTS_PRICE_INITIALIZE:
      if (cache) {
        return {
          ...state,
          productPricingArr: [...state.productPricingArr],
          error: false,
          message: null,
        };
      }
      return {
        ...state,
        productPricingArr: [],
        error: false,
        message: null,
      };
    case types.PRODUCTS_PRICE_SUCCESS:
      return {
        ...state,
        productPricingArr: payload.data,
        error: false,
        message: 'Success',
      };
    case types.PRODUCTS_PRICE_ERROR:
      return {
        ...state,
        productPricingArr: [...state.productPricingArr],
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.MANAGER_SPECIALIST_INITIALIZE:
      if (cache) {
        return {
          ...state,
          specialistArr: [...state.specialistArr],
          error: false,
          message: null,
        };
      }
      return {
        ...state,
        specialistArr: [],
        error: false,
        message: null,
      };
    case types.MANAGER_SPECIALIST_SUCCESS:
      return {
        ...state,
        specialistArr: payload.data,
        error: false,
        message: 'Success',
      };
    case types.MANAGER_SPECIALIST_ERROR:
      return {
        ...state,
        specialistArr: [...state.specialistArr],
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.THERAPIST_LISTING_INITIALIZE:
      if (cache) {
        return {
          ...state,
          therapistObj: { ...state.therapistObj },
          error: false,
          message: null,
        };
      }
      return {
        ...state,
        therapistObj: {},
        error: false,
        message: null,
      };
    case types.THERAPIST_LISTING_SUCCESS:
      return {
        ...state,
        therapistObj: payload.data,
        error: false,
        message: 'Success',
      };
    case types.THERAPIST_LISTING_ERROR:
      return {
        ...state,
        therapistObj: { ...state.therapistObj },
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.GET_REVIEWS_INITIALIZE:
      return {
        ...state,
        therapistReview: {
          loader: true,
          reviews: { ...state.therapistReview.reviews },
        },
        error: false,
        message: null,
      };
    case types.GET_REVIEWS_SUCCESS:
      return {
        ...state,
        therapistReview: {
          loader: false,
          reviews: payload.data,
        },
        error: false,
        message: 'Success',
      };
    case types.GET_REVIEWS_ERROR:
      return {
        ...state,
        therapistReview: {
          loader: false,
          reviews: {},
        },
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.GET_PROJECT_PRICING_THERAPIST_INITIALIZE:
      return {
        ...state,
        projectProcingPerTherapist: [],
        error: false,
        message: null,
      };
    case types.GET_PROJECT_PRICING_THERAPIST_SUCCESS:
      return {
        ...state,
        projectProcingPerTherapist: payload.data,
        error: false,
        message: 'Success',
      };
    case types.GET_PROJECT_PRICING_THERAPIST_ERROR:
      return {
        ...state,
        projectProcingPerTherapist: [],
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.GET_BOOKING_DATA_INITIALIZE:
      return {
        ...state,
        bookingList: [],
        error: false,
        message: null,
      };
    case types.GET_BOOKING_DATA_SUCCESS:
      return {
        ...state,
        bookingList: payload.data,
        error: false,
        message: 'Success',
      };
    case types.GET_BOOKING_DATA_ERROR:
      return {
        ...state,
        bookingList: [],
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.THERAPIST_PER_AVALIABILITY_INITIALIZE:
      return {
        ...state,
        therapistPerAvailability: [],
        error: false,
        message: null,
      };
    case types.THERAPIST_PER_AVALIABILITY_SUCCESS:
      return {
        ...state,
        therapistPerAvailability: payload.data,
        error: false,
        message: 'Success',
      };
    case types.THERAPIST_PER_AVALIABILITY_ERROR:
      return {
        ...state,
        therapistPerAvailability: [],
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.THERAPIST_PER_DATA_INITIALIZE:
      return {
        ...state,
        therapistIndividual: {},
        error: false,
        message: null,
      };
    case types.THERAPIST_PER_DATA_SUCCESS:
      return {
        ...state,
        therapistIndividual: payload.data,
        error: false,
        message: 'Success',
      };
    case types.THERAPIST_PER_DATA_ERROR:
      return {
        ...state,
        therapistIndividual: {},
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    case types.LAUNCHED_CITIES_SUCCESS:
      return {
        ...state,
        defaultLaunchedCities: [...payload.data],
      };
    case types.BOOKING_DETAIL_SUCCESS:
      return {
        ...state,
        bookingDetail: payload.data,
      };
    case types.BOOK_APPOINMENT_SUCCESS:
      return {
        ...state,
        appoinmentBooked: payload.data,
      };
    case types.INITIATE_MODIFY_BOOKING_SUCCESS:
      return {
        ...state,
        bookingModify: payload.data,
      };
    case types.CANCLE_BOOKING_ERROR:
      return {
        ...state,
        error: payload.error,
      };
    case types.INITIATE_MODIFY_BOOKING_ERROR:
      return {
        ...state,
        error: payload.error,
      };
    case types.GET_BOOKING_GUEST_SUCCESS:
      return {
        ...state,
        guestList: payload.data,
      };
    case types.GET_DISCOUNT_VALID_SUCCESS:
      return {
        ...state,
        guestList: payload.data,
      };
    case types.BLOCK_THERAPIST_DATA:
      return {
        ...state,
        projectProcingPerTherapist: [],
        therapistPerAvailability: [],
        therapistIndividual: {},
        therapistReview: {
          loader: false,
          reviews: {},
        },
      };
    case types.GET_INTAKE_FORM_SUCCESS:
      return {
        ...state,
        intakeFormList: payload.data,
      };
    case types.GET_INTAKE_FORM_DETAIL_SUCCESS:
      return {
        ...state,
        intakeFormDetail: payload,
      };
    case types.GET_COVID_FORM_DETAIL_SUCCESS:
      return {
        ...state,
        covidFormDetail: payload,
      };
    case types.ADD_INTAKE_FORM_SUCCESS:
      return {
        ...state,
        error: false,
        message: 'Success',
      };

    case types.CLEAR_INTAKE_FORM_SUCCESS:
      return {
        ...state,
        intakeFormDetail: {},
      };
    case types.APP_CLEAR_ERROR:
      return {
        ...state,
        error: false,
      };

    case types.ADD_INTAKE_FORM_ERROR:
      return {
        ...state,
        error: payload.error,
        message: payload.message || 'Server runtime error',
      };
    default:
      return state;
  }
};
