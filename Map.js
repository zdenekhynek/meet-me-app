import React, { Component } from "react";
import { StyleSheet, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export const convertArrayToLatLng = (arr) => {
  return arr.map(([latitude, longitude]) => ({ latitude, longitude }));
};

export default class Map extends Component {
  constructor() {
    super();
    this.mapRef = null;
  }

  componentDidMount() {
    //  allow for component lifecycles to sync
    setTimeout(() => {
      this.fitToMarkers();
    }, 250);
  }

  componentDidUpdate() {
    this.fitToMarkers();
  }

  fitToMarkers() {
    const { from, to, midpoint } = this.props;

    if (this.mapRef && from && to && midpoint) {
      const coords = [
        {
          latitude: from[0],
          longitude: from[1],
        },
        {
          latitude: to[0],
          longitude: to[1],
        },
        {
          latitude: midpoint[0],
          longitude: midpoint[1],
        },
      ];
      this.mapRef.fitToCoordinates(coords, {
        edgePadding: { top: 100, bottom: 140, left: 20, right: 20 },
      });
    }
  }

  render() {
    const {
      from,
      to,
      midpoint,
      polylines,
      onFromChange,
      onToChange,
    } = this.props;

    return (
      <MapView
        ref={(ref) => {
          this.mapRef = ref;
        }}
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
            pinColor="#dd007d"
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
            pinColor="#006bb8"
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
            pinColor="#362983"
          />
        )}
        {polylines.map((polyline, i) => {
          const coordinates = convertArrayToLatLng(polyline);
          return <Polyline key={i} coordinates={coordinates} />;
        })}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    marginTop: 105,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 105,
  },
});
