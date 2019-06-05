using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.mvc.sgt.Models
{
    public class ImagenModel
    {
        public int ID { get; set; }
        public int PacienteID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Archivo { get; set; }
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }        
    }

    public class ImagenDescriptionModel
    {
        public int ID { get; set; }
        public int PacienteID { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }        
        public bool Habilitado { get; set; }
        public string UsuarioModificacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
    }
}