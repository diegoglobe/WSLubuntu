const express = require('express');
const cors = require('cors'); // Importa 'cors'
const fetch = require('node-fetch'); // **AGGIUNTO - Importante!**

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

// --- NUOVO ENDPOINT PER COLLEGARE L'EMAIL (AGGIORNATO) ---
app.post('/api/connect-email', async (req, res) => { // Aggiunto "async"

    // 1. Legge i dati inviati dal frontend
    const { email, password, server } = req.body;
    const imapData = { email, password, server }; // Crea un oggetto

    console.log(`Dati IMAP ricevuti, inoltro a n8n...`);

    // INCOLLA IL TUO URL DI TEST DI n8n QUI SOTTO
    const n8nWebhookUrl = "http://n8n:5678/webhook-test/c7b471f1-62ac-48ee-afe6-aa9254d5a78f"; 

    try {
        // 2. Inoltra i dati a n8n usando il nome del servizio "n8n"
        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imapData) // Invia i dati a n8n
        });

        // Se n8n non risponde correttamente (non dovrebbe succedere)
        if (!n8nResponse.ok) {
            throw new Error(`n8n risponde con errore: ${n8nResponse.status}`);
        }

        // 3. Rispondi al frontend che tutto è andato bene
        console.log("Dati inoltrati a n8n con successo.");
        res.json({ 
            status: "success", 
            message: `Dati inviati a n8n per ${email}.` 
        });

    } catch (error) {
        // Gestione errori (es. se n8n è spento o l'URL è sbagliato)
        console.error("Errore during la chiamata a n8n:", error.message);
        res.status(500).json({ 
            status: "error", 
            message: "Errore interno: impossibile contattare il servizio di automazione."
        });
    }
});

/* HO RIMOSSO IL BLOCCO DUPLICATO CHE SI TROVAVA QUI.
Era questo:
    // 2. Per ora, simuliamo una risposta di successo
    res.json({ 
        status: "success", 
        message: `Richiesta di connessione per ${email} ricevuta.` 
    });
;
*/

// Mette il server in ascolto sulla porta 3000
app.listen(port, () => {
    console.log(`Backend in ascolto su http://localhost:${port}`);
});