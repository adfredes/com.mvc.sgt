using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class TurnoModel
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public TurnoModel()
        {
            this.Sesions = new HashSet<SesionModel>();
        }

        public int? ID{ get; set; }
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SesionModel> Sesions { get; set; }
    }
}
