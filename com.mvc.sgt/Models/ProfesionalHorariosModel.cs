using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class ProfesionalHorariosModel
    {        
            public int? ID { get; set; }
            public int diaSemana { get; set; }
            public System.DateTime desde { get; set; }
            public System.DateTime hasta { get; set; }
            public int? ProfesionalID { get; set; }                    
    }
}