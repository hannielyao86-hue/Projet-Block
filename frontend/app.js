const CONTRACT_ADDRESS = "0x5FbDB2315678afccb333f8a9c12d9994b6c40a12"; // À remplacer par l'adresse du contrat
let contract;

async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            document.getElementById("walletAddress").innerText = accounts[0];
            
            if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x") {
                alert("⚠️ CONTRACT_ADDRESS est vide ! Déploie le contrat d'abord et remplis l'adresse dans app.js");
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // charger l'ABI depuis le fichier JSON
            const abiResponse = await fetch("ABI.json");
            const abi = await abiResponse.json();
            contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);

            // rafraîchir la liste si un événement est émis
            contract.on("TaskCreated", () => loadTasks());
            contract.on("TaskToggled", () => loadTasks());

            await loadTasks();
        } catch (err) {
            console.error("Connection error", err);
            alert("Erreur de connexion : " + err.message);
        }
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
    } catch (err) {
        console.error("loadTasks error", err);
        alert("Erreur lors du chargement des tâches : " + err.message);
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
