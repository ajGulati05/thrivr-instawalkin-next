import styled from 'styled-components';

export const FaqStyleWrapper = styled.section`
  &.faq {
    padding-bottom: 100px;
    position: relative;
    &:after {
      content: '';
      display: inline-block;
      background-image: url(/images/green-shape.svg);
      background-size: contain;
      background-repeat: no-repeat;
      width: 138px;
      height: 138px;
      position: absolute;
      bottom: 0px;
      left: 10%;
      background-position: left top 69px;
    }
    .title {
      margin-bottom: 50px;
    }
    .card {
      .card-header .card-link span {
        max-width: calc(100% - 28px);
        display: inline-block;
      }
      a {
        color: ${(props) => props.theme.color.textColor};
      }
    }
    ${(props) => props.theme.respondToMax('lg')} {
      padding-bottom: 80px;
      &:after {
        left: 5%;
      }
      .title {
        margin-bottom: 40px;
      }
    }

    ${(props) => props.theme.respondToMax('md')} {
      padding-bottom: 65px;
      .title {
        margin-bottom: 35px;
      }
      &:after {
        width: 69px;
        height: 69px;
        background-position: left top 34px;
      }
    }

    ${(props) => props.theme.respondToMax('xs')} {
      padding-bottom: 40px;
      .title {
        margin-bottom: 30px;
      }
      &:after {
        width: 41px;
        height: 41px;
        background-position: left top 20px;
      }
    }
  }
`;

export const DescriptionStyleWrapper = styled.section`
  &.description {
    .div-wrapper {
      padding: 40px 0;
    }
    .inner-div {
      max-width: 363px;
      p {
        font-size: 18px;
        line-height: 1.44;
      }
    }

    ${(props) => props.theme.respondToMax('lg')} {
      .div-wrapper {
        padding: 30px 0;
      }
      .inner-div {
        p {
          font-size: 17px;
        }
      }
      img {
        width: 80%;
      }
    }

    ${(props) => props.theme.respondToMax('md')} {
      .div-wrapper:last-child {
        padding-bottom: 0;
      }
      .inner-div {
        p {
          font-size: 16px;
        }
      }
      img {
        width: 75%;
      }
    }

    ${(props) => props.theme.respondToMax('xs')} {
      padding-top: 120px;
      .div-wrapper:last-child {
      }
      .inner-div {
        max-width: initial;
        p {
          line-height: 1.25;
          margin-bottom: 28px;
        }
      }
      img {
        width: 70%;
      }
    }
  }
`;

export const MassageBoxStyleWrapper = styled.div`
  &.box {
    padding: 18px;
    border-radius: 10px;
    box-shadow: 0 15px 50px -10px rgba(0, 0, 0, 0.2);
    background-color: #ffffff;
    margin-bottom: 40px;
    color: ${(props) => props.theme.color.gray};
    height: calc(100% - 40px);
    position: relative;
    padding-bottom: 54px;
    .profile-name {
      position: relative;
      margin-bottom: 12px;
      .img {
        height: 48px;
        width: 48px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
        margin-bottom: 12px;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .profile-info {
        width: calc(100% - 65px);
        display: inline-block;
        vertical-align: middle;
        .name-rating {
          margin-bottom: 4px;
          .sub-title {
            display: inline-block;
            margin-bottom: 0px;
            width: calc(100% - 75px);
          }
          .rate {
            position: absolute;
            right: 0px;
            top: 0px;
            font-size: 14px;
            line-height: 18px;
            img {
              display: inline-block;
              vertical-align: middle;
              margin-right: 7px;
            }
            div {
              display: inline-block;
              vertical-align: middle;
              span {
                opacity: 0.6;
              }
            }
          }
        }
        .location {
          font-size: 14px;
          line-height: 20px;
          height: 35px;
          span {
            &.km {
              opacity: 0.6;
              position: relative;
              padding-left: 12px;
              &:before {
                content: '\\2022';
                position: absolute;
                color: ${(props) => props.theme.color.textColor};
                font-size: 10px;
                opacity: 0.6;
                left: 1.5px;
                top: 2px;
                line-height: initial;
              }
            }
          }
        }
      }
    }
    ul {
      margin-bottom: 12px;
      line-height: normal;
      li {
        display: inline-block;
        img {
          width: 22px;
        }
      }
      &.facility {
        min-height: 18px;
        li {
          font-size: 14px;
          line-height: 18px;
          position: relative;
          padding-left: 12px;
          &:before {
            content: '\\2022';
            position: absolute;
            left: 0px;
            top: -3px;
            color: #6fcad8;
            font-size: 16px;
          }
          &:not(:last-child) {
            margin-right: 6px;
          }
        }
      }
      &.massage-types {
        li:not(:last-child) {
          margin-right: 16px;
        }
      }
    }
    .review {
      font-size: 14px;
      line-height: 18px;
      margin-bottom: 18px;
      min-height: 70px;
    }
    .massage-list {
      margin-bottom: 10px;
      a {
        &:nth-child(3n + 2) {
          margin: 0 3px;
        }
      }
    }
    .phone-number {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 33px;
      a {
        color: ${(props) => props.theme.color.pink};
        font-family: 'Muli-Bold';
        &:hover {
          text-decoration: none;
        }
      }
    }
    .btn-white {
      box-shadow: 0 2px 6px 0 rgba(60, 64, 66, 0.08);
    }
    .btn {
      position: absolute;
      left: 18px;
      right: 18px;
      bottom: 18px;
      width: calc(100% - 36px) !important;
    }
  }

  &.box-black {
    padding: 35px 18px;
    border-radius: 10px;
    box-shadow: 0 15px 50px -10px rgba(0, 0, 0, 0.2);
    background-color: ${(props) => props.theme.color.textColor};
    color: ${(props) => props.theme.color.white};
    margin-bottom: 40px;
    position: relative;
    height: calc(100% - 40px);
    &:before {
      content: '';
      position: absolute;
      width: 200px;
      height: 216px;
      background-image: url(/images/shape-with-green-circle.svg);
      background-repeat: no-repeat;
      top: 0;
      right: 0;
      background-size: contain;
      background-position: right -45px top -137px;
      z-index: -2;
    }
    .box-title {
      font-size: 24px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    p {
      margin-bottom: 24px;
      line-height: 20px;
    }
    form {
      .input-group {
        margin-bottom: 18px;
        input {
          padding: 6px 20px;
          &::placeholder {
            color: ${(props) => props.theme.color.textColor};
            opacity: 0.8;
            font-family: 'Muli-SemiBold';
          }
        }
      }
    }
  }
  ${(props) => props.theme.respondToMax('lg')} {
    &.box {
      .massage-list {
        a {
          &:nth-child(3n + 2) {
            margin: 0 2px;
          }
        }
      }
    }
  }
  ${(props) => props.theme.respondToMax('md')} {
    &.box {
      box-shadow: 0 7px 20px -6px rgba(0, 0, 0, 0.2);
      padding: 12px;
      margin-bottom: 24px;
      height: calc(100% - 24px);
      padding-bottom: 52px;
      .profile-name {
        .img {
          height: 40px;
          width: 40px;
          margin-right: 8px;
        }
        .profile-info {
          .name-rating {
            margin-bottom: 2px;
            .sub-title {
              font-size: 16px;
              line-height: 20px;
            }
          }
          .location {
            font-size: 14px;
            line-height: 18px;
            span {
              &.km {
                &:before {
                  left: 1px;
                }
              }
            }
          }
        }
      }
      .btn {
        left: 12px;
        right: 12px;
        bottom: 12px;
        width: calc(100% - 24px) !important;
      }
    }
    &.box-black {
      box-shadow: 0 7px 20px -6px rgba(0, 0, 0, 0.2);
      padding: 33px 12px 26px;
      height: calc(100% - 24px);
      &:before {
        background-position: right -45px top -140px;
      }
    }
  }
  ${(props) => props.theme.respondToMax('sm')} {
    &.box {
      height: auto;
    }
    &.box-black {
      height: auto;
    }
  }
  ${(props) => props.theme.respondToMax('xs')} {
    &.box {
      .profile-name {
        .img {
          vertical-align: top;
          margin-top: 4px;
        }
        .profile-info {
          .location {
            margin-bottom: 10px;
          }
        }
      }
    }
  }
`;

export const SearchSectionComponent = styled.div`
  &.search-section {
    margin-top: 32px;
    border-radius: 10px;
    padding: 40px;
    box-shadow: 1px 20px 40px 0 rgba(60, 64, 66, 0.1);
    background-color: #ffffff;
    .input-group {
      width: calc(33% - 76px);
      display: inline-block;
      margin-right: 35px;
      vertical-align: top;
      img {
        position: absolute;
        left: 12px;
        top: 10px;
      }
      .form-control {
        padding-left: 40px;
        background-color: transparent;
      }
    }
    .btn {
      width: 120px;
    }
  }

  ${(props) => props.theme.respondToMax('lg')} {
    &.search-section {
      padding: 30px;
      .input-group {
        width: calc(33% - 52px);
        margin-right: 10px;
      }
    }
  }

  ${(props) => props.theme.respondToMax('md')} {
    &.search-section {
      padding: 20px;
      margin-top: 16px;
      .mob-full {
        width: 100%;
        margin-right: 0;
      }
      .mob-half {
        width: calc(50% - 10px);
        margin-right: 0;
        margin: 16px 0;
        &.date {
          margin-right: 15px;
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('xs')} {
    &.search-section {
      padding: 12px;
      .mob-full {
      }
      .mob-half {
        width: calc(50% - 3px);
        margin: 12px 0 28px;
        &.date {
          margin-right: 6px;
        }
      }
    }
  }
  ${(props) => props.theme.respondToMax('xs')} {
    &.search-section {
      .input-group {
        .form-control {
          padding-left: 35px;
        }
      }
    }
  }
`;

export const OrderStatusBadeStyleWrapper = styled.span`
  &.badge {
    padding: 4px;
    min-width: 104px;
    height: 28px;
    display: inline-block;
    border-radius: 8px;
    text-align: center;
    font-size: 14px;
    line-height: inherit;
    font-family: 'Muli-Bold';
  }
  &.blue {
    color: #6fcad8;
    background-color: rgba(111, 202, 216, 0.1);
  }
  &.grey {
    color: rgba(60, 64, 66, 0.4);
    background-color: rgba(60, 64, 66, 0.08);
  }
  &.green {
    color: #3ed590;
    background-color: rgba(62, 213, 144, 0.1);
  }
  &.red {
    color: #dc3545;
    background-color: rgba(220, 53, 69, 0.1);
  }
  ${(props) => props.theme.respondToMax('md')} {
    &.badge {
      min-width: 82px;
      height: 24px;
      line-height: 18px;
    }
  }
`;
