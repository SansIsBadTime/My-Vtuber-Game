class VTuber {
    constructor(name, personality, hair, voice) {
        this.name = name;
        this.personality = personality;
        this.hair = hair;
        this.voice = voice;
        
        // Yetenek Ağacı Tanımlaması (İstenen yetenekler ve MAX LEVEL Sınırı)
        this.skills = {
            gaming:     { level: 1, xp: 0, maxXp: 100, maxLevel: 10, label: "Gaming" },
            singing:    { level: 1, xp: 0, maxXp: 100, maxLevel: 10, label: "Singing" },
            chatting:   { level: 1, xp: 0, maxXp: 100, maxLevel: 10, label: "Chatting (Sohbet)" }, // Yeni eklenen sistem
            comedy:     { level: 1, xp: 0, maxXp: 120, maxLevel: 5,  label: "Comedy" },
            performance:{ level: 1, xp: 0, maxXp: 150, maxLevel: 5,  label: "Performance" },
            asmr:       { level: 1, xp: 0, maxXp: 100, maxLevel: 5,  label: "ASMR" }
        };
    }

    // Yeteneğe Güvenli Bir Şekilde XP Ekleme (Bug Fix & Cap Kontrolü)
    addXp(skillName, amount) {
        let sk = this.skills[skillName];
        if (!sk) return;

        // EĞER MAKSİMUM SEVİYEYE ULAŞILDIYSA XP KAZANIMINI ENGELLE
        if (sk.level >= sk.maxLevel) {
            sk.xp = 0; // Taşmayı önle
            this.renderSkillsUi();
            return;
        }

        sk.xp += amount;

        // Seviye Atlama Döngüsü
        while (sk.xp >= sk.maxXp && sk.level < sk.maxLevel) {
            sk.xp -= sk.maxXp;
            sk.level++;
            sk.maxXp = Math.floor(sk.maxXp * 1.5); // Zorluk eğrisi artışı
            
            // Konuşma Tetikleyicisi
            game.triggerDialogue(this.personality, "levelUp");
            game.spawnNotification(`${this.name}, ${sk.label} yeteneğinde seviye atladı!`, "purple");

            if (sk.level === sk.maxLevel) {
                sk.xp = 0;
                break;
            }
        }

        this.renderSkillsUi();
    }

    // Dinamik Arayüz Güncelleme (Max Level ise Buton Pasifleştirme)
    renderSkillsUi() {
        const container = document.getElementById("skills-container");
        if (!container) return;
        container.innerHTML = "";

        for (let key in this.skills) {
            let sk = this.skills[key];
            let isMax = sk.level >= sk.maxLevel;
            let progressPercent = isMax ? 100 : (sk.xp / sk.maxXp) * 100;

            let skillCard = document.createElement("div");
            skillCard.className = "bg-[#0b0c10] border border-[#1f2833] p-3 rounded-lg flex flex-col gap-1.5";
            
            skillCard.innerHTML = `
                <div class="flex justify-between items-center text-xs">
                    <span class="font-bold text-white">${sk.label}</span>
                    <span class="font-mono font-bold ${isMax ? 'text-amber-400 animate-pulse' : 'text-[#45f3ff]'}" id="lvl-${key}">
                        ${isMax ? 'MAX LEVEL' : 'LVL ' + sk.level}
                    </span>
                </div>
                <!-- Progress Bar -->
                <div class="w-full bg-[#151a23] h-2 rounded-full overflow-hidden border border-[#1f2833]">
                    <div class="h-full bg-gradient-to-r from-[#45f3ff] to-[#d154ff] transition-all duration-300" style="width: ${progressPercent}%"></div>
                </div>
                <div class="flex justify-between items-center mt-1">
                    <span class="text-[10px] text-gray-500 font-mono">${isMax ? '0/0 XP' : sk.xp + '/' + sk.maxXp + ' XP'}</span>
                    <button onclick="game.trainSkill('${key}')" ${isMax ? 'disabled' : ''} 
                        class="text-[10px] px-2 py-1 rounded font-bold transition-all ${
                            isMax 
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' 
                            : 'bg-[#45f3ff]/10 hover:bg-[#45f3ff] text-[#45f3ff] hover:text-black border border-[#45f3ff]/30'
                        }">
                        ${isMax ? 'KİLİTLİ' : '<i class="fa-solid fa-bolt"></i> Geliştir (50 ₺)'}
                    </button>
                </div>
            `;
            container.appendChild(skillCard);
        }
    }
}
