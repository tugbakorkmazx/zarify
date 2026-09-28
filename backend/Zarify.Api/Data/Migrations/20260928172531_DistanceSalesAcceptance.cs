using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zarify.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class DistanceSalesAcceptance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DistanceSalesAcceptedAtUtc",
                table: "Invitations",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DistanceSalesVersion",
                table: "Invitations",
                type: "varchar(32)",
                maxLength: 32,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DistanceSalesAcceptedAtUtc",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "DistanceSalesVersion",
                table: "Invitations");
        }
    }
}
