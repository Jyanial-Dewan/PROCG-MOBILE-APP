export const timeFormater = (time: any) => {
  let formatedTime = '';

  const pmOrAm = time?.split(' ');

  const hourOrMin = pmOrAm?.[0]?.split(':');
  if (pmOrAm?.[1] === 'PM') {
    let hour;
    if (+hourOrMin?.[0] === 12) {
      hour = 12;
    } else {
      hour = +hourOrMin?.[0] + 12;
    }

    let fullTime = `${hour}:${hourOrMin?.[1]}:00`;
    formatedTime = fullTime;
  }

  if (pmOrAm?.[1] === 'AM') {
    let timeAm = '';
    if (+hourOrMin?.[0] >= 10) {
      let tempHour = `${+hourOrMin?.[0]}:${hourOrMin?.[1]}:00`;
      timeAm = tempHour;
    }

    if (+hourOrMin?.[0] < 10) {
      let tempHour = `0${+hourOrMin?.[0]}:${hourOrMin?.[1]}:00`;
      timeAm = tempHour;
    }
    formatedTime = timeAm;
  }
  return formatedTime;
};

export const timeFormaterToPmAm = (time: string | undefined | null) => {
  const hourMin = time?.split(':');

  if (hourMin) {
    if (+hourMin?.[0] > 12) {
      const hour = +hourMin?.[0] - 12;
      return `${hour}:${hourMin?.[1]} PM`;
    } else {
      return `${hourMin?.[0]}:${hourMin?.[1]} AM`;
    }
  }
};

export const timeFormaterWithoutSecond = (time: any) => {
  let formatedTime = '';

  const pmOrAm = time?.split(' ');

  const hourOrMin = pmOrAm?.[0]?.split(':');
  if (pmOrAm?.[1] === 'PM') {
    let hour;
    if (+hourOrMin?.[0] === 12) {
      hour = 12;
    } else {
      hour = +hourOrMin?.[0] + 12;
    }

    let fullTime = `${hour}:${hourOrMin?.[1]}`;
    formatedTime = fullTime;
  }

  if (pmOrAm?.[1] === 'AM') {
    let timeAm = '';
    if (+hourOrMin?.[0] >= 10) {
      let tempHour = `${+hourOrMin?.[0]}:${hourOrMin?.[1]}`;
      timeAm = tempHour;
    }

    if (+hourOrMin?.[0] < 10) {
      let tempHour = `0${+hourOrMin?.[0]}:${hourOrMin?.[1]}`;
      timeAm = tempHour;
    }
    formatedTime = timeAm;
  }
  return formatedTime;
};
