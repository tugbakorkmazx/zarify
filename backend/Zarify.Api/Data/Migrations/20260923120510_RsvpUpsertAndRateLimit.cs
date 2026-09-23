using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zarify.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RsvpUpsertAndRateLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GuestNameKey",
                table: "Rsvps",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAtUtc",
                table: "Rsvps",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rsvps_InvitationId_GuestNameKey",
                table: "Rsvps",
                columns: new[] { "InvitationId", "GuestNameKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Rsvps_InvitationId_GuestNameKey",
                table: "Rsvps");

            migrationBuilder.DropColumn(
                name: "GuestNameKey",
                table: "Rsvps");

            migrationBuilder.DropColumn(
                name: "UpdatedAtUtc",
                table: "Rsvps");
        }
    }
}
