import { EmbedBuilder, GatewayIntentBits, TextBasedChannel, VoiceChannel } from 'discord.js';
import { Sern } from '@sern/handler';
import 'dotenv/config';
import DonutClient from './client';
import { Player } from '@jadestudios/discord-music-player';

const client = new DonutClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.player = new Player(client, {
	leaveOnEmpty: false,
  leaveOnEnd: false,
});

client.player.on('songAdd', (queue, song) => {
	let channel = queue.data.channel as TextBasedChannel;

	const embed = new EmbedBuilder()
		.setTitle(`🎶Playing song: ${song?.name}`)
		.setColor('Blue')
		.setImage(song?.thumbnail as string)
		.setDescription(
			`Duration: ${song?.duration}\n Requested by ${song.requestedBy?.username}`
		);

	channel.send({ embeds: [embed] });
});

client.player.on("queueEnd", async (queue) => {
  const channel = await queue.guild.channels.fetch(queue.data.vc) as VoiceChannel;
  console.log(channel.members.size);
  if (channel.members.size == 1) {
    queue.leave();
    await client.connectToHomeChannel();
  }
  setTimeout(async () => {
    if (queue.songs.length == 0) {
      queue.leave();
      await client.connectToHomeChannel();
    }
  }, 10000 /*2 mins*/);
});

Sern.init({
	client,
	commands: 'dist/commands',
	events: 'dist/events',
});

client.login(process.env.TOKEN);
