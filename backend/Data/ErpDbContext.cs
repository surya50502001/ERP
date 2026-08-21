using Microsoft.EntityFrameworkCore;
using ErpBackend.Models;

namespace ErpBackend.Data;

public class ErpDbContext : DbContext
{
    public ErpDbContext(DbContextOptions<ErpDbContext> options) : base(options) { }

    public DbSet<Party> Parties => Set<Party>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ItemType> ItemTypes => Set<ItemType>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<MajorCategory> MajorCategories => Set<MajorCategory>();
    public DbSet<SubCategory> SubCategories => Set<SubCategory>();
    public DbSet<SubSubCategory> SubSubCategories => Set<SubSubCategory>();
    public DbSet<Uom> Uoms => Set<Uom>();
    public DbSet<PurchaseOrder> PurchaseOrders => Set<PurchaseOrder>();
    public DbSet<SalesInvoice> SalesInvoices => Set<SalesInvoice>();
    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<RecentActivity> RecentActivities => Set<RecentActivity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
                {
                    property.SetColumnType("decimal(18, 2)");
                }
            }
        }
    }
}
