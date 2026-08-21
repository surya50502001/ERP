using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpBackend.Data;
using ErpBackend.Models;

namespace ErpBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UomsController : ControllerBase
{
    private readonly ErpDbContext _db;
    public UomsController(ErpDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Uom>>> GetAll() => await _db.Uoms.ToListAsync();

    [HttpPost]
    public async Task<ActionResult<Uom>> Create([FromBody] Uom uom)
    {
        _db.Uoms.Add(uom);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = uom.Id }, uom);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var uom = await _db.Uoms.FindAsync(id);
        if (uom == null) return NotFound();
        _db.Uoms.Remove(uom);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
