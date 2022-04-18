import { Client } from "discord.js";
import { registerListeners } from "./listeners";
import "./bootstrap";

console.log("Starting bot...");

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

registerListeners(client);
client.login(process.env.TOKEN);
