namespace TaskFlow.Common.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string to, string subject, string body);
        Task<bool> SendConfirmationEmailAsync(string email, string token);
        Task<bool> SendPasswordResetEmailAsync(string email, string token);
    }
}
