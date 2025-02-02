using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using TaskFlow.Mailing.Configurations;
using TaskFlow.Mailing.Interfaces;
using TaskFlow.Mailing.Models;

namespace TaskFlow.Mailing.Services
{
    public class EmailService(IOptions<EmailSettings> emailSettings) : IEmailService
    {
        private readonly EmailSettings _emailSettings = emailSettings.Value;

        public async Task<bool> SendEmailAsync(EmailDto emailDto)
        {
            try
            {
                var email = CreateMimeMessage(emailDto.To, emailDto.Subject, emailDto.Body);
                return await SendEmailAsync(email);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error Sending Email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendConfirmationEmailAsync(string email, string token)
        {
            var confirmationLink = $"https://localhost:4200/confirm-email?email={email}&token={Uri.EscapeDataString(token)}";
            var emailDto = new EmailDto
            {
                To = email,
                Subject = "Confirm Your Email - TaskFlow",
                Body = $"<h3>Welcome to TaskFlow!</h3><p>Click <a href='{confirmationLink}'>here</a> to confirm your email.</p>"
            };
            return await SendEmailAsync(emailDto);
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string token)
        {
            var resetLink = $"https://localhost:4200/reset-password?email={email}&token={Uri.EscapeDataString(token)}";
            var emailDto = new EmailDto
            {
                To = email,
                Subject = "Reset Your Password - TaskFlow",
                Body = $"<h3>Reset Your Password</h3><p>Click <a href='{resetLink}'>here</a> to reset your password.</p>"
            };
            return await SendEmailAsync(emailDto);
        }

        private MimeMessage CreateMimeMessage(string to, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
            email.To.Add(new MailboxAddress("", to));
            email.Subject = subject;
            email.Body = new TextPart("html") { Text = body };
            return email;
        }

        private async Task<bool> SendEmailAsync(MimeMessage email)
        {
            try
            {
                using var smtp = new MailKit.Net.Smtp.SmtpClient();
                await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ MailKit Error: {ex.Message}");
                return false;
            }
        }
    }
}
