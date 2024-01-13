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

// Auto return the biggest number if value is a string[]
export const getMaxElement = (value: string[]): number => {
  return +value.reduce((min, c) => (c < min ? c : min));
};

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

export const hasNumber = (myString: string): boolean => {
  return /\d/.test(myString);
};

// Function to calculate the time difference between two ISO timestamps
export const getRangeTimeISO = (isoTime1, isoTime2) => {
  // Convert to milliseconds and calculate the difference
  const difference = Math.abs(isoTime1 - isoTime2);

  return difference / 1000;
};

// Usage of the function
