using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Socialgram.Data;
using Socialgram.DTOs;
using Socialgram.Entities;
using Socialgram.Services;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Socialgram.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AuthService userService,
        SocialgramDbContext context) : ControllerBase
    {
        private readonly AuthService _authService = userService;
        private readonly SocialgramDbContext _context = context;

        [HttpPost("register")]
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

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginDto dto)
        {
            var token = await _authService.LoginAsync(dto.UserName, dto.Password);
            if (token == null)
                return Unauthorized();

            return Ok(token);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshAsync([FromBody] RefreshTokenDto dto)
        {
            var result = await _authService.RefreshAsync(dto.RefreshToken);


            if (result == null)
                return Unauthorized();

            return Ok(result);
        }
    }
}
