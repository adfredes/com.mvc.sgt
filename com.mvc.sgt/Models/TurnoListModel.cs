using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class TurnoListModel
    {
        public int? ID { get; set; }

        public DateTime FechaDesde { get; set; }
        public DateTime FechaHasta { get; set; }
        public int CantidadSesiones { get; set; }
        public string NumeroAutorizacion { get; set; }

    }
}