const Discord = require(`discord.js`)
const fs = require(`fs`);
const userinfo = require(`../JSON/userinfo.json`)

module.exports.run = async (bot, message, args, coreMessage, date, prefix) => {
    if (!userinfo[message.author.id].marriagePartner) return message.channel.send(`You aren't married to anyone!`)

    let partnerID = userinfo[message.author.id].marriagePartner

    message.channel.send(`${message.author.username} and ${bot.users.cache.get(partnerID).username} are no longer married.. Rip in the chat.`)

    delete userinfo[partnerID].marriagePartner
    delete userinfo[message.author.id].marriagePartner

    fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4));
}

module.exports.info = {
    name: `divorce`,
    type: `fun`,
    summary: `Deletes your partner from the marriages database. Harsh >_>`
}