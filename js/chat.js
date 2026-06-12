class LiveChatEngine {
    constructor(feedElementId) {
        this.feed = document.getElementById(feedElementId);
        this.intervals = [];
    }

    startFeed(streamType, vtuberPerformance) {
        this.clearFeed();
        document.getElementById("chat-status-dot").className = "w-2 h-2 bg-red-500 animate-pulse";
        
        // İzleyici sayısına göre chat akış hızı (Algoritmik)
        let spawnRate = Math.max(300, 2000 - (vtuberPerformance * 100));

        let chatTimer = setInterval(() => {
            this.generateRandomMessage(streamType);
        }, spawnRate);

        let donationTimer = setInterval(() => {
            this.generateDonationMessage();
        }, spawnRate * 4);

        this.intervals.push(chatTimer, donationTimer);
    }

    stopFeed() {
        this.intervals.forEach(clearInterval);
        this.intervals = [];
        document.getElementById("chat-status-dot").className = "w-2 h-2 bg-gray-500";
        this.feed.innerHTML = `<div class="text-center text-xs text-gray-600 italic">Yayın kapandı. Chat geçmişi temizlendi.</div>`;
    }

    clearFeed() {
        this.feed.innerHTML = "";
    }

    generateRandomMessage(type) {
        let user = GAME_DB.chatUsernames[Math.floor(Math.random() * GAME_DB.chatUsernames.length)];
        let messagesPool = GAME_DB.chatMessages[type] || GAME_DB.chatMessages.chatting;
        let text = messagesPool[Math.floor(Math.random() * messagesPool.length)];

        let div = document.createElement("div");
        div.className = "chat-msg text-xs bg-[#151a23]/30 p-1.5 rounded border border-[#1f2833]/50";
        div.innerHTML = `<span class="text-[#45f3ff] font-bold mr-1">${user}:</span> <span class="text-gray-300">${text}</span>`;
        
        this.appendAndScroll(div);
    }

    generateDonationMessage() {
        if (!state.isStreaming) return;
        let user = GAME_DB.chatUsernames[Math.floor(Math.random() * GAME_DB.chatUsernames.length)];
        let amount = (Math.random() * 150 + 10).toFixed(2);
        
        // State'e parayı ve yayının hasılatına ekle
        state.addMoney(parseFloat(amount));
        state.liveStats.revenue += parseFloat(amount);
        document.getElementById("live-revenue").innerText = state.liveStats.revenue.toFixed(2) + " ₺";

        let div = document.createElement("div");
        div.className = "chat-msg text-xs bg-gradient-to-r from-amber-600/30 to-yellow-600/10 p-2 rounded border border-amber-500 neon-glow-purple";
        div.innerHTML = `
            <div class="flex justify-between font-bold text-amber-400">
                <span>💰 SÜPER CHAT!</span>
                <span>${amount} ₺</span>
            </div>
            <div class="text-white italic mt-0.5">"${user} yayıncıyı sonuna kadar destekliyor!"</div>
        `;
        
        this.appendAndScroll(div);
        game.triggerDialogue(state.activeVtuber.personality, "donation");
    }

    appendAndScroll(element) {
        this.feed.appendChild(element);
        if (this.feed.children.length > 30) {
            this.feed.removeChild(this.feed.firstChild);
        }
        this.feed.scrollTop = this.feed.scrollHeight;
    }
}
