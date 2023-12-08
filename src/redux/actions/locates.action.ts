import { Lang } from '../type';

export const changeLang = (typeLang: Lang) => {
  return {
    type: typeLang,
  };
};
