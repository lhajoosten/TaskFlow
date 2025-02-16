using TaskFlow.Common.Entities;
using TaskFlow.Domain.Events;

namespace TaskFlow.Domain.Entities.UserAggregate
{
    public class User : AggregateRoot
    {
        private readonly List<NotificationSetting> _notificationSettings = new();

        public Guid IdentityId { get; private set; }
        public EmailAddress EmailAddress { get; private set; }
        public UserProfile Profile { get; private set; }
        public UserPreferences Preferences { get; private set; }
        public IReadOnlyCollection<NotificationSetting> NotificationSettings => _notificationSettings.AsReadOnly();

        private User() { } // For EF Core

        public static User Create(Guid identityId, string email, string firstName, string lastName)
        {
            var user = new User
            {
                IdentityId = identityId,
                EmailAddress = new EmailAddress(email),
                Profile = UserProfile.Create(firstName, lastName),
                Preferences = UserPreferences.CreateDefault()
            };

            user.AddDomainEvent(new UserCreatedEvent(user.Id, email));
            return user;
        }

        public void UpdateProfile(string firstName, string lastName, string? jobTitle = null, string? department = null)
        {
            Profile.Update(firstName, lastName, jobTitle, department);
            AddDomainEvent(new UserProfileUpdatedEvent(Id, EmailAddress.Value));
        }

        public void UpdatePreferences(UserPreferences preferences)
        {
            Preferences = preferences;
            AddDomainEvent(new UserPreferencesUpdatedEvent(Id));
        }

        public void AddNotificationSetting(string type, string description)
        {
            var setting = new NotificationSetting(type, description);
            _notificationSettings.Add(setting);
        }
    }
}
