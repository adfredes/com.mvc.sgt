﻿//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace com.sgt.DataAccess
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class TurnosDB : DbContext
    {
        public TurnosDB()
            : base("name=TurnosDB")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Agendum> Agenda { get; set; }
        public virtual DbSet<Agenda_Bloqueos> Agenda_Bloqueos { get; set; }
        public virtual DbSet<Agenda_Receso> Agenda_Receso { get; set; }
        public virtual DbSet<Aseguradora> Aseguradoras { get; set; }
        public virtual DbSet<Aseguradora_Plan> Aseguradora_Plan { get; set; }
        public virtual DbSet<Consultorio> Consultorios { get; set; }
        public virtual DbSet<Documento_Tipo> Documento_Tipo { get; set; }
        public virtual DbSet<Feriado> Feriadoes { get; set; }
        public virtual DbSet<Imagen> Imagens { get; set; }
        public virtual DbSet<Localidad> Localidads { get; set; }
        public virtual DbSet<Paciente> Pacientes { get; set; }
        public virtual DbSet<Paciente_Aseguradora_Historico> Paciente_Aseguradora_Historico { get; set; }
        public virtual DbSet<Profesional> Profesionals { get; set; }
        public virtual DbSet<Provincia> Provincias { get; set; }
        public virtual DbSet<Sesion_Estado> Sesion_Estado { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<comisione> comisiones { get; set; }
        public virtual DbSet<Derivadore> Derivadores { get; set; }
        public virtual DbSet<foto> fotos { get; set; }
        public virtual DbSet<Historial> Historials { get; set; }
        public virtual DbSet<opcione> opciones { get; set; }
        public virtual DbSet<repeticionesMedico> repeticionesMedicos { get; set; }
        public virtual DbSet<Tratamiento> Tratamientos { get; set; }
        public virtual DbSet<TipoSesion> TipoSesions { get; set; }
        public virtual DbSet<Profesional_TipoSesion> Profesional_TipoSesion { get; set; }
        public virtual DbSet<HorariosProfesionale> HorariosProfesionales { get; set; }
        public virtual DbSet<Sesion> Sesions { get; set; }
        public virtual DbSet<Turno> Turnoes { get; set; }
        public virtual DbSet<Turno_Repeticiones> Turno_Repeticiones { get; set; }
        public virtual DbSet<SmtpMail> SmtpMails { get; set; }
        public virtual DbSet<PacienteDiagnostico> PacienteDiagnosticoes { get; set; }
        public virtual DbSet<Profesional_Ausencias> Profesional_Ausencias { get; set; }
    }
}
