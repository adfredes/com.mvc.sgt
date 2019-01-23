using com.sgt.DataAccess;
using com.sgt.DataAccess.Interfaces;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace com.sgt.services.Services
{
    public class AgendaService : IAgendaService
    {
        private IUnitOfWork unitOfWork;

        public AgendaService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        #region Manejo de Feriado               

        public void AddFeriado(Feriado entity)
        {
            if (!ExisteFeriado(entity))
            {
                entity.Habilitado = true;
                this.unitOfWork.RepoFeriado.Add(entity);
            }
            else
            {
                throw new Exception("Feriado existente.");
            }
        }

        public void DelFeriado(Feriado entity)
        {
            entity.Habilitado = false;
            EditFeriado(entity);
        }

        public void DelFeriado(int id)
        {
            DelFeriado(FindFeriado(id));
        }

        public void EditFeriado(Feriado entity)
        {

            if (!ExisteFeriado(entity))
            {
                this.unitOfWork.RepoFeriado.Edit(entity);
            }
            else
            {
                throw new Exception("Feriado existente.");
            }
        }

        public ICollection<Feriado> FindNextFeriado()
        {
            var fecha = DateTime.Now;
            return this.unitOfWork.RepoFeriado.FindBy(x => x.Fecha > fecha).OrderBy(x => x.Fecha).ToList();
        }

        public Feriado FindFeriado(int id)
        {
            return this.unitOfWork.RepoFeriado.Find(id);
        }

        private bool ExisteFeriado(Feriado feriado)
        {
            return this.unitOfWork.RepoFeriado.FindBy(x => x.Fecha == feriado.Fecha && x.ID != feriado.ID).FirstOrDefault() == null ? false : true;
        }

        #endregion

        #region Agenda
        public Agendum GetAgenda()
        {
            return unitOfWork.RepoAgenda.GetAll()
                .OrderBy(x => x.ID)
                .FirstOrDefault();
        }

        #endregion

        #region Sesiones
        public ICollection<Sesion> SearchSesions(DateTime beginDate, DateTime endDate)
        {
            
            return unitOfWork.RepoSesion
                .FindBy(x => DbFunctions.TruncateTime(x.FechaHora) >= DbFunctions.TruncateTime(beginDate) 
                && DbFunctions.TruncateTime(x.FechaHora) < DbFunctions.TruncateTime(endDate)
                && x.Estado !=3 && x.Estado !=6 && x.Estado !=8 && x.Estado !=9)
                .OrderBy(x => x.ID)
                .ThenBy(x => x.FechaHora)                
                .ToList();
        }

        public Sesion SetSesionAnulada(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, 3, usuario);

        public Sesion SetSesionAsistio(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, 4,usuario);               

        public Sesion SetSesionNoAsistio(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, 5, usuario);

        public Sesion SetSesionConfirmado(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, 2, usuario);

        private ICollection<Sesion> SearchSesion(int sesionID)
        {
            Sesion sesion = unitOfWork.RepoSesion.Find(sesionID);
            var sesiones = unitOfWork.RepoSesion
                .FindBy(x => DbFunctions.TruncateTime(x.FechaHora) == DbFunctions.TruncateTime(sesion.FechaHora)
                    && x.TurnoID==sesion.TurnoID && x.Numero == sesion.Numero).ToList();
            return sesiones;
        }

        Sesion  ChangeStateSesion(int sesionID, short estado, string usuario)
        {
            Sesion rSesion;
            ICollection<Sesion> sesiones = SearchSesion(sesionID);
            foreach(Sesion sesion in sesiones)
            {                
                sesion.FechaModificacion = DateTime.Now;
                sesion.UsuarioModificacion = usuario;
                sesion.Estado = estado;
                unitOfWork.RepoSesion.Edit(sesion);
            }
            rSesion = sesiones.FirstOrDefault(x => x.ID == sesionID);
            return rSesion;
            
        }

        public ICollection<Sesion> BloquearSesion(Turno turno)
        {
            foreach(var sesion in turno.Sesions)
            {
                sesion.FechaModificacion = turno.FechaModificacion;
                sesion.UsuarioModificacion = turno.UsuarioModificacion;
                
            }
            if (ValidarNuevasSesiones(turno.Sesions.ToList()))
            {
                turno = unitOfWork.RepoTurno.Add(turno);
            }
            else
            {
                throw new Exception("Existen sesiones ya asignadas a su seleccion.");
            }
            
            return turno.Sesions;
        }


        private bool ValidarNuevasSesiones (List<Sesion> sesiones)
        {
            bool isValid = true;
            foreach (var sesion in sesiones)
            {
                if(unitOfWork.RepoSesion.FindBy(x => x.FechaHora == sesion.FechaHora && x.ConsultorioID == sesion.ConsultorioID
                && x.TurnoSimultaneo == sesion.TurnoSimultaneo
                 && x.Estado != 3 && x.Estado != 6 && x.Estado != 8 && x.Estado != 9).Count() > 0)
                {
                    isValid = false;
                    break;
                }
            }
            return isValid;            
        }

        #endregion
    }
}
