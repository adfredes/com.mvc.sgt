//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace com.sgt.DataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class Agenda_Bloqueos
    {
        public int ID { get; set; }
        public int AgendaId { get; set; }
        public int ConsultorioId { get; set; }
        public short TurnoSimultaneo { get; set; }
        public System.DateTime FechaDesde { get; set; }
        public System.DateTime FechaHasta { get; set; }
        public Nullable<System.DateTime> HoraDesde { get; set; }
        public Nullable<System.DateTime> HoraHasta { get; set; }
        public Nullable<bool> TodoElDia { get; set; }
        public bool Habilitado { get; set; }
        public Nullable<bool> bLunes { get; set; }
        public Nullable<bool> bMartes { get; set; }
        public Nullable<bool> bMiercoles { get; set; }
        public Nullable<bool> bJueves { get; set; }
        public Nullable<bool> bViernes { get; set; }
        public Nullable<bool> bSabado { get; set; }
        public Nullable<bool> bDomingo { get; set; }
    
        public virtual Agendum Agendum { get; set; }
        public virtual Consultorio Consultorio { get; set; }
    }
}
