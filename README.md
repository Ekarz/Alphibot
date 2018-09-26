# Alphibot
## Introduction
This is a Discord bot written in Javascript, originally for the needs of my Free Company in Final Fantasy XIV.  
Its primary role is to help organize raids in game, more specifically to know and display when 8 players are available at the same time to play together, assuming every member of the Discord server gave the bot their planned play times.  

> Please note that our Company being french, most of the messages sent by the bot are also written in french (at least for now).

## How do I install it ?
Just get the source code on your server, rename the `config.example.json` file as `config.json`, put your bot token in it (I'll let you look it up if you don't know where to get one) and you're good to go. Use `npm start` whenever you want the bot to go online.

## How do I interact with it ?
Know that you can use the `!help` command to know everything the bot can do, but basically : 

1. Someone with a specific role has to use the `!raid` command first. It will setup plans for the upcoming week.
2. Inform your availability on any given day using the `!dispo` command.
3. Use the `!recap` command every time you want to know the current state of things. The bot will tell you if there are enough players to raid.
