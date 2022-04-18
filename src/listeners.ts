import {
  joinVoiceChannel,
  createAudioResource,
  DiscordGatewayAdapterCreator,
  AudioPlayerStatus,
  createAudioPlayer,
} from "@discordjs/voice";
import { Client } from "discord.js";

const LINES = new Map<number, string>([
  [
    1,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/01-yes.mp3",
  ],
  [
    2,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/02-no.mp3",
  ],
  [
    3,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/03-food-please.mp3",
  ],
  [
    4,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/04-wood-please.mp3",
  ],
  [
    5,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/05-gold-please.mp3",
  ],
  [
    6,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/06-stone-please.mp3",
  ],
  [
    7,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/07-ahh.mp3",
  ],
  [
    8,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/08-all-hail.mp3",
  ],
  [
    9,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/09-oooh.mp3",
  ],
  [
    10,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/10-back-to-age-1.mp3",
  ],
  [
    11,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/11-herb-laugh.mp3",
  ],
  [
    12,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/12-being-rushed.mp3",
  ],
  [
    13,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/13-blame-your-isp.mp3",
  ],
  [
    14,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/14-start-the-game.mp3",
  ],
  [
    15,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/15-dont-point-that-thing.mp3",
  ],
  [
    16,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/16-enemy-sighted.mp3",
  ],
  [
    17,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/17-it-is-good.mp3",
  ],
  [
    18,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/18-i-need-a-monk.mp3",
  ],
  [
    19,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/19-long-time-no-siege.mp3",
  ],
  [
    20,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/20-my-granny.mp3",
  ],
  [
    21,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/21-nice-town-ill-take-it.mp3",
  ],
  [
    22,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/22-quit-touchin.mp3",
  ],
  [
    23,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/23-raiding-party.mp3",
  ],
  [
    24,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/24-dadgum.mp3",
  ],
  [
    25,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/25-smite-me.mp3",
  ],
  [
    26,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/26-the-wonder.mp3",
  ],
  [
    27,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/27-you-play-2-hours.mp3",
  ],
  [
    28,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/28-you-should-see-the-other-guy.mp3",
  ],
  [
    29,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/29-roggan.mp3",
  ],
  [
    30,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/30-wololo.mp3",
  ],
  [
    31,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/31-attack-an-enemy-now.mp3",
  ],
  [
    32,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/32-cease-creating-extra-villagers.mp3",
  ],
  [
    33,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/33-create-extra-villagers.mp3",
  ],
  [
    34,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/34-build-a-navy.mp3",
  ],
  [
    35,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/35-stop-building-a-navy.mp3",
  ],
  [
    36,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/36-wait-for-my-signal-to-attack.mp3",
  ],
  [
    37,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/37-build-a-wonder.mp3",
  ],
  [
    38,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/38-give-me-your-extra-resources.mp3",
  ],
  [
    39,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/39-ally.mp3",
  ],
  [
    40,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/40-enemy.mp3",
  ],
  [
    41,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/41-neutral.mp3",
  ],
  [
    42,
    "http://www.losconquistadoresespanoles.es/wp-content/uploads/2019/09/42-what-age-are-you-in.mp3",
  ],
]);

export const registerListeners = (client: Client) => {
  client.once("ready", (c) => {
    if (!c.user || !c.application) return;
    console.log(`${c.user.username} is online`);
  });
  client.on("messageCreate", async (msg) => {
    if (msg.author.bot) return;
    const numberSent = parseInt(msg.content);
    if (
      String(numberSent) !== msg.content ||
      !Number.isInteger(numberSent) ||
      numberSent < 1 ||
      numberSent > 42
    )
      return;
    if (!msg.member?.voice.channel || !msg.guild) return;
    const link = LINES.get(numberSent);
    if (!link) return;
    const channel = msg.member.voice.channel;
    const player = createAudioPlayer();
    const resource = createAudioResource(link);

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild
        .voiceAdapterCreator as DiscordGatewayAdapterCreator,
    });
    player.play(resource);
    connection.subscribe(player);
    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });
  });
};
