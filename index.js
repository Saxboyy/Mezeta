const { Client, GatewayIntentBits, Intents } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.guilds.cache.forEach((guild) => {
    guild.commands.create({
      name: 'restart',
      description: 'Reinicia el servidor.',
    });
  });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'restart') {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return await interaction.reply('No tienes permiso para ejecutar este comando.');
    }

    await interaction.deferReply();

    const { exec } = require('child_process');
    exec('sudo ./restart', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error al ejecutar el comando de reinicio: ${error}`);
        return interaction.followUp('Hubo un error al reiniciar el servidor.');
      }

      console.log(`Comando de reinicio exitoso.`);
      interaction.followUp('El servidor se ha reiniciado correctamente.');
    });
  }
});

client.login(process.env.TOKEN);