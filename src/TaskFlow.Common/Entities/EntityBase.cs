namespace TaskFlow.Common.Entities
{
    public abstract class EntityBase
    {
        public string Id { get; protected set; }
        public DateTime CreatedAt { get; protected set; }
        public string CreatedBy { get; protected set; } = string.Empty;
        public DateTime? LastModifiedAt { get; protected set; }
        public string? LastModifiedBy { get; protected set; }
        public DateTime? DeletedAt { get; protected set; }
        public bool IsDeleted { get; protected set; }

        protected EntityBase()
        {
            Id = Guid.NewGuid().ToString();
            CreatedAt = DateTime.UtcNow;
        }

        public void SetCreated(string createdBy)
        {
            CreatedBy = createdBy;
            CreatedAt = DateTime.UtcNow;
        }

        public void SetModified(string modifiedBy)
        {
            LastModifiedBy = modifiedBy;
            LastModifiedAt = DateTime.UtcNow;
        }

        public void SetDeleted(string deletedBy)
        {
            LastModifiedBy = deletedBy;
            LastModifiedAt = DateTime.UtcNow;
            DeletedAt = DateTime.UtcNow;
            IsDeleted = true;
        }
    }
}
