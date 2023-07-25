import { commandModule, CommandType } from '@sern/handler';
import type { Song } from '@jadestudios/discord-music-player';
import { EmbedBuilder } from 'discord.js';
import type DonutClient from '../client';
import { Paginator } from '../modules/pagination';
import { publish } from '../plugins/publish';

export default commandModule({
	type: CommandType.Slash,
	plugins: [publish()],
	description: 'Displays songs in queue',
	execute: async (ctx) => {
		const client = ctx.client as DonutClient;
		const guildQueue = client.player?.getQueue(ctx.guildId);

		if (!guildQueue) {
			ctx.reply('No queue');
			return;
		}

		let embeds = [];
		let pages = [];
		let line = 0;
		let tmp = '';
		console.log(guildQueue?.songs);
		for (let song of guildQueue?.songs as Song[]) {
			tmp += `${song.name} [${song.duration}] requested by ${song.requestedBy?.username}\n`;
			line += 1;
			if (line != 10 && (guildQueue?.songs.length as number) > 9) continue;

			pages.push(tmp);
			tmp = '';
			line = 0;
		}

		for (let i = 0; i < pages.length; i++) {
			const embed = new EmbedBuilder()
				.setTitle(`Queue ${i}/${pages.length}`)
				.setColor('Blue')
				.setDescription(pages[i]);
			embeds.push(embed);
		}

		new Paginator({ embeds: embeds }).run(ctx.interaction, ctx.user);
	},
});
