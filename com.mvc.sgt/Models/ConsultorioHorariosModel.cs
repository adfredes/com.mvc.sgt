using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class ConsultorioHorariosModel
    {
        public int? ID { get; set; }
        public string Descripcion { get; set; }
        public short TurnosSimultaneos { get; set; }
        public bool Habilitado { get; set; }

        public virtual ICollection<String> Horario { get; set; }

        public ConsultorioHorariosModel()
        {
            Horario = new HashSet<string>();
        }

    }
}