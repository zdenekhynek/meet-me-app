import React, { useState, useCallback, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
} from "react-native";
import GooglePlacesInput from "./GooglePlacesInput";
import MapView from "react-native-maps";

export const getJourneyApiUrl = (hostUrl, fromString = "0,0", toString = "0,0") => {
  const endpoint = "api/v1/directions";
  return `${hostUrl}/${endpoint}/${fromString}/${toString}`;
};

export const fetchJourney = async () => {
  const url = getJourneyApiUrl(process.env.REACT_NATIVE_APP_JOURNEY_API_HOST);
  console.log('fetchingJourney from url', url);
  const result = await fetch(url);
  console.log('result', JSON.stringify(result));
  
  if (result.ok) {
    return await result.json();
  } else {
    console.error("Error fetching journey");
  }
};

export default function App() {
  const [from, setFrom] = useState("0,0");
  const [to, setTo] = useState("0,0");

  const getJourneys = useCallback(async () => {
    const journeys = await fetchJourney();
    console.log('journeys', journeys);
  }, []);

  useEffect(() => {
    if (from && to) {
      console.log("fetching journey");
      getJourneys(from, to)
    }
  }, [from, to]);

  const handleFromChange = useCallback((value) => {
    console.log("handleFromChange");
    setFrom(value);
  });
  const handleToChange = useCallback((value) => {
    console.log("handleToChange");
    setTo(value);
  });

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text>{process.env.REACT_NATIVE_APP_JOURNEY_API_HOST}</Text>
        <View style={styles.input}>
          <GooglePlacesInput
            placeholder="Place A"
            apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
            onChange={handleFromChange}
          />
        </View>
        <View style={styles.input}>
          <GooglePlacesInput
            placeholder="Place B"
            apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
            onChange={handleToChange}
          />
        </View>
        <MapView style={styles.mapStyle} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  input: {},
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
  },
});
