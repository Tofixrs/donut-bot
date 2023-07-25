import { commandModule, CommandType } from '@sern/handler';
import {
	ApplicationCommandOptionType,
	ChannelType,
	VoiceChannel,
} from 'discord.js';
import type DonutClient from '../client';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Plays playlist',
	options: [
		{
			name: 'channel',
			description: 'The channel to play the music in',
			required: true,
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildVoice],
		},
		{
			name: 'playlist',
			description: 'Url to playlist',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
	async execute(ctx, args) {
		const client = ctx.client as DonutClient;

		const channel = ctx.interaction.options.getChannel('channel', true);
		const url = ctx.interaction.options.getString('playlist', true);

		const guildQueue = client.player?.getQueue(ctx.guildId);
		const queue = client.player?.createQueue(ctx.guildId, {
			data: {
				channel: ctx.channel,
        vc: channel.id,
			},
		});
		await queue?.join(channel as VoiceChannel);

		await ctx.reply('Adding playlist...');

		await queue?.playlist(url).catch(async (err) => {
			await ctx.interaction.followUp(`${err}`);
			if (!guildQueue) queue?.stop();
		});
	},
});
