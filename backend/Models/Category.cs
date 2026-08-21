namespace ErpBackend.Models;

public class MajorCategory
{
    public int Id { get; set; }
    public string MajorId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class SubCategory
{
    public int Id { get; set; }
    public string SubId { get; set; } = string.Empty;
    public string MajorId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

public class SubSubCategory
{
    public int Id { get; set; }
    public string SubSubId { get; set; } = string.Empty;
    public string SubId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
