// Aspettiamo che l'intera pagina (HTML) sia caricata
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // STEP 1: TROVARE TUTTI GLI ELEMENTI
    // Tutte le 'const' che cercano elementi nell'HTML
    // devono stare qui, all'inizio del 'DOMContentLoaded'.
    // ==========================================================
    
    // Colonna Sinistra
    const dropArea = document.getElementById('drop-area');
    const fileListContainer = document.getElementById('file-list-container');
    const fileList = document.getElementById('file-list');
    const uploadButton = document.getElementById('upload-button');
    const bottoneCarica = document.getElementById('bottone-carica'); // Per il click "Seleziona File"
    const fileInput = document.getElementById('file-input'); // L'input file nascosto
    const showEmailModalButton = document.getElementById('show-email-modal-button');
    const emailModal = document.getElementById('email-modal');
    const closeModalButton = document.getElementById('close-modal-button');
    const emailForm = document.getElementById('email-form');
    
    // Colonna Centrale
    const chatDisplay = document.getElementById('chat-display');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    
    // Colonna Destra
    const listaProfili = document.getElementById('lista-profili');
    const sendThanksButton = document.getElementById('send-thanks-button');
    
    // Header (Schede)
    const tabList = document.querySelector('.tab-list');
    const addTabButton = document.getElementById('add-tab-button');


    // ==========================================================
    // STEP 2: FUNZIONI E ASCOLTATORI DI EVENTI
    // ==========================================================

    // --- GESTIONE DEL "DRAG-AND-DROP" ---

    let fileBuffer = []; // Un "buffer" temporaneo per i file

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    dropArea.addEventListener('dragenter', () => dropArea.classList.add('drag-over'));

    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));

    dropArea.addEventListener('drop', (e) => {
        dropArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            fileBuffer.push(...files); // Aggiunge i nuovi file al buffer
            aggiornaListaFile(); // CHIAMA LA NUOVA FUNZIONE
        }
    });

    function aggiornaListaFile() {
        fileList.innerHTML = ""; // Pulisci la lista
        if (fileBuffer.length > 0) {
            fileListContainer.style.display = 'block';
            uploadButton.classList.remove('hidden');
            fileBuffer.forEach(file => {
                const li = document.createElement('li');
                li.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
                fileList.appendChild(li);
            });
        } else {
            fileListContainer.style.display = 'none';
            uploadButton.classList.add('hidden');
        }
    }

    uploadButton.addEventListener('click', () => {
        if (fileBuffer.length > 0) {
            alert(`Azione simulata: Caricamento di ${fileBuffer.length} file...`);
            // Qui in futuro chiameremo il backend per l'upload
            fileBuffer = [];
            aggiornaListaFile();
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // --- GESTIONE CLICK "SELEZIONA FILE" ---

    // 1. Quando l'utente clicca il *nostro* pulsante...
    bottoneCarica.addEventListener('click', () => {
        fileInput.click(); // ...noi clicchiamo *l'input nascosto*.
    });

    // 2. Quando l'utente ha scelto i file dall'input nascosto...
    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files);
        if (files.length > 0) {
            fileBuffer.push(...files); // Li aggiungiamo al buffer
            aggiornaListaFile(); // Aggiorniamo la UI
        }
        fileInput.value = null; // Pulisce l'input
    });

    // --- GESTIONE DELLA CHAT ---

    sendButton.addEventListener('click', inviaMessaggio);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            inviaMessaggio();
        }
    });

    function inviaMessaggio() {
        console.log("CLICK! Funzione partita."); // Messaggio di test
        const testoMessaggio = chatInput.value.trim();
        if (testoMessaggio !== "") {
            aggiungiMessaggio(testoMessaggio, 'user');
            chatInput.value = "";
            chiamaBackend(testoMessaggio); // Chiama il backend
        }
    }

    async function chiamaBackend(messaggio) {
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messaggio: messaggio })
            });
            const data = await response.json();
            aggiungiMessaggio(data.testo, 'bot');
            aggiungiProfilo(data.profilo);
        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            aggiungiMessaggio("Ops, c'è stato un errore con il server.", 'bot');
        }
    }

    function aggiungiMessaggio(testo, tipo) {
        const p = document.createElement('p');
        p.textContent = testo;
        const div = document.createElement('div');
        div.classList.add('message', tipo);
        div.appendChild(p);
        chatDisplay.appendChild(div);
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }

    // --- GESTIONE OUTPUT (Profili e Bot) ---

    function aggiungiProfilo(profilo) {
        const li = document.createElement('li');
        li.classList.add('profilo-card');
        const divInfo = document.createElement('div');
        divInfo.classList.add('info');
        divInfo.innerHTML = `<h4>${profilo.nome}</h4><p>${profilo.skill}</p>`;
        const divRating = document.createElement('div');
        divRating.classList.add('rating');
        divRating.textContent = profilo.rating;
        if (profilo.rating === "Ottimo") {
            divRating.classList.add('ottimo');
        } else {
            divRating.classList.add('buono');
        }
        li.appendChild(divInfo);
        li.appendChild(divRating);
        listaProfili.appendChild(li);
    }

    // Pulsante Email Ringraziamento
    sendThanksButton.addEventListener('click', () => {
        alert("Azione simulata: Invio email di ringraziamento a tutti i candidati in lista!");
    });

    // --- GESTIONE SCHEDE (TAB) ---

    tabList.addEventListener('click', (e) => {
        if (e.target.classList.contains('close-tab')) {
            const tabDaChiudere = e.target.parentElement;
            tabDaChiudere.remove();
            if (tabDaChiudere.classList.contains('active')) {
                const primaScheda = tabList.querySelector('.tab-item');
                if (primaScheda) {
                    attivaScheda(primaScheda);
                } else {
                    chatDisplay.innerHTML = '<div class="message bot"><p>Apri una nuova scheda per iniziare.</p></div>';
                    listaProfili.innerHTML = "";
                }
            }
        } else if (e.target.classList.contains('tab-item')) {
            attivaScheda(e.target);
        }
    });

    addTabButton.addEventListener('click', () => {
        const nomeRuolo = prompt("Inserisci il nome della nuova posizione:");
        if (nomeRuolo && nomeRuolo.trim() !== "") {
            const nuovaScheda = document.createElement('li');
            nuovaScheda.classList.add('tab-item');
            nuovaScheda.dataset.role = nomeRuolo;
            nuovaScheda.innerHTML = `${nomeRuolo} <span class="close-tab">×</span>`;
            tabList.appendChild(nuovaScheda);
            attivaScheda(nuovaScheda);
        }
    });

    function attivaScheda(schedaDaAttivare) {
        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.classList.remove('active');
        });
        schedaDaAttivare.classList.add('active');
        const ruoloSelezionato = schedaDaAttivare.dataset.role;
        chatDisplay.innerHTML = ""; // Svuota chat
        listaProfili.innerHTML = ""; // Svuota profili
        aggiungiMessaggio(`Ciao! Ora stiamo cercando profili per: "${ruoloSelezionato}". Dimmi i requisiti.`, 'bot');
    }

    // --- INIZIALIZZAZIONE ---
    const primaSchedaEsistente = tabList.querySelector('.tab-item');
    if (primaSchedaEsistente) {
        attivaScheda(primaSchedaEsistente);
    }

    // --- GESTIONE MODAL EMAIL ---
    
    showEmailModalButton.addEventListener('click', () => {
        emailModal.classList.remove('hidden');
    });

    closeModalButton.addEventListener('click', () => {
        emailModal.classList.add('hidden');
    });

    emailModal.addEventListener('click', (e) => {
        if (e.target === emailModal) {
            emailModal.classList.add('hidden');
        }
    });

    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const email = document.getElementById('email-address').value;
        const password = document.getElementById('email-password').value;
        const server = document.getElementById('email-imap-server').value;
        try {
            const response = await fetch('http://localhost:3000/api/connect-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    server: server
                })
            });
            const data = await response.json();
            alert(data.message); 
            emailModal.classList.add('hidden');
            emailForm.reset();
        } catch (error) {
            console.error("Errore nell'invio dati email:", error);
            alert("Errore: impossibile contattare il server.");
        }
    });

}); // <-- QUESTA È LA PARENTESI FINALE CHE CHIUDE TUTTO