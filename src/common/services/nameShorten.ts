export const nameShorten = (n: string | null | undefined) => {
  //@ts-ignore
  let title = n?.length > 15 ? `${n?.slice(0, 27)}...` : n;
  return title;
};
