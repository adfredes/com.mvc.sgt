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
using com.sgt.DataAccess.Enums;
using com.sgt.DataAccess.ExtensionMethod;

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

        public ICollection<Feriado> SearchFeriado(DateTime desde, DateTime hasta)
        {
            return unitOfWork.RepoFeriado.FindBy(x =>
            DbFunctions.TruncateTime(x.Fecha) >= DbFunctions.TruncateTime(desde) &&
            DbFunctions.TruncateTime(hasta) >= DbFunctions.TruncateTime(x.Fecha)
            ).ToList();
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
        public ICollection<Sesion> GetSesionConsultorioByDate(DateTime fecha, int consultorioID, int turnoSimultaneo)
        {
            return unitOfWork.RepoSesion
                .FindBy(x => DbFunctions.TruncateTime(x.FechaHora) == DbFunctions.TruncateTime(fecha)
                && x.ConsultorioID == consultorioID
                && x.TurnoSimultaneo == turnoSimultaneo
                && EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado))
                .OrderBy(x => x.FechaHora)
                .ToList();
        }

        public ICollection<Sesion> SearchSesions(DateTime beginDate, DateTime endDate)
        {

            return unitOfWork.RepoSesion
                .FindBy(x => DbFunctions.TruncateTime(x.FechaHora) >= DbFunctions.TruncateTime(beginDate)
                && DbFunctions.TruncateTime(x.FechaHora) < DbFunctions.TruncateTime(endDate)
                && EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado))
                .OrderBy(x => DbFunctions.TruncateTime(x.FechaHora))
                .ThenBy(x => x.ConsultorioID)
                .ThenBy(x => x.TurnoSimultaneo)
                .ThenBy(x => x.FechaHora)
                .ToList();
        }

        public ICollection<Sesion> FindSesion(int sesionID)
        {
            return SearchSesion(sesionID);
        }

        public Sesion SetSesionAnulada(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, (short)EstadoSesion.Anulado, usuario);

        public Sesion SetSesionAsistio(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, (short)EstadoSesion.Atendido, usuario);

        public Sesion SetSesionNoAsistio(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, (short)EstadoSesion.NoAsistio, usuario);

        public Sesion SetSesionConfirmado(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, (short)EstadoSesion.Confirmado, usuario);

        private ICollection<Sesion> SearchSesion(int sesionID)
        {
            Sesion sesion = unitOfWork.RepoSesion.Find(sesionID);
            var sesiones = unitOfWork.RepoSesion
                .FindBy(x => DbFunctions.TruncateTime(x.FechaHora) == DbFunctions.TruncateTime(sesion.FechaHora)
                    && x.TurnoID == sesion.TurnoID && x.Numero == sesion.Numero && x.Estado == sesion.Estado)
                    .OrderBy(x => x.FechaHora)
                    .ToList();
            return sesiones;
        }

        private ICollection<Sesion> SearchSesionByDateAndConsultorio(DateTime begin, DateTime end,
            int consultorioID, int simultaneo)
        {
            var resu = unitOfWork.RepoSesion.FindBy(x => x.FechaHora >= begin && x.FechaHora <= end
                                                      && x.ConsultorioID == consultorioID
                                                      && x.TurnoSimultaneo == simultaneo
                                                      && EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado))
                .ToList();
            return resu;
        }


        Sesion ChangeStateSesion(int sesionID, short estado, string usuario)
        {
            //Sesion rSesion = null;
            ICollection<Sesion> sesiones = SearchSesion(sesionID);
            foreach (Sesion sesion in sesiones)
            {
                sesion.FechaModificacion = DateTime.Now;
                sesion.UsuarioModificacion = usuario;
                sesion.Estado = estado;
                unitOfWork.RepoSesion.Edit(sesion);
            }
            return unitOfWork.RepoSesion.Find(sesionID);

        }

        public ICollection<Sesion> BloquearSesion(Turno turno)
        {
            turno.Estado = (short)EstadoTurno.Bloqueado;
            foreach (var sesion in turno.Sesions)
            {
                sesion.Estado = (short)EstadoSesion.Bloqueado;
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

        private short SearchTurnosSimultaneoByDate(DateTime begin, DateTime end, int consultorioID)
        {
            int cantidad = unitOfWork.RepoConsultorio.Find(consultorioID).TurnosSimultaneos;
            short simultaneo = 0;
            for (short t = 1; t <= cantidad; t++)
            {
                if (SearchSesionByDateAndConsultorio(begin, end, consultorioID, t).Count == 0)
                {
                    simultaneo = t;
                    t = (short)(cantidad + 1);
                }
            }
            return simultaneo;
        }

        private ICollection<Consultorio> FindConsultoriosByType(int TipoSesionID)
        {
            return unitOfWork.RepoConsultorio.FindBy(x => x.TipoSesionID == TipoSesionID).ToList();
        }

        public ICollection<Sesion> CambiarFechaSesion(ICollection<Sesion> sesiones)
        {
            var sesionesNuevas = sesiones.Where(x => x.ID == 0).ToList();
            DateTime beginDate = sesionesNuevas.Min(x => x.FechaHora);
            DateTime endDate = sesionesNuevas.Max(x => x.FechaHora);
            short simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, sesionesNuevas[0].ConsultorioID);

            if (simultaneo == 0)
            {
                throw new Exception("Existen sesiones ya asignadas a su seleccion.");
            }
            else
            {
                sesionesNuevas.ForEach(_s => _s.TurnoSimultaneo = (short)simultaneo);
            }

            if (ValidarNuevasSesiones(sesiones.Where(x => x.ID == 0).ToList()))
            {
                var sesion = sesiones.ToList()[0];

                /*var oldSesiones = unitOfWork.RepoSesion
                    .FindBy(x => x.TurnoID == sesion.TurnoID && x.Numero == sesion.Numero
                        && x.Estado == sesion.Estado);
                var sesionesDelete = oldSesiones.Except(sesiones, x => x.ID);
                sesionesDelete.ToList().ForEach(s => unitOfWork.RepoSesion.Delete(s));*/
                sesiones.ToList().ForEach(s =>
                {
                    if (s.ID > 0)
                        unitOfWork.RepoSesion.Edit(s);
                    else
                        unitOfWork.RepoSesion.Add(s);
                });
                //Usar using com.sgt.DataAccess.ExtensionMethod;                
            }
            else
                throw new Exception("Existen sesiones ya asignadas a su seleccion.");
            return sesiones;

        }

        public ICollection<Sesion> PosponerSesion(ICollection<Sesion> sesiones)
        {
            sesiones.ToList().ForEach(s => unitOfWork.RepoSesion.Edit(s));

            var sesionPospuesta = sesiones.ToList()[0];

            var turnos = unitOfWork.RepoTurno.FindBy(t => t.Sesions
                  .Where(s => DbFunctions.TruncateTime(s.FechaHora) >= DbFunctions.TruncateTime(sesionPospuesta.FechaHora))
                  .Count() > 0).ToList();

            var turnoPospuesto = turnos.Where(t => t.ID == sesionPospuesta.TurnoID).FirstOrDefault();
            turnoPospuesto.Sesions.Where(s => s.Numero > sesionPospuesta.Numero)
                .ToList().ForEach(s => {
                    s.Numero -= 1;
                    unitOfWork.RepoSesion.Edit(s);
                });

            
            /***********************/
                /*var diasSemana = turnoPospuesto.Sesions
                    .GroupBy(x => new { x.FechaHora.DayOfWeek, x.Numero })
                    .Select(x => x.Key)
                    .OrderBy(x => x.Numero);


                
                    DateTime ultimaSesion = turnoPospuesto.Sesions
                                            .Where(s=>EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)) 
                                            .Max(x => x.FechaHora);

            short posicion = (short)((nroSesion - 1) % cantidadSesionesAsignadas + 1);
                    var oldSesiones = turno.Sesions
                        .Where(x => x.Numero == posicion).ToList();

                    do
                    {
                        ultimaSesion = ultimaSesion.AddDays(1);
                    } while (ultimaSesion.DayOfWeek != oldSesiones[0].FechaHora.DayOfWeek);

                    int cantidadDias = (int)(ultimaSesion.Date - oldSesiones[0].FechaHora.Date).TotalDays;
                    oldSesiones.ToList().ForEach(s =>
                    {
                        Sesion sesion = new Sesion();
                        sesion.AgendaID = s.AgendaID;
                        sesion.ConsultorioID = s.ConsultorioID;
                        sesion.Estado = s.Estado;
                        sesion.FechaHora = s.FechaHora.AddDays(cantidadDias);
                        sesion.Habilitado = s.Habilitado;
                        sesion.Numero = (short)nroSesion;
                        sesion.TurnoID = s.TurnoID;
                        sesion.TurnoSimultaneo = s.TurnoSimultaneo;
                        turno.Sesions.Add(sesion);
                    });
               

            */
            /*var sesionesNuevas = sesiones.Where(x => x.ID == 0).ToList();
            DateTime beginDate = sesionesNuevas.Min(x => x.FechaHora);
            DateTime endDate = sesionesNuevas.Max(x => x.FechaHora);
            short simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, sesionesNuevas[0].ConsultorioID);

            if (simultaneo == 0)
            {
                throw new Exception("Existen sesiones ya asignadas a su seleccion.");
            }
            else
            {
                sesionesNuevas.ForEach(_s => _s.TurnoSimultaneo = (short)simultaneo);
            }

            if (ValidarNuevasSesiones(sesiones.Where(x => x.ID == 0).ToList()))
            {
                var sesion = sesiones.ToList()[0];                
                sesiones.ToList().ForEach(s =>
                {
                    if (s.ID > 0)
                        unitOfWork.RepoSesion.Edit(s);
                    else
                        unitOfWork.RepoSesion.Add(s);
                });                
            }
            else
                throw new Exception("Existen sesiones ya asignadas a su seleccion.");*/
            return sesiones;

        }

        public Turno CancelarSesionesPendientes(int idTurno)
        {
            var turno = unitOfWork.RepoTurno.Find(idTurno);
            if (turno != null)
            {
                turno = CancelarSesionesPendientes(turno);
            }
            return turno;
        }

        public Turno CancelarSesionesPendientes(Turno turno)
        {
            var sesiones =
            turno.Sesions.Where(x => x.Estado == (short)EstadoSesion.Confirmado || x.Estado == (short)EstadoSesion.SinFechaLibre)
                .ToList();
            sesiones.ForEach(sesion =>
            {
                sesion.FechaModificacion = turno.FechaModificacion;
                sesion.UsuarioModificacion = turno.UsuarioModificacion;
                sesion.Estado = (short)EstadoSesion.Cancelado;
                unitOfWork.RepoSesion.Edit(sesion);
            });
            return turno;
        }

        public ICollection<Sesion_Estado> GetSesionEstados() =>
            unitOfWork.RepoSesionEstados.GetAll().ToList();



        private bool ValidarNuevasSesiones(List<Sesion> sesiones)
        {
            bool isValid = true;
            foreach (var sesion in sesiones)
            {
                if (unitOfWork.RepoSesion.FindBy(x => x.FechaHora == sesion.FechaHora && x.ConsultorioID == sesion.ConsultorioID
                 && x.TurnoSimultaneo == sesion.TurnoSimultaneo &&
                 EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado)).Count() > 0)
                {
                    isValid = false;
                    break;
                }
            }
            return isValid;
        }

        #endregion

        #region Recesos
        public ICollection<Agenda_Receso> SearchRecesos(DateTime desde, DateTime hasta)
        {

            var recesos = unitOfWork.RepoAgendaReceso
                .FindBy(x =>
                    !(DbFunctions.TruncateTime(x.FechaDesde) > DbFunctions.TruncateTime(hasta) &&
                    DbFunctions.TruncateTime(x.FechaHasta) < DbFunctions.TruncateTime(desde))
                ).ToList();
            return recesos;

        }


        #endregion

        #region Bloqueos

        #endregion

        #region Reservas
        public Turno ReservarSesiones(Turno turno)
        {
            int cantidadSesionesAsignadas = turno.Sesions.Max(x => x.Numero);
            turno.Estado = (short)EstadoTurno.Reservado;


            if (turno.CantidadSesiones > cantidadSesionesAsignadas)
            {

                var diasSemana = turno.Sesions
                    .GroupBy(x => new { x.FechaHora.DayOfWeek, x.Numero })
                    .Select(x => x.Key)
                    .OrderBy(x => x.Numero);


                for (int nroSesion = cantidadSesionesAsignadas + 1; nroSesion <= turno.CantidadSesiones; nroSesion++)
                {
                    DateTime ultimaSesion = turno.Sesions.Max(x => x.FechaHora);
                    short posicion = (short)((nroSesion - 1) % cantidadSesionesAsignadas + 1);
                    var oldSesiones = turno.Sesions
                        .Where(x => x.Numero == posicion).ToList();

                    do
                    {
                        ultimaSesion = ultimaSesion.AddDays(1);
                    } while (ultimaSesion.DayOfWeek != oldSesiones[0].FechaHora.DayOfWeek);

                    int cantidadDias = (int)(ultimaSesion.Date - oldSesiones[0].FechaHora.Date).TotalDays;
                    oldSesiones.ToList().ForEach(s =>
                    {
                        Sesion sesion = new Sesion();
                        sesion.AgendaID = s.AgendaID;
                        sesion.ConsultorioID = s.ConsultorioID;
                        sesion.Estado = s.Estado;
                        sesion.FechaHora = s.FechaHora.AddDays(cantidadDias);
                        sesion.Habilitado = s.Habilitado;
                        sesion.Numero = (short)nroSesion;
                        sesion.TurnoID = s.TurnoID;
                        sesion.TurnoSimultaneo = s.TurnoSimultaneo;
                        turno.Sesions.Add(sesion);
                    });
                }

            }

            var sesiones = turno.Sesions
                .GroupBy(x => x.Numero)
                .Select(x => x.Key)
                .OrderBy(x => x);


            turno.Sesions.ToList().ForEach(s =>
            {
                s.UsuarioModificacion = turno.UsuarioModificacion;
                s.FechaModificacion = turno.FechaModificacion;
                s.Estado = (short)EstadoSesion.Reservado;
            });

            //CantidadSesiones


            //Valido sesiones y establezco sin fecha libre a las que dan error
            var consultorios = unitOfWork.RepoConsultorio.GetAll();
            sesiones.ToList().ForEach(se =>
            {
                DateTime beginDate = turno.Sesions.Where(x => x.Numero == (short)se).Min(x => x.FechaHora);
                DateTime endDate = turno.Sesions.Where(x => x.Numero == (short)se).Max(x => x.FechaHora);
                int idconsultorio = turno.Sesions.Where(s => s.Numero == se).Max(s => s.ConsultorioID);
                short simultaneo = 0;

                int? tipoSesionId = consultorios.Where(x => x.ID == idconsultorio)
                            .Max(x=>x.TipoSesionID);
                
                idconsultorio = 0;
                consultorios.Where(x => x.TipoSesionID == tipoSesionId).ToList()
                    .ForEach(x =>
                    {
                        if (idconsultorio == 0)
                        {
                            simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, x.ID);
                            if (simultaneo > 0)
                            {
                                idconsultorio = simultaneo > 0 ? x.ID : 0;
                                turno.Sesions.Where(tu => tu.Numero == se).ToList()
                                    .ForEach(tu =>
                                    {
                                        tu.TurnoSimultaneo = simultaneo;
                                        tu.ConsultorioID = idconsultorio;
                                    });
                            }

                        }
                    });

                if (!ValidarNuevasSesiones(turno.Sesions.Where(x => x.Numero == (short)se).ToList()))
                {
                    turno.Sesions.Where(x => x.Numero == (short)se).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                }
            });

            turno = unitOfWork.RepoTurno.Add(turno);


            return turno;
        }

        public void CancelarReserva(int idTurno)
        {
            var turno = unitOfWork.RepoTurno.Find(idTurno);
            if (turno != null)
            {
                CancelarReserva(turno);
            }
        }

        public void CancelarReserva(Turno turno)
        {
            turno.Sesions.ToList()
                .ForEach(sesion => unitOfWork.RepoSesion.Delete(sesion));
            unitOfWork.RepoTurno.Delete(turno);
        }


        #endregion


    }
}
