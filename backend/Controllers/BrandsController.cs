using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpBackend.Data;
using ErpBackend.Models;

namespace ErpBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly ErpDbContext _db;
    public BrandsController(ErpDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Brand>>> GetAll()
    {
        return await _db.Brands.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Brand>> Create([FromBody] Brand brand)
    {
        _db.Brands.Add(brand);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = brand.Id }, brand);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var brand = await _db.Brands.FindAsync(id);
        if (brand == null) return NotFound();
        _db.Brands.Remove(brand);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
