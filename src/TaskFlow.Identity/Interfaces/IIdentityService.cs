using TaskFlow.Identity.DTOs;

namespace TaskFlow.Identity.Interfaces
{
    public interface IIdentityService
    {
        /// <summary>
        /// 🔑 Registers a new user.
        /// </summary>
        Task<AuthResponse> RegisterUserAsync(string firstname, string lastname, string email, string password);

        /// <summary>
        /// 🔐 Logs in a user and returns a JWT access token and refresh token.
        /// </summary>
        Task<AuthResponse> LoginUserAsync(string email, string password);

        /// <summary>
        /// 🚪 Logs out a user by invalidating their refresh token.
        /// </summary>
        Task<AuthResponse> LogoutUserAsync(string userId);

        /// <summary>
        /// ✉ Confirms a user's email.
        /// </summary>
        Task<AuthResponse> ConfirmEmailAsync(string email, string token);

        /// <summary>
        /// 🔄 Generates a password reset token for the user.
        /// </summary>
        Task<AuthResponse> GeneratePasswordResetTokenAsync(string email);

        /// <summary>
        /// 🔄 Resets the user's password using the reset token.
        /// </summary>
        Task<AuthResponse> ResetPasswordAsync(string email, string token, string newPassword);

        /// <summary>
        /// 🔄 Generates a new JWT access token using a refresh token.
        /// </summary>
        Task<AuthResponse> RefreshTokenAsync(string token);
    }
}
