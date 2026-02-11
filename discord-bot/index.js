import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on("messageCreate", (message) => {
  // don't let the bot reply to their own messages
  if (message.author.bot) return;

  console.log("Message from channel: ", message.content);

  if (message.content.startsWith("surl")) {
    const url = message.content.split("surl")[1];

    return message.reply({
      content: "Generating Short ID for " + url,
    });
  }

  message.reply({
    content: "Hello from bot",
  });
});

client.on(Events.InteractionCreate, async (interaction) => {
  console.log("interaction: ", interaction);

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
