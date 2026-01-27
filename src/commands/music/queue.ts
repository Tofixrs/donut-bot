import { Pagination } from '@acegoal07/discordjs-pagination';
import { commandModule, CommandType, Service } from '@sern/handler';
import { Track, useQueue } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Display songs in queue',
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Nothin' playin' yo");

		const tracks = [queue.currentTrack].concat(queue.tracks.toArray());
		const tracksSplitForPages = tracks.reduce((r, e, i) => {
			if (!r[Math.floor(i / 5)]) r[Math.floor(i / 5)] = [];
			r[Math.floor(i / 5)].push(e!);
			return r;
		}, [] as Track[][]);

		const trackPages = tracksSplitForPages.map((e, index) => {
			const desc = e
				.map(
					(t, i) =>
						` ${i + 5 * index + 1}: [${t.title} by ${t.author}](${t.url}) | ${t.duration
						} Views: ${t.views}`
				)
				.join('\n');

			return new EmbedBuilder()
				.setTitle('Queue')
				.setDescription(desc)
				.setFooter({
					text: `Page: ${index + 1}'/${tracksSplitForPages.length}`,
				});
		});
		new Pagination()
			.setPageList(trackPages)
			.enableSelectMenu()
			.setPortal(ctx.interaction)
			.paginate();
	},
});
