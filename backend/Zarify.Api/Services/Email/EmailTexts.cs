using System.Globalization;

namespace Zarify.Api.Services.Email;

/// Every word the emails say, per language. Turkish is complete; to add
/// English, fill an "en" dictionary with the same keys — anything missing
/// falls back to Turkish, so a half-translated catalog never sends a key.
/// {0}, {1}… are string.Format placeholders.
public static class EmailTexts
{
    public const string DefaultLanguage = "tr";

    private static readonly Dictionary<string, string> Tr = new()
    {
        ["footer"] = "Bu e-postayı Zarify hesabınızla ilgili bir işlem nedeniyle aldınız.",
        ["paymentApproval"] = "Ödemeniz genellikle aynı gün, en geç 2 iş günü içinde onaylanır.",

        ["welcome.subject"] = "Zarify'a hoş geldiniz",
        ["welcome.preheader"] = "Davetiyenizi hazırlamaya hemen başlayabilirsiniz.",
        ["welcome.eyebrow"] = "Hoş geldiniz",
        ["welcome.heading"] = "Merhaba {0},",
        ["welcome.p1"] = "Zarify hesabınız oluşturuldu. Davetiyenizin bilgilerini girip şablon üzerinde önizleyebilir, hazır olduğunuzda yayınlayabilirsiniz.",
        ["welcome.p2"] = "Kayıt olmak, bilgilerinizi girmek ve önizlemek ücretsizdir; ücret yalnızca davetiyenizi yayına alırken ödenir.",
        ["welcome.button"] = "Davetiyemi Hazırla",

        ["order.subject"] = "Siparişiniz alındı — {0}",
        ["order.preheader"] = "Havale bilgileri ve referans kodunuz: {0}",
        ["order.eyebrow"] = "Siparişiniz alındı",
        ["order.p1"] = "Davetiyeniz hazır ve ödeme bekliyor. Aşağıdaki hesaba havale/EFT yapın; açıklama kısmına referans kodunu mutlaka yazın.",
        ["order.noBank"] = "Ödeme bilgilerini Davetiyelerim sayfanızda bulabilirsiniz.",
        ["order.amount"] = "Tutar",
        ["order.iban"] = "IBAN",
        ["order.holder"] = "Alıcı",
        ["order.bank"] = "Banka",
        ["order.reference"] = "Açıklamaya yazılacak referans kodu",
        ["order.p2"] = "Onaylandığında size e-posta ile haber vereceğiz ve davetiyeniz misafirlerinize açılacak.",
        ["order.button"] = "Ödeme Bilgilerini Görüntüle",
        ["order.p3"] = "Henüz ödeme yapmadıysanız siparişinizi Davetiyelerim sayfasından iptal edebilirsiniz.",
        ["order.contract"] = "Onayladığınız Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi, bilgilerinizle doldurulmuş hâliyle bu e-postanın ekindedir. Davetiyelerim sayfasındaki \"Sözleşmemi görüntüle\" bağlantısından da her zaman açabilirsiniz.",

        ["adminOrder.subject"] = "Yeni sipariş: {0} — {1}",
        ["adminOrder.preheader"] = "{0} tutarında yeni sipariş ödeme bekliyor.",
        ["adminOrder.eyebrow"] = "Yeni sipariş",
        ["adminOrder.p1"] = "Yeni bir davetiye siparişi ödeme bekliyor. Havale geldiğinde Yönetim sayfasından onaylayın.",
        ["adminOrder.reference"] = "Referans kodu",
        ["adminOrder.amount"] = "Tutar",
        ["adminOrder.owner"] = "Sipariş veren",
        ["adminOrder.wedding"] = "Düğün tarihi",
        ["adminOrder.placedAt"] = "Sipariş zamanı",
        ["adminOrder.button"] = "Yönetim Sayfasını Aç",

        ["approved.subject"] = "Davetiyeniz yayında — {0}",
        ["approved.preheader"] = "Davetiye linkinizi misafirlerinizle paylaşabilirsiniz.",
        ["approved.eyebrow"] = "Ödemeniz onaylandı",
        ["approved.p1"] = "Ödemeniz onaylandı ve davetiyeniz yayına alındı. Aşağıdaki linki misafirlerinizle paylaşabilirsiniz.",
        ["approved.link"] = "Davetiye linki",
        ["approved.button"] = "Davetiyeyi Görüntüle",
        ["approved.p2"] = "Katılım yanıtlarını Davetiyelerim sayfasından takip edebilir, bilgilerinizi dilediğiniz zaman güncelleyebilirsiniz.",

        ["rejected.subject"] = "Ödemeniz onaylanamadı — {0}",
        ["rejected.preheader"] = "{0} referanslı siparişinizle ilgili bir notumuz var.",
        ["rejected.eyebrow"] = "Ödeme onaylanamadı",
        ["rejected.p1"] = "{0} referanslı siparişinizin ödemesini onaylayamadık.",
        ["rejected.note"] = "Notumuz",
        ["rejected.p2"] = "Davetiyeniz silinmedi; ödeme bekliyor durumunda kalıyor. Nottaki konuyu düzelttiğinizde ödemenizi yeniden inceleyip onaylayacağız.",
        ["rejected.button"] = "Ödeme Bilgilerini Görüntüle",

        ["retention.subject"] = "Davetiyenizin yayın süresi doluyor — {0}",
        ["retention.preheader"] = "Davetiyeniz {0} tarihinde misafirlerinize kapanacak.",
        ["retention.eyebrow"] = "Yayın süresi doluyor",
        ["retention.p1"] = "Davetiyeniz {0} tarihinde misafirlerinize kapanacak. Bu tarihten sonra link \"yayın süresi doldu\" mesajını gösterir; siz panelinizden görmeye devam edebilirsiniz.",
        ["retention.p2"] = "Katılım yanıtlarını saklamak isterseniz Davetiyelerim sayfasından \"Yanıtları indir (CSV)\" ile şimdiden indirmenizi öneririz.",
        ["retention.closes"] = "Misafirlere kapanış",
        ["retention.deleted"] = "Davetiye ve yanıtların silinmesi",
        ["retention.button"] = "Yanıtlarımı İndir",
        ["retention.p3"] = "Silme tarihinde davetiyenizin içeriği ve misafir yanıtları kalıcı olarak silinir. Sözleşme ve ödeme kayıtları yasal süre boyunca saklanır.",

        ["removed.subject"] = "Davetiyeniz yayından kaldırıldı — {0}",
        ["removed.preheader"] = "Davetiyeniz şu anda misafirlerinize kapalı.",
        ["removed.eyebrow"] = "Davetiye yayında değil",
        ["removed.p1"] = "Davetiyeniz, Kullanım Şartları'na uygun olmadığı değerlendirilen içerik nedeniyle yayından kaldırıldı. Davetiye linkiniz şu anda misafirlerinize \"Bu davetiye yayında değil\" mesajını gösteriyor.",
        ["removed.note"] = "Gerekçe",
        ["removed.p2"] = "Davetiyeniz ve misafirlerinizin katılım yanıtları silinmedi. İlgili içeriği düzenleyip bize yazdığınızda davetiyenizi yeniden inceleyip yayına alabiliriz.",
        ["removed.p3"] = "Bir yanlışlık olduğunu düşünüyorsanız lütfen bizimle iletişime geçin.",
        ["removed.button"] = "Davetiyemi Görüntüle",

        ["republished.subject"] = "Davetiyeniz yeniden yayında — {0}",
        ["republished.preheader"] = "Davetiye linkiniz misafirlerinize yeniden açıldı.",
        ["republished.eyebrow"] = "Yeniden yayında",
        ["republished.p1"] = "Davetiyeniz yeniden yayına alındı. Daha önce paylaştığınız link değişmedi ve misafirleriniz için yeniden çalışıyor.",

        ["reset.subject"] = "Şifre sıfırlama isteğiniz",
        ["reset.preheader"] = "Yeni şifrenizi belirlemek için bağlantı 1 saat geçerlidir.",
        ["reset.eyebrow"] = "Şifre sıfırlama",
        ["reset.heading"] = "Merhaba {0},",
        ["reset.p1"] = "Zarify hesabınız için şifre sıfırlama isteği aldık. Yeni şifrenizi belirlemek için aşağıdaki düğmeye tıklayın.",
        ["reset.button"] = "Yeni Şifre Belirle",
        ["reset.p2"] = "Bu bağlantı 1 saat geçerlidir ve yalnızca bir kez kullanılabilir. Sonradan yeni bir istek yaparsanız bu bağlantı geçersiz olur.",
        ["reset.p3"] = "Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz; şifreniz değişmez.",

        ["changed.subject"] = "Şifreniz değiştirildi",
        ["changed.preheader"] = "Zarify hesabınızın şifresi değiştirildi.",
        ["changed.eyebrow"] = "Hesap güvenliği",
        ["changed.heading"] = "Merhaba {0},",
        ["changed.p1"] = "Zarify hesabınızın şifresi {0} tarihinde değiştirildi. Güvenliğiniz için açık olan tüm oturumlarınız kapatıldı.",
        ["changed.p2"] = "Bu değişikliği siz yapmadıysanız hemen şifrenizi sıfırlayın ve bizimle iletişime geçin.",
        ["changed.button"] = "Şifremi Sıfırla",

        ["deleted.subject"] = "Hesabınız silindi",
        ["deleted.preheader"] = "Zarify hesabınız ve davetiyeleriniz silindi.",
        ["deleted.eyebrow"] = "Hesap silindi",
        ["deleted.heading"] = "Merhaba {0},",
        ["deleted.p1"] = "İsteğiniz üzerine Zarify hesabınız; davetiyeleriniz ve misafirlerinizin katılım yanıtlarıyla birlikte silindi. Davetiye linkleriniz artık açılmıyor.",
        ["deleted.p2"] = "Mesafeli satış sözleşmesi ve onay kayıtları, yasal saklama süresi (en az 3 yıl) boyunca saklanır ve bu sürenin sonunda silinir.",
        ["deleted.p3"] = "Bu işlemi siz yapmadıysanız bizimle hemen iletişime geçin.",
    };

    private static readonly Dictionary<string, Dictionary<string, string>> Catalogs = new()
    {
        ["tr"] = Tr,
    };

    public static string Get(string lang, string key, params object[] args)
    {
        var catalog = Catalogs.GetValueOrDefault(lang) ?? Tr;
        var text = catalog.GetValueOrDefault(key) ?? Tr[key];
        return args.Length == 0 ? text : string.Format(Culture(lang), text, args);
    }

    public static CultureInfo Culture(string lang) =>
        CultureInfo.GetCultureInfo(lang == "en" ? "en-GB" : "tr-TR");
}
