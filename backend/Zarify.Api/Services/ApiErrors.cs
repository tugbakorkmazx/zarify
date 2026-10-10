using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Zarify.Api.Services;

/// Every error the API returns has the same shape:
///   { "code": "INVITATION_NOT_FOUND", "message": "…" }
/// `code` is the stable contract — the frontend translates it into the
/// page's language (frontend/src/lib/apiErrors.ts keeps the same list).
/// `message` is a readable fallback in the caller's Accept-Language
/// (Turkish unless it asks for English), for anyone calling the API
/// without the frontend.
public static class ErrorCodes
{
    // Auth
    public const string InvalidCredentials = "INVALID_CREDENTIALS";
    public const string EmailTaken = "EMAIL_TAKEN";
    public const string SessionExpired = "SESSION_EXPIRED";
    public const string ResetTokenInvalid = "RESET_TOKEN_INVALID";
    public const string PasswordIncorrect = "PASSWORD_INCORRECT";

    // Invitations and payment
    public const string InvitationNotFound = "INVITATION_NOT_FOUND";
    public const string InvitationNotPublished = "INVITATION_NOT_PUBLISHED";
    public const string InvitationLinkFailed = "INVITATION_LINK_FAILED";
    public const string PaymentAlreadyApproved = "PAYMENT_ALREADY_APPROVED";
    public const string PaymentNotConfigured = "PAYMENT_NOT_CONFIGURED";
    public const string NotAwaitingPayment = "NOT_AWAITING_PAYMENT";
    public const string DistanceSalesNotAccepted = "DISTANCE_SALES_NOT_ACCEPTED";
    public const string CannotCancelPublished = "CANNOT_CANCEL_PUBLISHED";
    public const string RejectionNoteInvalid = "REJECTION_NOTE_INVALID";

    // RSVP
    public const string RsvpClosed = "RSVP_CLOSED";
    public const string GuestNameRequired = "GUEST_NAME_REQUIRED";

    // Validation (400) — the first invalid field decides the code.
    public const string ValidationFailed = "VALIDATION_FAILED";
    public const string EmailInvalid = "EMAIL_INVALID";
    public const string PasswordInvalid = "PASSWORD_INVALID";
    public const string NameInvalid = "NAME_INVALID";
    public const string AttendanceInvalid = "ATTENDANCE_INVALID";
    public const string GuestCountInvalid = "GUEST_COUNT_INVALID";
    public const string MessageTooLong = "MESSAGE_TOO_LONG";
    public const string ScheduleTooLong = "SCHEDULE_TOO_LONG";
    public const string ScheduleItemInvalid = "SCHEDULE_ITEM_INVALID";
    public const string RsvpDeadlineAfterWedding = "RSVP_DEADLINE_AFTER_WEDDING";

    // Infrastructure
    public const string RateLimited = "RATE_LIMITED";
    public const string InternalError = "INTERNAL_ERROR";
}

public static class ApiErrors
{
    private static readonly Dictionary<string, (string Tr, string En)> Messages = new()
    {
        [ErrorCodes.InvalidCredentials] = ("E-posta veya şifre hatalı.", "Incorrect email or password."),
        [ErrorCodes.ResetTokenInvalid] = ("Bu şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. Lütfen yeni bir bağlantı isteyin.", "This password reset link is invalid or has expired. Please request a new one."),
        [ErrorCodes.PasswordIncorrect] = ("Şifre hatalı.", "Incorrect password."),
        [ErrorCodes.RejectionNoteInvalid] = ("Lütfen reddetme sebebini yazın (en fazla 500 karakter).", "Please write why the payment is rejected (up to 500 characters)."),
        [ErrorCodes.EmailTaken] = ("Bu e-posta adresi zaten kayıtlı.", "This email address is already registered."),
        [ErrorCodes.SessionExpired] = ("Oturumunuz artık geçerli değil. Lütfen tekrar giriş yapın.", "Your session has expired. Please sign in again."),
        [ErrorCodes.InvitationNotFound] = ("Davetiye bulunamadı.", "Invitation not found."),
        [ErrorCodes.InvitationNotPublished] = ("Bu davetiye henüz yayında değil.", "This invitation isn't published yet."),
        [ErrorCodes.InvitationLinkFailed] = ("Davetiye linki oluşturulamadı. Lütfen tekrar deneyin.", "Couldn't create the invitation link. Please try again."),
        [ErrorCodes.PaymentAlreadyApproved] = ("Bu davetiyenin ödemesi zaten onaylandı.", "Payment for this invitation is already approved."),
        [ErrorCodes.PaymentNotConfigured] = ("Ödeme bilgileri henüz tanımlanmadı. Lütfen bizimle iletişime geçin.", "Payment details aren't set up yet. Please contact us."),
        [ErrorCodes.NotAwaitingPayment] = ("Bu davetiye ödeme beklemiyor.", "This invitation isn't awaiting payment."),
        [ErrorCodes.CannotCancelPublished] = ("Yayındaki bir davetiye iptal edilemez.", "A published invitation can't be cancelled."),
        [ErrorCodes.DistanceSalesNotAccepted] = ("Devam etmek için Ön Bilgilendirme Formu'nu ve Mesafeli Satış Sözleşmesi'ni onaylamanız gerekir.", "To continue, please confirm the Pre-Contract Information Form and the Distance Sales Contract."),
        [ErrorCodes.RsvpClosed] = ("Bu davetiye için katılım bildirimi kapatılmış.", "RSVPs are closed for this invitation."),
        [ErrorCodes.GuestNameRequired] = ("Lütfen adınızı yazın.", "Please enter your name."),
        [ErrorCodes.ValidationFailed] = ("Bazı bilgiler geçersiz. Lütfen formu kontrol edin.", "Some details are invalid. Please check the form."),
        [ErrorCodes.EmailInvalid] = ("Lütfen geçerli bir e-posta adresi girin.", "Please enter a valid email address."),
        [ErrorCodes.PasswordInvalid] = ("Şifre en az 8, en fazla 128 karakter olmalı.", "Your password must be 8 to 128 characters."),
        [ErrorCodes.NameInvalid] = ("Lütfen ad ve soyadınızı girin (en fazla 100 karakter).", "Please enter your first and last name (up to 100 characters)."),
        [ErrorCodes.AttendanceInvalid] = ("Lütfen katılım durumunuzu seçin.", "Please choose whether you're attending."),
        [ErrorCodes.GuestCountInvalid] = ("Kişi sayısı 1 ile 20 arasında olmalı.", "The number of guests must be between 1 and 20."),
        [ErrorCodes.MessageTooLong] = ("Metin çok uzun. Lütfen kısaltıp tekrar deneyin.", "The text is too long. Please shorten it and try again."),
        [ErrorCodes.ScheduleTooLong] = ("Programa en fazla 12 satır eklenebilir.", "The schedule can have at most 12 entries."),
        [ErrorCodes.ScheduleItemInvalid] = ("Program satırlarını kontrol edin: saat SS:DD biçiminde olmalı ve başlık boş olmamalı.", "Check the schedule: times must be HH:MM and every entry needs a title."),
        [ErrorCodes.RsvpDeadlineAfterWedding] = ("Katılım bildirimi son tarihi düğün tarihinden sonra olamaz.", "The RSVP deadline can't be after the wedding date."),
        [ErrorCodes.RateLimited] = ("Çok fazla deneme yaptınız. Lütfen bir dakika sonra tekrar deneyin.", "Too many attempts. Please wait a minute and try again."),
        [ErrorCodes.InternalError] = ("Bir sorun oluştu. Lütfen tekrar deneyin.", "Something went wrong. Please try again."),
    };

    public static bool PrefersEnglish(HttpContext context) =>
        context.Request.Headers.AcceptLanguage.ToString().TrimStart()
            .StartsWith("en", StringComparison.OrdinalIgnoreCase);

    public static string Message(string code, HttpContext context)
    {
        var (tr, en) = Messages.TryGetValue(code, out var pair) ? pair : Messages[ErrorCodes.InternalError];
        return PrefersEnglish(context) ? en : tr;
    }

    public static object Body(string code, HttpContext context) => new { code, message = Message(code, context) };

    /// `return this.Error(StatusCodes.Status404NotFound, ErrorCodes.InvitationNotFound);`
    public static ObjectResult Error(this ControllerBase controller, int status, string code) =>
        new(Body(code, controller.HttpContext)) { StatusCode = status };

    /// Replaces [ApiController]'s ProblemDetails for invalid input: the first
    /// invalid field picks a specific code, and `fields` lists them all.
    public static IActionResult InvalidModelState(ActionContext context)
    {
        var fields = context.ModelState
            .Where(entry => entry.Value is { ValidationState: ModelValidationState.Invalid })
            .Select(entry => entry.Key)
            .ToList();
        var code = fields.Select(CodeForField).FirstOrDefault(c => c != ErrorCodes.ValidationFailed)
            ?? ErrorCodes.ValidationFailed;
        return new BadRequestObjectResult(new { code, message = Message(code, context.HttpContext), fields });
    }

    private static string CodeForField(string key)
    {
        // Keys look like "Email", "Schedule[2].Time" or, for malformed JSON,
        // "$.guests".
        var name = key.StartsWith("$.", StringComparison.Ordinal) ? key[2..] : key;
        if (name.StartsWith("Schedule[", StringComparison.OrdinalIgnoreCase)) return ErrorCodes.ScheduleItemInvalid;
        return name.ToLowerInvariant() switch
        {
            "email" => ErrorCodes.EmailInvalid,
            "password" => ErrorCodes.PasswordInvalid,
            "firstname" or "lastname" => ErrorCodes.NameInvalid,
            "name" => ErrorCodes.GuestNameRequired,
            "attendance" => ErrorCodes.AttendanceInvalid,
            "guests" => ErrorCodes.GuestCountInvalid,
            "message" or "storytext" or "dresscode" or "giftnote" or "accommodationnote" => ErrorCodes.MessageTooLong,
            "schedule" => ErrorCodes.ScheduleTooLong,
            "rsvpdeadline" => ErrorCodes.RsvpDeadlineAfterWedding,
            "token" => ErrorCodes.ResetTokenInvalid,
            "note" => ErrorCodes.RejectionNoteInvalid,
            _ => ErrorCodes.ValidationFailed,
        };
    }
}
