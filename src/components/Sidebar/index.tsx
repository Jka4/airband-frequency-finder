import { Dispatch, FC, SetStateAction } from "react";

import { maxDistanceOfReceiveWithPropagations } from "constants/index";
import { AirportElementT, CoordinatesT } from "types";

import FrequencyInput from "./FrequencyInput";
import DistanceSlider from "./DistanceSlider";
import ResultsList from "./ResultsList";

import { Container, String } from "./index.styled";

type T = {
  frequencyInput: number | string;
  setFrequencyInput: Dispatch<SetStateAction<string | number>>;
  sliderValue: number;
  setSliderValue: Dispatch<SetStateAction<number>>;
  coords: CoordinatesT;
  setCoords: Dispatch<SetStateAction<CoordinatesT>>;
  searchResult: AirportElementT[];
  activeCardId: string | null;
  setActiveCardId: Dispatch<SetStateAction<string | null>>;
};

const Sidebar: FC<T> = ({
  frequencyInput,
  setFrequencyInput,
  sliderValue,
  setSliderValue,
  coords,
  setCoords,
  searchResult,
  activeCardId,
  setActiveCardId,
}) => {
  const latRound = Math.round((coords?.lat || 0) * 100) / 100 || "-";
  const lonRound = Math.round((coords?.lon || 0) * 100) / 100 || "-";

  const formatter = (value: number) => {
    const above1k = value >= maxDistanceOfReceiveWithPropagations;

    if (above1k) {
      setSliderValue(9999999999);
      return "All globe";
    }

    return `${value} km`;
  };

  return (
    <Container>
      <FrequencyInput
        frequencyInput={frequencyInput}
        setFrequencyInput={setFrequencyInput}
        coords={coords}
        setCoords={setCoords}
      />

      <String>
        {`lat: ${latRound}  ,  Lon: ${lonRound || "-"}\n \n \n`}
        {`Radius: ${formatter(sliderValue)}`}
      </String>

      <DistanceSlider
        sliderValue={sliderValue}
        setSliderValue={setSliderValue}
      />

      <ResultsList
        searchResult={searchResult}
        activeCardId={activeCardId}
        setActiveCardId={setActiveCardId}
      />
    </Container>
  );
};

export default Sidebar;
