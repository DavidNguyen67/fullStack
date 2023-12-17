export function isEmpty(obj) {
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
}
export function exclude(user, keys) {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key)),
  );
}

export const processUserData = (body) => {
  const filteredPayload = body.reduce(
    (acc, data) => {
      const id = Number(data.id);

      const filteredData = exclude(data, ['id']);
      acc.ids = [...acc.ids, id];
      if (!isEmpty(filteredData)) {
        acc.payload = [...acc.payload, filteredData];
      }
      return acc;
    },
    { ids: [], payload: [] },
  );

  return filteredPayload;
};
