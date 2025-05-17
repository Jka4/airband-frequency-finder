import { Dispatch, FC, SetStateAction } from "react";

import { Slider } from "antd";

import { SliderContainer } from "./index.styled";

type T = {
  sliderValue: number;
  setSliderValue: Dispatch<SetStateAction<number>>;
};

const DistanceSlider: FC<T> = ({ sliderValue, setSliderValue }) => {
  return (
    <SliderContainer>
      <Slider
        min={1}
        max={1000}
        onChange={(value) => {
          setSliderValue(value);
        }}
        value={sliderValue}
        tooltip={{ open: false }}
        style={{ width: "100%" }}
      />
    </SliderContainer>
  );
};

export default DistanceSlider;
