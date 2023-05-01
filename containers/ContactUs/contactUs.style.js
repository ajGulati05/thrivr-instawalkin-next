import styled from 'styled-components';

const ContactStyleWrapper = styled.div`
  .contact-us-wrapper {
    padding: 160px 0px;
    position: relative;
    &:after {
      content: '';
      background-image: url(/images/questions.svg);
      background-size: cover;
      background-repeat: no-repeat;
      width: 604px;
      height: 716px;
      position: absolute;
      top: 125px;
      right: 0px;
      background-position: right -160px top;
      z-index: -2;
    }

    .contact-us-content {
      padding: 0 70px;
      min-height: 330px;

      .contact-detail {
        width: 47%;
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 32px;
        p {
          margin-bottom: 0px;
        }
        a {
          color: ${(props) => props.theme.color.gray};
          font-family: 'Muli-SemiBold';
          &:hover {
            text-decoration: none;
            color: ${(props) => props.theme.color.pink};
          }
        }
        &.contact-form {
          float: right;
          width: 42%;
          text-align: center;
          .input-group {
            margin-bottom: 16px;

            .form-control {
              padding-left: 20px;
              padding-right: 20px;
            }

            textarea {
              resize: none;
            }
          }
        }
        &.inquiries {
          .email-contact {
            margin-bottom: 0px;
          }
        }
        &.phone {
          margin-bottom: 0px;
        }
      }

      ${(props) => props.theme.respondToMax('lg')} {
        padding: 0px;
        min-height: 345px;
      }

      ${(props) => props.theme.respondToMax('md')} {
        .contact-detail {
          width: 48%;
          &.question {
            margin-bottom: 40px;
          }
          &.contact-form {
            width: 48%;

            .btn-white {
              margin-top: 16px;
            }
          }
        }
      }

      ${(props) => props.theme.respondToMax('sm')} {
        .contact-detail {
          width: 100%;
          &.question {
            margin-bottom: 28px;
          }
          &.contact-form {
            width: 100%;
            float: none;
            margin-bottom: 64px;
            .btn-white {
              width: 100%;
            }
          }
        }
      }
    }

    ${(props) => props.theme.respondToMax('lg')} {
      padding: 120px 0;
      &:after {
        top: 100px;
        width: 482px;
        height: 610px;
        background-position: right -180px top;
      }
    }

    ${(props) => props.theme.respondToMax('md')} {
      &:after {
        top: 155px;
        width: 360px;
        height: 502px;
        background-position: right -130px top;
      }
    }

    ${(props) => props.theme.respondToMax('sm')} {
      padding: 100px 0 70px;
      &:after {
        width: 300px;
        top: 265px;
        background-position: right -200px top;
      }
    }
  }
  .alert-wrapper {
    width: 90%;
    margin: auto;
    position: absolute;
    z-index: 11;
    top: -78px;
    .alert-success {
      font-size: 20px;
      color: ${(props) => props.theme.color.white};
      background-color: #ff8e8d;
      font-family: 'Muli-Regular';
      border: none;
      padding-top: 0.4rem;
      padding-bottom: 0.4rem;
      letter-spacing: 0.8px;
      text-align: center;
      border-radius: 8px;
    }
    ${(props) => props.theme.respondToMax('lg')} {
      width: 100%;
      margin-bottom: 0;
      top: -50px;
    }
    ${(props) => props.theme.respondToMax('sm')} {
      opacity: 0.9;
      top: -9px;
      .alert-success {
        font-size: 18px;
      }
    }
  }
`;

export default ContactStyleWrapper;
