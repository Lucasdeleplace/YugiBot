const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'life-counter',
    category: 'utils',
    permissions: ['SEND_MESSAGES'],
    ownerOnly: false,
    usage: 'life-counter',
    examples: ['life-counter'],
    description: 'Affiche un compteur de vie pour Yu-Gi-Oh!',

    async run(client, message, args) {
        console.log('Commande life-counter exécutée');
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Compteur de vie')
            .setDescription('Cliquez sur les boutons ci-dessous pour ajouter ou retirer des points de vie.')
            .addField('Joueur 1', '8000', true)
            .addField('Joueur 2', '8000', true);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('life-counter-p1-add')
                    .setLabel('Ajouter points Joueur 1')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('life-counter-p1-remove')
                    .setLabel('Retirer points Joueur 1')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('life-counter-p2-add')
                    .setLabel('Ajouter points Joueur 2')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('life-counter-p2-remove')
                    .setLabel('Retirer points Joueur 2')
                    .setStyle('DANGER')
            );

        try {
            await message.channel.send({ embeds: [embed], components: [row] });
            console.log('Message envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    },

    async runInteraction(client, interaction) {
        console.log('Interaction life-counter exécutée');
        let player1Life = 8000;
        let player2Life = 8000;

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Compteur de vie')
            .setDescription('Cliquez sur les boutons ci-dessous pour ajouter ou retirer des points de vie.')
            .addField('Joueur 1', player1Life.toString(), true)
            .addField('Joueur 2', player2Life.toString(), true);

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('life-counter-p1-add')
                    .setLabel('Ajouter points Joueur 1')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('life-counter-p1-remove')
                    .setLabel('Retirer points Joueur 1')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('life-counter-p2-add')
                    .setLabel('Ajouter points Joueur 2')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('life-counter-p2-remove')
                    .setLabel('Retirer points Joueur 2')
                    .setStyle('DANGER')
            );

        try {
            await interaction.reply({ embeds: [embed], components: [row] });
            console.log('Réponse envoyée avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la réponse:', error);
        }

        const filter = i => i.customId.startsWith('life-counter-p1') || i.customId.startsWith('life-counter-p2');
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10800000 });

        collector.on('collect', async i => {
            const player = i.customId.includes('p1') ? 'Joueur 1' : 'Joueur 2';
            const action = i.customId.includes('add') ? 'ajouter' : 'retirer';
            await i.reply({ content: `Combien de points voulez-vous ${action} pour ${player}?`});

            const filter = response => response.author.id === i.user.id;
            const collected = await i.channel.awaitMessages({ filter, max: 1, time: 10800000, errors: ['time'] });

            const points = parseInt(collected.first().content);
            if (isNaN(points)) {
                await i.followUp({ content: 'Veuillez entrer un nombre valide.'});
                return;
            }

            if (player === 'Joueur 1') {
                player1Life += (action === 'ajouter' ? points : -points);
            } else {
                player2Life += (action === 'ajouter' ? points : -points);
            }
const updatedEmbed = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Compteur de vie')
    .setDescription('Cliquez sur les boutons ci-dessous pour ajouter ou retirer des points de vie.')
    .addField('Joueur 1', duel.player1Life <= 0 ? "0" : duel.player1Life.toString(), true)
    .addField('Joueur 2', duel.player2Life <= 0 ? "0" : duel.player2Life.toString(), true);

try {
    await interaction.deleteReply(); // Supprime le message initial
    await interaction.editReply({ embeds: [updatedEmbed] }); // Met à jour le message avec les nouveaux points de vie

    if (duel.player1Life <= 0 || duel.player2Life <= 0) {
        duel.player1Life = Math.max(0, duel.player1Life);
        duel.player2Life = Math.max(0, duel.player2Life);
        await interaction.editReply(duel.player1Life === 0 ? 'Joueur 2 a gagné!' : 'Joueur 1 a gagné!');
        collector.stop();
        return;
    }

    console.log(`Points de vie ${action} pour ${player}`);
} catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
}
        });

        collector.on('end', collected => {
            console.log(`Collecteur terminé. ${collected.size} interactions collectées.`);
        });
    }
};