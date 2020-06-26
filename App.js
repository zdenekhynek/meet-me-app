import React, { useState, useCallback, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import GooglePlacesInput from "./GooglePlacesInput";
import MapScreen, { fetchJourney, concatLegs, getDirections } from "./MapScreen";
import DirectionsScreen from "./DirectionsScreen";
import JourneyContext from "./JourneyContext";
import JourneyProvider from "./JourneyProvider";

function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const journeyContext = useContext(JourneyContext);
  
  const getJourneys = useCallback(async () => {
    setIsLoading(true);

    const data = await fetchJourney(journeyContext.from.coords, journeyContext.to.coords);
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

  useEffect(() => {
    if (journeyContext.from && journeyContext.to) {
      getJourneys();
    }
  }, [journeyContext.from, journeyContext.to]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Logo</Text>
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
      <Button
        title="Go to map"
        onPress={() => {
          navigation.navigate("Map");
        }}
      />
      {isLoading ? (
        <View style={styles.loader}>
          <Text style={styles.loaderText}>Calculating your journeys...</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
  },
  input: {},
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
});

const Stack = createStackNavigator();

function App() {
  return (
    <JourneyProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "MeetMe" }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: "Your journeys" }}
          />
          <Stack.Screen
            name="Directions"
            component={DirectionsScreen}
            options={{ title: "Your journeys" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </JourneyProvider>
  );
}

export default App;
