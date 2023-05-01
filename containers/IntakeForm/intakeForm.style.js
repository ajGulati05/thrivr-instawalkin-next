import styled from 'styled-components';

export const IntakeFormStyleWrapper = styled.section`
  padding-top: 120px;
  min-height: calc(100vh - 260px);
  .intake-form-wrapper {
    max-width: 560px;
    margin: auto;
    .sub-title {
      &.order-title {
        opacity: 0.6;
        font-family: 'Muli-SemiBold';
        margin-bottom: 22px;
        line-height: 26px;
      }
    }
    .table {
      thead {
        th {
          border-bottom: 0px;
          border-top: 0px;
          padding: 0px 0px 30px 0px;
          font-size: 14px;
          line-height: 18px;
          color: ${(props) => props.theme.color.gray};
          font-family: 'Muli-SemiBold';
          opacity: 0.8;
          &.date-time {
            width: 240px;
          }
          &.type {
            width: 70px;
          }
          &.status {
            width: 120px;
          }
          &.action {
            width: 284px;
          }
        }
      }
      tbody {
        tr {
          &:first-child {
            td {
              padding-top: 0px;
            }
          }
          td {
            border-top: 20px;
            padding-left: 0px;
            padding-top: 20px;
            font-family: 'Muli-SemiBold';
            font-size: 16px;
            line-height: 20px;
            vertical-align: middle;
            padding-bottom: 20px;
            border-bottom: 1px solid rgba(60, 64, 66, 0.16);
            &.massage-specialist {
              .img {
                width: 30px;
                height: 30px;
                margin-right: 6px;
                border-radius: 50%;
                overflow: hidden;
                display: inline-block;
                vertical-align: middle;
                img {
                  max-width: 100%;
                }
              }
              .specialist-name {
                font-family: 'Muli-SemiBold';
                font-size: 16px;
                line-height: 20px;
                color: ${(props) => props.theme.color.gray};
                display: inline-block;
                vertical-align: middle;
                margin-bottom: 0px;
              }
            }
            &.type {
              img {
                width: 22px;
                height: 22px;
              }
            }
            &.action {
              text-align: right;
              padding-right: 0px;
              font-family: 'Muli-Bold';
              font-size: 14px;
              line-height: 14px;
              a {
                color: ${(props) => props.theme.color.pink};
                &:hover {
                  text-decoration: none;
                }
              }
              .btn {
                margin-left: 32px;
                width: 100px;
                padding: 8px 10px !important;
              }
            }
          }
        }
      }
    }
  }
  .form-wrapper {
    max-width: 600px;
    margin: auto;
    .arrow-nav {
      outline: none;
      border: none;
      display: inline-block;
      padding: 0;
      position: absolute;
      width: 40px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      box-shadow: 0px 2px 6px 0 rgba(60, 64, 66, 0.08);
      background-color: #fff;
      margin-top: -10px;
      &.hide {
        cursor: default;
      }

      &.back-arrow-left {
        left: -12%;
      }
      &.back-arrow-right {
        right: -12%;
      }
    }
    .intake-form-healthy {
      .form-row {
        margin: 20px 0;
        .form-check {
          margin: 5px 0px;
        }
      }
      .custom-radio {
        .custom-control-label {
          &:before {
            width: 20px;
            height: 20px;
          }
        }
      }
      .custom-radio {
        .custom-control-label {
          &:after {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .disabled {
      pointer-events: none;
    }
    .intake-nav {
      .sub-title {
        opacity: 20%;
        &.active {
          opacity: 60%;
        }
      }
    }
    .form-check {
      .form-check-label {
        font-size: 13px;
        font-family: 'Muli-Regular';
        margin-left: 3px;
      }
      .form-check-input {
        height: 18px;
        display: inline-block;
        width: 18px;
      }
    }
    label {
      font-size: 14px;
      font-family: 'Muli-SemiBold';
    }
  }
  .invalid {
    display: block;
    text-align: left;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #dc3545;
  }
  .custom-control-label::after {
    top: 0;
  }
  .custom-control-label::before {
    top: 0;
  }
  .custom-checkbox .custom-control-label {
    font-size: 13px;
    font-family: 'Muli-Regular';
  }

  .custom-radio {
    .custom-control-label::before {
      width: 18px;
      height: 18px;
    }
    .custom-control-label::after {
      width: 18px;
      height: 18px;
    }
  }

  .custom-checkbox .custom-control-label::before {
    border-radius: 0.15rem;
    border: #767676 solid 1px;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: #6fcad8;
    background-color: #6fcad9;
  }
  .custom-control-input:focus ~ .custom-control-label::before {
    box-shadow: none;
  }

  ${(props) => props.theme.respondToMax('lg')} {
    .form-wrapper {
      .arrow-nav {
      }
    }
  }

  ${(props) => props.theme.respondToMax('md')} {
    .form-wrapper {
      .arrow-nav {
      }
      .intake-nav {
        .sub-title {
          font-size: 14px;
          font-family: 'Muli-SemiBold';
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    .form-wrapper {
      .nav-arrow-right {
        text-align: right;
        .arrow-nav {
          position: relative;
          margin-bottom: 16px;
          right: 0px;
        }
      }
      .acknowledge-nav-arrow {
        .arrow-nav {
          left: 0px;
          position: relative;
          margin-bottom: 16px;
        }
      }
      .navigation-arrow {
        display: flex;
        justify-content: space-between;
        .arrow-nav {
          position: relative;
          margin-bottom: 16px;
          margin-top: 0;
          &.back-arrow-left {
            left: 0%;
            top: 0%;
          }
          &.back-arrow-right {
            right: 0%;
            top: 0%;
          }
        }
      }
      .intake-form-healthy {
        .custom-control {
          .custom-control-label {
            &:before {
              top: 2px;
            }
            &:after {
              top: 2px;
            }
          }
        }
        .custom-radio {
          .custom-control-label {
            &:before {
              width: 17px;
              height: 17px;
            }
          }
        }
        .custom-radio {
          .custom-control-label {
            &:after {
              width: 17px;
              height: 17px;
            }
          }
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('xs')} {
    .form-wrapper {
      .text-center {
        .btn {
          width: 100%;
        }
      }
    }
  }
`;
