using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class PacienteSearchDto
    {
        public int? ID { get; set; }
        public string Apellido { get; set; }
        public string Nombre { get; set; }
    }
}