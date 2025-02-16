using TaskFlow.Common.Guards;
using TaskFlow.Common.ValueObjects;

namespace TaskFlow.Domain.Entities.UserAggregate
{
    public class UserProfile : ValueObject
    {
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string FullName => $"{FirstName} {LastName}";
        public string? JobTitle { get; private set; }
        public string? Department { get; private set; }
        public string? Bio { get; private set; }
        public List<string> Skills { get; private set; } = new();

        private UserProfile() { }

        public static UserProfile Create(string firstName, string lastName)
        {
            Guard.AgainstNullOrEmpty(firstName, nameof(firstName));
            Guard.AgainstNullOrEmpty(lastName, nameof(lastName));

            return new UserProfile
            {
                FirstName = firstName,
                LastName = lastName
            };
        }

        public void Update(string firstName, string lastName, string? jobTitle = null, string? department = null)
        {
            FirstName = firstName;
            LastName = lastName;
            JobTitle = jobTitle;
            Department = department;
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return FirstName;
            yield return LastName;
            yield return JobTitle ?? string.Empty;
            yield return Department ?? string.Empty;
            yield return Bio ?? string.Empty;
            foreach (var skill in Skills)
            {
                yield return skill;
            }
        }
    }
}
