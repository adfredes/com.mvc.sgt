using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class AseguradoraPlanModel
    {        
        public int? ID { get; set; }
        public int AseguradoraID { get; set; }
        public string Descripcion { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
    }
}