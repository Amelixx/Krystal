const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) member = message.member
    else member = modules.fetchMember(message.guild, coreMessage, message.mentions)
    if (!member) return message.channel.send(`I couldn't find a member matching '${coreMessage}'`)

    info = userinfo[member.id]

    embed = new Discord.MessageEmbed()
        .setColor([221, 46, 68])
        .setAuthor(member.displayName, member.user.displayAvatarURL)
        .setTitle(`Invites`)

    if (!info.invite && member == message.member) {
        embed.setDescription(`You haven't made an invite yet. Make one with \`${prefix}createinvite\` to start inviting people!`)
        embed.setFooter(`You can also see statistics on other members' invites, try \`${prefix}invite <member>\`.`)
        return message.channel.send({embed})
    }
}

module.exports.info = {
    name: `invites`
}