const getLastDayOfMonth = () => {
  var today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 0).getDate();
};

const getFirstDayOfMonth = () => {
  var today = new Date();
  const day = new Date(today.getFullYear(), today.getMonth(), 1).getDate();

  if (day < 9) {
    return `0${day}`;
  } else {
    return day;
  }
};

export const _todayDate = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  return todayDate;
};

export const _todayDateTime = () => {
  var todayDate = new Date(new Date().setHours(new Date().getHours() + 6));

  return todayDate;
};

export const _firstDateOfMonth = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    getFirstDayOfMonth();
  return todayDate;
};

export const _lastDateOfMonth = () => {
  var today = new Date();
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    getLastDayOfMonth();
  return todayDate;
};

export const dateFormater = (date: any) => {
  var today = new Date(date);
  const todayDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);
  if (date) {
    return todayDate;
  } else {
    return "";
  }
};

// today.getFullYear() +
//     "-" +
//     ("0" + (today.getMonth() + 1)).slice(-2) +
//     "-" +
//     ("0" + today.getDate()).slice(-2);
