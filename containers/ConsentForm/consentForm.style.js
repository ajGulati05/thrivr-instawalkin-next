import styled from 'styled-components';

export const ConsentFormStyleWrapper = styled.section`
  padding-top: 120px;

  .consent-form-main-wrapper {
    max-width: 560px;
    margin: auto;
    .consent-main-title {
      text-align: center;
      margin-bottom: 10px;
      font-family: 'Muli-SemiBold';
    }
  }
  .therapist-covid-name-field {
    background-color: transparent;
  }
  .custom-checkbox {
    align-self: center;
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
  .upcoming-order-wrapper {
    margin-bottom: 60px;
  }
  .request-form {
    .consent-list {
      padding-left: 15px;
    }
    .testing {
      .form-control {
        width: 65%;
      }
    }
    .form-title {
      font-weight: 600;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .custom-switch {
      padding-left: 15px;
      padding-right: 35px;
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
      &.right {
        padding-left: 2.25rem;
      }
    }
    .form-control {
      border-radius: 0 !important;
      border: none;
      border-bottom: solid 1px rgb(30 30 31 / 32%);
      margin-top: -10px;
      margin-bottom: 15px;
      &.is-invalid {
        border-bottom: solid 1px #dc3545;
      }
    }
  }
  .waiver-form {
    .input-paragraph-inline {
      margin-bottom: 0;
      white-space: nowrap;
    }
    .form-control {
      border-radius: 0 !important;
      border: none;
      border-bottom: solid 1px rgb(30 30 31 / 32%);
      margin-top: 0px;
      margin-bottom: 0px;
      height: 27px;
      padding: 0px 7px;
      min-width: 100px;
      &.is-invalid {
        border-bottom: solid 1px #dc3545;
      }
    }
    .waiver-input-group {
      .form-control {
        flex: 1;
        margin-top: 0px;
      }
    }
    .signature {
      .form-element-signature {
        flex: 1;
      }
    }
  }
  ${(props) => props.theme.respondToMax('xs')} {
    .request-form {
      .custom-switch {
        .custom-control-label {
          width: calc(100% - 25px);
          padding-right: 10px;
          &:before {
            right: -20px;
          }
          &:after {
            right: calc(-2.25rem + 29px);
          }
        }
      }
    }
    .testing {
      .acknowledge-name {
        flex-wrap: wrap;
        .form-control {
          width: 50px;
        }
      }
    }
  }
`;
