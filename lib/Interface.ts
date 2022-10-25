interface ISender {
  EMAIL: string;
  EMAIL_PASSWORD: string;
  HOST: string;
  PORT_EMAIL: number;
}

interface IUser {
  name?: string;
  email: string;
}

interface IServer {
  name: string;
  host: string;
  port: number;
  method?: string;
}

interface IApp {
  CLEAR_LOG: boolean,
  CUSTOM_CRON: string,
  SHORT_CRON: boolean,
  LONG_CRON: boolean
}

export { IApp, ISender, IUser, IServer };
