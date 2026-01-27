import { eventModule, EventType } from '@sern/handler';
import { GuildQueue } from 'discord-player';
import { SendableChannels } from 'discord.js';
import { autoConnectToHomeChannel } from '../utils.js';

export default eventModule({
	type: EventType.External,
	emitter: 'player',
	name: 'disconnect',
	async execute(queue: GuildQueue) {
		const channel = queue.metadata as SendableChannels;

		await channel.send(
			"Disconnected from the voice channel, clearin' the queue! ❌"
		);
		autoConnectToHomeChannel();
	},
});
