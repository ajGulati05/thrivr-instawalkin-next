import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Form from 'react-bootstrap/Form';
import InputGroup from 'components/Base/InputGroup';
import Datepicker from 'components/Base/Datepicker';
import Dropdown from 'components/Base/DurationDropdown';
import Button from '../../Base/Button';
import GoogleAutoCompleteInput from 'components/Base/GoogleAutoCompleteInput';
import { SearchSectionComponent } from './style';

export default function SearchComponent({
  locationValue,
  locationTouched,
  handleGoogleChange,
  handleGoogleSelect,
  handleDropdownChange,
  durationPayload,
  className,
  durationValue,
  dateValue,
  handleSearchSumbit,
  handleDateChange,
  ...props
}) {
  return (
    <SearchSectionComponent
      {...props}
      className={cx('search-section', className)}
    >
      <Form onSubmit={handleSearchSumbit}>
        <InputGroup
          isCustom
          className="mob-full"
          appendNode={<img src="/images/location.svg" />}
        >
          <GoogleAutoCompleteInput
            placeholder="Location..."
            value={locationValue}
            touched={locationTouched}
            handleChange={handleGoogleChange}
            handleSelect={handleGoogleSelect}
          />
        </InputGroup>
        <InputGroup
          className="date mob-half d-inline-block"
          isCustom={true}
          appendNode={<img src="/images/calander.svg" />}
        >
          <Datepicker
            dateClassName="form-control"
            pastDateDisable={true}
            value={dateValue}
            handleDateChange={handleDateChange}
          />
        </InputGroup>
        <InputGroup
          className="mob-half"
          isCustom={true}
          appendNode={<img src="/images/clock.svg" />}
        >
          <Dropdown
            list={durationPayload}
            value={durationValue}
            handleDropdownChange={handleDropdownChange}
          />
        </InputGroup>
        <Button
          varient="primary"
          className="mob-full"
          type="submit"
          id="search"
        >
          Search
        </Button>
      </Form>
    </SearchSectionComponent>
  );
}

SearchComponent.propTypes = {
  className: PropTypes.string,
  dateValue: PropTypes.instanceOf(Date),
  durationValue: PropTypes.number,
  durationPayload: PropTypes.array,
  locationTouched: PropTypes.bool,
  locationValue: PropTypes.string,
  handleGoogleChange: PropTypes.func,
  handleGoogleSelect: PropTypes.func,
  handleDropdownChange: PropTypes.func,
  handleSearchSumbit: PropTypes.func,
  handleDateChange: PropTypes.func,
};
