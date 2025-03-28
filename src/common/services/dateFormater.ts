import dayjs from 'dayjs';

export const formateDateTime = (date: string | undefined | null) => {
  return {
    datePart: dayjs(date).format('D MMM, YYYY'),
    timePart: dayjs(date).format('hh:mm A'),
  };
};

export const date_formater = (date: string | undefined | null) => {
  const month = dayjs(date).format('MMM');
  const day = dayjs(date).format('DD');
  const year = dayjs(date).format('YYYY');
  return `${day} ${month}, ${year}`;
};

export const date_formaterWithoutYear = (date: string | undefined | null) => {
  const month = dayjs(date).format('MMM');
  const day = dayjs(date).format('DD');
  // const year = dayjs(date).format('YYYY');
  return `${day} ${month}`;
};

export const getDay = (fromDate: string, toDate: string) => {
  const fromDay = dayjs(fromDate);
  const toDay = dayjs(toDate);
  let day = toDay.diff(fromDay, 'd');
  if (day + 1 > 1) {
    return `${day + 1} days`;
  } else {
    return `${day + 1} day`;
  }
};

export const getDayAndHours = (fromDate: any, toDate: any) => {
  const date1 = dayjs(fromDate);
  const date2 = dayjs(toDate);

  let minutes = date2.diff(date1, 'minutes');
  const days = Math.floor(minutes / (24 * 60));
  const remainingHours = Math.floor((minutes - days * 24 * 60) / 60);
  const remainingMinutes = minutes - days * 24 * 60 - remainingHours * 60;

  if (fromDate && toDate) {
    if (days && remainingHours && remainingMinutes) {
      return `${days}d, ${remainingHours}h ${remainingMinutes}m Remaining`;
    } else if (days && remainingHours) {
      return `${days}d, ${remainingHours}h Remaining`;
    } else if (days && remainingMinutes) {
      return `${days}d, ${remainingMinutes}m Remaining`;
    } else if (remainingHours && remainingMinutes) {
      return `${remainingHours}h ${remainingMinutes}m Remaining`;
    } else if (days) {
      return `${days}d Remaining`;
    } else if (remainingHours) {
      return `${remainingHours}h Remaining`;
    } else if (remainingMinutes) {
      return `${remainingMinutes}m Remaining`;
    } else {
      return 'Less than 1 minute Remaining';
    }
  } else {
    return '';
  }
};
