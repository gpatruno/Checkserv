// Définition des interfaces

interface IMail {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
}

interface IUser {
  name?: string;
  email: string;
}

interface ISender {
  EMAIL: string;
  EMAIL_PASSWORD: string;
  HOST: string;
  PORT_EMAIL: number;
}

interface IServer {
  name: string;
  host: string;
  port?: number;
  defaultstate?: boolean,
  services?: IService[]
}

interface IService {
  name: string;
  port: number;
  defaultstate?: boolean,
}

interface IApp {
  CLEAR_LOG: boolean,
  CUSTOM_CRON: string,
  SHORT_CRON: boolean,
  LONG_CRON: boolean,
  LANGUAGE: string
}

export { IApp, ISender, IUser, IServer, IService, IMail };
