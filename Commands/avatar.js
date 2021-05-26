const Discord = require(`discord.js`);
const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, content, prefix) => {
    let user;
    if (message.guild) member = modules.getMember(message.guild, content, message.channel)
    else user = modules.getUser(content, message.channel)
    if (user == undefined && member == undefined) return;
    else if (member != undefined) user = member.user

    let embed = new Discord.MessageEmbed()
        .setColor(`5d10e9`)
        .setTitle(`Avatar - ${user.tag}`)
        .setDescription(`[Avatar URL](${user.displayAvatarURL})`)
        .setImage(user.displayAvatarURL)
        .setFooter(`Requested by ${message.author.tag}`)
    message.channel.send({embed})
}

module.exports.info = {
    name: `avatar`,
    type: `info`,
    usage: `(user)`,
    summary: `Gets the avatar of a given user, with a link.`,
    bypassRestrictions: true
}