import dayjs from 'dayjs';

export const timeDifference = (shiftEndTime: any) => {
  const current = dayjs().format('HH:mm');
  const currentTime =
    Number(current.split(':')[0]) * 60 * 60 +
    Number(current.split(':')[1]) * 60;

  const endTime =
    Number(shiftEndTime?.split(':')[0]) * 60 * 60 +
    Number(shiftEndTime?.split(':')[1]) * 60;
  return currentTime - endTime > 3600 ? true : false;
};
