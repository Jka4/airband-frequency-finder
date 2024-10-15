type T = { lat1: number; lon1: number; lat2: number; lon2: number };

export const distanceBetweenCoordinates = (
  lat1 = 0,
  lon1 = 0,
  lat2 = 0,
  lon2 = 0
) => {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;

  const d =
    Math.acos(
      Math.sin(p1) * Math.sin(p2) +
        Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)
    ) * R;

  return d;
};
