import dayjs from 'dayjs';

export const time_count_down = (
  checkInTime?: string | undefined,
  checkOutTime?: string | undefined,
) => {
  const current = dayjs().format('HH:mm:ss');
  const currentTime =
    Number(current.split(':')[0]) * 60 * 60 * 1000 +
    Number(current.split(':')[1]) * 60 * 1000 +
    Number(current.split(':')[2]) * 1000;

  const checkIn =
    Number(checkInTime?.split(':')[0]) * 60 * 60 * 1000 +
    Number(checkInTime?.split(':')[1]) * 60 * 1000 +
    Number(checkInTime?.split(':')[2]) * 1000;

  const checkOut =
    Number(checkOutTime?.split(':')[0]) * 60 * 60 * 1000 +
    Number(checkOutTime?.split(':')[1]) * 60 * 1000 +
    Number(checkOutTime?.split(':')[2]) * 1000;

  var msec = checkOut ? checkOut - checkIn : currentTime - checkIn;
  var hh = Math.floor(msec / 1000 / 60 / 60);
  msec -= hh * 1000 * 60 * 60;
  var mm = Math.floor(msec / 1000 / 60);
  msec -= mm * 1000 * 60;
  var ss = Math.floor(msec / 1000);
  msec -= ss * 1000;
  if ((hh || mm || ss) && (hh >= 0 || mm >= 0 || ss >= 0)) {
    if (hh > 1) {
      return `${hh} Hours ${mm} min`;
    } else {
      return `${hh} Hour ${mm} min`;
    }
  } else {
    return '';
  }
};
