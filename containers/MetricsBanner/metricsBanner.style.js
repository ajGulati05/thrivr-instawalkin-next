import styled from 'styled-components';

export const MetricsBannerStyle = styled.div`
  .metrics-wrapper {
    .metrics-subtext {
      color: ${(props) => props.theme.color.white};
    }
    .dollar-sign {
      color: ${(props) => props.theme.color.white};
      font-size: 2em;
    }
  }
`;
