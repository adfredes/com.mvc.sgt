using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class ConsultorioModel
    {
        public int? ID { get; set; }
        public string Descripcion { get; set; }
        public short TurnosSimultaneos { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
        public int TipoSesionID { get; set; }        
        public string TipoDeSesion { get; set; }
        public string Color { get; set; }        
    }
}