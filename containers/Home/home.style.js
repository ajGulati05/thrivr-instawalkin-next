import styled from 'styled-components';

const HomeStyleWrapper = styled.div`
  .banner {
    background-image: url('/images/massage.jpg');
    height: 640px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
    .banner-details {
      text-align: center;
      font-family: 'Muli-Bold';
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #000;
      opacity: 0.4;
    }
    .container {
      z-index: 1;
    }

    ${(props) => props.theme.respondToMax('lg')} {
      height: 550px;
    }

    ${(props) => props.theme.respondToMax('md')} {
      height: 480px;
    }

    ${(props) => props.theme.respondToMax('xs')} {
      height: 360px;
      padding-top: 222px;
    }
  }

  .rest-easy {
    p {
      font-size: 18px;
    }
    .main-wrapper {
      padding: 0 70px 35px;
      .details {
        margin-top: 60px;
        img {
          margin-bottom: 15px;
        }
        p {
          font-size: 16px;
          color: ${(props) => props.theme.color.gray};
          opacity: 0.6;
          padding-right: 40px;
        }
      }
    }

    ${(props) => props.theme.respondToMax('lg')} {
      p {
        font-size: 17px;
      }
      .main-wrapper {
        padding: 0 0px 35px;
        .rest-desc {
          max-width: 800px;
          margin: auto;
        }
        .details {
          margin-top: 50px;
          p {
            padding-right: 10px;
          }
        }
      }
    }

    ${(props) => props.theme.respondToMax('md')} {
      p {
        font-size: 16px;
      }
      .main-wrapper {
        padding: 0 0px 5px;
        .rest-desc {
          max-width: 590px;
        }
        .details {
          margin-top: 40px;
          padding: 0 8px;
          p {
            padding-right: 0px;
          }
          .mob-col {
            padding: 0 7px;
          }
        }
      }
    }

    ${(props) => props.theme.respondToMax('xs')} {
      padding: 20px 0 16px;
      .main-wrapper {
        padding: 0;
        .rest-easy-title {
          text-align: left;
        }
        .rest-desc {
          line-height: 1.25;
          text-align: left;
        }
        .details {
          margin-top: 32px;
          p {
            line-height: 1.25;
            margin-bottom: 32px;
          }
          .mob-col {
            img {
              width: 40px;
            }
            .sub-title {
              margin-bottom: 4px;
            }
          }
        }
      }
    }
  }

  .we-have {
    padding: 96px 0;
    ul {
      max-width: 560px;
      margin: auto;
      margin-top: 40px;
      li {
        margin-bottom: 17px;
        img {
          vertical-align: top;
        }
        div {
          width: calc(100% - 40px);
          display: inline-block;
          padding-left: 15px;
          p {
            color: ${(props) => props.theme.color.gray};
            opacity: 0.6;
          }
        }
      }
    }

    ${(props) => props.theme.respondToMax('lg')} {
      padding: 75px 0 60px;
      ul {
        max-width: 530px;
        margin-top: 35px;
        li {
          margin-bottom: 10px;
        }
      }
    }

    ${(props) => props.theme.respondToMax('md')} {
      padding: 60px 0 15px;
      ul {
        max-width: 470px;
        margin-top: 32px;
        li {
          margin-bottom: 0px;
        }
      }
    }

    ${(props) => props.theme.respondToMax('xs')} {
      padding: 48px 0 0px;
      ul {
        li {
          div {
            width: 100%;
            padding-left: 0;
            margin-top: 16px;
            .sub-title {
              margin-bottom: 4px;
            }
            p {
              line-height: 1.25;
              margin-bottom: 30px;
            }
          }
        }
      }
    }
  }
`;

export default HomeStyleWrapper;
