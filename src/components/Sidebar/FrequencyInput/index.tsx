import { Dispatch, FC, SetStateAction } from "react";

import { InfoCircleOutlined } from "@ant-design/icons";
import { Input, Tooltip } from "antd";

import { CoordinatesT } from "types";

import { InputContainer } from "./index.styled";

type T = {
  frequencyInput: number | string;
  setFrequencyInput: Dispatch<SetStateAction<string | number>>;
  coords: CoordinatesT;
  setCoords: Dispatch<SetStateAction<CoordinatesT>>;
};

const FrequencyInput: FC<T> = ({ frequencyInput, setFrequencyInput, coords }) => {
  const inputOnChangeAndTransform = (e: any) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.,]/g, "");
    value = value.replace(/,/g, ".");

    // Якщо немає крапки і довжина мінімум 4 символи — вставляємо крапку після третього символу
    if (!value.includes(".") && value.length >= 4) {
      value = value.slice(0, 3) + "." + value.slice(3);
    }

    // Якщо є більше однієї крапки — залишаємо тільки першу
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    setFrequencyInput(value);
  };

  const haveCoordinates = !!(!coords.lat && !coords.lng);

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
    </InputContainer>
  );
};

export default FrequencyInput;
