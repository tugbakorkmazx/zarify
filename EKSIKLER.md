# Zarify — Canlıya Çıkış Öncesi Eksikler Raporu

_Tarih: 8 Ekim 2026 · Kapsam: `frontend/`, `backend/Zarify.Api/`, migration'lar, yasal metinler, DESIGN.md · Bu rapor için hiçbir kod değiştirilmedi._

## Özet

- **Build durumu temiz:** `dotnet build` → 0 uyarı, 0 hata. `npm run build` → başarılı (18 route). `eslint .` → çıktı yok (temiz).
- **Kodda** TODO, FIXME, `console.log`, `debugger` ya da hardcoded secret **yok**. JWT anahtarı, bağlantı cümlesi ve IBAN repo dışında tutuluyor; yoksa uygulama açılışta hata veriyor.
- **Uçtan uca akış çalışıyor:** kayıt → bilgi formu → şablon önizleme → yayınla (sözleşme onayı) → ödeme bilgileri → admin onayı → misafir sayfası → RSVP → panelde yanıtlar. Frontend'in çağırdığı 11 endpoint'in hepsi backend'de var, istek ve cevap alanları birbiriyle uyuşuyor.
- **Asıl eksikler ürün ve yasal tarafta:** e-posta altyapısı hiç yok (şifre sıfırlama, bildirim gönderilemiyor). Silme/iptal işlemleri yok. Yasal metinlerdeki şirket bilgileri boş. Yasal metinlerin söz verdiği bazı süreçlerin (veri silme süreleri, siparişi iptal etme, ödeme kaydı tutma) kodda karşılığı yok.

### Endpoint eşleşme tablosu

| Frontend çağrısı | Backend | Durum |
|---|---|---|
| `POST /api/auth/register`, `POST /api/auth/login` (`lib/auth.tsx`) | `AuthController` | ✅ |
| `GET /api/auth/me` | `AuthController.Me` | ⚠️ Backend'de var, frontend hiç çağırmıyor |
| `POST /api/invitations` (`lib/invitations.ts`) | `InvitationsController.Create` | ✅ |
| `PUT /api/invitations/{id}` | `Update` | ✅ |
| `GET /api/invitations/{slug}` | `GetBySlug` | ✅ |
| `GET /api/invitations/{id}/payment` | `Payment` | ✅ |
| `GET /api/invitations/mine` | `Mine` | ✅ |
| `GET /api/invitations/{id}/rsvps` | `Rsvps` | ✅ |
| `POST /api/rsvp` (`components/invitation/RsvpSection.tsx`) | `RsvpController.Create` | ✅ |
| `GET /api/pricing` (`lib/pricing.ts`) | `PricingController` | ✅ |
| `GET /api/admin/invitations/pending-payment`, `POST …/approve-payment` (`lib/admin.ts`) | `AdminController` | ✅ |

### ✅ Bu turda ek olarak düzeltilen
- **API tarihleri saat dilimi olmadan gidiyordu:** MySQL'den gelen UTC zamanlar "Z" eki olmadan dönüyordu. Tarayıcı bunları yerel saat sandığı için, örneğin admin panelindeki "Oluşturulma" saati 3 saat geride görünüyordu. `Services/UtcDateTimeConverter.cs` ile bütün tarihler artık "Z" ekiyle gönderiliyor.
- **Yeni migration:** `20261008114041_OrderAmountAgreementsRsvpTokens`. Değişiklikleri:
  - `Invitations.AmountTry` kolonu.
  - `SalesAgreements` tablosu.
  - `Rsvps.EditTokenHash` kolonu ve benzersiz index.
  - (InvitationId, GuestNameKey) index'i artık benzersiz değil.
  - Mevcut kayıtlar için fiyat (199,90) ve sözleşme kayıtları dolduruldu.

---

## 🔴 Canlıya çıkmadan şart

### 1. Yasal metinlerdeki şirket bilgileri boş, "Taslak" uyarısı açık
- **Sorun:** Unvan, adres, vergi dairesi/no, e-posta, telefon, yetkili mahkeme, barındırma sağlayıcısı ve **davetiyenin yayında kalacağı süre** gibi alanların hepsi `null`. Bu yüzden yedi yasal sayfanın hepsinde kırmızı `[ŞİRKET UNVANI]` gibi yer tutucular görünüyor. `showDraftNotice: true` olduğu için her sayfanın başında "Taslak" kutusu da çıkıyor. Mesafeli Satış Sözleşmesi bu hâliyle hukuken eksik; satıcı bilgisi olmadan satış yapılamaz.
- **Dosya:** `frontend/src/lib/legal.ts` (`business`, `legalSettings.showDraftNotice`)
- **Ek:** Metinlerin avukat ve mali müşavir onayından geçmesi gerekiyor (dosyanın kendi notu). Metin değişirse `legalSettings.version` de güncellenmeli.
- **İş:** Küçük (kod) + dış süreç

### 2. Ödeme ayarları üretimde tanımlı değil
- **Sorun:** `Payment:Iban / AccountHolder / AmountTry` tanımlı değilse ödeme ekranı `PAYMENT_NOT_CONFIGURED` hatası veriyor. Fiyat da sözleşmelerde ve yayınlama penceresinde `[FİYAT]` yer tutucusu olarak görünüyor.
- **Dosya:** `backend/Zarify.Api/appsettings.json` (hepsi `null`), `Options/PaymentOptions.cs`, `components/legal/Placeholder.tsx`
- **Yapılacak:** Üretim ortam değişkenlerine `Payment__Iban`, `Payment__AccountHolder`, `Payment__BankName`, `Payment__AmountTry` eklenmeli.
- **İş:** Küçük

### 3. Şifre sıfırlama yok, e-posta altyapısı hiç yok
- **Sorun:** Backend'de e-posta gönderen hiçbir servis yok (SMTP veya sağlayıcı). "Şifremi unuttum" bağlantısı, endpoint'i ve token tablosu da yok. Şifresini unutan kullanıcı ödemesini yaptığı davetiyeye bir daha ulaşamıyor. Destek ekibinin şifreyi elle sıfırlayacağı bir araç da yok; tek yol veritabanına doğrudan bcrypt hash yazmak.
- **Dosya:** `backend/Zarify.Api/Controllers/AuthController.cs`, `frontend/src/components/auth/LoginForm.tsx`
- **Yapılacak:** E-posta servisi seçilip kurulmalı (ör. Resend, SES, SMTP). Ardından `POST /api/auth/forgot-password` ve `POST /api/auth/reset-password` eklenmeli; tek kullanımlık, süreli token tablosu ve migration'ı gerekiyor. Frontend'e `/sifremi-unuttum` ve `/sifre-sifirla` sayfaları eklenmeli.
- **İş:** Büyük

### ✅ 4. Ödenmemiş siparişi iptal etme yok (yasal metin bunu vaat ediyor)
- **✅ Çözüldü (9 Ekim 2026):** Davetiyelerim'deki her ödenmemiş davetiyede artık **Siparişi İptal Et** düğmesi var; onay penceresi açılıyor. `DELETE /api/invitations/{id}` yalnızca Draft ve PendingPayment durumunu siliyor, Published için 409 (`CANNOT_CANCEL_PUBLISHED`) dönüyor. Sözleşme kaydı silinmiyor, iptal zamanıyla işaretleniyor. Yönetim sayfasına **İptal Edilen Siparişler** bölümü eklendi (`GET /api/admin/orders/cancelled`), CORS'a `DELETE` eklendi. Yönetim panelinin geri kalanı (#16) hâlâ eksik.
- **Sorun:** Mesafeli Satış Sözleşmesi ve İptal-İade Politikası "Davetiyeniz henüz yayına alınmadıysa siparişinizi iptal edebilirsiniz" diyor. Ama ne kullanıcı ne de admin bir davetiyeyi iptal edebiliyor ya da silebiliyor. API'de hiç `DELETE` yok; CORS ayarı da yalnızca `GET, POST, PUT` metotlarına izin veriyor.
- **Dosya:** `components/legal/docs/SalesDocs.tsx:110`, `Controllers/InvitationsController.cs`, `Program.cs:113` (CORS metotları)
- **Yapılacak:** En azından admin tarafında "iptal et / iade edildi" işlemi olmalı. Tercihen kullanıcı da `PendingPayment` durumundaki davetiyesini panelden iptal edebilmeli.
- **İş:** Orta

### 5. Reverse proxy (ForwardedHeaders) yapılandırması boş — rate limit herkesi tek kişi sayabilir
- **Sorun:** `ForwardedHeaders:KnownProxies/KnownNetworks` üretimde boş. Bu durumda yalnızca loopback (aynı makinedeki proxy) güvenilir sayılıyor. Proxy ayrı bir makinedeyse veya bir yük dengeleyici/Cloudflare kullanılıyorsa tüm ziyaretçiler proxy'nin IP'siyle görünür. Sonuç: **sitenin tamamı için dakikada 10 giriş ve 5 RSVP** sınırı oluşur, düğün günü misafirler 429 hatası alır.
- **Dosya:** `backend/Zarify.Api/appsettings.Production.json`, `Program.cs:126-147`
- **Yapılacak:** Barındırma mimarisine göre proxy IP'si veya CIDR aralığı girilmeli. Canlıya çıkmadan önce farklı iki IP'den deneme yapılmalı.
- **İş:** Küçük

### ✅ 6. `NEXT_PUBLIC_API_URL` build sırasında verilmezse site sessizce localhost'a bağlanıyor
- **✅ Çözüldü (9 Ekim 2026):** `next.config.ts` artık production build'de `NEXT_PUBLIC_API_URL` ya da yeni `NEXT_PUBLIC_SITE_URL` (OG görselleri için mutlak adres) eksik veya geçersizse açık bir hatayla duruyor; `next dev` localhost varsayılanını kullanmaya devam ediyor. Adres artık tek bir yerde: `lib/apiUrl.ts`.
- **Sorun:** Değişken yoksa her istek `http://localhost:5097` adresine gidiyor; CSP'nin `connect-src` kuralı da buna göre oluşuyor. Build hata vermediği için sorun ancak canlıda fark edilir. Bu adres beş ayrı dosyada tekrar tanımlanmış.
- **Dosya:** `frontend/next.config.ts:4`, `lib/auth.tsx:6`, `lib/invitations.ts:3`, `lib/admin.ts:4`, `lib/pricing.ts:6`, `components/invitation/RsvpSection.tsx:11`
- **Yapılacak:** Üretim build'inde değişken yoksa build hata versin (`next.config.ts` içinde kontrol). Adres tek bir modülden okunsun.
- **İş:** Küçük

### 7. Migration'lar üretim veritabanına nasıl uygulanacak belli değil
- **Sorun:** 9 migration var (`InitialCreate` → `DistanceSalesAcceptance`) ve hepsi tutarlı görünüyor. Ancak uygulama açılışta `Migrate()` çalıştırmıyor; deploy betiği de yok.
- **Dosya:** `backend/Zarify.Api/Data/Migrations/`, `Data/ZarifyDbContextFactory.cs`
- **Yapılacak:** `dotnet ef migrations script --idempotent` ile SQL betiği üretilip deploy adımına eklenmeli. İlk admin kullanıcısının nasıl oluşturulacağı da yazılmalı: rol yalnızca veritabanından `UPDATE Users SET Role='Admin'` ile veriliyor (`Models/User.cs:133`).
- **İş:** Küçük

### ✅ 8. Ödeme onay süresi metinlerde çelişiyor
- **✅ Çözüldü (9 Ekim 2026):** Tek ifade artık `lib/legal.ts` içindeki `paymentApprovalNote`: "Ödemeniz genellikle aynı gün, en geç 2 iş günü içinde onaylanır." Ödeme ekranı, yayınlama penceresi, Davetiyelerim kartı, Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi (TR/EN) bu metni kullanıyor. `legalSettings.version` değeri `2026-10-08` oldu.
- **Sorun:** Sözleşme "havaleden itibaren **en geç 2 iş günü**" diyor (son commit'in amacı da bu). Ödeme ekranı ise "Onay genellikle **aynı gün** içinde yapılır" diyor. Tüketiciye birbirine uymayan iki taahhüt veriliyor.
- **Dosya:** `components/payment/PaymentInstructionsPanel.tsx:96` ↔ `components/legal/docs/SalesDocs.tsx:79-80`
- **İş:** Küçük

### ✅ 9. Yayınlanan davetiyelerde "Haritada Aç" butonu hiç çıkmıyor
- **✅ Çözüldü (9 Ekim 2026):** `lib/mapUrl.ts` mekân adı ve adresinden Google Maps arama linki üretiyor; adres boşsa buton gizleniyor. Hem yayındaki davetiye hem taslak önizleme bu linki kullanıyor.
- **Sorun:** `VenueSection` butonu yalnızca `mapUrl` verilirse gösteriyor. `mapUrl` sadece örnek şablon önizlemesinde veriliyor (`PLACEHOLDER_MAP_URL`); gerçek davetiye sayfası bu değeri hiç geçmiyor. Misafir mekânın yolunu bulamıyor. Bu DESIGN.md'deki "Mekân … 'Haritada Aç'" tanımına da aykırı.
- **Dosya:** `app/davetiye/[slug]/page.tsx:114-125`, `components/invitation/VenueSection.tsx:38`, `app/sablonlar/nikah-tezhibi/page.tsx:21`
- **Yapılacak:** Mekân adı ve adresinden bir Google Maps arama linki üretilsin (`maps/search/?api=1&query=…`).
- **İş:** Küçük

---

## 🟡 Önemli ama bekleyebilir

### Akışlar

#### ✅ 10. Hata: form sayfası yenilenince kayıtlı taslak görünmüyor
- **✅ Çözüldü (9 Ekim 2026):** Form artık ancak hydration bittikten sonra, kayıtlı taslakla oluşturuluyor. O ana kadar yalnızca "Bilgileriniz yükleniyor…" gösteriliyor; sunucu HTML'inde form olmadığı için gönderilemiyor ve boş form taslağın üzerine yazamıyor. Tarayıcıda önce hata yeniden üretildi (form boş geliyordu), düzeltmeden sonra yenilemede taslak forma doluyor.
- **Sorun:** `useState(() => draft ?? EMPTY_FORM)` ilk değerini hydration sırasında alıyor. Bu anda `useSyncExternalStore` sunucu tarafı değeri (`null`) döndürüyor. Sonuç: `/davetiye-bilgileri` sayfası doğrudan açılır veya yenilenirse localStorage'daki taslak olduğu hâlde form **boş** geliyor. Kullanıcı formu doldurup gönderirse eski taslak siliniyor. Kod yorumundaki "no effect needed" varsayımı yanlış. Önizlemeden gelen `Link` ile açılınca sorun yok (o yolda hydration olmuyor).
- **Dosya:** `components/invitation-details/InvitationDetailsForm.tsx:19-22`
- **İş:** Küçük

#### 11. Oturum 60 dakikada bitiyor ve yenilenmiyor; düzenleme sayfasında değişiklikler kayboluyor
- **Sorun:** Refresh token yok. Düzenleme sayfasında kaydetme sırasında 401 dönerse kullanıcı hemen çıkış yaptırılıp `/giris`'e yönlendiriliyor ve formdaki değişiklikler kayboluyor. Girişten sonra kaldığı sayfaya dönmüyor; `?next=` desteği yok, her zaman `/davetiyelerim`'e gidiyor.
- **Dosya:** `app/davetiyelerim/[id]/duzenle/page.tsx:122-126`, `components/auth/LoginForm.tsx:27`, `Services/TokenService.cs`, `appsettings.json` (`ExpiryMinutes: 60`)
- **İş:** Orta

#### 12. Ödeme onaylanınca kullanıcıya bildirim gitmiyor
- **Sorun:** Davetiye yayına alındığında çift bunu ancak paneli yenileyerek öğreniyor. Yeni sipariş geldiğinde admin'e de bildirim gitmiyor.
- **Dosya:** `Controllers/AdminController.cs:38-60`
- **Not:** #3'teki e-posta altyapısına bağlı.
- **İş:** Orta

#### 13. RSVP son tarihi hiçbir yerde uygulanmıyor
- **Sorun:** `RsvpDeadline` yalnızca bilgi metni olarak gösteriliyor. Son tarih geçince, hatta düğün tarihi geçtikten sonra bile form ve API yanıt kabul etmeye devam ediyor.
- **Dosya:** `Controllers/RsvpController.cs:37-42`, `components/invitation/RsvpSection.tsx`
- **İş:** Küçük

#### 14. Düğün tarihi geçmiş bir tarih olabiliyor
- **Sorun:** Tarih alanında `min` sınırı yok; backend'de de geçmiş tarih kontrolü yok. Geçmiş tarihli bir davetiye ödenip yayınlanabiliyor.
- **Dosya:** `components/invitation-details/InvitationFields.tsx:69`, `Dtos/InvitationFieldsRequest.cs:301-313`
- **İş:** Küçük

#### ✅ 15. Fiyat sipariş anında davetiyeye kaydedilmiyor
- **✅ Çözüldü (9 Ekim 2026):** `Invitations.AmountTry` kolonu eklendi; sipariş anındaki fiyat buraya yazılıyor. Ödeme ekranı, yönetim kuyruğu ve sipariş özeti bu tutarı gösteriyor. Sözleşme sayfaları sipariş linkinden (`?siparis=`) açılınca kayıtlı tutarı, linksiz açılınca güncel fiyatı gösteriyor. Fiyat tanımlı değilse sipariş oluşturulamıyor (503). Mevcut kayıtlar migration'da 199,90 ile dolduruldu.
- **Sorun:** Ödeme ekranı her açıldığında **o anki** `AmountTry` değerini gösteriyor. Fiyat değişirse bekleyen siparişlerin tutarı da geriye dönük değişiyor; kullanıcı sözleşmede başka bir fiyatı onaylamış oluyor.
- **Dosya:** `Controllers/InvitationsController.cs:249-250`, `Models/Invitation.cs`
- **İş:** Küçük (yeni kolon ve migration)

### Admin paneli (`/yonetim`)

**Var olanlar:** ödeme bekleyen davetiyelerin listesi (referans kodu, çift, sahip, e-posta, oluşturulma zamanı), davetiyeye bakma bağlantısı ve iki adımlı "Ödemeyi Onayla" düğmesi. **Yetki kontrolü:** backend tarafı doğru; controller düzeyinde `[Authorize(Roles = "Admin")]` var (`AdminController.cs:16`) ve rol token'dan okunuyor. Frontend tarafında yalnızca oturum kontrolü yapılıyor; rol kontrolünü API'nin 403 cevabına bırakıyor ve 403 gelince "yetkiniz yok" mesajı gösteriyor. Menüdeki bağlantı yalnızca admin'e görünüyor (`OwnerShell.tsx:58`). Bu yapı yeterli.

#### 16. Admin panelinde temel işlemler eksik
- **Eksik olanlar:**
  - Ödemeyi **reddetme**, iptal etme, iade edildi olarak işaretleme yok.
  - **Yayındaki davetiyelerin** listesi yok; onaylanan davetiye listeden düşünce bir daha bulunamıyor.
  - Referans koduna veya e-postaya göre **arama** yok.
  - **Kullanıcı listesi** yok; hesap silme veya askıya alma yok.
  - Kullanım Şartları'nın vaat ettiği "uygunsuz içeriği **yayından kaldırma**" işlemi yok.
- **Dosya:** `Controllers/AdminController.cs`, `app/yonetim/page.tsx`, `lib/admin.ts`
- **İş:** Büyük

#### ◐ 17. Ödeme kaydı tutulmuyor
- **◐ Kısmen çözüldü (9 Ekim 2026):** Sipariş tutarı ve sözleşme kaydı artık veritabanında (#15, #19). **Kalan:** admin onayının (kim, ne zaman) ayrıca kaydedilmesi ve fatura süreci.
- **Sorun:** Onayı kimin, ne zaman, hangi tutarla verdiği yalnızca uygulama log'una yazılıyor (`AdminController.cs:55-57`). Veritabanında ödeme tablosu yok. KVKK metni "ödeme ve faturalandırma kayıtları 5–10 yıl" saklanacağını söylüyor. Fatura / e-Arşiv akışı da kodda yok; şimdilik elle yürütülecekse bu bir süreç olarak yazılmalı.
- **Dosya:** `Controllers/AdminController.cs`, `components/legal/docs/KvkkNotice.tsx:143`
- **İş:** Orta

### Kullanıcı tarafı

#### 18. Profil düzenleme ve şifre değiştirme yok
- **Sorun:** Ad, soyad veya e-posta değiştirilemiyor; şifre değiştirilemiyor. Hiç `PUT /api/auth/me` benzeri bir endpoint yok. Kayıtta e-posta doğrulaması da yok; başkasının e-postasıyla hesap açılabiliyor.
- **Dosya:** `Controllers/AuthController.cs`, `components/owner/OwnerShell.tsx` (menüde "Hesabım" bağlantısı yok)
- **İş:** Orta

#### ◐ 19. Hesap silme yok; ayrıca elle silmek sözleşme kayıtlarını da yok ediyor
- **◐ Kısmen çözüldü (9 Ekim 2026):** Sözleşme onay kayıtları artık ayrı bir `SalesAgreements` tablosunda tutuluyor: zaman, sürüm, e-posta, ad, tutar ve referans. Davetiye ve kullanıcı bağlantıları `SetNull`; kullanıcı veya davetiye silinse de kayıt kalıyor (test edildi). **Kalan:** kullanıcının kendi hesabını silebileceği bir özellik hâlâ yok.
- **Sorun:** Kullanım Şartları ve KVKK metni hesabın talep üzerine silineceğini söylüyor ama uygulamada bu işlem yok. Daha ciddisi: veritabanında `User → Invitation → Rsvp` ilişkisi **Cascade** olarak tanımlı. Kullanıcı elle silinirse davetiyeyle birlikte `DistanceSalesAcceptedAtUtc / Version` (sözleşme onay kaydı) da siliniyor. Oysa metin bu kaydı "en az 3 yıl" saklayacağını söylüyor.
- **Dosya:** `Data/ZarifyDbContext.cs:933-936`, `components/legal/docs/TermsOfUse.tsx:106`, `components/legal/docs/KvkkNotice.tsx:133,140-141`
- **Yapılacak:** Hesabı silmek yerine anonimleştirmek veya kayıtları "soft delete" ile işaretlemek. Sözleşme kayıtları ayrı bir yerde tutulmalı.
- **İş:** Orta

#### 20. RSVP silinemiyor, dışa aktarılamıyor
- **Sorun:** KVKK metni misafirin yanıtının silinmesini "davetiye sahibinden" isteyebileceğini söylüyor ama sahibin yanıt silme imkânı yok. Yanıtlar panelde listelenebiliyor (`InvitationCard.tsx`), ancak CSV/Excel olarak indirilemiyor.
- **Dosya:** `components/dashboard/InvitationCard.tsx`, `Controllers/InvitationsController.cs:296-317`, `components/legal/docs/KvkkNotice.tsx:163-165`
- **İş:** Küçük–Orta

### Yasal metin ↔ kod

#### 21. Veri saklama süreleri otomatik uygulanmıyor
- **Sorun:** "Yayın süresi + en fazla 6 ay sonra davetiye ve RSVP'ler silinir" deniyor; ama yayın süresi (`servicePeriod`) tanımsız ve süre dolunca yayından kaldıran ya da silen bir arka plan işi yok.
- **Dosya:** `components/legal/docs/KvkkNotice.tsx:135-137`, `lib/legal.ts:785`
- **Not:** İlk silme tarihi canlıya çıkıştan aylar sonraya düştüğü için bekleyebilir, ama takvime alınmalı.
- **İş:** Orta

#### 22. "Onayladığınız sözleşme sürümü e-postayla gönderilir" vaadi karşılanamıyor
- **Sorun:** Davetiyeye yalnızca sürüm etiketi (`"2026-09-28"`) kaydediliyor. Metnin o anki hâli arşivlenmiyor ve e-posta altyapısı da yok.
- **Dosya:** `components/legal/docs/SalesDocs.tsx:306-308`
- **Yapılacak:** Her sürüm PDF veya HTML olarak arşivlenmeli; en azından git etiketiyle eşlenmeli.
- **İş:** Küçük–Orta

#### 23. "Önemli değişiklikleri e-postayla bildiririz" vaadi
- **Dosya:** `components/legal/docs/TermsOfUse.tsx:115-117`
- **Not:** #3'teki e-posta altyapısına bağlı.
- **İş:** Küçük

> **Uyumlu bulunanlar:** Çerez politikası gerçek kullanımla birebir örtüşüyor: `zarify.auth` ve `zarify.invitationDraft` localStorage'da, `zarify.envelopeShown.*` sessionStorage'da tutuluyor; analiz aracı veya çerez yok, dolayısıyla çerez banner'ı gerekmiyor. "Oturum 60 dk" ifadesi `ExpiryMinutes` değeriyle, "güvenlik sayaçları en fazla 10 dk, yalnızca bellekte" ifadesi `AuthThrottle` ve `RateLimitPolicies` ile, "bcrypt" ifadesi `AuthController` ile uyumlu.

### Güvenlik

**Yetkisiz erişim kontrolü:** `Update`, `Payment`, `Rsvps` sorguları `i.UserId == userId` koşuluyla yapılıyor; başkasının davetiyesi için 404 dönüyor. `GetBySlug` yayınlanmamış davetiyeyi yalnızca sahibine veya admin'e gösteriyor. RSVP yalnızca `Published` durumundaki davetiyeye yazılabiliyor. Bu konularda **açık bulunmadı**.

#### ✅ 24. Bir misafir başka bir misafirin RSVP'sini değiştirebiliyor
- **✅ Çözüldü (9 Ekim 2026):** İsimle upsert kaldırıldı. İlk yanıtta sunucu 32 baytlık rastgele bir düzenleme token'ı üretiyor; tarayıcı bunu `zarify.rsvp.<slug>` anahtarına kaydediyor, sunucu yalnızca SHA-256 özetini tutuyor. Yanıt ancak bu token'la güncellenebiliyor. Token'sız ya da bilinmeyen token'la gelen yanıt yeni kayıt olarak ekleniyor. Davetiye sahibinin listesinde aynı isimli yanıtlar "aynı isimde birden fazla yanıt" olarak işaretleniyor ve özette sayıları veriliyor. KVKK ve Çerez Politikası metinleri buna göre güncellendi.
- **Sorun:** Yanıtlar yalnızca isim anahtarıyla eşleştiriliyor. Linke sahip herkes "Ayşe Yılmaz" yazarak Ayşe'nin yanıtını "gelmiyor" diye değiştirebilir; panelde yalnızca "güncellendi" yazar.
- **Dosya:** `Controllers/RsvpController.cs:55-61`
- **Yapılacak:** İlk yanıtta tarayıcıya bir düzenleme token'ı verilmesi veya değişiklik geçmişinin tutulması.
- **İş:** Orta

#### 25. Davetiye oluşturma, güncelleme ve slug sorgusunda rate limit yok
- **Sorun:** Giriş yapmış bir kullanıcı sınırsız sayıda `PendingPayment` davetiye oluşturabiliyor; her biri yaklaşık 1 milyonluk referans kodu havuzundan bir kod tüketiyor ve admin kuyruğunu dolduruyor. `GET /api/invitations/{slug}` sınırsız çağrılabiliyor; slug'lar tahmin edilebilir (`gelin-damat`). Yayınlanmamış davetiyede API'nin `NOT_PUBLISHED` cevabı, davetiyenin var olduğunu da doğruluyor.
- **Dosya:** `Controllers/InvitationsController.cs:27-29, 111, 191`, `Services/RateLimitPolicies.cs`
- **İş:** Küçük

#### ✅ 26. Misafir sayfaları arama motorlarına kapalı değil
- **✅ Çözüldü (9 Ekim 2026):** Davetiye sayfalarına `robots: noindex, nofollow` meta etiketi eklendi. `next.config.ts` de `/davetiye/*`, `/davetiyem/*` ve `/davetiyelerim/*` yolları için `X-Robots-Tag` başlığı gönderiyor.
- **Sorun:** `/davetiye/[slug]` sayfasında `noindex` yok; `robots.txt` da yok. Çiftin adı, düğün tarihi ve mekân adresi Google'da çıkabilir. Bu, gizlilik vaadiyle çelişiyor.
- **Dosya:** `app/davetiye/[slug]/page.tsx` (client component; metadata da yok), `app/` (`robots.ts` yok)
- **İş:** Küçük

#### 27. JWT localStorage'da tutuluyor; CSP `'unsafe-inline'` script'e izin veriyor
- **Sorun:** Olası bir XSS açığında token çalınabilir. React çıktıları escape ettiği için şu an somut bir XSS bulunmadı.
- **Dosya:** `lib/auth.tsx`, `next.config.ts:16`
- **Yapılacak:** Uzun vadede httpOnly cookie'ye geçmek.
- **İş:** Orta–Büyük

### Tasarım (DESIGN.md — Herbaryum)

Tüm sayfalar yeni temaya geçmiş durumda: landing, şablonlar, auth, panel, yönetim, form, düzenleme, ödeme, misafir sayfası ve yasal sayfalar `Painting`, `paper-ground`, `paper-card` ve Gloock/Garamond yapısını kullanıyor. Eski gravür görsellerine referans yok. `art.ts` kaydındaki 14 görselin hepsi `public/images/art/` altında mevcut; **kırık görsel bulunmadı.**

#### 28. Özel 404 ve hata sayfası yok
- **Sorun:** `app/not-found.tsx` ve `app/error.tsx` yok. Bilinmeyen bir URL Next'in varsayılan siyah-beyaz 404 sayfasını açıyor.
- **İş:** Küçük

#### ✅ 29. Paylaşım önizlemesi (OG) ve sayfa başlığı yok
- **✅ Çözüldü (9 Ekim 2026):** `/davetiye/[slug]` artık sunucu tarafında `generateMetadata` üretiyor: başlık çiftin adı, açıklama tarih ve mekân. `opengraph-image` ve `twitter-image` kuğulu göl görselinin üzerinde Gloock fontuyla isim, tarih ve mekânı gösteren 1200×630 boyutunda, yaklaşık 65 KB'lık bir JPEG üretiyor. Ödenmemiş ya da bulunamayan davetiyede önizleme isimsiz ve genel kalıyor. WhatsApp'ın kendisiyle test edilemedi: localhost'a dışarıdan erişilemiyor. Etiketler ve görsel yerelde doğrulandı.
- **Sorun:** Misafir sayfası client'ta render ediliyor ve kendi metadata'sı yok. WhatsApp'ta paylaşılan link "Zarify — Dijital Düğün Davetiyesi" başlığıyla, görselsiz görünüyor. Çiftin adı ve tarihi görünmüyor. Bu, ürünün asıl paylaşım anı.
- **Dosya:** `app/davetiye/[slug]/page.tsx`, `app/layout.tsx:30-34`
- **Yapılacak:** `generateMetadata` ile sunucu tarafında başlık ve `opengraph-image` üretilmeli.
- **İş:** Orta

#### 30. Favicon hâlâ Next.js'in varsayılanı
- **Dosya:** `app/favicon.ico` (25.931 bayt, create-next-app'ten gelen dosyanın aynısı)
- **İş:** Küçük

#### 31. İngilizce modda tarih Türkçe kalıyor
- **Sorun:** Misafir dili EN'e çevirdiğinde kapaktaki tarih satırı "12 Haziran 2027 · Cumartesi" olarak kalıyor; `formatDateLine` her zaman `tr-TR` kullanıyor.
- **Dosya:** `lib/formatDateLine.ts`, `app/davetiye/[slug]/page.tsx:117`
- **İş:** Küçük

#### 32. Yönetim ve davetiye sayfalarında küçük tutarsızlıklar
- **Sorunlar:**
  - Yönetim satırı geniş ekranda soldan hizalı 12 kolonluk tablo; DESIGN.md'deki "Centred Axis Rule"a aykırı (`app/yonetim/page.tsx:154`).
  - Yönetim sayfası metinleri sabit Türkçe.
  - Admin, bekleyen bir davetiyeyi açtığında üstte "Ödeme bilgileri" bağlantısı görüyor ama bu bağlantı admin için 404 veriyor (`app/davetiye/[slug]/page.tsx:106-111`).
  - `/davetiyem/[slug]` ağ hatasında "bulamadık" yazıyor; hata durumu ayrıca ele alınmıyor (`app/davetiyem/[slug]/page.tsx:53-55`).
- **İş:** Küçük

### Production hazırlığı

#### 33. Test, health check ve hata izleme yok
- **Sorun:** Backend veya frontend için tek bir test yok. `/health` endpoint'i yok. Sentry benzeri bir hata izleme veya log toplama aracı yok; 500 hataları yalnızca konsola yazılıyor.
- **İş:** Orta

#### 34. Deploy ve yedekleme dokümantasyonu yok
- **Sorun:** Dockerfile, nginx veya systemd yapılandırması ya da deploy README'si yok. MySQL yedekleme planı yok. `frontend/README.md` hâlâ create-next-app şablonu. `AllowedHosts: "*"` değeri üretimde alan adıyla sınırlandırılmalı.
- **Dosya:** `frontend/README.md`, `backend/Zarify.Api/appsettings.json:12`
- **İş:** Orta

---

## ⚪ Güzel olur

#### 35. Kullanılmayan dosyalar ve metinler
- `public/` altında create-next-app'ten kalan 5 SVG hiçbir yerde kullanılmıyor: `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.
- `lib/i18n.tsx` içinde kullanılmayan anahtarlar var: `landing.hero.mockupInvite / mockupDate / mockupVenue`, `landing.nav.greetingPrefix`, `meta.title`.
- `GET /api/auth/me` backend'de var ama frontend hiç çağırmıyor.
- **İş:** Küçük

#### 36. Sahte/örnek veri bilinçli olarak kullanılıyor
- "Elif & Kerem" örnek içeriği yalnızca şablon vitrininde ve boş panelde gösteriliyor (`lib/i18n.tsx`, `app/davetiyelerim/page.tsx:78`, `app/sablonlar/nikah-tezhibi/page.tsx:20-22`). Gerçek davetiyeye sızmıyor (`HerbaryumTemplate.tsx:49`); sorun yok, yalnızca not olarak düşüldü.

#### 37. Accept-Language başlığı tutarsız gönderiliyor
- `jsonHeaders()` yalnızca auth isteklerinde kullanılıyor. `lib/invitations.ts`, `lib/admin.ts` ve `lib/pricing.ts` bu başlığı göndermiyor. Frontend hata metnini kendi koduna göre çevirdiği için kullanıcıya etkisi yok.
- **İş:** Küçük

#### 38. Düzenleme sayfasında önizleme ve kaydedilmemiş değişiklik uyarısı yok
- Değişiklikler kaydedildiği anda canlıya çıkıyor; kaydetmeden önce önizleme yapılamıyor. Sayfadan çıkarken kaydedilmemiş değişiklik uyarısı da yok.
- **Dosya:** `app/davetiyelerim/[id]/duzenle/page.tsx`
- **İş:** Orta

#### 39. Yayındaki davetiyede çift adları sınırsız değiştirilebiliyor
- Ödemesi yapılmış bir davetiye tamamen başka bir çift için yeniden kullanılabilir. İş modeli açısından bilinçli bir karar olarak kabul edilmeli ya da yayın sonrası değişiklikler sınırlanmalı.
- **Dosya:** `Controllers/InvitationsController.cs:111-130`
- **İş:** Küçük

#### 40. Repo kökünde dağınık klasörler
- `zarify-yeni-gorseller/` (ChatGPT görselleri) git'te izlenmiyor ama `.gitignore`'da da yok; yanlışlıkla commit'lenebilir.
- `zarify/` projenin ikinci bir klonu (`.git/info/exclude` ile gizlenmiş); karışıklık yaratabilir.
- DESIGN.md arşivin yerini `public/images/_arsiv/` olarak gösteriyor, gerçek yeri `gorseller/_arsiv/`.
- **İş:** Küçük

#### 41. Görsellerin kaynak/lisans kaydı yok
- `lib/art.ts` içindeki tabloların nereden geldiği (AI üretimi mi, kamu malı eser mi) hiçbir yerde yazmıyor. Kullanım Şartları'ndaki "şablonların kopyalanamaz" maddesi açısından kaynağın belgelenmesi faydalı olur.
- **İş:** Küçük

---

## Önerilen yapılış sırası

1. **Hızlı yapılandırma ve metin düzeltmeleri (1 gün):** #2 ödeme env'leri · #5 proxy ayarı · #6 API URL kontrolü · #7 migration betiği ve ilk admin · #8 onay süresi metni · #9 harita butonu · #10 taslak yenileme hatası · #30 favicon · #28 404/hata sayfası · #26 noindex/robots.
2. **Yasal bilgiler (dış süreç, paralel başlatılmalı):** #1 şirket bilgileri ve hizmet süresi `legal.ts`'e girilsin → avukat/müşavir onayı → `showDraftNotice: false`.
3. **E-posta altyapısı ve şifre sıfırlama:** #3. Bu altyapı #12, #22 ve #23'ün de önünü açar.
4. **İptal ve iade akışı + admin tarafında reddetme/iptal:** #4 ve #16'nın ilk kısmı. CORS'a `DELETE` metodu eklenmeli.
5. **Ödeme kaydı ve fiyatın siparişe kaydedilmesi:** #15 ve #17 tek migration'da yapılabilir.
6. **Canlıya çıkış.** Ardından ilk haftalarda:
7. Oturum süresi ve kaldığı sayfaya dönüş (#11) · RSVP son tarihi ve tarih doğrulaması (#13, #14) · rate limit eklemeleri (#25).
8. OG/paylaşım önizlemesi (#29) · İngilizce tarih (#31) · yönetim sayfası düzeltmeleri (#32).
9. Hesap ve profil yönetimi: profil düzenleme, şifre değiştirme (#18) · hesabı anonimleştirerek silme ve sözleşme kayıtlarını koruma (#19) · RSVP silme/dışa aktarma (#20).
10. Admin panelini genişletme (#16'nın kalanı) · veri saklama işi (#21) · RSVP sahteciliğine karşı önlem (#24).
11. Test, health check, hata izleme, deploy dokümantasyonu (#33, #34) · httpOnly cookie'ye geçiş (#27).
12. Temizlik: #35–#41.
