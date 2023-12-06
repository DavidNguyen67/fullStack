interface DatabaseConfig {
  host: string;
  port: number;
}
interface EnvironmentVariables {
  PORT: number;
  TIMEOUT: string;
}

export { DatabaseConfig, EnvironmentVariables };
