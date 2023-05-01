import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkAuth,
  googleOauthInitialize,
  fbOauthInitialize,
} from 'redux/auth/actions';
import { clearAppErrorAction } from 'redux/app/actions';
import isEmpty from 'lodash.isempty';

export default function AuthCheck() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.auth.authenticated);
  const errorAppReducer = useSelector((state) => state.app.error);

  React.useEffect(() => {
    tokenExpiryCheck();

    // Google Gapi Load
    if (!isEmpty(window) && !isEmpty(window.gapi)) {
      let { gapi } = window;
      gapi.load('auth2', () => {
        let auth2 = gapi.auth2.init({
          client_id:
            '308403537706-2gco9u8kg9apsfaijkrnf8n8e9ds0622.apps.googleusercontent.com', // Needs to change
        });

        dispatch(googleOauthInitialize(auth2));
      });
    }

    // Facebook FB Load
    if (!isEmpty(window) && !isEmpty(window.FB)) {
      let { FB } = window;
      FB.init({
        appId: '2712210069037294', // Needs to change
        xfbml: false,
        version: 'v7.0',
      });

      dispatch(fbOauthInitialize(FB));
    }
  }, []);

  const tokenExpiryCheck = async () => {
    // Auth check
    await dispatch(checkAuth(authenticated, router.pathname || '/'));
  };

  React.useEffect(() => {
    if (!isEmpty(errorAppReducer)) {
      setTimeout(() => {
        dispatch(clearAppErrorAction());
      }, 3000);
    }
  }, [errorAppReducer]);

  return null;
}
