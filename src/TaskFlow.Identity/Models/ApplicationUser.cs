using Microsoft.AspNetCore.Identity;

namespace TaskFlow.Identity.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Firstname { get; set; } = string.Empty;
        public string Lastname { get; set; } = string.Empty;
        public string Fullname => $"{Firstname} {Lastname}";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string? ProfilePictureUrl { get; set; } = string.Empty;
        public string? RefreshToken { get; set; } = null;
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
