const Discord = require('discord.js')
const fs = require('fs')
const { token, prefix } = require('./config.json')
const { version } = require('./package.json')
const client = new Discord.Client()
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.on('ready', () => {
    client.user.setActivity(`Version ${version}`, { type: 'WATCHING' })
})

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()
    if (!client.commands.has(commandName)) return
    const command = client.commands.get(commandName)

    if (command.args && !args.length) {
        return message.channel.send(`${message.author}, il manque des arguments ! 
        N'hésite pas à utiliser \`${prefix}help ${commandName}\``)
    }
    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Je ne peux pas exécuter cette commande dans un DM. 😦')
    }
    if (command.officerOnly && !message.member.roles.some(role => role.name === 'Officiers')) {
        return message.reply('Je ne peux exécuter cette commande que si un officier me le demande. Désolé !')
    }
    if (command.raiderOnly && !message.member.roles.some(role => role.name === 'Raiders')) {
        return message.reply('Seul un raider peut faire ça. Go pex !')
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000
    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now)
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount

        if (now < expirationTime) {
            return message.react('🕐')
        }

        timestamps.set(message.author.id, now)
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }

    try {
        command.execute(message, args)
    } catch (error) {
        console.error(error)
        console.error(`>> [${new Date()}] <${message.channel.name}> "${message.content}"`)
        message.reply("Quelque chose s'est mal passé pendant que j'essayais d'effectuer cette commande...")
    }
})

client.login(token)
