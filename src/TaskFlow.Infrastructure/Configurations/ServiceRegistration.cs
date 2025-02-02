using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskFlow.Infrastructure.Persistence;

namespace TaskFlow.Infrastructure.Configurations
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DevelopmentConnection");

            // Register the main application database context (default "dbo" schema)
            services.AddDbContext<TaskFlowDbContext>(options =>
                options.UseSqlServer(connectionString, sqlOptions =>
                {
                    // Store migrations in the default schema
                    sqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "dbo");
                }));

            return services;
        }
    }
}
