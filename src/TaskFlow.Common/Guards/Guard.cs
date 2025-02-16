using TaskFlow.Common.Errors;

namespace TaskFlow.Common.Guards
{
    public static class Guard
    {
        public static void Against(bool condition, string message)
        {
            if (condition)
            {
                throw new DomainException(message);
            }
        }

        public static void AgainstNull(object value, string name)
        {
            if (value == null)
            {
                throw new DomainException($"{name} cannot be null");
            }
        }

        public static void AgainstNullOrEmpty(string value, string name)
        {
            if (string.IsNullOrEmpty(value))
            {
                throw new DomainException($"{name} cannot be null or empty");
            }
        }
    }
}
