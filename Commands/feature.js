const Discord = require(`discord.js`)
const fs = require(`fs`);
const chalk = require(`chalk`)

const modules = require(`../modules.js`)

const youtube = require(`../JSON/youtube.json`)

module.exports.run = async (bot, message, args, content, prefix) => {
    if (!content || !args[2]) return message.channel.send(`M8 you have to give me something :|`)
    let video = await modules.Youtube.getVideo(args[1]).catch(err => {message.channel.send(`Couldn't find a youtube video.`); return false})
    if (!video) return;

    userSearch = message.content.split(/\s+/).splice(2).join(" ")
    
    let user;
    user = await modules.getUser(userSearch, message.channel)
    if (user == undefined) return;

    if (youtube[video.id]) {
        if (youtube[video.id].users.includes(user.id)) return message.channel.send(`**${user.username}** is already considered part of this video.`)
        youtube[video.id].users.push(user.id)
    }
    else youtube[video.id] = {
        title: video.title,
        users: [user.id]
    }
    fs.writeFileSync(`./JSON/youtube.json`, JSON.stringify(youtube, null, 4))

    message.channel.send(`**${user.username}** is now considered part of the video \`${video.title}\``)
}

module.exports.info = {
    name: `feature`,
    aliases: ["f"],
    developer: true,
    bypassRestrictions: true
}