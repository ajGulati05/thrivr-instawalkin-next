import styled from 'styled-components';

export const OrderHistoryStyleWrapper = styled.section`
  padding-top: 120px;
  min-height: calc(100vh - 218px);
  .upcoming-order-wrapper {
    margin-bottom: 60px;
  }
  .no-order-text {
    text-align: center;
    a {
      color: ${(props) => props.theme.color.pink};
    }
  }
  .order-wrapper {
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
        .orderdata {
          cursor: pointer;
        }
        tr {
          &:first-child {
            td {
              padding-top: 0px;
            }
          }
          &:last-child {
            td {
              border-bottom: 0px;
              padding-bottom: 0px;
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
                  height: 100%;
                  object-fit: cover;
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
  ${(props) => props.theme.respondToMax('lg')} {
    .order-wrapper {
      .table {
        thead {
          th {
            &.date-time,
            &.status {
              width: auto;
            }
            &.duration {
              width: 70px;
            }
            &.type {
              width: 50px;
            }
            &.action {
              width: 200px;
            }
          }
        }
      }
    }
  }
  ${(props) => props.theme.respondToMax('md')} {
    .upcoming-order-wrapper {
      margin-bottom: 40px;
    }
    .order-wrapper {
      .sub-title {
        &.order-title {
          font-size: 14px;
          line-height: 18px;
        }
      }
      .duration,
      .type,
      .cost {
        display: none;
      }
      .table {
        thead {
          th {
            padding: 0 0 16px;
            &.action {
              width: 238px;
            }
          }
        }
        tbody {
          tr {
            td {
              font-size: 14px;
              line-height: 18px;
              white-space: nowrap;
              &.massage-specialist {
                .img {
                  width: 28px;
                  height: 28px;
                }
                .specialist-name {
                  font-size: 14px;
                  line-height: 18px;
                }
              }
              &.action {
                .btn {
                  padding: 8px 12px !important;
                }
              }
            }
          }
        }
      }
    }
  }
  ${(props) => props.theme.respondToMax('sm')} {
    padding-top: 100px;
    .order-wrapper {
      .sub-title {
        &.order-title {
          margin-bottom: 16px;
        }
      }
      .date-time {
        display: none;
      }
      .table {
        thead {
          tr {
            th {
              padding: 0 0 16px;
              &.massage-specialist {
                width: 220px;
              }
              &.action {
                width: auto;
              }
            }
          }
        }
        tbody {
          tr {
            td {
              &.action {
                font-size: 16px;
                line-height: 20px;
              }
            }
          }
        }
      }
    }
  }
  ${(props) => props.theme.respondToMax('s')} {
    .order-wrapper {
      .table {
        thead {
          tr {
            th {
              &.massage-specialist {
                width: auto;
              }
            }
          }
        }
      }
    }
  }
`;
