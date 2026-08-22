using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpBackend.Data;
using ErpBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace ErpBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ErpDbContext _db;

    public AuthController(ErpDbContext db) => _db = db;

    public record RegisterRequest(string FullName, string Email, string Password, string? Role, string? CompanyName);
    public record LoginRequest(string Email, string Password);
    public record AuthResponse(int Id, string FullName, string Email, string Role, string CompanyName, string Token);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required." });

        var normalizedEmail = req.Email.Trim().ToLowerInvariant();
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
        if (existing != null)
            return BadRequest(new { message = "User with this email already exists." });

        var user = new User
        {
            FullName = req.FullName?.Trim() ?? "ERP User",
            CompanyName = req.CompanyName?.Trim() ?? "My Enterprise",
            Email = normalizedEmail,
            PasswordHash = HashPassword(req.Password),
            Role = string.IsNullOrWhiteSpace(req.Role) ? "Store Manager" : req.Role,
            CreatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateSimpleToken(user.Id, user.Email);
        return Ok(new AuthResponse(user.Id, user.FullName, user.Email, user.Role, user.CompanyName, token));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required." });

        var normalizedEmail = req.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

        if (user == null || !VerifyPassword(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });

        var token = GenerateSimpleToken(user.Id, user.Email);
        return Ok(new AuthResponse(user.Id, user.FullName, user.Email, user.Role, user.CompanyName ?? "My Enterprise", token));
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMe([FromQuery] int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound(new { message = "User not found." });
        return Ok(new { user.Id, user.FullName, user.CompanyName, user.Email, user.Role, user.CreatedAt });
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + "PRIME_ERP_SALT_2026"));
        return Convert.ToBase64String(bytes);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        return HashPassword(password) == storedHash;
    }

    private static string GenerateSimpleToken(int userId, string email)
    {
        var raw = $"{userId}:{email}:{DateTime.UtcNow.Ticks}";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(raw));
    }
}
