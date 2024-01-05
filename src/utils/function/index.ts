export function isEmpty(obj) {
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
}
export function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
}
export function excludeAndNullVal(user, keys) {
  return Object.fromEntries(
    Object.entries(user).reduce((acc, [key, value]) => {
      if (!keys.includes(key) && value !== false) {
        acc.push([key, value]);
      }
      return acc;
    }, []),
  );
}
export const processUserData = (body: any[]): any[] => {
  const filteredPayload = body.reduce((acc, data) => {
    const id = Number(data.id || data.doctorId);

    const filteredData = exclude(data, ['id']);
    if (!isEmpty(filteredData)) {
      acc.push({ id, ...filteredData });
    }
    return acc;
  }, []);

  return filteredPayload;
};

// export function base64_encode(file) {
//   // read binary data
//   const bitmap = fs.readFileSync(file);
//   // convert binary data to base64 encoded string
//   return new Buffer(bitmap).toString('base64');
// }
export const getBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
  });
};
export const calculateSizeBytes = (charLength: number) => (charLength * 6) / 8;
