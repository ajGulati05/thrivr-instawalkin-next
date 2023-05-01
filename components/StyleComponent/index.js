import styled from 'styled-components';

const CommonStyle = styled.div``;

const SeperatorStyle = styled.div`
  margin: 32px 0px;
  height: 1px;
  width: 100%;
  background-color: #979797;
  opacity: 0.2;

  ${(props) => props.theme.respondToMax('md')} {
    margin: 28px 0;
  }

  ${(props) => props.theme.respondToMax('sm')} {
    margin: 24px 0;
  }
`;

const CustomImageComponentStyle = styled.div`
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const LayoutDiv = styled.div`
  min-height: calc(100vh - 218px);
`;

export { CommonStyle, SeperatorStyle, CustomImageComponentStyle, LayoutDiv };
