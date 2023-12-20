const {
    cooldown,
    toPascalCase,
} = require("../handlers/functions");
const client = require('..');
const { prefix, emoji } = require("../settings/config");
const { PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

client.on("messageCreate", async (message) => {

    //automod

    if (
        message.author.id !== client.user.id &&
        message.author.bot &&
        client.config.categories.includes(message.channel.parentId)
        ) {
            const regex = new RegExp(
                `\\b(${client.config.blacklistedWords.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b(?=\\W|$)`,
                'gi'
            );
        const foundWords = message.content.toLowerCase().match(regex);
      
        if (foundWords && foundWords.length > 0) {

            const channel = client.channels.cache.get(client.config.channel);
            const originalChannel = message.channel.id;
            const originalCategory = message.channel.parentId
            const messageLink = `https://discord.com/channels/${message.guildId}/${message.channel.id}/${message.id}`;
            const cnfg = client.config.channels;
            console.log(message.author.globalName)

            if (originalChannel == cnfg.minecraft) {
                var user = message.author.username;
                var content = message.content;
                var color = '#7D3100'
                var game = 'Minecraft'
            } else if (originalChannel == cnfg.terraria) {
                let msgContent = message.content.split(":");
                var user = msgContent[0].slice(3);
                var content = msgContent[1].slice(0, -2);
                var color = '#3EF600'
                var game = 'Terraria'
            } else if (originalChannel == cnfg.zomboid) {
                let msgContent = message.content.split(":");
                var user = msgContent[0]
                var content = msgContent[1].slice(1)
                var color = '#BE1100'
                var game = 'Project Zomboid'
            } else if (originalChannel == cnfg.factorio) {
                let msgContent = message.content.split(":");
                var user = msgContent[0]
                var content = msgContent[1].slice(1)
                var color = '#FF9600'
                var game = 'Factorio'
            } else if (originalCategory == cnfg.gmod) {
                var user = message.author.name.replace(/^\[.*?\]\s*/, '') || message.author.name;
                var content = message.content.slice(4);
                var color = '#00AFFF'
                var game = `Garry\'s Mod`
            } else {
                console.log('Not listed');
                return;
            }

            const check = new ButtonBuilder()
			.setLabel('See Message')
            .setURL(messageLink)
			.setStyle(ButtonStyle.Link);

            const row = new ActionRowBuilder()
			.addComponents(check);

            const embed = new EmbedBuilder()
            .setTitle(`__${game}__\n**User:** ***${user}***`)
            .setDescription(
                `### **Message:**
                \`${content}\``
            )
            .setColor(color)
            .addFields({ name: "Triggered words:", value: `\`${foundWords.join('\`, \`')}\`` })
            .setImage('https://i.stack.imgur.com/Fzh0w.png'); //to make embed wider

            channel.send({
                embeds: [embed],
                components: [row],
            });
            return;
        }
    }

    //prefix

    if (message.author.bot || !message.guild || !message.id) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.mcommands.get(cmd)
    if (!command) return;
    if (command) {
        if (
            !message.member.permissions.has(
                PermissionFlagsBits[toPascalCase(command.userPermissions[0])] || []
            )
        ) {
            return client.embed(
                message,
                `You Don't Have \`${command.userPermissions}\` Permission to Use \`${command.name}\` Command!!`
            );
        } else if (
            !message.guild.members.me.permissions.has(
                PermissionFlagsBits[toPascalCase(command.botPermissions[0])] || []
            )
        ) {
            return client.embed(
                message,
                `I Don't Have \`${command.botPermissions}\` Permission to Use \`${command.name}\` Command!!`
            );
        } else if (cooldown(message, command)) {
            return client.embed(
                message,
                `You are On Cooldown , wait \`${cooldown(
                message,
                command
              ).toFixed()}\` Seconds`
            );
        } else {
            command.run(client, message, args, prefix);
        };
    };
});

/*
⣿⣿⡟⡹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⢱⣶⣭⡻⢿⠿⣛⣛⣛⠸⣮⡻⣿⣿⡿⢛⣭⣶⣆⢿⣿
⣿⡿⣸⣿⣿⣿⣷⣮⣭⣛⣿⣿⣿⣿⣶⣥⣾⣿⣿⣿⡷⣽⣿
⣿⡏⣾⣿⣿⡿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿
⣿⣧⢻⣿⡟⣰⡿⠁⢹⣿⣿⣿⣋⣴⠖⢶⣝⢻⣿⣿⡇⣿⣿
⠩⣥⣿⣿⣴⣿⣇⠀⣸⣿⣿⣿⣿⣷⠀⢰⣿⠇⣿⣭⣼⠍⣿
⣿⡖⣽⣿⣿⣿⣿⣿⣿⣯⣭⣭⣿⣿⣷⣿⣿⣿⣿⣿⡔⣾⣿
⣿⡡⢟⡛⠻⠿⣿⣿⣿⣝⣨⣝⣡⣿⣿⡿⠿⠿⢟⣛⣫⣼⣿
⣿⣿⣿⡷⠝⢿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣾⡩⣼⣿⣿⣿⣿⣿
⣿⣿⣯⡔⢛⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣭⣍⣨⠿⢿⣿⣿⣿
⣿⡿⢫⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣝⣿
*/
