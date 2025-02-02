using TaskFlow.Mailing.Models;

namespace TaskFlow.Mailing.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(EmailDto email);
        Task<bool> SendConfirmationEmailAsync(string email, string token);
        Task<bool> SendPasswordResetEmailAsync(string email, string token);
    }
}
