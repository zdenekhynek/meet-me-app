import React, { useState, useRef } from "react";
import { View, StyleSheet, Image, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const GooglePlacesInput = ({
  apiKey,
  value = "",
  index = 0,
  placeholder,
  onChange,
}) => {
  const ref = useRef();

  const [isFocused, setIsFocused] = useState(false);
  // const [value, setValue] = useState("Useless Placeholder");

  //  dynamic height based on whether the input is in focus
  const height = isFocused ? 120 : 54;
  const zIndex = isFocused ? 2 : 1;
  const top = 17 + index * 54;

  React.useEffect(() => {
    ref.current.setAddressText(value);
  }, []);

  return (
    <View style={[styles.container, { top, zIndex, height }]}>
      <GooglePlacesAutocomplete
        ref={ref}
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
          },
        }}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          if (details && details.geometry && details.geometry.location) {
            const { location } = details.geometry;
            console.log(data);
            onChange(data.description, [location.lat, location.lng]);
          }
        }}
        onFail={(error) => console.error(error)}
        tvParallaxShiftDistanceX
        currentLocation={true}
        query={{
          key: apiKey,
          language: "en",
          components: "country:uk",
        }}
        styles={{
          textInputContainer: {
            backgroundColor: "rgba(0,0,0,0)",
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            height: 38,
            color: "#5d5d5d",
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: "#1faadb",
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});

export default GooglePlacesInput;
