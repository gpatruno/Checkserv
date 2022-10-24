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
  name?: string;
  host: string;
  port?: number;
}

interface IConfig {
  APP: {
    PORT: number;
  };
  sender: ISender;
  user: IUser[];
  server: IServer[];
}

export { IConfig, ISender, IUser, IServer };
