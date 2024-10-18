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
  const {
    name,
    id,
    airport_ident,
    distance,
    type,
    bearing,
    typeDesc,
    frequency_mhz,
  }: any = data;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeCardId && ref?.current && activeCardId === id) {
      ref.current.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });
    }
  }, [ref, activeCardId, id]);

  return (
    <CardWrapper
      title={name}
      bordered={true}
      style={{ width: "100%" }}
      size="small"
      key={id}
      onClick={() => setActiveCardId(id)}
      $isActive={id === activeCardId}
      ref={ref}
    >
      <String>
        <span>{`ID: ${airport_ident || "-"}`}</span>{" "}
        <span>{`Distance to: ${distance || "-"}`}</span>
      </String>

      <String>
        <span>{`Type: ${type || "-"}`}</span>
        <span>{`Bearing: ${bearing || "-"}`}</span>
      </String>

      <String>{`Description: ${typeDesc || "-"}`}</String>
      <String>{`Frequency: ${
        frequency_mhz ? frequency_mhz + " MHz" : "-"
      }`}</String>
    </CardWrapper>
  );
};

export default Card;
