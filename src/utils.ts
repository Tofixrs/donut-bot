import { Service, Context } from "@sern/handler";
import { entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { ButtonInteraction, EmbedBuilder, InteractionReplyOptions, MessagePayload } from "discord.js";
import { QueueRepeatMode, Track, useQueue } from "discord-player";

type HomeChannel = {
	guild: string;
	channel: string;
};

export async function connectToHomeChannel(channel: HomeChannel) {
	const client = Service('@sern/client');
	const logger = Service('@sern/logger');

	const guild = await client.guilds.fetch(channel.guild).catch((e) => {
		logger!.error({ message: `Couldnt find guild: ${e.stack ?? e}` });
		throw e;
	});

	logger!.info({
		message: `voiceAdapterCreator present: ${Boolean(
			(guild as any).voiceAdapterCreator,
		)}`,
	});

	// Optional: fetch channel object to validate type & permissions
	const discordChannel = await guild.channels.fetch(channel.channel).catch((e) => {
		logger!.error({
			message: `Couldnt fetch channel ${channel.channel}: ${e.stack ?? e}`,
		});
		throw e;
	});

	logger!.info({
		message: `channel fetched type=${discordChannel?.type}`,
	});

	const connection = joinVoiceChannel({
		guildId: channel.guild,
		channelId: channel.channel,
		adapterCreator: (guild as any).voiceAdapterCreator,
		selfDeaf: false,
		selfMute: false,
	}) as VoiceConnection;

	connection.on('stateChange', (oldState, newState) => {
		logger!.info({
			message: `VC state ${oldState.status} -> ${newState.status}`,
		});
	});

	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
		logger!.info({ message: 'Voice connection ready' });
		return connection;
	} catch (err) {
		// Log more detail to know why it aborted
		logger!.error({
			message:
				`Couldnt connect (entersState failed): ${err instanceof Error ? err.stack ?? err.message : String(err)} ` +
				`connectionState=${JSON.stringify(connection.state)}`,
		});
		connection.destroy();
		throw err;
	}
}

export async function autoConnectToHomeChannel() {
	await connectToHomeChannel({
		channel: process.env.HOME_CHANNEL!,
		guild: process.env.HOME_GUILD!,
	});
}

export function trackToEmbed(track: Track) {
	const embed = new EmbedBuilder()
		.setTitle(track.title)
		.setAuthor({
			name: track.author,
		})
		.setURL(track.url)
		.setFooter({ text: `Продолжительность: ${track.duration} | ${track.views} просмотров` });
	if (track.thumbnail != "") {
		embed.setImage(track.thumbnail);
	}
	return embed;
}

export type ReplyFunc = (
	payload: string | MessagePayload | InteractionReplyOptions
) => Promise<any>;
export type Ctx = Context | ButtonInteraction;

export async function last(reply: ReplyFunc, ctx: Ctx) {
	const queue = useQueue(ctx.guild!);
	if (!queue?.isPlaying()) return await reply("Очередь пуста!");

	if (!queue.history.previousTrack)
		return await reply("Предыдущие позиции отсутствуют");
	await queue.history.back();

	await reply("Проигрываю последний трек");
}
export async function skip(reply: ReplyFunc, ctx: Ctx) {
	const queue = useQueue(ctx.guild!);
	if (!queue?.isPlaying()) return await reply("Очередь пуста!");
	const success = queue.node.skip();

	if (!success) return await reply('Ошибка при попытке пропуска');

	await reply('Трек пропущен');
}
export async function togglePause(reply: ReplyFunc, ctx: Ctx) {
	const queue = useQueue(ctx.guild!);
	if (!queue?.isPlaying()) return await reply("Очередь пуста!");

	const sucess = queue?.node.setPaused(!queue.node.isPaused());

	if (!sucess) return await reply('Ошибка при переключении паузы');

	if (queue.node.isPaused()) {
		await reply('Пауза - ВКЛ.');
	} else {
		await reply('Пауза - ВЫКЛ.');
	}
}

export function repeatModeToString(repeatMode: QueueRepeatMode) {
	switch (repeatMode) {
		case QueueRepeatMode.AUTOPLAY: {
			return 'Автовоспроизведение';
		}
		case QueueRepeatMode.OFF: {
			return 'ВЫКЛ.';
		}
		case QueueRepeatMode.QUEUE: {
			return 'Повтор всей очереди';
		}
		case QueueRepeatMode.TRACK: {
			return 'Повтор трека';
		}
	}
}

export async function loop(
	reply: ReplyFunc,
	ctx: Ctx,
	repeatMode?: QueueRepeatMode
) {
	const sendStatus = (repeatMode: QueueRepeatMode) =>
		reply(`Выбран режим повтора: ${repeatModeToString(repeatMode)}`);
	const queue = useQueue(ctx.guild!);
	if (!queue?.isPlaying()) return await reply("Очередь пуста!");

	if (repeatMode) {
		queue.setRepeatMode(repeatMode);
		await sendStatus(repeatMode);
		return;
	}
	switch (queue.repeatMode) {
		case QueueRepeatMode.OFF: {
			queue.setRepeatMode(QueueRepeatMode.QUEUE);
			await sendStatus(QueueRepeatMode.QUEUE);
			break;
		}
		case QueueRepeatMode.QUEUE: {
			queue.setRepeatMode(QueueRepeatMode.TRACK);
			await sendStatus(QueueRepeatMode.TRACK);
			break;
		}
		case QueueRepeatMode.TRACK: {
			queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
			await sendStatus(QueueRepeatMode.AUTOPLAY);
			break;
		}
		case QueueRepeatMode.AUTOPLAY: {
			queue.setRepeatMode(QueueRepeatMode.OFF);
			await sendStatus(QueueRepeatMode.OFF);
			break;
		}
	}
}

