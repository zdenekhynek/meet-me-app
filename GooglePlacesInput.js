import React from "react";
import { Image, Text } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GooglePlacesInput = ({ apiKey, placeholder }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      minLength={2}
      debounce={200}
      fetchDetails={false}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      currentLocation={true}
      query={{
        key: apiKey,
        language: "en",
      }}
    />
  );
};

export default GooglePlacesInput;
