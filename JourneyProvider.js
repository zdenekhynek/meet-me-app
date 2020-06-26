import React, { useState } from "react";

import JourneyContext from "./JourneyContext";

export default (props) => {
  const [from, setFromState] = useState(null);
  const [to, setToState] = useState(null);
  const [midpoint, setMidpointState] = useState(null);
  const [destination, setDestinationState] = useState("");
  const [polylines, setPolylinesState] = useState([]);
  const [directions, setDirectionsState] = useState([]);

  const setFrom = (from) => {
    setFromState(from);
  };

  const setTo = (to) => {
    setToState(to);
  };

  const setMidpoint = (midpoint) => {
    setMidpointState(midpoint);
  };

  const setDestination = (text) => {
    setDestinationState(text);
  };

  const setPolylines = (polylines) => {
    setPolylinesState(polylines);
  };

  const setDirections = (directions) => {
    setDirectionsState(directions);
  };

  const journeyState = {
    from,
    to,
    midpoint,
    destination,
    polylines,
    directions,
    setFrom,
    setTo,
    setMidpoint,
    setDestination,
    setPolylines,
    setDirections,
  };

  return (
    <JourneyContext.Provider value={journeyState}>
      {props.children}
    </JourneyContext.Provider>
  );
};
