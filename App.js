import React, { useState, useCallback, useEffect, useContext } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { Button } from 'react-native-elements';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";

import GooglePlacesInput from "./GooglePlacesInput";
import MapScreen, {
  fetchJourney,
  concatLegs,
  getDirections,
} from "./MapScreen";
import DirectionsScreen from "./DirectionsScreen";
import JourneyContext from "./JourneyContext";
import JourneyProvider from "./JourneyProvider";

function HomeScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);
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

  const buttonLabel = isLoading ? "Calculating your journeys..." : "See your journeys";

  const shouldDisplayBtn = journeyContext.from && journeyContext.to;
  const buttonOpacity = shouldDisplayBtn? 1 : 0;

  return (
    <View style={styles.container}>
      <Image source={require("./assets/logo.png")} style={styles.logo} />
      <View style={styles.inputWrapper}>
        <GooglePlacesInput
          index={0}
          placeholder="Type your address"
          apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
          onChange={handleFromChange}
        />
        <GooglePlacesInput
          index={1}
          placeholder="Type friend's address"
          apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
          onChange={handleToChange}
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
      

      {/* {isLoading ? (
        <View style={styles.loader}>
          <Text style={styles.loaderText}>Calculating your journeys...</Text>
        </View>
      ) : null} */}
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
            options={{ title: "Your directions" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </JourneyProvider>
  );
}

export default App;
