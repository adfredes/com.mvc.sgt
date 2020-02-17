using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class ProfesionalSuplenciaModel
    {
        public int ID { get; set; }
        public int ProfesionalID { get; set; }
        public int AusenciaID { get; set; }
        public Nullable<int> DiaSemana { get; set; }
        public System.DateTime HoraDesde { get; set; }
        public System.DateTime HoraHasta { get; set; }
        public Nullable<bool> Habilitado { get; set; }
        public string  Profesional { get; set; }        
    }
}