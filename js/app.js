class GameEngine {
    constructor() {
        this.chat = null;
        this.streamInterval = null;
    }

    init() {
        // Sistemleri ayağa kaldır
        window.state = new GameState();
        this.chat = new LiveChatEngine("chat-feed");

        // UI Eventlerini Dinle
        document.getElementById("btn-create-vtuber").addEventListener("click", () => this.toggleModal(true));
        document.getElementById("btn-cancel-create").addEventListener("click", () => this.toggleModal(false));
        document.getElementById("btn-submit-create").addEventListener("click", () => this.createNewVtuber());
        document.getElementById("btn-start-stream").addEventListener("click", () => this.handleStreamLifecycle());
        document.getElementById("btn-save").addEventListener("click", () => this.saveGame(true));

        // Kayıt Dosyasını Yükle
        this.loadGame();

        // Otomatik Kayıt Döngüsü (60 Saniyede Bir)
        setInterval(() => this.saveGame(false), 60000);

        // Karakter Boşta Durma Diyalog Tetikleyicisi (Rastgele Canlılık)
        setInterval(() => {
            if (state.activeVtuber && !state.isStreaming && Math.random() < 0.4) {
                this.triggerDialogue(state.activeVtuber.personality, "idle");
            }
        }, 15000);
    }

    toggleModal(show) {
        const modal = document.getElementById("creation-modal");
        if (show) {
            modal.classList.remove("hidden");
            setTimeout(() => modal.classList.remove("opacity-0"), 10);
        } else {
            modal.classList.add("opacity-0");
            setTimeout(() => modal.classList.add("hidden"), 300);
        }
    }

    createNewVtuber() {
        const name = document.getElementById("create-name").value.trim();
        const personality = document.getElementById("create-personality").value;
        const hair = document.getElementById("create-hair").value;
        const voice = document.getElementById("create-voice").value;

        if (!name) {
            alert("Lütfen geçerli bir sahne adı girin!");
            return;
        }

        state.activeVtuber = new VTuber(name, personality, hair, voice);
        this.syncVtuberUi();
        state.activeVtuber.renderSkillsUi();
        this.toggleModal(false);
        this.spawnNotification(`Yeni sözleşme imzalandı: ${name}!`, "blue");
    }

    syncVtuberUi() {
        if (!state.activeVtuber) return;
        document.getElementById("vtuber-name").innerText = state.activeVtuber.name;
        document.getElementById("vtuber-meta").innerText = `Kişilik: ${state.activeVtuber.personality} | Ses: ${state.activeVtuber.voice}`;
    }

    trainSkill(skillName) {
        if (!state.activeVtuber) return alert("Önce bir VTuber işe almalısınız!");
        if (state.money < 50) return alert("Yetersiz bütçe! Eğitim için 50 ₺ gerekiyor.");

        state.addMoney(-50);
        // İlgili yeteneğe rastgele 15-30 arası XP ekle
        let gainedXp = Math.floor(Math.random() * 15) + 15;
        state.activeVtuber.addXp(skillName, gainedXp);
    }

    // Canlı Arayüz Altyazı Sistemi (Karakter Konuşma Efekti)
    triggerDialogue(personality, triggerKey) {
        const pData = GAME_DB.personalities[personality];
        if (!pData) return;
        const lines = pData.dialogues[triggerKey];
        const text = lines[Math.floor(Math.random() * lines.length)];

        const bubble = document.getElementById("dialogue-bubble");
        const speaker = document.getElementById("bubble-speaker");
        const textEl = document.getElementById("bubble-text");
        const avatar = document.getElementById("vtuber-avatar");

        speaker.innerText = state.activeVtuber.name;
        textEl.innerText = text;

        // Balonu Göster ve Avatarı Konuşma Animasyonuna Al
        bubble.classList.remove("scale-0");
        avatar.classList.add("avatar-speaking");

        setTimeout(() => {
            bubble.classList.add("scale-0");
            avatar.classList.remove("avatar-speaking");
        }, 4500);
    }

    handleStreamLifecycle() {
        if (!state.activeVtuber) return alert("Yayına çıkacak bir VTuber bulunamadı!");

        const btn = document.getElementById("btn-start-stream");
        if (!state.isStreaming) {
            // Yayını Başlat
            state.isStreaming = true;
            state.currentStreamType = document.getElementById("select-stream-type").value;
            state.liveStats = { viewers: 0, likes: 0, revenue: 0 };

            btn.innerText = "YAYINI KAPAT";
            btn.className = "bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold text-sm py-2 px-4 rounded hover:from-gray-600 transition-all";
            document.getElementById("live-indicator").classList.remove("hidden");

            // Chat'i ve Hesaplama Döngüsünü Ateşle
            let skillLevel = state.activeVtuber.skills[state.currentStreamType]?.level || 1;
            this.chat.startFeed(state.currentStreamType, skillLevel);
            this.triggerDialogue(state.activeVtuber.personality, "streamStart");

            this.streamInterval = setInterval(() => this.processStreamTick(skillLevel), 1000);
        } else {
            // Yayını Sonlandır
            state.isStreaming = false;
            clearInterval(this.streamInterval);
            this.chat.stopFeed();

            // Ödülleri Dağıt ve Kaydet
            let gainedFans = Math.floor(state.liveStats.viewers * 0.2);
            state.addFans(gainedFans);

            // İlgili Yeteneğe Yayın Sonu XP'si Ver
            state.activeVtuber.addXp(state.currentStreamType, 20);

            btn.innerText = "Yayını Başlat";
            btn.className = "bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-sm py-2 px-4 rounded hover:from-red-500 hover:to-amber-500 transition-all uppercase tracking-wider shadow-lg shadow-red-900/20";
            document.getElementById("live-indicator").classList.add("hidden");
            
            alert(`Yayın Bitti!\nKazanılan Hasılat: ${state.liveStats.revenue.toFixed(2)} ₺\nYeni Hayranlar: +${gainedFans}`);
        }
    }

    processStreamTick(skillLevel) {
        // Algoritmik İzleyici ve Beğeni Hesaplaması
        let baseViewers = Math.floor(Math.random() * 50) + 10;
        let perfModifier = skillLevel * 1.3 * state.popularityMultiplier;
        
        state.liveStats.viewers = Math.floor(baseViewers * perfModifier) + state.fans * 0.05;
        state.liveStats.likes += Math.floor(Math.random() * state.liveStats.viewers * 0.1);

        document.getElementById("live-viewers").innerText = Math.floor(state.liveStats.viewers).toLocaleString();
        document.getElementById("live-likes").innerText = state.liveStats.likes.toLocaleString();
    }

    // NPC Ofis Etkileşim Motoru
    triggerNpcInteraction(role) {
        if (role === "Manager") {
            alert("Menajer Daiki: 'Efendim, ajansımızın popülerliğini arttırmak için sosyal medya reklam kampanyası başlatabiliriz. Maliyeti 300 ₺.'");
            if (state.money >= 300) {
                if (confirm("Kampanyayı satın almak istiyor musunuz? (+0.2 Kalıcı Popülerlik Çarpanı)")) {
                    state.addMoney(-300);
                    state.popularityMultiplier += 0.2;
                    state.updateGlobalUi();
                }
            } else {
                alert("Yetersiz bütçe!");
            }
        } else if (role === "Sponsor") {
            alert("Sponsor Temsilcisi: 'Şu an ajans seviyeniz düşük olduğu için aktif kurumsal kontrat bulunmuyor. İtibarı yüksek tutmaya devam edin.'");
        }
    }

    spawnNotification(text, color) {
        // Ekranda estetik bir toast/bildirim uyarısı fırlatır
        console.log(`[PRO-NOTIF] ${text}`);
    }

    // Güvenli Kayıt Mekanizması (Data Loss Engelleme)
    saveGame(manual = false) {
        const saveData = {
            money: state.money,
            fans: state.fans,
            reputation: state.reputation,
            popularityMultiplier: state.popularityMultiplier,
            agencyLevel: state.agencyLevel,
            vtuber: state.activeVtuber ? {
                name: state.activeVtuber.name,
                personality: state.activeVtuber.personality,
                hair: state.activeVtuber.hair,
                voice: state.activeVtuber.voice,
                skills: state.activeVtuber.skills
            } : null
        };

        localStorage.setItem("V_AGENCY_PRO_SAVE", JSON.stringify(saveData));

        if (manual) {
            alert("Oyun başarıyla kaydedildi! İlerlemeniz güvende.");
        } else {
            const toast = document.getElementById("autosave-toast");
            toast.classList.remove("hidden");
            setTimeout(() => toast.classList.add("hidden"), 2000);
        }
    }

    loadGame() {
        const dataStr = localStorage.getItem("V_AGENCY_PRO_SAVE");
        if (!dataStr) return;

        try {
            const data = JSON.parse(dataStr);
            state.money = data.money;
            state.fans = data.fans;
            state.reputation = data.reputation;
            state.popularityMultiplier = data.popularityMultiplier;
            state.agencyLevel = data.agencyLevel;

            if (data.vtuber) {
                state.activeVtuber = new VTuber(data.vtuber.name, data.vtuber.personality, data.vtuber.hair, data.vtuber.voice);
                state.activeVtuber.skills = data.vtuber.skills;
                this.syncVtuberUi();
                state.activeVtuber.renderSkillsUi();
            }

            state.updateGlobalUi();
        } catch (e) {
            console.error("Kayıt dosyası bozuk, sıfırdan başlanıyor.", e);
        }
    }

    modAction(action) {
        if (action === "clear") this.chat.clearFeed();
        if (action === "slow") alert("Yavaş mod aktif edildi (10sn mesaj sınırı).");
    }
}

// Global Motoru Tetikle
const game = new GameEngine();
window.onload = () => game.init();
