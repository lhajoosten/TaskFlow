using Microsoft.OpenApi.Models;
using TaskFlow.Application.Common.Configurations;
using TaskFlow.Identity.Configurations;
using TaskFlow.Persistence.Configurations;
using TaskFlow.Mailing.Configurations;
using Microsoft.AspNetCore.Http;

namespace TaskFlow.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;
            var services = builder.Services;

            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.ConfigureHttpsDefaults(configureOptions =>
                {
                    configureOptions.SslProtocols = System.Security.Authentication.SslProtocols.Tls12 | System.Security.Authentication.SslProtocols.Tls13;
                });
            });

            // Register Infrastructure
            services.AddPersistenceServices(configuration);
            services.AddIdentityServices(configuration);
            services.AddMailingServices(configuration);

            // Register IHttpContextAccessor
            services.AddHttpContextAccessor();

            // Register Application Services
            services.AddApplicationServices();

            // Add services to the container.
            services.AddControllers();

            // ✅ Register Swagger with JWT Support
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "TaskFlow API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Enter 'Bearer {your token}'",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });

                // ✅ Explicitly set Swagger base path
                c.AddServer(new OpenApiServer { Url = "https://localhost:7228" });
            });

            builder.Services.AddHttpsRedirection(options =>
            {
                options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
                options.HttpsPort = 7443; // or your preferred HTTPS port
            });

            var app = builder.Build();

            // Use the CORS policy
            app.UseCors(options =>
            {
                options.WithOrigins(["https://localhost:4443", "http://localhost:4200"]);
                options.AllowAnyMethod();
                options.AllowAnyHeader();
                options.AllowCredentials();
            });

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TaskFlow API v1");
                    c.RoutePrefix = "swagger";
                });
            }

            // Configure middleware pipeline
            if (!app.Environment.IsDevelopment())
            {
                app.UseHsts();
            }

            // Use Https Redirection to enforce HTTPS
            app.UseHttpsRedirection();

            // Use Authentication & Authorization
            app.UseAuthentication();
            app.UseAuthorization();

            // Map Api Controllers
            app.MapControllers();

            app.Run();
        }
    }
}
