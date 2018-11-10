const spam = require('../commands/spam')
const raid = require('../commands/raid')
const dispo = require('../commands/dispo')
const pasdispo = require('../commands/pasdispo')

const messageEkar = {
    author: '<@Ekar>',
    channel: {send: jest.fn(str => str)},
    guild: {
        roles: {
            get: jest.fn(() => {
                return {
                    members: [{user: {id: "Ekar"}}, {user: {id: "Kristine"}}, {user: {id: "Aika"}}]
                }
            })
        }
    },
    react: jest.fn()
}
const messageKristineDispo = {
    author: '<@Kristine>',
    channel: {send: jest.fn(str => str)},
    guild: {
        roles: {
            get: jest.fn(() => {
                return {
                    members: [{user: {id: "Ekar"}}, {user: {id: "Kristine"}}, {user: {id: "Aika"}}]
                }
            })
        }
    },
    react: jest.fn()
}
const messageAikaPasDispo = {
    author: {id: 'Aika'},
    channel: {send: jest.fn(str => str)},
    guild: {
        roles: {
            get: jest.fn(() => {
                return {
                    members: [{user: {id: "Ekar"}}, {user: {id: "Kristine"}}, {user: {id: "Aika"}}]
                }
            })
        }
    },
    react: jest.fn()
}

const argsDispoEkar = ['mardi', 'jeudi', '21h', 'mercredi', '20h', 'we', '23h']
const argsDispoKristine = ['lundi', '20h30']

beforeEach(() => {
    raid.execute(messageEkar)
});

afterEach(() => {
    messageEkar.channel.send.mockClear();
});

test("spams correctly", () => {
    spam.execute(messageEkar)
    expect(messageEkar.channel.send.mock.results[1].value).toBe('<@Ekar>,<@Kristine>,<@Aika>, merci de renseigner vos dispos !')
})

test("doesn't spam available players", () => {
    dispo.execute(messageEkar, argsDispoEkar)
    spam.execute(messageEkar)
    expect(messageEkar.channel.send.mock.results[1].value).toBe('<@Kristine>,<@Aika>, merci de renseigner vos dispos !')
})

test("doesn't spam unavailable players", () => {
    pasdispo.execute(messageAikaPasDispo)
    spam.execute(messageEkar)
    expect(messageEkar.channel.send.mock.results[1].value).toBe('<@Ekar>,<@Kristine>, merci de renseigner vos dispos !')
})

test("doesn't spam at all if everyone answered", () => {
    dispo.execute(messageEkar, argsDispoEkar)
    dispo.execute(messageKristineDispo, argsDispoKristine)
    pasdispo.execute(messageAikaPasDispo)
    spam.execute(messageEkar)
    expect(messageEkar.channel.send.mock.results[1].value).toBe("Je n'ai personne à spam ; tout le monde a répondu !")
})
