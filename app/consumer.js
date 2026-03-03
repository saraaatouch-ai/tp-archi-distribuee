const amqp = require('amqplib');

async function demarrerConsommateur() {
    try {
        const conn = await amqp.connect('amqp://admin:admin@rabbitmq');
        const channel = await conn.createChannel();
        const QUEUE = 'commandes';

        await channel.assertQueue(QUEUE, { durable: true });
        console.log('🔔 Consommateur en attente de messages...');

        channel.consume(QUEUE, (msg) => {
            if (msg) {
                const commande = JSON.parse(msg.content.toString());
                console.log('-----------------------------------');
                console.log('📩 NOUVELLE COMMANDE REÇUE !');
                console.log('👤 Client:', commande.client);
                console.log('📦 Produit:', commande.produit);
                console.log('🆔 ID:', commande.id);
                console.log('📧 Email de confirmation envoyé (simulé)');
                channel.ack(msg); // Accuser réception
            }
        });
    } catch (err) {
        // Si RabbitMQ n'est pas encore prêt, on réessaie après 5 secondes
        setTimeout(demarrerConsommateur, 5000);
    }
}

demarrerConsommateur();