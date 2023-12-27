import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import { publish } from "../plugins/publish";
import {
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
} from "@discordjs/voice";

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: "Joins the vc",
	options: [
		{
			name: "channel",
			type: ApplicationCommandOptionType.Channel,
			description: "The channel to join",
			channel_types: [ChannelType.GuildVoice],
			required: true,
		},
	],

	execute: async (ctx) => {
		const connection = joinVoiceChannel({
			guildId: ctx.guild!.id,
			channelId: ctx.interaction.options.getChannel("channel", true).id,
			adapterCreator: ctx.guild!.voiceAdapterCreator,
		});

		connection.on(VoiceConnectionStatus.Disconnected, async (_, __) => {
			try {
				await Promise.race([
					entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
					entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
				]);
				// Seems to be reconnecting to a new channel - ignore disconnect
			} catch (error) {
				// Seems to be a real disconnect which SHOULDN'T be recovered from
				connection.destroy();
			}
		});

		ctx.interaction.reply({ content: "Joined successfully", ephemeral: true });
	},
});
