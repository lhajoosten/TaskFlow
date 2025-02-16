using TaskFlow.Common.Events;

namespace TaskFlow.Domain.Events
{
    public class UserCreatedEvent : DomainEventBase
    {
        public string UserId { get; }
        public string Email { get; }

        public UserCreatedEvent(string userId, string email)
        {
            UserId = userId;
            Email = email;
        }
    }

    public class UserProfileUpdatedEvent : DomainEventBase
    {
        public string UserId { get; }
        public string Email { get; }

        public UserProfileUpdatedEvent(string userId, string email)
        {
            UserId = userId;
            Email = email;
        }
    }

    public class UserPreferencesUpdatedEvent : DomainEventBase
    {
        public string UserId { get; }

        public UserPreferencesUpdatedEvent(string userId)
        {
            UserId = userId;
        }
    }
}
