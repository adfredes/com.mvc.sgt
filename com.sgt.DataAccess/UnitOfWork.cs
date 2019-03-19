using com.sgt.DataAccess.Interfaces;
using com.sgt.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess
{
    public class UnitOfWork : IUnitOfWork
    {

        private readonly DbContext dbContext;
        private bool disposed;
        private IAseguradoraRepository aseguradoraRepository;
        private IPacienteRepository pacienteRepository;
        private IProvinciaRepository provinciaRepository;
        private ILocalidadRepository localidadRepository;
        private IFeriadoRepository feriadoRepository;
        private IConsultorioRepository consultorioRepository;
        private ITipoSesionRepository tipoSesionRepository;
        private IProfesionalRepository profesionalRepository;
        private IAgendaRepository agendaRepository;
        private ISesionRepository sesionRepository;
        private ITurnoRepository turnoRepository;
        private IAgendaBloqueosRepository agendaBloqueosRepository;
        private IAgendaRecesoRepository agendaRecesoRepository;
        private ISesionEstadosRepository sesionEstadosRepository;
        private ITurnoRepeticionesRepository turnoRepeticionesRepository;

        public UnitOfWork(TurnosDB dbContext)
        {
            this.dbContext = dbContext;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    dbContext.Dispose();
                }
            }
            disposed = true;
        }


        public IAseguradoraRepository RepoAseguradora =>
            aseguradoraRepository = aseguradoraRepository ?? new AseguradoraRepository(dbContext);
            

        public IPacienteRepository RepoPaciente =>
            pacienteRepository = pacienteRepository ?? new PacienteRepository(dbContext);
            

        public ILocalidadRepository RepoLocalidad =>
            localidadRepository = localidadRepository ?? new LocalidadRepository(dbContext);
            

        public IProvinciaRepository RepoProvincia =>
            provinciaRepository = provinciaRepository ?? new ProvinciaRepository(dbContext);
            

        public IFeriadoRepository RepoFeriado =>
            feriadoRepository = feriadoRepository ?? new FeriadoRepository(dbContext);
        
        public IConsultorioRepository RepoConsultorio =>
            consultorioRepository = consultorioRepository ?? new ConsultorioRepository(dbContext);

        public ITipoSesionRepository RepoTipoSesion =>
            tipoSesionRepository = tipoSesionRepository ?? new TipoSesionRepository(dbContext);

        public IProfesionalRepository RepoProfesional =>
            profesionalRepository = profesionalRepository ?? new ProfesionalRepository(dbContext);

        public IAgendaRepository RepoAgenda =>
            agendaRepository = agendaRepository ?? new AgendaRepository(dbContext);

        public ISesionRepository RepoSesion =>
            sesionRepository = sesionRepository?? new SesionRepository(dbContext);

        public ITurnoRepository RepoTurno =>
            turnoRepository = turnoRepository ?? new TurnoRepository(dbContext);

        public IAgendaBloqueosRepository RepoAgendaBloqueos => 
            agendaBloqueosRepository = agendaBloqueosRepository ?? new AgendaBloqueosRepository(dbContext);

        public IAgendaRecesoRepository RepoAgendaReceso => 
            agendaRecesoRepository = agendaRecesoRepository ?? new AgendaRecesoRepository(dbContext);

        public ISesionEstadosRepository RepoSesionEstados =>
            sesionEstadosRepository = sesionEstadosRepository ?? new SesionEstadosRepository(dbContext);

        public ITurnoRepeticionesRepository RepoTurnoRepeticiones =>
            turnoRepeticionesRepository= turnoRepeticionesRepository ?? new TurnoRepeticionesRepository(dbContext);
    }
}
