using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class AseguradoraModel
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public AseguradoraModel()
        {
            this.AseguradoraPlan = new HashSet<AseguradoraPlanModel>();            
        }

        public int? ID { get; set; }
        public string Descripcion { get; set; }
        public string Color { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AseguradoraPlanModel> AseguradoraPlan { get; set; }        
    }
}