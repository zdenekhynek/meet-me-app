import React, { useState, useCallback, useEffect, useContext } from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

import JourneyContext from "./JourneyContext";
import GooglePlacesInput from "./GooglePlacesInput";
import Map from "./Map";

export const concatLegs = (legs) => {
  return legs.reduce((acc, leg) => {
    return acc.concat(leg.coords);
  }, []);
};

export const getDirections = (legs = []) => {
  return legs.map((leg) => {
    return leg.summary;
  });
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

export default function MapScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const journeyContext = useContext(JourneyContext);

  const getJourneys = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchJourney(
      journeyContext.from.coords,
      journeyContext.to.coords
    );
    const { journeys, midpoint } = data;

    if (midpoint) {
      journeyContext.setMidpoint(midpoint);
    }

    if (journeys) {
      const journeyPolylines = journeys.map((journey) => {
        if (!journey) {
          return [];
        }
        const { legs } = journey;
        return legs ? concatLegs(legs) : [];
      });
      const directions = journeys.map((journey) => {
        const { legs } = journey;
        return getDirections(legs);
      });

      journeyContext.setPolylines(journeyPolylines);
      journeyContext.setDestination(data.destination);
      journeyContext.setDirections(directions);
    }
    setIsLoading(false);
  }, [journeyContext.from, journeyContext.to]);

  useEffect(() => {
    if (journeyContext.from && journeyContext.to) {
      getJourneys();
    }
  }, [journeyContext.from, journeyContext.to]);

  const handleFromChange = useCallback((name, coords) => {
    journeyContext.setFrom({ name, coords });

    //  reset values
    journeyContext.setMidpoint(null);
    journeyContext.setPolylines([]);
  });
  const handleToChange = useCallback((name, coords) => {
    journeyContext.setTo({ name, coords });

    //  reset values
    journeyContext.setMidpoint(null);
    journeyContext.setPolylines([]);
  });

  const midpoint = journeyContext.destination
    ? journeyContext.destination.coord
    : journeyContext.midpoint;

  return (
    <SafeAreaView style={styles.container}>
      <GooglePlacesInput
        index={0}
        value={journeyContext.from && journeyContext.from.name}
        placeholder="Type your address"
        theme="small"
        apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
        onChange={handleFromChange}
      />
      <GooglePlacesInput
        index={1}
        value={journeyContext.to && journeyContext.to.name}
        placeholder="Type friend's address"
        theme="small"
        apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
        onChange={handleToChange}
      />
      <Map
        from={journeyContext.from && journeyContext.from.coords}
        to={journeyContext.to && journeyContext.to.coords}
        midpoint={midpoint}
        polylines={journeyContext.polylines}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
      />
      {isLoading ? (
        <View style={styles.loader}>
          <Text style={styles.loaderText}>Calculating your journeys...</Text>
        </View>
      ) : null}
      {journeyContext.destination ? (
        <View style={styles.destination}>
          <Button
            title={`Meet at ${journeyContext.destination.name}.`}
            buttonStyle={{
              paddingTop: 20,
              paddingBottom: 20,
              backgroundColor: "#362983",
              borderRadius: 0,
            }}
            containerStyle={{
              borderRadius: 0,
            }}
            titleStyle={{
              fontSize: 16,
              padding: 20,
            }}
            onPress={() => {
              navigation.navigate("Directions");
            }}
            icon={<Icon name="arrow-right" size={15} color="white" />}
            iconRight
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  },
});
