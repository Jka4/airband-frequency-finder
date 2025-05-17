const toRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

const toDegrees = (radians: number) => {
  return (radians * 180) / Math.PI;
};

const getCardinalDirection = (angle: number) => {
  if (typeof angle === "string") angle = parseInt(angle);
  if (angle <= 0 || angle > 360 || typeof angle === "undefined") return "☈";
  const arrows: any = {
    north: "↑ N",
    north_east: "↗ NE",
    east: "→ E",
    south_east: "↘ SE",
    south: "↓ S",
    south_west: "↙ SW",
    west: "← W",
    north_west: "↖ NW",
  };

  const directions = Object.keys(arrows);
  const degree = 360 / directions.length;

  angle = angle + degree / 2;
  for (let i = 0; i < directions.length; i++) {
    if (angle >= i * degree && angle < (i + 1) * degree)
      return arrows[directions[i]];
  }

  return arrows["north"];
};

export const bearing = (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number
) => {
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  let y = Math.sin(destLng - startLng) * Math.cos(destLat);
  let x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = (Math.round(toDegrees(Math.atan2(y, x))) + 360) % 360;

  const cardinal = getCardinalDirection(brng);

  return brng + "°" + " " + cardinal;
};
