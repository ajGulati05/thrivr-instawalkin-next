import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'next/link';
import StyledFooter from './footer.style.js';

export default function CustomFooter({ className, ...props }) {
  return (
    <StyledFooter {...props} className={cx(className)}>
      <div className="container">
        <div className="d-flex justify-content-between flex-wrap">
          <div className="mob-full">
            <div className="logo">
              <Link href="/">
                <a>
                  <div className="logo-footer" />
                </a>
              </Link>
            </div>
            {/* App Store and Google Play Store links are hidden for now, do not delete. */}
            {/* <div className="download-from">
              <a
                href="https://itunes.apple.com/us/app/instawalkin/id1409256502?ls=1&mt=8"
                target="__blank"
              >
                <img src="/images/appstore.svg" />
              </a>
              <br />
              <a
                href="https://play.google.com/store/apps/details?id=com.instawalkin.instawalkin"
                target="__blank"
              >
                <img src="/images/google-play.svg" />
              </a>
            </div> */}
          </div>
          <div className="mob-half">
            <h4 className="sub-title">Company</h4>
            <ul className="list-unstyled mb-0">
              {/* commented out temporarily */}
              {/* <li>
                <Link href="">
                  <a>About</a>
                </Link>
              </li> */}
              <li>
                <Link href="/become-a-partner">
                  <a>For therapists</a>
                </Link>
              </li>
              {/* commented out temporarily */}
              {/* <li>
                <Link href="">
                  <a>Blog</a>
                </Link>
              </li> */}
              <li>
                <Link href="/contact-us">
                  <a>Contact</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="mob-half">
            <h4 className="sub-title">Legal</h4>
            <ul className="list-unstyled mb-0">
              <li>
                <a
                  href="https://thrivr-bucket.s3.ca-central-1.amazonaws.com/Policies/ThrivrTermsofService.pdf"
                  target="__blank"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="https://thrivr-bucket.s3.ca-central-1.amazonaws.com/Policies/ThrivrPrivacyPolicy.pdf"
                  target="__blank"
                >
                  Privacy
                </a>
              </li>
            </ul>
          </div>
          <div className="mob-full">
            <h4 className="sub-title">Contact us</h4>
            <ul className="list-unstyled mb-0 contact-us">
              <li>
                <a href="mailto:team@thrivr.ca">team@thrivr.ca</a>
              </li>
              <li>
                <a href="tel:+18559432256">+1 855-943-2256</a>
              </li>
            </ul>
            <div className="social-icons">
              <ul className="list-unstyled list-inline">
                <li className="list-inline-item">
                  <a
                    className="footer-links mx-1"
                    href="https://www.facebook.com/thrivrmassage"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-facebook-f" aria-hidden="true"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a
                    className=" mx-1"
                    href="https://twitter.com/thrivrmassage/"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-twitter" aria-hidden="true"></i>
                  </a>
                </li>

                <li className="list-inline-item">
                  <a
                    className="footer-links mx-1"
                    href="https://www.instagram.com/thrivrmassage"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <i className="fab fa-instagram" aria-hidden="true"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StyledFooter>
  );
}

CustomFooter.propTypes = {
  className: PropTypes.string,
};
