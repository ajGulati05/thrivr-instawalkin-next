import React from 'react';
import Router from 'next/router';

// Define your login route address.

/**
 * Check user authentication and authorization
 * It depends on you and your auth service provider.
 * @returns {{auth: null}}
 */
const checkUserAuthentication = () => {
  return { auth: null }; // change null to { isAdmin: true } for test it.
};

export default (WrappedComponent) => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  // let router = useRouter();
  // const login = `/login?redirectFrom=${router.pathname || '/'}`;
  hocComponent.getInitialProps = async ({ res, ...rest }) => {
    const userAuth = await checkUserAuthentication();

    // Are you an authorized user or not?
    if (!userAuth.auth) {
      // Handle server-side and client-side rendering.
      if (res) {
        res.writeHead(302, {
          Location: `login?redirectFrom=${rest.pathname || '/'}`,
        });
        res.end();
      } else {
        Router.replace(`/login?redirectFrom=${rest.pathname || '/'}`);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(userAuth);
      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return hocComponent;
};
