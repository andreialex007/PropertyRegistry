﻿// <auto-generated />
using System;
using LandRegistry.Code.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;

namespace LandRegistry.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.4-servicing-10062")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("LandRegistry.Code.Data.Models.Land", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AssetNumber");

                    b.Property<string>("CadastralNumberOfLand");

                    b.Property<string>("Coordinates");

                    b.Property<byte[]>("DocumentOnLand");

                    b.Property<string>("DocumentOnLandFileName");

                    b.Property<int?>("LandRightTypeId");

                    b.Property<int?>("LandTypeId");

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.HasIndex("LandRightTypeId");

                    b.HasIndex("LandTypeId");

                    b.ToTable("Lands");
                });

            modelBuilder.Entity("LandRegistry.Code.Data.Models.LandRightType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("LandRightType");
                });

            modelBuilder.Entity("LandRegistry.Code.Data.Models.LandType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name");

                    b.HasKey("Id");

                    b.ToTable("LandType");
                });

            modelBuilder.Entity("LandRegistry.Code.Data.Models.Land", b =>
                {
                    b.HasOne("LandRegistry.Code.Data.Models.LandRightType", "LandRightType")
                        .WithMany("Lands")
                        .HasForeignKey("LandRightTypeId");

                    b.HasOne("LandRegistry.Code.Data.Models.LandType", "LandType")
                        .WithMany("Lands")
                        .HasForeignKey("LandTypeId");
                });
#pragma warning restore 612, 618
        }
    }
}
