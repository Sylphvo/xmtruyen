using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations;

public class EmailService : IEmailService
{
    public Task SendVerificationEmailAsync(string email, string token)
    {
        // In a real application, use SMTP (e.g. MailKit, SendGrid, etc.)
        Console.WriteLine("========================================");
        Console.WriteLine($"[MOCK EMAIL] Send to: {email}");
        Console.WriteLine($"[MOCK EMAIL] Subject: MÃ XÁC NHẬN ĐĂNG KÝ");
        Console.WriteLine($"[MOCK EMAIL] Token: {token}");
        Console.WriteLine("========================================");
        return Task.CompletedTask;
    }

    public Task SendPasswordResetEmailAsync(string email, string token)
    {
        Console.WriteLine("========================================");
        Console.WriteLine($"[MOCK EMAIL] Send to: {email}");
        Console.WriteLine($"[MOCK EMAIL] Subject: KHÔI PHỤC MẬT KHẨU");
        Console.WriteLine($"[MOCK EMAIL] Token: {token}");
        Console.WriteLine("========================================");
        return Task.CompletedTask;
    }
}
