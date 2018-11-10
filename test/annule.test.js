const annule = require('../commands/annule')
const raid = require('../commands/raid')
const dispo = require('../commands/dispo')

const message = {
    author: 'Ekar',
    react: jest.fn(),
    channel: {send: jest.fn()}
}

const argsDispo = ['mardi', 'jeudi', '21h', 'mercredi', '20h', 'we', '23h']
const argsAnnule = ['mardi', 'jeudi', 'samedi']

test("removes specified availabilities", () => {
    raid.execute(message)
    dispo.execute(message, argsDispo)
    annule.execute(message, argsAnnule)
    expect(raid.raid[0].players.Ekar).toBeUndefined()
    expect(raid.raid[1].players.Ekar).toBe('20h')
    expect(raid.raid[2].players.Ekar).toBeUndefined()
    expect(raid.raid[4].players.Ekar).toBeUndefined()
    expect(raid.raid[5].players.Ekar).toBe('23h')
    expect(message.react).toHaveBeenCalled()
})
