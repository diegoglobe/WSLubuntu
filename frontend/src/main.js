// Aspettiamo che l'intera pagina (HTML) sia caricata
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================
    // STEP 1: TROVARE TUTTI GLI ELEMENTI
    // Tutte le 'const' che cercano elementi nell'HTML
    // devono stare qui, all'inizio del 'DOMContentLoaded'.
    // ==========================================================
    
    // Colonna Sinistra
    const dropArea = document.getElementById('drop-area');
    
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

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    dropArea.addEventListener('dragenter', () => dropArea.classList.add('drag-over'));
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('drag-over'));
    dropArea.addEventListener('drop', (e) => {
        dropArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            console.log("File Rilasciati:", files);
            alert("Hai rilasciato " + files[0].name);
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // --- GESTIONE DELLA CHAT ---

    sendButton.addEventListener('click', inviaMessaggio);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            inviaMessaggio();
        }
    });

    function inviaMessaggio() {
        const testoMessaggio = chatInput.value.trim();
        if (testoMessaggio !== "") {
            aggiungiMessaggio(testoMessaggio, 'user');
            chatInput.value = "";
            setTimeout(simulaRispostaBot, 1000);
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

    function simulaRispostaBot() {
        aggiungiMessaggio("Ho analizzato i CV e trovato un profilo interessante.", 'bot');
        aggiungiProfiloFinto();
    }

    function aggiungiProfiloFinto() {
        const nomi = ["Mario Rossi", "Giulia Bianchi", "Luca Verdi", "Anna Neri"];
        const skill = ["React Developer", "Node.js Backend", "UX Designer", "Data Analyst"];
        const ratings = ["Ottimo", "Buono"];

        const nomeCasuale = nomi[Math.floor(Math.random() * nomi.length)];
        const skillCasuale = skill[Math.floor(Math.random() * skill.length)];
        const ratingCasuale = ratings[Math.floor(Math.random() * ratings.length)];

        const li = document.createElement('li');
        li.classList.add('profilo-card');

        const divInfo = document.createElement('div');
        divInfo.classList.add('info');
        divInfo.innerHTML = `<h4>${nomeCasuale}</h4><p>${skillCasuale}</p>`;

        const divRating = document.createElement('div');
        divRating.classList.add('rating', ratingCasuale === "Ottimo" ? 'ottimo' : 'buono');
        divRating.textContent = ratingCasuale;

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
    // Simula il click sulla prima scheda all'avvio
    const primaSchedaEsistente = tabList.querySelector('.tab-item');
    if (primaSchedaEsistente) {
        attivaScheda(primaSchedaEsistente);
    }


}); // <-- QUESTA CHIUDE IL DOMCONTENTLOADED