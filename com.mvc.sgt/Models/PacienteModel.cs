using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class PacienteModel
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public PacienteModel()
        {
           // this.Diagnosticos = new HashSet<DiagnosticoModel>();
            /*this.Imagens = new HashSet<Imagen>();
            this.Paciente_Aseguradora_Historico = new HashSet<Paciente_Aseguradora_Historico>();
            this.Turnoes = new HashSet<Turno>();*/
        }

        public int? ID { get; set; }
        public string Apellido { get; set; }
        public string Nombre { get; set; }
        public System.DateTime FechaNacimiento { get; set; }
        public string Telefono { get; set; }
        public string Telefono2 { get; set; }
        public string Celular { get; set; }
        public int AseguradoraID { get; set; }
        public int? AseguradoraPlanID { get; set; }
        public string DocumentoNumero { get; set; }
        public int? DocumentoTipoID { get; set; }
        public string Direccion { get; set; }
        public string CodigoPostal { get; set; }
        public int? ProvinciaID { get; set; }
        public int? LocalidadID { get; set; }
        public string NumeroAfiliado { get; set; }
        public string NumeroHC { get; set; }
        public string Observaciones { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
        public bool? EsGravado { get; set; }
        public string ObraSocial { get; set; }
        public string CodigoSeguridad { get; set; }
        public string Cuit { get; set; }
        public string Mail { get; set; }
        public string Foto { get; set; }

        public virtual AseguradoraModel Aseguradora { get; set; }
        public virtual AseguradoraPlanModel AseguradoraPlan { get; set; }
        public virtual DocumentoTipoModel DocumentoTipo { get; set; }
        /*[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Imagen> Imagens { get; set; }*/
        public virtual LocalidadModel Localidad { get; set; }
        /*[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Paciente_Aseguradora_Historico> Paciente_Aseguradora_Historico { get; set; }*/
        public virtual ProvinciaModel Provincia { get; set; }

        /*[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<DiagnosticoModel> Diagnosticos { get; set; }*/
        /*
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Turno> Turnoes { get; set; }*/
    }
}