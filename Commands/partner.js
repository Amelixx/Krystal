const Discord = require(`discord.js`);
const fs = require(`fs`)

const config = require(`../config.json`)

const userinfo = require(`../JSON/userinfo.json`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (message.channel.id != "474933488005545984") return message.channel.send(`This command can only be used in <#474933488005545984>. (To reduce the effect of an accidental everyone mention)`)

    if (!args[1]) return message.channel.send(`Invalid usage.\n${this.info.help}`)
    user = await bot.fetchUser(args[1])
    if (!user) {
        user = modules.fetchUser(args[1])
        if (!user) return message.channel.send(`Either that's an invalid ID, or I can't find anyone with that ID.`)
    }
    if (user.bot) return message.channel.send(`That user is a bot..? (${user.tag})`)

    let partnermsg = args.splice(2).join(" ")

    if (!partnermsg) return message.channel.send(`Please include a partner message after the user.`)

    member = message.guild.member(user)
    // return message.channel.send(`**${user.tag}** isn't in The Krystal..`)

    if (partnermsg.startsWith("```") && partnermsg.endsWith("```")) partnermsg = partnermsg.substr(3).slice(0, -3);
    while (partnermsg.includes("@everyone") || partnermsg.includes(`@here`)) {
        partnermsg = partnermsg.replace(`@everyone`, `everyone`)
        partnermsg = partnermsg.replace(`@here`, `here`)
    }

    if (!partnermsg.includes(`discord.gg/`)) return message.channel.send(`That partnership message doesn't even have an invite in it.. :thinking:`)
    else invite = await modules.searchInvite(partnermsg)

    let partnerRole = message.guild.roles.cache.get(`461262839366025226`)

    if (member) member.roles.add(partnerRole, "Partnering with the server.")

    if (invite && invite.memberCount >= 500) channel = bot.channels.cache.get(config.vipPartnerChannelID)
    else channel = bot.channels.cache.get(config.partnerChannelID)
    
    startMessage = `\`\`\`  \`\`\`${modules.Krystal().roles.get(`452175061554692096`)}**New Partner - Submitted by <@!${user.id}> **(${user.tag})**\n**`
    if ((startMessage + partnermsg).length >= 2000) {
        channel.send(startMessage);
        msg = await channel.send(partnermsg)
    }
    else msg = await channel.send(`\`\`\`  \`\`\`${modules.Krystal().roles.get(`452175061554692096`)}**New Partner - Submitted by <@!${user.id}> **(${user.tag})**\n**${partnermsg}`)

 
    if (!userinfo[user.id]) userinfo[user.id] = {xpCap: 100, level: 1, xp: 0, credits: 0, monthlyXpCap: 100, monthlyLevel: 1, monthlyXp: 0, partner: true}
    else userinfo[user.id].partner = true

    if (!userinfo[user.id].partnerMessageIDs) userinfo[user.id].partnerMessageIDs = [msg.id]
    else userinfo[user.id].partnerMessageIDs.push(msg.id)
    await fs.writeFile(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4), err => { if (err) throw err })
}

module.exports.info = {
    name: `partner`,
    ignoreDM: true,
    rolesRequired: [`465940250745765918`],
    inKrystal: true,
    usage: `(user ID) (partner message)`,

    help: 
        `Usage: \`o!partner (user ID) (partner message)\`\n` +
        `The "user" parameter should be the user that you're partnering with. I.e the person representing the partnered server.` +
        `\nThis can be a username + discrimator too, instead of an ID. Such as username#1337. Keep in mind the user has to be in Krystal for this method to work.\n\n` +
        `The "partner message" parameter is just the server ad that they are using. This should include the link too. Don't worry about \`@everyone\` or \`@here\` mentions. ` +
        `These are automatically removed by Krystal.`
}