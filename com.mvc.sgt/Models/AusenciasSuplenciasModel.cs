using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class AusenciasSuplenciasModel
    {                    
            public System.DateTime FechaDesde { get; set; }
            public System.DateTime FechaHasta { get; set; }            
            public string Profesional { get; set; }

            public ICollection<ProfesionalSuplenciaModel> Suplencias { get; set; }

    }
}