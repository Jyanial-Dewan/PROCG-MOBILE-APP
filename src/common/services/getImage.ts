import axios from 'axios';
export const getImageURL = (image: number | null | undefined | string) => {
  // const im = image && +image;
  return `${axios.defaults.baseURL}/Document/DownloadFile?id=${image}`;
};

export const getEprocurementImageURL = (
  image: number | null | undefined | string,
) => {
  return `${axios.defaults.baseURL}/EProcurement/DownlloadFile?id=${image}`;
};
