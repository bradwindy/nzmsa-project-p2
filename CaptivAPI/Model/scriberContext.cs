using System;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Captiv.Model
{
    public partial class scriberContext : DbContext
    {
        public scriberContext()
        {
        }

        public scriberContext(DbContextOptions<scriberContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Transcription> Transcription { get; set; }
        public virtual DbSet<Video> Video { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=tcp:captiv.database.windows.net,1433;Initial Catalog=captiv;Persist Security Info=False;User ID=captiv;Password=ROCKY263!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<Transcription>(entity =>
            {
                entity.Property(e => e.Phrase).IsUnicode(false);

                entity.HasOne(d => d.Video)
                    .WithMany(p => p.Transcription)
                    .HasForeignKey(d => d.VideoId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("VideoId");
            });

            modelBuilder.Entity<Video>(entity =>
            {
                entity.Property(e => e.ThumbnailUrl).IsUnicode(false);

                entity.Property(e => e.VideoTitle).IsUnicode(false);

                entity.Property(e => e.WebUrl).IsUnicode(false);
            });
        }
    }
}
