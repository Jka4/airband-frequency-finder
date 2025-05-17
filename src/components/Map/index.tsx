import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Circle,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";

import { AirportElementT, CoordinatesT } from "types";

import { Container, MapWrapper } from "./index.styled";

type T = {
  coords: CoordinatesT;
  setCoords: Dispatch<SetStateAction<CoordinatesT>>;
  sliderValue: number;
  searchResult: AirportElementT[];
  activeCardId: string | null;
  setActiveCardId: Dispatch<SetStateAction<string | null>>;
};

const housingIcon = new Icon({
  iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
  iconSize: [38, 45], // size of the icon
});

const MapContainer: FC<T> = ({
  coords,
  setCoords,
  sliderValue,
  searchResult,
  activeCardId,
  setActiveCardId,
}) => {
  const markerRef = useRef(null);

  const [coordsForCentering, setCoordsForCentering] = useState<
    CoordinatesT | any
  >({
    lat: 0,
    lng: 0,
  });

  const activeCardIdCoords = useMemo(() => {
    return searchResult.find((el) => el.id === activeCardId);
  }, [activeCardId, searchResult]);

  const polyline: any = [
    [coords.lat, coords.lng],
    [
      activeCardIdCoords?.latitude_deg || coords.lat,
      activeCardIdCoords?.longitude_deg || coords.lng,
    ],
  ];

  const RecenterAutomatically = ({ lat, lng }: any) => {
    const map = useMap();
    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);
    return null;
  };

  useEffect(() => {
    setCoordsForCentering({
      lat: coords.lat,
      lng: coords.lng,
    });
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker: any = markerRef.current;

        if (marker != null) {
          setCoordsForCentering(marker.getLatLng());
        }
      },
      drag() {
        const marker: any = markerRef.current;

        if (marker != null) {
          setCoords(marker.getLatLng());
        }
      },
    }),
    []
  );

  return (
    <Container>
      <MapWrapper center={coordsForCentering} zoom={6} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeCardId && (
          <Polyline pathOptions={{ color: "red" }} positions={polyline} />
        )}

        <Circle
          center={coords}
          pathOptions={{ fillColor: "blue" }}
          radius={sliderValue > 1000 ? 0 : sliderValue * 1000}
        />

        <Marker
          position={coords}
          eventHandlers={eventHandlers}
          ref={markerRef}
          icon={housingIcon}
          autoPan={true}
          draggable
        >
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

        <RecenterAutomatically
          lat={coordsForCentering.lat}
          lng={coordsForCentering.lng}
        />
      </MapWrapper>
    </Container>
  );
};

export default MapContainer;
