namespace ErpBackend.Models;

public class PurchaseOrder
{
    public int Id { get; set; }
    public string PoId { get; set; } = string.Empty; // e.g., PO-1041
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string? GrnId { get; set; }
    public string SupplierName { get; set; } = string.Empty;
    public List<PurchaseOrderItem> Items { get; set; } = new();
    public List<PurchaseOrderActivity> Activity { get; set; } = new();
}

public class PurchaseOrderItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public decimal Qty { get; set; }
    public decimal ReceivedQty { get; set; }
    // Additional fields like Rate, Discount etc. can be added
}

public class PurchaseOrderActivity
{
    public int Id { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string User { get; set; } = "Admin";
    public string Title { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
}
