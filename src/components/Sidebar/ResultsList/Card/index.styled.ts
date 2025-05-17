import { Card } from "antd";
import styled from "styled-components/macro";

type CardWrapperT = {
  $isActive: boolean;
};

export const CardWrapper = styled(Card)<CardWrapperT>`
  margin-bottom: 10px;
  cursor: pointer;
  background: ${({ $isActive }): string => ($isActive ? "#1677ff" : "white")};
  border: 1px solid black;

  .ant-card-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .ant-card-head {
    border-bottom: 1px solid black;
  }
`;
