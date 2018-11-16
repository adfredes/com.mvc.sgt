using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{    
    public partial class TipoSesionModel
    {              
        public int? ID { get; set; }
        public string Descripcion { get; set; }
        public string Color { get; set; }     
    }
}