import { Dispatch, FC, SetStateAction, useEffect } from "react";

import { AimOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";

import { CoordinatesT } from "types";

import { InputContainer, ButtonWrapper } from "./index.styled";

type T = {
  frequencyInput: number | string;
  setFrequencyInput: Dispatch<SetStateAction<string | number>>;
  coords: CoordinatesT;
  setCoords: Dispatch<SetStateAction<CoordinatesT>>;
};

const FrequencyInput: FC<T> = ({
  frequencyInput,
  setFrequencyInput,
  coords,
  setCoords,
}) => {
  const inputOnChangeAndTransform = (e: any) => {
    const value = e.target.value;
    const freq = value.replaceAll(".", "").replaceAll(",", "");

    setFrequencyInput(freq);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const p = position.coords;

        // setCoords({ lat: 51.505, lon: -0.09 });
        setCoords({ lat: p.latitude, lon: p.longitude });
      });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const haveCoordinates = !!(!coords.lat && !coords.lon);

  return (
    <InputContainer>
      <Input
        placeholder="Enter frequency"
        onChange={(e) => inputOnChangeAndTransform(e)}
        value={frequencyInput}
        autoFocus
        suffix={
          <Tooltip title="You can use any format of frequency, with a dot, a comma or without at all">
            <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
          </Tooltip>
        }
      />

      <ButtonWrapper
        icon={
          <AimOutlined
            style={{ fontSize: "20px", width: "100%", display: "flex" }}
            spin={haveCoordinates}
          />
        }
        onClick={getLocation}
      />
    </InputContainer>
  );
};

export default FrequencyInput;
