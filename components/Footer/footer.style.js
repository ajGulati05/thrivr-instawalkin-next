import styled from 'styled-components';

const StyledFooter = styled.footer`
  padding: 40px 0;
  background-color: ${(props) => props.theme.color.textColor};
  color: ${(props) => props.theme.color.white};

  .logo {
    line-height: initial;
    a {
      position: relative;
      left: -20px;
      width: 150px;
      height: 46px;
      display: inline-block;
      .logo-footer {
        background-image: url(/images/logo_white.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        height: 100%;
        width: 100%;
      }
      &:hover {
        color: ${(props) => props.theme.color.white};
        span {
          color: ${(props) => props.theme.color.pink};
        }
      }
    }

    span {
      color: ${(props) => props.theme.color.pink};
    }
  }

  .download-from {
    img {
      width: 136px;
      margin-top: 20px;
    }
  }

  .sub-title {
    color: ${(props) => props.theme.color.white};
    margin-bottom: 30px;
  }

  li {
    margin-top: 8px;
    font-size: 14px;
  }

  a {
    color: ${(props) => props.theme.color.white};
    &:hover {
      color: ${(props) => props.theme.color.pink};
      text-decoration: none;
    }
  }

  .contact-us {
    li:not(:first-child) {
      margin-top: 0;
    }
  }

  ${(props) => props.theme.respondToMax('md')} {
    .logo {
      margin-bottom: 5px;
    }
    .sub-title {
      color: ${(props) => props.theme.color.white};
      margin-bottom: 20px;
    }
    .download-from {
      img {
        margin-top: 15px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    padding: 35px 0;
    .sub-title {
      font-size: 16px;
    }
    .mob-full:first-child {
      width: 100%;
      text-align: center;
    }
    .download-from {
      br {
        display: none;
      }
      img {
        height: 44px;
        width: auto;
        margin: 20px 5px 30px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('xs')} {
    padding: 30px 0;
    .mob-full {
      width: 100%;
      text-align: left !important;
    }
    .mob-half {
      width: 50%;
      margin-bottom: 32px;
    }
    li {
      margin-top: 6px;
    }
    .download-from {
      img {
        margin: 20px 5px 30px 0;
      }
    }
  }
`;

export default StyledFooter;
