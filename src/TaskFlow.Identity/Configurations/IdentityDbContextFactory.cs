using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TaskFlow.Identity.Configurations
{
    public class IdentityDbContextFactory : IDesignTimeDbContextFactory<IdentityDbContext>
    {
        public IdentityDbContext CreateDbContext(string[] args)
        {
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "../TaskFlow.Api");

            var configuration = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DevelopmentConnection");
            var optionsBuilder = new DbContextOptionsBuilder<IdentityDbContext>();
            
            optionsBuilder.UseSqlServer(connectionString);
            
            return new IdentityDbContext(optionsBuilder.Options);
        }
    }
}
