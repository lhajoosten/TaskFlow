using TaskFlow.Common.Guards;
using TaskFlow.Common.ValueObjects;

namespace TaskFlow.Domain.Entities.UserAggregate
{
    public class Email : ValueObject
    {
        public string Value { get; }

        public Email(string value)
        {
            Guard.AgainstNullOrEmpty(value, nameof(value));
            Guard.Against(!IsValidEmail(value), "Invalid email format");
            Value = value.ToLowerInvariant();
        }

        private static bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Value;
        }
    }
}
