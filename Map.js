import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export const convertArrayToLatLng = (arr) => {
  return arr.map(([latitude, longitude]) => ({ latitude, longitude }));
};

export default function Map({
  from,
  to,
  midpoint,
  polylines,
  onFromChange,
  onToChange,
}) {
  return (
    <MapView
      initialRegion={{
        latitude: 51.528308,
        longitude: -0.0917765,
        latitudeDelta: 0.25,
        longitudeDelta: 0.25,
      }}
      style={styles.mapStyle}
    >
      {from && (
        <Marker
          coordinate={{
            latitude: from[0],
            longitude: from[1],
          }}
          title={"From"}
          description={"From"}
          pinColor="blue"
          onDragEnd={({ nativeEvent: { coordinate } }) => {
            onFromChange([coordinate.latitude, coordinate.longitude]);
          }}
          draggable
        />
      )}
      {to && (
        <Marker
          coordinate={{
            latitude: to[0],
            longitude: to[1],
          }}
          title={"To"}
          description={"To"}
          pinColor="green"
          onDragEnd={({ nativeEvent: { coordinate } }) => {
            onToChange([coordinate.latitude, coordinate.longitude]);
          }}
          draggable
        />
      )}
      {midpoint && (
        <Marker
          coordinate={{
            latitude: midpoint[0],
            longitude: midpoint[1],
          }}
          title={"Midpoint"}
          description={"Midpoint"}
          pinColor="red"
        />
      )}
      {polylines.map((polyline, i) => {
        const coordinates = convertArrayToLatLng(polyline);
        return <Polyline key={i} coordinates={coordinates} />;
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 100,
  },
});
