import { Dispatch, FC, SetStateAction } from "react";

import { AirportElementT } from "types";

import Card from "./Card";

import { Container } from "./index.styled";

type T = {
  searchResult: AirportElementT[];
  activeCardId: string | null;
  setActiveCardId: Dispatch<SetStateAction<string | null>>;
};

const ResultsList: FC<T> = ({
  searchResult,
  activeCardId,
  setActiveCardId,
}) => {
  return (
    <Container>
      {searchResult.map((data) => {
        return (
          <Card
            key={data.id}
            data={data}
            activeCardId={activeCardId}
            setActiveCardId={setActiveCardId}
          />
        );
      })}
    </Container>
  );
};

export default ResultsList;
