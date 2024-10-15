import { FC, useEffect, useState } from "react";
import Fuse from "fuse.js";
import { airports } from "./data/airports";
import Sidebar from "./pages/Sidebar";
import { defaultDistanceOfReceive } from "./constants";
import PermissionsPlaceholder from "./pages/PermissionPlaceholder";
import { AirportElementT, CoordinatesT } from "./types";
import sortBy from "lodash.sortby";
import MapContainer from "./pages/Map";
import { AppContainer } from "./App.styled";
import { bearing } from "./utils/bearing";
import { useDeepCompareEffect } from "react-use";
import { distanceBetweenCoordinates } from "./utils/distanceBetweenCoordinates";

let fuseOptions = {
  shouldSort: true,
  findAllMatches: true,
  threshold: 0.3,
  location: 0,
  distance: 10,
  maxPatternLength: 20,
  minMatchCharLength: 3,
  keys: ["frequency_mhz"],
  //   keys: ["id", "airport_ref", "airport_ident", "description", "frequency_mhz"],
};

console.clear();

const App: FC = () => {
  const [searchResult, setSearchResult] = useState<AirportElementT[]>([]);
  const [frequencyInput, setFrequencyInput] = useState<string | number>(118.3);
  const [sliderValue, setSliderValue] = useState(defaultDistanceOfReceive);
  const [coords, setCoords] = useState<CoordinatesT>({
    lat: 51.505,
    lon: -0.09,
  });
  const [geoPermissions, setGeoPermissions] = useState(true);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // search triggered by changes
  useEffect(() => {
    if (!coords.lat && !coords.lon && !frequencyInput) return;

    const freqRaw = (frequencyInput + "").replace(/\D/g, "");
    const freq = freqRaw.slice(0, 3) + "." + freqRaw.slice(3) + "";

    const fuse = new Fuse(airports, fuseOptions);
    const arr = fuse.search(freq);

    const results: any[] = [];

    for (let i = 0; i <= arr.length - 1; i++) {
      const el = arr[i];

      const { latitude_deg, longitude_deg, frequency_mhz } = el.item;

      const distanceInKm = Math.round(
        distanceBetweenCoordinates(
          Number(coords.lat),
          Number(coords.lon),
          Number(latitude_deg),
          Number(longitude_deg)
        ) / 1000
      );

      const targetFreqStart = Number(freq) - 0.02;
      const targetFreqEnd = Number(freq) + 0.02;
      const elFreq = Number(frequency_mhz);

      if (
        distanceInKm <= sliderValue &&
        elFreq >= targetFreqStart &&
        elFreq <= targetFreqEnd
      ) {
        const bearingDeg = bearing(
          Number(coords.lat),
          Number(coords.lon),
          Number(latitude_deg),
          Number(longitude_deg)
        );

        results.push({
          ...el.item,
          distance: distanceInKm,
          bearing: bearingDeg,
        });
      }
    }

    setSearchResult(sortBy(results, "distance"));
  }, [frequencyInput, coords, sliderValue]);

  // detach line between two points
  useDeepCompareEffect(() => {
    const activeCardInRadius = searchResult.find(
      (el: any) => el?.id === activeCardId
    );
    if (!activeCardInRadius) setActiveCardId(null);
  }, [searchResult, activeCardId]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") setGeoPermissions(true);
          else setGeoPermissions(false);
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <AppContainer>
      <PermissionsPlaceholder geoPermissions={geoPermissions} />

      <Sidebar
        frequencyInput={frequencyInput}
        setFrequencyInput={setFrequencyInput}
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
        coords={coords}
        setCoords={setCoords}
        searchResult={searchResult}
        activeCardId={activeCardId}
        setActiveCardId={setActiveCardId}
      />

      <MapContainer
        coords={coords}
        sliderValue={sliderValue}
        searchResult={searchResult}
        activeCardId={activeCardId}
        setActiveCardId={setActiveCardId}
      />
    </AppContainer>
  );
};

export default App;
