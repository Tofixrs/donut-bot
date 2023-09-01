"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionsTransformer = exports.publish = exports.CommandTypeRaw = void 0;
// @ts-nocheck
/**
 * This is publish plugin, it allows you to publish your application commands using the discord.js library with ease.
 *
 * @author @EvolutionX-10 [<@697795666373640213>]
 * @version 2.0.0
 * @example
 * ```ts
 * import { publish } from "../plugins/publish";
 * import { commandModule } from "@sern/handler";
 * export default commandModule({
 *  plugins: [ publish() ], // put an object containing permissions, ids for guild commands, boolean for dmPermission
 *  // plugins: [ publish({ guildIds: ['guildId'], defaultMemberPermissions: 'Administrator'})]
 *  execute: (ctx) => {
 * 		//your code here
 *  }
 * })
 * ```
 */
const handler_1 = require("@sern/handler");
const discord_js_1 = require("discord.js");
exports.CommandTypeRaw = {
    [handler_1.CommandType.Both]: discord_js_1.ApplicationCommandType.ChatInput,
    [handler_1.CommandType.CtxUser]: discord_js_1.ApplicationCommandType.User,
    [handler_1.CommandType.CtxMsg]: discord_js_1.ApplicationCommandType.Message,
    [handler_1.CommandType.Slash]: discord_js_1.ApplicationCommandType.ChatInput,
};
function publish(options) {
    return (0, handler_1.CommandInitPlugin)(async ({ module }) => {
        // Users need to provide their own useContainer function.
        let client;
        try {
            client = (await Promise.resolve().then(() => __importStar(require('@sern/handler')))).Service('@sern/client');
        }
        catch {
            const { useContainer } = await Promise.resolve().then(() => __importStar(require('../index.js')));
            client = useContainer("@sern/client")[0];
        }
        const defaultOptions = {
            guildIds: [],
            dmPermission: undefined,
            defaultMemberPermissions: null,
        };
        options = { ...defaultOptions, ...options };
        let { defaultMemberPermissions, dmPermission, guildIds } = options;
        function c(e) {
            console.error("publish command didnt work for", module.name);
            console.error(e);
        }
        const log = (...message) => () => console.log(...message);
        const logged = (...message) => log(message);
        /**
         * a local function that returns either one value or the other,
         * depending on {t}'s CommandType. If the commandtype of
         * this module is CommandType.Both or CommandType.Text or CommandType.Slash,
         * return 'is', else return 'els'
         * @param t
         * @returns S | T
         */
        const appCmd = (t) => {
            return (is, els) => ((t & handler_1.CommandType.Both) !== 0 ? is : els);
        };
        const curAppType = exports.CommandTypeRaw[module.type];
        const createCommandData = () => {
            const cmd = appCmd(module.type);
            return {
                name: module.name,
                type: curAppType,
                description: cmd(module.description, ""),
                options: cmd(optionsTransformer(module.options ?? []), []),
                defaultMemberPermissions,
                dmPermission,
            };
        };
        try {
            const commandData = createCommandData();
            if (!guildIds.length) {
                const cmd = (await client.application.commands.fetch()).find((c) => c.name === module.name && c.type === curAppType);
                if (cmd) {
                    if (!cmd.equals(commandData, true)) {
                        logged(`Found differences in global command ${module.name}`);
                        cmd.edit(commandData).then(log(`${module.name} updated with new data successfully!`));
                    }
                    return handler_1.controller.next();
                }
                client
                    .application.commands.create(commandData)
                    .then(log("Command created", module.name))
                    .catch(c);
                return handler_1.controller.next();
            }
            for (const id of guildIds) {
                const guild = await client.guilds.fetch(id).catch(c);
                if (!guild)
                    continue;
                const guildCmd = (await guild.commands.fetch()).find((c) => c.name === module.name && c.type === curAppType);
                if (guildCmd) {
                    if (!guildCmd.equals(commandData, true)) {
                        logged(`Found differences in command ${module.name}`);
                        guildCmd
                            .edit(commandData)
                            .then(log(`${module.name} updated with new data successfully!`))
                            .catch(c);
                        continue;
                    }
                    continue;
                }
                guild.commands
                    .create(commandData)
                    .then(log("Guild Command created", module.name, guild.name))
                    .catch(c);
            }
            return handler_1.controller.next();
        }
        catch (e) {
            logged("Command did not register" + module.name);
            logged(e);
            return handler_1.controller.stop();
        }
    });
}
exports.publish = publish;
function optionsTransformer(ops) {
    return ops.map((el) => {
        switch (el.type) {
            case discord_js_1.ApplicationCommandOptionType.String:
            case discord_js_1.ApplicationCommandOptionType.Number:
            case discord_js_1.ApplicationCommandOptionType.Integer: {
                return el.autocomplete && "command" in el
                    ? (({ command, ...el }) => el)(el)
                    : el;
            }
            default:
                return el;
        }
    });
}
exports.optionsTransformer = optionsTransformer;
