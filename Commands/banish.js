const Discord = require(`discord.js`);

const settings = require(`../config.json`)
const modules = require(`../modules.js`)
const jails = require(`../JSON/jails.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let member = modules.fetchMember(message.guild, args[1], message.mentions)
    if (!member) return message.channel.send(`Couldn't find any members matching that search.`)

    if (member.id == "466706137614647307") return message.channel.send(`I'm not gonna banish my creator's girlfriend... :thinking:`)

    if (isNaN(Number(args[2]))) {reason = args.splice(2).join(" ") || `No reason specified.`; minutes = null}
    else {reason = args.splice(3).join(" ") || `No reason specified.`; minutes = args[2]}
    if (Array.isArray(member)) {
        string = new String()
        member.forEach(x => {
            string += `\`${x.user.tag}\` `
        })

        return message.channel.send(`Too many members found.\nValid matches: ${string}`)
    }
    if (jails[member.id]) return message.channel.send(`That member is already banished! To free someone from the nether, try the ${prefix}free command.`)

    await modules.jail(member, message.member, minutes * 60 * 1000, reason)
    message.channel.send(`Banished ${member.displayName} to the Nether.`)
}

module.exports.info = {
    name: `banish`,
    type: `admin`,
    aliases: [`jail`],
    bypassRestrictions: true,
    usage: `<user> (time, in minutes) (reason)`,
    summary: `Banish a user to the nether..`,
    inKrystal: true
}