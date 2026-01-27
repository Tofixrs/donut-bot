import { eventModule, EventType } from "@sern/handler";
import { autoConnectToHomeChannel } from "../utils.js";

export default eventModule({
	type: EventType.Discord,
	name: "clientReady",
	async execute(...args) {
		await autoConnectToHomeChannel();
	}
});
