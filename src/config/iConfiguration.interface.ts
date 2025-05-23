export interface IConfiguration {
  jwt: IJwtConfiguration;
  database: IDatabaseConfiguration;
}

export interface IJwtConfiguration {
  readonly secret: string;
  readonly expiresIn: string;
  readonly ignoreExpiration: boolean;
}
export interface IDatabaseConfiguration {
  readonly type: 'mysql';
  readonly host: string;
  readonly port: number;
  readonly username: string;
  readonly password: string;
  readonly database: string;
  readonly synchronize: boolean;
}

export interface IAssetsConfiguration {
  readonly rootPath: string;
  readonly assetsPath: string;
  readonly uploadsPath: string;
}
