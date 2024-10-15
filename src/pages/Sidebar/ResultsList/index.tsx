import { Dispatch, FC, SetStateAction } from "react";
import { AirportElementT } from "../../../types";
import { Container } from "./index.styled";
import Card from "./Card";

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
      {searchResult.map((element) => {
        return (
          <Card
            key={element.id}
            element={element}
            activeCardId={activeCardId}
            setActiveCardId={setActiveCardId}
          />
        );
      })}
    </Container>
  );
};

export default ResultsList;
