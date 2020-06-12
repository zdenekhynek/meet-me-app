import React, { useState } from "react";
import { View, StyleSheet, Image, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GooglePlacesInput = ({ apiKey, placeholder, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("Useless Placeholder");

  //  dynamic height based on whether the input is in focus
  const height = (isFocused)? 120: 50;

  return (
    <View style={[styles.container, { height } ]}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        minLength={2}
        debounce={200}
        fetchDetails={true}
        textInputProps={{
          onFocus: () => {
            setIsFocused(true);
          },
          onBlur: () => {
            setIsFocused(false);
          }
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          if (details && details.geometry && details.geometry.location) {
            const { location } = details.geometry;
            onChange([location.lat, location.lng]);
          }
        }}
        onFail={error => console.error(error)}tvParallaxShiftDistanceX
        currentLocation={true}
        query={{
          key: apiKey,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: '#5d5d5d',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingTop: 10,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});

export default GooglePlacesInput;
