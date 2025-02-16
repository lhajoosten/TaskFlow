using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskFlow.Domain.Entities.UserAggregate;

namespace TaskFlow.Persistence.Configurations.EntityConfigurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");

            // Base entity properties
            builder.HasKey(x => x.Id);
            builder.Property(x => x.CreatedAt).IsRequired();
            builder.Property(x => x.CreatedBy).IsRequired();
            builder.Property(x => x.LastModifiedAt);
            builder.Property(x => x.LastModifiedBy);
            builder.Property(x => x.DeletedAt);
            builder.Property(x => x.IsDeleted).HasDefaultValue(false);

            // User specific properties
            builder.Property(x => x.IdentityId).IsRequired();

            // Email value object - map as owned entity
            builder.OwnsOne(x => x.EmailAddress, email =>
            {
                email.Property(e => e.Value)
                    .HasMaxLength(255)
                    .IsRequired();
            });

            // UserProfile value object
            builder.OwnsOne(x => x.Profile, profile =>
            {
                profile.Property(p => p.FirstName)
                    .HasMaxLength(50)
                    .IsRequired();

                profile.Property(p => p.LastName)
                    .HasMaxLength(50)
                    .IsRequired();

                profile.Property(profile => profile.FullName).HasComputedColumnSql("[FirstName] + ' ' + [LastName]");

                profile.Property(p => p.JobTitle)
                    .HasMaxLength(50);

                profile.Property(p => p.Department)
                    .HasMaxLength(50);

                profile.Property(p => p.Bio)
                    .HasMaxLength(500);

                profile.Property(p => p.Skills)
                    .HasMaxLength(500);
            });

            // UserPreferences value object
            builder.OwnsOne(x => x.Preferences, prefs =>
            {
                prefs.Property(p => p.Language)
                    .HasMaxLength(10);
                
                prefs.Property(p => p.TimeZone)
                    .HasMaxLength(50);
                
                prefs.Property(p => p.EmailNotifications)
                    .HasDefaultValue(true);
                
                prefs.Property(p => p.DesktopNotifications)
                    .HasDefaultValue(true);

                prefs.Property(p => p.DarkMode)
                    .HasDefaultValue(false);
            });

            // NotificationSettings collection
            builder.OwnsMany(x => x.NotificationSettings, settings =>
            {
                settings.ToTable("UserNotificationSettings");
                settings.WithOwner().HasForeignKey("UserId");
                settings.Property<string>("Id").ValueGeneratedOnAdd();
                settings.HasKey("Id");

                settings.Property(s => s.Type)
                    .HasMaxLength(50)
                    .IsRequired();

                settings.Property(s => s.Description)
                    .HasMaxLength(255);

                settings.Property(s => s.EmailNotification)
                    .HasDefaultValue(true);

                settings.Property(s => s.Push)
                    .HasDefaultValue(true);

                settings.Property(s => s.InApp)
                    .HasDefaultValue(true);
            });

            // Indexes
            builder.HasIndex(x => x.IdentityId).IsUnique();
            builder.HasIndex("EmailAddress").IsUnique();
        }
    }
}