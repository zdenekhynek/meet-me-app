import React, { useState, useCallback, useEffect, useContext } from "react";
import { Image, View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import GooglePlacesInput from "../components/google_places_input";
import { fetchJourney } from "../journeys";
import JourneyContext from "../journey_context";

export default function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const journeyContext = useContext(JourneyContext);

  const getJourneys = useCallback(async () => {
    setIsLoading(true);

    const { midpoint, polylines, destination, directions } = await fetchJourney(
      journeyContext.from.coords,
      journeyContext.to.coords
    );

    if (midpoint) {
      journeyContext.setMidpoint(midpoint);
    }

    if (polylines) {
      journeyContext.setPolylines(polylines);
      journeyContext.setDestination(destination);
      journeyContext.setDirections(directions);

      navigation.navigate("Map");
    }

    setIsLoading(false);
  }, [journeyContext.from, journeyContext.to]);

  const handleFromChange = useCallback((name, coords) => {
    journeyContext.setFrom({ name, coords });
  });

  const handleToChange = useCallback((name, coords) => {
    journeyContext.setTo({ name, coords });
  });

  const handleOnFocus = useCallback(() => {
    setIsFocused(true);
  });

  const handleOnBlur = useCallback(() => {
    setIsFocused(false);
  });

  useEffect(() => {
    if (journeyContext.from && journeyContext.to) {
      getJourneys();
    }
  }, [journeyContext.from, journeyContext.to]);

  const buttonLabel = isLoading
    ? "Calculating your journeys..."
    : "See your journeys";

  const shouldDisplayBtn = journeyContext.from && journeyContext.to;
  const buttonOpacity = shouldDisplayBtn ? 1 : 0;
  const marginTop = isFocused ? -340 : 0;
  const logoOpacity = isFocused ? 0 : 1;

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={[styles.logo, { marginTop, opacity: logoOpacity }]}
      />
      <View style={styles.inputWrapper}>
        <GooglePlacesInput
          index={0}
          value={journeyContext.from && journeyContext.from.name}
          placeholder="Type your address"
          apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
          onChange={handleFromChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
        <GooglePlacesInput
          index={1}
          value={journeyContext.to && journeyContext.to.name}
          placeholder="Type friend's address"
          apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
          onChange={handleToChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </View>
      <Button
        title={buttonLabel}
        disabled={isLoading}
        onPress={() => {
          navigation.navigate("Map");
        }}
        containerStyle={{
          opacity: buttonOpacity,
        }}
        buttonStyle={{
          width: "100%",
          padding: 15,
          backgroundColor: "#362983",
        }}
        titleStyle={{
          padding: 20,
        }}
        icon={!isLoading && <Icon name="arrow-right" size={15} color="white" />}
        iconRight
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 120, height: 102, marginTop: 0 },
  inputWrapper: {
    position: "relative",
    width: "100%",
    margin: 40,
    padding: 20,
    flexBasis: 150,
    zIndex: 1,
  },
  input: {},
  loader: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    padding: 10,
    color: "#000",
    transform: [{ translateX: -90 }, { translateY: 10 }],
  },
  loaderText: {
    color: "#5d5d5d",
  },
});
