// Global Oyun Durumu (Save-Load Edilebilir Veri Yapısı)
class GameState {
    constructor() {
        this.money = 500.00; // Başlangıç sermayesi
        this.fans = 0;
        this.reputation = 100;
        this.popularityMultiplier = 1.0;
        this.agencyLevel = 1;
        this.agencyXp = 0;
        
        this.activeVtuber = null; // Aktif VTuber nesnesi
        
        this.isStreaming = false;
        this.currentStreamType = null;
        this.liveStats = { viewers: 0, likes: 0, revenue: 0 };
    }

    addMoney(amount) {
        this.money += amount;
        document.getElementById("stat-money").innerText = this.money.toFixed(2) + " ₺";
    }

    addFans(count) {
        this.fans = Math.max(0, this.fans + count);
        document.getElementById("stat-fans").innerText = this.fans.toLocaleString('tr-TR');
    }

    updateGlobalUi() {
        document.getElementById("stat-money").innerText = this.money.toFixed(2) + " ₺";
        document.getElementById("stat-fans").innerText = this.fans.toLocaleString('tr-TR');
        document.getElementById("stat-reputation").innerText = `${this.reputation}/100`;
        document.getElementById("stat-popularity").innerText = `x${this.popularityMultiplier.toFixed(1)}`;
        document.getElementById("agency-level").innerText = `LVL ${this.agencyLevel}`;
    }
}
