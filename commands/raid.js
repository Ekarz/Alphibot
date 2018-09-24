module.exports = {
    name: 'raid',
    args: false,
    usage: '', //TODO
    guildOnly: true,
    officerOnly: true,
    description: 'Lance un appel aux disponibilités de raid.',
    execute(message, args) {
        message.channel.send('Je ne sais pas encore lancer un raid mais ça vient !')
    },
}
