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
    
    public partial class Agendum
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Agendum()
        {
            this.Agenda_Bloqueos = new HashSet<Agenda_Bloqueos>();
            this.Sesions = new HashSet<Sesion>();
        }
    
        public int ID { get; set; }
        public int ProfesionalID { get; set; }
        public string Descripcion { get; set; }
        public System.DateTime HoraDesde { get; set; }
        public System.DateTime HoraHasta { get; set; }
        public bool AtiendeLunes { get; set; }
        public bool AtiendeMartes { get; set; }
        public bool AtiendeMiercoles { get; set; }
        public bool AtiendeJueves { get; set; }
        public bool AtiendeViernes { get; set; }
        public bool AtiendeSabado { get; set; }
        public bool AtiendeDomingo { get; set; }
        public short Frecuencia { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Agenda_Bloqueos> Agenda_Bloqueos { get; set; }
        public virtual Profesional Profesional { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Sesion> Sesions { get; set; }
    }
}