import styled from 'styled-components';

const ProfileStyleWrapper = styled.section`
  padding-top: 120px;
  .profile-main-wrapper {
    max-width: 560px;
    margin: auto;
    .profile-sec {
      .sub-title {
        margin-bottom: 0px;
        &.profile-title {
          font-family: 'Muli-SemiBold';
          opacity: 0.6;
          margin-bottom: 18px;
        }
      }
      .notification {
        .sub-title {
          margin-bottom: 10px;
        }
        .custom-switch {
          padding-left: 0;
          padding-right: 2.25rem;
          margin-bottom: 18px;
          .custom-control-label::before,
          .custom-control-label::after {
            cursor: pointer;
          }
          .custom-control-input:checked ~ .custom-control-label::before {
            border-color: #ff7271;
            background-color: #ff7271;
          }
          .custom-control-input:checked ~ .custom-control-label::after {
            transform: translateX(0.7rem);
          }
          .custom-control-input {
            left: auto;
            right: 0;
          }
          .custom-control-label {
            width: 100%;
            &::before {
              left: auto;
              right: -37px;
            }
            &::after {
              left: auto;
              right: calc(-2.25rem + 12px);
            }
          }
        }
      }
      .reset-password {
        .input-group {
          margin-bottom: 16px;
        }
        .cancel {
          font-family: 'Muli-Bold';
          font-size: 14px;
          line-height: 14px;
          color: #ff7271;
        }
      }
      .profile-photo {
        align-items: center;
        justify-content: center;
        margin-bottom: 32px;
        .profile-img {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;
          img {
            cursor: pointer;
            height: 100%;
          }
          .form-file {
            height: 100%;
            .form-file-label {
              height: 100%;
              margin-bottom: 0;
            }
            #profile-image-wrapper {
              display: none;
            }
          }
        }
      }
      .profile-details {
        margin-bottom: 18px;
        position: relative;
        .detail-title {
          width: 200px;
          display: inline-block;
        }
        .profile-edit {
          display: inline-block;
          width: calc(100% - 205px);
          vertical-align: top;
          .sub-title {
            &.detail {
              font-family: 'Muli-SemiBold';
            }
          }
          p {
            width: 34%;
            color: ${(props) => props.theme.color.gray};
            opacity: 0.6;
            margin-bottom: 0px;
          }
          ul {
            position: absolute;
            right: 0px;
            top: 0;
            margin-bottom: 0px;
            line-height: normal;
            li {
              font-size: 14px;
              line-height: 14px;
              font-family: 'Muli-Bold';
              display: inline-block;
              a {
                color: ${(props) => props.theme.color.pink};
                &:hover {
                  text-decoration: none;
                }
              }
              & + li {
                margin-left: 34px;
              }
            }
          }
        }
        .edit-section {
          display: none;
          &.show {
            display: inline-block;
            width: calc(100% - 205px);
            vertical-align: top;
            margin-top: -7px;
          }
          .input-group {
            margin-bottom: 16px;
            input {
              &.form-control {
                padding: 6px 20px;
                font-family: 'Muli-Bold';
                color: ${(props) => props.theme.color.textColor};
              }
              &::placeholder {
                font-family: 'Muli-Bold';
                color: ${(props) => props.theme.color.textColor};
              }
            }
            textarea {
              resize: none;
              font-family: 'Muli-Bold';
              color: ${(props) => props.theme.color.textColor};
              &::placeholder {
                font-family: 'Muli-Bold';
                color: ${(props) => props.theme.color.textColor};
              }
            }
            &.input-wrapper {
              display: inline-block;
              margin-bottom: 16px;
              .form-control {
                display: inline-block;
                width: 49%;
                & + .form-control {
                  margin-left: 2px;
                }
              }
            }
          }
          .action-btn {
            text-align: right;
            a {
              font-family: 'Muli-Bold';
              font-size: 14px;
              line-height: 14px;
              color: ${(props) => props.theme.color.pink};
              &:hover {
                text-decoration: none;
              }
            }
            button {
              margin-left: 32px;
            }
          }
        }
        .payment-mode {
          position: relative;
          width: calc(100% - 205px);
          display: inline-block;
          vertical-align: top;
          img {
            &.down-img {
              position: absolute;
              top: -3px;
              right: 7px;
            }
          }
        }
        &:last-child {
          margin-bottom: 0px;
        }
      }
      .add-new {
        a {
          color: ${(props) => props.theme.color.pink};
          font-size: 14px;
          line-height: 14px;
          font-family: 'Muli-Bold';
        }
      }
    }
    .back-arrow {
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      box-shadow: 0px 2px 6px 0 rgba(60, 64, 66, 0.08);
      background-color: #fff;
      margin-top: -10px;
      img {
        margin-left: 5px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('md')} {
    .profile-main-wrapper {
      max-width: 469px;
      .profile-sec {
        .sub-title {
          font-size: 16px;
          line-height: 20px;
          &.profile-title {
            font-size: 14px;
            line-height: 18px;
            margin-bottom: 16px;
          }
          &.detail {
            font-size: 18px;
            line-height: 26px;
          }
        }
        .profile-photo {
          margin-bottom: 16px;
          .profile-img {
            width: 64px;
            height: 64px;
          }
        }
        .profile-details {
          margin-bottom: 24px;
          .detail-title {
            width: 100%;
            margin-bottom: 8px;
          }
          .profile-edit {
            width: 100%;
            p {
              width: 26%;
            }
            ul {
              li {
                & + li {
                  margin-left: 40px;
                }
              }
            }
            .sub-title {
              &.detail {
                font-family: 'Muli-Regular';
              }
            }
          }
          .edit-section {
            &.show {
              margin-top: 0px;
              width: 100%;
              margin-bottom: 4px;
            }
          }
          .payment-mode {
            margin-top: 16px;
            width: 100%;
            margin-bottom: 20px;
          }
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    padding-top: 100px;
    padding-bottom: 60px;
    .profile-main-wrapper {
      .profile-sec {
        .profile-details {
          .profile-edit {
            p {
              width: 120px;
            }
          }
          .edit-section {
            .input-group {
              &.input-wrapper {
                .form-control {
                  width: 100%;
                  & + .form-control {
                    margin-left: 0px;
                    margin-top: 16px;
                  }
                }
              }
            }
            .action-btn {
              position: relative;
              .cancel {
                position: absolute;
                left: 20%;
                top: 50%;
                transform: translateY(-50%);
              }
              button {
                margin-left: 0px;
                width: 50%;
              }
            }
          }
        }
      }
      .separator {
        margin: 26px 0px;
      }
    }
  }
  .alert-wrapper {
    width: 90%;
    margin: auto;
    position: absolute;
    z-index: 11;
    top: 34%;
    .alert-success,
    .alert-danger {
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
      .alert-success,
      .alert-danger {
        font-size: 18px;
      }
    }
  }
`;

export default ProfileStyleWrapper;
