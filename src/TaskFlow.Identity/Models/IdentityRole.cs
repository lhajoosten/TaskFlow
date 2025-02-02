using Microsoft.AspNetCore.Identity;

namespace TaskFlow.Identity.Models
{
    public class ApplicationRole : IdentityRole
    {
        public string Description { get; set; } = string.Empty;
    }
}
