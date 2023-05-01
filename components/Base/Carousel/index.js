import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Carousel from 'react-bootstrap/Carousel';
import StyledCarousel from './carousel.style.js';

export default function CustomCarousel({ children, className, ...props }) {
  return (
    <StyledCarousel
      {...props}
      className={cx(className)}
      prevIcon={
        <span className="carousel-control-prev-icon" aria-hidden="true">
          <img src="/images/left.svg" />
        </span>
      }
      nextIcon={
        <span className="carousel-control-next-icon" aria-hidden="true">
          <img src="/images/right.svg" />
        </span>
      }
    >
      {children}
    </StyledCarousel>
  );
}

export const CarouselItem = Carousel.Item;
export const CarouselCaption = Carousel.Caption;

CustomCarousel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
