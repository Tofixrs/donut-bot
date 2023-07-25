import { entersState, joinVoiceChannel, VoiceConnectionStatus } from '@discordjs/voice';
import type { Player } from '@jadestudios/discord-music-player';
import { Client, ClientOptions } from 'discord.js';

export default class DonutClient extends Client {
	public player: Player | undefined;
  readonly homeChannel = "1017809334299787314";
  readonly donutGuild = "959931438298460190";
  async connectToHomeChannel() {
    const guild = await this.guilds.fetch(this.donutGuild);

    const connection = joinVoiceChannel({
      guildId: guild.id,
      channelId: this.homeChannel,
      adapterCreator: guild.voiceAdapterCreator
    });
  }
	constructor(options: ClientOptions) {
		super(options);
	}
}
