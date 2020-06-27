import React, { useContext } from "react";
import { StyleSheet, View, Text, SafeAreaView, FlatList } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import JourneyContext from "./JourneyContext";

const Item = ({ title, index }) => (
  <View style={styles.item}>
    <Text>{index + 1}. {title}</Text>
  </View>
);

export default function DirectionsScreen() {
  const renderItem = ({ item, index }) => <Item index={index} title={item} />;

  const journeyContext = useContext(JourneyContext);
  const { directions, from, to } = journeyContext;

  const fromTitle = (from && from.name)? `Directions from ${from.name}`: "";
  const toTitle = (to && to.name)? `Directions from ${to.name}`: "";
  const titles = [fromTitle, toTitle];

  return (
    <SafeAreaView>
      {directions.map((dir, i) => {
        const backgroundColor = i === 0 ? "#dd007d" : "#006bb8";
        
        return (
          <View key={i}>
            <Text style={[styles.title, { backgroundColor }]}>
              <Icon name="arrow-right" size={15} color="white" />  {titles[i]}
            </Text>
            <FlatList
              data={dir}
              renderItem={renderItem}
              keyExtractor={(item, i) => i}
            />
          </View>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 3,
    marginHorizontal: 3,
  },
  title: {
    padding: 20,
    color: "#fff",
    backgroundColor: "#000000",
  },
});
