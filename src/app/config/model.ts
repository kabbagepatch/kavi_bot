
import { IsNotEmpty, IsString } from 'class-validator';

export class ChatBotConfig {
  @IsNotEmpty()
  @IsString()
  public tokenEndpoint: string;

  @IsNotEmpty()
  @IsString()
  public username: string;

  @IsNotEmpty()
  @IsString()
  public clientId: string;

  @IsNotEmpty()
  @IsString()
  public clientSecret: string;

  @IsNotEmpty()
  @IsString()
  public authorizationCode: string;

  @IsNotEmpty()
  @IsString()
  public channel: string;

  constructor(
    tokenEndpoint: string,
    username: string,
    clientId: string,
    clientSecret: string,
    authorizationCode: string,
    channel: string
  ) {
    this.tokenEndpoint = tokenEndpoint;
    this.username = username;
    this.clientSecret = clientSecret;
    this.channel = channel;
    this.clientId = clientId;
    this.authorizationCode = authorizationCode;
  }
}