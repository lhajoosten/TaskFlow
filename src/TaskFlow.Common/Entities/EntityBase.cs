namespace TaskFlow.Common.Entities
{
    public abstract class EntityBase
    {
        public string Id { get; protected set; }
        public DateTime CreatedAt { get; protected set; }
        public string CreatedBy { get; protected set; }
        public DateTime? LastModifiedAt { get; protected set; }
        public string? LastModifiedBy { get; protected set; }

        protected EntityBase()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
        }
    }
}
