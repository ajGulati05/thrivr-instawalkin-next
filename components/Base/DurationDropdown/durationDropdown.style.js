import styled from 'styled-components';

const StyledDropdown = styled.div`
  .form-control {
    &.init {
      font-family: 'Muli-Bold';
    }
    &.placeholder {
      color: #6c757d;
      font-size: 14px;
      font-family: 'Muli-SemiBold';
    }
  }
  .right-img {
    right: 7px !important;
    left: auto !important;
    top: 7px !important;
    &.image-rotate {
      transform: rotate(180deg);
    }
  }
`;

export default StyledDropdown;
