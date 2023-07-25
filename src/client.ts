import type { Player } from '@jadestudios/discord-music-player';
import { Client, ClientOptions } from 'discord.js';

export default class DonutClient extends Client {
	public player: Player | undefined;
	constructor(options: ClientOptions) {
		super(options);
	}
}
