import styled from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';

const StyledAccordion = styled(Accordion)`
  &.accordion {
    max-width: 560px;
    margin: auto;
    .card {
      border: none;
      margin-bottom: 20px;
      .card-header {
        background-color: transparent;
        border: none;
        padding: 0;
        &:hover {
          cursor: pointer;
        }
        .card-link {
          width: 100%;
          display: inline-block;
          color: ${(props) => props.theme.color.textColor};
          font-family: 'Muli-Bold';
          &[aria-expanded='true'] {
            img {
              transform: rotate(180deg);
            }
          }
          img {
            float: right;
            transition: all 0.2s ease-in-out;
          }
        }
      }
      .card-body {
        padding: 5px 0 0 0;
        font-size: 14px;
        color: ${(props) => props.theme.color.gray};
        opacity: 0.8;
        line-height: 1.29;
      }
    }
  }

  ${(props) => props.theme.respondToMax('lg')} {
    &.accordion {
      .card {
        margin-bottom: 18px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('md')} {
    &.accordion {
      max-width: 469px;
      .card {
        margin-bottom: 15px;
        .card-header {
          .card-link {
            font-size: 14px;
            line-height: 1.29;
            span {
              max-width: 409px;
              display: inline-block;
              margin-top: 5px;
            }
          }
        }
        .card-body {
          max-width: 409px;
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('xs')} {
    &.accordion {
      .card {
        .card-header {
          .card-link {
            span {
              max-width: calc(100% - 30px);
            }
          }
        }
        .card-body {
          padding: 0;
          line-height: 1.29;
          max-width: initial;
          margin-right: 30px;
        }
      }
    }
  }
`;

export default StyledAccordion;
