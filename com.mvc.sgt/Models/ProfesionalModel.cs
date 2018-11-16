using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class ProfesionalModel
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ProfesionalModel()
        {
            //this.Agenda = new HashSet<Agendum>();
            this.TiposDeSesiones = new HashSet<Profesional_TipoSesionModel>();
            //this.Agenda = new HashSet<AgendaModel>();
        }

        public int? ID { get; set; }
        public string Apellido { get; set; }
        public string Nombre { get; set; }
        public string Matricula { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }

        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        //public virtual ICollection<Agendum> Agenda { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Profesional_TipoSesionModel> TiposDeSesiones { get; set; }

        //[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        //public virtual ICollection<AgendaModel> Agenda { get; set; }
    }
}