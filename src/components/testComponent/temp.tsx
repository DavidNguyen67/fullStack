import { useEffect, useState } from 'react';
import instance from '../../utils/axios/customAxios';
import { v4 as uuid } from 'uuid';

const Temp = () => {
  const [img, setImg] = useState<any[]>([]);

  const fetchImg = async () => {
    const response: any[] = await instance.get('download');
    setImg(response);
  };
  useEffect(() => {
    fetchImg();
  }, []);

  return (
    <>
      {img &&
        img.length > 0 &&
        img.map((img: any, index) => {
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(img.avatar.data))
          );
          return (
            <img
              key={uuid()}
              src={'data:image/png;base64,' + base64String}
              alt=""
            />
          );
        })}
    </>
  );
};

export default Temp;
