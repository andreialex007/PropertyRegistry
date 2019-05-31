using Microsoft.EntityFrameworkCore.Migrations;

namespace LandRegistry.Migrations
{
    public partial class Land_Coordinates_And_FileName_Props_added : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Coordinates",
                table: "Lands",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DocumentOnLandFileName",
                table: "Lands",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Coordinates",
                table: "Lands");

            migrationBuilder.DropColumn(
                name: "DocumentOnLandFileName",
                table: "Lands");
        }
    }
}
