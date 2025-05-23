import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { Circle, Marker, Polyline, Popup, TileLayer, useMap, MapContainer as LeafletMapContainer } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";

import { AirportElementT, CoordinatesT } from "types";
import { Container } from "./index.styled";

type T = {
  coords: CoordinatesT;
  setCoords: Dispatch<SetStateAction<CoordinatesT>>;
  sliderValue: number;
  searchResult: AirportElementT[];
  activeCardId: string | null;
  setActiveCardId: Dispatch<SetStateAction<string | null>>;
  zoomLevel: number;
  setZoomLevel: Dispatch<SetStateAction<number>>;
};

const housingIcon = new Icon({
  iconUrl: "https://img.icons8.com/plasticine/100/exterior.png",
  iconSize: [38, 45],
});

const ZoomHandler = ({ setZoomLevel }: { setZoomLevel: (z: number) => void }) => {
  useMap().on("zoomend", function (e) {
    setZoomLevel(e.target._zoom);
  });
  return null;
};

const RecenterAutomatically = ({ lat, lng }: any) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

const MapComponent: FC<T> = ({
  coords,
  setCoords,
  sliderValue,
  searchResult,
  activeCardId,
  setActiveCardId,
  zoomLevel,
  setZoomLevel,
}) => {
  const markerRef = useRef(null);

  const [coordsForCentering, setCoordsForCentering] = useState<CoordinatesT>({
    lat: 0,
    lng: 0,
  });

  const activeCardIdCoords = useMemo(() => {
    return searchResult.find((el) => el.id === activeCardId);
  }, [activeCardId, searchResult]);

  const polyline: any = [
    [coords.lat, coords.lng],
    [activeCardIdCoords?.latitude_deg || coords.lat, activeCardIdCoords?.longitude_deg || coords.lng],
  ];

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
    [setCoords],
  );

  return (
    <Container>
      <LeafletMapContainer
        center={coordsForCentering}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomHandler setZoomLevel={setZoomLevel} />

        {activeCardId && <Polyline pathOptions={{ color: "red" }} positions={polyline} />}

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
          zIndexOffset={123}
        >
          <Popup>My location</Popup>
        </Marker>

        {searchResult.map((el) => {
          const markerPosition: LatLngExpression = [Number(el.latitude_deg), Number(el.longitude_deg)];
          return (
            <Marker key={el?.id} position={markerPosition} eventHandlers={{ click: () => setActiveCardId(el.id) }}>
              <Popup>{`${el.name}`}</Popup>
            </Marker>
          );
        })}

        <RecenterAutomatically lat={coordsForCentering.lat} lng={coordsForCentering.lng} />
      </LeafletMapContainer>
    </Container>
  );
};

export default MapComponent;
