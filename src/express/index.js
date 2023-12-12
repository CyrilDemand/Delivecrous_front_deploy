const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Remplacez par l'URL de votre application React
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Les méthodes HTTP autorisées
    credentials: true // Autorise les cookies de session cross-origin
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Remplacez par l'URL de votre application React
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté');

    socket.on('disconnect', () => {
        console.log('Un utilisateur s est déconnecté');
    });
});

app.post('/newDeploy', (req, res) => {
    // Traitement de la requête, par exemple, enregistrer les informations de déploiement

    // Envoyer une notification à tous les clients connectés via Socket.IO
    io.emit('deployUpdate', { message: 'Nouveau déploiement effectué' });

    // Répondre à la requête HTTP
    res.status(200).send('Notification de déploiement envoyée');
});

server.listen(3002, () => {
    console.log('Serveur écoutant sur le port 3002');
});
