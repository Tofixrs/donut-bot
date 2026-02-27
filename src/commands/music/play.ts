import { commandModule, CommandType } from '@sern/handler';
import { QueryType, useMainPlayer } from 'discord-player';
import { ApplicationCommandOptionType, ChannelType, VoiceChannel } from 'discord.js';

export default commandModule({
	type: CommandType.Slash,
	plugins: [],
	description: 'Проиграть данный трек',
	//alias : [],
	options: [
		{
			name: "query",
			description: "Ссылка",
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: "channel",
			description: "Голосовой канал",
			type: ApplicationCommandOptionType.Channel,
			channel_types: [ChannelType.GuildVoice]
		}
	],
	execute: async (ctx) => {
		const player = useMainPlayer();
		const member = await ctx.guild?.members.fetch({ user: ctx.userId });
		const argChannel = ctx.options.getChannel("channel") as VoiceChannel;

		const channel = !argChannel ? member?.voice.channel : argChannel;

		if (!member) return;
		if (!channel) return ctx.reply("Вы должны указать голосовой канал или находиться в нём!");
		await ctx.interaction.deferReply();

		const query = ctx.options.getString('query', true);

		const res = await player.search(query, {
			requestedBy: member,
			searchEngine: QueryType.AUTO,
		});

		if (!res.tracks.length) return ctx.interaction.followUp(`Трек не найден!`);
		try {
			const botMemeber = await ctx.guild!.members.fetch(ctx.client.user!.id);
			if (botMemeber.voice.channel) {
				await botMemeber.voice.disconnect();
			}
			const { track } = await player.play(channel, query, {
				nodeOptions: {
					metadata: ctx.channel,
				},
				searchEngine: QueryType.AUTO,
			});

			await ctx.interaction.followUp({
				content: `Трек **${track.title}** добавлен в очередь`,
			});
		} catch (e) {
			await ctx.interaction.followUp(`Капитан! Всё пошло по жопе! ${e}`);
		}
	},
});
