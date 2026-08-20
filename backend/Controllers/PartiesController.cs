using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErpBackend.Data;
using ErpBackend.Models;

namespace ErpBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PartiesController : ControllerBase
{
    private readonly ErpDbContext _db;
    public PartiesController(ErpDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Party>>> GetAll()
    {
        return await _db.Parties.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Party>> Get(int id)
    {
        var party = await _db.Parties.FindAsync(id);
        if (party == null) return NotFound();
        return party;
    }

    [HttpPost]
    public async Task<ActionResult<Party>> Create([FromBody] Party party)
    {
        _db.Parties.Add(party);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = party.Id }, party);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Party updated)
    {
        var existing = await _db.Parties.FindAsync(id);
        if (existing == null) return NotFound();
        // Update mutable fields
        existing.PartyId = updated.PartyId;
        existing.Name = updated.Name;
        existing.Status = updated.Status;
        existing.ContactNumber = updated.ContactNumber;
        existing.Email = updated.Email;
        existing.Address = updated.Address;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var party = await _db.Parties.FindAsync(id);
        if (party == null) return NotFound();
        _db.Parties.Remove(party);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
