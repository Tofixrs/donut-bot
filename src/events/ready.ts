import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";
import DonutClient from "../client";

export default eventModule({
  type: EventType.Discord,
  plugins : [], 
  name: 'ready', 
  execute(client: Client) {
    let donutClient = client as DonutClient;
    donutClient.connectToHomeChannel();
  }
})
