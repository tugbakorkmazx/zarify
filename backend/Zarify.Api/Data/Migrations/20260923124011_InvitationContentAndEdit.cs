using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zarify.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InvitationContentAndEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IncludeDressCode",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "IncludePhotoAlbum",
                table: "Invitations");

            migrationBuilder.AddColumn<string>(
                name: "AccommodationNote",
                table: "Invitations",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DressCode",
                table: "Invitations",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "GiftNote",
                table: "Invitations",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "RsvpDeadline",
                table: "Invitations",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Schedule",
                table: "Invitations",
                type: "json",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            // Rows that predate the column: an empty programme, not JSON null.
            migrationBuilder.Sql("UPDATE `Invitations` SET `Schedule` = '[]' WHERE `Schedule` IS NULL OR JSON_TYPE(`Schedule`) <> 'ARRAY';");

            migrationBuilder.AddColumn<string>(
                name: "StoryText",
                table: "Invitations",
                type: "varchar(2000)",
                maxLength: 2000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAtUtc",
                table: "Invitations",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccommodationNote",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "DressCode",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftNote",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "RsvpDeadline",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "Schedule",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "StoryText",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "UpdatedAtUtc",
                table: "Invitations");

            migrationBuilder.AddColumn<bool>(
                name: "IncludeDressCode",
                table: "Invitations",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IncludePhotoAlbum",
                table: "Invitations",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }
    }
}
