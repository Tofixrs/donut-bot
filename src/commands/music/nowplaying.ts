import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';
import { repeatModeToString, trackToEmbed } from '../../utils.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: "Shows what song is now playin'",
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Nothin' playin' yo");

		const track = queue.currentTrack;
		if (!track) return ctx.reply("Nothin' playin'");

		const progress = queue.node.createProgressBar();
		const embed = trackToEmbed(track);
		const paused = queue.node.isPaused() ? 'Paused' : '';
		embed.setDescription(
			`${paused} 
            Volume: ${queue.node.volume} 
            Loop mode: ${repeatModeToString(queue.repeatMode)}
            Requested by: ${track.requestedBy}
            ${progress}`
		);

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

		return await ctx.reply({ embeds: [embed], components: [row] });
	},
});
