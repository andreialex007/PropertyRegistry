using Microsoft.EntityFrameworkCore.Migrations;

namespace LandRegistry.Migrations
{
    public partial class Optional_parametersInLand : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lands_LandRightType_LandRightTypeId",
                table: "Lands");

            migrationBuilder.DropForeignKey(
                name: "FK_Lands_LandType_LandTypeId",
                table: "Lands");

            migrationBuilder.AlterColumn<int>(
                name: "LandTypeId",
                table: "Lands",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "LandRightTypeId",
                table: "Lands",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Lands_LandRightType_LandRightTypeId",
                table: "Lands",
                column: "LandRightTypeId",
                principalTable: "LandRightType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Lands_LandType_LandTypeId",
                table: "Lands",
                column: "LandTypeId",
                principalTable: "LandType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lands_LandRightType_LandRightTypeId",
                table: "Lands");

            migrationBuilder.DropForeignKey(
                name: "FK_Lands_LandType_LandTypeId",
                table: "Lands");

            migrationBuilder.AlterColumn<int>(
                name: "LandTypeId",
                table: "Lands",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LandRightTypeId",
                table: "Lands",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Lands_LandRightType_LandRightTypeId",
                table: "Lands",
                column: "LandRightTypeId",
                principalTable: "LandRightType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lands_LandType_LandTypeId",
                table: "Lands",
                column: "LandTypeId",
                principalTable: "LandType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
