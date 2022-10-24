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

interface IConfig {
  APP: {
    PORT: number;
  };
  sender: ISender;
  users: IUser[];
}

export { IConfig, ISender, IUser };
