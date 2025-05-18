import { Dispatch, FC, SetStateAction, useEffect, useRef } from "react";

import { AirportElementT } from "types";

import { CardWrapper } from "./index.styled";
import { String } from "../index.styled";

type T = {
  data: AirportElementT;
  activeCardId: string | null;
  setActiveCardId: Dispatch<SetStateAction<string | null>>;
};

const Card: FC<T> = ({ data, activeCardId, setActiveCardId }) => {
  const { name, id, distance, type, bearing, typeDesc, frequency_mhz }: any = data;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCardId && ref?.current && activeCardId === id) {
      ref.current.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    } else {
    }
  }, [ref, activeCardId, id]);

  return (
    <CardWrapper
      title={name}
      variant="borderless"
      style={{ width: "100%" }}
      size="small"
      key={id}
      onClick={() => setActiveCardId(id)}
      $isActive={id === activeCardId}
      ref={ref}
    >
      <String>
        <span>{`Distance to: ${distance || "-"} km`}</span>
        <span>{`Bearing: ${bearing || "-"}`}</span>
      </String>

      <String>
        <span>{`Type: ${type || "-"}`}</span>
      </String>

      <String>{`Description: ${typeDesc || "-"}`}</String>
      <String>{`Frequency: ${frequency_mhz ? frequency_mhz + " MHz" : "-"}`}</String>
    </CardWrapper>
  );
};

export default Card;
