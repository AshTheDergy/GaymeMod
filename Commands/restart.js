const { Message } = require("discord.js");
const Gaymer = require("../handlers/Client");

module.exports = {
  name: "restart",
  description: `restart bot`,
  userPermissions: ["SEND_MESSAGES"],
  botPermissions: ["EMBED_LINKS"],
  category: "information",
  cooldown: 1,

  /**
  *
  * @param {Gaymer} client
  * @param {Message} message
  */
  run: async (client, message) => {
    const member = message.guild.members.cache.get(message.author.id);
    if (client.config.whitelisted.some((roleId) => member.roles.cache.has(roleId)) || message.author.id == "817843037593403402") {
        await message.reply(`Brb :3`);
        await client.destroy();
        client.start(client.config.TOKEN);
    }
    return;
  },
}