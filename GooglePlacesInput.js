import React, { useState, useRef } from "react";
import { View, StyleSheet, Image, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const LARGE_HEIGHT = 70;
const SMALL_HEIGHT = 54;

const GooglePlacesInput = ({
  apiKey,
  value = "",
  index = 0,
  theme="large",
  placeholder,
  onChange,
}) => {
  const ref = useRef();

  const [isFocused, setIsFocused] = useState(false);
  // const [value, setValue] = useState("Useless Placeholder");

  //  dynamic height based on whether the input is in focus
  const themeHeight = theme === "large"? LARGE_HEIGHT: SMALL_HEIGHT;
  const padding = theme === "large"? 10: 0;
  const textInputHeight = themeHeight - 12;
  const height = isFocused ? 200 : themeHeight;
  const zIndex = isFocused ? 2 : 1;
  let top = index * (themeHeight);

  //  small style adjustment
  if (top && theme === "large") {
    top += 5;
  }

  React.useEffect(() => {
    ref.current.setAddressText(value);
  }, []);

  const backgroundColor = index === 0 ? "#dd007d" : "#006bb8";
  const placeholderColor =
    index === 0 ? "rgba(221,0,125,0.6)" : "rgba(0,107,184,0.6)";
  const textInputPadding = theme === "large"? 5: 20;
  const textInputMargin = theme === "large"? 20: 5;
  const textInputBackground = theme === "large"? "#fff": backgroundColor;

  return (
    <View style={[styles.container, { top, zIndex, height, padding }]}>
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
        placeholderTextColor={placeholderColor}
        styles={{
          textInputContainer: {
            backgroundColor: textInputBackground,
            height: themeHeight,
            paddingTop: 5,
            paddingBottom: 5,
            borderTopWidth: 0,
            borderBottomWidth: 0,
          },
          textInput: {
            marginTop: 0,
            marginLeft: textInputMargin,
            marginRight: textInputMargin,
            paddingLeft: textInputPadding,
            paddingRight: textInputPadding,
            height: textInputHeight,
            color: backgroundColor,
            borderColor: backgroundColor,
            borderBottomWidth: 1,
            fontSize: 16,
          },
          listView: {
            marginLeft: 20,
            marginRight: 20,
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    padding: 10,
  },
});

export default GooglePlacesInput;
