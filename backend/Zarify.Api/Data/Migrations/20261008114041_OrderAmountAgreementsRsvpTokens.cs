using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Zarify.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrderAmountAgreementsRsvpTokens : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Rsvps_InvitationId_GuestNameKey",
                table: "Rsvps");

            migrationBuilder.AddColumn<string>(
                name: "EditTokenHash",
                table: "Rsvps",
                type: "varchar(64)",
                maxLength: 64,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "AmountTry",
                table: "Invitations",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SalesAgreements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    InvitationId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    UserEmail = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserFirstName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserLastName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    InvitationSlug = table.Column<string>(type: "varchar(160)", maxLength: 160, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CoupleNames = table.Column<string>(type: "varchar(210)", maxLength: 210, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PaymentReference = table.Column<string>(type: "varchar(16)", maxLength: 16, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AmountTry = table.Column<decimal>(type: "decimal(10,2)", precision: 10, scale: 2, nullable: false),
                    AcceptedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Version = table.Column<string>(type: "varchar(32)", maxLength: 32, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CancelledAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesAgreements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SalesAgreements_Invitations_InvitationId",
                        column: x => x.InvitationId,
                        principalTable: "Invitations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_SalesAgreements_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Rsvps_EditTokenHash",
                table: "Rsvps",
                column: "EditTokenHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Rsvps_InvitationId_GuestNameKey",
                table: "Rsvps",
                columns: new[] { "InvitationId", "GuestNameKey" });

            migrationBuilder.CreateIndex(
                name: "IX_SalesAgreements_CancelledAtUtc",
                table: "SalesAgreements",
                column: "CancelledAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_SalesAgreements_InvitationId",
                table: "SalesAgreements",
                column: "InvitationId");

            migrationBuilder.CreateIndex(
                name: "IX_SalesAgreements_UserId",
                table: "SalesAgreements",
                column: "UserId");

            // Orders placed before prices were fixed onto them get the price
            // in force when this migration was written (Payment:AmountTry).
            migrationBuilder.Sql(
                $"UPDATE `Invitations` SET `AmountTry` = {BackfillAmountTry} WHERE `AmountTry` IS NULL;");

            // Every contract acceptance recorded so far on an invitation gets
            // its durable record, with the buyer's details as they are now.
            migrationBuilder.Sql(
                """
                INSERT INTO `SalesAgreements`
                    (`Id`, `InvitationId`, `UserId`, `UserEmail`, `UserFirstName`, `UserLastName`,
                     `InvitationSlug`, `CoupleNames`, `PaymentReference`, `AmountTry`,
                     `AcceptedAtUtc`, `Version`, `CancelledAtUtc`)
                SELECT UUID(), i.`Id`, i.`UserId`, u.`Email`, u.`FirstName`, u.`LastName`,
                       i.`Slug`, CONCAT(i.`BrideName`, ' & ', i.`GroomName`), i.`PaymentReference`, i.`AmountTry`,
                       i.`DistanceSalesAcceptedAtUtc`, i.`DistanceSalesVersion`, NULL
                FROM `Invitations` i
                JOIN `Users` u ON u.`Id` = i.`UserId`
                WHERE i.`DistanceSalesAcceptedAtUtc` IS NOT NULL;
                """);
        }

        /// The invitation price (TRY) configured when this migration was
        /// written — used only to fill orders that predate fixed prices.
        private const string BackfillAmountTry = "199.90";

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SalesAgreements");

            migrationBuilder.DropIndex(
                name: "IX_Rsvps_EditTokenHash",
                table: "Rsvps");

            migrationBuilder.DropIndex(
                name: "IX_Rsvps_InvitationId_GuestNameKey",
                table: "Rsvps");

            migrationBuilder.DropColumn(
                name: "EditTokenHash",
                table: "Rsvps");

            migrationBuilder.DropColumn(
                name: "AmountTry",
                table: "Invitations");

            // Fails if replies sharing a name were added after the upgrade —
            // remove or merge those first.
            migrationBuilder.CreateIndex(
                name: "IX_Rsvps_InvitationId_GuestNameKey",
                table: "Rsvps",
                columns: new[] { "InvitationId", "GuestNameKey" },
                unique: true);
        }
    }
}
