import styled from 'styled-components';

const PageLoaderStyleWrapper = styled.div`
  .page-loader-wrap {
    transition: all 0.4s ease;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000000;
    .page-loader-overlay {
      height: 100%;
      background: rgba(255, 255, 255, 0.6);
      width: 100%;
    }
    .page-loader-component {
      position: absolute;
    }
  }
`;

export default PageLoaderStyleWrapper;
