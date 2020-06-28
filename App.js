import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./screens/home_screen";
import MapScreen from "./screens/map_screen";
import DirectionsScreen from "./screens/directions_screen";
import JourneyProvider from "./journey_provider";

const Stack = createStackNavigator();

function App() {
  return (
    <JourneyProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "" }}
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
