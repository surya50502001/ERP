using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpBackend.Data;
using ErpBackend.Models;

namespace ErpBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemTypesController : ControllerBase
{
    private readonly ErpDbContext _db;
    public ItemTypesController(ErpDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemType>>> GetAll()
    {
        return await _db.ItemTypes.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ItemType>> Create([FromBody] ItemType itemType)
    {
        _db.ItemTypes.Add(itemType);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = itemType.Id }, itemType);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var itemType = await _db.ItemTypes.FindAsync(id);
        if (itemType == null) return NotFound();
        _db.ItemTypes.Remove(itemType);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
