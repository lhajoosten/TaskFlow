using TaskFlow.Common.Guards;
using TaskFlow.Common.ValueObjects;

namespace TaskFlow.Domain.Entities.UserAggregate
{
    public class NotificationSetting : ValueObject
    {
        public string Type { get; }
        public string Description { get; }
        public bool Email { get; private set; }
        public bool Push { get; private set; }
        public bool InApp { get; private set; }

        public NotificationSetting(string type, string description)
        {
            Guard.AgainstNullOrEmpty(type, nameof(type));
            Guard.AgainstNullOrEmpty(description, nameof(description));

            Type = type;
            Description = description;
            Email = true;
            Push = true;
            InApp = true;
        }

        public void UpdatePreferences(bool email, bool push, bool inApp)
        {
            Email = email;
            Push = push;
            InApp = inApp;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Type;
            yield return Description;
            yield return Email;
            yield return Push;
            yield return InApp;
        }
    }
}
