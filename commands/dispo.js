module.exports = {
    name: 'dispo',
    args: true,
    usage: '[date] [time] | Exemple : jeudi 21h',
    guildOnly: true,
    description: 'Donne une dispo pour l\'organisation du raid.',
    execute(message, args) {
        message.channel.send('Je ne sais pas encore lancer une dispo mais ça vient !')
    },
}
