using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskFlow.Identity.Interfaces;
using TaskFlow.Identity.Models;
using TaskFlow.Identity.Services;

namespace TaskFlow.Identity.Configurations
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DevelopmentConnection");

            // Register the Identity database context (using "identity" schema)
            services.AddDbContext<IdentityDbContext>(options =>
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    // Store migrations in "identity" schema
                    sqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "TaskFlowIdentity");
                }));

            // Register JWT Settings
            services.Configure<JwtSettings>(configuration.GetSection("Jwt"));

            var jwtSettings = configuration.GetSection("Jwt").Get<JwtSettings>();
            var key = Encoding.UTF8.GetBytes(jwtSettings!.Secret);

            // Register JWT Authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = jwtSettings.Issuer,
                    ValidAudience = jwtSettings.Audience,
                    ClockSkew = TimeSpan.Zero
                };
            }).AddCookie(IdentityConstants.ApplicationScheme, options =>
            {
                options.Cookie.Name = "TaskFlow.Identity.Cookie";
                options.LoginPath = "/api/auth/login";
                options.AccessDeniedPath = "/api/auth/access-denied";
            });

            // Register IdentityCore Service
            services.AddIdentityCore<ApplicationUser>(options =>
            {
                // Customize Password Policy
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;

                // Configure Lockout Policy
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 5;

                // Email & Username Policies
                options.User.RequireUniqueEmail = true;
            })
                .AddSignInManager<SignInManager<ApplicationUser>>()
                .AddUserManager<UserManager<ApplicationUser>>()
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders();

            // Register Authorization
            services.AddAuthorization();

            // Register Identity Module Service
            services.AddScoped<IIdentityService, IdentityService>();

            return services;
        }
    }
}
