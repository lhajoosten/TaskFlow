using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using TaskFlow.Infrastructure.Persistence;

namespace TaskFlow.Infrastructure.Configurations
{
    public class TaskFlowDbContextFactory : IDesignTimeDbContextFactory<TaskFlowDbContext>
    {
        public TaskFlowDbContext CreateDbContext(string[] args)
        {
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../TaskFlow.Api");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DevelopmentConnection");
            var optionsBuilder = new DbContextOptionsBuilder<TaskFlowDbContext>();

            optionsBuilder.UseSqlServer(connectionString);

            return new TaskFlowDbContext(optionsBuilder.Options);
        }
    }
}
