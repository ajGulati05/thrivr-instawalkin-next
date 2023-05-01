import styled from 'styled-components';

export const OrderStyleWrapper = styled.section`
  padding-top: 120px;
  padding-bottom: 80px;
  .order-confirm-wrapper {
    max-width: 560px;
    margin: auto;
    position: relative;
    .back-arrow {
      position: absolute;
      left: -80px;
      top: 0px;
      width: 40px;
      height: 40px;
      line-height: 37px;
      border-radius: 20px;
      box-shadow: 0 2px 6px 0 rgba(60, 64, 66, 0.08);
      background-color: ${(props) => props.theme.color.white};
      display: inline-block;
      text-align: center;
    }
    .sub-title {
      &.order-title {
        font-family: Muli-SemiBold;
        opacity: 0.6;
        margin-bottom: 8px;
      }
    }
    .order-sub-title {
      font-size: 24px;
      line-height: 30px;
      font-family: 'Muli-Bold';
      margin-bottom: 0px;
    }
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      .btn {
        box-shadow: 0 2px 6px 0 rgba(60, 64, 66, 0.08);
      }
    }
    .massage-type {
      margin-bottom: 48px;
      position: relative;
      .input-group {
        width: 170px;
        .dropdown-sec {
          font-family: 'Muli-Bold';
          .form-control {
            height: auto;
          }
          li.show-btn {
            position: absolute;
            bottom: 22px;
            width: 100%;
          }
        }
        .down-img {
          position: absolute;
          right: 40px;
          top: -3px;
        }
      }
      .input-group-disabled {
        .dropdown-sec {
          pointer-events: none !important;
        }
        .down-img {
          display: none;
        }
      }
    }
    .massage-duration {
      margin-bottom: 52px;
      .input-group {
        width: 170px;
        .dropdown-sec {
          pointer-events: none !important;
          font-family: 'Muli-Bold';
          .form-control {
            height: auto;
          }
          &:after {
            height: calc(100% - 36px);
            top: 36px;
          }
        }
        .down-img {
          display: none;
          position: absolute;
          right: 40px;
          top: -3px;
        }
      }
    }
    .order-confirm-name {
      .main-img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
        img {
          max-width: 100%;
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      }
      .specialist-info {
        width: calc(100% - 66px);
        display: inline-block;
        vertical-align: middle;
        .sub-title {
          margin-bottom: 3px;
        }
        .location {
          font-family: 'Muli-SemiBold';
          line-height: 20px;
        }
      }
    }
    .price-breakdown {
      .payment-details {
        margin-bottom: 8px;
        .sub-title {
          line-height: 26px;
        }
        .price-label {
          display: inline-block;
          vertical-align: middle;
          width: calc(100% - 145px);
          margin-bottom: 0px;
        }
        .price {
          display: inline-block;
          vertical-align: middle;
          margin-bottom: 0px;
        }
        &.discounts {
          .sub-title {
            color: ${(props) => props.theme.color.pink};
          }
        }
        &.total-amount {
          margin-top: 16px;
        }
      }
    }
    .pay-option {
      .payment-option {
        display: block;
        height: 40px;
        margin-bottom: 16px;
        .input-group {
          .custom-dd {
            .init {
              &.form-control {
                padding: 6px 20px;
                background-color: transparent;
                border-radius: 20px !important;
                border: 1px solid rgba(60, 64, 66, 0.1);
                font-size: 14px;
                span {
                  font-size: 14px;
                  line-height: 14px;
                  color: ${(props) => props.theme.color.textColor};
                  font-family: 'Muli-Bold';
                }
              }
            }
            li {
              padding: 8px 18px;
              &.mobile-opt {
                display: none !important;
              }
              .card-disabled {
                pointer-events: none;
              }
              span {
                width: 100% !important;
              }
              span.close {
                width: auto !important;
              }
              .card-opt-head {
                font-size: 14px;
                line-height: 18px;
                color: ${(props) => props.theme.color.gray};
                font-family: 'Muli-Bold';
              }
              .card-option {
                font-size: 16px;
                line-height: 20px;
                color: ${(props) => props.theme.color.gray};
                font-family: 'Muli-SemiBold';
              }
              a {
                display: inline-block;
                width: 100%;
                &:hover {
                  text-decoration: none;
                }
              }
            }
            &.choose-payment {
              li {
                &.first-opt {
                  padding: 10px 18px 4px;
                }
                &.sub-opt {
                  padding: 4px 18px 4px;
                }
                &.last-opt {
                  padding: 10px 18px 16px;
                }
              }
            }
          }
          .down-img {
            position: absolute;
            right: 12px;
            top: 3px;
          }
        }
      }
      .pay-check {
        margin-bottom: 16px;
        position: relative;
        z-index: 11;
      }
      .new-payment-method {
        .cancel {
          font-family: 'Muli-Bold';
          font-size: 14px;
          line-height: 14px;
          color: #ff7271;
        }
        .input-group-wrapper {
          display: flex;
          justify-content: space-between;
          .input-group {
            width: 48%;
          }
        }
      }
      .payment-mode {
        margin-top: 16px;
      }
    }
    .new-payment-method {
      .input-group {
        margin-bottom: 16px;
        .form-control {
          padding: 6px 20px;
          color: ${(props) => props.theme.color.textColor};
          font-family: 'Muli-SemiBold';
          &::placeholder {
            color: ${(props) => props.theme.color.textColor};
            opacity: 0.8;
            font-family: 'Muli-SemiBold';
          }
        }
      }
      .input-group-wrapper {
        display: flex;
        justify-content: space-between;
        .input-group {
          width: 48%;
        }
      }
      .remember {
        .checkbox-wrap {
          display: inline-block;
          position: relative;
          padding: 0 0 0 6px;
          margin: 0 15px 0px 20px;
          cursor: pointer;
          font-size: 12px;
          line-height: 16px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          color: ${(props) => props.theme.color.textColor};
          font-family: 'Muli-SemiBold';
          input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
            &:checked {
              & ~ .checkmark {
                background-color: #6fcad8;
                border-color: #6fcad8;
                &:after {
                  display: block;
                }
              }
            }
          }
          .checkmark {
            content: '';
            position: absolute;
            width: 18px;
            height: 18px;
            left: -20px;
            top: -1px;
            border: 1px solid rgba(60, 64, 66, 0.1);
            cursor: pointer;
            border-radius: 4px;
            &:after {
              display: none;
              content: '';
              position: absolute;
              left: 6px;
              top: 2px;
              width: 5px;
              height: 9px;
              border: solid #fff;
              border-width: 0 1px 1px 0;
              transform: rotate(45deg);
            }
          }
        }
      }
    }
    .pay-btn {
      margin-top: 30px;
      .btn {
        padding: 13px 32px !important;
      }
    }
    .button-wrapper {
      margin-top: 48px;
      .btn {
        margin: 0 8px;
        box-shadow: 0 2px 6px 0 rgba(60, 64, 66, 0.08);
      }
    }
    .modal-dialog {
      .dropdown-sec {
        li:not(.init) {
          display: none !important;
        }
        li.show {
          display: list-item !important;
        }
      }
      .guest-dd.open {
        li:not(.init) {
          display: list-item !important;
        }
        li {
          &.sub-title {
            .ttl {
              display: none !important;
            }
          }
          &.show-btn {
            display: none !important;
          }
        }
      }

      .btn.disabled {
        background-color: #3c4042;
        cursor: not-allowed;
        opacity: 0.2;
        pointer-events: none;
      }
    }
  }
  .order-detail-wrapper {
    .dropdown-sec {
      li.show {
        pointer-events: none !important;
      }
    }
  }
  .form-error {
    border: solid 1px #dc3545;
  }
  .choose-badge {
    &:focus {
      outline: none;
    }
  }

  ${(props) => props.theme.respondToMax('md')} {
    .order-confirm-wrapper {
      max-width: 469px;
      .back-arrow {
        left: -120px;
      }
      .sub-title {
        font-size: 16px;
        line-height: 20px;
        &.order-title {
          font-size: 14px;
          line-height: 18px;
        }
      }
      .order-sub-title {
        font-size: 18px;
        line-height: 26px;
      }
      .order-confirm-name {
        .main-img {
          width: 40px;
          height: 40px;
          margin-right: 8px;
          vertical-align: top;
          margin-top: 4px;
        }
        .specialist-info {
          .location {
            font-size: 14px;
          }
        }
      }
      .price-breakdown {
        .payment-details {
          margin-bottom: 6px;
          &.total-amount {
            margin-top: 12px;
          }
          .price-label {
            width: calc(100% - 107px);
          }
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    padding-top: 100px;
    padding-bottom: 60px;
    .order-confirm-wrapper {
      .back-arrow {
        position: relative;
        left: 0px;
        margin-bottom: 16px;
      }
      .pay-btn {
        .btn {
          width: 100%;
        }
      }
      .rate-btn {
        margin-top: 16px;
        width: 100%;
      }
      .review-btn {
        width: 100%;
        margin: 12px 0 0 !important;
      }
    }
  }

  ${(props) => props.theme.respondToMin('xs')} {
    .massage-type {
      z-index: 11;
    }
    .order-confirm-wrapper {
      .pay-option {
        .modal {
          &.fade {
            display: inline-block;
            position: static;
            opacity: 1;
            overflow: visible;
            .modal-dialog {
              margin: 0 !important;
              max-width: 100%;
              transform: none;
              .modal-content {
                border: none;
                .modal-body {
                  padding: 0px;
                }
              }
            }
          }
          &.newcard-details {
            .modal-dialog {
              .modal-content {
                box-shadow: none;
                padding: 0px;
              }
            }
          }
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('xs')} {
    .order-confirm-wrapper {
      .pay-option {
        .payment-option {
          .input-group {
            .custom-dd {
              li {
                .card-opt-head {
                  opacity: 0.6;
                }
                &:nth-last-child(2) {
                  padding: 16px 18px;
                }
              }
              &.open {
                .init {
                  &.form-control {
                    padding: 0px;
                  }
                }
                li {
                  &.first-opt {
                    padding: 10px 18px;
                  }
                  &.sub-opt {
                    padding: 4px 18px 16px;
                  }
                  &.mobile-opt {
                    display: list-item !important;
                    .cash {
                      padding: 24px 0;
                      border-bottom: 1px solid rgba(151, 151, 151, 0.2);
                      border-top: 1px solid rgba(151, 151, 151, 0.2);
                      width: 100%;
                      display: inline-block;
                      margin: 8px 0px 0px;
                    }
                  }
                  &.desktop-opt {
                    display: none !important;
                  }
                  &.show-btn {
                    position: absolute;
                    bottom: 22px;
                    width: 100%;
                  }
                  &.last-opt {
                    padding: 10px 18px 4px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('s')} {
    .order-confirm-wrapper {
      .modal-cancle {
        .modal-dialog {
          .modal-content {
            .modal-body {
              ul {
                display: inline-block;
              }
            }
          }
        }
      }
      .order-header {
        .btn {
          padding: 8px 18px;
        }
      }
    }
    .modal-cancle {
      &.cancellation-popup {
        .modal-dialog {
          .modal-content {
            .modal-body {
              ul {
                display: inline-block;
              }
            }
          }
        }
      }
    }
  }

  .login-option {
    margin-top: 48px;
    .button-content {
      width: fit-content;
    }
    .btn.disabled {
      background-color: #3c4042;
      cursor: not-allowed;
      opacity: 0.2;
      pointer-events: none;
    }
    .signup-opt {
      font-size: 14px;
      line-height: 14px;
      margin-top: 24px;
      display: block;
      a {
        font-family: 'Muli-Bold';
        color: ${(props) => props.theme.color.pink};
        &:hover {
          text-decoration: none;
        }
      }
    }
    .button-subtext {
      font-size: 0.8em;
      color: grey;
    }
    ${(props) => props.theme.respondToMax('md')} {
      margin-top: 32px;
    }
  }
`;

export const ModalStyleWrapper = styled.div`
  ${(props) => props.theme.respondToMax('xs')} {
    .modal-cancle.modal-massage {
      .modal-content {
        height: auto !important;
        .modal-footer {
          position: initial;
        }
      }
    }
  }
  .btn.disabled {
    background-color: #3c4042;
    cursor: not-allowed;
    opacity: 0.2;
    pointer-events: none;
  }
  .choose-badge {
    &:focus {
      outline: none;
    }
  }
  .alert-wrapper {
    width: 70%;
  }
  .active.badge {
    border-color: #3c4042;
    box-shadow: inset 0 0 0 0.5px #3c4042;
  }
`;
