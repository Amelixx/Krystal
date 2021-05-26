const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (message.guild.id != `451799907817488406`) return;

    if (isNaN(args[1]) || !args[1] || Number(args[1]) > 52 || Number(args[1]) < 0) return modules.error(message.channel, `Enter a number between 0 and 52 for a colour.`)
    
    await message.member.roles.forEach(async (role, id) => { if (Number(role.name) < 52 && Number(role.name) > -1) { message.member.roles.remove(role) }})
    
    let role = (message.guild.roles.cache.get.find(x => x.name == args[1]))

    if (!role) return message.channel.send(`***Well, this is embarrasing.***\nIf you're seeing this, something is fundamentally wrong with ${bot.user.username} and you should probably contact ${bot.users.cache.get("97238312355364864").tag} about it.`)

    message.member.roles.add(message.guild.roles.cache.get.find(`name`, args[1]))
    let embed = new Discord.MessageEmbed()
        .setColor(role.color)
        .setDescription(`:comet: Set your colour to ${args[1]}. :comet:`)
    message.channel.send({embed})
}

module.exports.info = {
    name: `color`,
    usage: `<number (0-51)>`,
    type: `krystal`,
    aliases: [`colour`],
    summary: `Select a colour you like!`,
    inKrystal: true
}