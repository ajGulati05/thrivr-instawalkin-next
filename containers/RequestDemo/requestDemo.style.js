import styled from 'styled-components';

export const RequestStyleWrapper = styled.div`
  .banner-wrapper {
    &:after {
      bottom: -330px;
    }
    &.banner-time-wrapper {
      margin-bottom: 550px;
      &:after {
        bottom: -550px;
      }
    }
    .request-form {
      .form-title {
        margin-bottom: 8px;
      }
      .time-slot {
        a {
          width: 16.666667%;
          margin: 0 6px;
        }
      }
      .request-time {
        text-align: left;
        color: #383838;
        margin-bottom: 24px;
        line-height: 20px;
        span {
          display: block;
          font-family: Muli-bold;
        }
      }
      .date-slider-wrapper {
        .date-slider {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          span {
            font-family: Muli-Bold;
            line-height: 20px;
          }
          .right-slide {
            transform: rotate(-90deg);
          }
          .left-slide {
            transform: rotate(90deg);
          }
        }
        .input-group {
          .down-img {
            margin-left: auto;
          }
        }
        .calender-dropdown {
          .input-group {
            margin-bottom: 0;
          }
          input {
            cursor: pointer;
            text-align: center;
          }
        }
      }
      .slider-body {
        margin-bottom: 40px;
        a:nth-child(3n + 2) {
          margin: 0 6px;
        }
      }
      .request-msg {
        font-size: 12px;
        line-height: 16px;
        opacity: 0.8;
      }
      .btn {
        margin: 8px 0 44px;
      }
    }
    .country-dropdown {
      position: relative;
      .input-group {
        width: 50%;
        margin: 0px auto 50px;
      }
      .dropdown-sec {
        li {
          &.init {
            &.form-control {
              border: solid 1px rgba(60, 64, 66, 0.1);
              border-radius: 20px !important;
            }
          }
        }
      }
      .input-group {
        .down-img {
          position: absolute;
          top: 3px;
          right: 10px;
        }
      }
    }
  }
  .form-details .form-wrapper .request-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: hsla(0, 0%, 100%, 0.9);
    width: 100%;
    height: 100%;
    border-radius: 10px;
    span {
      font-family: Muli-SemiBold;
      color: #383838;
      line-height: 20px;
      width: 196px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      height: 100%;
      margin: 0 auto;
    }
  }
  .form-details .form-wrapper {
    &.time-form-wrapper {
      width: 780px;
    }
  }

  ${(props) => props.theme.respondToMax('lg')} {
    .banner-time-wrapper {
      &:after {
        height: 288px;
      }
    }
  }
  ${(props) => props.theme.respondToMax('md')} {
    .form-details .form-wrapper.time-form-wrapper {
      width: 650px;
    }
    .banner-wrapper {
      &:after {
        bottom: -310px;
      }
    }
    .banner-time-wrapper {
      &:after {
        bottom: -550px;
        height: 201px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    .banner-time-wrapper {
      margin-bottom: 625px;
    }
    .form-details .form-wrapper {
      &.time-form-wrapper {
        width: 100%;
      }
      .time-slot {
        a {
          width: 30.33%;
          margin: 0 6px;
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('xs')} {
    .banner-time-wrapper {
      margin-bottom: 1000px;
    }
    .dropdown-sec {
      overflow: scroll;
      background-color: white;
    }
    .down-img {
      margin-left: auto;
      z-index: 1;
    }
  }
  ${(props) => props.theme.respondToMin('xs')} {
    .dropdown-sec {
      &.open {
        height: 300px;
        overflow-y: scroll;
        width: 330px;
        position: initial;
      }
    }
  }
`;
