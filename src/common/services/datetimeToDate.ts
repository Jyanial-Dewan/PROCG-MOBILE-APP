import dayjs from 'dayjs';
import {_todayDate} from './todayDate';

export const datetimeToDate = (date: string | undefined | null) => {
  const formatedDate = dayjs(date || _todayDate()).format('YYYY-MM-DD');
  return formatedDate;
};
