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
    
    public partial class Consultorio
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Consultorio()
        {
            this.Agenda_Bloqueos = new HashSet<Agenda_Bloqueos>();
        }
    
        public int ID { get; set; }
        public string Descripcion { get; set; }
        public short TurnosSimultaneos { get; set; }
        public bool Habilitado { get; set; }
        public System.DateTime FechaModificacion { get; set; }
        public Nullable<int> TipoSesionID { get; set; }
        public string UsuarioModificacion { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Agenda_Bloqueos> Agenda_Bloqueos { get; set; }
        public virtual TipoSesion TipoSesion { get; set; }
    }
}
