namespace ErpBackend.Models;

public class Product
{
    public int Id { get; set; }
    public string ProductId { get; set; } = string.Empty; // e.g., PRD-001 / ITM000001
    public string Name { get; set; } = string.Empty;
    public string ItemType { get; set; } = "Raw Material";
    public string Brand { get; set; } = "Generic";
    public string Uom { get; set; } = "KG";
    public string MajorGroup { get; set; } = string.Empty;
    public string SubGroup { get; set; } = string.Empty;
    public string SubSubGroup { get; set; } = string.Empty;
    public decimal AvailableStock { get; set; }
    public decimal MinReorderLevel { get; set; }
    public decimal AvgRate { get; set; }
    public decimal PurchaseRate { get; set; }
    public decimal SellingPrice { get; set; }
    public decimal StockValue { get; set; }
    public string HsnCode { get; set; } = string.Empty;
    public decimal GstRate { get; set; }
    public string Status { get; set; } = "Active";
    public string Description { get; set; } = string.Empty;
}
