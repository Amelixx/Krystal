const Discord = require(`discord.js`);
const chalk = require(`chalk`)
const fs = require(`fs`)

const userinfo = require(`../JSON/userinfo.json`)

const settings = require(`../config.json`)
const modules = require(settings.modulesPath)

const colorRoles = require(`../JSON/newColorRoles.json`)

module.exports.run = async (bot, message, args, coreMessage, prefix) => {
    if (!coreMessage) return message.channel.send(`Enter a command.`)
    await bot.channels.cache.get(settings.rolesChannelID).messages.fetchs().then(x => rolesMessage = x.first())
    switch(args[1].toLowerCase()) {
        case "editrolesmessage": {
            rolesMessage.edit(args.splice(2).join(" "))
            return message.channel.send(`Edited. :ok_hand:`)
        }
        case "addreactions":
            message.channel.send(`Adding reactions...`)
            rolesMessage.react(":male:452061696983433216")
            rolesMessage.react(":female:452061730865020928")
            Object.keys(settings.assignableRolesEmotes).forEach(x => {
                try {
                    rolesMessage.react(x)
                } catch(error) {
                    console.log(chalk.red(`Ran into an error while adding emotes: On '${x}'\n`) + chalk.redBright(error))
                }
            })
            message.channel.send(`Added :ok_hand:`)
            break;
        case "addotakureactions": 
            message.channel.send(`Adding reactions...`)

            rolesMessage = await modules.fetchOtakuReactionMessage()

            await Object.keys(settings.OtakuAssignableRoles).forEach(async x => {
                try {
                    await rolesMessage.react(x)
                } catch(error) {
                    await console.log(chalk.red("Ran into an error while adding emotes:\n") + chalk.redBright(error))
                }
            })
            message.channel.send(`Added :ok_hand:`)
            break;
        case "colorroles": {
            message.channel.send(`Here we go... :^)\n*This might take some time..*`)
            for (let role in colorRoles) {
                role = colorRoles[role]
    
                await message.guild.createRole({
                    name: role.name,
                    color: role.hexColor,
                    hoist: false,
                    mentionable: false,
                    permissions: 0
                })
            }
            message.channel.send(`Damn.. We have 172 roles here now.`)
            break;
        }
        case "rolesmessage":
            msg = await bot.channels.cache.get(settings.rolesChannelID).messages.fetch(settings.roleAssignmentMessageID)
            fs.writeFileSync(`./rolesMessage.txt`, msg.content)
            message.channel.send({files: 
                [{ attachment: "./rolesMessage.txt", name: "rolesMessage.txt"}]
            })
            break;
        case "setlevel": // o!dev setLevel <user> <level>
            user = modules.fetchUser(args.slice(2).join(" "))
            if (!args.slice(2).join(" ") || !user) {user = modules.Rubix(); level = args[2]; message = `Set your level to **${level}**.`; console.log(`gergegserg`)}
            else {level = args[3]; message = `Set the level of ${user.tag} to **${level}**.`}

            userinfo[user.id].level = level 
            fs.writeFileSync(`./JSON/userinfo.json`, JSON.stringify(userinfo, null, 4))
            
            break;
        default: message.channel.send(`Unknown command.`)
    }
}

module.exports.info = {
    name: `devtools`,
    developer: true,
    aliases: [`dev`]
}