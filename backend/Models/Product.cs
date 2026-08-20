namespace ErpBackend.Models;

public class Product
{
    public int Id { get; set; }
    public string ProductId { get; set; } = string.Empty; // e.g., PRD-001
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal AvailableStock { get; set; }
    public decimal MinReorderLevel { get; set; }
    public decimal AvgRate { get; set; }
    public decimal StockValue { get; set; }
    public string Status { get; set; } = "Active";
    // Additional fields as needed
}
