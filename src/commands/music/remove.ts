import { commandModule, CommandType } from '@sern/handler';
import { useQueue } from 'discord-player';
import { ApplicationCommandOptionType } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Убрать трек из очереди',
	options: [
		{
			name: 'Трек',
			description: 'Ссылка или название трека который будет удалён',
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'Позиция',
			description: 'Позиция трека который будет удалён',
			type: ApplicationCommandOptionType.Integer,
			min_value: 2,
		},
	],
	async execute(ctx) {
		const queue = useQueue(ctx.guild!);
		if (!queue?.isPlaying()) return await ctx.reply("Очередь пуста!");

		const song = ctx.options.getString('Трек');
		const pos = ctx.options.getInteger('Позиция');
		let trackName = '';

		if (!pos && !song) return await ctx.reply('Недостаточно аргументов!');
		if (pos) {
			const index = pos - 2;
			const name = queue.tracks.toArray()[index]?.title;
			if (!name) return ctx.reply("Трека на дааной позиции не существует!");

			trackName = name;
			queue.removeTrack(index);
		} else if (song) {
			const toRemove = queue.tracks
				.toArray()
				.find((e) => e.title == song || e.url == song);
			if (!toRemove) return ctx.reply("Трека с таким инменем или ссылкой не существует!");

			trackName = toRemove.title;
			queue.removeTrack(toRemove);
		}

		ctx.reply(`Трек ${trackName} убран из очереди`);
	},
});
