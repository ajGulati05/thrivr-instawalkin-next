import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';
import { timezoneRegexFormat } from 'util/config';
import Button from 'components/Base/Button';
import Footer from 'components/Footer';
import Header from 'components/Header';
import PageLoader from 'components/Views/PageLoader';
import {
  getManagerSpecialities,
  getProductAndPricing,
} from 'redux/app/actions';
import FaqComponent from 'components/Views/Common/faq';
import DescriptionComponent from 'components/Views/Common/description';
import Carousel, { CarouselItem } from 'components/Base/Carousel';
import HomeStyleWrapper from './home.style';
import SearchSectionComponent from 'components/Views/Common/searchComponent';
import isEmpty from 'lodash.isempty';

function Home() {
  // Redux State
  const dispatch = useDispatch();
  const productPricingArr = useSelector((state) => state.app.productPricingArr);
  const loaderCount = useSelector((state) => state.app.loaderCount);
  const specialistArr = useSelector((state) => state.app.specialistArr);
  const defaultLaunchedCities = useSelector(
    (state) => state.app.defaultLaunchedCities
  );
  const initialLocation = useSelector((state) => state.app.initialLocation);

  // State
  let [dateValue, setDateTime] = useState(new Date());
  let [durationPayload, setDuration] = useState(productPricingArr);
  let [durationValue, setDurationValue] = useState(0);
  let [specialistValue, setSpecialistArr] = useState(specialistArr);
  let [locationValue, setLocationValue] = useState({
    touched: true,
    value: initialLocation.city_name,
    timezone: 'America_Regina',
    geoLoc: {
      lattitude: parseFloat(initialLocation.latitude),
      longitude: parseFloat(initialLocation.longitude),
    },
  });

  const fetchProductPricing = async () => {
    dispatch(getProductAndPricing({}, true));
  };

  // Mount
  useEffect(() => {
    fetchProductPricing();
    geoLocateCurrentPosition();
    fetchSpecialties();
  }, []);

  useEffect(() => {
    setDuration(productPricingArr);
    if (!isEmpty(productPricingArr)) {
      let durationCheck = false;
      productPricingArr.map((product) => {
        if (product.default) {
          durationCheck = true;

          setDurationValue(product.id);
        }
      });
      !durationCheck ? setDurationValue(productPricingArr[0].id) : null;
    }
  }, [productPricingArr]);

  useEffect(() => {
    if (loaderCount < 1 && durationValue) {
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
          page: 'landing',
        },
      });
    }
  }, [locationValue, durationValue, dateValue]);

  const geoLocateCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        let lat = pos.coords.latitude;
        let lng = pos.coords.longitude;
        let res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=street_address|route&key=${process.env.ADDRESS_AUTOCOMPLETE_API_KEY}`
        );
        if (!isEmpty(res) && !isEmpty(res.data) && !isEmpty(res.data.results)) {
          let address = '';
          console.log('CURRENT LOCATION:', res.data.results);
          res.data.results.forEach((payload) => {
            payload.address_components.map((subCom) => {
              if (
                subCom.types.includes('country') &&
                subCom.short_name === 'CA'
              ) {
                address = payload.formatted_address;
              }
            });
          });
          if (address) {
            const timezoneResponse = await axios.get(
              `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(
                dateValue.getTime() / 1000
              )}&key=${process.env.ADDRESS_AUTOCOMPLETE_API_KEY}`
            );

            setLocationValue({
              touched: true,
              value: address,
              timezone: timezoneResponse.data.timeZoneId.replace(
                timezoneRegexFormat,
                '_'
              ),
              geoLoc: {
                lattitude: lat,
                longitude: lng,
              },
            });
          }
        }
      },
      (err) => {
        if (!isEmpty(err) && !isEmpty(defaultLaunchedCities)) {
          setLocationValue({
            touched: true,
            value: defaultLaunchedCities[0].city_name,
            timezone: 'America_Regina',
            geoLoc: {
              lattitude: parseFloat(defaultLaunchedCities[0].latitude),
              longitude: parseFloat(defaultLaunchedCities[0].longitude),
            },
          });
        }
      }
    );
  };

  const fetchSpecialties = async () => {
    let specialists = [];
    // Fetch Specialities
    let response = await dispatch(getManagerSpecialities());
    if (response.status) {
      setSpecialistArr(response.data);
      if (!isEmpty(response.data)) {
        specialists = response.data.map((specialist) => specialist.code);
      }
    }
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

  const bookMessageScroll = () => {
    window.scrollTo(0, 0);
  };

  const handleDropdownChange = (data) => {
    setDurationValue(data.id);
  };

  const handleDateChange = (data) => {
    setDateTime(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!locationValue.touched)
      setLocationValue({ ...locationValue, touched: true });
    if (!locationValue.value || !durationValue) return;

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
        page: 'landing',
      },
    });

    Router.push({
      pathname: `/massage-therapists`,
      query: {
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

  return (
    <PageLoader visible={loaderCount <= 0 ? false : true}>
      <HomeStyleWrapper>
        <Head>
          <meta
            property="og:title"
            content="Thrivr - On demand massage service in Saskatoon and Regina, Saskatchewan."
          />
          <meta
            property="og:description"
            content="Thrivr - Find and book professional massage therapists on-demand in Saskatoon and Regina, Saskatchewan. Thrivr is the “Uber for massages”, book from anywhere, anytime, in just a few clicks."
          />
          <title>
            Same day massage therapy, Saskatoon and Regina, Saskatchewan -
            Thrivr
          </title>
        </Head>
        <Header hamburgerIcon="white" />
        {/* Banner Section */}
        <section className="banner d-flex">
          <Container className="m-auto">
            <div className="banner-details">
              <h2 className="main-title">Book a massage now</h2>
              <SearchSectionComponent
                locationValue={locationValue.value}
                locationTouched={locationValue.touched}
                durationPayload={durationPayload}
                handleGoogleChange={handleGoogleChange}
                handleGoogleSelect={handleGoogleSelect}
                handleDropdownChange={handleDropdownChange}
                durationValue={durationValue}
                handleSearchSumbit={handleSubmit}
                dateValue={dateValue}
                handleDateChange={handleDateChange}
              />
            </div>
          </Container>
        </section>

        {/* Description Section */}
        <DescriptionComponent>
          <div className="row div-wrapper">
            <div className="col-sm-6 m-auto">
              <div className="inner-div m-auto">
                <h3 className="title">
                  {' '}
                  Feel <span className="pink-text">at ease</span>
                </h3>
                <p>
                  All of our massage therapists are registered, have over 2200
                  hours of training, are insured, and vetted by the Thrivr team.
                </p>
              </div>
            </div>
            <div className="col-sm-6 text-center">
              <img
                src="/images/feel_at_ease.png"
                className="home-img"
                alt="Feel At Ease with your registered massage therapist"
              />
            </div>
          </div>
          <div className="row div-wrapper flex-row-reverse">
            <div className="col-sm-6 m-auto">
              <div className="inner-div m-auto">
                <h3 className="title">
                  Personalize <span className="pink-text">your experience</span>
                </h3>
                <p>
                  With over 6 massage techniques to choose from, each will be
                  customized by our therapists based on your preferences.
                </p>
              </div>
            </div>
            <div className="col-sm-6 text-center">
              <img
                src="/images/personalize_your_experience.png"
                className="home-img"
                alt="Personalize Your Massage Experience"
              />
            </div>
          </div>
          <div className="row div-wrapper">
            <div className="col-sm-6 m-auto">
              <div className="inner-div m-auto">
                <h3 className="title">
                  Contactless{' '}
                  <span className="pink-text">payment and intake forms</span>
                </h3>
                <p>
                  We offer clients a paperless intake experience, from online
                  booking and payment to intake forms, ensuring safety and
                  security.
                </p>
              </div>
            </div>
            <div className="col-sm-6 text-center">
              <img
                src="/images/pay_safe_and_securely.png"
                className="home-img"
                alt="Contactless pay and intake forms"
              />
            </div>
          </div>
        </DescriptionComponent>

        {/* Rest Easy Section */}
        {/* <section className="rest-easy">
          <Container>
            <div className="main-wrapper">
              <div className="text-center">
                <h3 className="title rest-easy-title">
                  Rest easy with Instawalkin
                </h3>
                <p className="rest-desc">
                  Finding a massage therapist last-minute doesn’t have to be a
                  pain. Instawalkin finds trustworthy, available RMTs in your
                  area and lets you book appointments with them—whether it’s
                  ASAP or a week from now.
                </p>
              </div>
              <div className="details">
                <div className="row mob-row">
                  <div className="col-sm-4 mob-col">
                    <img src="/images/search.svg" />
                    <h4 className="sub-title">Call off the search</h4>
                    <p>
                      Our app connects you directly to available RMTs, so you
                      can book instantly and be on your way.
                    </p>
                  </div>
                  <div className="col-sm-4 mob-col">
                    <img src="/images/certificated.svg" />
                    <h4 className="sub-title">Find a safe, certified RMT</h4>
                    <p>
                      All RMTs are Insta Certified, meaning they’ve been through
                      our background check, have the right credentials, and are
                      customer-recommended.
                    </p>
                  </div>
                  <div className="col-sm-4 mob-col">
                    <img src="/images/walkin.svg" />
                    <h4 className="sub-title">Walk in, walk out</h4>
                    <p>
                      Get your intake forms out of the way on our app, before
                      your appointment. We’ll keep it on file for future visits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section> */}

        {/* Download Section */}
        <section className="download-section">
          <Container className="text-center">
            <h3 className="title">Book a Massage</h3>
            <div>
              <Button onClick={() => bookMessageScroll()}>Book Now</Button>
              {/* Temporarily hidden. Do not remove */}
              {/* <a
                href="https://itunes.apple.com/us/app/instawalkin/id1409256502?ls=1&mt=8"
                target="__blank"
              >
                <img src="/images/appstore.svg" />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.instawalkin.instawalkin"
                target="__blank"
              >
                <img src="/images/google-play.svg" />
              </a> */}
            </div>
          </Container>
        </section>

        {/* We Have Section */}
        <section className="we-have">
          <Container>
            <h3 className="title text-center">Massage Therapies we offer</h3>
            <ul className="list-unstyled">
              {specialistValue.map((key) => {
                return (
                  <li className="" key={key.code}>
                    <img src={key.image_path} />
                    <div>
                      <h4 className="sub-title">{key.description}</h4>
                      <p>{key.long_description}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>

        {/* Review Section 
        <section className="review-section">
          <img src="/images/green-quote.svg" className="quote-img" />
          <Container className="text-center">
            <h3 className="title">See what our customers are saying</h3>
            <Carousel>
              {ReviewArrConstant.map((review, index) => (
                <CarouselItem key={index}>
                  <p>{review.description}</p>
                  <div className="img">
                    <img src={review.imgSrc} />
                  </div>
                  <div className="name">{review.name}</div>
                </CarouselItem>
              ))}
            </Carousel>
          </Container>
        </section>
*/}
        {/* Faq Section */}
        <FaqComponent
          title="Frequently Asked Questions"
          faqs={FaqArrConstant}
        />

        {/* Footer Section */}
        <Footer />
      </HomeStyleWrapper>
    </PageLoader>
  );
}

export default Home;

const ReviewArrConstant = [
  {
    description: `Love this app. Super simple to use, and I got in right away
    when I needed too. I usually never find quick last minute
    appointments. This app made it foolproof for me to schedule
    one and processed my payment within the hour. Will definitely
    be using this app again!`,
    imgSrc: `images/review.jpg`,
    name: `Name Surname`,
  },
  {
    description: `Love this app. Super simple to use, and I got in right away
    when I needed too. I usually never find quick last minute
    appointments. This app made it foolproof for me to schedule
    one and processed my payment within the hour. Will definitely
    be using this app again!`,
    imgSrc: `images/review.jpg`,
    name: `Name Surname`,
  },
  {
    description: `Love this app. Super simple to use, and I got in right away
    when I needed too. I usually never find quick last minute
    appointments. This app made it foolproof for me to schedule
    one and processed my payment within the hour. Will definitely
    be using this app again!`,
    imgSrc: `images/review.jpg`,
    name: `Name Surname`,
  },
];

const FaqArrConstant = [
  {
    key: '0',
    title: `How does Thrivr work?`,
    description: (
      <>
        Thrivr is a platform that connects users who need massages with
        available, Thrivr certified, massage therapists. Select your location,
        date, and preferences and we’ll do the rest.
      </>
    ),
  },
  {
    key: '1',
    title: `What does “Thrivr certified” mean?`,
    description: (
      <>
        All of our massage therapists are registered, have over 2200 hours of
        training, are insured, and vetted by the Thrivr team.
      </>
    ),
  },

  {
    key: '2',
    title: `Does Thrivr accept insurance?`,
    description: (
      <>
        Clients who book a massage with us will be issued a receipt upon
        completion, which can be submitted to your insurance provider for
        reimbursement.
      </>
    ),
  },
  {
    key: '3',
    title: `What is Thrivr's cancellation policy?`,
    custom: true,
    description: (
      <>
        You may cancel or reschedule your booking up to 1 hour before your
        appointment with no penalty.
        <p>
          •If you reschedule with less than 1 hours’ notice, you will be charged
          25% of your appointment fee.
        </p>
        <p>
          •If you cancel with less than 1 hours’ notice, you will be charged a
          50% of your appointment fee.
        </p>
        <p>
          •If a therapist is not available for your booking, you will not be
          charged.
        </p>
      </>
    ),
  },
  {
    key: '4',
    title: `How do I cancel?`,
    description: (
      <>
        You can cancel your appointment online by navigating to the “History”
        page and selecting the appointment you would like to cancel. You can
        also cancel on the app by hitting “Cancel” when you open your booking.
        If you are having trouble cancelling your appointment contact us at
        <a href="mailto:team@thrivr.ca">team@thrivr.ca</a> or call{' '}
        <a href="tel:+18559432256">+18559432256</a> for assitance.
      </>
    ),
  },
  {
    key: '5',
    title: `How do I tip my massage therapist?`,
    description: (
      <>
        You can tip your therapist online. Online, you can navigate to the
        "Orders" page and select the appointment you’d like to add a tip to,
        then add your tip. Click on the massage order number you would like to
        add a tip to, then click "add tip" near the bottom of the screen.
      </>
    ),
  },
  {
    key: '6',
    title: `How do I leave feedback?`,
    description: (
      <>
        The Thrivr team is dedicated to continuous improvement. Have a
        suggestion? Please email it to us at{' '}
        <a href="mailto:team@thrivr.ca">team@thrivr.ca</a>.
      </>
    ),
  },
  {
    key: '7',
    title: `You're not in my city! Can I still get a massage using Thrivr?`,
    description: (
      <>
        Currently, we are only serving Saskatoon and Regina. We would love to be
        in your city one day! Please email us your city name at{' '}
        <a href="mailto:team@thrivr.ca">team@thrivr.ca</a> and we will look into
        it.
      </>
    ),
  },
];
