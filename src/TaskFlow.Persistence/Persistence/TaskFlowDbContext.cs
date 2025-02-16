using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Reflection;
using TaskFlow.Common.Entities;
using TaskFlow.Common.Services;
using TaskFlow.Domain.Entities.UserAggregate;

namespace TaskFlow.Persistence.Persistence
{
    public class TaskFlowDbContext : DbContext
    {
        private readonly ICurrentUserService? _currentUserService;

        public TaskFlowDbContext(DbContextOptions<TaskFlowDbContext> options, ICurrentUserService currentUserService)
            : base(options)
        {
            _currentUserService = currentUserService;
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Apply all configurations from current assembly
            builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // Apply global query filters for soft delete
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                if (typeof(EntityBase).IsAssignableFrom(entityType.ClrType))
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "e");
                    var property = Expression.Property(parameter, nameof(EntityBase.IsDeleted));
                    var falseConstant = Expression.Constant(false);
                    var lambda = Expression.Lambda(Expression.Equal(property, falseConstant), parameter);

                    builder.Entity(entityType.ClrType).HasQueryFilter(lambda);
                }
            }
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<EntityBase>())
            {
                var currentUser = _currentUserService?.Name ?? "System";

                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.SetCreated(currentUser);
                        break;

                    case EntityState.Modified:
                        entry.Entity.SetModified(currentUser);
                        break;

                    case EntityState.Deleted:
                        entry.State = EntityState.Modified;
                        entry.Entity.SetDeleted(currentUser);
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
