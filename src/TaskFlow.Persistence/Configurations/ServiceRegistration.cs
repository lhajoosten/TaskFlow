using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TaskFlow.Persistence.Persistence;

namespace TaskFlow.Persistence.Configurations
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
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
