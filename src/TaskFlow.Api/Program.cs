using Microsoft.OpenApi.Models;
using TaskFlow.Application.Common.Configurations;
using TaskFlow.Identity.Configurations;
using TaskFlow.Infrastructure.Configurations;

namespace TaskFlow.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var configuration = builder.Configuration;
            var services = builder.Services;

            // Register Infrastructure & Identity Modules
            services.AddInfrastructure(configuration);
            services.AddIdentityServices(configuration);

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

            var app = builder.Build();

            // Use the CORS policy
            app.UseCors(options =>
            {
                options.WithOrigins("http://localhost:4200");
                options.AllowAnyOrigin();
                options.AllowAnyMethod();
                options.AllowAnyHeader();
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
