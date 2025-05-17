import styled from "styled-components/macro";
import { MapContainer } from "react-leaflet";

export const MapWrapper = styled(MapContainer)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background: gray;
  padding: 10px;

  * {
    box-sizing: border-box;
  }
`;

export const Container = styled.div`
  background: blue;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 123;
  overflow: hidden;
  position: relative;

  * {
    box-sizing: border-box;
  }
`;
