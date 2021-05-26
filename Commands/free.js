const Discord = require(`discord.js`);
const settings = require(`../config.json`)
const modules = require(settings.modulesPath)
const jails = require(`../JSON/jails.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let member = modules.fetchMember(message.guild, args[1], message.mentions)
    if (!member) return message.channel.send(`Couldn't find any members matching that search.`)

    reason = args.splice(2).join(" ") || `No reason specified.`
    if (Array.isArray(member)) {
        string = new String()
        member.forEach(x => {
            string += `\`${x.user.tag}\` `
        })

        return message.channel.send(`Too many members found.\nValid matches: ${string}`)
    }
    if (!jails[member.id]) return message.channel.send(`This member hasn't been banished to the nether.`)

    await modules.free(member, message.member, reason)

    message.channel.send(`Released **${member.displayName}** from the nether. :ok_hand:`)
}

module.exports.info = {
    name: `free`,
    type: `admin`,
    usage: `<user> (reason)`,
    summary: `Free a user from the nether.`,
    inKrystal: true
}