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
export interface DeleteUserInterface extends FetchUserInterface {}
