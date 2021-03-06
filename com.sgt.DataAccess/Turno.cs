//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class Turno
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Turno()
        {
            this.Sesions = new HashSet<Sesion>();
            this.Turno_Repeticiones = new HashSet<Turno_Repeticiones>();
        }
    
        public int ID { get; set; }
        public Nullable<int> PacienteID { get; set; }
        public Nullable<short> Estado { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
        public Nullable<int> CantidadSesiones { get; set; }
        public string Diagnostico { get; set; }
        public Nullable<System.DateTime> Fecha { get; set; }
        public Nullable<int> TipoSesionID { get; set; }
        public Nullable<int> TurnoDoble { get; set; }
        public string CodigoPractica { get; set; }
        public Nullable<System.DateTime> FechaFactura { get; set; }
        public string Factura { get; set; }
        public Nullable<decimal> importe { get; set; }
        public string NumeroAutorizacion { get; set; }
    
        public virtual Paciente Paciente { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Sesion> Sesions { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Turno_Repeticiones> Turno_Repeticiones { get; set; }
        public virtual TipoSesion TipoSesion { get; set; }
    }
}
