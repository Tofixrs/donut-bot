import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Yeet a song for the queue',
	options: [
		{
			name: 'song',
			description: 'Url or title of the song you want to yeet',
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'pos',
			description: 'pos of the song you want to yeet',
			type: ApplicationCommandOptionType.Integer,
			min_value: 2,
		},
	],
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Nothin' playin' yo");

		const song = ctx.options.getString('song');
		const pos = ctx.options.getInteger('pos');
		let trackName = '';

		if (!pos && !song) return await ctx.reply('Gotta provide pos or song mate');
		if (pos) {
			const index = pos - 2;
			const name = queue.tracks.toArray()[index]?.title;
			if (!name) return ctx.reply("Yo this shit ain't existin");

			trackName = name;
			queue.removeTrack(index);
		} else if (song) {
			const toRemove = queue.tracks
				.toArray()
				.find((e) => e.title == song || e.url == song);
			if (!toRemove) return ctx.reply("Yo this shit ain't existin");

			trackName = toRemove.title;
			queue.removeTrack(toRemove);
		}

		ctx.reply(`Removed ${trackName}`);
	},
});
