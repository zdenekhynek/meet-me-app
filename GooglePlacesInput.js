import React, { useState } from "react";
import { Image, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GooglePlacesInput = ({ apiKey, placeholder, onChange }) => {
  const [value, setValue] = useState('Useless Placeholder');

  return (
    <TextInput
      style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
      onChangeText={text => {
        setValue(text);
        onChange(text);
      }}
      value={value}
    />
    // <GooglePlacesAutocomplete
    //   placeholder={placeholder}
    //   minLength={2}
    //   debounce={200}
    //   fetchDetails={false}
    //   onPress={(data, details = null) => {
    //     // 'details' is provided when fetchDetails = true
    //     console.log(data, details);
    //   }}
    //   currentLocation={true}
    //   query={{
    //     key: apiKey,
    //     language: "en",
    //   }}
    // />
  );
};

export default GooglePlacesInput;
