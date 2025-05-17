import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";

import {
  Circle,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";

import { AirportElementT, CoordinatesT } from "types";

import { Container, MapWrapper } from "./index.styled";

type T = {
  coords: CoordinatesT;
  sliderValue: number;
  searchResult: AirportElementT[];
  activeCardId: string | null;
  setActiveCardId: Dispatch<SetStateAction<string | null>>;
};
const MapContainer: FC<T> = ({
  coords,
  sliderValue,
  searchResult,
  activeCardId,
  setActiveCardId,
}) => {
  let position: LatLngExpression = [
    Number(coords?.lat || 0),
    Number(coords?.lon || 0),
  ];

  const RecenterAutomatically = ({ lat, lng }: any) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  };

  const activeCardIdCoords = useMemo(() => {
    return searchResult.find((el) => el.id === activeCardId);
  }, [activeCardId, searchResult]);

  const polyline: any = [
    [coords.lat, coords.lon],
    [
      activeCardIdCoords?.latitude_deg || coords.lat,
      activeCardIdCoords?.longitude_deg || coords.lon,
    ],
  ];

  return (
    <Container>
      <MapWrapper center={position} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeCardId && (
          <Polyline pathOptions={{ color: "red" }} positions={polyline} />
        )}

        <Circle
          center={position}
          pathOptions={{ fillColor: "blue" }}
          radius={sliderValue > 1000 ? 0 : sliderValue * 1000}
        />

        <Marker position={position}>
          <Popup>My location</Popup>
        </Marker>

        {searchResult.map((el) => {
          const markerPosition: LatLngExpression = [
            Number(el.latitude_deg),
            Number(el.longitude_deg),
          ];

          return (
            <Marker
              key={el?.id}
              position={markerPosition}
              eventHandlers={{ click: () => setActiveCardId(el.id) }}
            >
              <Popup>{`${el.name}`}</Popup>
            </Marker>
          );
        })}
        <RecenterAutomatically lat={position[0]} lng={position[1]} />
      </MapWrapper>
    </Container>
  );
};

export default MapContainer;
