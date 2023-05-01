import styled from 'styled-components';

const TherapistStyleWrapper = styled.div`
  ${(props) => props.theme.respondToMax('xs')} {
    .description {
      padding-top: 10px;
    }
  }
  .tan-banner {
    padding: 94px 0 5px;
    background-color: ${(props) => props.theme.color.tan};
    overflow: hidden;
    .banner-details {
      color: ${(props) => props.theme.color.lightGray};
      padding: 0 25px;
      .main-title {
        font-family: 'Muli-Black';
        color: ${(props) => props.theme.color.pink};
        span {
          color: ${(props) => props.theme.color.textColor};
          font-family: 'Muli-Regular';
        }
      }
      p {
        font-size: 24px;
      }
      form {
        margin-top: 40px;
        input.is-invalid {
          background-position: right calc(0.9em + 0.1875rem) center;
        }
      }
    }
    .img-box {
      margin-top: 45px !important;
      .img-background {
        position: absolute;
        top: -10%;
        right: -20%;
        width: 40%;
      }
      .img-desktop {
        position: relative;
        ${(props) => props.theme.respondToMax('sm')} {
          right: 0%;
          width: 100% !important;
        }
      }
      .img-mobile {
        position: absolute;
        top: 5%;
        right: -2%;
        width: 44%;
      }
    }
    ${(props) => props.theme.respondToMax('lg')} {
      .banner-details {
        padding: 0 0 0 25px;
        p {
          font-size: 22px;
        }
        form {
          input {
            width: 250px !important;
          }
        }
      }
      .img-box {
        margin-top: 30px !important;
      }
    }
    ${(props) => props.theme.respondToMax('md')} {
      .banner-details {
        padding: 0;
        p {
          font-size: 20px;
          br {
            display: none;
          }
        }
        form {
          margin-top: 20px;
          input {
            width: 200px !important;
          }
        }
      }
    }
    ${(props) => props.theme.respondToMax('sm')} {
      padding: 114px 0 0px;
      .banner-details {
        form {
          margin-bottom: 20px;
          input {
            width: 300px !important;
          }
        }
      }
      .img-box {
        margin-top: 0px !important;
        .img-mobile {
          width: 44%;
          right: -2%;
        }
        .img-background {
          position: absolute;
          top: 30%;
          right: -50%;
          width: 200% !important;
        }
      }
    }
    ${(props) => props.theme.respondToMax('xs')} {
      .img-box {
        text-align: center !important;
        .img-mobile {
          position: relative;
          width: 379px;
          top: 2%;
          max-width: 80%;
          right: 0%;
        }
      }
    }
  }
  .video-section {
    padding: 70px 0;
    .video {
      margin-top: 40px;
      .title {
        margin-top: 20px;
      }
      a {
        color: ${(props) => props.theme.color.textColor};
        word-break: break-word;
        &:hover {
          text-decoration: none;
          color: ${(props) => props.theme.color.pink};
        }
      }
    }
    ${(props) => props.theme.respondToMax('lg')} {
      padding: 50px 0 10px;
    }
    ${(props) => props.theme.respondToMax('sm')} {
      .video {
        margin-top: 30px;
        iframe {
          width: 100%;
          height: 280px;
        }
      }
    }
  }
  .email-section {
    .form-control {
      width: 280px;
      display: inline-block;
      margin-right: 10px;
    }
    &:after {
      background-image: url(/images/pink-shape-quote.svg);
    }
    ${(props) => props.theme.respondToMax('md')} {
      .form-control {
        width: 330px;
      }
    }
    ${(props) => props.theme.respondToMax('xs')} {
      .form-control {
        width: 100%;
        margin-bottom: 15px;
      }
      button {
        width: 100%;
      }
    }
  }
  .pricing-section {
    padding: 40px 0 96px;
    .title {
      margin-bottom: 48px;
    }
    .box {
      padding: 32px;
      border-radius: 10px;
      box-shadow: 1px 20px 40px 0 rgba(60, 64, 66, 0.1);
      background-color: #ffffff;
      height: 100%;
      position: relative;
      .title {
        margin-bottom: 8px;
      }
      &.box-dark {
        background-color: ${(props) => props.theme.color.textColor};
        color: #fff;
        .title {
          color: ${(props) => props.theme.color.white};
        }
        ul {
          li:not(.free) {
            background-image: url(/images/done-pink.svg);
          }
        }
      }
      .pkg {
        font-size: 52px;
        font-family: 'Muli-Bold';
        span {
          opacity: 0.6;
          font-size: 18px;
          font-family: 'Muli-Regular';
        }
      }
      ul {
        margin-bottom: 88px;
        li {
          margin-top: 15px;
          padding-left: 30px;
          background-image: url(/images/done.svg);
          background-repeat: no-repeat;
        }
      }
      .box-btn {
        position: absolute;
        bottom: 32px;
        left: 32px;
        right: 32px;
      }
    }
    ${(props) => props.theme.respondToMax('lg')} {
      padding: 20px 0 40px;
      .box {
        padding: 24px;
        .pkg {
          font-size: 42px;
          span {
            font-size: 17px;
          }
        }
        ul {
          margin-bottom: 78px;
        }
        .box-btn {
          position: absolute;
          bottom: 24px;
          left: 24px;
          right: 24px;
        }
      }
    }
    ${(props) => props.theme.respondToMax('md')} {
      .box {
        padding: 15px;
        .pkg {
          font-size: 32px;
          span {
            font-size: 16px;
          }
        }
        ul {
          margin-bottom: 70px;
        }
        .box-btn {
          position: absolute;
          bottom: 15px;
          left: 15px;
          right: 15px;
          .btn {
            width: 100%;
          }
        }
      }
    }
    ${(props) => props.theme.respondToMax('sm')} {
      .title {
        margin-bottom: 35px;
      }
    }
    ${(props) => props.theme.respondToMax('xs')} {
      padding: 20px 0 0px;
      .title {
        margin-bottom: 20px;
      }
      .box-wrapper {
        margin-bottom: 15px;
        .box {
          padding: 12px;
          .pkg {
            span {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
  .review-section {
    padding: 96px 0;
    &:after {
      content: '';
      background-image: url(/images/green-quote-large.svg);
      height: 122px;
      width: 176px;
      bottom: 96px;
      right: 14%;
    }
    ${(props) => props.theme.respondToMax('lg')} {
      padding: 70px 0;
      &:after {
        height: 102px;
        width: 146px;
        bottom: 46px;
        right: 10%;
      }
    }
    ${(props) => props.theme.respondToMax('md')} {
      padding: 60px 0;
      &:after {
        height: 61px;
        width: 88px;
        bottom: 46px;
        right: 10%;
      }
    }
    ${(props) => props.theme.respondToMax('xs')} {
      padding: 48px 0 45px;
      &:after {
        height: 37px;
        width: 53px;
        bottom: 66px;
      }
    }
  }
  .faq {
    &:after {
      background-image: url(/images/shape-with-circle.svg);
      right: 0;
      left: auto;
      width: 240px;
      height: 356px;
      background-size: cover;
    }
    ${(props) => props.theme.respondToMax('lg')} {
      &:after {
        width: 151px;
        height: 256px;
      }
    }
    ${(props) => props.theme.respondToMax('md')} {
      &:after {
        width: 142px;
        height: 250px;
        background-position: top left;
        bottom: -65px;
        z-index: -1;
      }
    }
    ${(props) => props.theme.respondToMax('sm')} {
      &:after {
        width: 66px;
        height: 110px;
        bottom: -31px;
      }
    }
    ${(props) => props.theme.respondToMax('xs')} {
      &:after {
        width: 56px;
        height: 90px;
        bottom: -31px;
      }
    }
  }
  .success-submit-wrap {
    position: relative;
    top: 6px;
    p {
      color: white;
      margin-bottom: 0;
      font-size: 14px !important;
    }
  }
`;

export default TherapistStyleWrapper;
