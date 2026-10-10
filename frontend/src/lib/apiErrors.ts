/** Every error the API returns carries a stable `code` (see
 * backend/Zarify.Api/Services/ApiErrors.cs, which keeps the same list).
 * The page shows the message for that code in its own language; the API's
 * own `message` text is never displayed. */

export type Lang = "tr" | "en";

const MESSAGES: Record<string, Record<Lang, string>> = {
  // Auth
  INVALID_CREDENTIALS: { tr: "E-posta veya şifre hatalı.", en: "Incorrect email or password." },
  EMAIL_TAKEN: { tr: "Bu e-posta adresi zaten kayıtlı.", en: "This email address is already registered." },
  SESSION_EXPIRED: {
    tr: "Oturumunuz artık geçerli değil. Lütfen tekrar giriş yapın.",
    en: "Your session has expired. Please sign in again.",
  },
  RESET_TOKEN_INVALID: {
    tr: "Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı isteyin.",
    en: "This password reset link is invalid or has expired. Please request a new one.",
  },
  PASSWORD_INCORRECT: { tr: "Şifre hatalı.", en: "Incorrect password." },
  ACCOUNT_SUSPENDED: {
    tr: "Hesabınız askıya alındı. Bilgi için lütfen bizimle iletişime geçin.",
    en: "Your account has been suspended. Please contact us for details.",
  },
  REJECTION_NOTE_INVALID: {
    tr: "Lütfen reddetme sebebini yazın (en fazla 500 karakter).",
    en: "Please write why the payment is rejected (up to 500 characters).",
  },
  FORBIDDEN: { tr: "Bu işlem için yetkiniz yok.", en: "You don't have permission to do this." },

  // Invitations and payment
  INVITATION_NOT_FOUND: { tr: "Davetiye bulunamadı.", en: "Invitation not found." },
  INVITATION_REMOVED: { tr: "Bu davetiye yayında değil.", en: "This invitation isn't available." },
  NAMES_LOCKED: {
    tr: "Yayındaki bir davetiyede çift adları değiştirilemez. Yazım hatası varsa lütfen bize ulaşın.",
    en: "The couple's names can't be changed on a published invitation. If there's a typo, please contact us.",
  },
  TOO_MANY_PENDING_ORDERS: {
    tr: "Ödeme bekleyen en fazla 5 davetiyeniz olabilir. Yeni bir davetiye için önce bekleyenlerden birini ödeyin ya da iptal edin.",
    en: "You can have at most 5 invitations awaiting payment. Pay for or cancel one of them first.",
  },
  INVITATION_LINK_FAILED: {
    tr: "Davetiye linki oluşturulamadı. Lütfen tekrar deneyin.",
    en: "Couldn't create the invitation link. Please try again.",
  },
  PAYMENT_ALREADY_APPROVED: {
    tr: "Bu davetiyenin ödemesi zaten onaylandı.",
    en: "Payment for this invitation is already approved.",
  },
  PAYMENT_NOT_CONFIGURED: {
    tr: "Ödeme bilgileri henüz tanımlanmadı. Lütfen bizimle iletişime geçin.",
    en: "Payment details aren't set up yet. Please contact us.",
  },
  NOT_AWAITING_PAYMENT: { tr: "Bu davetiye ödeme beklemiyor.", en: "This invitation isn't awaiting payment." },
  CANNOT_CANCEL_PUBLISHED: {
    tr: "Yayındaki bir davetiye iptal edilemez.",
    en: "A published invitation can't be cancelled.",
  },
  DISTANCE_SALES_NOT_ACCEPTED: {
    tr: "Devam etmek için Ön Bilgilendirme Formu'nu ve Mesafeli Satış Sözleşmesi'ni onaylamanız gerekir.",
    en: "To continue, please confirm the Pre-Contract Information Form and the Distance Sales Contract.",
  },

  // Admin
  NOTE_INVALID: { tr: "Lütfen bir gerekçe yazın (en fazla 500 karakter).", en: "Please write a reason (up to 500 characters)." },
  NOT_PUBLISHED: {
    tr: "Yalnızca yayındaki bir davetiye yayından kaldırılabilir.",
    en: "Only a published invitation can be taken offline.",
  },
  NOT_REMOVED: { tr: "Bu davetiye yayından kaldırılmış değil.", en: "This invitation hasn't been taken offline." },
  USER_NOT_FOUND: { tr: "Kullanıcı bulunamadı.", en: "User not found." },
  CANNOT_SUSPEND_ADMIN: { tr: "Yönetici hesapları askıya alınamaz.", en: "Admin accounts can't be suspended." },
  ALREADY_SUSPENDED: { tr: "Bu hesap zaten askıda.", en: "This account is already suspended." },
  NOT_SUSPENDED: { tr: "Bu hesap askıda değil.", en: "This account isn't suspended." },
  EXPORT_RANGE_INVALID: {
    tr: "Geçerli bir tarih aralığı seçin (başlangıç bitişten sonra olamaz, en fazla 3 yıl).",
    en: "Choose a valid date range (start not after end, at most 3 years).",
  },

  // RSVP
  RSVP_CLOSED: {
    tr: "Bu davetiye için katılım bildirimi kapatılmış.",
    en: "RSVPs are closed for this invitation.",
  },
  GUEST_NAME_REQUIRED: { tr: "Lütfen adınızı yazın.", en: "Please enter your name." },

  // Validation
  VALIDATION_FAILED: {
    tr: "Bazı bilgiler geçersiz. Lütfen formu kontrol edin.",
    en: "Some details are invalid. Please check the form.",
  },
  EMAIL_INVALID: { tr: "Lütfen geçerli bir e-posta adresi girin.", en: "Please enter a valid email address." },
  PASSWORD_INVALID: {
    tr: "Şifre en az 8, en fazla 128 karakter olmalı.",
    en: "Your password must be 8 to 128 characters.",
  },
  NAME_INVALID: {
    tr: "Lütfen ad ve soyadınızı girin (en fazla 100 karakter).",
    en: "Please enter your first and last name (up to 100 characters).",
  },
  ATTENDANCE_INVALID: { tr: "Lütfen katılım durumunuzu seçin.", en: "Please choose whether you're attending." },
  GUEST_COUNT_INVALID: {
    tr: "Kişi sayısı 1 ile 20 arasında olmalı.",
    en: "The number of guests must be between 1 and 20.",
  },
  MESSAGE_TOO_LONG: {
    tr: "Metin çok uzun. Lütfen kısaltıp tekrar deneyin.",
    en: "The text is too long. Please shorten it and try again.",
  },
  SCHEDULE_TOO_LONG: {
    tr: "Programa en fazla 12 satır eklenebilir.",
    en: "The schedule can have at most 12 entries.",
  },
  SCHEDULE_ITEM_INVALID: {
    tr: "Program satırlarını kontrol edin: saat SS:DD biçiminde olmalı ve başlık boş olmamalı.",
    en: "Check the schedule: times must be HH:MM and every entry needs a title.",
  },
  RSVP_DEADLINE_AFTER_WEDDING: {
    tr: "Katılım bildirimi son tarihi düğün tarihinden sonra olamaz.",
    en: "The RSVP deadline can't be after the wedding date.",
  },
  REQUEST_TOO_LARGE: {
    tr: "Gönderilen bilgi çok uzun. Lütfen kısaltıp tekrar deneyin.",
    en: "What you sent is too long. Please shorten it and try again.",
  },

  // Infrastructure
  RATE_LIMITED: {
    tr: "Çok fazla deneme yaptınız. Lütfen biraz bekleyip tekrar deneyin.",
    en: "Too many attempts. Please wait a moment and try again.",
  },
  INTERNAL_ERROR: {
    tr: "Bir sorun oluştu. Lütfen tekrar deneyin.",
    en: "Something went wrong. Please try again.",
  },
  // Only when the request never got an answer (offline, DNS, server down).
  NETWORK_ERROR: {
    tr: "Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.",
    en: "Couldn't reach the server. Check your connection and try again.",
  },
};

/** The page's current language (kept on <html lang> by the language
 * toggle). Also sent to the API as Accept-Language. */
export function pageLanguage(): Lang {
  if (typeof document === "undefined") return "tr";
  return document.documentElement.lang === "en" ? "en" : "tr";
}

export function errorMessage(code: string, lang: Lang = pageLanguage()): string {
  return (MESSAGES[code] ?? MESSAGES.INTERNAL_ERROR)[lang];
}

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message = errorMessage(code)) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** For a response without a usable code (a proxy's 502, the JWT
 * middleware's bare 401, Kestrel's 413). */
function codeForStatus(status: number): string {
  if (status === 401) return "SESSION_EXPIRED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "INVITATION_NOT_FOUND";
  if (status === 413) return "REQUEST_TOO_LARGE";
  if (status === 429) return "RATE_LIMITED";
  if (status === 400) return "VALIDATION_FAILED";
  return "INTERNAL_ERROR";
}

/** Turns a failed response into an ApiError whose message is already in
 * the page's language. */
export async function apiErrorFrom(res: Response): Promise<ApiError> {
  let code: string | null = null;
  try {
    const body = await res.json();
    if (typeof body?.code === "string" && body.code in MESSAGES) code = body.code;
  } catch {
    // not JSON
  }
  return new ApiError(res.status, code ?? codeForStatus(res.status));
}

/** The message for anything a form might catch: an ApiError from the
 * server, or a fetch that never got an answer. */
export function describeError(err: unknown): string {
  return err instanceof ApiError ? err.message : errorMessage("NETWORK_ERROR");
}
