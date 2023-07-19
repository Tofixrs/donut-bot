import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";

export default eventModule({
  type: EventType.Discord,
  plugins : [], 
  name: 'ready', 
  execute(client: Client) {
      console.log(`Logged in as ${client.user?.tag}`)
  }
})