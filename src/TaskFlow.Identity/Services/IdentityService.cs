using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskFlow.Identity.Configurations;
using TaskFlow.Identity.DTOs;
using TaskFlow.Identity.Interfaces;
using TaskFlow.Identity.Models;
using TaskFlow.Mailing.Interfaces;
using TaskFlow.Mailing.Models;

namespace TaskFlow.Identity.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly JwtSettings _jwtSettings;

        public IdentityService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailService emailService, IOptions<JwtSettings> jwtSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailService = emailService;
            _jwtSettings = jwtSettings.Value;
        }

        /// <summary>
        /// 🔑 User Registration
        /// </summary>
        public async Task<AuthResponse> RegisterUserAsync(string firstname, string lastname, string email, string password)
        {
            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser != null)
                return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = "User already exists." };

            var user = new ApplicationUser
            {
                Firstname = firstname,
                Lastname = lastname,
                Email = email,
                UserName = email,
                EmailConfirmed = false,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = "Registration failed: " + string.Join(", ", result.Errors.Select(e => e.Description)) };

            // ✅ Generate Email Confirmation Token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            // ✅ Send Confirmation Email
            await _emailService.SendConfirmationEmailAsync(email, token);

            return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = null! };
        }

        /// <summary>
        /// 🔐 User Login (JWT)
        /// </summary>
        public async Task<AuthResponse> LoginUserAsync(string email, string password, bool rememberMe)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = "User not found." };

            // ✅ Ensure email is confirmed before login
            if (!user.EmailConfirmed)
                return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = "Please confirm your email before logging in." };

            // ✅ Attempt login using SignInManager
            var result = await _signInManager.PasswordSignInAsync(user, password, isPersistent: false, lockoutOnFailure: true);

            // ✅ Handle different failure cases
            if (result.IsLockedOut)
                return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = "Account is locked due to multiple failed login attempts. Try again later." };

            if (result.IsNotAllowed)
                return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = "Login not allowed. Please check your email verification." };

            if (!result.Succeeded)
                return new AuthResponse { Token = "", RefreshToken = "", ErrorMessage = "Invalid credentials." };

            // Set different expiration times based on rememberMe
            var tokenExpirationMinutes = rememberMe ?
                _jwtSettings.ExtendedExpirationInMinutes :
                _jwtSettings.StandardExpirationInMinutes;

            var refreshTokenExpiryDays = rememberMe ? 30 : 7;

            // ✅ Generate JWT & Refresh Token after successful login
            var token = GenerateJwtToken(user, tokenExpirationMinutes);
            var refreshToken = GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = refreshTokenExpiry;
            await _userManager.UpdateAsync(user);

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                TokenExpiration = DateTime.UtcNow.AddMinutes(tokenExpirationMinutes),
                RefreshTokenExpiration = refreshTokenExpiry,
                Success = true
            };
        }

        /// <summary>
        /// 🚪 Logout (Invalidate Token)
        /// </summary>
        public async Task<AuthResponse> LogoutUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return new AuthResponse { ErrorMessage = "User not found in database." };
            }

            // ✅ Check if the user is already logged out
            if (string.IsNullOrEmpty(user.RefreshToken))
            {
                return new AuthResponse { ErrorMessage = "User is already logged out." };
            }

            // ❌ Invalidate refresh token & sign user out
            user.RefreshToken = null!;
            user.RefreshTokenExpiryTime = DateTime.UtcNow;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return new AuthResponse { ErrorMessage = "Failed to update user logout state." };
            }

            // ✅ Use SignInManager to log user out from Identity
            await _signInManager.SignOutAsync();

            return new AuthResponse { ErrorMessage = null! };
        }


        /// <summary>
        /// 🔄 Password Reset Token Generation
        /// </summary>
        public async Task<AuthResponse> GeneratePasswordResetTokenAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return new AuthResponse { ErrorMessage = "User not found." };

            // ✅ Ensure email is confirmed before allowing password reset
            if (!user.EmailConfirmed) return new AuthResponse { ErrorMessage = "Email is not confirmed." };

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _emailService.SendPasswordResetEmailAsync(email, token);

            return new AuthResponse { ErrorMessage = null! };
        }

        /// <summary>
        /// 🔄 Reset Password
        /// </summary>
        public async Task<AuthResponse> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return new AuthResponse { ErrorMessage = "User not found." };

            // ✅ Ensure email is confirmed before allowing password reset
            if (!user.EmailConfirmed) return new AuthResponse { ErrorMessage = "Email is not confirmed." };

            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            if (!result.Succeeded) return new AuthResponse { ErrorMessage = "Password reset failed." };

            // ✅ Optional: Sign the user out after password reset
            await _signInManager.SignOutAsync();

            return new AuthResponse { ErrorMessage = null! };
        }

        /// <summary>
        /// ✉ Email Confirmation
        /// </summary>
        public async Task<AuthResponse> ConfirmEmailAsync(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return new AuthResponse { ErrorMessage = "User not found." };

            // If email is already confirmed, return a specific message
            if (user.EmailConfirmed)
                return new AuthResponse { ErrorMessage = "Email is already confirmed." };

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
                return new AuthResponse { ErrorMessage = "Invalid confirmation token." };

            // Optional: Auto-sign in the user after confirmation
            await _signInManager.SignInAsync(user, isPersistent: false);

            return new AuthResponse { ErrorMessage = null! };
        }

        /// <summary>
        /// 🔄 Refresh Token System
        /// </summary>
        public async Task<AuthResponse> RefreshTokenAsync(string token, bool rememberMe)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == token);
            if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                // ✅ Invalidate session if refresh token is invalid/expired
                await _signInManager.SignOutAsync();
                return new AuthResponse { ErrorMessage = "Invalid or expired refresh token." };
            }

            // Set different expiration times based on rememberMe
            var tokenExpirationMinutes = rememberMe ?
                _jwtSettings.ExtendedExpirationInMinutes :
                _jwtSettings.StandardExpirationInMinutes;

            var refreshTokenExpiryDays = rememberMe ? 30 : 7;

            // ✅ Generate a new JWT token
            var newToken = GenerateJwtToken(user, tokenExpirationMinutes);

            // ✅ Generate a new refresh token & store it in DB
            var newRefreshToken = GenerateRefreshToken();
            var refreshTokenExpiry = DateTime.UtcNow.AddDays(refreshTokenExpiryDays);

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = refreshTokenExpiry;
            await _userManager.UpdateAsync(user);

            return new AuthResponse
            {
                Token = newToken,
                RefreshToken = newRefreshToken
            };
        }

        /// <summary>
        /// 🔑 Generate JWT Token
        /// </summary>
        private string GenerateJwtToken(ApplicationUser user, int expirationMinutes)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);
            var issuedAt = DateTime.Now;
            var notBefore = issuedAt;
            var expiresAt = issuedAt.AddMinutes(expirationMinutes);

            Console.WriteLine($"🔐 JWT Signing Key Used (Token Generation): {_jwtSettings.Secret}");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email!),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                    new Claim(JwtRegisteredClaimNames.UniqueName, $"{user.Firstname} {user.Lastname}")
                ]),
                NotBefore = notBefore,
                Expires = expiresAt,
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// 🔄 Generate Refresh Token
        /// </summary>
        private static string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            System.Security.Cryptography.RandomNumberGenerator.Fill(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
