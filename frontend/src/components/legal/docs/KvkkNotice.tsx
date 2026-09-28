"use client";

import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Biz } from "@/components/legal/Placeholder";

/** KVKK md. 10 aydınlatma metni — for account holders and for guests who
 * send an RSVP. DRAFT: to be reviewed by a lawyer. */
export function KvkkNotice() {
  return <LegalLayout tr={<Tr />} en={<En />} />;
}

function Tr() {
  return (
    <>
      <section>
        <p>
          Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) md. 10 uyarınca,
          Zarify dijital davetiye platformunda (&quot;Platform&quot;) hesap açan davetiye sahiplerini
          ve davetiyelere katılım bildirimi gönderen misafirleri, kişisel verilerinin nasıl işlendiği
          konusunda bilgilendirmek için hazırlanmıştır.
        </p>
      </section>

      <section>
        <h2>1. Veri Sorumlusu</h2>
        <p>
          Veri sorumlusu: <Biz field="tradeName" />, <Biz field="address" />. E-posta:{" "}
          <Biz field="email" />, telefon: <Biz field="phone" />, KEP: <Biz field="kepAddress" />.
        </p>
      </section>

      <section>
        <h2>2. Hangi Verileri İşliyoruz?</h2>
        <h3>Davetiye sahipleri (kayıt olan kullanıcılar)</h3>
        <ul>
          <li>Kimlik ve iletişim: ad, soyad, e-posta adresi.</li>
          <li>Hesap güvenliği: şifre (yalnızca geri döndürülemez biçimde şifrelenmiş hâliyle; açık hâlini göremeyiz).</li>
          <li>
            Davetiye içeriği: çiftin isimleri, düğün tarihi ve saati, mekân adı ve adresi, hikâye metni,
            program, kıyafet kodu, hediye ve konaklama notları gibi davetiyeye eklediğiniz bilgiler.
          </li>
          <li>
            Ödeme ve sözleşme: davetiyenize atanan ödeme referans kodu; havalenin eşleştirilmesi için
            gönderen adı, tutar ve tarih; Ön Bilgilendirme Formu ile Mesafeli Satış Sözleşmesi&apos;ni
            onayladığınız zaman ve metinlerin sürümü. Kart bilgisi toplamıyoruz.
          </li>
        </ul>
        <h3>Misafirler (katılım bildirimi gönderenler)</h3>
        <ul>
          <li>Formda yazdığınız ad soyad,</li>
          <li>katılım durumu (geliyorum / henüz net değil / gelemiyorum),</li>
          <li>kişi sayısı,</li>
          <li>çifte bıraktığınız isteğe bağlı not.</li>
        </ul>
        <p>
          Misafirlerin hesap açması gerekmez; e-posta veya telefon istenmez. Lütfen not alanına sağlık
          bilgisi gibi özel nitelikli kişisel veri yazmayınız.
        </p>
        <h3>Tüm ziyaretçiler</h3>
        <p>
          Kötüye kullanımı önlemek için (ör. kısa sürede çok sayıda giriş denemesi veya form gönderimi) IP
          adresiniz ve giriş/kayıt denemelerinde yazdığınız e-posta adresi, en fazla 10 dakika boyunca
          yalnızca sunucu belleğinde sayaç olarak tutulur; kalıcı olarak kaydedilmez.
        </p>
      </section>

      <section>
        <h2>3. Hangi Amaçla ve Hangi Hukuki Sebeple?</h2>
        <ul>
          <li>
            Hesabınızı oluşturmak, davetiyenizi hazırlamak, yayınlamak ve yönetmenizi sağlamak —
            sözleşmenin kurulması ve ifası (KVKK md. 5/2-c).
          </li>
          <li>
            Ödemenizi doğrulamak, davetiyenizi yayına almak, sözleşme ve onay kayıtlarını tutmak —
            sözleşmenin ifası (md. 5/2-c) ve hukuki yükümlülüklerimiz (md. 5/2-ç).
          </li>
          <li>
            Misafir katılım bildirimlerini kaydetmek ve davetiye sahibine göstermek — davetiye sahibine
            sunulan hizmetin ifası (md. 5/2-c) ve misafirin kendi isteğiyle gönderdiği bilginin davet
            edenle paylaşılmasındaki meşru menfaat (md. 5/2-f).
          </li>
          <li>Platformun güvenliğini sağlamak, kötüye kullanımı önlemek — meşru menfaat (md. 5/2-f).</li>
          <li>Yetkili kurumların taleplerini karşılamak — kanunlarda öngörülmesi, hukuki yükümlülük (md. 5/2-a, ç).</li>
        </ul>
        <p>Verileriniz pazarlama veya reklam amacıyla kullanılmaz, üçüncü kişilere satılmaz.</p>
      </section>

      <section>
        <h2>4. Nasıl Topluyoruz?</h2>
        <p>
          Veriler; kayıt formu, davetiye bilgileri formu ve davetiye sayfasındaki katılım bildirimi formu
          aracılığıyla doğrudan sizin tarafınızdan elektronik ortamda sağlanır. Ödeme eşleştirme
          bilgileri, gönderdiğiniz havalenin hesap hareketlerinden elde edilir.
        </p>
      </section>

      <section>
        <h2>5. Nerede Saklıyoruz?</h2>
        <p>
          Veriler, Platformun veritabanında (<Biz field="hostingProvider" />) saklanır ve aktarım
          sırasında şifreli bağlantı (HTTPS) kullanılır. Barındırma hizmetinin yurt dışında bulunması
          hâlinde aktarım, KVKK md. 9&apos;daki şartlara uygun olarak yapılır. Oturumunuzu açık tutan
          bilgiler ve yayınlanmamış davetiye taslağınız ise yalnızca kendi tarayıcınızda tutulur (bkz.{" "}
          <Link href="/cerez-politikasi">Çerez Politikası</Link>).
        </p>
      </section>

      <section>
        <h2>6. Kimlerle Paylaşıyoruz?</h2>
        <ul>
          <li>
            <strong>Davetiye sahibi:</strong> Misafirlerin katılım bildirimleri (ad, katılım durumu, kişi
            sayısı, not) yalnızca ilgili davetiyenin sahibine, kendi panelinde gösterilir.
          </li>
          <li>
            <strong>Davetiye bağlantısını bilen herkes:</strong> Yayınlanan davetiyenin içeriği (isimler,
            tarih, mekân vb.) bağlantıyı bilen herkesçe görüntülenebilir. Misafir yanıtları bu sayfada
            gösterilmez.
          </li>
          <li>
            <strong>Hizmet sağlayıcılar:</strong> sunucu ve veritabanı altyapısını sağlayan barındırma
            hizmeti (<Biz field="hostingProvider" />).
          </li>
          <li><strong>Yetkili kurumlar:</strong> kanunen yetkili kamu kurum ve kuruluşları ile yargı mercileri, talep hâlinde.</li>
        </ul>
      </section>

      <section>
        <h2>7. Ne Kadar Süre Saklıyoruz?</h2>
        <ul>
          <li>Hesap bilgileri: hesabınız açık olduğu sürece; hesabın kapatılması talebinizden sonra silinir veya anonim hâle getirilir.</li>
          <li>
            Davetiye içeriği ve misafir katılım bildirimleri: davetiyenin yayın süresi (<Biz field="servicePeriod" />)
            boyunca ve sonrasında en fazla 6 ay; bu sürenin sonunda veya davetiye sahibinin talebiyle silinir
            ya da anonim hâle getirilir.
          </li>
          <li>
            Sözleşme ve onay kayıtları: 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca
            en az 3 yıl.
          </li>
          <li>Ödeme ve faturalandırma kayıtları: Vergi Usul Kanunu ve Türk Ticaret Kanunu&apos;nda öngörülen süreler (5–10 yıl).</li>
          <li>Güvenlik sayaçları (IP, deneme e-postası): en fazla 10 dakika, yalnızca bellekte.</li>
        </ul>
      </section>

      <section>
        <h2>8. KVKK md. 11 Kapsamındaki Haklarınız</h2>
        <p>Veri sorumlusuna başvurarak:</p>
        <ul>
          <li>kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>işlenmişse buna ilişkin bilgi talep etme,</li>
          <li>işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
          <li>eksik veya yanlış işlenmişse düzeltilmesini ve bunun aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>KVKK md. 7 çerçevesinde silinmesini veya yok edilmesini ve bunun aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
          <li>kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
        </ul>
        <p>haklarına sahipsiniz.</p>
        <p>
          Misafir olarak katılım bildiriminizi düzeltmek için aynı davetiyede aynı adla formu yeniden
          gönderebilirsiniz; önceki yanıtınız güncellenir. Silinmesini isterseniz davetiye sahibine veya
          bize başvurabilirsiniz.
        </p>
      </section>

      <section>
        <h2>9. Başvuru</h2>
        <p>
          Taleplerinizi, kimliğinizi doğrulamamıza yetecek bilgilerle <Biz field="email" /> adresine
          e-posta ile, <Biz field="kepAddress" /> KEP adresine veya <Biz field="address" /> adresine
          yazılı olarak iletebilirsiniz. Başvurunuz en geç 30 gün içinde ücretsiz sonuçlandırılır.
          Başvurunuzun reddedilmesi, cevabı yetersiz bulmanız veya süresinde cevap verilmemesi hâlinde
          Kişisel Verileri Koruma Kurulu&apos;na şikâyette bulunabilirsiniz.
        </p>
      </section>
    </>
  );
}

function En() {
  return (
    <>
      <section>
        <p>
          This notice is given under Article 10 of Turkey&apos;s Personal Data Protection Law No. 6698
          (&quot;KVKK&quot;) to invitation owners who open an account on the Zarify digital invitation
          platform (the &quot;Platform&quot;) and to guests who send an RSVP, explaining how their
          personal data is processed.
        </p>
      </section>

      <section>
        <h2>1. Data Controller</h2>
        <p>
          Data controller: <Biz field="tradeName" />, <Biz field="address" />. Email: <Biz field="email" />,
          phone: <Biz field="phone" />, KEP: <Biz field="kepAddress" />.
        </p>
      </section>

      <section>
        <h2>2. What We Process</h2>
        <h3>Invitation owners (registered users)</h3>
        <ul>
          <li>Identity and contact: first name, last name, email address.</li>
          <li>Account security: your password (stored only as an irreversible hash; we can never see it).</li>
          <li>
            Invitation content: the couple&apos;s names, wedding date and time, venue name and address,
            story, schedule, dress code, gift and accommodation notes — whatever you add.
          </li>
          <li>
            Payment and contract: the payment reference assigned to your invitation; the sender name,
            amount and date used to match your transfer; when you accepted the Pre-Contract Information
            Form and the Distance Sales Contract, and which version. We do not collect card details.
          </li>
        </ul>
        <h3>Guests (who send an RSVP)</h3>
        <ul>
          <li>the name you type in the form,</li>
          <li>whether you&apos;re attending (yes / not sure yet / no),</li>
          <li>the number of guests,</li>
          <li>the optional note you leave for the couple.</li>
        </ul>
        <p>
          Guests don&apos;t need an account, and we never ask for an email or phone number. Please don&apos;t
          put sensitive data such as health information in the note.
        </p>
        <h3>All visitors</h3>
        <p>
          To prevent abuse (such as many sign-in attempts or form submissions in a short time), your IP
          address, and the email address typed into a sign-in or sign-up attempt, are kept as counters in
          server memory only, for at most 10 minutes, and are never stored permanently.
        </p>
      </section>

      <section>
        <h2>3. Purposes and Legal Grounds</h2>
        <ul>
          <li>Creating your account and letting you prepare, publish and manage your invitation — performance of a contract (KVKK Art. 5/2-c).</li>
          <li>Verifying your payment, publishing your invitation and keeping contract and consent records — performance of a contract (5/2-c) and our legal obligations (5/2-ç).</li>
          <li>
            Recording guests&apos; RSVPs and showing them to the invitation owner — performance of the
            service provided to the owner (5/2-c) and the legitimate interest in passing on what the guest
            chose to send to the person who invited them (5/2-f).
          </li>
          <li>Keeping the Platform secure and preventing abuse — legitimate interest (5/2-f).</li>
          <li>Responding to requests from competent authorities — required by law, legal obligation (5/2-a, ç).</li>
        </ul>
        <p>Your data is never used for marketing or advertising and is never sold.</p>
      </section>

      <section>
        <h2>4. How We Collect It</h2>
        <p>
          You provide it electronically through the sign-up form, the invitation details form and the RSVP
          form on the invitation page. Payment matching details come from the bank statement of the
          transfer you send.
        </p>
      </section>

      <section>
        <h2>5. Where It Is Stored</h2>
        <p>
          In the Platform&apos;s database (<Biz field="hostingProvider" />), over encrypted connections
          (HTTPS). If the hosting is outside Turkey, the transfer complies with KVKK Art. 9. What keeps you
          signed in and your unpublished draft stay only in your own browser (see the{" "}
          <Link href="/cerez-politikasi">Cookie Policy</Link>).
        </p>
      </section>

      <section>
        <h2>6. Who We Share It With</h2>
        <ul>
          <li><strong>The invitation owner:</strong> guests&apos; RSVPs (name, attendance, number of guests, note) are shown only to the owner of that invitation, in their dashboard.</li>
          <li><strong>Anyone with the invitation link:</strong> a published invitation&apos;s content (names, date, venue…) can be viewed by anyone who has the link. Guests&apos; replies are never shown there.</li>
          <li><strong>Service providers:</strong> the hosting provider for our servers and database (<Biz field="hostingProvider" />).</li>
          <li><strong>Authorities:</strong> competent public bodies and courts, on request.</li>
        </ul>
      </section>

      <section>
        <h2>7. How Long We Keep It</h2>
        <ul>
          <li>Account details: while your account is open; deleted or anonymised after you ask us to close it.</li>
          <li>
            Invitation content and guests&apos; RSVPs: for the invitation&apos;s publication period
            (<Biz field="servicePeriod" />) and at most 6 months after; then deleted or anonymised, or
            earlier at the owner&apos;s request.
          </li>
          <li>Contract and consent records: at least 3 years, under Law No. 6502 and the Distance Contracts Regulation.</li>
          <li>Payment and invoicing records: for the periods set by the Tax Procedure Law and the Turkish Commercial Code (5–10 years).</li>
          <li>Security counters (IP, sign-in email): at most 10 minutes, in memory only.</li>
        </ul>
      </section>

      <section>
        <h2>8. Your Rights Under KVKK Article 11</h2>
        <p>By applying to the data controller you may:</p>
        <ul>
          <li>learn whether your personal data is processed,</li>
          <li>request information about it if so,</li>
          <li>learn the purpose of processing and whether it is used accordingly,</li>
          <li>know the third parties it is transferred to in Turkey or abroad,</li>
          <li>ask for incomplete or incorrect data to be corrected, and for this to be notified to those third parties,</li>
          <li>ask for it to be erased or destroyed under KVKK Art. 7, and for this to be notified to those third parties,</li>
          <li>object to a result against you arising solely from automated analysis,</li>
          <li>claim compensation for damage caused by unlawful processing.</li>
        </ul>
        <p>
          As a guest you can correct your RSVP by sending the form again under the same name on the same
          invitation — your earlier reply is updated. To have it deleted, contact the invitation owner or us.
        </p>
      </section>

      <section>
        <h2>9. How to Apply</h2>
        <p>
          Send your request, with enough information for us to verify your identity, by email to{" "}
          <Biz field="email" />, to our KEP address <Biz field="kepAddress" />, or in writing to{" "}
          <Biz field="address" />. We answer free of charge within 30 days at the latest. If your request is
          refused, you find the answer insufficient, or we don&apos;t answer in time, you may complain to
          the Personal Data Protection Board.
        </p>
      </section>
    </>
  );
}
