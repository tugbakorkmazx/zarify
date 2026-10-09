"use client";

import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Biz, Price } from "@/components/legal/Placeholder";
import { paymentApprovalNote } from "@/lib/legal";

/* The three texts behind a purchase — Ön Bilgilendirme Formu, Mesafeli
 * Satış Sözleşmesi and İptal ve İade Politikası — written against the
 * actual flow: the owner ticks the confirmation box and publishes, gets an
 * IBAN and a payment reference, pays by bank transfer, and the invitation
 * goes live when an admin confirms the transfer. DRAFTS: the withdrawal
 * exception (Mesafeli Sözleşmeler Yönetmeliği md. 15) and the tax wording
 * must be checked by a lawyer and an accountant. */

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function SellerTr() {
  return (
    <ul>
      <li>Unvan: <Biz field="tradeName" /></li>
      <li>Adres: <Biz field="address" /></li>
      <li>Vergi dairesi / numarası: <Biz field="taxOffice" /> / <Biz field="taxNumber" /></li>
      <li>MERSİS no: <Biz field="mersisNumber" /></li>
      <li>E-posta: <Biz field="email" /> · Telefon: <Biz field="phone" /> · KEP: <Biz field="kepAddress" /></li>
    </ul>
  );
}

function SellerEn() {
  return (
    <ul>
      <li>Name: <Biz field="tradeName" /></li>
      <li>Address: <Biz field="address" /></li>
      <li>Tax office / number: <Biz field="taxOffice" /> / <Biz field="taxNumber" /></li>
      <li>MERSIS no: <Biz field="mersisNumber" /></li>
      <li>Email: <Biz field="email" /> · Phone: <Biz field="phone" /> · KEP: <Biz field="kepAddress" /></li>
    </ul>
  );
}

function ServiceTr() {
  return (
    <p>
      Zarify üzerinde seçilen şablonla hazırlanan, kişiye özel bir bağlantı (URL) üzerinden yayınlanan
      dijital düğün davetiyesi sayfası; misafirlerin davetiyeyi görüntülemesi ve (davetiye sahibi açık
      bıraktıysa) katılım bildirimi göndermesi; gelen yanıtların davetiye sahibinin panelinde
      listelenmesi. Davetiye, yayında kaldığı süre boyunca (<Biz field="servicePeriod" />) davetiye sahibi
      tarafından panelden güncellenebilir. Hizmet tamamen elektronik ortamda sunulur; fiziksel bir ürün
      teslim edilmez.
    </p>
  );
}

function ServiceEn() {
  return (
    <p>
      A personalised digital wedding invitation page built from the chosen Zarify template and published
      at its own link (URL); guests can view it and, if the owner leaves it on, send an RSVP; the replies
      are listed in the owner&apos;s dashboard. While it is online (<Biz field="servicePeriod" />) the owner
      can update the invitation from the dashboard. The service is delivered entirely online; no physical
      goods are delivered.
    </p>
  );
}

function PaymentTr() {
  return (
    <>
      <p>
        Hizmet bedeli, vergiler dahil <Price /> tutarındadır ve tek seferlik ödenir. Ödeme yalnızca banka
        havalesi/EFT ile yapılır: &quot;Davetiyemi Yayınla&quot; adımından sonra size IBAN, hesap sahibi ve
        davetiyenize özel bir ödeme referans kodu gösterilir. Havale açıklamasına bu kodu yazmanız, ödemenin
        davetiyenizle eşleştirilmesi için gereklidir. Kart bilgisi alınmaz.
      </p>
      <p>
        Hizmetin ifasına, havalenin hesabımıza ulaştığı tarafımızca doğrulandığında başlanır: davetiyeniz
        yayına alınır ve bağlantısı misafirlere açılır. {paymentApprovalNote.tr}
      </p>
    </>
  );
}

function PaymentEn() {
  return (
    <>
      <p>
        The price is <Price />, taxes included, paid once. Payment is by bank transfer (EFT/wire) only:
        after the &quot;Publish my invitation&quot; step you are shown the IBAN, the account holder and a
        payment reference unique to your invitation. Please put that reference in the transfer description
        so the payment can be matched to your invitation. No card details are taken.
      </p>
      <p>
        Performance begins once we confirm that the transfer has reached our account: your invitation is
        published and its link opens to guests. {paymentApprovalNote.en}
      </p>
    </>
  );
}

function WithdrawalTr() {
  return (
    <p>
      Hizmet, elektronik ortamda anında ifa edilen bir hizmettir ve ifasına, ödemenin onaylanmasıyla
      birlikte sizin onayınızla başlanır. Bu nedenle 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
      Mesafeli Sözleşmeler Yönetmeliği md. 15/1 (ğ) ve (h) uyarınca, davetiyeniz yayına alındıktan sonra
      cayma hakkı kullanılamaz. Davetiyeniz henüz yayına alınmadıysa siparişinizi iptal edebilir ve
      ödediğiniz bedelin tamamını geri alabilirsiniz; ayrıntılar{" "}
      <Link href="/iptal-ve-iade">İptal ve İade Politikası</Link>&apos;ndadır.
    </p>
  );
}

function WithdrawalEn() {
  return (
    <p>
      The service is performed electronically and instantly, and performance begins, with your consent,
      when the payment is confirmed. Under Consumer Protection Law No. 6502 and Article 15/1 (ğ) and (h)
      of the Distance Contracts Regulation, the right of withdrawal therefore cannot be used once your
      invitation has been published. If it hasn&apos;t been published yet, you can cancel and get the full
      amount back; see the <Link href="/iptal-ve-iade">Cancellation &amp; Refund Policy</Link>.
    </p>
  );
}

function DisputesTr() {
  return (
    <p>
      Şikâyetlerinizi <Biz field="email" /> adresine iletebilirsiniz. Uyuşmazlıklarda, Ticaret
      Bakanlığı&apos;nca her yıl ilan edilen parasal sınırlar dahilinde yerleşim yerinizdeki veya işlemi
      yaptığınız yerdeki Tüketici Hakem Heyetlerine, bu sınırları aşan durumlarda Tüketici Mahkemelerine
      başvurabilirsiniz.
    </p>
  );
}

function DisputesEn() {
  return (
    <p>
      You can send complaints to <Biz field="email" />. For disputes you may apply, within the monetary
      limits announced each year by the Ministry of Trade, to the Consumer Arbitration Committee where you
      live or where the transaction was made, and above those limits to the Consumer Courts.
    </p>
  );
}

// ---------------------------------------------------------------------------
// Ön Bilgilendirme Formu
// ---------------------------------------------------------------------------

export function PreContractInfo() {
  return (
    <LegalLayout
      tr={
        <>
          <section>
            <p>
              Bu form, Mesafeli Sözleşmeler Yönetmeliği md. 5 uyarınca, sözleşme kurulmadan önce sizi
              bilgilendirmek için hazırlanmıştır. &quot;Davetiyemi Yayınla&quot; adımındaki onay kutusunu
              işaretlemeniz, bu formu okuduğunuzu gösterir.
            </p>
          </section>
          <section>
            <h2>1. Satıcı / Hizmet Sağlayıcı</h2>
            <SellerTr />
          </section>
          <section>
            <h2>2. Hizmetin Temel Nitelikleri</h2>
            <ServiceTr />
          </section>
          <section>
            <h2>3. Toplam Bedel, Ödeme ve İfa</h2>
            <PaymentTr />
          </section>
          <section>
            <h2>4. Cayma Hakkı</h2>
            <WithdrawalTr />
          </section>
          <section>
            <h2>5. Şikâyet ve Uyuşmazlıklar</h2>
            <DisputesTr />
          </section>
          <section>
            <h2>6. Kişisel Veriler</h2>
            <p>
              Verilerinizin nasıl işlendiği <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>
              &apos;nde açıklanmıştır. Sözleşmenin tam metni:{" "}
              <Link href="/mesafeli-satis-sozlesmesi">Mesafeli Satış Sözleşmesi</Link>.
            </p>
          </section>
        </>
      }
      en={
        <>
          <section>
            <p>
              This form is given under Article 5 of the Distance Contracts Regulation to inform you before
              the contract is made. Ticking the confirmation box at the &quot;Publish my invitation&quot;
              step shows that you have read it.
            </p>
          </section>
          <section>
            <h2>1. Seller / Service Provider</h2>
            <SellerEn />
          </section>
          <section>
            <h2>2. Main Features of the Service</h2>
            <ServiceEn />
          </section>
          <section>
            <h2>3. Total Price, Payment and Performance</h2>
            <PaymentEn />
          </section>
          <section>
            <h2>4. Right of Withdrawal</h2>
            <WithdrawalEn />
          </section>
          <section>
            <h2>5. Complaints and Disputes</h2>
            <DisputesEn />
          </section>
          <section>
            <h2>6. Personal Data</h2>
            <p>
              How your data is processed is explained in the <Link href="/kvkk-aydinlatma-metni">Personal Data Notice</Link>.
              Full contract text: <Link href="/mesafeli-satis-sozlesmesi">Distance Sales Contract</Link>.
            </p>
          </section>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Mesafeli Satış Sözleşmesi
// ---------------------------------------------------------------------------

export function DistanceSalesContract() {
  return (
    <LegalLayout
      tr={
        <>
          <section>
            <h2>1. Taraflar</h2>
            <p><strong>Satıcı:</strong></p>
            <SellerTr />
            <p>
              <strong>Alıcı:</strong> Zarify&apos;da hesap açan ve &quot;Davetiyemi Yayınla&quot; adımında
              bu sözleşmeyi onaylayan kullanıcı; kayıt sırasında verdiği ad, soyad ve e-posta adresiyle.
            </p>
          </section>
          <section>
            <h2>2. Konu</h2>
            <p>
              Bu sözleşme, Alıcı&apos;nın Zarify üzerinden elektronik ortamda satın aldığı dijital davetiye
              hizmetine ilişkin tarafların hak ve yükümlülüklerini, 6502 sayılı Tüketicinin Korunması
              Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümlerine göre düzenler.
            </p>
          </section>
          <section>
            <h2>3. Hizmet</h2>
            <ServiceTr />
          </section>
          <section>
            <h2>4. Bedel, Ödeme ve İfa</h2>
            <PaymentTr />
          </section>
          <section>
            <h2>5. Cayma Hakkı, İptal ve İade</h2>
            <WithdrawalTr />
          </section>
          <section>
            <h2>6. Tarafların Yükümlülükleri</h2>
            <ul>
              <li>Satıcı, ödemesi onaylanan davetiyeyi yayına almak ve hizmet süresince erişilebilir tutmak için makul özeni gösterir.</li>
              <li>Alıcı, davetiyeye eklediği içeriğin doğruluğundan ve hukuka uygunluğundan sorumludur; <Link href="/kullanim-sartlari">Kullanım Şartları</Link> bu sözleşmenin ayrılmaz parçasıdır.</li>
              <li>Alıcı, misafirlerin katılım bildirimlerini yalnızca davetin organizasyonu için kullanır.</li>
            </ul>
          </section>
          <section>
            <h2>7. Mücbir Sebepler</h2>
            <p>
              Tarafların kontrolü dışındaki olaylar (doğal afet, salgın, altyapı veya enerji kesintisi, siber
              saldırı, resmî makam kararları vb.) nedeniyle yükümlülüklerin geç veya hiç yerine
              getirilememesinden taraflar sorumlu tutulamaz. Bu durum 30 günden uzun sürerse Alıcı, henüz
              yararlanmadığı hizmet bedelinin iadesini isteyebilir.
            </p>
          </section>
          <section>
            <h2>8. Uyuşmazlıklar</h2>
            <DisputesTr />
            <p>
              Tüketici sıfatı taşımayan Alıcılarla uyuşmazlıklarda <Biz field="courtCity" /> mahkemeleri ve
              icra daireleri yetkilidir.
            </p>
          </section>
          <section>
            <h2>9. Yürürlük ve Kayıt</h2>
            <p>
              Sözleşme, Alıcı&apos;nın Ön Bilgilendirme Formu&apos;nu ve bu sözleşmeyi okuduğunu onaylayan
              kutuyu işaretleyip &quot;Onayla ve Devam Et&quot; düğmesine bastığı anda elektronik ortamda
              kurulur. Onay zamanı ve metinlerin sürümü, davetiyeyle birlikte Satıcı&apos;nın sistemlerinde
              kaydedilir ve en az 3 yıl saklanır. Alıcı, sözleşmenin bu sayfadaki güncel metnine her zaman
              ulaşabilir; talep etmesi hâlinde onayladığı sürüm e-posta ile gönderilir.
            </p>
          </section>
        </>
      }
      en={
        <>
          <section>
            <h2>1. Parties</h2>
            <p><strong>Seller:</strong></p>
            <SellerEn />
            <p>
              <strong>Buyer:</strong> the user who opened a Zarify account and accepted this contract at the
              &quot;Publish my invitation&quot; step, identified by the name and email given at sign-up.
            </p>
          </section>
          <section>
            <h2>2. Subject</h2>
            <p>
              This contract sets out the parties&apos; rights and obligations for the digital invitation
              service the Buyer purchases online through Zarify, under Consumer Protection Law No. 6502 and
              the Distance Contracts Regulation.
            </p>
          </section>
          <section>
            <h2>3. Service</h2>
            <ServiceEn />
          </section>
          <section>
            <h2>4. Price, Payment and Performance</h2>
            <PaymentEn />
          </section>
          <section>
            <h2>5. Withdrawal, Cancellation and Refunds</h2>
            <WithdrawalEn />
          </section>
          <section>
            <h2>6. Obligations</h2>
            <ul>
              <li>The Seller takes reasonable care to publish an invitation once its payment is confirmed and to keep it available for the service period.</li>
              <li>The Buyer is responsible for the accuracy and lawfulness of the content they add; the <Link href="/kullanim-sartlari">Terms of Use</Link> form part of this contract.</li>
              <li>The Buyer uses guests&apos; RSVPs only to organise the event.</li>
            </ul>
          </section>
          <section>
            <h2>7. Force Majeure</h2>
            <p>
              Neither party is liable for delay or failure caused by events beyond its control (natural
              disaster, epidemic, infrastructure or power failure, cyber attack, official decisions, etc.).
              If such an event lasts more than 30 days, the Buyer may ask for a refund of the part of the
              service not yet received.
            </p>
          </section>
          <section>
            <h2>8. Disputes</h2>
            <DisputesEn />
            <p>For Buyers who are not consumers, the courts and enforcement offices of <Biz field="courtCity" /> have jurisdiction.</p>
          </section>
          <section>
            <h2>9. Formation and Records</h2>
            <p>
              The contract is made electronically when the Buyer ticks the box confirming they have read the
              Pre-Contract Information Form and this contract and presses &quot;Confirm and continue&quot;.
              The time of acceptance and the version of the texts are recorded with the invitation in the
              Seller&apos;s systems and kept for at least 3 years. The current text is always available on
              this page; on request, the accepted version is sent by email.
            </p>
          </section>
        </>
      }
    />
  );
}

// ---------------------------------------------------------------------------
// İptal ve İade Politikası
// ---------------------------------------------------------------------------

export function RefundPolicy() {
  return (
    <LegalLayout
      tr={
        <>
          <section>
            <h2>1. Cayma Hakkı</h2>
            <WithdrawalTr />
          </section>
          <section>
            <h2>2. İade Yapılan Durumlar</h2>
            <ul>
              <li>
                <strong>Ödeme yapıldı, davetiye henüz yayına alınmadı:</strong> talebiniz üzerine ödediğiniz
                bedelin tamamı iade edilir ve sipariş iptal edilir.
              </li>
              <li>
                <strong>Fazla veya mükerrer ödeme:</strong> hizmet bedelini aşan tutar iade edilir.
              </li>
              <li>
                <strong>Hizmetin bizden kaynaklı nedenle sunulamaması:</strong> ödemesi onaylandığı hâlde
                davetiyeniz teknik bir sorun nedeniyle yayına alınamaz veya uzun süre erişilemez olur ve sorun
                makul sürede giderilemezse, yararlanamadığınız hizmete karşılık gelen bedel iade edilir.
              </li>
            </ul>
          </section>
          <section>
            <h2>3. İade Yapılmayan Durumlar</h2>
            <ul>
              <li>Davetiye yayına alındıktan sonra vazgeçilmesi.</li>
              <li>
                Düğünün ertelenmesi veya iptali: davetiyenizdeki tarih, saat ve diğer bilgileri panelden
                güncelleyebilirsiniz; ayrıca bir ücret alınmaz.
              </li>
              <li>Bağlantının davetiye sahibi tarafından yanlış kişilerle paylaşılması gibi, bizden kaynaklanmayan durumlar.</li>
            </ul>
          </section>
          <section>
            <h2>4. Nasıl Başvurulur, Ne Zaman Ödenir?</h2>
            <p>
              İptal veya iade talebinizi, davetiyenizin ödeme referans kodunu (ör. ZRF-XXXX) ve ödemeyi
              yaptığınız hesabın sahibi ile IBAN bilgisini belirterek <Biz field="email" /> adresine
              iletebilirsiniz. Onaylanan iadeler, talebin bize ulaştığı tarihten itibaren en geç 14 gün
              içinde, ödemenin yapıldığı banka hesabına havale ile yapılır. Havale masrafı bizim tarafımızdan
              karşılanır.
            </p>
          </section>
          <section>
            <h2>5. Uyuşmazlıklar</h2>
            <DisputesTr />
          </section>
        </>
      }
      en={
        <>
          <section>
            <h2>1. Right of Withdrawal</h2>
            <WithdrawalEn />
          </section>
          <section>
            <h2>2. When We Refund</h2>
            <ul>
              <li><strong>Paid, but the invitation isn&apos;t published yet:</strong> on request, the full amount is refunded and the order is cancelled.</li>
              <li><strong>Overpayment or duplicate payment:</strong> anything above the price is refunded.</li>
              <li>
                <strong>We can&apos;t deliver the service:</strong> if a technical problem on our side keeps a
                paid invitation from being published, or makes it unavailable for a long time, and we
                can&apos;t fix it within a reasonable time, the part of the service you couldn&apos;t use is refunded.
              </li>
            </ul>
          </section>
          <section>
            <h2>3. When We Don&apos;t</h2>
            <ul>
              <li>Changing your mind after the invitation has been published.</li>
              <li>The wedding being postponed or cancelled — you can update the date, time and other details from your dashboard at no extra cost.</li>
              <li>Situations not caused by us, such as the owner sharing the link with the wrong people.</li>
            </ul>
          </section>
          <section>
            <h2>4. How to Ask, and When You&apos;re Paid</h2>
            <p>
              Email <Biz field="email" /> with your invitation&apos;s payment reference (e.g. ZRF-XXXX) and the
              account holder and IBAN you paid from. Approved refunds are sent by bank transfer to the paying
              account within 14 days of receiving your request, at our expense.
            </p>
          </section>
          <section>
            <h2>5. Disputes</h2>
            <DisputesEn />
          </section>
        </>
      }
    />
  );
}
