import { FC, useEffect, useState } from "react";
import Fuse from "fuse.js";
import sortBy from "lodash.sortby";

import { airports } from "data/airports";
import { defaultDistanceOfReceive } from "constants/index";
import { AirportElementT, CoordinatesT } from "types";
import { bearing } from "utils/bearing";
import { useDeepCompareEffect } from "react-use";
import { distanceBetweenCoordinates } from "utils/distanceBetweenCoordinates";

import Sidebar from "components/Sidebar";
import MapContainer from "components/Map";
import { AppContainer } from "./App.styled";
import { useLocalStorage } from "hooks/useLocalStorage";

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

const App: FC = () => {
  const [searchResult, setSearchResult] = useState<AirportElementT[]>([]);
  const [sliderValue, setSliderValue] = useLocalStorage<number>("sliderValue", defaultDistanceOfReceive);
  const [frequencyInput, setFrequencyInput] = useLocalStorage<string | number>("frequencyInput", 118.3);

  const [coords, setCoords] = useLocalStorage<CoordinatesT>("coords", {
    lat: 46.47,
    lng: 30.75,
  });

  const [activeCardId, setActiveCardId] = useLocalStorage<string | null>("activeCardId", null);
  const [zoomLevel, setZoomLevel] = useLocalStorage<number>("zoomLevel", 6);

  // search triggered by changes
  useEffect(() => {
    if (!coords.lat && !coords.lng && !frequencyInput) return;

    const freqRaw = (frequencyInput + "").replace(/\D/g, "");
    const freq = freqRaw.slice(0, 3) + "." + freqRaw.slice(3) + "";

    const fuse = new Fuse([...airports], fuseOptions);
    const arr = fuse.search(freq);

    const results: any[] = [];

    for (let i = 0; i <= arr.length - 1; i++) {
      const el = arr[i];

      const { latitude_deg, longitude_deg, frequency_mhz } = el.item;

      const distanceInKm = Math.round(
        distanceBetweenCoordinates(
          Number(coords.lat),
          Number(coords.lng),
          Number(latitude_deg),
          Number(longitude_deg),
        ) / 1000,
      );

      const targetFreqStart = Number(freq) - 0.02;
      const targetFreqEnd = Number(freq) + 0.02;
      const elFreq = Number(frequency_mhz);

      if (distanceInKm <= sliderValue && elFreq >= targetFreqStart && elFreq <= targetFreqEnd) {
        const bearingDeg = bearing(Number(coords.lat), Number(coords.lng), Number(latitude_deg), Number(longitude_deg));

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
    const activeCardInRadius = searchResult.find((el: any) => el?.id === activeCardId);
    if (!activeCardInRadius) setActiveCardId(null);
  }, [searchResult, activeCardId]);

  return (
    <AppContainer>
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
        setCoords={setCoords}
        sliderValue={sliderValue}
        searchResult={searchResult}
        activeCardId={activeCardId}
        setActiveCardId={setActiveCardId}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
      />
    </AppContainer>
  );
};

export default App;
