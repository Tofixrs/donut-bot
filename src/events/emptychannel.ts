import { eventModule, EventType } from '@sern/handler';
import { autoConnectToHomeChannel } from '../utils.js';
import { GuildQueue } from 'discord-player';
import { SendableChannels } from 'discord.js';

export default eventModule({
	type: EventType.External,
	emitter: 'player',
	name: 'emptyChannel',
	async execute(queue: GuildQueue) {
		const channel = queue.metadata as SendableChannels;
		await autoConnectToHomeChannel();

		await channel.send(
			"Disconnected from the voice channel, clearin' the queue! ❌"
		);
	},
});
