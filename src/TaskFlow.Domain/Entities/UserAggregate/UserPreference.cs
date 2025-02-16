﻿using TaskFlow.Common.ValueObjects;

namespace TaskFlow.Domain.Entities.UserAggregate
{
    public class UserPreferences : ValueObject
    {
        public string Language { get; private set; }
        public string TimeZone { get; private set; }
        public bool EmailNotifications { get; private set; }
        public bool DesktopNotifications { get; private set; }
        public bool DarkMode { get; private set; }

        private UserPreferences() { }

        public static UserPreferences CreateDefault()
        {
            return new UserPreferences
            {
                Language = "en",
                TimeZone = "UTC",
                EmailNotifications = true,
                DesktopNotifications = true,
                DarkMode = false
            };
        }

        protected override IEnumerable<object> GetEqualityComponents()
        {
            yield return Language;
            yield return TimeZone;
            yield return EmailNotifications;
            yield return DesktopNotifications;
            yield return DarkMode;
        }
    }
}
