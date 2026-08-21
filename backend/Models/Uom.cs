namespace ErpBackend.Models;

public class Uom
{
    public int Id { get; set; }
    public string UomId { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int DecimalPlaces { get; set; } = 2;
}
