namespace ErpBackend.Models;

public class Batch
{
    public int Id { get; set; }
    public string BatchNo { get; set; } = string.Empty;
    public DateTime ReceivedDate { get; set; } = DateTime.UtcNow;
    public decimal InitialQty { get; set; }
    public decimal AvailableQty { get; set; }
    public decimal Rate { get; set; }
    public string GrnId { get; set; } = string.Empty;
    public int ProductId { get; set; } // FK to Product
}
