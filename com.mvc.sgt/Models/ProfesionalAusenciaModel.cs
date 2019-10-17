using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class ProfesionalAusenciaModel
    {
        public int? ID { get; set; }
        public int ProfesionalID { get; set; }
        public System.DateTime FechaDesde { get; set; }
        public System.DateTime FechaHasta { get; set; }
        public Nullable<bool> Habilitado { get; set; }

        public string Profesional { get; set; }
    }
}