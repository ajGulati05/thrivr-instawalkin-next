import styled from 'styled-components';
import Carousel from 'react-bootstrap/Carousel';

const StyledCarousel = styled(Carousel)`
  &.carousel {
    .carousel-inner {
      max-width: 760px;
      padding: 40px 0px 35px;
      margin: auto;
      .img {
        height: 48px;
        width: 48px;
        border-radius: 50%;
        overflow: hidden;
        margin: auto;
      }
      p {
        font-size: 18px;
        line-height: 1.44;
        margin-bottom: 32px;
      }
      .name {
        font-size: 14px;
        font-family: 'Muli-Bold';
        color: ${(props) => props.theme.color.gray};
        opacity: 0.8;
        margin-top: 12px;
      }
    }
    .carousel-control-prev,
    .carousel-control-next {
      bottom: auto;
      border-radius: 20px;
      box-shadow: 0 2px 6px 0 rgba(60, 64, 66, 0.08);
      background-color: #ffffff;
      width: 40px;
      height: 40px;
      opacity: 1;
      top: 60px;
      span {
        width: auto;
        height: auto;
        background: none;
      }
    }
    .carousel-control-prev {
      left: 73px;
    }
    .carousel-control-next {
      right: 73px;
    }
  }

  ${(props) => props.theme.respondToMax('lg')} {
    &.carousel {
      .carousel-inner {
        max-width: 680px;
        padding: 40px 0 20px;
        p {
          font-size: 16px;
          margin-bottom: 28px;
        }
      }
      .carousel-control-prev {
        left: 30px;
      }
      .carousel-control-next {
        right: 30px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('md')} {
    &.carousel {
      .carousel-inner {
        max-width: 469px;
        padding: 20px 0 0px;
        p {
          font-size: 14px;
          margin-bottom: 24px;
        }
      }
      .carousel-control-prev {
        left: 0px;
      }
      .carousel-control-next {
        right: 0px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    &.carousel {
      .carousel-control-prev {
        left: -25px !important;
      }
      .carousel-control-next {
        right: -25px !important;
      }
    }
  }

  ${(props) => props.theme.respondToMax('xs')} {
    &.carousel {
      .carousel-control-prev,
      .carousel-control-next {
        display: none;
      }
      .carousel-indicators {
        bottom: -30px;
        li {
          display: inline-block;
          height: 5px;
          width: 5px;
          border-radius: 50%;
          opacity: 0.4;
          background-color: ${(props) => props.theme.color.textColor};
          border: none;
          margin-top: 15px;
          &.active {
            opacity: 1;
          }
        }
      }
      .carousel-inner {
        padding: 12px 0 0px;
        p {
          line-height: 1.29;
          margin-bottom: 20px;
        }
      }
    }
  }
`;

export default StyledCarousel;
