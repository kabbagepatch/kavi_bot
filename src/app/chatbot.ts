;import axios from 'axios'
import tmi, { Client } from 'tmi.js';

import { TwitchTokenDetails } from './models/twitchTokenDetails.models';
import { ChatBotConfig } from './config/model';
import { TwitchTokenResponseValidator } from './utils/TwitchTokenResponseValidator';

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
      options: { debug: true },
      connection: {
        secure: true,
        reconnect: true
      },
      identity: {
        username: `${username}`,
        password: `oauth:${accessToken}`
      },
      channels: [channel],
    };
  }

  private setupBotBehavior() {
    this.twitchClient.on('message', (channel, tags, message, self) => {
      let testCommand = "!test"
      let welcomeCommand = "!welcome"
      let helloCommand = "!hello"
      let fruityCommand = "!frooty"
      let oreCommand = "!ore"
      let slayCommand = "!slay"
      let randomsoCommand = "!randomso"
      let agentCommand = "!agent"
      
      const isMod = tags.mod || tags.badges?.broadcaster;

      if (self) return;

      if (message.startsWith('!')) {
        if (message === testCommand) {
          this.twitchClient.say(channel, `bumble194Omg heyyyy`);
        }

        if (message === welcomeCommand) {
          this.twitchClient.say(channel, `bumble194Omg so many cuties in chat. welcome to bwi stream`);
        }

        if (message === helloCommand) {
          this.twitchClient.say(channel, `Hello, @${tags.username}! Welcome to the channel.`);
        }

        if (message === fruityCommand) {
          this.twitchClient.say(channel, `Things are a bit fruity around here 🌈 bumble194Uwu`);
        }

        if (message === oreCommand) {
          this.twitchClient.say(channel, `Ore what?`);
        }

        if (message === slayCommand) {
          this.twitchClient.say(channel, `slay`);
        }

        if (message === agentCommand) {
          this.twitchClient.say(channel, `Let's find ouy which valorant agent you are, @${tags.username}`);
          const agents = {
            'Brimstone': 'Trying to stim beacon to an early retirement. Boomer 👴',
            'Phoenix': 'Enemies flashed 1. Allies flashed 4. Suuuper high level tactics 🔥',
            'Sage': 'Please heal us Mommy Sage 🤰',
            'Sova': 'Idk, go research your lineups, nerd 🏹',
            'Viper': 'Come 😏',
            'Cypher': 'Hidden in a minivan, eyes on everyone, looking for a corpse. Kinda creepy ngl 📹',
            'Reyna': 'Except you\'re not. Only Bwi is Queen Reyna 👑',
            'Killjoy': 'Ultra nerd. Give us your lunch money 🤓',
            'Breach': 'Is there an enemy around that corner? Quick, throw all your util! 💥',
            'Omen': 'Clear your throat please 👻',
            'Jett': 'Super sweaty, mega toxic, instalock, never entry, cringe, unbased 💨',
            'Raze': 'It\'s lit 🪩🎧',
            'Skye': 'Can I workout with you? 🏋️‍♀️',
            'Yoru': 'Or are you the clone. Would you even know? 👯‍♂️',
            'Astra': 'More like Asssstra 🍑',
            'Kay/o': 'Toaster! I\'m a better bot anyway 🤖',
            'Chamber': 'Ew 💩',
            'Neon': 'Run. Slide. Get nerfed 🏃‍♀️',
            'Fade': 'Your life is cats, coffees and nightmares 🐈‍⬛☕',
            'Harbor': 'It\'s Harbin\' time. Everyone is about to get soaked 🌊',
            'Gekko': 'Pokemon trainer 🐁🐟🐦',
            'Deadlock': 'Be friends with Wingman already. He just wants to help',
            'Iso': 'Big man in a suit of armour. Take that off, what are you? 🛡️',
            'Clove': 'Just here to vibe 🦋🎶',
            'Vyse': 'Where do you get your nails done? Slay 💅',
            'Tejo': 'Pedro Pascal coded 🧔',
            'Waylay': 'The new gal in town 💕',
          }
          const agentNames = Object.keys(agents);
          const random = Math.floor(Math.random() * agentNames.length);
          const randomAgent = agentNames[random];
          setTimeout(() => {
            this.twitchClient.say(channel, `/me thinking`);
          }, 3000);
          setTimeout(() => {
            this.twitchClient.say(channel, `@${tags.username} You are ${randomAgent}. ${agents[randomAgent]}`);
          }, 6000);
        }

        if (message === randomsoCommand) {
          if (!isMod) {
            if (tags['display-name'] === 'AlwaysKorean') this.twitchClient.say(channel, `Nice try Roan :]`);
            return;
          }
          const peeps = [
            'PositiveNoodles',
            'merudesu',
            'hollu_uwu',
            'eggrollls',
            'julesvernnn',
            'joylliibee',
            'cheebiez',
            'bundledbri',
            'katkashiii',
            'guffball',
            'crymsonfire',
            'AlwaysKorean',
            'Naynay_rivers',
            'TeekayVT',
            'KiharaAmber',
            'Candyfirr',
          ]
          const random = Math.floor(Math.random() * peeps.length);
          this.twitchClient.say(channel, `So many lovely peeps, who do we shoutout...`);
          setTimeout(() => {
            this.twitchClient.say(channel, `/me thinking`);
          }, 3000);
          setTimeout(() => {
            this.twitchClient.say(channel, `!so ${peeps[random]}`);
          }, 6000);
        }
      }
    });
  }
}
