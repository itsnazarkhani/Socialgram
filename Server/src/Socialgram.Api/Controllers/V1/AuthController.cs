using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Socialgram.Infrastructure.Data;
using Socialgram.Application.DTOs;
using Socialgram.Domain.Entities;
using Socialgram.Infrastructure.Services;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Asp.Versioning;

namespace Socialgram.Api.Controllers.V1
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AuthController(AuthService userService,
        SocialgramDbContext context) : ControllerBase
    {
        private readonly AuthService _authService = userService;
        private readonly SocialgramDbContext _context = context;

        /// <summary>
        /// Registers a new user
        /// </summary>
        /// <param name="dto">Registration details including username and password</param>
        /// <returns>The created user's ID and username</returns>
        /// <response code="200">User registered successfully</response>
        /// <response code="400">Invalid username format or username already exists</response>
        [HttpPost("register")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto dto)
        {
            string validUserNamePattern = @"^[a-zA-Z_][a-zA-Z0-9_]{1,18}[a-zA-Z0-9]$|^[a-zA-Z_]{3,20}$";
            Regex regex = new Regex(validUserNamePattern);

            if (!regex.IsMatch(dto.UserName))
                return BadRequest("نام کاربری نامعتبر است. نام کاربری باید شامل 3 تا 20 کاراکتر باشد، فقط شامل حروف انگلیسی، اعداد و زیرخط باشد و با عدد شروع نشود.");
            bool userNameAlreadyExists = await _context.Users.AnyAsync(u => u.UserName == dto.UserName);
            if (userNameAlreadyExists) return BadRequest("نام‌کاربری قبلا وجود دارد. لطفا نام‌کاربری دیگری انتخاب نمایید.");
            var user = await _authService.RegisterAsync(dto.UserName, dto.Password);
            return Ok(new { user.Id, user.UserName });
        }

        /// <summary>
        /// Logs in an existing user
        /// </summary>
        /// <param name="dto">Login credentials</param>
        /// <returns>Access token, refresh token, and expiry</returns>
        /// <response code="200">Login successful, returns tokens</response>
        /// <response code="401">Invalid username or password</response>
        [HttpPost("login")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto.UserName, dto.Password);
            if (token == null)
                return Unauthorized();

            return Ok(token);
        }

        /// <summary>
        /// Refreshes an expired access token
        /// </summary>
        /// <param name="dto">The refresh token</param>
        /// <returns>New access token and refresh token</returns>
        /// <response code="200">Token refreshed successfully</response>
        /// <response code="401">Refresh token is invalid or expired</response>
        [HttpPost("refresh")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshAsync([FromBody] RefreshTokenDto dto)
        {
            var result = await _authService.RefreshAsync(dto.RefreshToken);


            if (result == null)
                return Unauthorized();

            return Ok(result);
        }
    }
}
