import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import RequestDemo from 'components/Views/Common/requestDemo';
import AuthCheck from 'components/AuthCheck';
import { googleMapInitial } from 'redux/app/actions';

/* eslint-disable */
function CustomApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    window.initMap = initMap;
    const gmapScriptEl = document.createElement(`script`);
    gmapScriptEl.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.ADDRESS_AUTOCOMPLETE_API_KEY}&libraries=places&callback=initMap`;
    document
      .querySelector(`body`)
      .insertAdjacentElement(`beforeend`, gmapScriptEl);
  }, []);

  const initMap = () => {
    dispatch(googleMapInitial(true));
  };

  return (
    <>
      <AuthCheck />
      <RequestDemo />
    </>
  );
}

export default CustomApp;
