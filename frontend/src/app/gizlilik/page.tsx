import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { legalEntity } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Gizlilik Politikası — Zarify",
  description:
    "Zarify'ın hangi kişisel verileri, hangi amaçla işlediğine dair KVKK kapsamındaki aydınlatma metni.",
};

export default function PrivacyPolicyPage() {
  const e = legalEntity;

  return (
    <LegalLayout eyebrow="KVKK Aydınlatma Metni" title="Gizlilik Politikası">
      <section>
        <p>
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu
          (&quot;KVKK&quot;) uyarınca, Zarify dijital davetiye platformunu
          (&quot;Zarify&quot;, &quot;Platform&quot;) kullanan davetiye
          sahiplerini ve davetiyeleri görüntüleyen misafirleri, kişisel
          verilerinin nasıl işlendiği konusunda bilgilendirmek amacıyla
          hazırlanmıştır.
        </p>
      </section>

      <section>
        <h2>1. Veri Sorumlusu</h2>
        <p>
          Kişisel verileriniz, veri sorumlusu sıfatıyla {e.name} ({e.address})
          tarafından işlenmektedir. Bize {e.email} adresinden
          ulaşabilirsiniz.
        </p>
      </section>

      <section>
        <h2>2. İşlenen Kişisel Veriler</h2>
        <p>
          <strong>Davetiye sahipleri (hesap açan kullanıcılar):</strong>
        </p>
        <ul>
          <li>Kimlik ve iletişim: ad, soyad, e-posta adresi.</li>
          <li>
            Hesap güvenliği: şifreniz (yalnızca geri döndürülemez biçimde
            şifrelenmiş hâliyle saklanır; açık hâlini göremeyiz).
          </li>
          <li>
            Davetiye içeriği: çiftin isimleri, düğün tarihi ve saati, mekân
            adı ve adresi, hikâye metni, günün programı, kıyafet kodu, hediye
            ve konaklama notları gibi davetiyeye sizin eklediğiniz bilgiler.
          </li>
          <li>
            Ödeme işlemi: davetiyenize atanan ödeme referans kodu ve banka
            havalesinin eşleştirilmesi için gönderen adı, tutar ve tarih
            bilgisi. Kart bilgisi toplamıyor ve saklamıyoruz.
          </li>
        </ul>
        <p>
          <strong>Misafirler (katılım bildirimi gönderenler):</strong>
        </p>
        <ul>
          <li>Formda yazdığınız ad soyad.</li>
          <li>Katılım durumu (geliyorum / gelemiyorum / henüz net değil).</li>
          <li>Kişi sayısı.</li>
          <li>Çifte bıraktığınız isteğe bağlı not.</li>
        </ul>
        <p>
          Misafirlerin hesap açması gerekmez; e-posta veya telefon numarası
          istenmez. Lütfen not alanına sağlık bilgisi gibi özel nitelikli
          kişisel veri yazmayınız.
        </p>
        <p>
          <strong>Tüm ziyaretçiler:</strong> Kötüye kullanımı önlemek için
          (ör. aynı bağlantıdan çok sayıda form gönderimi) IP adresiniz kısa
          süreliğine sunucu belleğinde tutulur ve kalıcı olarak kaydedilmez.
          Sunucu ve güvenlik kayıtları teknik zorunluluk ölçüsünde
          tutulabilir.
        </p>
      </section>

      <section>
        <h2>3. İşleme Amaçları ve Hukuki Sebepler</h2>
        <ul>
          <li>
            Hesabınızı oluşturmak, davetiyenizi hazırlamak, yayınlamak ve
            yönetmenizi sağlamak — sözleşmenin kurulması ve ifası (KVKK md.
            5/2-c).
          </li>
          <li>
            Ödemenizi doğrulamak ve davetiyenizi yayına almak — sözleşmenin
            ifası (md. 5/2-c) ve yasal yükümlülüklerimiz (md. 5/2-ç).
          </li>
          <li>
            Misafir katılım bildirimlerini kaydetmek ve davetiye sahibine
            göstermek — misafirin kendi isteğiyle gönderdiği bilginin, davet
            edenle paylaşılması amacıyla işlenmesi; davetiye sahibine sunulan
            hizmetin ifası (md. 5/2-c) ve meşru menfaat (md. 5/2-f).
          </li>
          <li>
            Platformun güvenliğini sağlamak, kötüye kullanımı ve dolandırıcılığı
            önlemek — meşru menfaat (md. 5/2-f).
          </li>
          <li>
            Yetkili kurum ve kuruluşların taleplerini karşılamak — kanunlarda
            açıkça öngörülmesi ve yasal yükümlülük (md. 5/2-a, ç).
          </li>
        </ul>
        <p>
          Kişisel verileriniz pazarlama veya reklam amacıyla kullanılmaz ve
          üçüncü kişilere satılmaz.
        </p>
      </section>

      <section>
        <h2>4. Toplama Yöntemi</h2>
        <p>
          Veriler; kayıt formu, davetiye bilgileri formu ve davetiye
          sayfasındaki katılım bildirimi formu aracılığıyla, doğrudan sizin
          tarafınızdan elektronik ortamda sağlanır. Ödeme eşleştirme
          bilgileri, gönderdiğiniz banka havalesinin hesap hareketlerinden
          elde edilir.
        </p>
      </section>

      <section>
        <h2>5. Verilerin Kimlerle Paylaşıldığı</h2>
        <ul>
          <li>
            <strong>Davetiye sahibi:</strong> Misafirlerin katılım
            bildirimleri (ad, katılım durumu, kişi sayısı, not) yalnızca ilgili
            davetiyenin sahibine gösterilir.
          </li>
          <li>
            <strong>Davetiye bağlantısına sahip herkes:</strong> Yayınlanan
            bir davetiyenin içeriği (isimler, tarih, mekân vb.), bağlantıyı
            bilen herkes tarafından görüntülenebilir. Misafir yanıtları bu
            sayfada gösterilmez.
          </li>
          <li>
            <strong>Hizmet sağlayıcılar:</strong> Platformun çalıştığı sunucu
            ve veritabanı altyapısını sağlayan barındırma hizmeti ({e.hostingLocation}).
            Barındırma hizmetinin yurt dışında bulunması hâlinde aktarım,
            KVKK md. 9&apos;daki şartlara uygun olarak yapılır.
          </li>
          <li>
            <strong>Yetkili kurumlar:</strong> Kanunen yetkili kamu kurum ve
            kuruluşları ile yargı mercileri, talep etmeleri hâlinde.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Saklama Süresi</h2>
        <ul>
          <li>
            Hesap ve davetiye bilgileri, hesabınız açık olduğu sürece
            saklanır; hesabın silinmesi talebiniz üzerine silinir, yok edilir
            veya anonim hâle getirilir.
          </li>
          <li>
            Misafir katılım bildirimleri, ait oldukları davetiye silinene
            kadar saklanır.
          </li>
          <li>
            Ödeme ve faturalandırmaya ilişkin kayıtlar, ilgili mevzuatta
            (ör. Vergi Usul Kanunu, Türk Ticaret Kanunu) öngörülen süreler
            boyunca saklanır.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Tarayıcı Depolama ve Çerezler</h2>
        <p>
          Oturumunuzu açık tutmak ve henüz yayınlamadığınız davetiye
          taslağını kaybetmemeniz için tarayıcınızın yerel depolama alanı
          (localStorage) kullanılır; davetiye açılış animasyonunun aynı
          sekmede tekrar oynamaması için de oturum depolaması
          (sessionStorage) kullanılır. Bu bilgiler yalnızca sizin
          cihazınızda tutulur. Zarify şu anda analiz, reklam veya takip
          amaçlı çerez kullanmamaktadır; bu değişirse bu metin
          güncellenecektir.
        </p>
      </section>

      <section>
        <h2>8. KVKK Kapsamındaki Haklarınız</h2>
        <p>KVKK md. 11 uyarınca veri sorumlusuna başvurarak:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
          <li>
            İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını
            öğrenme,
          </li>
          <li>
            Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
          </li>
          <li>
            Eksik veya yanlış işlenmişse düzeltilmesini isteme ve bunun
            aktarıldığı üçüncü kişilere bildirilmesini isteme,
          </li>
          <li>
            KVKK md. 7&apos;deki şartlar çerçevesinde silinmesini veya yok
            edilmesini isteme ve bunun aktarıldığı üçüncü kişilere
            bildirilmesini isteme,
          </li>
          <li>
            Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize
            bir sonucun ortaya çıkmasına itiraz etme,
          </li>
          <li>
            Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın
            giderilmesini talep etme
          </li>
        </ul>
        <p>haklarına sahipsiniz.</p>
        <p>
          Misafir olarak bir katılım bildiriminizin düzeltilmesini veya
          silinmesini isterseniz davetiye sahibine doğrudan ulaşabilir ya da
          bize başvurabilirsiniz. Aynı davetiyede aynı adla yeniden form
          göndermeniz, önceki yanıtınızı günceller.
        </p>
      </section>

      <section>
        <h2>9. Başvuru Yöntemi</h2>
        <p>
          Taleplerinizi, kimliğinizi doğrulamamıza yetecek bilgilerle birlikte
          {" "}{e.email} adresine e-posta ile veya {e.address} adresine yazılı
          olarak iletebilirsiniz. Başvurunuz, talebin niteliğine göre en geç
          30 gün içinde ücretsiz olarak sonuçlandırılır. Başvurunuzun
          reddedilmesi, verilen cevabı yetersiz bulmanız veya süresinde
          cevap verilmemesi hâlinde Kişisel Verileri Koruma Kurulu&apos;na
          şikâyette bulunabilirsiniz.
        </p>
      </section>

      <section>
        <h2>10. Değişiklikler</h2>
        <p>
          Bu metni, yasal düzenlemeler veya Platform&apos;daki değişiklikler
          doğrultusunda güncelleyebiliriz. Güncel metin her zaman bu sayfada
          yayınlanır. Platform&apos;un kullanımına ilişkin kurallar için{" "}
          <Link href="/kullanim-sartlari">Kullanım Şartları</Link>
          &apos;nı inceleyebilirsiniz.
        </p>
      </section>
    </LegalLayout>
  );
}
