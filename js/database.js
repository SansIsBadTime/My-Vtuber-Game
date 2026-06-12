// Oyun İçi Statik Veri Havuzu
const GAME_DB = {
    // Kişilik Matrisleri ve Özel Diyalog Tetikleyicileri
    personalities: {
        "Enerjik": {
            bonusSkill: "performance",
            dialogues: {
                idle: ["Millet! Bugün enerji patlaması yaşıyorum, yerimde duramıyorum!", "Hadi hemen yayına girelim!"],
                levelUp: ["Gittikçe daha da güçleniyorum! Kimse beni durduramaz!", "Level UP! UUUOOOOHHH!"],
                streamStart: ["YAYIN BAŞLADI! Hoş geldiniz millet, enerjinizi hazırlayın!"],
                donation: ["Aman Tanrım! Bu büyük bağış da ne?! Teşekkürler şef!"]
            }
        },
        "Utangaç": {
            bonusSkill: "asmr",
            dialogues: {
                idle: ["Şey... Acaba bugün konuşma pratiği mi yapsak?", "Çok fazla insan bakınca heyecanlanıyorum..."],
                levelUp: ["B-bana inandığınız için teşekkür ederim... Başardım sanırım."],
                streamStart: ["M-merhaba arkadaşlar... Yayına hoş geldiniz... Kesintisiz ses..."],
                donation: ["B-bu kadar parayı hak edecek ne yaptım bilmiyorum... Teşekkürler..."]
            }
        },
        "Kaotik": {
            bonusSkill: "comedy",
            dialogues: {
                idle: ["Bugün hangi kuralı çiğnesek acaba? Hehehe.", "Dünyayı ateşe vermeye hazır mısınız?"],
                levelUp: ["GÜÇ! DAHA FAZLA GÜÇ! Artık tam bir canavarım!"],
                streamStart: ["Selam ezikler! Kaosun tam merkezine hoş geldiniz!"],
                donation: ["PARAAAR! İşte şimdi gerçek bir patron gibi harcayabilirim!"]
            }
        },
        "Profesyonel": {
            bonusSkill: "chatting",
            dialogues: {
                idle: ["Haftalık yayın planım hazır. Lütfen zamanında burada olun.", "Ajansımızın prestiji her şeyden önce gelir."],
                levelUp: ["Gelişim raporlarım olumlu. Hedeflerimize bir adım daha yaklaştık."],
                streamStart: ["İyi günler. Bugün planlandığı gibi gündem konularını ele alacağız."],
                donation: ["Desteğiniz için minnettarım. Ajans bütçesine katkınız kaydedildi."]
            }
        }
    },

    // Chat İsim Havuzu ve Hazır Mesaj Şablonları
    chatUsernames: ["Yusufcan_99", "Nuh_TheMod", "Iris_Rabiya", "KoboFanboy", "Gura_Ch", "WinstonSmoker", "RedBullAddict", "SimpMaster", "V_Lover", "DeadCellsGod"],
    chatMessages: {
        chatting: [
            "Bu hikayeyi ilk defa duyuyorum, çok iyi!",
            "Eee sonra ne olmuş??",
            "She is so cute omg Kreygasm",
            "Chat yavaş akıyor biraz hype beyler!",
            "Gülmekten sandalyeden düştüm lulw"
        ],
        gaming: [
            "OHA O NASIL BİR CLUTCHTI??",
            "POGGERS! Profesyonel esporcu resmen.",
            "Aga vuramıyorsun ya kolsuz musun Pog",
            "CRR (Clan Reroll) at be abi bu hesap uğursuz.",
            "Dead Cells 2500 run hedefine az kaldı!"
        ],
        singing: [
            "Melek sesi resmen... VoHiYo",
            "Tüylerim diken diken oldu.",
            "Mori Calliope halt etmiş, bu ne ses!",
            "Kobo Kanaeru’dan sonraki favori şarkıcım net.",
            "Encore! Encore! 👏👏"
        ],
        asmr: [
            "Uykum geldi çok rahatlatıcı...",
            "Kulaklığımın sağ tarafı titriyor harika",
            "Şu an cennetteyim sanırım.",
            "Lütfen tırnak tıklatma sesini daha çok yap.",
            "Kafamın içi karıncalanıyor..."
        ]
    }
};
