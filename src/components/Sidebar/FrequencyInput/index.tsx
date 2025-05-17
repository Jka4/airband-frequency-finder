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

  const getLocation = async () => {
    if (!navigator.geolocation) return;

    if (navigator.permissions) {
      try {
        const status = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        if (status.state === "denied") {
          alert("Доступ до геолокації заборонено у налаштуваннях браузера.");
          return;
        }
      } catch (e) {}
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const p = position.coords;
        setCoords({ lat: p.latitude, lon: p.longitude });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Будь ласка, дозвольте доступ до геолокації.");
        } else {
          alert("Не вдалося отримати геолокацію.");
        }
      }
    );
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
