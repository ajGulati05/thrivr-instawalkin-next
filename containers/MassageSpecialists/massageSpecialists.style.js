import styled from 'styled-components';

export const MassageSpecialistsStyleWrapper = styled.div`
  &.massage-specialists {
    .search-section {
      font-family: 'Muli-Bold';
      margin-top: 84px;
      box-shadow: 1px 8px 16px 0 rgba(60, 64, 66, 0.08);
    }
    .filter-section {
      margin-top: 32px;
      margin-bottom: 64px;
      position: relative;
      .modal {
        &.fade {
          width: calc(100% - 205px);
        }
      }
      .filter-sort-option {
        display: inline-block;
        vertical-align: top;
        .input-group {
          display: inline-block;
          vertical-align: middle;
          width: 200px;
          .down-img {
            position: absolute;
            right: 0px;
            top: -7px;
          }
          .dropdown-sec {
            font-family: 'Muli-Bold';
            top: -7px;
            li {
              font-size: 14px;
              &.init {
                text-align: right;
                padding-right: 32px;
                margin-bottom: 0px;
              }
            }
          }
        }
      }
      .click-overlay-tooltip {
        position: absolute;
        right: 60px;
      }
    }
    .results {
      .title {
        margin-bottom: 40px;
      }
    }
    input[type='checkbox'],
    input[type='radio'] {
      border: none;
    }

    ${(props) => props.theme.respondToMax('md')} {
      .filter-section {
        margin-top: 24px;
        margin-bottom: 30px;
        .filter-sort-option {
          .input-group {
            width: 180px;
          }
        }
        .modal {
          &.fade {
            width: calc(100% - 185px);
            .modal-dialog {
              .modal-content {
                .modal-body {
                  .dropdown {
                    margin-right: 8px !important;
                    &.multiselect {
                      .dropdown-toggle {
                        padding: 13px 18px;
                      }
                    }
                  }
                  .single-select {
                    .input-group {
                      padding: 13px 18px !important;
                    }
                    &.billing {
                      margin-right: 8px !important;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ${(props) => props.theme.respondToMax('sm')} {
      .filter-section {
        .modal {
          &.fade {
            width: 100%;
            .modal-dialog {
              .modal-content {
                .modal-header {
                  text-align: left;
                }
                .modal-body {
                  .dropdown {
                    margin-right: 12px;
                    margin-bottom: 12px;
                  }
                }
              }
            }
          }
        }
        .filter-sort-option {
          width: 100%;
          .input-group {
            float: right;
          }
        }
      }
    }
    ${(props) => props.theme.respondToMin('xs')} {
      .filter-section {
        .modal {
          &.fade {
            display: inline-block;
            position: initial;
            opacity: 1;
            overflow: visible;
            .modal-dialog {
              margin: 0;
              max-width: 100%;
              transform: none;
              .modal-content {
                border: none;
                .modal-body {
                  padding: 0;
                  .dropdown {
                    margin-right: 12px;
                  }
                  .single-select {
                    display: inline-block;
                    margin-right: 12px;
                    &.parking {
                      margin-right: 0px;
                    }
                    .input-group {
                      padding: 13px 22px;
                      font-size: 14px;
                      -webkit-appearance: none;
                      background-color: ${(props) => props.theme.color.white};
                      line-height: 12px;
                      font-family: Muli-bold;
                      input {
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                        -webkit-appearance: none;
                        border-radius: 20px !important;
                        border: 1px solid rgba(60, 64, 66, 0.1);
                        color: ${(props) => props.theme.color.textColor};
                        &:checked {
                          border-color: ${(props) =>
                            props.theme.color.textColor};
                          box-shadow: inset 0 0 0 0.5px
                            ${(props) => props.theme.color.textColor};
                        }
                        &:focus {
                          outline: none;
                        }
                      }
                      label {
                        margin-bottom: 0px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ${(props) => props.theme.respondToMax('xs')} {
      .filter-section {
        display: flex;
        justify-content: space-between;
        .form-control {
          &.filter-btn {
            display: inline-block !important;
            vertical-align: middle;
            padding: 10px 28px;
            font-family: 'Muli-Bold';
          }
        }
        .modal {
          &.fade {
            width: 100%;
            .modal-dialog {
              .modal-content {
                .modal-body {
                  padding-top: 0px;
                  padding-bottom: 0px;
                  .dropdown {
                    margin-right: 0px !important;
                    &.multiselect {
                      width: 100%;
                      text-align: left;
                      .dropdown-toggle {
                        border: none;
                        font-family: 'Muli-SemiBold';
                        opacity: 0.6;
                        padding: 0px 0 7px;
                        pointer-events: none;
                        box-shadow: none;
                      }
                      .dropdown-menu {
                        display: block;
                        width: 100%;
                        float: none;
                        min-width: initial;
                        position: initial;
                        box-shadow: none;
                        font-family: 'Muli-SemiBold';
                        margin: 0;
                        padding: 0;
                        border-bottom: 1px solid #e1e1e2;
                        border-radius: 0;
                        padding-bottom: 15px;
                        li {
                          padding: 7px 0px;
                        }
                      }
                    }
                  }
                  .single-select {
                    .input-group {
                      padding: 0px !important;
                    }
                  }
                }
              }
            }
          }
        }

        .single-select {
          display: block;
          width: 100%;
          float: none;
          min-width: 0;
          position: static;
          box-shadow: none;
          font-family: Muli-SemiBold;
          margin: 0;
          border-radius: 0;
          padding: 24px 0;
          &.billing {
            padding-top: 12px;
            border-bottom: 1px solid #e1e1e2;
          }
          .input-group {
            input {
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              cursor: pointer;
              -webkit-appearance: none;
              color: ${(props) => props.theme.color.textColor};
              &:checked {
                background-image: url(/images/done-pink.svg);
                background-size: auto;
                background-position: right 5px center;
                background-repeat: no-repeat;
                background-color: transparent;
              }
              &:focus {
                outline: none;
              }
            }
            label {
              margin-bottom: 0px;
            }
          }
        }
        .filter-sort-option {
          width: auto;
          .input-group {
            float: none;
          }
        }
      }
    }
  }

  /* MultiSelect */
  .multiselect {
    width: auto;
    display: inline-block;
    .dropdown-toggle {
      border-radius: 20px !important;
      border: solid 1px rgba(60, 64, 66, 0.1);
      background-color: #ffffff;
      padding: 13px 22px;
      font-size: 14px;
      -webkit-appearance: none;
      line-height: 12px;
      width: auto;
      display: inline-block;
      font-family: 'Muli-bold';
      &:after {
        display: none;
      }
    }
    .dropdown-menu {
      border-radius: 6px;
      box-shadow: 1px 20px 40px 0 rgba(60, 64, 66, 0.1);
      background-color: #ffffff;
      border: none;
      padding: 10px 0;
      margin-top: 8px;
      li {
        position: relative;
        padding: 7px 35px 7px 18px;
        white-space: nowrap;
        a {
          img {
            width: 22px;
            margin-right: 8px;
          }
          input {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            -webkit-appearance: none;
            &:focus {
              outline: none;
            }
            &:checked {
              background-image: url(/images/done-pink.svg);
              background-size: auto;
              background-position: right 5px center;
              background-repeat: no-repeat;
              background-color: transparent;
            }
          }
          label {
            margin: 0;
          }
        }
      }
    }
    &.show {
      .dropdown-toggle {
        border-color: ${(props) => props.theme.color.textColor};
        box-shadow: inset 0px 0px 0px 0.5px
          ${(props) => props.theme.color.textColor};
      }
    }
    &.manage-type {
      .dropdown-menu {
        width: 220px;
      }
    }
  }

  /* Dropdown */
  .dropdown {
    &.singleselect {
      .dropdown-toggle {
        &:after {
          background-image: url(/images/down.svg);
        }
      }
      .dropdown-menu {
        li {
          position: relative;
          padding: 7px 35px 7px 18px;
          white-space: nowrap;
          a {
            input {
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              cursor: pointer;
              -webkit-appearance: none;
              &:checked {
                background-image: url(/images/done-pink.svg);
                background-size: auto;
                background-position: right 5px center;
                background-repeat: no-repeat;
                background-color: transparent;
              }
            }
            label {
              margin: 0px;
            }
          }
        }
      }
    }
  }
`;

export const MassageSpecialistsDetailStyleWrapper = styled.div`
  .detail-profile-wrapper {
    margin-top: 84px;
    padding: 0 70px;
    .profile-title {
      font-size: 24px;
      line-height: 30px;
      font-family: 'Muli-Bold';
      margin-bottom: 0px;
    }
    .therapist-sub-title {
      font-size: 16px;
      line-height: 20px;
      font-family: 'Muli-Bold';
    }
    .feedback-title {
      font-family: 'Muli-Bold';
      font-size: 18px;
      line-height: 26px;
    }
    p {
      line-height: 20px;
    }
    .main-img,
    .img {
      border-radius: 50%;
      overflow: hidden;
      display: inline-block;
      vertical-align: middle;
    }
    .rating {
      img,
      .rate {
        display: inline-block;
        vertical-align: middle;
      }
      .rate {
        font-size: 18px;
        line-height: 26px;
        span {
          opacity: 0.6;
        }
      }
    }
    .profile-information {
      .profile-head {
        margin-bottom: 24px;
        position: relative;
        .main-img {
          width: 94px;
          height: 94px;
          margin-right: 20px;
          img {
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
        }
        .specialist-info {
          width: calc(100% - 120px);
          display: inline-block;
          vertical-align: top;
          .location {
            font-size: 18px;
            line-height: 26px;
            margin-bottom: 12px;
            font-family: 'Muli-SemiBold';
            .km {
              opacity: 0.6;
              position: relative;
              padding-left: 12px;
              margin-left: 5px;
              &:before {
                content: '\\2022';
                position: absolute;
                color: ${(props) => props.theme.color.textColor};
                font-size: 10px;
                opacity: 0.6;
                left: 0px;
                top: 5px;
                line-height: normal;
              }
            }
          }
        }
      }
      .speciality {
        display: flex;
        margin-top: 32px;
        margin-bottom: 0px;
        li {
          width: 85px;
          text-align: center;
          .img {
            position: relative;
            margin-bottom: 10px;
            overflow: visible;
            img {
              height: 56px;
              width: 56px;
              border-radius: 50%;
            }
            .badge {
              position: absolute;
              right: 0px;
              top: 0px;
              border: 1px solid ${(props) => props.theme.color.white};
              background-color: ${(props) => props.theme.color.textColor};
              color: ${(props) => props.theme.color.white};
              font-size: 12px;
              font-family: 'Muli-SemiBold';
              text-align: center;
              width: 22px;
              height: 22px;
              line-height: 19px;
              border-radius: 50%;
              padding: 0px;
            }
          }
          .speciality-title {
            font-size: 12px;
            line-height: 16px;
            color: ${(props) => props.theme.color.gray};
            font-family: 'Muli-Bold';
            display: block;
          }
          &:not(:last-child) {
            margin-right: 24px;
          }
        }
      }
      .facility {
        margin-bottom: 0px;
        position: absolute;
        left: 120px;
        bottom: 0px;
        display: inline-block;
        vertical-align: middle;
        li {
          font-size: 16px;
          line-height: 20px;
          font-family: Muli-SemiBold;
          position: relative;
          padding-left: 12px;
          display: inline-block;
          &:before {
            content: '\\2022';
            position: absolute;
            left: 0px;
            top: -2px;
            color: #6fcad8;
            font-size: 16px;
          }
          &:not(:last-child) {
            margin-right: 6px;
          }
        }
      }
    }
    .about-therapist {
      .profile-title {
        margin-bottom: 20px;
      }
      p {
        margin-bottom: 32px;
      }
      img {
        vertical-align: top;
      }
      .therapist-massage {
        .massage-we-have {
          width: calc(100% - 40px);
          display: inline-block;
          padding-left: 15px;
          p {
            color: ${(props) => props.theme.color.gray};
            opacity: 0.6;
            margin-bottom: 28px;
          }
        }
        &:last-child {
          .massage-we-have {
            p {
              margin-bottom: 0px;
            }
          }
        }
      }
    }
    .specialist-time-slot {
      .date-time-slot {
        margin-bottom: 24px;
        .calender-dropdown,
        .minutes-dropdown {
          display: inline-block;
          vertical-align: middle;
        }
        .calender-dropdown {
          margin-right: 32px;
          width: 240px;
          .input-group {
            &:before {
              content: '';
              position: absolute;
              right: 0px;
              top: 50%;
              transform: translateY(-50%);
              background-image: url(/images/down.svg);
              background-repeat: no-repeat;
              width: 28px;
              height: 28px;
            }
            &.date-alt {
              .datepicker {
                &.datepicker-dropdown {
                  left: 0px !important;
                }
              }
            }
          }
        }
        .minutes-dropdown {
          width: calc(33% - 76px);
          .input-group {
            .down-img {
              transform: rotate(0deg);
              position: absolute;
              right: 0px;
              top: -2px;
            }
          }
        }
        .input-group {
          position: relative;
          display: inline-block;
          vertical-align: top;
          .form-control {
            border: 0px;
            padding: 0px;
            background-color: transparent;
            &.profile-title {
              font-size: 24px;
              line-height: 30px;
              cursor: pointer;
              color: transparent;
              text-shadow: 0 0 0 #3c4042;
            }
            &::placeholder {
              font-size: 24px;
              line-height: 30px;
              font-family: 'Muli-Bold';
              opacity: 1;
              color: ${(props) => props.theme.color.textColor};
            }
          }
        }
      }
      .slots-timing {
        margin-bottom: 16px;
        .therapist-sub-title {
          margin-bottom: 14px;
        }
        .time-slot {
          a {
            width: 105px;
            &:not(:last-child) {
              margin-right: 2px;
            }
          }
        }
      }
    }
    .therapist-contact {
      .profile-title {
        margin-bottom: 20px;
      }
      .phone-number {
        a {
          font-family: 'Muli-Bold';
          font-size: 14px;
          line-height: 14px;
          color: ${(props) => props.theme.color.pink};
          &:hover {
            text-decoration: none;
          }
        }
      }
    }
    .filter-sort-option {
      display: inline-block;
      vertical-align: top;
      .input-group {
        display: inline-block;
        vertical-align: top;
        width: 120px;
        .down-img {
          position: absolute;
          right: 0px;
          top: 0px;
        }
        .dropdown-sec {
          font-family: 'Muli-Bold';
          top: 0px;
          li {
            font-size: 14px;
            &.init {
              text-align: right;
              padding-right: 32px;
              margin-bottom: 0px;
            }
          }
        }
      }
    }
    .reviews {
      .review-rating {
        margin-bottom: 32px;
      }
      .user-feedback {
        &:not(:last-child) {
          margin-bottom: 30px;
        }
        .img {
          width: 48px;
          height: 48px;
          margin-right: 16px;
        }
        .user-name {
          width: calc(100% - 70px);
          display: inline-block;
          vertical-align: middle;
          .feedback-title {
            margin-bottom: 0px;
          }
          .feedback-date {
            color: ${(props) => props.theme.color.gray};
            opacity: 0.6;
          }
        }
        .verified {
          display: inline-block;
          margin-left: 30px;
        }
        .feedback {
          margin-bottom: 0px;
          margin-top: 20px;
          width: 100%;
        }
      }
      .single-select {
        display: inline-block;
        margin-right: 12px;
        .input-group {
          padding: 13px 22px;
          font-size: 14px;
          -webkit-appearance: none;
          background-color: #fff;
          line-height: 12px;
          font-family: Muli-bold;
          input {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
            -webkit-appearance: none;
            border-radius: 20px !important;
            border: 1px solid rgba(60, 64, 66, 0.1);
            color: #3c4042;
            box-shadow: none !important;
            &:checked {
              border-color: #3c4042;
              box-shadow: inset 0 0 0 0.5px #3c4042 !important;
            }
            &:focus {
              outline: none;
            }
          }
          label {
            margin-bottom: 0px;
          }
        }
      }
    }
    .pagination-wrapper {
      margin: 40px 0px;
      nav {
        .pagination {
          align-items: center;
          li {
            font-family: 'Muli-SemiBold';
            &:not(:last-child) {
              margin-right: 16px;
            }
            &.prev,
            &.last {
              margin-right: 0px;
            }
            &.prev {
              span {
                img {
                  transform: rotate(90deg);
                }
              }
            }
            &.next {
              span {
                img {
                  transform: rotate(-90deg);
                }
              }
            }
            &.active {
              a {
                color: ${(props) => props.theme.color.pink};
                background-color: transparent;
              }
            }
            a {
              padding: 0px;
              border: 0px;
              color: ${(props) => props.theme.color.textColor};
              font-size: 18px;
              line-height: 26px;
              &:hover {
                color: ${(props) => props.theme.color.pink};
                background-color: transparent;
              }
              &:focus {
                box-shadow: none;
              }
            }
          }
        }
      }
    }
    ${(props) => props.theme.respondToMax('lg')} {
      padding: 0px;
    }
    ${(props) => props.theme.respondToMax('md')} {
      .profile-title {
        font-size: 18px;
        line-height: 26px;
      }
      .rating {
        .rate {
          font-size: 14px;
          line-height: 18px;
        }
      }
      p {
        font-size: 14px;
        line-height: 18px;
      }
      .separator {
        margin: 28px 0 10px;
      }
      .feedback-title {
        font-size: 16px;
        line-height: 20px;
      }
      .profile-information {
        .profile-head {
          .main-img {
            width: 48px;
            height: 48px;
            margin-right: 12px;
          }
          .specialist-info {
            width: calc(100% - 65px);
            .location {
              font-size: 16px;
              line-height: 20px;
              margin-bottom: 0px;
              .km {
                &:before {
                  left: 1px;
                  top: 4px;
                }
              }
            }
          }
        }
        .speciality {
          li {
            .img {
              img {
                height: 48px;
                width: 48px;
              }
            }
          }
        }
        .facility {
          width: 100%;
          margin-top: 18px;
          position: relative;
          left: 0px;
          li {
            font-size: 14px;
            line-height: 18px;
            &:before {
              top: -3px;
            }
          }
        }
      }
      .about-therapist {
        .profile-title {
          margin-bottom: 14px;
        }
        img {
          width: 24px;
        }
        .therapist-sub-title {
          font-size: 14px;
          line-height: 18px;
        }
      }
      .specialist-time-slot {
        .date-time-slot {
          margin-bottom: 12px;
          .calender-dropdown {
            width: 190px;
          }
          .minutes-dropdown {
            .input-group {
              .dropdown-sec {
                top: -1px;
              }
            }
          }
          .input-group {
            .form-control {
              &.profile-title {
                font-size: 18px;
                line-height: 26px;
              }
            }
          }
        }
      }
      .reviews {
        .review-rating {
          margin-bottom: 26px;
        }
        .user-feedback {
          .img {
            width: 40px;
            height: 40px;
            margin-right: 8px;
          }
          .user-name {
            .feedback-date {
              font-size: 14px;
              line-height: 18px;
            }
          }
          .feedback {
            margin-top: 16px;
          }
        }
      }
      .pagination-wrapper {
        nav {
          .pagination {
            li {
              &.prev {
                margin-right: 16px;
              }
              &.next {
                margin-left: 16px;
              }
            }
          }
        }
      }
    }
    ${(props) => props.theme.respondToMax('sm')} {
      .profile-information {
        .profile-head {
          margin-bottom: 16px;
          .specialist-info {
            width: calc(100% - 65px);
          }
        }
        .facility {
          margin-top: 12px;
        }
        .speciality {
          margin-top: 10px;
        }
      }
      .about-therapist {
        p {
          margin-bottom: 24px;
        }
        .therapist-massage {
          .massage-we-have {
            p {
              margin-bottom: 18px;
            }
          }
        }
      }
      .reviews {
        .review-rating {
          margin-bottom: 14px;
        }
        .user-feedback {
          .feedback {
            margin-top: 12px;
          }
        }
        .user-feedback:not(:last-child) {
          margin-bottom: 22px;
        }
        .filter-wrapper {
          .input-group {
            width: 80px;
          }
        }
      }
    }
    ${(props) => props.theme.respondToMax('xs')} {
      .profile-information {
        .speciality {
          display: inline-block;
          width: 100%;
          text-align: center;
          li {
            display: inline-block;
            width: 33%;
            &:not(:last-child) {
              margin-right: 0px;
            }
            &:not(:nth-child(-n + 3)) {
              margin-top: 16px;
            }
          }
        }
      }
      .separator {
        margin: 24px 0 10px;
      }
      .about-therapist {
        .therapist-massage {
          &:last-child {
            .massage-we-have {
              p {
                margin-bottom: 18px;
              }
            }
          }
        }
      }
      .specialist-time-slot {
        .date-time-slot {
          .calender-dropdown {
            width: 150px;
            margin-right: 20px;
          }
          .minutes-dropdown {
            width: 115px;
          }
        }
      }
      .reviews {
        .review-rating {
          margin-bottom: 20px;
          .review-btn {
            padding: 10px 10px;
          }
          .filter-wrapper {
            margin-left: 0 !important;
            width: 100%;
            margin-top: 10px;
          }
        }
      }
      .modal-cancle.modal-massage {
        .modal-content {
          height: 100% !important;
        }
      }
    }
    ${(props) => props.theme.respondToMax('s')} {
      .profile-information {
        .speciality {
          display: inline-block;
          width: 100%;
          text-align: center;
          li {
            display: inline-block;
            width: 48%;
            &:not(:last-child) {
              margin-right: 0px;
            }
            &:not(:nth-child(-n + 2)) {
              margin-top: 16px;
            }
          }
        }
      }
      .specialist-time-slot {
        .slots-timing {
          .time-slot {
            a {
              width: 32%;
              &:not(:last-child) {
                margin: 0px;
              }
              &:nth-child(3n + 2) {
                margin: 0 2px;
              }
            }
          }
        }
      }
    }
  }
  .modal-title {
    margin-bottom: 0;
    line-height: 1.5;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .modal-header {
    border-bottom: none;
  }
  .form-error {
    border: solid 1px #dc3545;
  }
`;
