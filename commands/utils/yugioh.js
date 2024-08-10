const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'yugioh',
	category: 'utils',
	permissions: ['SEND_MESSAGES'],
	ownerOnly: false,
	usage: 'yugioh <card name>',
	examples: ['yugioh Dragon blanc aux yeux bleus'],
	description: 'Renvoie les informations d\'une carte Yu-Gi-Oh!',
	async run(client, message, args) {
		if (!args.length) {
			return message.reply('Merci de fournir le nom d\'une carte Yu-Gi-Oh!');
		}

		const cardName = args.join(' ');
		const url = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(cardName)}&language=fr`;

		try {
			const response = await fetch(url);
			const data = await response.json();

			if (!data.data || data.data.length === 0) {
				return message.reply('Carte non trouvée!');
			}

			const card = data.data[0];

			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(card.name)
				.setDescription(card.desc)
				.setThumbnail(card.card_images[0].image_url)
				.addField('Type', card.type, true)
				.addField('ATK', card.atk ? card.atk.toString() : 'N/A', true)
				.addField('DEF', card.def ? card.def.toString() : 'N/A', true)
				.addField('Niveau', card.level ? card.level.toString() : 'N/A', true)
				.addField('Race', card.race, true)
				.addField('Attribut', card.attribute ? card.attribute : 'N/A', true);
                if (card.card_sets && card.card_sets.length > 0) {
                    const sets = card.card_sets.map(set => `${set.set_name} (${set.set_code})`).join('\n');
                    embed.addField('Sets', sets);
                }

			message.channel.send({ embeds: [embed] });
            console.log(card);
		} catch (error) {
			console.error(error);
			message.reply('Une erreur s\'est produite lors de la récupération des informations de la carte.');
		}
	},

    options: [
        {
          name: 'cardname',
          description: 'Tapez le nom de la carte Yu-Gi-Oh!',
          type: 'STRING',      
          required: true,
        },
      ],
    
      async runInteraction(client, interaction) {
        const cardName = interaction.options.getString('cardname');
        const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?language=fr';

        try {
            const response = await fetch(url);
            const json = await response.json();
            const data = json.data.map((card) => ({
                name: card.name,
                value: card.name,
            }));

            const regex = new RegExp(`^${cardName}`, 'i');
            const filteredCards = data.filter(card => regex.test(card.name));

            if (filteredCards.length === 0) {
                return interaction.reply('Carte non trouvée!');
            }

            const card = filteredCards[0]; // Prendre la première carte correspondante
            const cardDetailsUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=${encodeURIComponent(card.name)}&language=fr`;

            const cardResponse = await fetch(cardDetailsUrl);
            const cardJson = await cardResponse.json();
            const cardData = cardJson.data[0];

            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(cardData.name)
                .setDescription(cardData.desc)
                .setThumbnail(cardData.card_images[0].image_url)
                .addField('Type', cardData.type, true)
                .addField('ATK', cardData.atk ? cardData.atk.toString() : 'N/A', true)
                .addField('DEF', cardData.def ? cardData.def.toString() : 'N/A', true)
                .addField('Niveau', cardData.level ? cardData.level.toString() : 'N/A', true)
                .addField('Race', cardData.race, true)
                .addField('Attribut', cardData.attribute ? cardData.attribute : 'N/A', true);
                if (cardData.card_sets && cardData.card_sets.length > 0) {
                    const sets = cardData.card_sets.reverse().slice(0, 5).map(set => `${set.set_name} (${set.set_code}) : ${set.set_price}`).join('\n');
                    embed.addField('Sets', sets);
                }
            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('Une erreur s\'est produite lors de la récupération des informations de la carte.');
        }
    }
};