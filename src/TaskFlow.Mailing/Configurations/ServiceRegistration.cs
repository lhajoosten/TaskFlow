using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskFlow.Mailing.Interfaces;
using TaskFlow.Mailing.Services;

namespace TaskFlow.Mailing.Configurations
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddMailingServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Register Email Settings
            services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));

            // ✅ Register Email Service
            services.AddTransient<IEmailService, EmailService>();

            return services;
        }
    }
}
