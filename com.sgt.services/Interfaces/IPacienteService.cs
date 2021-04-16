using com.sgt.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Interfaces
{
    public interface IPacienteService:ICrudService<Paciente>
    {
        ICollection<Turno> ListarTurnos(int PacienteID);
        ICollection<Paciente> ListarPacientesAnualesCondicionSesiones();
        Imagen AddFile(Imagen imagen);
        void DeleteFile(int id, string usuario);
        ICollection<Imagen> GetFiles(int PacienteID);
        Imagen GetFile(int id);
        Boolean TurnosAnteriores(int PacienteID, int TipoSesionID);
        bool IsSesionesSuperpuestas(int turnoID);
        bool IsSesionesSuperpuestas(Turno turno);
        bool IsSesionSuperpuesta(int sesionID, DateTime fechaHoraSesion);
        Paciente GetPacienteByDocumento(string documento);
        
    }
}
