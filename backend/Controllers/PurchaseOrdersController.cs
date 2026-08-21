using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpBackend.Data;
using ErpBackend.Models;

namespace ErpBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PurchaseOrdersController : ControllerBase
{
    private readonly ErpDbContext _db;
    public PurchaseOrdersController(ErpDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PurchaseOrder>>> GetAll()
    {
        return await _db.PurchaseOrders.Include(p => p.Items).Include(p => p.Activity).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PurchaseOrder>> Get(int id)
    {
        var po = await _db.PurchaseOrders.Include(p => p.Items).Include(p => p.Activity).FirstOrDefaultAsync(p => p.Id == id);
        if (po == null) return NotFound();
        return po;
    }

    [HttpPost]
    public async Task<ActionResult<PurchaseOrder>> Create([FromBody] PurchaseOrder po)
    {
        _db.PurchaseOrders.Add(po);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = po.Id }, po);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] PurchaseOrder updated)
    {
        var existing = await _db.PurchaseOrders.FindAsync(id);
        if (existing == null) return NotFound();
        existing.Status = updated.Status;
        existing.GrnId = updated.GrnId;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var po = await _db.PurchaseOrders.FindAsync(id);
        if (po == null) return NotFound();
        _db.PurchaseOrders.Remove(po);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
