import { commandModule, CommandType } from '@sern/handler';
import { togglePause } from '../../utils.js';

export default commandModule({
	type: CommandType.Slash,
	description: 'Toggles pause state',
	async execute(ctx) {
		await ctx.interaction.deferReply();
		await togglePause((c) => ctx.interaction.followUp(c), ctx);
	},
});
