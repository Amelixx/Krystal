const Discord = require(`discord.js`)
const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    let member = await modules.fetchMember(modules.Omniverse(), args.splice(2).join(" "), message.mentions)

    let credits = Number(args[1])
    if (isNaN(credits) || credits <= 0) return message.channel.send(`'${args[2]}' isn't a valid amount of credits to transfer.`)

    let authorCredits = userinfo[message.author.id].credits
    if (!authorCredits || authorCredits < credits)  return message.channel.send(`You don't have enough credits to make this transaction.. (You need **${settings.credits}${credits - authorCredits}** more!)`)

    await modules.removeCredits(message.author, credits)
    await modules.addCredits(member, credits)

    message.channel.send(`Transferred ${settings.credits}**${credits}** to ${member.displayName}`)
}

module.exports.info = {
    name: `transfer`,
    inKrystal: true
}