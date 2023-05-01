import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

const StyledButton = styled(Button)`
  &.btn {
    color: ${(props) => props.theme.color.white};
    background-color: ${(props) => props.theme.color.pink};
    padding: 13px 22px;
    border-radius: 20px;
    box-shadow: 0 5px 10px 0 rgba(60, 64, 66, 0.16);
    font-size: 14px;
    line-height: 12px;
    font-family: 'Muli-Bold';
    border-color: ${(props) => props.theme.color.pink};
    ${(props) => props.theme.transition(0.4)};
    &:hover {
      background-color: ${(props) => props.theme.color.white};
      color: ${(props) => props.theme.color.pink};
      border-color: transparent;
      box-shadow: 0 5px 10px 0 rgba(60, 64, 66, 0.16);
    }
    &:focus {
      box-shadow: 0 5px 10px 0 rgba(60, 64, 66, 0.16);
    }
    &:not(:disabled):not(.disabled):active,
    &:not(:disabled):not(.disabled):active:focus {
      background-color: ${(props) => props.theme.color.pink};
      border-color: transparent;
      box-shadow: 0 5px 10px 0 rgba(60, 64, 66, 0.16);
    }
  }

  &.btn-white {
    background-color: ${(props) => props.theme.color.white};
    color: ${(props) => props.theme.color.pink};
    border-color: transparent;
    &:hover {
      background-color: ${(props) => props.theme.color.pink};
      color: ${(props) => props.theme.color.white};
      border-color: transparent;
      box-shadow: 0 5px 10px 0 rgba(60, 64, 66, 0.16);
    }
  }
`;

export default StyledButton;
