using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Zarify.Api.Data;

#nullable disable

namespace Zarify.Api.Data.Migrations;

[DbContext(typeof(ZarifyDbContext))]
[Migration("20261107190000_AddInvitationEventType")]
public partial class AddInvitationEventType : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "EventType",
            table: "Invitations",
            type: "varchar(40)",
            maxLength: 40,
            nullable: false,
            defaultValue: "dugun")
            .Annotation("MySql:CharSet", "utf8mb4");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "EventType",
            table: "Invitations");
    }
}
