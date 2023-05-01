import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useDispatch, useSelector } from 'react-redux';
import Nav from 'react-bootstrap/Nav';
import cx from 'classnames';
import { useWindowWidth } from '@react-hook/window-size';
import Link from 'next/link';
import Button from 'components/Base/Button';
import StyledHeader from './header.style.js';
import { handleTimekitModal } from 'redux/app/actions';
import { logout } from 'redux/auth/actions';
import { SeperatorStyle } from '../StyleComponent';
import isEmpty from 'lodash.isempty';

const CustomToggle = React.forwardRef(
  ({ children, onClick, className }, ref) => (
    <a
      href=""
      className={cx(className)}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </a>
  )
);

CustomToggle.displayName = 'CustomToggle';

CustomToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
export default function CustomHeader({ className, activeLink, hamburgerIcon }) {
  let dispatch = useDispatch();
  let widthWindow = useWindowWidth();
  const router = useRouter();
  const timekitWidget = useSelector((state) => state.app.timekitWidget);
  const authenticated = useSelector((state) => state.auth.authenticated);
  const userProfile = useSelector((state) => state.auth.userProfile);

  let [navExpand, setNavExpand] = useState(false);
  let [selectedLink, setSelectedLink] = useState(activeLink);

  const handleRequestDemoClick = () => {
    dispatch(handleTimekitModal(true, timekitWidget));
  };

  const handleToggle = (data) => {
    setNavExpand(data);
  };

  const handleInternalNavigation = () => {
    if (widthWindow <= 767) {
      handleToggle(false);
    }
  };

  Router.events.on('hashChangeComplete', (url) => {
    if (url && url.includes('#faq')) {
      setSelectedLink('faq');
    }
    if (url && url.includes('#pricing')) {
      setSelectedLink('pricing');
    }
  });

  useEffect(() => {
    if (!isEmpty(router) && router.asPath.includes('#faq')) {
      setSelectedLink('faq');
    }
    if (!isEmpty(router) && router.asPath.includes('#pricing')) {
      setSelectedLink('pricing');
    }
  }, [router, selectedLink]);

  const handleLogout = () => {
    dispatch(logout(router.asPath || '/'));
  };

  const handleCollapse = (data) => {
    if (!isEmpty(router) && router.asPath.includes(data.toLowerCase())) {
      setNavExpand(false);
    }
  };

  let newAsPath = '/';
  if (!isEmpty(router) && !isEmpty(router.query.redirectFrom)) {
    const index = router.asPath.indexOf('redirectFrom=') + 13;
    newAsPath = router.asPath.substring(index);
  }

  return (
    <StyledHeader className={cx(className, { open: navExpand })}>
      <Navbar expand="md" onToggle={handleToggle} expanded={navExpand}>
        <Link href="/">
          <a className="navbar-brand">
            <div className="logo-header" />
          </a>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon">
            {navExpand ? (
              <img src="/images/nav-pink.svg" className="pink" />
            ) : hamburgerIcon === 'white' ? (
              <img src="/images/nav.svg" className="white" />
            ) : (
              <img src="/images/nav-pink.svg" className="pink" />
            )}
          </span>
        </Navbar.Toggle>
        <Navbar.Collapse
          className={authenticated ? 'loged-in' : ''}
          id="basic-navbar-nav"
        >
          <Nav className="w-100">
            {activeLink !== 'For therapist' ? (
              <Nav.Item>
                <Dropdown className="menu-icon">
                  <Dropdown.Toggle className="nav-link" as={CustomToggle}>
                    For therapist
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Link href="/become-a-partner">
                      <a className="dropdown-item">Become a Partner</a>
                    </Link>
                    <Link href="/become-a-partner#pricing">
                      <a className="dropdown-item">Pricing</a>
                    </Link>
                    <a className="dropdown-item" href={process.env.LOGIN_URL}>
                      Partner Login
                    </a>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>
            ) : (
              <>
                <Nav.Item>
                  <a
                    className={cx('nav-link', {
                      active: 'Partner Login' === selectedLink,
                    })}
                    href={process.env.LOGIN_URL}
                  >
                    Partner Login
                  </a>
                </Nav.Item>
                <Nav.Item onClick={handleInternalNavigation}>
                  <Link href="#pricing">
                    <a
                      className={cx('nav-link', {
                        active: 'pricing' === selectedLink,
                      })}
                    >
                      Pricing
                    </a>
                  </Link>
                </Nav.Item>
              </>
            )}
            <Nav.Item onClick={handleInternalNavigation}>
              <Link href={activeLink === 'For therapist' ? '#faq' : '/#faq'}>
                <a
                  className={cx('nav-link', {
                    active: 'faq' === selectedLink,
                  })}
                >
                  FAQ
                </a>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link href="/contact-us">
                <a
                  className={cx('nav-link', {
                    active: 'Contact' === selectedLink,
                  })}
                >
                  Contact
                </a>
              </Link>
            </Nav.Item>
            {/* commented out temporarily */}
            {/* <Nav.Item>
              <Link href="">
                <a
                  className={cx('nav-link', {
                    active: 'Blog' === selectedLink,
                  })}
                >
                  Blog
                </a>
              </Link>
            </Nav.Item> */}

            {!authenticated ? (
              <>
                <Nav.Item className="ml-auto">
                  <Link
                    href={`/login?redirectFrom=${
                      router.pathname === '/login' ||
                      router.pathname === '/signup'
                        ? !isEmpty(router.query) && router.query.redirectFrom
                          ? newAsPath
                          : '/'
                        : router.asPath || '/'
                    }`}
                  >
                    <a
                      className={cx('nav-link', {
                        active: 'Login' === selectedLink,
                      })}
                      onClick={() => handleCollapse('login')}
                    >
                      Log in
                    </a>
                  </Link>
                </Nav.Item>
                <Nav.Item className="mr-0">
                  {activeLink === 'For therapist' ? (
                    <Link href="/request-demo">
                      <Button className="last-btn">Book A demo</Button>
                    </Link>
                  ) : (
                    <Link
                      href={`/signup?redirectFrom=${
                        router.pathname === '/login' ||
                        router.pathname === '/signup'
                          ? !isEmpty(router.query) && router.query.redirectFrom
                            ? newAsPath
                            : '/'
                          : router.asPath || '/'
                      }`}
                    >
                      <a>
                        <Button
                          className="last-btn"
                          onClick={() => {
                            /* FBP signup */
                            // window.fbq('trackCustom', 'signup', {
                            //   actionItem: 'button',
                            //   data: null,
                            //   event_label: 'standard',
                            //   event_category: 'impressions',
                            // });

                            // /* Gtag signup */
                            // window.gtag('event', 'signup', {
                            //   event_category: 'impressions',
                            //   event_label: 'standard',
                            //   actionItem: 'button',
                            //   data: null,
                            // });
                            handleCollapse('signup');
                          }}
                        >
                          Sign up
                        </Button>
                      </a>
                    </Link>
                  )}
                </Nav.Item>
              </>
            ) : (
              <Nav.Item className="ml-auto user-profile">
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle}>
                    <span className="profile-img">
                      {!isEmpty(userProfile) && userProfile.avatar ? (
                        <img src={userProfile.avatar} />
                      ) : (
                        <img src="/images/avatar.png" />
                      )}
                    </span>
                    {!isEmpty(userProfile)
                      ? `${userProfile.firstname} ${userProfile.lastname}`
                      : 'User'}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <div>
                      <Link href="/profile">
                        <a>Settings</a>
                      </Link>
                    </div>
                    <div>
                      <Link href="/order-history">
                        <a>Order history</a>
                      </Link>
                    </div>
                    <div>
                      <Link href="/intake-form">
                        <a>Intake froms</a>
                      </Link>
                    </div>
                    <SeperatorStyle className="seperator" />
                    <div>
                      <a onClick={handleLogout}>Log out</a>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </StyledHeader>
  );
}

CustomHeader.propTypes = {
  className: PropTypes.string,
  hamburgerIcon: PropTypes.string,
  activeLink: PropTypes.string,
};
