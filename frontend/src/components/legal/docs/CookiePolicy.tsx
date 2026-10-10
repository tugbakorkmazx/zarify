"use client";

import Link from "next/link";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { Biz } from "@/components/legal/Placeholder";

/** Written from an actual scan of the code (2026-10-10): one strictly
 * necessary cookie (the sign-in refresh cookie), nothing from third
 * parties, and the browser-storage entries listed below. Update this page
 * whenever that changes — and add a consent banner if any non-essential
 * cookie or tracker is ever introduced. DRAFT: to be reviewed by a lawyer. */
export function CookiePolicy() {
  return <LegalLayout tr={<Tr />} en={<En />} />;
}

function Tr() {
  return (
    <>
      <section>
        <p>
          Bu politika, Zarify&apos;ın tarayıcınızda hangi bilgileri, ne amaçla ve ne kadar süre
          sakladığını açıklar.
        </p>
      </section>

      <section>
        <h2>1. Kısaca</h2>
        <ul>
          <li>
            <strong>Zarify yalnızca bir çerez kullanır:</strong> giriş yaptığınızda oturumunuzu güvenle açık
            tutan, kesinlikle gerekli bir oturum yenileme çerezi.
          </li>
          <li>Analiz, reklam, takip veya sosyal medya çerezi ya da benzeri bir izleme aracı yoktur.</li>
          <li>
            Sayfalar üçüncü taraf kaynak yüklemez: yazı tipleri ve görseller kendi sunucumuzdan gelir,
            dışarıdan betik, harita veya video gömülmez.
          </li>
          <li>
            Bunun dışında yalnızca sitenin çalışması için zorunlu birkaç bilgi tarayıcınızın yerel depolama
            alanlarında tutulur (aşağıdaki tablo). Hiçbiri sizi başka sitelerde tanımak için kullanılamaz.
          </li>
          <li>
            Kullanılan tüm depolama kesinlikle gerekli nitelikte olduğundan onay (çerez) banner&apos;ı
            gösterilmez.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. Tarayıcıda Tutulan Bilgiler</h2>
        <table>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Tür</th>
              <th>Ne için</th>
              <th>Ne kadar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>zarify_refresh</code></td>
              <td>Çerez (birinci taraf; HttpOnly, Secure, SameSite=Strict)</td>
              <td>
                Oturumunuzu yenilemek için kullanılan rastgele bir anahtar. Sayfa betikleri tarafından okunamaz,
                yalnızca bizim giriş adresimize (<code>/api/auth</code>) gönderilir; sunucuda yalnızca geri
                döndürülemez özeti tutulur ve her kullanımda yenisiyle değiştirilir. Şifreniz değiştiğinde,
                hesabınız askıya alındığında veya silindiğinde ya da çıkış yaptığınızda geçersiz olur.
              </td>
              <td>Son kullanımdan itibaren 14 gün; çıkış yaptığınızda silinir.</td>
            </tr>
            <tr>
              <td><code>zarify.auth</code></td>
              <td>localStorage</td>
              <td>Giriş yaptığınızda kısa ömürlü oturum anahtarı ile adınızı, e-postanızı ve hesap türünüzü tutar.</td>
              <td>Çıkış yapana kadar; anahtar 15 dakikada bir yukarıdaki çerezle yenilenir.</td>
            </tr>
            <tr>
              <td><code>zarify.edit.&lt;davetiye&gt;</code>, <code>zarify.preview.&lt;davetiye&gt;</code></td>
              <td>localStorage</td>
              <td>Yayındaki davetiyenizde henüz kaydetmediğiniz değişiklikleri, oturumunuz düşerse kaybolmasın ve &quot;Önizle&quot; sekmesinde gösterilebilsin diye saklar.</td>
              <td>Değişiklikleri kaydedene veya atana kadar.</td>
            </tr>
            <tr>
              <td><code>zarify.invitationDraft</code></td>
              <td>localStorage</td>
              <td>Henüz yayınlamadığınız davetiyenin form bilgilerini, önizlemeye geçerken kaybolmasın diye saklar.</td>
              <td>Davetiyeyi yayınlayana veya taslağı temizleyene kadar.</td>
            </tr>
            <tr>
              <td><code>zarify.envelopeShown.&lt;davetiye&gt;</code></td>
              <td>sessionStorage</td>
              <td>Bir davetiyenin zarf açılış animasyonunun aynı sekmede yeniden oynamamasını sağlar (değeri yalnızca &quot;1&quot;).</td>
              <td>Sekmeyi kapatana kadar.</td>
            </tr>
            <tr>
              <td><code>zarify.rsvp.&lt;davetiye&gt;</code></td>
              <td>localStorage</td>
              <td>Bir davetiyeye katılım bildirimi gönderdiğinizde, yanıtınızı yalnızca bu tarayıcıdan güncelleyebilmeniz için rastgele bir düzenleme anahtarı ve yazdığınız adı saklar. Sunucuda anahtarın yalnızca geri döndürülemez özeti tutulur.</td>
              <td>Tarayıcı verilerini temizleyene kadar.</td>
            </tr>
          </tbody>
        </table>
        <p>Dil tercihiniz (TR/EN) hiçbir yerde saklanmaz; sayfa yenilendiğinde Türkçe açılır.</p>
      </section>

      <section>
        <h2>3. Nasıl Silebilirsiniz?</h2>
        <p>
          &quot;Çıkış Yap&quot; oturum bilgisini ve oturum yenileme çerezini siler. Tüm bilgileri, tarayıcınızın ayarlarından bu site
          için &quot;site verilerini temizle&quot; seçeneğiyle istediğiniz zaman silebilirsiniz; bu durumda
          yeniden giriş yapmanız gerekir ve yayınlanmamış taslağınız kaybolur.
        </p>
      </section>

      <section>
        <h2>4. Değişiklikler ve İletişim</h2>
        <p>
          İleride analiz veya benzeri, zorunlu olmayan bir araç eklersek bu politikayı güncelleyecek ve
          kullanmadan önce onayınızı isteyeceğiz. Kişisel verilerinizin işlenmesi hakkında bilgi için{" "}
          <Link href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</Link>&apos;ni inceleyebilir, sorularınız
          için <Biz field="email" /> adresine yazabilirsiniz.
        </p>
      </section>
    </>
  );
}

function En() {
  return (
    <>
      <section>
        <p>This policy explains what Zarify keeps in your browser, why, and for how long.</p>
      </section>

      <section>
        <h2>1. In Short</h2>
        <ul>
          <li><strong>Zarify uses a single cookie:</strong> a strictly necessary refresh cookie that keeps you securely signed in.</li>
          <li>There are no analytics, advertising, tracking or social-media cookies, and no similar tracking tools.</li>
          <li>Pages load nothing from third parties: fonts and images come from our own server, and no outside scripts, maps or videos are embedded.</li>
          <li>
            Apart from that, only a few pieces of information the site needs in order to work are kept in
            your browser&apos;s local storage (table below). None of it can be used to recognise you on other
            sites.
          </li>
          <li>Because all of this storage is strictly necessary, no consent banner is shown.</li>
        </ul>
      </section>

      <section>
        <h2>2. What Is Kept in Your Browser</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>zarify_refresh</code></td>
              <td>Cookie (first-party; HttpOnly, Secure, SameSite=Strict)</td>
              <td>
                A random key used to renew your session. Page scripts can&apos;t read it; it is sent only to our
                sign-in endpoint (<code>/api/auth</code>), the server keeps only an irreversible hash of it, and
                it is replaced on every use. It stops working when your password changes, your account is
                suspended or deleted, or you sign out.
              </td>
              <td>14 days from last use; deleted when you sign out.</td>
            </tr>
            <tr>
              <td><code>zarify.auth</code></td>
              <td>localStorage</td>
              <td>When you&apos;re signed in: a short-lived session token, your name, email and account type.</td>
              <td>Until you sign out; the token is renewed every 15 minutes with the cookie above.</td>
            </tr>
            <tr>
              <td><code>zarify.edit.&lt;invitation&gt;</code>, <code>zarify.preview.&lt;invitation&gt;</code></td>
              <td>localStorage</td>
              <td>Unsaved changes to your published invitation, so they survive a session that ends and can be shown in the &quot;Preview&quot; tab.</td>
              <td>Until you save or discard them.</td>
            </tr>
            <tr>
              <td><code>zarify.invitationDraft</code></td>
              <td>localStorage</td>
              <td>Keeps the details of an invitation you haven&apos;t published yet, so they aren&apos;t lost on the way to the preview.</td>
              <td>Until you publish or clear the draft.</td>
            </tr>
            <tr>
              <td><code>zarify.envelopeShown.&lt;invitation&gt;</code></td>
              <td>sessionStorage</td>
              <td>Stops an invitation&apos;s envelope animation from replaying in the same tab (the value is just &quot;1&quot;).</td>
              <td>Until you close the tab.</td>
            </tr>
            <tr>
              <td><code>zarify.rsvp.&lt;invitation&gt;</code></td>
              <td>localStorage</td>
              <td>After you RSVP to an invitation, keeps a random edit key and the name you entered, so your reply can be updated from this browser only. The server keeps only an irreversible hash of the key.</td>
              <td>Until you clear your browser data.</td>
            </tr>
          </tbody>
        </table>
        <p>Your language choice (TR/EN) is not stored anywhere; the site opens in Turkish after a reload.</p>
      </section>

      <section>
        <h2>3. How to Delete It</h2>
        <p>
          &quot;Sign out&quot; removes the session and the refresh cookie. You can remove everything at any time with your
          browser&apos;s &quot;clear site data&quot; option for this site; you&apos;ll then need to sign in
          again and any unpublished draft is lost.
        </p>
      </section>

      <section>
        <h2>4. Changes and Contact</h2>
        <p>
          If we ever add analytics or any other non-essential tool, we will update this policy and ask for
          your consent before using it. For how your personal data is processed, see the{" "}
          <Link href="/kvkk-aydinlatma-metni">Personal Data Notice</Link>; for questions, write to{" "}
          <Biz field="email" />.
        </p>
      </section>
    </>
  );
}
