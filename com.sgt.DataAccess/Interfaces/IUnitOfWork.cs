using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Interfaces
{
    public interface IUnitOfWork
    {
        IAseguradoraRepository RepoAseguradora { get; }
        IPacienteRepository RepoPaciente { get; }
        ILocalidadRepository RepoLocalidad { get; }
        IProvinciaRepository RepoProvincia { get; }
        IFeriadoRepository RepoFeriado { get; }
        IConsultorioRepository RepoConsultorio { get; }
        ITipoSesionRepository RepoTipoSesion { get; }
        IProfesionalRepository RepoProfesional { get; }
        IAgendaRepository RepoAgenda { get; }
        ISesionRepository RepoSesion { get; }
        ITurnoRepository RepoTurno { get; }
        IAgendaBloqueosRepository RepoAgendaBloqueos { get; }
        IAgendaRecesoRepository RepoAgendaReceso { get; }
        ISesionEstadosRepository RepoSesionEstados { get; }
        ITurnoRepeticionesRepository RepoTurnoRepeticiones { get; }        
    }
}
