import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import GooglePlacesInput from "./GooglePlacesInput";
import Map from "./Map";

export const concatLegs = (legs) => {
  return legs.reduce((acc, leg) => {
    return acc.concat(leg.coords);
  }, []);
};

export const getJourneyApiUrl = (
  hostUrl,
  fromString = "0,0",
  toString = "0,0"
) => {
  const endpoint = "api/v1/directions";
  return `${hostUrl}/${endpoint}/${fromString}/${toString}`;
};

export const fetchJourney = async (from, to) => {
  const url = getJourneyApiUrl(
    process.env.REACT_NATIVE_APP_JOURNEY_API_HOST,
    from.join(","),
    to.join(",")
  );

  console.log("fetchingJourney from url", url);
  const result = await fetch(url);

  if (result.ok) {
    return (await result.json()).data;
  } else {
    console.error("Error fetching journeys from API");
  }
};

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  // const [from, setFrom] = useState([51.5698452, -0.0957309]);
  // const [to, setTo] = useState([51.4989235, -0.0817248]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [midpoint, setMidpoint] = useState(null);
  const [polylines, setPolylines] = useState([]);
  const [destination, setDestination] = useState("");

  const getJourneys = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchJourney(from, to);
    setMidpoint(data.midpoint);

    const { journeys } = data;
    if (journeys) {
      const journeyPolylines = journeys.map((journey) => {
        if (!journey) {
          return [];
        }
        const { legs } = journey;
        return legs ? concatLegs(legs) : [];
      });
      setPolylines(journeyPolylines);
      setDestination(data.destination);
    }
    setIsLoading(false);
  }, [from, to]);

  useEffect(() => {
    if (from && to) {
      getJourneys();
    }
  }, [from, to]);

  const handleFromChange = useCallback((value) => {
    setFrom(value);

    //  reset values
    setMidpoint(null);
    setPolylines([]);
  });
  const handleToChange = useCallback((value) => {
    setTo(value);

    //  reset values
    setMidpoint(null);
    setPolylines([]);
  });

  return (
    <SafeAreaView style={styles.container}>
      <GooglePlacesInput
        index={0}
        placeholder="Place A"
        apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
        onChange={handleFromChange}
      />
      <GooglePlacesInput
        index={1}
        placeholder="Place B"
        apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
        onChange={handleToChange}
      />
      <Map
        from={from}
        to={to}
        midpoint={midpoint}
        polylines={polylines}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
      />
      {isLoading ? (
        <View style={styles.loader}>
          <Text style={styles.loaderText}>Calculating your journeys...</Text>
        </View>
      ) : null}
      {destination ? (
        <View style={styles.destination}>
          <Text style={styles.destinationText}>Meet at {destination}.</Text>
        </View>
      ) : null}
    </SafeAreaView>
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
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    padding: 10,
    backgroundColor: "#ecf0f1",
    transform: [{ translateX: -90 }, { translateY: 10 }],
  },
  loaderText: {
    color: "#5d5d5d",
  },
  destination: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#000000",
  },
  destinationText: {
    fontSize: 16,
    color: "#ffffff",
  },
});
