"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const handler_1 = require("@sern/handler");
require('dotenv').config();
/**
 * Where all of your dependencies are composed.
 * '@sern/client' is usually your Discord Client.
 * View documentation for pluggable dependencies
 * Configure your dependency root to your liking.
 * It follows the npm package iti https://itijs.org/.
 * Use this function to access all of your dependencies.
 * This is used for external event modules as well
 */
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates
    ],
});
async function init() {
    await (0, handler_1.makeDependencies)({
        build: (root) => root.add({ '@sern/client': (0, handler_1.single)(() => client) }),
    });
    //View docs for all options
    handler_1.Sern.init({
        commands: 'dist/commands',
        events: 'dist/events', //(optional)
    });
}
init().then(() => client.login(process.env.TOKEN));
