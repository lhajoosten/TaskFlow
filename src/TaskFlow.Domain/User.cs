using Microsoft.AspNetCore.Identity;

namespace TaskFlow.Domain
{
    public class User : IdentityUser
    {
        public string FullName { get; set; }

    }
}
