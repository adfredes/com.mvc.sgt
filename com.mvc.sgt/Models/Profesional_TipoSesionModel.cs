using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class Profesional_TipoSesionModel
    {
        public int? ID { get; set; }
        public int ProfesionalID { get; set; }
        public int TipoSesionID { get; set; }                
    }
}