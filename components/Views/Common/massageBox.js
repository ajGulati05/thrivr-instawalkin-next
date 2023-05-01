import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Link from 'next/link';
import isEmpty from 'lodash.isempty';
import Input from '../../Base/Input';
import Button from '../../Base/Button';
import { cartViewService, ctaRecordLogger } from 'services';
import { formatYearDate } from 'util/config';
import { MassageBoxStyleWrapper } from './style';

export default function MassageBoxComponent({
  className,
  data = {},
  projectIdSpecific,
  router,
  datetime,
  isTime = false,
  variant = 'box',
  userProfile,
  recommendTherapistName,
  ...props
}) {
  const handleTimeClick = async (data, time) => {
    if (!isEmpty(userProfile)) {
      await cartViewService({
        booking_slug: data.slug,
        date_time: formatYearDate(time.start),
      });
    }

    window.dataLayer.push({
      event: 'addedToCart',
      event_label: data.slug,
      event_category: 'cart',
      actionItem: 'timeslot',
      data: null,
    });
  };

  const handleTelephoneClick = (data) => {
    window.dataLayer.push({
      event: 'phoneClick',
      event_label: data.slug,
      event_category: 'clicks',
      data: null,
    });
  };

  const handleProfileClick = () => {
    window.dataLayer.push({
      event: 'profilePictureClick',
      event_label: data.slug,
      event_category: 'clicks',
      data: null,
    });
  };

  const handleMainClick = (data, timeCheck) => {
    window.dataLayer.push({
      event: timeCheck ? 'MoreTimesClick' : 'MoreInfoClick',
      event_label: data.slug,
      event_category: 'clicks',
      data: null,
    });
  };

  const handleProfileNameClick = () => {
    window.dataLayer.push({
      event: 'profileNameClick',
      event_label: data.slug,
      event_category: 'clicks',
      data: null,
    });
  };

  const [therapist_name, set_therapist_name] = useState('');
  return (
    <MassageBoxStyleWrapper
      {...props}
      className={cx(className, {
        box: variant !== 'box-black',
        'box-black': variant === 'box-black',
      })}
    >
      {variant === 'box' ? (
        <>
          <div className="profile-name">
            <div className="img">
              <Link
                href={{
                  pathname: `/massage-therapists/[city]/[specialist]`,
                  query: { dateValue: datetime, projectId: projectIdSpecific },
                }}
                as={`/massage-therapists/${data.city}/${data.slug}?dateValue=${datetime}&projectId=${projectIdSpecific}`}
              >
                <a onClick={handleProfileClick}>
                  <img src={data.profile_photo || '/images/avatar.png'} />
                </a>
              </Link>
            </div>
            <div className="profile-info">
              <div className="name-rating">
                <Link
                  href={{
                    pathname: `/massage-therapists/[city]/[specialist]`,
                    query: {
                      dateValue: datetime,
                      projectId: projectIdSpecific,
                    },
                  }}
                  as={`/massage-therapists/${data.city}/${data.slug}?dateValue=${datetime}&projectId=${projectIdSpecific}`}
                >
                  <a onClick={handleProfileNameClick}>
                    <h4 className="sub-title">{`${data.manager_first_name} ${data.manager_last_name}`}</h4>
                  </a>
                </Link>
                <div className="rate">
                  {data.rating && data.rating !== '0' && (
                    <img src="/images/star.svg" />
                  )}
                  <div>
                    {data.rating && data.rating !== '0' && data.rating}{' '}
                    <span>
                      {data.review_count && '(' + data.review_count + ')'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="location">
                {!isEmpty(data) ? data.address : 'Location'}
                <br />
                <span className="km">
                  {!isEmpty(data) ? data.distance : 0} km from you
                </span>
              </div>
            </div>
          </div>
          <ul className="list-unstyled facility">
            {data.parking && <li>Free parking</li>}
            {data.direct_billing && <li>Direct billing</li>}
          </ul>
          <ul className="list-unstyled massage-types">
            {!isEmpty(data.manager_specialities)
              ? data.manager_specialities.map((specialist) => (
                  <li key={specialist.code}>
                    <img src={specialist.image_path} />
                  </li>
                ))
              : null}
          </ul>
          <p className="review">
            {data.tag_line.length > 100
              ? data.tag_line.substring(0, 100) + '...'
              : data.tag_line}
          </p>
          {isTime ? (
            <div className="massage-list time-slot">
              {!isEmpty(data.availability) ? (
                data.availability.map((time, index) => {
                  if (index < 3) {
                    return (
                      <Link
                        key={index}
                        href={{
                          pathname: `/place-order/[order]`,
                          query: {
                            info: JSON.stringify({
                              time: time.display_time,
                              projectId: projectIdSpecific,
                              dateTime: datetime,
                              start: time.start,
                              end: time.end,
                              slug: data.slug,
                              prevPath: router.asPath,
                              city: data.city,
                            }),
                          },
                        }}
                        as={{
                          pathname: `/place-order/${data.slug}`,
                          query: {
                            info: JSON.stringify({
                              time: time.display_time,
                              projectId: projectIdSpecific,
                              dateTime: datetime,
                              start: time.start,
                              end: time.end,
                              slug: data.slug,
                              prevPath: router.asPath,
                              city: data.city,
                            }),
                          },
                        }}
                      >
                        <a onClick={() => handleTimeClick(data, time)}>
                          <span className="badge">{time.display_time}</span>
                        </a>
                      </Link>
                    );
                  } else {
                    return null;
                  }
                })
              ) : (
                <p>
                  <span>No availability for the day</span>
                </p>
              )}
            </div>
          ) : (
            <div className="phone-number">
              <a
                href={`${'tel:'}${data.phone}`}
                onClick={() => handleTelephoneClick(data)}
              >
                {data.phone
                  ? data.phone.substring(0, 2) +
                    '-(' +
                    data.phone.substring(2, 5) +
                    ')-' +
                    data.phone.substring(5, 8) +
                    '-' +
                    data.phone.substring(8)
                  : ''}
              </a>
            </div>
          )}
          <Link
            href={{
              pathname: `/massage-therapists/[city]/[specialist]`,
              query: { dateValue: datetime, projectId: projectIdSpecific },
            }}
            as={`/massage-therapists/${data.city}/${data.slug}?dateValue=${datetime}&projectId=${projectIdSpecific}`}
          >
            <Button
              className="w-100"
              onClick={() => handleMainClick(data, isTime)}
            >
              {isTime ? 'More times' : 'More info'}
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h3 className="box-title">Don’t see your Massage Therapist?</h3>
          <p>Add their information and we’ll contact them.</p>
          <form>
            <div className="input-group">
              <Input
                placeholder="Therapist Name"
                name="therapist_name"
                value={therapist_name}
                onChange={(e) => {
                  let value = e.target.value;
                  set_therapist_name(value);
                  if (/@/.test(value)) {
                    ctaRecordLogger({ email: value, type: 'L' });
                  }
                }}
              />
            </div>

            <Button
              className="w-100"
              onClick={() => {
                if (!isEmpty(therapist_name)) {
                  recommendTherapistName(therapist_name);
                  set_therapist_name('');
                }
              }}
            >
              Recommend
            </Button>
          </form>
        </>
      )}
    </MassageBoxStyleWrapper>
  );
}

MassageBoxComponent.propTypes = {
  className: PropTypes.string,
  datetime: PropTypes.string,
  projectIdSpecific: PropTypes.number,
  variant: PropTypes.string,
  data: PropTypes.object,
  userProfile: PropTypes.object,
  router: PropTypes.object,
  isTime: PropTypes.bool,
  recommendTherapistName: PropTypes.func,
  handleMoreTime: PropTypes.func,
};
