using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace LandRegistry.Migrations
{
    public partial class InitalDbStructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LandRightType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandRightType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LandType",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LandType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lands",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    LandTypeId = table.Column<int>(nullable: false),
                    AssetNumber = table.Column<string>(nullable: true),
                    CadastralNumberOfLand = table.Column<string>(nullable: true),
                    LandRightTypeId = table.Column<int>(nullable: false),
                    DocumentOnLand = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lands", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lands_LandRightType_LandRightTypeId",
                        column: x => x.LandRightTypeId,
                        principalTable: "LandRightType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Lands_LandType_LandTypeId",
                        column: x => x.LandTypeId,
                        principalTable: "LandType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lands_LandRightTypeId",
                table: "Lands",
                column: "LandRightTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Lands_LandTypeId",
                table: "Lands",
                column: "LandTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lands");

            migrationBuilder.DropTable(
                name: "LandRightType");

            migrationBuilder.DropTable(
                name: "LandType");
        }
    }
}
