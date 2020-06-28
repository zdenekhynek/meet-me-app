
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

export const parseJourneys = (data) => {
  const { journeys, midpoint, destination } = data;

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

  return { midpoint, polylines, destination, directions };
}

export const fetchJourney = async (from, to) => {
  const url = getJourneyApiUrl(
    process.env.REACT_NATIVE_APP_JOURNEY_API_HOST,
    from.join(","),
    to.join(",")
  );

  console.log("fetchingJourney from url", url);
  const result = await fetch(url);

  if (result.ok) {
    const json = await result.json();
    return parseJourneys(json.data);
  } else {
    console.error("Error fetching journeys from API");
  }
};