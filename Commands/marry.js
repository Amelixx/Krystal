const Discord = require("discord.js");
const fs = require(`fs`);

const userinfo = require(`../JSON/userinfo.json`)

const modules = require(`../modules.js`)
module.exports.run = async (bot, message, args, coreMessage, date, prefix) => {
    if (!coreMessage) return message.channel.send(`You need to tell me who you want to marry, you dumbo.`)
    if (userinfo[message.author.id].marriagePartner) return message.channel.send(`You're already married to someone... Cute.`)
    let memberToMarry = await modules.fetchMember(message.guild, coreMessage)
    if (!memberToMarry) return message.channel.send(`I couldn't find anyone matching '${coreMessage}'`)
    if (userinfo[memberToMarry.id].marriagePartner && memberToMarry.user.bot) return message.channel.send(`Yeah.. someone already took that bot. Sorry.`)
    else if (userinfo[memberToMarry.id].marriagePartner) return message.channel.send(`Uh.. **${memberToMarry.displayName}** is already married... `)

    if (!memberToMarry) return message.channel.send(`Couldn't find a user matching '${coreMessage}'`)

    else if (memberToMarry.user == bot.user) return message.channel.send(`Haha, cute, but.. no. You can't exactly marry a Crystal..`)
    else if (memberToMarry.user == message.author) return message.channel.send(`Yeah unfortunately it's not ethically possible to marry yourself.. Sorry about that.`)
    else if (memberToMarry.id == `386868728098324481`) return message.channel.send(`Kuro is only 2 years old, you know that right? :eyes:`)

    if (userinfo[memberToMarry.id].marriagePartner) return message.channel.send(`**${memberToMarry.displayName}** is already married..`)

    let shouldMarry = true
    if (memberToMarry.user.bot) {
        message.channel.send(`Fine. I'll allow you to forcibly marry this bot since it can't really consent otherwise.\nCongratulations. **${message.author}** just married ${memberToMarry}.`)
    }
    else {
        message.channel.send(`<a:loveparrot:460507059780321281> ${memberToMarry}, ${message.author} just proposed to you... Say "yes" or "no" to answer!`)
        let messages = await message.channel.awaitMessages((msg => ((msg.author.id == "97238312355364864" && msg.content.toLowerCase() == "forceyes") || msg.author.id == memberToMarry.id) && ["yes", "no", "f off", "fuck off", "forceyes"].includes(msg.content.toLowerCase())), {maxMatches: 1, time: 600000})
        if (!messages.first()) {
            return message.channel.send(`Huh. ${memberToMarry} refused to even say "yes" or "no". Try again if you really want him/her/it.`)
        }
        else {
            switch(messages.first().content.toLowerCase()) {
                case "no": case "fuck off": case "f off":
                    message.channel.send(`Damn... ${message.author} is alone ;-;`)
                    shouldMarry = false
                    break;

                case "yes": 
                    message.channel.send(`<a:purpleHeart:499288775453704212> Congratulations. ${memberToMarry.displayName} and ${message.author.username} are now married! :confetti_ball: `)
                    break;

                case "forceyes":
                    message.channel.send(`Uhm, I know this is kinda illegal, but Rubix just forced you to marry anyway.. soo.... :heart: You're married! :confetti_ball:`)
                    break;
            }
        }
    }
    if (shouldMarry) marry(message.author, memberToMarry)
}

marry = (user, user2) => {
    userinfo[user.id].marriagePartner = user2.id
    userinfo[user2.id].marriagePartner = user.id
    fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4));
}

module.exports.info = {
    name: `marry`,
    type: `fun`,
    summary: `Partner with someone! <3`,
    ignoreDM: true,
    beingFixed: true
}