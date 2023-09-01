"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("@sern/handler");
exports.default = (0, handler_1.commandModule)({
    type: handler_1.CommandType.Slash,
    plugins: [],
    description: 'A ping command',
    //alias : [],
    execute: async (ctx, args) => {
        let msg = await ctx.reply({ content: "Ładowanie..." });
        msg.edit(`🏓Pong: Ping wynosi ${msg.createdTimestamp - ctx.createdTimestamp}ms. Ping do api wynosi ${Math.round(ctx.client.ws.ping)}ms`);
    },
});
