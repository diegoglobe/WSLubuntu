const express = require('express');
const cors = require('cors'); // Importa 'cors'

const app = express();
const port = 3000; // Il nostro backend girerà sulla porta 3000

app.use(cors()); // Applica il "lasciapassare"
app.use(express.json()); // Permette al server di capire i dati (JSON) inviati dal frontend

// Questo è il nostro "cameriere"
// Ascolta le richieste "POST" all'indirizzo "/api/chat"
app.post('/api/chat', (req, res) => {
    // 1. Legge il messaggio inviato dal frontend
    const messaggioUtente = req.body.messaggio;
    console.log("Messaggio ricevuto dal frontend:", messaggioUtente);

    // 2. CREA UNA RISPOSTA (per ora finta)
    const rispostaBot = {
        testo: `Ho ricevuto il tuo messaggio: "${messaggioUtente}". Sto elaborando.`,
        profilo: {
            nome: "Profilo (dal Backend)",
            skill: "Node.js & Express",
            rating: "Ottimo"
        }
    };

    // 3. Invia la risposta al frontend
    res.json(rispostaBot);
});

// --- NUOVO ENDPOINT PER COLLEGARE L'EMAIL ---
app.post('/api/connect-email', (req, res) => {
    // 1. Legge i dati inviati dal frontend
    const { email, password, server } = req.body;

    console.log("Ricevuti dati per connessione IMAP:");
    console.log("Email:", email);
    console.log("Server:", server);
    // NON mostriamo la password nei log per sicurezza

    // *** PASSO FUTURO ***
    // Qui, in futuro, il nostro backend invierà una richiesta
    // al webhook di n8n (su http://n8n:5678/...) per
    // testare questa connessione.

    // 2. Per ora, simuliamo una risposta di successo
    res.json({ 
        status: "success", 
        message: `Richiesta di connessione per ${email} ricevuta.` 
    });
});

// Mette il server in ascolto sulla porta 3000
app.listen(port, () => {
    console.log(`Backend in ascolto su http://localhost:${port}`);
});