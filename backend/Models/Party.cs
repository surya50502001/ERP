namespace ErpBackend.Models;

public class Party
{
    public int Id { get; set; }
    public string PartyId { get; set; } = string.Empty; // e.g., PTY-101
    public string Name { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public string? ContactNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
}
