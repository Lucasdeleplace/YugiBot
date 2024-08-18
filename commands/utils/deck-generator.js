// Compléter le projet si un jour j'ai le temps, c'est qu'une base ici

const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: 'deck-generator',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'deck-generator',
    examples: ['deck-generator'],
    description: 'Génère un deck Yu-Gi-Oh! en fonction de vos préférences.',

    async run(client, message, args) {
        const filter = response => response.author.id === message.author.id;

        // Demande le type de deck
        await message.channel.send('Quel type de deck souhaitez-vous générer ? (ex: Dragon, Magicien, etc.)');
        const collectedType = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
        const deckType = collectedType.first().content;

        // Demande le nombre de cartes dans le deck
        await message.channel.send('Combien de cartes souhaitez-vous dans votre deck ? (ex: 40, 50, 60)');
        const collectedNumber = await message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] });
        const numberOfCards = parseInt(collectedNumber.first().content);

        // Génère le deck en fonction des préférences de l'utilisateur
        const deck = await this.generateDeck(deckType, numberOfCards);

        // Affiche le deck généré
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Deck ${deckType}`)
            .setDescription('Voici votre deck généré :');

        deck.forEach(card => {
            embed.addField(card.name, `Type: ${card.type}\nDescription: ${card.desc}`, false);
        });

        await message.channel.send({ embeds: [embed] });
    },

    async generateDeck(deckType, numberOfCards) {
        try {
            // Faire une requête à l'API pour obtenir les informations des cartes
            const response = await axios.get('https://db.ygoprodeck.com/api/v7/cardinfo.php');
            const cards = response.data.data;

            // Filtrer les cartes en fonction du type de deck
            let filteredCards = cards.filter(card => card.type.toLowerCase().includes(deckType.toLowerCase()));

            // Si aucun jeu de cartes n'est trouvé, retourner un message d'erreur
            if (filteredCards.length === 0) {
                return [{ name: 'Aucune carte trouvée pour ce type de deck.', type: '', desc: '' }];
            }

            // Limiter le deck au nombre de cartes spécifié par l'utilisateur
            const deck = filteredCards.slice(0, numberOfCards).map(card => ({
                name: card.name,
                type: card.type,
                desc: card.desc
            }));

            return deck;
        } catch (error) {
            console.error('Erreur lors de la récupération des cartes:', error);
            return [{ name: 'Erreur lors de la récupération des cartes.', type: '', desc: '' }];
        }
    }
};