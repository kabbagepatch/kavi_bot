;import axios from 'axios'
import tmi, { Client } from 'tmi.js';

import { TwitchTokenDetails } from './models/twitchTokenDetails.models';
import { ChatBotConfig } from './config/model';
import { TwitchTokenResponseValidator } from './utils/TwitchTokenResponseValidator';

import agents from './agents.json';

const agentsDone : { [key: string] : { agent : string, time : number } } = {};
export class TwitchChatBot {
  public twitchClient!: Client;
  private tokenDetails!: TwitchTokenDetails | { 'access_token': string };

  constructor(private config: ChatBotConfig) { }

  async launch() {
    this.tokenDetails = await this.fetchAccessToken(this.config.token);
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

  private async fetchAccessToken(existingToken : string): Promise<TwitchTokenDetails | { 'access_token': string }> {
    if (existingToken) {
      return { access_token: existingToken };
    }
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
    return {
      options: { debug: false },
      connection: {
        secure: true,
        reconnect: true
      },
      identity: {
        username: `${username}`,
        password: `oauth:${accessToken}`
      },
      channels: ['kavisherlock', channel],
    };
  }

  private setupBotBehavior() {
    this.twitchClient.on('message', (channel, tags, message, self) => {
      if (self) return;

      const username = tags.username ?? 'blank';

      const isMod = tags.mod || tags.badges?.broadcaster;
      if (message.startsWith('!')) {
        console.info({ channel, username, message })
        switch (message) {
          case '!test': this.twitchClient.say(channel, `bumble194Omg heyyyy`); break;

          case '!welcome': this.twitchClient.say(channel, `bumble194Omg so many cuties in chat. welcome to bwi stream`); break;

          case '!hello': this.twitchClient.say(channel, `Hello, @${username}! Welcome to the channel.`); break;

          case '!frooty': this.twitchClient.say(channel, `Things are a bit fruity around here 🌈 bumble194Uwu`); break;

          case '!ore': this.twitchClient.say(channel, `Ore what?`); break;

          case '!slay': this.twitchClient.say(channel, `slay 💅`); break;

          case '!tin': this.twitchClient.say(channel, `Like the metal 🎸🤘🔥`); break;

          case '!reading': 
            if (username === 'kavisherlock') {
              this.twitchClient.say(channel, `I'm currently reading Oathbringer by Brandon Sanderson :book: and listening to The Two Towers by J. R. R. Tolkien :headphones:`)
            }
            break;

          case '!agent':
            if (username in agentsDone && isWithinLast12Hours(agentsDone[username].time)) {
              this.twitchClient.say(channel, `@${tags.username} You already found your agent for today, ${agentsDone[username].agent}`);
              return;
            }

            this.twitchClient.say(channel, `Let's find out which valorant agent you are, @${tags.username}`);
            const agentNames = Object.keys(agents);
            const randomAgent = agentNames[Math.floor(Math.random() * agentNames.length)];
            const lines : string[] = agents[randomAgent];
            const randomLine = lines[Math.floor(Math.random() * lines.length)];
            agentsDone[username] = { agent: randomAgent, time: Date.now() };
            setTimeout(() => {
              this.twitchClient.say(channel, `/me thinking`);
            }, 2000);
            setTimeout(() => {
              this.twitchClient.say(channel, `@${tags.username} You are ${randomAgent}. ${randomLine}`);
            }, 6000);
            break;

          case '!randomso':
            if (!isMod) {
              if (username === 'AlwaysKorean') this.twitchClient.say(channel, `Nice try Roan :]`);
              else this.twitchClient.say(channel, `Only moderators can use this command :]`);
              return;
            }
            const peeps = [
              'kavisherlock',
              'PositiveNoodles',
              'merudesu',
              'hollu_uwu',
              'willowvvitch',
              'guffball',
              'eggrollls',
              'Candyfirr',
              'julesvernnn',
              'joylliibee',
              'katkashiii',
              'GamingLeagueOfWomen',
              'cheebiez',
              'cheebiez',
              'cheebiez',
              'bundledbri',
              'bundledbri',
              'bundledbri',
              'crymsonfire',
              'crymsonfire',
              'crymsonfire',
              'TeekayVT',
              'megghan_',
              'AlwaysKorean',
              'JellyNugget',
              'Naynay_rivers',
              'KiharaAmber',
              'Woohoojin',
              'caseoh_',
            ];
            this.twitchClient.say(channel, `So many lovely peeps, who do we shoutout...`);
            setTimeout(() => {
              this.twitchClient.say(channel, `/me thinking`);
            }, 3000);
            setTimeout(() => {
              this.twitchClient.say(channel, `!so ${peeps[Math.floor(Math.random() * peeps.length)]}`);
            }, 6000);
        }
      }
    });
  }
}

const isWithinLast12Hours = (timestamp : number) => {
  const now = Date.now();
  const twelveHoursInMs = 12 * 60 * 60 * 1000;
  return now - timestamp <= twelveHoursInMs;
}
