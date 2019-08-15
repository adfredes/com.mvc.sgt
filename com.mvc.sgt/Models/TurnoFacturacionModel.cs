using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class TurnoFacturacionModel
    {

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public TurnoFacturacionModel()
        {
            this.Sesions = new HashSet<SesionModel>();
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<SesionModel> Sesions { get; set; }


        public string Apellido { get; set; }
        public string Nombre { get; set; }
                             
        public string Aseguradora { get; set; }
        public string AseguradoraPlan { get; set; }

        public string DocumentoNumero { get; set; }
        public string Cuit { get; set; }
        public string CodigoPractica { get; set; }

        public string Direccion { get; set; }
        public string CodigoPostal { get; set; }
        

        public string NumeroAfiliado { get; set; }                        

        public string Diagnostico { get; set; }
        
        
        /*[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Turno> Turnoes { get; set; }*/
    }
}