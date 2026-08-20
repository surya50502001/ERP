namespace ErpBackend.Models;

public class Notification
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public bool Unread { get; set; } = true;
    public DateTime Time { get; set; } = DateTime.UtcNow;
    // Additional fields can be added (type, link, etc.)
}
