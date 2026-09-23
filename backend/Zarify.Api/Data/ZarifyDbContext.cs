using Microsoft.EntityFrameworkCore;
using Zarify.Api.Models;

namespace Zarify.Api.Data;

public class ZarifyDbContext(DbContextOptions<ZarifyDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Invitation> Invitations => Set<Invitation>();
    public DbSet<Rsvp> Rsvps => Set<Rsvp>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).HasMaxLength(256);
            entity.Property(u => u.FirstName).HasMaxLength(100);
            entity.Property(u => u.LastName).HasMaxLength(100);
        });

        modelBuilder.Entity<Invitation>(entity =>
        {
            entity.HasIndex(i => i.Slug).IsUnique();
            entity.Property(i => i.Slug).HasMaxLength(160);
            entity.Property(i => i.TemplateSlug).HasMaxLength(100);
            entity.Property(i => i.BrideName).HasMaxLength(100);
            entity.Property(i => i.GroomName).HasMaxLength(100);
            entity.Property(i => i.VenueName).HasMaxLength(150);
            entity.Property(i => i.VenueAddress).HasMaxLength(300);

            entity.HasOne(i => i.User)
                .WithMany()
                .HasForeignKey(i => i.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Rsvp>(entity =>
        {
            entity.Property(r => r.GuestName).HasMaxLength(100);
            entity.Property(r => r.GuestNameKey).HasMaxLength(100);
            entity.Property(r => r.Message).HasMaxLength(1000);
            // Stored as text so the column stays readable in the database
            // and reordering the enum can never silently remap old rows.
            entity.Property(r => r.Attendance).HasConversion<string>().HasMaxLength(10);
            entity.HasIndex(r => r.InvitationId);
            // One reply per guest per invitation, where "same guest" means
            // same folded name — also what catches two simultaneous
            // submissions that both miss the upsert lookup.
            entity.HasIndex(r => new { r.InvitationId, r.GuestNameKey }).IsUnique();

            entity.HasOne(r => r.Invitation)
                .WithMany()
                .HasForeignKey(r => r.InvitationId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
