import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from "react-native";
import GooglePlacesInput from "./GooglePlacesInput";

export default function App() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.input}>
          <GooglePlacesInput
            placeholder="Place A"
            apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
          />
        </View>
        <View style={styles.input}>
          <GooglePlacesInput
            placeholder="Place B"
            apiKey={process.env.REACT_NATIVE_GOOGLE_MAPS_API_KEY}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    height: 44,
    backgroundColor: "#f00",
  },
  instructions: {
    color: "#888",
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 10,
  },
});
