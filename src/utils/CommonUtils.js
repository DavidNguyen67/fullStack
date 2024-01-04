class CommonUtils {
  static isNumber1(number) {
    if (number === 1) return true;
    return false;
  }
  static async getBase64(file) {
    if (!(file instanceof Blob)) {
      return console.log('Invalid file type');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
    });
  }

  static async fileToBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  }

  static toBase64 = async (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  static async readFileDataAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(file);
    });
  }
  static removeImagePrefix(base64String) {
    const regex = /^data:image\/(jpeg|jpg|gif|png|webp|bmp);base64,/;
    return base64String.replace(regex, '');
  }
}

export default CommonUtils;
