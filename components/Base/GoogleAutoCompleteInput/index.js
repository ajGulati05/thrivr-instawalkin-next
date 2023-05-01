import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Input from '../Input';
import PlacesAutocomplete from 'react-places-autocomplete';
import isEmpty from 'lodash.isempty';

const PlacesOptions = {
  componentRestrictions: {
    country: ['CA'],
  },
};

const GoogleAutoCompleteInput = ({
  value,
  touched,
  handleChange,
  placeholder,
  handleSelect,
}) => {
  const googleMapLoaded = useSelector((state) => state.app.googleMapLoaded);

  const onInputChange = (address) => {
    handleChange(address);
  };
  const onPlaceSelect = (data, placeId) => {
    if (
      window !== undefined &&
      !isEmpty(window.google) &&
      !isEmpty(window.google.maps)
    ) {
      if (placeId) {
        new window.google.maps.places.PlacesService(
          document.createElement('div')
        ).getDetails(
          {
            placeId,
          },
          (place, status) => {
            let lattitude = '';
            let longitude = '';
            let value = '';
            if (status === 'OK') {
              lattitude = place.geometry.location.lat();
              longitude = place.geometry.location.lng();
              value = place.formatted_address;
            }
            handleSelect({ value, geoLoc: { lattitude, longitude } });
          }
        );
      }
    }
  };
  return googleMapLoaded ? (
    <PlacesAutocomplete
      searchOptions={PlacesOptions}
      value={value}
      onChange={onInputChange}
      onSelect={onPlaceSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="autocomplete-container">
          <Input
            {...getInputProps({
              placeholder: placeholder,
              className: 'location-search-input',
            })}
            isInvalid={touched && !value ? true : false}
          />

          {!isEmpty(suggestions) && (
            <div className="autocomplete-dropdown-container">
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    key={suggestion.id}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PlacesAutocomplete>
  ) : (
    <Input value={value} onChange={(e) => onInputChange(e.target.value)} />
  );
};

GoogleAutoCompleteInput.propTypes = {
  value: PropTypes.string,
  touched: PropTypes.bool,
  handleChange: PropTypes.func,
  handleSelect: PropTypes.func,
  placeholder: PropTypes.string,
};

export default GoogleAutoCompleteInput;
