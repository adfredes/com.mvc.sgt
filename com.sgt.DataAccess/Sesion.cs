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
    
    public partial class Sesion
    {
        public int ID { get; set; }
        public int AgendaID { get; set; }
        public int TurnoID { get; set; }
        public short Numero { get; set; }
        public int ConsultorioID { get; set; }
        public short TurnoSimultaneo { get; set; }
        public short Estado { get; set; }
        public System.DateTime FechaHora { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
    
        public virtual Agendum Agendum { get; set; }
        public virtual Turno Turno { get; set; }
    }
}