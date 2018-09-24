const { prefix } = require('../properties.json')

module.exports = {
    name: 'help',
    description: 'Liste de toutes mes commandes et des infos associées.',
    usage: '[command name]',
    execute(message, args) {
        const data = []
        const { commands } = message.client

        if (!args.length) {
            data.push('Liste de mes commandes :')
            data.push(commands.map(command => command.name).join(', '))
            data.push(`Pour avoir des informations spécifiques à une commande, utilise \`${prefix}help [command name]\`.`)

            return message.author.send(data, { split: true })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
                    message.reply('Je n\'ai pas pu te DM ! Les as-tu désactivés ?')
                })
        }
        const name = args[0].toLowerCase()
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

        if (!command) {
            return message.reply('Ce n\'est pas une commande valide !')
        }

        data.push(`**Nom:** ${command.name}`)

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
        if (command.description) data.push(`**Description:** ${command.description}`)
        if (command.usage) data.push(`**Utilisation:** ${prefix}${command.name} ${command.usage}`)
        if (command.officerOnly) data.push(`*Utilisable uniquement par un officier.*`)

        message.author.send(data, { split: true })
    },
}
