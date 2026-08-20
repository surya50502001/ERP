namespace ErpBackend.Models;

public class RecentActivity
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty; // e.g., GRN-1234
    public string Party { get; set; } = string.Empty; // Supplier or Customer
    public string Detail { get; set; } = string.Empty;
    public DateTime Time { get; set; } = DateTime.UtcNow;
    public string Type { get; set; } = string.Empty; // e.g., "grn", "sales"
    public string Status { get; set; } = "Success";
}
