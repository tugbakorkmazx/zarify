# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Backend: ASP.NET Core Web API + MySQL (handles auth, payment, RSVP data, and admin-panel data). Frontend: Next.js (React). Payment gateway not yet decided (Turkish market — likely iyzico/PayTR, undecided).

## Users

- **Platform users (davetiye sahipleri / couples):** create an account, buy a premium invitation package, build and edit their own wedding invitation page, view their RSVP results.
- **Guests:** no account. Receive a link to a specific invitation, view event details, and (if the owner has enabled it) submit an RSVP.
- **Operator (the site owner, the user driving this project):** manages all platform users, templates, and payments through a separate admin panel.

## Product Purpose

A SaaS platform for creating and hosting digital wedding invitation pages. A couple pays for a package, builds a personalized invitation from a template (event details, optional RSVP, optional map, custom info sections), and shares it with guests via a link. The couple tracks RSVP responses from their dashboard. Success means a couple can self-serve a working invitation with no developer involved, and a guest can view it and RSVP with zero friction (no account, no login).

## Positioning

A paid, template-based, self-serve wedding invitation builder with built-in RSVP tracking and a bilingual (TR/EN) public-facing page — distinct from a one-off static invitation site because it is multi-tenant (many couples, one platform) and monetized via premium packages.

## Operating Context

- Couples log into a dashboard to build/edit their invitation, purchase a package, and monitor RSVP responses.
- Guests open a public invitation page from a shared link — no login — and optionally submit an RSVP.
- The operator manages users, templates, and payments from a separate admin panel.

## Capabilities and Constraints

- Multi-tenant: each customer (couple) owns one or more invitation pages built from templates.
- Auth applies to platform users (couples) and the operator's admin panel only; guests never authenticate.
- Payment: premium invitation packages are purchased through the backend. Gateway undecided.
- RSVP is optional per invitation — the owner can turn the RSVP form on or off for their page.
- Venue info only requires plain text (name/address); a map link or embed is an optional add-on, never required.
- Per-invitation custom free-text info blocks: dress code, gift list, directions, accommodation suggestions.
- Countdown timer to the event date.
- Bilingual: Turkish + English.
- No real event content (names, dates, venues) exists yet — build against placeholder content until supplied.

## Brand Commitments

None established yet.

## Evidence on Hand

No real content yet. Placeholder couple names, dates, and venues will be used until real wedding details are supplied. Future work must not fabricate real testimonials, customer names, or press mentions.

## Product Principles

1. A guest never needs an account or password to view an invitation or RSVP — that friction defeats the product's purpose.
2. Every invitation is self-serve: an owner builds, edits, and manages their page without developer help.
3. Optional features (map embed, RSVP form) default to simple and off; plain text and no-RSVP must always work as a valid configuration.
4. Payment and account management stay behind the owner-facing dashboard; the public guest-facing page stays free of monetization or auth friction.
5. Turkish and English are both first-class languages, not a bolt-on translation layer.

## Accessibility & Inclusion

Not yet established.

## Gelecek Fikirler / Roadmap

Henüz kapsam dışı, sadece not düşülüyor — planlanmadı, tasarlanmadı, uygulanmadı:

### Yayına çıkmak için gerekenler

- **Ödeme akışı:** paket satın alma ve ödeme adımı (ödeme sağlayıcısı henüz seçilmedi — iyzico/PayTR adayları).
- **Yayından sonra düzenleme:** davetiye sahibinin yayındaki davetiyesinin bilgilerini panelden güncelleyebilmesi.
- **Hukuki sayfalar:** Gizlilik Politikası, Kullanım Şartları, İade Politikası.
- **Production hosting, domain ve veritabanı planı:** uygulamanın ve MySQL veritabanının nerede barındırılacağı, alan adı, yedekleme.
- **Güvenilen proxy adresi (hosting'e karar verilince):** API'nin önündeki reverse proxy'nin IP'si veya ağı `appsettings.Production.json` → `ForwardedHeaders:KnownProxies` / `KnownNetworks` içine yazılmalı. Boş kalırsa yalnızca aynı makinedeki proxy'ye güvenilir; proxy başka bir makinedeyse rate limit'ler tüm ziyaretçileri tek IP gibi sayar.
- **Production sırları ortam değişkeni olarak:** `Jwt__Key` (en az 32 bayt, rastgele), `ConnectionStrings__Default` ve `Payment__*` (IBAN vb.) sunucuda ortam değişkeni olarak tanımlanmalı; repoda yer almazlar. `Jwt__Key` yoksa API başlamaz.
- **Şifre sıfırlama akışı:** "şifremi unuttum" ile e-posta üzerinden yeni şifre belirleme.
- **E-posta gönderimi:** şifre sıfırlama, hesap ve ödeme bildirimleri gibi işlemsel e-postalar için altyapı.
- **Admin paneli:** operatörün kullanıcıları, şablonları ve ödemeleri yönettiği ayrı panel.

### Davetiye özellikleri

- **Takvime ekle:** misafirin etkinliği tek dokunuşla kendi takvimine ekleyebilmesi.
- **Harita linki:** mekan için isteğe bağlı harita / yol tarifi linki (düz metin adres her zaman yeterli kalır).
- **Fotoğraf yükleme:** davetiye sahibinin kendi fotoğraflarını (galeri, hikâye bölümü) yükleyebilmesi.
- **Çoklu etkinlik desteği:** tek davetiyede birden fazla etkinlik (ör. Nikah + Düğün, Kına + Nişan), her biri kendi tarih/saat/mekanıyla.
- **Hatıra defteri:** misafirlerin iyi dilek mesajı bırakabilmesi; davetiye sahibi mesajları gösterip gizleyebilir.
- **Anı albümü:** misafirlerin etkinlik fotoğrafı, video veya sesli not yükleyebilmesi; davetiye sahibi panelden görüntüleyip indirebilir.
- **Müzik:** davetiye sayfasına arka plan müziği / ses ekleme seçeneği.
- **QR studio:** basılı/fiziksel davetiyeyi dijital sayfaya bağlayan QR kod üretimi ve dışa aktarımı.

### Büyüme

- **Katmanlı fiyatlandırma:** tek paket yerine birden çok fiyat/özellik seviyesi (ör. temel/premium).
- **TikTok/Instagram otomatik video:** davetiye bilgilerinden otomatik kısa video/reel üretimi.
- **Organizasyon firması affiliate sistemi:** düğün organizasyon firmaları için yönlendirme/komisyon mekanizması.
- **Canlı demo linki:** potansiyel müşterilere gösterilecek, gerçek veriyle önceden hazırlanmış bir örnek davetiye linki.
