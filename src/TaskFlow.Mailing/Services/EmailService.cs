using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using TaskFlow.Mailing.Configurations;
using TaskFlow.Mailing.Interfaces;
using TaskFlow.Mailing.Models;

namespace TaskFlow.Mailing.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value ?? throw new ArgumentNullException(nameof(emailSettings));
        }

        public async Task<bool> SendEmailAsync(EmailDto emailDto)
        {
            try
            {
                var email = CreateMimeMessage(emailDto.To, emailDto.Subject, emailDto.Body);
                return await SendEmailInternalAsync(email);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error Sending Email: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> SendConfirmationEmailAsync(string email, string token)
        {
            var confirmationLink = $"https://localhost:4443/auth/confirm-email?email={email}&token={Uri.EscapeDataString(token)}";
            var emailDto = new EmailDto
            {
                To = email,
                Subject = "Confirm Your Email - TaskFlow",
                Body = $@"
            <div style='font-family: Arial, sans-serif; color: #333;'>
                <h2 style='color: #65071e;'>Welcome to TaskFlow!</h2>
                <p>Thank you for registering with TaskFlow. We're excited to have you on board!</p>
                <p>Please confirm your email address by clicking the link below:</p>
                <p>
                    <a href='{confirmationLink}' style='display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #65071e; text-decoration: none; border-radius: 5px;'>Confirm Email</a>
                </p>
                <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                <p style='color: #65071e;'>{confirmationLink}</p>
                <p>If you did not create an account, please ignore this email or contact our support team.</p>
                <p>Best regards,<br/>The TaskFlow Team</p>
                <hr style='border: none; border-top: 1px solid #ddd;'/>
                <p style='font-size: 12px; color: #999;'>You are receiving this email because you recently created a new TaskFlow account. If this wasn't you, please disregard this email.</p>
            </div>"
            };
            return await SendEmailAsync(emailDto);
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string token)
        {
            var resetLink = $"https://localhost:4443/auth/reset-password?email={email}&token={Uri.EscapeDataString(token)}";
            var emailDto = new EmailDto
            {
                To = email,
                Subject = "Reset Your Password - TaskFlow",
                Body = $@"
            <div style='font-family: Arial, sans-serif; color: #333;'>
                <h2 style='color: #65071e;'>Reset Your Password</h2>
                <p>We received a request to reset your password. Please click the link below to reset your password:</p>
                <p>
                    <a href='{resetLink}' style='display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #65071e; text-decoration: none; border-radius: 5px;'>Reset Password</a>
                </p>
                <p>If the button above doesn't work, copy and paste the following link into your browser:</p>
                <p style='color: #65071e;'>{resetLink}</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,<br/>The TaskFlow Team</p>
                <hr style='border: none; border-top: 1px solid #ddd;'/>
                <p style='font-size: 12px; color: #999;'>You are receiving this email because a password reset request was made for your TaskFlow account. If this wasn't you, please disregard this email.</p>
            </div>"
            };
            return await SendEmailAsync(emailDto);
        }

        private MimeMessage CreateMimeMessage(string to, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
            email.To.Add(new MailboxAddress("", to));
            email.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            email.Body = bodyBuilder.ToMessageBody();

            return email;
        }

        private async Task<bool> SendEmailInternalAsync(MimeMessage email)
        {
            try
            {
                using var smtp = new MailKit.Net.Smtp.SmtpClient();

                // ✅ Improved connection security logic
                if (_emailSettings.UseStartTls)
                {
                    await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
                }
                else if (_emailSettings.UseSSL)
                {
                    await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.SslOnConnect);
                }
                else
                {
                    await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.Auto);
                }

                await smtp.AuthenticateAsync(_emailSettings.Username, _emailSettings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                Console.WriteLine("✅ Email sent successfully!");
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
