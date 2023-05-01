import styled from 'styled-components';

const StyledHeader = styled.header`
  font-size: 14px;
  color: #fff;
  font-family: 'Muli-Bold';
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;

  &.header-white {
    background-color: #fff;

    .navbar {
      .navbar-brand {
        color: ${(props) => props.theme.color.textColor};
        .logo-header {
          background-image: url(/images/logo_black.png);
        }
      }

      .nav-item {
        .nav-link:not(.btn) {
          color: ${(props) => props.theme.color.textColor};
          transition: all 0.2s linear;
          &:hover,
          &.active {
            color: ${(props) => props.theme.color.pink};
          }
        }
        .menu-icon {
          a {
            &:after {
              filter: brightness(0.2);
            }
          }
          a:hover {
            &:after {
              filter: none;
            }
          }
          &.show {
            a {
              &:after {
                filter: none;
              }
            }
          }
        }
        .dropdown-toggle {
          color: ${(props) => props.theme.color.gray};

          &:after {
            display: none;
          }
          &:hover {
            text-decoration: none;
          }
        }
        .dropdown-menu {
          margin-top: 16px;
          border: 0px;
          border-radius: 6px;
          box-shadow: 1px 20px 40px 0 rgba(60, 64, 66, 0.1);
          background-color: ${(props) => props.theme.color.white};
          min-width: 178px;
          padding: 18px;
          div {
            padding: 0px;
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 14px;
            a {
              color: ${(props) => props.theme.color.gray};
              &:hover {
                color: ${(props) => props.theme.color.pink};
                text-decoration: none;
              }
            }
            &:last-child {
              margin-bottom: 0px;
            }
            &.separator {
              margin: 20px 0;
              border-top: 0.5px solid #979797;
              opacity: 0.2;
            }
          }
        }
        &.user-profile {
          position: relative;
        }
      }

      &.open {
        .navbar-toggler-icon {
          img {
            display: inline-block;
          }
        }
      }
    }
  }

  .navbar {
    padding: 24px 44px;
    align-items: center;
    transition: all 0.35s linear;
    .navbar-toggler {
      color: transparent;
      border-color: transparent;
      .navbar-toggler-icon {
        background: transparent;
      }
    }
    .navbar-brand {
      font-size: 24px;
      font-family: 'Muli-Black';
      color: ${(props) => props.theme.color.white};
      position: relative;
      margin-right: 0;
      top: -5px;
      right: 25px;
      width: 150px;
      height: 46px;
      .logo-header {
        background-image: url(/images/logo_white.png);
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        height: 100%;
        width: 100%;
      }
      span {
        color: ${(props) => props.theme.color.pink};
      }
    }

    .nav-item {
      margin: auto 16px;
      a {
        color: ${(props) => props.theme.color.white};
        transition: all 0.2s linear;

        &:hover,
        &.active {
          color: ${(props) => props.theme.color.pink};
        }
      }
      .nav-link {
        color: ${(props) => props.theme.color.white};
        transition: all 0.2s linear;
        &:hover,
        &.active {
          color: ${(props) => props.theme.color.pink};
        }
      }
    }

    ${(props) => props.theme.respondToMax('md')} {
      padding: 22px 28px;

      .navbar-brand {
        font-family: 'Muli-Regular';
      }

      .nav-item {
        margin: auto 6px;
        &:first-child {
          margin-left: auto;
        }
      }
    }

    ${(props) => props.theme.respondToMax('sm')} {
      padding: 22px 20px;
      height: 84px;
      align-items: flex-start;
      .navbar-brand {
        padding: 0;
      }
      .navbar-collapse {
        height: calc(100% - 40px) !important;
        position: initial !important;
        padding-bottom: 60px;
        transition: none;
      }
      .navbar-toggler {
        padding-right: 0;
      }

      .navbar-nav {
        display: inline-block;
        height: 100%;
        .nav-item {
          margin-left: 0 !important;
          width: 100%;
          .nav-link {
            &.btn {
              margin-top: 10px;
            }
            &.nav-link:not(.btn) {
              color: ${(props) => props.theme.color.textColor};
              &:hover,
              &.active {
                color: ${(props) => props.theme.color.pink};
              }
            }
          }
          &:last-child,
          &:nth-last-child(2) {
            width: calc(50% - 20px);
            display: inline-block;
            margin: 0;
            margin-top: auto;
            text-align: center;
            position: absolute;
            bottom: 50px;
            left: 20px;
            background-color: #fff;
            .nav-link {
              padding: 8px 0px !important;
            }
          }
          &:last-child {
            left: 50%;
            right: 20px;
          }
        }
      }
    }
  }

  /* DropdownStyle */
  .dropdown {
    .dropdown-toggle {
      background: transparent;
      border: transparent;
      outline: transparent;
      &:active,
      &:focus {
        background: transparent;
        box-shadow: none;
        border: transparent;
        outline: transparent;
      }
      &:after {
        display: inline-block !important;
        border: none;
        background-image: url(/images/down-white.svg);
        height: 10px;
        width: 10px;
        background-position: center;
        top: 6px;
        position: relative;
        left: 5px;
        transition: all 0.2s linear;
      }
      &:hover {
        &:after {
          background-image: url(/images/down.svg);
        }
      }
    }
    span {
      &.profile-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 16px 0 auto;
        display: inline-block;
        vertical-align: middle;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .dropdown-menu {
      border-radius: 4px;
      box-shadow: 1px 20px 40px 0 rgba(60, 64, 66, 0.1);
      background-color: #fff;
      border: none;
      padding: 10px 0;
      margin-top: 8px !important;
      .seperator {
        margin: 20px 0;
        border-top: 0.5px solid #979797;
        opacity: 0.2;
      }
      a.dropdown-item {
        color: ${(props) => props.theme.color.textColor};
        font-family: 'Muli-Regular';
        padding: 3px 20px;
        font-size: 14px;
        &:hover {
          background-color: transparent;
          color: ${(props) => props.theme.color.pink};
        }
      }
    }
    &.show {
      .dropdown-toggle {
        color: ${(props) => props.theme.color.pink}!important;
        &:after {
          transform: rotate(180deg);
          background-image: url(/images/down.svg);
        }
      }
    }
    ${(props) => props.theme.respondToMax('sm')} {
      .dropdown-toggle {
        color: ${(props) => props.theme.color.textColor} !important;
        &:after {
          filter: brightness(0.2);
        }
      }
      .dropdown-menu {
        box-shadow: none;
        margin-top: 0 !important;
        padding: 0;
        a.dropdown-item {
          padding: 3px 15px;
        }
      }
      &.show {
        .dropdown-toggle {
          &:after {
            filter: none;
          }
        }
      }
    }
  }

  .user-profile {
    .dropdown {
      .dropdown-menu {
        margin-top: 16px;
        border: 0;
        border-radius: 6px;
        box-shadow: 1px 20px 40px 0 rgba(60, 64, 66, 0.1);
        background-color: #fff;
        min-width: 178px;
        padding: 18px;
        a {
          font-family: 'Muli-Bold';
          color: ${(props) => props.theme.color.gray};
          &:hover {
            color: ${(props) => props.theme.color.pink};
            text-decoration: none;
          }
          &:focus {
            outline: none;
          }
        }
        div {
          padding: 0;
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 14px;
          &:focus {
            outline: none;
          }
          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    &.open {
      z-index: 111;
      box-shadow: 0 5px 10px 0 rgba(60, 64, 66, 0.16);
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: #fff;
      .navbar {
        background-color: #fff;
        height: 100%;
        min-height: 160px;
        align-items: flex-start;
        .navbar-brand {
          color: ${(props) => props.theme.color.textColor};
          .logo-header {
            background-image: url(/images/logo_black.png);
          }
        }
        .last-btn {
          width: 100%;
        }
        .navbar-toggler-icon {
          position: relative;
          &:after {
            content: '';
            background-color: ${(props) => props.theme.color.white};
            position: absolute;
            width: 100%;
            height: 13px;
            bottom: 0;
            left: 0;
          }
          &:before {
            content: '';
            background-color: ${(props) => props.theme.color.white};
            position: absolute;
            width: 100%;
            height: 10px;
            top: 0;
            left: 0;
          }
          img {
            display: none;
            &.pink {
              display: inline-block !important;
            }
          }
        }
        .nav-link {
          font-size: 16px;
          &.active {
            font-size: 18px;
          }
        }
        .nav-item:not(.for-login) {
          .nav-link {
            padding: 15px 0;
          }
        }
      }
      .menu-icon {
        a {
          display: block !important;
          &:hover {
            color: ${(props) => props.theme.color.pink} !important;
            &:after {
              filter: none !important;
            }
          }
        }
        .dropdown-menu {
          margin-bottom: 0 !important;
          border: none !important;
          display: none !important;
          a {
            font-size: 14px;
          }
        }
        &.show {
          .dropdown-menu {
            display: block !important;
            box-shadow: none !important;
            padding: 0;
          }
        }
      }
    }
  }
  &.form-header {
    ${(props) => props.theme.respondToMax('sm')} {
      background-color: ${(props) => props.theme.color.white};
      .navbar {
        .navbar-brand {
          color: ${(props) => props.theme.color.textColor};
        }
        .logo-header {
          background-image: url(/images/logo_black.png);
        }
      }
    }
  }

  ${(props) => props.theme.respondToMax('sm')} {
    .navbar {
      .loged-in {
        .navbar-nav {
          .nav-item {
            &.user-profile {
              .dropdown-menu {
                width: 178px;
              }
            }
            &:nth-last-child(2) {
              bottom: auto;
              width: calc(100% - 40px);
              .nav-link {
                padding: 15px 0px !important;
                text-align: left;
              }
            }
            &:last-child {
              bottom: -70px;
              left: 0px;
              position: relative;
              width: 100%;
              text-align: left;
            }
          }
        }
      }
    }
  }
`;

export default StyledHeader;
