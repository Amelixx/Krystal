const Discord = require(`discord.js`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

const chalk = require(`chalk`)

const fs = require(`fs`)

const userinfo = require(`../JSON/userinfo.json`)

const hook = new Discord.WebhookClient('481518938027720722', '3tr0qqT3e1qheGF57khz8AMnZ4RADVUmfCQomljRZmGBs1jVIjeCNsKH8w7nXYtoyoFA');

const globalStats = require(`../JSON/Stats/globalStats.json`)
const serverStats = require(`../JSON/Stats/serverStats.json`)
const userStats = require(`../JSON/Stats/userStats.json`)

const youtube = require(`../JSON/youtube.json`) // youtube.json I sent you
const youtubeStats = require(`../JSON/Stats/youtubeStats.json`) // youtubeStats.json I sent you

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    // let categories = message.guild.channels.cache.filter(x => {return x.name.toLowerCase().startsWith("category") && x.type == "category"})
    // categories.forEach(async x => {
    //     await x.children.forEach(async c => {
    //         await c.delete()
    //     })
    //     x.delete()
    // })

    for (let i=0; i<10; i++) {
        message.guild.channels.create(`category${i+1}`, {
          type: "category"
        }).then(category => {
           for (let i=0; i<30; i++) {
             message.guild.channels.create(`channel${i+1}`, {
                type: "text",
                permissionOverwrites: [
                  {
                      id: message.guild.roles.everyone,
                      allow: ["SEND_MESSAGES", "ADD_REACTIONS"],
                      deny: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
                      type: "role"
                  }
                ],
                parent: category.id
             })
          }
        })
      }
}


module.exports.info = {
    name: `temp`,
    developer: true
}