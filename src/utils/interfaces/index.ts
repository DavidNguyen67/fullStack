import { UpdateUserDto } from '../dto/User.dto';

export interface DatabaseConfig {
  host: string;
  port: number;
}
export interface EnvironmentVariables {
  PORT: number;
  TIMEOUT: string;
}
export interface LoginInterface {
  username: string;
  password: string;
}
export interface FetchUserInterface {
  id: string | string[];
}
export interface FetchDoctorInterface {
  limit: string | number;
}
export interface FetchAllCodeInterface {
  type?: string;
}
export interface DeleteUserInterface extends FetchUserInterface {}

export interface UpdateUsersInterface extends FetchUserInterface {}

export interface FetchUsersResponseInterface extends UpdateUserDto {}
