import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string | boolean> => {
  const saltRounds = 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default hashPassword;
