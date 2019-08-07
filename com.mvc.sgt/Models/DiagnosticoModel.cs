using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class DiagnosticoModel
    {
        public DateTime? Fecha { get; set; }
        public string Diagnostico { get; set; }
        public string CodigoPractica { get; set; }
        public int TurnoID { get; set; }
        public int? Tipo { get; set; }
    }
}