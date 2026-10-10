# Görsel Kaynakları (ASSETS)

Sitede gösterilen her görsel `frontend/public/images/art/` altındadır ve `frontend/src/lib/art.ts` içinde kayıtlıdır. Bu listede olmayan bir görsel sayfaya konmaz (DESIGN.md → Imagery). Yeni bir görsel eklendiğinde bu dosyaya da bir satır eklenmelidir.

> **Durum:** Tablolar, kâğıt ve dokular **yapay zekâ ile üretildi**. Kesin araç, model ve istem (prompt) bilgileri kayıt altına alınmamıştı. Bilinmeyen alanlar aşağıda **doldurulacak** olarak bırakıldı. Kullanım Şartları'ndaki "şablonlar kopyalanamaz" maddesi ve olası telif soruları için bu alanların doldurulması önerilir.

## Özet

| Konu | Bilgi |
|---|---|
| Üretim yöntemi | Yapay zekâ ile görsel üretimi |
| Araç / model | **doldurulacak**. Muhtemelen ChatGPT (OpenAI) görsel üretimi: aynı dönemdeki ham dosyalar `zarify-yeni-gorseller/` klasöründe "ChatGPT Image …" adıyla duruyor, piksel boyutları da ChatGPT çıktılarıyla uyumlu. Teyit edilmeli. |
| Üretim tarihi | 27–28 Eylül 2026 (ham dosya adları ve repoya eklenme tarihi). Kesin tarih **doldurulacak**. |
| İstemler (prompt) | **doldurulacak** |
| Hesap / lisans koşulları | **doldurulacak**. Hangi hesapla üretildiği ve aracın o tarihteki kullanım koşullarının ticari kullanıma izin verdiği not edilmeli. |
| Düzenleme | WebP'ye dönüştürme ve boyutlandırma: 28 Eylül 2026, commit "Add the oil-painting art set as optimised WebP" |
| Kamu malı eser kullanımı | Bilinen yok. Tablolar gerçek bir sanatçının belirli bir eserinin kopyası değil, üslup olarak "eski yağlı boya" tarzında üretildi. **Teyit edilecek.** |

## Dosyalar

| Dosya | Boyut (px) | Ne | Kaynak |
|---|---|---|---|
| `swan-lake.webp` | 1672×940 | Sisli gölde iki kuğu, yağlı boya | Yapay zekâ — araç/istem doldurulacak |
| `swan-lake-portrait.webp` | 941×1672 | Aynı sahnenin dikey hâli | Yapay zekâ — doldurulacak |
| `pastoral-sunset.webp` | 1672×940 | Nehir kıyısında gün batımı | Yapay zekâ — doldurulacak |
| `still-life-letters.webp` | 1672×941 | Mektuplar ve zambaklarla natürmort | Yapay zekâ — doldurulacak |
| `still-life-letters-portrait.webp` | 940×1672 | Aynı natürmortun dikey hâli | Yapay zekâ — doldurulacak |
| `swan-closeup.webp` | 1122×1402 | Karanlık suda tek kuğu | Yapay zekâ — doldurulacak |
| `still-life-dark-florals.webp` | 1122×1402 | Koyu zeminde güller ve zambaklar | Yapay zekâ — doldurulacak |
| `lace-card.webp` | 433×577 | Dantel kenarlı fildişi kart | Yapay zekâ — doldurulacak |
| `gilded-frame-rect.webp` | 433×577 | Yaldızlı dikdörtgen çerçeve (saydam iç) | Yapay zekâ — doldurulacak |
| `gilded-frame-oval.webp` | 433×577 | Yaldızlı oval çerçeve (saydam iç) | Yapay zekâ — doldurulacak |
| `dried-rose-branch.webp` | 500×500 | Kurutulmuş gül dalı | Yapay zekâ — doldurulacak |
| `paper-ivory.webp` | 1254×1254 | Fildişi kâğıt dokusu (döşenebilir) | Yapay zekâ — doldurulacak |
| `texture-wine.webp` | 445×792 | Bordo bant dokusu | Yapay zekâ — doldurulacak |
| `texture-olive.webp` | 900×900 | Kabartmalı çiçekli zeytin dokusu | Yapay zekâ — doldurulacak |

## Simgeler (favicon)

| Dosya | Ne | Kaynak |
|---|---|---|
| `frontend/src/app/favicon.ico` (16/32/48), `icon.png` (512), `apple-icon.png` (180), `frontend/public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | Fildişi zemin üzerinde bordo "Z" monogramı, çift çizgi çerçeve | 10 Ekim 2026'da bir betikle (Python/Pillow) çizildi. Yazı tipi **Gloock** (SIL Open Font License 1.1, © 2022 The Gloock Project Authors; google/fonts deposundan). Renkler DESIGN.md'den. |

## Yazı tipleri

Gloock, EB Garamond ve Pinyon Script `next/font/google` ile siteye gömülür; üçü de SIL Open Font License 1.1 ile lisanslıdır.

## Kullanılmayan / arşiv

- `gorseller/` (arşivi `gorseller/_arsiv/`): önceki gravür/herbaryum seti ve tasarım sırasında indirilen ham görseller. Lisanslı değil, sitede kullanılmıyor, `.gitignore` ile repo dışında.
- `zarify-yeni-gorseller/`: yeni setin ham "ChatGPT Image …" dosyaları. `.gitignore` ile repo dışında. Üretim tarihini ve aracı teyit etmek için kaynak olarak saklanabilir.
