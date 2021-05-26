const Discord = require(`discord.js`);
const settings = require(`../config.json`)
const modules = require(settings.modulesPath)


const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let credits = settings.credits
    let member = await modules.fetchMember(message.guild, coreMessage, message.mentions)
    if (!coreMessage) member = message.member
    if (message.channel.type == "dm") member = bot.guilds.cache.get("451799907817488406").members.get(message.author.id)
    if (!member) return modules.error(message.channel, `Couldn't find anyone matching that search.`)
    else if (Array.isArray(member)) {
        string = new String()
        member.forEach(x => {
            string += `\`${x.user.tag}\` `
        })

        return modules.error(message.channel, `Too many members found.\nValid matches: ${string}`)
    }

    if (userinfo[member.id] && userinfo[member.id].credits) {
        if (member == message.member) bal = `You have${credits}**${userinfo[member.id].credits}** credits.`
        else bal = `${member.displayName} has${credits}**${userinfo[member.id].credits}** credits.`
    }
    else bal = `Oh wow, ${member.displayName} is poor enough to not have any credits. Good job!`

    let embed = new Discord.MessageEmbed()
        .setColor("5d10e9")
        .setTitle(`Balance`)
        .setAuthor(member.user.tag, member.user.displayAvatarURL)
        .setDescription(bal)
        .setThumbnail("https://cdn.discordapp.com/attachments/452128738398699522/459867634276499466/credits.gif")
        .setFooter(`Small, glowing, cube-like objects; used as Krystal's only form of currency.`)
    message.channel.send({embed})
}

module.exports.info = {
    name: `balance`,
    type: `money`,
    summary: `Displays a specfied user's money based off The Krystal's economy system.`,
    aliases: [`bal`],
    inKrystal: true
}