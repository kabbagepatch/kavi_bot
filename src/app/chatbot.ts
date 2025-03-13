;import axios from 'axios'
import tmi from 'tmi.js';

import { TwitchTokenDetails } from './models/twitchTokenDetails.models';
import { ChatBotConfig } from './config/model';
import { TwitchTokenResponseValidator } from './utils/TwitchTokenResponseValidator';

export class TwitchChatBot {
  public twitchClient: any;
  private tokenDetails!: TwitchTokenDetails;

  constructor(private config: ChatBotConfig) { }

  async launch() {
    this.tokenDetails = await this.fetchAccessToken();
    this.twitchClient = new tmi.Client(
      this.buildConnectionConfig(
        this.config.channel,
        this.config.username,
        this.tokenDetails.access_token
      )
    );
    this.setupBotBehavior();
    this.twitchClient.connect();
  }

  private async fetchAccessToken(): Promise<TwitchTokenDetails> {
    console.log('Fetching Twitch OAuth Token');
    try {
      const response = await axios.post(
        this.config.tokenEndpoint,
        {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code: this.config.authorizationCode,
          grant_type: 'authorization_code',
          redirect_url: 'http://localhost/',
          redirect_uri: 'http://localhost/',
        },
        { responseType: 'json'},
      );

      return await TwitchTokenResponseValidator.parseResponse(response.data);
    } catch(error : any) {
      console.log('Failed to get Twitch OAuth Token');
      console.log(error.data.message);
      throw error;
    }
  }

  private buildConnectionConfig(channel: string, username: string, accessToken: string) {
    console.log({ channel, username });
    return {
      options: { debug: true },
      connection: {
        secure: true,
        reconnect: true
      },
      identity: {
        username: `${username}`,
        password: `oauth:${accessToken}`
      },
      channels: [`${channel}`]
    };
  }

  private setupBotBehavior() {
    this.twitchClient.on('message', (channel: any, tags: any, message: any, self: any) => {
      let helloCommand = "!hello"

      if (self) return;

      if (message.startsWith('!') && message === helloCommand) {
        this.sayHelloToUser(channel,tags);
      }
    });
  }

  private sayHelloToUser(channel: any, tags: any) {
    this.twitchClient.say(channel, `Hello, @${tags.username}! Welcome to the channel.`);
  }
}
