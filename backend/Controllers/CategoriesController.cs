using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpBackend.Data;
using ErpBackend.Models;

namespace ErpBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ErpDbContext _db;
    public CategoriesController(ErpDbContext db) => _db = db;

    [HttpGet("major")]
    public async Task<ActionResult<IEnumerable<MajorCategory>>> GetMajor() => await _db.MajorCategories.ToListAsync();

    [HttpPost("major")]
    public async Task<ActionResult<MajorCategory>> CreateMajor([FromBody] MajorCategory cat)
    {
        _db.MajorCategories.Add(cat);
        await _db.SaveChangesAsync();
        return Ok(cat);
    }

    [HttpDelete("major/{id}")]
    public async Task<IActionResult> DeleteMajor(int id)
    {
        var item = await _db.MajorCategories.FindAsync(id);
        if (item == null) return NotFound();
        _db.MajorCategories.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("sub")]
    public async Task<ActionResult<IEnumerable<SubCategory>>> GetSub() => await _db.SubCategories.ToListAsync();

    [HttpPost("sub")]
    public async Task<ActionResult<SubCategory>> CreateSub([FromBody] SubCategory cat)
    {
        _db.SubCategories.Add(cat);
        await _db.SaveChangesAsync();
        return Ok(cat);
    }

    [HttpDelete("sub/{id}")]
    public async Task<IActionResult> DeleteSub(int id)
    {
        var item = await _db.SubCategories.FindAsync(id);
        if (item == null) return NotFound();
        _db.SubCategories.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("subsub")]
    public async Task<ActionResult<IEnumerable<SubSubCategory>>> GetSubSub() => await _db.SubSubCategories.ToListAsync();

    [HttpPost("subsub")]
    public async Task<ActionResult<SubSubCategory>> CreateSubSub([FromBody] SubSubCategory cat)
    {
        _db.SubSubCategories.Add(cat);
        await _db.SaveChangesAsync();
        return Ok(cat);
    }

    [HttpDelete("subsub/{id}")]
    public async Task<IActionResult> DeleteSubSub(int id)
    {
        var item = await _db.SubSubCategories.FindAsync(id);
        if (item == null) return NotFound();
        _db.SubSubCategories.Remove(item);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
