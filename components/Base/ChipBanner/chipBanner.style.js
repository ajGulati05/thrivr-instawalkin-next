import styled from 'styled-components';

const StyledButton = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  div {
    border-radius: 25px;
    border-color: ${(props) => props.theme.color.pink} !important;
  }
`;

export default StyledButton;
