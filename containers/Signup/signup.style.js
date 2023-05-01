import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
const SignupFormStyleWrapper = styled(Form)`
  div {
    &.terms {
      font-size: 10px;
      line-height: 10px;
      padding-top: 3px;
    }
  }
  .btn {
    margin: 16px 0 24px;
  }
  &.email {
    position: relative;
    .form-title {
      margin-bottom: 20px !important;
    }
    .sign-options {
      display: inline-block !important;
      font-size: 14px !important;
      line-height: 14px !important;
      a {
        display: inline-block !important;
        width: auto !important;
        box-shadow: none !important;
        color: ${(props) => props.theme.color.pink} !important;
        padding: 0px !important;
        font-family: 'Muli-Bold' !important;
        & + a {
          margin-top: 0px !important;
        }
      }
    }
    .btn {
      margin: 8px 0 24px !important;
    }
  }
`;

export default SignupFormStyleWrapper;
