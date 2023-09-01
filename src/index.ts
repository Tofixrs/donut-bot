import { Client, GatewayIntentBits } from 'discord.js';
import { Sern, single, makeDependencies } from '@sern/handler';
require('dotenv').config()

/**
 * Where all of your dependencies are composed.
 * '@sern/client' is usually your Discord Client.
 * View documentation for pluggable dependencies
 * Configure your dependency root to your liking.
 * It follows the npm package iti https://itijs.org/.
 * Use this function to access all of your dependencies.
 * This is used for external event modules as well
 */

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
	],
});



async function init() {
	await makeDependencies({
		build: (root) => root.add({ '@sern/client': single(() => client) }),
	});

	//View docs for all options
	Sern.init({
		commands: 'dist/commands',
		events: 'dist/events', //(optional)
	});
}

init().then(() => client.login(process.env.TOKEN))
