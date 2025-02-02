using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskFlow.Identity.DTOs;
using TaskFlow.Identity.Interfaces;
using TaskFlow.Identity.Models;

namespace TaskFlow.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IIdentityService _identityService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(IIdentityService identityService, UserManager<ApplicationUser> userManager)
        {
            _identityService = identityService;
            _userManager = userManager;
        }

        /// <summary>
        /// 🔑 User Registration
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var response = await _identityService.RegisterUserAsync(request.FirstName, request.LastName, request.Email, request.Password);

            if (!string.IsNullOrEmpty(response.ErrorMessage))
                return BadRequest(new { message = response.ErrorMessage });

            return Ok(new
            {
                message = "Registration successful.",
                token = response.Token,
                refreshToken = response.RefreshToken
            });
        }

        /// <summary>
        /// ✉ Confirm Email
        /// </summary>
        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string email, [FromQuery] string token)
        {
            var response = await _identityService.ConfirmEmailAsync(email, token);
            if (!string.IsNullOrEmpty(response.ErrorMessage))
            {
                if (response.ErrorMessage == "Email is already confirmed.")
                    return BadRequest(new { message = response.ErrorMessage });

                return BadRequest(new { message = response.ErrorMessage });
            }

            return Ok(new { message = "Email confirmed successfully. You can now log in." });
        }

        /// <summary>
        /// 🔐 User Login (JWT)
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _identityService.LoginUserAsync(request.Email, request.Password);

            if (!string.IsNullOrEmpty(response.ErrorMessage))
                return Unauthorized(new { message = response.ErrorMessage });

            return Ok(response);
        }

        /// <summary>
        /// 🔄 Refresh Token
        /// </summary>
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var response = await _identityService.RefreshTokenAsync(request.RefreshToken);
            if (!string.IsNullOrEmpty(response.ErrorMessage))
                return Unauthorized(new { message = response.ErrorMessage });

            return Ok(response);
        }

        /// <summary>
        /// 🚪 Logout (Invalidate Token)
        /// </summary>
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "User not authenticated." });

            var response = await _identityService.LogoutUserAsync(userId);
            if (!string.IsNullOrEmpty(response.ErrorMessage))
                return BadRequest(new { message = response.ErrorMessage });

            return Ok(new { message = "Logged out successfully." });
        }

        /// <summary>
        /// 🔄 Request Password Reset Token
        /// </summary>
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var response = await _identityService.GeneratePasswordResetTokenAsync(request.Email);
            if (!string.IsNullOrEmpty(response.ErrorMessage))
                return BadRequest(new { message = response.ErrorMessage });

            return Ok(new { message = "Password reset email sent." });
        }

        /// <summary>
        /// 🔄 Reset Password
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var response = await _identityService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
            if (!string.IsNullOrEmpty(response.ErrorMessage))
                return BadRequest(new { message = response.ErrorMessage });

            return Ok(new { message = "Password reset successfully. You can now log in." });
        }
    }
}
