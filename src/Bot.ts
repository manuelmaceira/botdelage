import { Client } from "discord.js";
import { registerListeners } from "./listeners";
import "./bootstrap";

console.log("Starting bot...");

const client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "GuildVoiceStates",
    "MessageContent",
  ],
});

if (!process.env.REPO) throw new Error("Sound repo not found!");

registerListeners(client, process.env.REPO);
client.login(process.env.TOKEN);
