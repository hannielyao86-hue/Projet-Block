// Adresse du contrat (à remplacer après déploiement)
// **IMPORTANT** : ce n'est pas l'URL du nœud, mais l'adresse Ethereum du contrat
// Exemple : const CONTRACT_ADDRESS = "0xAbC123...";
const CONTRACT_ADDRESS = "";
let contract;

async function connectWallet() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        document.getElementById("walletAddress").innerText = accounts[0];
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // charger l'ABI depuis le fichier JSON
        const abiResponse = await fetch("ABI.json");
        const abi = await abiResponse.json();
        contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        // rafraîchir la liste si un événement est émis
        contract.on("TaskCreated", () => loadTasks());
        contract.on("TaskToggled", () => loadTasks());

        await loadTasks();
    } else {
        alert("MetaMask non détecté. Installez une extension Ethereum-compatible.");
    }
}

async function loadTasks() {
    if (!contract) return;
    try {
        const count = await contract.taskCount();
        const list = document.getElementById("taskList");
        list.innerHTML = "";

        for (let i = 1; i <= count; i++) {
            const task = await contract.tasks(i);
            const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
            showLoader(true);
            try {
                const tx = await contract.toggleCompleted(task.id);
                await tx.wait();
                await loadTasks();
            } catch (err) {
                console.error("toggleCompleted failed", err);
                alert("Erreur lors du changement d'état : " + err.message);
            } finally {
                showLoader(false);
            }
        });

        const span = document.createElement("span");
        span.textContent = task.content;
        if (task.completed) span.classList.add("completed");

        li.appendChild(checkbox);
        li.appendChild(span);
        list.appendChild(li);
    }
}

async function addTask() {
    const input = document.getElementById("taskInput");
    const content = input.value.trim();
    if (!content) return;
    showLoader(true);
    try {
        const tx = await contract.createTask(content);
        await tx.wait();
        input.value = "";
        await loadTasks();
    } catch (err) {
        console.error("createTask failed", err);
        alert("Erreur lors de l'ajout : " + err.message);
    } finally {
        showLoader(false);
    }
}

function showLoader(visible) {
    document.getElementById("loader").style.display = visible ? "block" : "none";
}

// écouteurs d'événements du DOM
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("connectBtn").addEventListener("click", connectWallet);
    document.getElementById("addTaskBtn").addEventListener("click", addTask);
});
