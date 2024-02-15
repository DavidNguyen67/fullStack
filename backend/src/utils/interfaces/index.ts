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
  limit?: string | number;
  id?: string | string[];
}
export interface FetchAllCodeInterface {
  type?: string;
}
export interface DeleteUserInterface extends FetchUserInterface {}

export interface UpdateUsersInterface extends FetchUserInterface {}

export interface FetchUsersResponseInterface extends UpdateUserDto {}
export interface MailService {
  /**
   * @description Send email
   */
  sendMail(content: object): Promise<void>;

  /**
   * @description Send email sandbox
   */
  // sendMailSandBox(content: object): Promise<void>;
}