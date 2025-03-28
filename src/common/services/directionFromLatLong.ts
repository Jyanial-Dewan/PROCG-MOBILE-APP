export const directionFromLatLong = (
  lat: number | string,
  lng: number | string,
) => {
  if (+lat) {
    if (+lat > 0) {
      return 'N';
    } else {
      return 'S';
    }
  }
  if (+lng) {
    if (+lng > 0) {
      return 'E';
    } else {
      return 'W';
    }
  }
};
