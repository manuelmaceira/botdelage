import { Client } from "discord.js";
import { registerListeners } from "./listeners";
import "./bootstrap";

console.log("Starting bot...");

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

if (!process.env.REPO) throw new Error("Sound repo not found!");

registerListeners(client, process.env.REPO);
client.login(process.env.TOKEN);
