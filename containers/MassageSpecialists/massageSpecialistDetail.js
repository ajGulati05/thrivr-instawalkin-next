import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import PropTypes from 'prop-types';
import Datepicker from 'components/Base/Datepicker';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import { SeperatorStyle } from 'components/StyleComponent';
import Container from 'react-bootstrap/Container';
import cx from 'classnames';
import PageLoader from 'components/Views/PageLoader';
import InputGroup from 'components/Base/InputGroup';
import { cartViewService } from 'services';
import {
  getTherapistReview,
  getProjectPricingPerTherapist,
  getTherapistData,
  getTherapistAvailability,
  getManagerSpecificEndorsements,
  getAllEndorsements,
  addTherapistReview,
  blockTherapistData,
  rescheduleBookingAppointment,
} from 'redux/app/actions';

import Footer from 'components/Footer';
import { MassageSpecialistsDetailStyleWrapper } from './massageSpecialists.style';
import Button from 'components/Base/Button';
import OrderStatusBadge from 'components/Views/Common/orderStatusBadge';
import Header from 'components/Header';
import CustomDropdown from 'components/Base/Dropdown';
import ImageComponent from 'components/Base/ImageComponent';
import { formatDate, formatYearDate } from 'util/config';
import Link from 'next/link';
import CustomModal from 'components/Base/Modal';
import Slider from 'react-slick';
import { ModalStyleWrapper } from 'containers/Order/order.style';
import { motion, AnimatePresence } from 'framer-motion';
import Alert from 'react-bootstrap/Alert';

const settings = {
  dots: false,
  infinite: true,
  autoplay: false,
  arrows: false,
  slidesToShow: 6,
  responsive: [
    {
      breakpoint: 576,
      settings: {
        infinite: false,
        centerMode: true,
        centerPadding: '70px',
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        infinite: false,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
        centerPadding: '45px',
      },
    },
    {
      breakpoint: 400,
      settings: {
        infinite: false,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
        centerPadding: '30px',
      },
    },
    {
      breakpoint: 360,
      settings: {
        infinite: false,
        centerMode: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        touchMove: true,
        centerPadding: '15px',
      },
    },
  ],
};

// Input Checkbox
const InputSingleCheckBox = ({ title, ...props }) => (
  <>
    <input type="checkbox" {...props} />
    <label>{title}</label>
  </>
);

InputSingleCheckBox.propTypes = {
  title: PropTypes.string,
};

// MultiSelect Button Toggle
const CustomDropdownFilterToggle = React.forwardRef(
  ({ children, onClick, className }, ref) => (
    <div
      className={cx(className)}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      type="button"
    >
      {children}
    </div>
  )
);

CustomDropdownFilterToggle.displayName = 'CustomDropdownFilterToggle';

CustomDropdownFilterToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

// MultiSelect Button Toggle
const CustomMenu = React.forwardRef(
  ({ children, className, 'aria-labelledby': labeledBy }, ref) => (
    <ul className={className} ref={ref} aria-labelledby={labeledBy}>
      {children}
    </ul>
  )
);

CustomMenu.displayName = 'CustomMenu';

CustomMenu.propTypes = {
  children: PropTypes.node,
  'aria-labelledby': PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

function MassageSpecialists(props) {
  // Redux State
  const dispatch = useDispatch();
  const router = useRouter();
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const therapistReview = useSelector((state) => state.app.therapistReview);
  const therapistPerAvailability = useSelector(
    (state) => state.app.therapistPerAvailability
  );
  const therapistIndividual = useSelector(
    (state) => state.app.therapistIndividual
  );

  // State
  let [dateValue, setDateTime] = useState(new Date());
  let [blockUI, setBlock] = useState(false);
  let [projectIdSpecific, setProjectIdSpecific] = useState(0);
  let [projectPricing, setProjectPricing] = useState([]);
  let [pageNumber, setPageNumber] = useState(1);
  let [therapisrtEndorsements, setTherapisrtEndorsements] = useState([]);
  let [modalShow, setModalShow] = useState(false);
  let [reviewRating, setReviewRating] = useState(0);
  let [allEndorsements, setEndorsements] = useState([]);
  let [endorsementKey, setEndorsementKey] = useState([]);
  let [commentData, setCommentData] = useState();
  let [commentError, setCommentError] = useState(false);
  let [feedbackData, setFeedbackData] = useState();
  let [sortValue, setSortValue] = useState(1);
  let [isModalSuccessError, setModalSuccessError] = useState(false);
  let [modalErrorMessage, setModalErrorMessage] = useState();
  let [rescheduleModal, setRescheduleModal] = useState(false);
  let [rescheduleMsg, setRescheduleMsg] = useState();
  let [rescheduleBlock, setRescheduleBlock] = useState(false);

  // Mount
  useEffect(() => {
    if (checkRouterParams()) {
      fetchData(router.query.specialist);
      window.dataLayer.push({
        event: 'pageVisit',
        event_label: router.query.specialist,
        event_category: 'visit',
        data: null,
      });
    }
    if (router?.query?.rescheduleslug) {
      const rescheduleslug = window.atob(router?.query?.rescheduleslug);
      if (rescheduleslug !== router.query.specialist) {
        setRescheduleBlock(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchReview(router.query.specialist);
  }, [pageNumber]);

  useEffect(() => {
    if (blockUI) {
      dispatch(blockTherapistData());
    }
  }, [blockUI]);

  const checkRouterParams = () => {
    return (
      !isEmpty(router) &&
      !isEmpty(router.query) &&
      !isEmpty(router.query.specialist)
    );
  };

  const fetchData = async (slug) => {
    // All Endorsements
    let { data: endorsements, status } = await dispatch(getAllEndorsements());

    if (!isEmpty(endorsements)) {
      setEndorsements(endorsements);
    }

    if (status) {
      // Specific Endorsement for Therapist
      let { data: badges, status: badgeStatus } = await dispatch(
        getManagerSpecificEndorsements({ slug })
      );

      if (badgeStatus) {
        let filteredData = [];
        badges.map((badge) => {
          let endorsement = endorsements.find(
            (endorsement) => endorsement.id === badge.id
          );
          if (!isEmpty(endorsement)) {
            filteredData.push({ ...endorsement, count: badge.count });
          }
        });
        setTherapisrtEndorsements(filteredData);
      }
    }

    // Get ProjectPricing
    let projectRes = await dispatch(getProjectPricingPerTherapist({ slug }));
    if (!isEmpty(projectRes) && projectRes.status) {
      if (!isEmpty(projectRes.data)) {
        setProjectPricing(
          projectRes.data.map((element) => {
            return {
              id: element.id,
              value: element.mobile_name,
              description: element.mobile_name,
              pricing: element.pricing,
            };
          })
        );

        let defaultExist = false,
          projectId = 0,
          queryDateValue = formatDate(new Date());

        projectRes.data.map((element) => {
          if (element.default) {
            defaultExist = true;
            projectId = element.id;
            setProjectIdSpecific(element.id);
          }
        });

        if (!defaultExist) {
          setProjectIdSpecific(projectRes.data[0].id);
          projectId = projectRes.data[0].id;
        }

        if (router.query.projectId) {
          setProjectIdSpecific(+router.query.projectId);
          projectId = +router.query.projectId;
        }

        if (router.query.dateValue) {
          let routeDate = new Date(router.query.dateValue);
          if (isNaN(routeDate)) {
            routeDate = new Date(router.query.dateValue.replace(' ', 'T'));
          }
          queryDateValue = formatDate(routeDate);
          setDateTime(routeDate);
        }

        // Get Availability of Therapist
        if (projectId) {
          dispatch(
            getTherapistAvailability({
              slug,
              projectId,
              dateTime: queryDateValue,
            })
          );
          let { status, data } = await dispatch(
            getTherapistData({
              slug,
              projectId,
              dateTime: queryDateValue,
            })
          );

          if (status) {
            /* Gtag Search */
            data = Array.isArray(data) ? data[0] : data;
            const durationValuePayload = projectRes.data.find(
              (element) => element.id === projectId
            );

            window.dataLayer.push({
              event: 'searchTrigger',
              event_label: data.city.toUpperCase() + '_SEARCH',
              event_category: 'Search',
              data: {
                city: data.city,
                massage_date: dateValue.toString(),
                duration: durationValuePayload.description,
                manager_slug: slug,
                page: 'details',
              },
            });

            /* FBP Detail View Item */
            // window.fbq('trackCustom', 'view_item', {
            //   actionItem: null,
            //   data: {
            //     city: data.city,
            //     massage_date: dateValue.toString(),
            //     duration: durationValuePayload.description,
            //     page: 'details',
            //   },
            //   event_label: slug,
            //   event_category: 'views',
            // });

            /* Gtag Detail View Item */
            // window.gtag('event', 'view_item', {
            //   event_category: 'views',
            //   event_label: slug,
            //   actionItem: null,
            //   data: {
            //     city: data.city,
            //     massage_date: dateValue.toString(),
            //     duration: durationValuePayload.description,
            //     page: 'details',
            //   },
            // });
          }

          if (!isEmpty(data) && data.city) {
            if (data.city !== router.query.city) {
              setBlock(true);
            }
          }
        }
      }
    }
  };

  const fetchReview = async (slug) => {
    let payload = {
      slug,
      itemCount: 5,
      pageNumber,
      filter: SortList[sortValue - 1].value.toLowerCase(),
    };
    dispatch(getTherapistReview(payload));
  };

  const handleProjectChange = (data) => {
    projectPricing.map((list) => {
      if (list.id === data.id) setProjectIdSpecific(data.id);
    });

    if (data.id !== projectIdSpecific) {
      dispatch(
        getTherapistAvailability({
          slug: router.query.specialist,
          projectId: data.id,
          dateTime: formatDate(dateValue),
        })
      );
      const durationValuePayload = projectPricing.find(
        (element) => element.id === data.id
      );

      window.dataLayer.push({
        event: 'searchTrigger',
        event_label: therapistIndividual.city.toUpperCase() + '_SEARCH',
        event_category: 'Search',
        data: {
          city: therapistIndividual.city,
          massage_date: dateValue.toString(),
          duration: durationValuePayload.description,
          manager_slug: router.query.specialist,
          page: 'details',
        },
      });
    }
  };

  const handleDateChange = (data) => {
    setDateTime(data);
    if (projectIdSpecific) {
      dispatch(
        getTherapistAvailability({
          slug: router.query.specialist,
          projectId: projectIdSpecific,
          dateTime: formatDate(data),
        })
      );

      const durationValuePayload = projectPricing.find(
        (element) => element.id === projectIdSpecific
      );

      window.dataLayer.push({
        event: 'searchTrigger',
        event_label: therapistIndividual.city.toUpperCase() + '_SEARCH',
        event_category: 'Search',
        data: {
          city: therapistIndividual.city,
          massage_date: data.toString(),
          duration: durationValuePayload.description,
          manager_slug: router.query.specialist,
          page: 'details',
        },
      });
    }
  };

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected + 1);
  };

  const handleTimeClick = async (data) => {
    if (!isEmpty(userProfile)) {
      await cartViewService({
        booking_slug: router.query.specialist,
        date_time: formatYearDate(data.start),
      });
    }

    // const durationValuePayload = projectPricing.find(
    //   (element) => element.id === projectIdSpecific
    // );

    /* FBP Detail Cart */
    // window.fbq('trackCustom', 'add_to_cart', {
    //   actionItem: 'timeslot',
    //   data: {
    //     id: router.query.specialist,
    //     list_name: therapistIndividual.city,
    //     massage_date: data.start,
    //     duration: durationValuePayload.description,
    //     page: 'details',
    //   },
    //   event_label: router.query.specialist,
    //   event_category: 'cart',
    // });

    /* Gtag Detail Cart */
    window.dataLayer.push({
      event: 'addedToCart',
      event_label: router.query.specialist,
      event_category: 'cart',
      actionItem: 'timeslot',
      data: null,
    });
  };

  const rescheduleAppointment = async (start, end) => {
    let date = new Date();
    let currentDate = Math.floor(date.getTime() / 1000);
    if (currentDate < router.query.expires) {
      const url = router.query.rescheduleurl.split('/v2/')[1];
      let payload = {
        url: `${url}&expires=${router.query.expires}&modifier=R&signature=${router.query.signature}`,
        data: {
          start,
          end,
        },
      };
      const { status, data } = await dispatch(
        rescheduleBookingAppointment(payload)
      );
      if (status) {
        setRescheduleModal(true);
        setRescheduleMsg('Your massage has been rescheduled');
        router.push(
          '/order-detail/[detail]',
          `/order-detail/${data.data.newBooking.booking.booking_slug}`
        );
      }
    } else {
      setRescheduleModal(true);
      setRescheduleMsg('Time Expired');
    }
  };

  const therapistList = (selected) => {
    let morning_therapistList = [];
    let afternoon_therapistList = [];
    let evening_therapistList = [];
    if (!isEmpty(therapistPerAvailability)) {
      therapistPerAvailability.map((availablity) => {
        if (availablity.part_of_day === 'MORNING') {
          morning_therapistList.push(availablity);
        } else if (availablity.part_of_day === 'AFTERNOON') {
          afternoon_therapistList.push(availablity);
        } else if (availablity.part_of_day === 'EVENING') {
          evening_therapistList.push(availablity);
        }
      });
      if (selected === 'MORNING') {
        if (!isEmpty(morning_therapistList)) {
          return (
            <>
              <h5 className="therapist-sub-title">Morning</h5>
              <div className="time-slot">
                {morning_therapistList.map((availablity, index) => {
                  if (
                    !isEmpty(router.query) &
                    !isEmpty(router.query.rescheduleurl)
                  ) {
                    return (
                      <a
                        onClick={() =>
                          rescheduleAppointment(
                            availablity.start,
                            availablity.end
                          )
                        }
                      >
                        <span className="badge">
                          {availablity.display_time}
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={index}
                        href={{
                          pathname: `/place-order/[order]`,
                          query: {
                            info: JSON.stringify({
                              // ...router.query,
                              time: availablity.display_time,
                              projectId: projectIdSpecific,
                              dateTime: formatDate(dateValue),
                              start: availablity.start,
                              end: availablity.end,
                              slug: router.query.specialist,
                              prevPath: router.asPath,
                            }),
                          },
                        }}
                        as={{
                          pathname: `/place-order/${router.query.specialist}`,
                          query: {
                            info: JSON.stringify({
                              // ...router.query,
                              time: availablity.display_time,
                              projectId: projectIdSpecific,
                              dateTime: formatDate(dateValue),
                              start: availablity.start,
                              end: availablity.end,
                              slug: router.query.specialist,
                              prevPath: router.asPath,
                            }),
                          },
                        }}
                      >
                        <a onClick={() => handleTimeClick(availablity)}>
                          <span className="badge">
                            {availablity.display_time}
                          </span>
                        </a>
                      </Link>
                    );
                  }
                })}
              </div>
            </>
          );
        }
      } else if (selected === 'AFTERNOON') {
        if (!isEmpty(afternoon_therapistList)) {
          return (
            <>
              <h5 className="therapist-sub-title">Afternoon</h5>
              <div className="time-slot">
                {afternoon_therapistList.map((availablity, index) => {
                  if (
                    !isEmpty(router.query) &
                    !isEmpty(router.query.rescheduleurl)
                  ) {
                    return (
                      <a
                        onClick={() =>
                          rescheduleAppointment(
                            availablity.start,
                            availablity.end
                          )
                        }
                      >
                        <span className="badge">
                          {availablity.display_time}
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={index}
                        href={{
                          pathname: `/place-order/[order]`,
                          query: {
                            info: JSON.stringify({
                              // ...router.query,
                              time: availablity.display_time,
                              projectId: projectIdSpecific,
                              dateTime: formatDate(dateValue),
                              start: availablity.start,
                              end: availablity.end,
                              slug: router.query.specialist,
                              prevPath: router.asPath,
                            }),
                          },
                        }}
                        as={{
                          pathname: `/place-order/${router.query.specialist}`,
                          query: {
                            info: JSON.stringify({
                              // ...router.query,
                              time: availablity.display_time,
                              projectId: projectIdSpecific,
                              dateTime: formatDate(dateValue),
                              start: availablity.start,
                              end: availablity.end,
                              slug: router.query.specialist,
                              city: router.query.city,
                            }),
                          },
                        }}
                      >
                        <a onClick={() => handleTimeClick(availablity)}>
                          <span className="badge">
                            {availablity.display_time}
                          </span>
                        </a>
                      </Link>
                    );
                  }
                })}
              </div>
            </>
          );
        }
      } else if (selected === 'EVENING') {
        if (!isEmpty(evening_therapistList)) {
          return (
            <>
              <h5 className="therapist-sub-title">Evening</h5>
              <div className="time-slot">
                {evening_therapistList.map((availablity, index) => {
                  if (
                    !isEmpty(router.query) &
                    !isEmpty(router.query.rescheduleurl)
                  ) {
                    return (
                      <a
                        onClick={() =>
                          rescheduleAppointment(
                            availablity.start,
                            availablity.end
                          )
                        }
                      >
                        <span className="badge">
                          {availablity.display_time}
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={index}
                        href={{
                          pathname: `/place-order/[order]`,
                          query: {
                            info: JSON.stringify({
                              // ...router.query,
                              time: availablity.display_time,
                              projectId: projectIdSpecific,
                              dateTime: formatDate(dateValue),
                              start: availablity.start,
                              end: availablity.end,
                              slug: router.query.specialist,
                              prevPath: router.asPath,
                            }),
                          },
                        }}
                        as={{
                          pathname: `/place-order/${router.query.specialist}`,
                          query: {
                            info: JSON.stringify({
                              // ...router.query,
                              time: availablity.display_time,
                              projectId: projectIdSpecific,
                              dateTime: formatDate(dateValue),
                              start: availablity.start,
                              end: availablity.end,
                              slug: router.query.specialist,
                              city: router.query.city,
                            }),
                          },
                        }}
                      >
                        <a onClick={() => handleTimeClick(availablity)}>
                          <span className="badge">
                            {availablity.display_time}
                          </span>
                        </a>
                      </Link>
                    );
                  }
                })}
              </div>
            </>
          );
        }
      }
    }
  };
  const setRating = (rating) => {
    if (rating === reviewRating) {
      setReviewRating(rating - 1);
    } else {
      setReviewRating(rating);
    }
  };
  const ratingData = () => {
    let star = [];
    let rat_class = '';
    for (let i = 0; i < 5; i++) {
      if (reviewRating >= i && reviewRating != null) {
        rat_class = 'active';
      } else {
        rat_class = '';
      }
      star.push(
        <li className={rat_class} key={i}>
          <a onClick={() => setRating(i)}>
            <img src="/images/star.svg" />
          </a>
        </li>
      );
    }
    return star;
  };
  const setEndorsement = (key) => {
    if (endorsementKey.includes(key)) {
      let filterKey = [...endorsementKey];
      const index = filterKey.indexOf(key);
      if (index > -1) {
        filterKey.splice(index, 1);
      }
      setEndorsementKey(filterKey);
    } else {
      if (endorsementKey.length < 3) {
        setEndorsementKey([...endorsementKey, key]);
      }
    }
  };

  const endorsementData = () => {
    let endorsement = [];
    let endorsement_class = '';
    allEndorsements.map((data, index) => {
      if (endorsementKey.includes(data?.id)) {
        endorsement_class = 'active';
      } else {
        endorsement_class = '';
      }
      endorsement.push(
        <div
          className={`${'choose-badge'} ${endorsement_class}`}
          onClick={() => setEndorsement(data?.id)}
          key={index}
        >
          <div className="img">
            <img src={`${data.path ? data.path : '/images/avatar.jpg'}`} />
          </div>
          <div className="name">{data.name}</div>
        </div>
      );
    });
    return endorsement;
  };

  const handleReview = async () => {
    if (isEmpty(commentData)) {
      setCommentError(true);
    }
    let data = {
      comment: commentData,
      score: reviewRating + 1,
      endorsementKey,
    };
    if (!isEmpty(feedbackData)) {
      data.feedback = feedbackData;
    }
    let payload = {
      slug: router.query.specialist,
      type: 'therapist',
      data,
    };

    if (!isEmpty(commentData)) {
      if (feedbackData && feedbackData.length < 10) {
        setModalErrorMessage(
          'The personal feedback must be between 10 and 500 characters.'
        );
        setModalSuccessError(true);
        setTimeout(() => {
          setModalSuccessError(false);
          setModalErrorMessage();
        }, 2100);
      } else {
        let { status, error } = await dispatch(addTherapistReview(payload));
        if (status) {
          setModalShow(false);
          dispatch(
            getTherapistReview({
              slug: router.query.specialist,
              itemCount: 5,
              pageNumber,
              filter: SortList[sortValue - 1].value.toLowerCase(),
            })
          );
        }
        if (!isEmpty(error)) {
          setModalErrorMessage(error);
          setModalSuccessError(true);
          setTimeout(() => {
            setModalSuccessError(false);
          }, 2100);
        }
      }
    }
  };
  const handleCommentChange = (e) => {
    setCommentData(e.target.value);
  };
  // const handleFeedbackChange = (e) => {
  //   setFeedbackData(e.target.value);
  // };

  // Sort handler
  const handleSortChange = (data) => {
    SortList.map((list) => {
      if (list.id === data.id) setSortValue(data.id);
    });
    let payload = {
      slug: router.query.specialist,
      itemCount: 5,
      pageNumber,
    };
    if (sortValue == data.id) {
      setSortValue(1);
      payload.filter = 'default';
    } else {
      setSortValue(data.id);
      payload.filter = data.value.toLowerCase();
    }
    dispatch(getTherapistReview(payload));
  };

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <Head>
        <>
          <title>
            {`${props.massageData.manager_first_name} ${props.massageData.manager_last_name} Registered Massage Therapist,${router.query.city}  | Thrivr`}
          </title>
          {!isEmpty(props) && !isEmpty(props.massageData) && (
            <>
              <meta
                property="og:title"
                content={`${props.massageData.manager_first_name} ${props.massageData.manager_last_name} Registered Massage Therapist, ${router.query.city} | Thrivr`}
              />

              <meta
                property="og:description"
                content={`${props.massageData.tag_line}`}
              />
              {/* <meta
                property="og:image"
                content={
                  props.massageData.profile_photo
                    ? props.massageData.profile_photo
                    : '/images/Thrivr_2.png'
                }
              /> */}
            </>
          )}
        </>
      </Head>

      <MassageSpecialistsDetailStyleWrapper className="content-wrapper detail-massage-specialist">
        <ModalStyleWrapper>
          <Header className="header-white" />
          <section className="d-flex">
            <Container className="m-auto">
              <div className="detail-profile-wrapper">
                {/* Details */}
                <div className="specialist-details">
                  <CustomModal
                    show={rescheduleModal}
                    onHide={() => setRescheduleModal(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    className="modal-cancle desktop-alt massage-confirm"
                    header={
                      <>
                        <h5
                          className="modal-title d-sm-block"
                          id="exampleModalLabel"
                        >
                          {rescheduleMsg}
                        </h5>
                      </>
                    }
                    footer={
                      <Button
                        className="btn d-sm-block"
                        onClick={() => setRescheduleModal(false)}
                      >
                        Ok
                      </Button>
                    }
                  />
                  <CustomModal
                    show={rescheduleBlock}
                    onHide={() => setRescheduleModal(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    backdrop="static"
                    className="modal-cancle desktop-alt massage-confirm"
                    header={
                      <>
                        <h5
                          className="modal-title d-sm-block"
                          id="exampleModalLabel"
                        >
                          Invalid url, please try again later.
                        </h5>
                      </>
                    }
                    footer={
                      <Button
                        className="btn d-sm-block"
                        onClick={() => router.push('/order-history')}
                      >
                        Ok
                      </Button>
                    }
                  />
                  <div className="profile-information">
                    <div className="profile-head">
                      <div className="main-img">
                        {!isEmpty(therapistIndividual) ? (
                          therapistIndividual.profile_photo ? (
                            <img src={therapistIndividual.profile_photo} />
                          ) : (
                            <img src="/images/avatar.png" />
                          )
                        ) : (
                          <img src="/images/avatar.png" />
                        )}
                        <img src="/images/avatar.png" />
                      </div>
                      <div className="specialist-info">
                        <div className="name-rating d-flex justify-content-between">
                          <h4 className="profile-title">
                            {`${
                              !isEmpty(therapistIndividual)
                                ? therapistIndividual.manager_first_name +
                                  ' ' +
                                  therapistIndividual.manager_last_name
                                : '- -'
                            }`}
                          </h4>
                          <div className="rating">
                            <img src="/images/star.svg" />
                            <div className="rate">
                              {!isEmpty(therapistIndividual)
                                ? therapistIndividual.rating
                                : '-'}{' '}
                              <span>
                                (
                                {!isEmpty(therapistIndividual)
                                  ? therapistIndividual.review_count
                                  : '-'}
                                )
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="location">
                          {!isEmpty(therapistIndividual.address)
                            ? therapistIndividual.address
                            : 'Location'}

                          <span className="km">
                            {!isEmpty(therapistIndividual)
                              ? therapistIndividual.distance
                              : '-'}{' '}
                            km from you
                          </span>
                        </div>
                      </div>
                      <ul className="list-unstyled facility">
                        {!isEmpty(therapistIndividual) && (
                          <>
                            {therapistIndividual.parking && (
                              <li>Free parking</li>
                            )}
                            {therapistIndividual.direct_billing && (
                              <li>Direct billing</li>
                            )}
                          </>
                        )}
                      </ul>
                    </div>
                    <p className="specialist-review">
                      {!isEmpty(therapistIndividual) &&
                        therapistIndividual.tag_line}
                    </p>
                    <ul className="list-unstyled speciality">
                      {!isEmpty(therapisrtEndorsements) &&
                        therapisrtEndorsements.map((endorsement) => (
                          <li key={endorsement.id}>
                            <div className="img">
                              <img src={endorsement.path} />
                              <span className="badge">{endorsement.count}</span>
                            </div>
                            <span className="speciality-title">
                              {endorsement.name}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <SeperatorStyle className="separator" />
                <div className="about-therapist">
                  <h4 className="profile-title">About therapist</h4>
                  <p>
                    {!isEmpty(therapistIndividual) &&
                      therapistIndividual.about_therapist}
                  </p>
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="row">
                        {!isEmpty(therapistIndividual) &&
                          therapistIndividual.manager_specialities.map(
                            (special, index) => {
                              if (index < 3) {
                                return (
                                  <div
                                    className="col-sm-12 therapist-massage"
                                    key={index}
                                  >
                                    <img src={special.image_path} />
                                    <div className="massage-we-have">
                                      <h5 className="therapist-sub-title">
                                        {special.description}
                                      </h5>
                                      <p>{special.long_description}</p>
                                    </div>
                                  </div>
                                );
                              }
                            }
                          )}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="row">
                        {!isEmpty(therapistIndividual) &&
                          therapistIndividual.manager_specialities.map(
                            (special, index) => {
                              if (index > 2) {
                                return (
                                  <div
                                    className="col-sm-12 therapist-massage"
                                    key={index}
                                  >
                                    <img src={special.image_path} />
                                    <div className="massage-we-have">
                                      <h5 className="therapist-sub-title">
                                        {special.description}
                                      </h5>
                                      <p>{special.long_description}</p>
                                    </div>
                                  </div>
                                );
                              }
                            }
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <SeperatorStyle className="separator" />
                <h4 className="profile-title mb-2">Date and Duration</h4>
                {/* Time Slot */}
                {!isEmpty(therapistIndividual) &&
                therapistIndividual.product_code !== 'L' ? (
                  <div className="specialist-time-slot">
                    <div className="date-time-slot">
                      <div className="calender-dropdown">
                        <InputGroup
                          isCustom
                          className="date-alt mob-half d-inline-block"
                        >
                          <Datepicker
                            page="therapist-profile"
                            dateClassName="form-control profile-title"
                            pastDateDisable={true}
                            value={dateValue}
                            handleDateChange={handleDateChange}
                          />
                        </InputGroup>
                      </div>
                      <div className="minutes-dropdown">
                        <InputGroup isCustom className="input-group">
                          <CustomDropdown
                            list={projectPricing}
                            value={projectIdSpecific}
                            listClassname="hours"
                            placeholderClassname="profile-title"
                            placeholder="Min"
                            handleDropdownChange={handleProjectChange}
                          />
                        </InputGroup>
                      </div>
                    </div>
                    {!isEmpty(therapistPerAvailability) ? (
                      <React.Fragment>
                        <div className="slots-timing">
                          {therapistList('MORNING')}
                        </div>
                        <div className="slots-timing">
                          {therapistList('AFTERNOON')}
                        </div>
                        <div className="slots-timing">
                          {therapistList('EVENING')}
                        </div>
                      </React.Fragment>
                    ) : (
                      'No availability for the day'
                    )}
                  </div>
                ) : (
                  <div className="therapist-contact">
                    <h4 className="profile-title">Contact RMT</h4>
                    <span className="phone-number">
                      <img
                        src="/images/phone.svg"
                        style={{ marginRight: 15 }}
                      />
                      {!isEmpty(therapistIndividual) && (
                        <a href={`${'tel:'}${therapistIndividual.phone}`}>
                          {therapistIndividual.phone}
                        </a>
                      )}
                    </span>
                  </div>
                )}
                <SeperatorStyle className="separator" />

                {/* Reviews */}
                <div className="reviews">
                  <div className="review-rating d-flex flex-wrap align-items-center">
                    <h4 className="profile-title">Reviews</h4>
                    <Button
                      className="login ml-4 review-btn"
                      onClick={() => setModalShow(true)}
                    >
                      Leave a review
                    </Button>
                    <div className="filter-wrapper ml-auto align-items-center d-flex">
                      <div className="filter-sort-option">
                        <div className="input-group">
                          <CustomDropdown
                            list={SortList}
                            value={sortValue}
                            listClassname="sort-opt"
                            placeholder="Sort by"
                            handleDropdownChange={handleSortChange}
                          />
                        </div>
                      </div>
                      <div className="rating ml-4">
                        <img src="/images/star.svg" />
                        <div className="rate">
                          {!isEmpty(therapistIndividual)
                            ? therapistIndividual.rating
                            : '-'}{' '}
                          <span>
                            (
                            {!isEmpty(therapistIndividual)
                              ? therapistIndividual.review_count
                              : '-'}
                            )
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!isEmpty(therapistReview.reviews) &&
                    therapistReview.reviews.total !== 0 &&
                    therapistReview.reviews.data.map((review, inx) => (
                      <div className="user-feedback d-flex flex-wrap" key={inx}>
                        <div className="img">
                          <ImageComponent
                            src={`${
                              review.avatar
                                ? review.avatar
                                : '/images/avatar.png'
                            }`}
                          />
                        </div>
                        <div className="user-name" style={{ width: 'auto' }}>
                          <h4 className="feedback-title">{`${review.firstname} ${review.lastname}`}</h4>
                          <span className="feedback-date">
                            {review.created_at}
                          </span>
                          {review.verified ? (
                            <div className="verified">
                              <OrderStatusBadge
                                title="Verified"
                                variant="red"
                              />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        <p className="feedback">{review.body}</p>
                      </div>
                    ))}
                  <CustomModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="modal-cancle desktop-alt modal-massage"
                    container={() =>
                      document.querySelector('.detail-profile-wrapper')
                    }
                    header={
                      <>
                        {/* Alert Error Message */}
                        <AnimatePresence>
                          {isModalSuccessError && (
                            <motion.div
                              className="alert-wrapper"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              exit={{ opacity: 0 }}
                            >
                              <Alert variant={'error'}>
                                {modalErrorMessage}
                              </Alert>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <h5
                          className="modal-title d-none d-sm-block"
                          id="exampleModalLabel"
                        >
                          {`${
                            !isEmpty(therapistIndividual)
                              ? therapistIndividual.manager_first_name +
                                ' ' +
                                therapistIndividual.manager_last_name
                              : '- -'
                          }`}
                        </h5>
                        <h5
                          className="modal-title d-block d-sm-none"
                          id="exampleModalLabel"
                        >
                          Rate your experience
                        </h5>
                      </>
                    }
                    body={
                      <>
                        <h5 className="modal-title d-block d-sm-none">
                          {`${
                            !isEmpty(therapistIndividual)
                              ? therapistIndividual.manager_first_name +
                                ' ' +
                                therapistIndividual.manager_last_name
                              : '- -'
                          }`}
                        </h5>
                        <ul className="list-unstyled">{ratingData()}</ul>
                        <div className="badges">
                          <div>You can choose up to three badges</div>
                          <Slider {...settings} className="slider">
                            {endorsementData()}
                          </Slider>
                        </div>
                        <form>
                          <div className="form-group">
                            <label>Leave a review</label>
                            <textarea
                              className={`${
                                commentError ? 'form-error' : ''
                              } ${'form-control'}`}
                              placeholder="Write something…"
                              rows="4"
                              onChange={handleCommentChange}
                            ></textarea>
                          </div>
                        </form>
                      </>
                    }
                    footer={
                      <>
                        <Button
                          className="btn btn-white d-none d-sm-block"
                          onClick={() => setModalShow(false)}
                        >
                          Cancel
                        </Button>
                        {!isEmpty(userProfile) ? (
                          <Button
                            className={`${
                              isEmpty(endorsementKey) || isEmpty(commentData)
                                ? 'disabled'
                                : ''
                            }`}
                            onClick={handleReview}
                          >
                            Leave a review
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              router.push(
                                `/login?redirectFrom=${router.asPath}`
                              )
                            }
                          >
                            Log in
                          </Button>
                        )}
                      </>
                    }
                  />
                </div>
                {!isEmpty(therapistReview.reviews) &&
                  therapistReview.reviews.total !== 0 && (
                    <div className="pagination-wrapper">
                      <nav aria-label="Page navigation">
                        <ReactPaginate
                          previousLabel={
                            <>
                              <span aria-hidden="true">
                                <img src="/images/down.svg" />
                              </span>
                              <span className="sr-only">Previous</span>
                            </>
                          }
                          nextLabel={
                            <>
                              <span aria-hidden="true">
                                <img src="/images/down.svg" />
                              </span>
                              <span className="sr-only">Next</span>
                            </>
                          }
                          breakLabel={'...'}
                          pageLinkClassName={'page-link'}
                          breakClassName={'break-me'}
                          pageCount={therapistReview.reviews.last_page}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={2}
                          onPageChange={handlePageClick}
                          previousLinkClassName={'page-link'}
                          nextLinkClassName={'page-link'}
                          containerClassName={
                            'pagination justify-content-center'
                          }
                          pageClassName={'page-item'}
                          nextClassName={'next page-item'}
                          previousClassName={'prev page-item'}
                          activeClassName={'active'}
                        />
                      </nav>
                    </div>
                  )}
              </div>
            </Container>
          </section>

          {/* Footer Section */}
          <Footer />
        </ModalStyleWrapper>
      </MassageSpecialistsDetailStyleWrapper>
    </PageLoader>
  );
}

MassageSpecialists.propTypes = {
  massageData: PropTypes.object,
};

const SortList = [
  {
    id: 1,
    value: 'Default',
  },
  {
    id: 2,
    value: 'Latest',
  },
  {
    id: 3,
    value: 'Verified',
  },
];

export default MassageSpecialists;
