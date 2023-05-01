import React from 'react';
import * as moment from 'moment';

export const breakpoints = {
  s: '400px',
  xs: '575px',
  sm: '767px',
  md: '991px',
  lg: '1199px',
};

export const theme = {
  color: {
    white: '#fff',
    pink: '#ff7271',
    lightGray: '#969696',
    tan: '#fffaf2',
    textColor: '#3c4042',
    gray: '#383838',
    slotcolor: '#6fcad829',
  },

  respondToMax: (point) => `@media (max-width: ${breakpoints[point]})`,
  respondToMin: (point) => `@media (min-width: ${breakpoints[point]})`,

  transition: (time = 0.4) => `
  transition: all ${time}s ease;
  -webkit-transition: all ${time}s ease;
  -moz-transition: all ${time}s ease;`,

  borderRadius: (size = '30px') => `
  border-radius: ${size};
  -webkit-border-radius: ${size};
  -moz-border-radius: ${size};
`,
};

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
export const cardRegex = /(\d{4})-(\d{4})-(\d{4})-(\d{4})/;
export const timezoneRegexFormat = /\//gi;
export const passwordRegex = /^.{6,}$/;

export const variantFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
  exit: { opacity: 0 },
};

export const statusCheck = (response) => {
  if (
    (response.status === 200 ||
      response.status === 201 ||
      response.status === 204) &&
    response.data.status
  )
    return true;
  return false;
};

export const formatDate = (date) => {
  if (date instanceof Date)
    if (date instanceof Date) return moment(date).format('YYYY-M-DD HH:mm:ss');

  return false;
};

export const DefaultLocation = [
  {
    id: 1,
    city_name: 'Saskatoon',
    latitude: '52.102026011211',
    longitude: '-106.5695715',
    status: true,
    created_at: '2020-06-24T01:18:27.000000Z',
    updated_at: '2020-06-24T01:57:22.000000Z',
    timezone: 'America/Regina',
  },
  {
    id: 2,
    city_name: 'Regina',
    latitude: '50.448362103556',
    longitude: '-104.59517',
    status: true,
    created_at: '2020-06-24T01:18:46.000000Z',
    updated_at: '2020-06-24T01:57:12.000000Z',
    timezone: 'America/Regina',
  },
];

export function useStateCallback(initialState, callback) {
  const [state, set] = React.useState(initialState);
  const ref = React.useRef(false);

  React.useEffect(() => {
    if (ref.current === false) {
      ref.current = true;
    } else {
      callback(state);
    }
  }, [state]);

  return [state, set];
}

export const gEvent = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const formatYearDate = (date) => {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

export const changeDateFormat = (current_datetime) => {
  let formatted_date =
    current_datetime.getFullYear() +
    '-' +
    (current_datetime.getMonth() + 1) +
    '-' +
    current_datetime.getDate() +
    ' ' +
    current_datetime.getHours() +
    ':' +
    current_datetime.getMinutes() +
    ':' +
    current_datetime.getSeconds();
  return formatted_date;
};
