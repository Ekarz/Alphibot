const Discord = require('discord.js')
const fs = require('fs')
const { token, prefix } = require('./properties.json')
const { version } = require('./package.json')
const client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

client.on('ready', () => {
    client.user.setActivity(version, { type: 'WATCHING' })
})

client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return

        const args = message.content.slice(prefix.length).split(/ +/)
        const commandName = args.shift().toLowerCase()
        if (!client.commands.has(commandName)) return

        const command = client.commands.get(commandName)
        if (command.args && !args.length) return message.channel.send(`${message.author}, il manque des arguments ! 
            N'hésite pas à utiliser \`${prefix}help ${commandName}\``)

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('Je ne peux pas exécuter cette commande dans un DM. 😦')
        }

        try {
            command.execute(message, args)
        } catch (error) {
            console.error(error)
            message.reply('there was an error trying to execute that command!')
        }
    }
)

client.login(token)
