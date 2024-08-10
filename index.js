const { Client, Collection } = require("discord.js");
const dotenv = require('dotenv'); dotenv.config();
const client = new Client({ intents: 1539, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
const Logger = require('./utils/Logger')

const x = ['commands'];
for (const i of x) {
  client[i] = new Collection();
};
['CommandUtil', 'EventUtil'].forEach(handler => { require(`./utils/handlers/${handler}`) (client)});
require('./utils/Functions')(client);

process.on('exit', code => { Logger.client(`Le processus s'est arrêté avec le code: ${code}\n`) })
process.on('uncaughtException', (err, origin) => {
    Logger.error(`UNCAUGHT_EXCEPTION: ${err}`)
    console.error(`Origine: ${origin}\n`)
 })
process.on('unhandledRejection', (reason, promise) => {
    Logger.warn(`UNHANDLED_REJECTION: ${reason}\n-----\n`)
    console.log(promise, '\n')
})
process.on('warning', (...args) => {
    Logger.warn(...args)
    console.log('\n')
})

client.login(process.env.DISCORD_TOKEN)
