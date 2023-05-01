import React from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import FlipNumbers from 'react-flip-numbers';
import { MetricsBannerStyle } from './metricsBanner.style';

export default function MetricsBanner({ metricsBannerData }) {
  const noBookings =
    metricsBannerData.bookings === 0 || metricsBannerData.bookings === null
      ? true
      : false;

  return (
    <MetricsBannerStyle>
      <section className="city-banner-section metrics-wrapper">
        <Container className="text-center">
          <h3 className="title">
            {!noBookings
              ? metricsBannerData.message + ' ' + metricsBannerData.date
              : metricsBannerData.message}
          </h3>
          {!noBookings && (
            <div className="row">
              <div className="col-12 col-sm-6">
                <FlipNumbers
                  height={40}
                  width={40}
                  color="white"
                  background="inherit"
                  play
                  perspective={320}
                  numbers={metricsBannerData.bookings.toString()}
                />
                <h6 className="modal-title metrics-subtext">
                  Appointments Made
                </h6>
              </div>
              <div className="col-12 col-sm-6">
                <div className="row align-items-center justify-content-center">
                  <span className="dollar-sign">$</span>
                  <FlipNumbers
                    height={40}
                    width={40}
                    color="white"
                    background="inherit"
                    play
                    perspective={320}
                    numbers={metricsBannerData.amount_earned}
                  />
                </div>
                <h6 className="modal-title metrics-subtext">Amount Earned</h6>
              </div>
            </div>
          )}
        </Container>
      </section>
    </MetricsBannerStyle>
  );
}

MetricsBanner.propTypes = {
  metricsBannerData: PropTypes.object,
};
