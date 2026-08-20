namespace ErpBackend.Models;

public class SalesInvoice
{
    public int Id { get; set; }
    public string InvoiceId { get; set; } = string.Empty; // e.g., INV-2081
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Pending";
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public List<SalesInvoiceItem> Items { get; set; } = new();
    public List<SalesInvoiceActivity> Activity { get; set; } = new();
}

public class SalesInvoiceItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public decimal Qty { get; set; }
    public decimal Rate { get; set; }
    // Additional fields like Discount can be added
}

public class SalesInvoiceActivity
{
    public int Id { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string User { get; set; } = "Admin";
    public string Title { get; set; } = string.Empty;
    public string Detail { get; set; } = string.Empty;
}
