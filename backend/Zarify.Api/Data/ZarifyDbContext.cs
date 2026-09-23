using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Zarify.Api.Models;

namespace Zarify.Api.Data;

public class ZarifyDbContext(DbContextOptions<ZarifyDbContext> options) : DbContext(options)
{
    private static readonly JsonSerializerOptions ScheduleJson = new(JsonSerializerDefaults.Web);

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
            entity.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<Invitation>(entity =>
        {
            entity.HasIndex(i => i.Slug).IsUnique();
            entity.HasIndex(i => i.PaymentReference).IsUnique();
            entity.Property(i => i.PaymentReference).HasMaxLength(16);
            entity.Property(i => i.Slug).HasMaxLength(160);
            entity.Property(i => i.TemplateSlug).HasMaxLength(100);
            entity.Property(i => i.BrideName).HasMaxLength(100);
            entity.Property(i => i.GroomName).HasMaxLength(100);
            entity.Property(i => i.VenueName).HasMaxLength(150);
            entity.Property(i => i.VenueAddress).HasMaxLength(300);
            entity.Property(i => i.StoryText).HasMaxLength(2000);
            entity.Property(i => i.DressCode).HasMaxLength(1000);
            entity.Property(i => i.GiftNote).HasMaxLength(1000);
            entity.Property(i => i.AccommodationNote).HasMaxLength(1000);
            entity.Property(i => i.Status).HasConversion<string>().HasMaxLength(20);
            // The admin payment queue filters on it.
            entity.HasIndex(i => i.Status);

            // The programme is a short ordered list that's only ever read
            // and written whole with its invitation — a JSON column rather
            // than a child table with its own ordering column.
            entity.Property(i => i.Schedule)
                .HasColumnType("json")
                .HasConversion(
                    v => JsonSerializer.Serialize(v, ScheduleJson),
                    v => JsonSerializer.Deserialize<List<ScheduleItem>>(v, ScheduleJson) ?? new List<ScheduleItem>(),
                    new ValueComparer<List<ScheduleItem>>(
                        (a, b) => JsonSerializer.Serialize(a, ScheduleJson) == JsonSerializer.Serialize(b, ScheduleJson),
                        v => JsonSerializer.Serialize(v, ScheduleJson).GetHashCode(),
                        v => JsonSerializer.Deserialize<List<ScheduleItem>>(JsonSerializer.Serialize(v, ScheduleJson), ScheduleJson)!));

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
