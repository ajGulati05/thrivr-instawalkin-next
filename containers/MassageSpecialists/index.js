import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import isEmpty from 'lodash.isempty';
import isEqual from 'lodash.isequal';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import cx from 'classnames';
import PageLoader from 'components/Views/PageLoader';
import Dropdown from 'react-bootstrap/Dropdown';
import Alert from 'react-bootstrap/Alert';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useWindowWidth } from '@react-hook/window-size';
import PropTypes from 'prop-types';
import Button from 'components/Base/Button';
import InputGroup from 'components/Base/InputGroup';
import {
  getProductAndPricing,
  getManagerSpecialities,
  getTherapists,
} from 'redux/app/actions';
import { getRecommendedRMT, getRecommendedRMTSigned } from 'redux/auth/actions';
import SearchSectionComponent from 'components/Views/Common/searchComponent';
import Footer from 'components/Footer';
import { MassageSpecialistsStyleWrapper } from './massageSpecialists.style';
import Header from 'components/Header';
import MassageBoxComponent from 'components/Views/Common/massageBox';
import CustomDropdown from 'components/Base/Dropdown';
import { formatDate, timezoneRegexFormat } from 'util/config';

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

const InitialFormFilterData = {
  genderValues: [],
  directBilling: false,
  isParking: false,
  massageType: [],
};

export default function MassageSpecialists() {
  // Redux State
  const dispatch = useDispatch();
  const router = useRouter();
  const productPricingArr = useSelector((state) => state.app.productPricingArr);
  const gtagId = useSelector((state) => state.auth.gtagId);
  const authenticated = useSelector((state) => state.auth.authenticated);
  const therapistObj = useSelector((state) => state.app.therapistObj);
  const specialistArr = useSelector((state) => state.app.specialistArr);
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const userProfile = useSelector((state) => state.auth.userProfile);

  const defaultLaunchedCities = useSelector(
    (state) => state.app.defaultLaunchedCities
  );

  // State
  let [dateValue, setDateTime] = useState(new Date());
  let [durationPayload, setDuration] = useState(productPricingArr);
  let [specialistValue, setSpecialistArr] = useState(specialistArr);
  let [durationValue, setDurationValue] = useState(0);
  let [locationValue, setLocationValue] = useState({
    touched: false,
    value: defaultLaunchedCities[0].city_name,
    timezone: 'America_Regina',
    geoLoc: {
      lattitude: parseFloat(defaultLaunchedCities[0].latitude),
      longitude: parseFloat(defaultLaunchedCities[0].longitude),
    },
  });
  let [sortValue, setSortValue] = useState(1);
  let [isFilterNeed, setFilterNeed] = useState({
    isDirectBillingNeed: true,
    isParkingNeed: true,
  });
  let [modalFilterOpen, setModalFilterOpen] = useState(false);
  let [successMessage, setSuccessMessage] = useState('');
  let [isFilter, setIsFilter] = useState(false);
  let [formFilter, setFormFilter] = useState({
    ...InitialFormFilterData,
  });
  let [isTherapistLoaded, setIsTherapistLoaded] = useState(false);

  let widthWindow = useWindowWidth();

  // Mount
  useEffect(() => {
    fetchDataAndHandleRedirect();
  }, []);

  useEffect(() => {
    if (!isEqual(InitialFormFilterData, formFilter)) {
      setIsFilter(true);
    } else {
      setIsFilter(false);
    }
  }, [formFilter]);

  useEffect(() => {
    if (
      !isEmpty(therapistObj) &&
      !isEmpty(therapistObj.available_therapists) &&
      !isEmpty(therapistObj.listing_therapists)
    ) {
      let avaTherapist = therapistObj.available_therapists || [];
      let listTherapist = therapistObj.listing_therapists || [];
      let sumData = [...avaTherapist, ...listTherapist];
      let billingCheck = sumData.every((element) => !element.direct_billing);
      let parkingCheck = sumData.every((element) => !element.parking);

      setFilterNeed({
        ...isFilterNeed,
        isDirectBillingNeed: !billingCheck,
        isParkingNeed: !parkingCheck,
      });
    }
  }, [therapistObj]);

  const redirectHandle = async (query, projectIdData) => {
    let payload = query.search
      ? JSON.parse(decodeURIComponent(query.search))
      : null;

    if (payload) {
      let date = new Date(payload.dateValue);
      setDateTime(date);
      setDurationValue(payload.durationValue);
      setLocationValue({ ...payload.locationValue });

      /* Gtag Search */
      const durationValuePayload = projectIdData.find(
        (element) => element.id === payload.durationValue
      );

      window.dataLayer.push({
        event: 'searchTrigger',
        event_label: payload.locationValue.value.toUpperCase() + '_SEARCH',
        event_category: 'Search',
        data: {
          city: payload.locationValue.value,
          massage_date: payload.dateValue.toString(),
          duration: durationValuePayload.description,
          page: 'listing',
        },
      });

      let { status, data: therapistData } = await dispatch(
        getTherapists(
          {
            ...payload.locationValue.geoLoc,
            timezone: payload.locationValue.timezone || 'America_Regina',
            date: formatDate(date),
            projectId: payload.durationValue,
          },
          true
        )
      );

      if (status) {
        setIsTherapistLoaded(true);
        let avaTherapist = therapistData.available_therapists || [];
        let listTherapist = therapistData.listing_therapists || [];
        let therapistFiltered = [...avaTherapist, ...listTherapist];
        therapistFiltered = therapistFiltered.map((element, index) => {
          return {
            item_id: element.slug,
            index,
            quantity: element.availability ? element.availability.length : 0,
          };
        });
        /* Gtag List */
        window.dataLayer.push({
          event: 'searchTrigger',
          event_label: payload.locationValue.value.toUpperCase() + '_SEARCH',
          event_category: 'Search',
          data: {
            list_name: payload.locationValue.value,
            items: therapistFiltered,
          },
        });
      }
    }
  };

  const fetchProductPricing = async () => {
    let response = await dispatch(getProductAndPricing({}, true));
    if (response.status) {
      setDuration(response.data);
      let durationCheck = false;
      response.data.map((product) => {
        if (product.default) {
          durationCheck = true;
          setDurationValue(product.id);
        }
      });
      !durationCheck ? setDurationValue(response.data[0].id) : null;
      return response.data;
    }
    return [];
  };

  const fetchDataAndHandleRedirect = async () => {
    const projectIdData = await fetchProductPricing();

    let specialists = [];
    // Fetch Specialities
    let response = await dispatch(getManagerSpecialities());
    if (response.status) {
      setSpecialistArr(response.data);
      if (!isEmpty(response.data)) {
        specialists = response.data.map((specialist) => specialist.code);
      }
    }

    if (router && !isEmpty(router.query)) {
      redirectHandle(router.query, projectIdData);
    }
    // Set Default
    setFormFilter({
      ...formFilter,
      genderValues: ['M', 'F', 'O'],
      massageType: [...specialists],
    });
  };

  // Search Component handlers
  const handleGoogleChange = (value) => {
    setLocationValue({ ...locationValue, value });
  };

  const handleGoogleSelect = async (data) => {
    let timezoneResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/timezone/json?location=${
        data.geoLoc.lattitude
      },${data.geoLoc.longitude}&timestamp=${Math.floor(
        dateValue.getTime() / 1000
      )}&key=${process.env.ADDRESS_AUTOCOMPLETE_API_KEY}`
    );
    setLocationValue({
      ...locationValue,
      timezone: timezoneResponse.data.timeZoneId.replace(
        timezoneRegexFormat,
        '_'
      ),
      ...data,
      touched: true,
    });
  };

  const handleDropdownChange = (data) => {
    setDurationValue(data.id);
  };

  const handleDateChange = (data) => {
    setDateTime(data);
  };

  const handleSearchSumbit = async (e) => {
    e.preventDefault();
    if (!locationValue) return;
    let { status, data: therapistData } = await dispatch(
      getTherapists(
        {
          ...locationValue.geoLoc,
          timezone: locationValue.timezone || 'America_Regina',
          date: formatDate(dateValue),
          projectId: durationValue,
        },
        true
      )
    );
    if (status) {
      /* Gtag Search */
      const durationValuePayload = productPricingArr.find(
        (element) => element.id === durationValue
      );

      window.dataLayer.push({
        event: 'searchTrigger',
        event_label: locationValue.value.toUpperCase() + '_SEARCH',
        event_category: 'Search',
        data: {
          city: locationValue.value,
          massage_date: dateValue.toString(),
          duration: durationValuePayload.description,
          page: 'listing',
        },
      });

      let avaTherapist = therapistData.available_therapists || [];
      let listTherapist = therapistData.listing_therapists || [];
      let therapistFiltered = [...avaTherapist, ...listTherapist];
      therapistFiltered = therapistFiltered.map((element, index) => {
        return {
          item_id: element.slug,
          index,
          quantity: element.availability ? element.availability.length : 0,
        };
      });
      /* Gtag List */
      window.dataLayer.push({
        event: 'searchTrigger',
        event_label: locationValue.value.toUpperCase() + '_SEARCH',
        event_category: 'Search',
        data: {
          list_name: locationValue.value,
          items: therapistFiltered,
        },
      });

      urlSearchParamsChangeOnSubmit();
    }
  };

  // Sort handler
  const handleSortChange = (data) => {
    SortList.map((list) => {
      if (list.id === data.id) setSortValue(data.id);
    });
  };

  const urlSearchParamsChangeOnSubmit = () => {
    router.replace({
      pathname: '/massage-therapists',
      query: {
        ...router.query,
        search: encodeURIComponent(
          JSON.stringify({
            locationValue,
            durationValue,
            dateValue,
          })
        ),
      },
    });
  };

  // Filter Modal handler
  const handleFilterModal = () => {
    if (!modalFilterOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    setModalFilterOpen(!modalFilterOpen);
  };

  const handleFilterParking = (e) => {
    setFormFilter({ ...formFilter, isParking: e.target.checked });
  };

  const handleFilterDirectBilling = (e) => {
    setFormFilter({ ...formFilter, directBilling: e.target.checked });
  };

  const handleFilterGender = (e) => {
    let genderValue = [...formFilter.genderValues];
    if (e.target.value && !genderValue.includes(e.target.value)) {
      genderValue.push(e.target.value);
    } else {
      genderValue = genderValue.filter((element) => element !== e.target.value);
    }

    setFormFilter({
      ...formFilter,
      genderValues: [...genderValue],
    });
  };

  const handleFilterMassageType = (e) => {
    let massageType = [...formFilter.massageType];
    if (e.target.value && !massageType.includes(e.target.value)) {
      massageType.push(e.target.value);
    } else {
      massageType = massageType.filter((element) => element !== e.target.value);
    }

    setFormFilter({
      ...formFilter,
      massageType: [...massageType],
    });
  };

  const availableFilterHandler = (data) => {
    if (isFilter) {
      let status = false;

      if (!isEmpty(formFilter.genderValues)) {
        status = formFilter.genderValues.includes(data.gender);
        if (!status) return status;
      }
      // Massage check
      if (!isEmpty(formFilter.massageType)) {
        status = data.manager_specialities.some((specialist) => {
          return formFilter.massageType.includes(specialist.code);
        });
        if (!status) return status;
      }

      // Both checked - Direct billing check and Parking check
      if (formFilter.directBilling && formFilter.isParking) {
        status = data.direct_billing || data.parking ? true : false;
        return status;
      }

      // Direct billing check
      if (formFilter.directBilling) {
        status = data.direct_billing ? true : false;
        if (!status) return status;
      }
      // Parking check
      if (formFilter.isParking) {
        status = data.parking ? true : false;
        if (!status) return status;
      }

      return status;
    }
    return true;
  };

  // Recommend Submit
  const recommendTherapistName = async (therapist_name) => {
    let status = false;
    let message = null;
    if (authenticated) {
      let res = await dispatch(getRecommendedRMTSigned({ therapist_name }));
      status = res.status;
      message = res.message;
    } else {
      let res = await dispatch(getRecommendedRMT({ therapist_name }));
      status = res.status;
      message = res.message;
    }

    if (status) {
      setSuccessMessage(message);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };

  const handleMoreTime = (data) => {
    router.push(
      {
        pathname: '/massage-therapists/[city]/[specialist]',
        query: { dateValue: dateValue, projectId: durationValue },
      },
      `/massage-therapists/${data.city}/${data.slug}?dateValue=${dateValue}&projectId=${durationValue}`
    );
  };

  const handleSortArray = (a, b) => {
    if (sortValue === 1 && a.availability && b.availability) {
      return b.availability.length - a.availability.length;
    }
    if (sortValue === 2 && a.review_count && b.review_count) {
      return b.review_count - a.review_count;
    }
    if (sortValue === 3 && a.distance && b.distance) {
      return a.distance - b.distance;
    }
    if (sortValue === 4 && a.review_count && b.review_count) {
      return a.review_count - b.review_count;
    }
  };

  let availableTherapist =
    !isEmpty(therapistObj) && !isEmpty(therapistObj.available_therapists)
      ? therapistObj.available_therapists
          .filter(availableFilterHandler)
          .sort(handleSortArray)
      : [];
  let listedTherapist =
    !isEmpty(therapistObj) && !isEmpty(therapistObj.listing_therapists)
      ? therapistObj.listing_therapists
          .filter(availableFilterHandler)
          .sort(handleSortArray)
      : [];

  const instauuid = userProfile.uuid ? userProfile.uuid : gtagId;
  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <Head>
        <meta
          property="og:title"
          content={`${
            router.query.search
              ? JSON.parse(decodeURIComponent(router.query.search))
                  .locationValue.value
              : null
          }  | Thrivr - Find and book professional massage therapists Something to consider: Find your next massage professional. Read & post reviews. Schedule an online appointment 24/7 for massage in just a few clicks. `}
        />
        <meta
          property="og:description"
          content={`Thrivr - Find and book professional massage therapists on-demand in {${
            router.query.search
              ? JSON.parse(decodeURIComponent(router.query.search))
                  .locationValue.value
              : null
          }, Saskatchewan}. Thrivr is the “Uber for massages”, book from anywhere, anytime, in just a few clicks. `}
        />

        <title>Registered Massage Therapists - Thrivr</title>
      </Head>
      <MassageSpecialistsStyleWrapper className="content-wrapper massage-specialists">
        <Header className="header-white" />
        <section className="d-flex">
          <Container className="m-auto">
            {/* Alert Success Message */}
            <AnimatePresence>
              {!isEmpty(successMessage) && (
                <motion.div
                  className="alert-global-success-wrapper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  exit={{ opacity: 0 }}
                >
                  <Alert variant={'primary'}>{successMessage}</Alert>
                </motion.div>
              )}
            </AnimatePresence>
            {isTherapistLoaded &&
              isEmpty(availableTherapist) &&
              isEmpty(listedTherapist) && (
                <AnimatePresence>
                  <motion.div
                    className="alert-global-success-wrapper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert variant={'danger'}>
                      Sorry, we are not in your city yet.
                    </Alert>
                  </motion.div>
                </AnimatePresence>
              )}
            <SearchSectionComponent
              locationValue={locationValue.value}
              durationPayload={durationPayload}
              handleGoogleChange={handleGoogleChange}
              handleGoogleSelect={handleGoogleSelect}
              handleDropdownChange={handleDropdownChange}
              durationValue={durationValue}
              dateValue={dateValue}
              handleDateChange={handleDateChange}
              handleSearchSumbit={handleSearchSumbit}
            />
            <div className="filter-section">
              <button
                className="form-control filter-btn w-auto d-block d-sm-none"
                data-toggle="modal"
                data-target="#filter-modal"
                onClick={handleFilterModal}
              >
                Filter
              </button>
              <div
                className={cx('modal fade', { show: modalFilterOpen })}
                id="filter-modal"
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header d-block d-sm-none">
                      <h5 className="modal-title d-inline-block">Filter</h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                        onClick={handleFilterModal}
                      >
                        <span aria-hidden="true">Close</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <Dropdown className="multiselect">
                        <Dropdown.Toggle as={CustomDropdownFilterToggle}>
                          Gender
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          as={CustomMenu}
                          show={widthWindow < 575 ? true : undefined}
                        >
                          <li>
                            <a>
                              <InputSingleCheckBox
                                title="Male"
                                name="gender"
                                value="M"
                                checked={formFilter.genderValues.includes('M')}
                                onChange={handleFilterGender}
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <InputSingleCheckBox
                                title="Female"
                                name="gender"
                                value="F"
                                checked={formFilter.genderValues.includes('F')}
                                onChange={handleFilterGender}
                              />
                            </a>
                          </li>
                          <li>
                            <a>
                              <InputSingleCheckBox
                                title="Other"
                                name="gender"
                                value="O"
                                checked={formFilter.genderValues.includes('O')}
                                onChange={handleFilterGender}
                              />
                            </a>
                          </li>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Dropdown className="multiselect manage-type">
                        <Dropdown.Toggle as={CustomDropdownFilterToggle}>
                          Massage type
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          as={CustomMenu}
                          show={widthWindow < 575 ? true : undefined}
                        >
                          {!isEmpty(specialistValue)
                            ? specialistValue.map((specialist) => (
                                <li key={specialist.code}>
                                  {widthWindow >= 575 ? (
                                    <OverlayTrigger
                                      placement="right"
                                      overlay={
                                        <Tooltip
                                          id={`tooltip-${specialist.code}`}
                                        >
                                          {specialist.long_description}
                                        </Tooltip>
                                      }
                                    >
                                      <a>
                                        <img
                                          src={specialist.image_path}
                                          className="type-img"
                                        />
                                        <InputSingleCheckBox
                                          title={specialist.description}
                                          name="massageType"
                                          value={specialist.code}
                                          checked={formFilter.massageType.includes(
                                            specialist.code
                                          )}
                                          onChange={handleFilterMassageType}
                                        />
                                      </a>
                                    </OverlayTrigger>
                                  ) : (
                                    <a>
                                      <img
                                        src={specialist.image_path}
                                        className="type-img"
                                      />

                                      <InputSingleCheckBox
                                        title={specialist.description}
                                        name="massageType"
                                        value={specialist.code}
                                        checked={formFilter.massageType.includes(
                                          specialist.code
                                        )}
                                        onChange={handleFilterMassageType}
                                      />
                                      <OverlayTrigger
                                        trigger={'click'}
                                        placement="top"
                                        className="click-overlay-tooltip"
                                        overlay={(props) => (
                                          <Tooltip
                                            {...props}
                                            id={`tooltip-${specialist.code}-mobile`}
                                          >
                                            {specialist.long_description}
                                          </Tooltip>
                                        )}
                                      >
                                        <a className="click-overlay-tooltip">
                                          <i className="fa fa-info-circle"></i>
                                        </a>
                                      </OverlayTrigger>
                                    </a>
                                  )}
                                </li>
                              ))
                            : 'No data'}
                        </Dropdown.Menu>
                      </Dropdown>

                      {isFilterNeed.isDirectBillingNeed && (
                        <div className="single-select billing">
                          <InputGroup isCustom>
                            <InputSingleCheckBox
                              title="Direct billing"
                              value="direct_billing"
                              checked={formFilter.directBilling}
                              onChange={handleFilterDirectBilling}
                            />
                          </InputGroup>
                        </div>
                      )}
                      {isFilterNeed.isParkingNeed && (
                        <div className="single-select parking">
                          <InputGroup isCustom>
                            <InputSingleCheckBox
                              title="Free parking"
                              value="parking"
                              checked={formFilter.isParking}
                              onChange={handleFilterParking}
                            />
                          </InputGroup>
                        </div>
                      )}
                    </div>
                    <div className="modal-footer d-block d-sm-none">
                      <Button
                        type="button"
                        className="w-100"
                        data-dismiss="modal"
                        onClick={handleFilterModal}
                      >
                        Show results
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
            </div>

            <div className="results">
              <h3 className="title">
                {!isEmpty(therapistObj)
                  ? availableTherapist.length + listedTherapist.length
                  : 0}{' '}
                results
              </h3>
              <div className="row">
                {!isEmpty(therapistObj) && !isEmpty(availableTherapist)
                  ? availableTherapist.map((list) => (
                      <div className="col-lg-4 col-md-6" key={list.manager_id}>
                        <MassageBoxComponent
                          instauuid={instauuid}
                          datetime={formatDate(dateValue)}
                          projectIdSpecific={durationValue}
                          router={router}
                          isTime={true}
                          data={list}
                          userProfile={userProfile}
                          handleMoreTime={handleMoreTime}
                        />
                      </div>
                    ))
                  : null}
                <div className="col-lg-4 col-md-6">
                  <MassageBoxComponent
                    instauuid={instauuid}
                    userProfile={userProfile}
                    variant="box-black"
                    recommendTherapistName={recommendTherapistName}
                  />
                </div>
                {!isEmpty(therapistObj) && !isEmpty(listedTherapist)
                  ? listedTherapist.map((list) => (
                      <div className="col-lg-4 col-md-6" key={list.manager_id}>
                        <MassageBoxComponent
                          instauuid={instauuid}
                          datetime={formatDate(dateValue)}
                          projectIdSpecific={durationValue}
                          data={list}
                          userProfile={userProfile}
                          handleMoreTime={handleMoreTime}
                        />
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </Container>
        </section>
      </MassageSpecialistsStyleWrapper>
      {/* Footer Section */}
      <Footer />
    </PageLoader>
  );
}

const SortList = [
  {
    id: 1,
    value: 'Availability',
  },
  {
    id: 2,
    value: 'Most popular',
  },
  {
    id: 3,
    value: 'Distance',
  },
  {
    id: 4,
    value: 'Customer Review',
  },
];
