export interface DatabaseConfig {
  host: string;
  port: number;
}
export interface EnvironmentVariables {
  PORT: number;
  TIMEOUT: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}
