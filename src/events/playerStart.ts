import { eventModule, EventType } from '@sern/handler';
import { GuildQueue, Track } from 'discord-player';
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SendableChannels
} from 'discord.js';
import { trackToEmbed } from '../utils.js';

export default eventModule({
	type: EventType.External,
	emitter: 'player',
	name: 'playerStart',
	execute(queue: GuildQueue, track: Track) {
		const channel = queue.metadata as SendableChannels;

		const last = new ButtonBuilder()
			.setLabel('⏪')
			.setCustomId('last-button')
			.setStyle(ButtonStyle.Primary);
		const togglepause = new ButtonBuilder()
			.setLabel('️⏯️')
			.setCustomId('togglepause-button')
			.setStyle(ButtonStyle.Primary);
		const loop = new ButtonBuilder()
			.setLabel('🔁')
			.setCustomId('loop-button')
			.setStyle(ButtonStyle.Primary);
		const skip = new ButtonBuilder()
			.setLabel('⏩')
			.setCustomId('skip-button')
			.setStyle(ButtonStyle.Primary);
		const row = new ActionRowBuilder().setComponents(
			last,
			togglepause,
			loop,
			skip
		) as ActionRowBuilder<ButtonBuilder>;

		channel.send({
			embeds: [trackToEmbed(track)],
			content: "Playin'...",
			components: [row],
		});
	},
});
