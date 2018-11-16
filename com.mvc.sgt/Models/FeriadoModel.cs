using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class FeriadoModel
    {
        public int? ID { get; set; }
        public System.DateTime Fecha { get; set; }
        public string Descripcion { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
    }
}