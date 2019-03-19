﻿using com.sgt.DataAccess;
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
            return this.unitOfWork.RepoFeriado.FindBy(x => x.Fecha > fecha && x.Habilitado).OrderBy(x => x.Fecha).ToList();
        }

        public Feriado FindFeriado(int id)
        {
            return this.unitOfWork.RepoFeriado.Find(id);
        }

        public ICollection<Feriado> SearchFeriado(DateTime desde, DateTime hasta)
        {
            return unitOfWork.RepoFeriado.FindBy(x =>
            DbFunctions.TruncateTime(x.Fecha) >= DbFunctions.TruncateTime(desde) &&
            DbFunctions.TruncateTime(x.Fecha) <= DbFunctions.TruncateTime(hasta)
            && x.Habilitado
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
            turno.Turno_Repeticiones.Add(
                new Turno_Repeticiones
                {
                    ConsultorioID = turno.Sesions.ToList()[0].ConsultorioID,
                    DiaSemana =(int) turno.Sesions.ToList()[0].FechaHora.DayOfWeek,
                    FechaModificacion=turno.FechaModificacion,
                    Frecuencia=7,
                    Modulos= turno.Sesions.ToList().Count(),
                    Posicion=1,
                    UsuarioModificacion=turno.UsuarioModificacion,
                    Hora= turno.Sesions.ToList()[0].FechaHora
                }
                );
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
            return CambiarFechaSesion(sesiones, false);

        }

        public ICollection<Sesion> CambiarFechaSesionSobreturno(ICollection<Sesion> sesiones)
        {

            return CambiarFechaSesion(sesiones, true);

        }

        private ICollection<Sesion> CambiarFechaSesion(ICollection<Sesion> sesiones, bool sobreturno)
        {
            var estadoTurno = unitOfWork.RepoTurno.Find(sesiones.ToList()[0].TurnoID).Estado;
            var sesionesNuevas = sesiones.Where(x => x.ID == 0).ToList();
            if (!sobreturno)
            {
                DateTime beginDate = sesiones.Where(x => x.ID == 0).Min(x => x.FechaHora);
                DateTime endDate = sesiones.Where(x => x.ID == 0).Max(x => x.FechaHora);
                short simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, sesionesNuevas[0].ConsultorioID);

                if (simultaneo == 0)
                {
                    throw new Exception("Existen sesiones ya asignadas a su seleccion.");
                }
                else
                {
                    sesionesNuevas.ForEach(_s =>
                    {
                        _s.TurnoSimultaneo = (short)simultaneo;
                        _s.Estado = (EstadoTurno)estadoTurno == EstadoTurno.Reservado ? (short)EstadoSesion.Reservado : (short)EstadoSesion.Confirmado;
                    });
                }
            }

            if (ValidarNuevasSesiones(sesiones.Where(x => x.ID == 0).ToList(), sobreturno))
            {
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

            //var sesionPospuesta = sesiones.ToList()[0];

            //var turnos = unitOfWork.RepoTurno.FindBy(t => t.Sesions
            //      .Where(s => DbFunctions.TruncateTime(s.FechaHora) >= DbFunctions.TruncateTime(sesionPospuesta.FechaHora))
            //      .Count() > 0).ToList();


            //var turnoPospuesto = turnos.Where(t => t.ID == sesionPospuesta.TurnoID).FirstOrDefault();
            //ICollection<Sesion> sesionOriginal = new List<Sesion>();
            //int numero = 0;            
            //for(int pos=0; pos < turnoPospuesto.Sesions.Count; pos++)
            //{
            //    if (pos > 0)
            //    {

            //    }
            //    else
            //    {

            //    }
            //}

            //    //= turnoPospuesto.Sesions
            //    //                    .Where(s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado));

            //DateTime ultimaSesion = turnoPospuesto.Sesions
            //                                .Where(s=>EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)) 
            //                                .Max(x => x.FechaHora);

            ///***********************/

            //int maxNumero = turnoPospuesto.Sesions.Max(s => s.Numero);
            //int maxID = turnoPospuesto.Sesions.Where(s => s.Numero == maxNumero).Min(s => s.ID);


            //    var diasSemana = turnoPospuesto.Sesions
            //        .GroupBy(x => new { x.FechaHora.DayOfWeek, x.Numero })
            //        .Select(x => x.Key)
            //        .OrderBy(x => x.Numero);





            //int diasASumar = 0;
            //turnoPospuesto.Sesions.Where(s=>s.Numero ==)


            //short posicion = (short)((nroSesion - 1) % cantidadSesionesAsignadas + 1);
            //        var oldSesiones = turno.Sesions
            //            .Where(x => x.Numero == posicion).ToList();

            //        do
            //        {
            //            ultimaSesion = ultimaSesion.AddDays(1);
            //        } while (ultimaSesion.DayOfWeek != oldSesiones[0].FechaHora.DayOfWeek);

            //        int cantidadDias = (int)(ultimaSesion.Date - oldSesiones[0].FechaHora.Date).TotalDays;
            //        oldSesiones.ToList().ForEach(s =>
            //        {
            //            Sesion sesion = new Sesion();
            //            sesion.AgendaID = s.AgendaID;
            //            sesion.ConsultorioID = s.ConsultorioID;
            //            sesion.Estado = s.Estado;
            //            sesion.FechaHora = s.FechaHora.AddDays(cantidadDias);
            //            sesion.Habilitado = s.Habilitado;
            //            sesion.Numero = (short)nroSesion;
            //            sesion.TurnoID = s.TurnoID;
            //            sesion.TurnoSimultaneo = s.TurnoSimultaneo;
            //            turno.Sesions.Add(sesion);
            //        });


            //sesiones.ToList().ForEach(s => unitOfWork.RepoSesion.Edit(s));

            //turnoPospuesto.Sesions.Where(s => s.Numero > sesionPospuesta.Numero)
            //    .ToList().ForEach(s => {
            //        s.Numero -= 1;
            //        unitOfWork.RepoSesion.Edit(s);
            //    });
            ///*var sesionesNuevas = sesiones.Where(x => x.ID == 0).ToList();
            //DateTime beginDate = sesionesNuevas.Min(x => x.FechaHora);
            //DateTime endDate = sesionesNuevas.Max(x => x.FechaHora);
            //short simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, sesionesNuevas[0].ConsultorioID);

            //if (simultaneo == 0)
            //{
            //    throw new Exception("Existen sesiones ya asignadas a su seleccion.");
            //}
            //else
            //{
            //    sesionesNuevas.ForEach(_s => _s.TurnoSimultaneo = (short)simultaneo);
            //}

            //if (ValidarNuevasSesiones(sesiones.Where(x => x.ID == 0).ToList()))
            //{
            //    var sesion = sesiones.ToList()[0];                
            //    sesiones.ToList().ForEach(s =>
            //    {
            //        if (s.ID > 0)
            //            unitOfWork.RepoSesion.Edit(s);
            //        else
            //            unitOfWork.RepoSesion.Add(s);
            //    });                
            //}
            //else
            //    throw new Exception("Existen sesiones ya asignadas a su seleccion.");*/
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
            turno.Sesions.Where(x => x.Estado == (short)EstadoSesion.Confirmado || x.Estado == (short)EstadoSesion.SinFechaLibre || x.Estado == (short)EstadoSesion.Reservado)
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



        private bool ValidarNuevasSesiones(List<Sesion> sesiones, bool sobreturno = false)
        {
            bool isValid = true;
            int cantidad = sobreturno ? 1 : 0;
            var pp = GetAgenda();
                                    
            if (sesiones.Where(s => s.FechaHora.Hour > pp.HoraHasta.Hour
                || (s.FechaHora.Hour == pp.HoraHasta.Hour && s.FechaHora.Minute > pp.HoraHasta.Minute)
                ).ToList().Count() > 0)
            {
                isValid = false;
                throw new Exception("La sesión finaliza despues del horario de cierre del consultorio.");
            }
            else
            {
                foreach (var sesion in sesiones)
                {
                    if (unitOfWork.RepoSesion.FindBy(x => x.FechaHora == sesion.FechaHora && x.ConsultorioID == sesion.ConsultorioID
                     && x.TurnoSimultaneo == sesion.TurnoSimultaneo &&
                     EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado)).Count() > cantidad)
                    {
                        isValid = false;
                        break;
                    }
                }
                isValid = SearchFeriado(sesiones[0].FechaHora, sesiones[0].FechaHora).Count > 0 ? false : isValid;
                isValid = SearchRecesos(sesiones[0].FechaHora, sesiones[0].FechaHora).Count > 0 ? false : isValid;
            }

                        
            return isValid;
        }


        #endregion

        #region Recesos
        public ICollection<Agenda_Receso> SearchRecesos(DateTime desde, DateTime hasta)
        {

            var recesos = unitOfWork.RepoAgendaReceso
                .FindBy(x =>
                DbFunctions.TruncateTime(desde) <= DbFunctions.TruncateTime(x.FechaHasta)
                && DbFunctions.TruncateTime(hasta) >= DbFunctions.TruncateTime(x.FechaDesde)
                && x.Habilitado
                ).ToList();
            return recesos;

        }


        #endregion

        #region Bloqueos

        #endregion

        #region Reservas
        private ICollection<Turno_Repeticiones> LogicaTurnoRepeticiones(List<Sesion> sesiones)
        {
            ICollection<Turno_Repeticiones> repeticiones = new List<Turno_Repeticiones>();
            int pos = 1;
            sesiones.ForEach(s =>
            {
                var oldRepeticion = repeticiones.Where(r => (DayOfWeek)r.DiaSemana == s.FechaHora.DayOfWeek)
                                                .FirstOrDefault();
                if (oldRepeticion == null)
                {
                    int modulos = sesiones.Where(x => x.Numero == s.Numero).Count();
                    Turno_Repeticiones repeticion = new Turno_Repeticiones
                    {
                        ConsultorioID = s.ConsultorioID,
                        DiaSemana = (int)s.FechaHora.DayOfWeek,
                        Frecuencia = 0,
                        Hora = s.FechaHora,
                        Posicion = pos,
                        Modulos = modulos
                    };
                    repeticiones.Add(repeticion);
                    pos++;
                }
                else
                {
                    oldRepeticion.Frecuencia = oldRepeticion.Frecuencia == 0 ? (int)(s.FechaHora - oldRepeticion.Hora).TotalDays
                                        : oldRepeticion.Frecuencia;
                }
            });
            repeticiones.ToList().ForEach(r => r.Frecuencia = r.Frecuencia == 0 ? 7 : r.Frecuencia);
            return repeticiones;
        }

        private List<Sesion> getNextDay(List<Sesion> sesiones, List<Turno_Repeticiones> repeticiones)
        {
            List<DateTime> fechas = new List<DateTime>();
            List<Sesion> newSesiones = new List<Sesion>();

            sesiones = sesiones
                .Where(s => (EstadoSesion)s.Estado == EstadoSesion.SinFechaLibre || EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado))
                .ToList();

            DateTime lastDay = sesiones.Max(s => s.FechaHora);
            repeticiones.ForEach(r =>
            {
                DateTime fecha = sesiones.Where(s => s.FechaHora.DayOfWeek == (DayOfWeek)r.DiaSemana).Max(f => f.FechaHora).AddDays(r.Frecuencia);
                fecha = fecha.AddMinutes(-fecha.Minute);
                fecha = fecha.AddHours(-fecha.Hour);
                while (fecha < lastDay)
                {
                    fecha = fecha.AddDays(r.Frecuencia);
                }
                fechas.Add(fecha);
            });

            DateTime nextDay = fechas.Where(
                f => f > lastDay
                ).Min(f => f);

            var repeticion = repeticiones.FirstOrDefault(x => (DayOfWeek)x.DiaSemana == nextDay.DayOfWeek);

            nextDay = nextDay.AddHours(repeticion.Hora.Hour).AddMinutes(repeticion.Hora.Minute);

            for (int p = 0; p < repeticion.Modulos; p++)
            {
                Sesion newSesion = new Sesion
                {
                    FechaHora = nextDay,
                    ConsultorioID = repeticion.ConsultorioID
                };
                nextDay = nextDay.AddMinutes(30);
                newSesiones.Add(newSesion);
            }
            return newSesiones;

        }

        public Turno ReservarSesiones(Turno turno)
        {
            int cantidadSesionesAsignadas = turno.Sesions.Max(x => x.Numero);
            turno.Estado = (short)EstadoTurno.Reservado;

            turno.Turno_Repeticiones = LogicaTurnoRepeticiones(turno.Sesions.ToList()).ToList();

            turno.Turno_Repeticiones.ToList().ForEach(r =>
                {
                    r.UsuarioModificacion = turno.UsuarioModificacion;
                    r.FechaModificacion = turno.FechaModificacion;
                });

            if (turno.CantidadSesiones > cantidadSesionesAsignadas)
            {

                var diasSemana = turno.Sesions
                    .GroupBy(x => new { x.FechaHora.DayOfWeek, x.Numero })
                    .Select(x => x.Key)
                    .OrderBy(x => x.Numero);

                for (int nroSesion = cantidadSesionesAsignadas + 1; nroSesion <= turno.CantidadSesiones; nroSesion++)
                {
                    getNextDay(turno.Sesions.ToList(), turno.Turno_Repeticiones.ToList())
                        .ForEach(s =>
                        {
                            s.AgendaID = turno.Sesions.ToList()[0].AgendaID;
                            s.Estado = (short)EstadoSesion.Reservado;
                            s.Habilitado = true;
                            s.Numero = (short)nroSesion;
                            s.TurnoID = 0;
                            s.TurnoSimultaneo = 0;
                            turno.Sesions.Add(s);
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
                            .Max(x => x.TipoSesionID);

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
            turno.Sesions.Where(x => x.TurnoSimultaneo == 0).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
            turno = unitOfWork.RepoTurno.Add(turno);


            return turno;
        }

        //public Turno ReservarSesiones(Turno turno)
        //{
        //    int cantidadSesionesAsignadas = turno.Sesions.Max(x => x.Numero);
        //    turno.Estado = (short)EstadoTurno.Reservado;

        //    turno.Turno_Repeticiones = LogicaTurnoRepeticiones(turno.Sesions.ToList()).ToList();

        //    turno.Turno_Repeticiones.ToList().ForEach(r =>
        //    {
        //        r.UsuarioModificacion = turno.UsuarioModificacion;
        //        r.FechaModificacion = turno.FechaModificacion;
        //    });

        //    if (turno.CantidadSesiones > cantidadSesionesAsignadas)
        //    {

        //        var diasSemana = turno.Sesions
        //            .GroupBy(x => new { x.FechaHora.DayOfWeek, x.Numero })
        //            .Select(x => x.Key)
        //            .OrderBy(x => x.Numero);


        //        for (int nroSesion = cantidadSesionesAsignadas + 1; nroSesion <= turno.CantidadSesiones; nroSesion++)
        //        {
        //            DateTime ultimaSesion = turno.Sesions.Max(x => x.FechaHora);
        //            short posicion = (short)((nroSesion - 1) % cantidadSesionesAsignadas + 1);
        //            var oldSesiones = turno.Sesions
        //                .Where(x => x.Numero == posicion).ToList();

        //            do
        //            {
        //                ultimaSesion = ultimaSesion.AddDays(1);
        //            } while (ultimaSesion.DayOfWeek != oldSesiones[0].FechaHora.DayOfWeek);

        //            int cantidadDias = (int)(ultimaSesion.Date - oldSesiones[0].FechaHora.Date).TotalDays;
        //            oldSesiones.ToList().ForEach(s =>
        //            {
        //                Sesion sesion = new Sesion();
        //                sesion.AgendaID = s.AgendaID;
        //                sesion.ConsultorioID = s.ConsultorioID;
        //                sesion.Estado = s.Estado;
        //                sesion.FechaHora = s.FechaHora.AddDays(cantidadDias);
        //                sesion.Habilitado = s.Habilitado;
        //                sesion.Numero = (short)nroSesion;
        //                sesion.TurnoID = s.TurnoID;
        //                sesion.TurnoSimultaneo = s.TurnoSimultaneo;
        //                turno.Sesions.Add(sesion);
        //            });
        //        }

        //    }

        //    var sesiones = turno.Sesions
        //        .GroupBy(x => x.Numero)
        //        .Select(x => x.Key)
        //        .OrderBy(x => x);


        //    turno.Sesions.ToList().ForEach(s =>
        //    {
        //        s.UsuarioModificacion = turno.UsuarioModificacion;
        //        s.FechaModificacion = turno.FechaModificacion;
        //        s.Estado = (short)EstadoSesion.Reservado;
        //    });

        //    //CantidadSesiones


        //    //Valido sesiones y establezco sin fecha libre a las que dan error
        //    var consultorios = unitOfWork.RepoConsultorio.GetAll();
        //    sesiones.ToList().ForEach(se =>
        //    {
        //        DateTime beginDate = turno.Sesions.Where(x => x.Numero == (short)se).Min(x => x.FechaHora);
        //        DateTime endDate = turno.Sesions.Where(x => x.Numero == (short)se).Max(x => x.FechaHora);
        //        int idconsultorio = turno.Sesions.Where(s => s.Numero == se).Max(s => s.ConsultorioID);
        //        short simultaneo = 0;

        //        int? tipoSesionId = consultorios.Where(x => x.ID == idconsultorio)
        //                    .Max(x => x.TipoSesionID);

        //        idconsultorio = 0;
        //        consultorios.Where(x => x.TipoSesionID == tipoSesionId).ToList()
        //            .ForEach(x =>
        //            {
        //                if (idconsultorio == 0)
        //                {
        //                    simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, x.ID);
        //                    if (simultaneo > 0)
        //                    {
        //                        idconsultorio = simultaneo > 0 ? x.ID : 0;
        //                        turno.Sesions.Where(tu => tu.Numero == se).ToList()
        //                            .ForEach(tu =>
        //                            {
        //                                tu.TurnoSimultaneo = simultaneo;
        //                                tu.ConsultorioID = idconsultorio;
        //                            });
        //                    }

        //                }
        //            });

        //        if (!ValidarNuevasSesiones(turno.Sesions.Where(x => x.Numero == (short)se).ToList()))
        //        {
        //            turno.Sesions.Where(x => x.Numero == (short)se).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
        //        }
        //    });

        //    turno = unitOfWork.RepoTurno.Add(turno);


        //    return turno;
        //}

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
            turno.Turno_Repeticiones.ToList()
                .ForEach(repeticion => unitOfWork.RepoTurnoRepeticiones.Delete(repeticion));
            turno.Sesions = null;
            turno.Turno_Repeticiones = null;
            unitOfWork.RepoTurno.Delete(turno);
        }


        #endregion

        #region Turno
        public Turno GetTurno(int id)
        {
            return this.unitOfWork.RepoTurno.Find(id);
        }

        public Turno AsignarPacienteTurno(Turno turno)
        {
            var oldTurno = this.unitOfWork.RepoTurno.Find(turno.ID);
            if (oldTurno.PacienteID.HasValue && oldTurno.PacienteID > 0)
            {
                throw new Exception("La reserva ya fue asignada a " + oldTurno.Paciente.Nombre + " " + oldTurno.Paciente.Apellido);
            }
            unitOfWork.RepoTurno.Edit(turno);
            return turno;
        }

        public Turno ConfirmarTurno(Turno turno)
        {
            var oldTurno = GetTurno(turno.ID);
            oldTurno.UsuarioModificacion = turno.UsuarioModificacion;
            oldTurno.FechaModificacion = turno.FechaModificacion;
            oldTurno.Estado = (short)EstadoTurno.Confirmado;
            oldTurno.Sesions
                .Where(x => (EstadoSesion)x.Estado == EstadoSesion.Reservado || (EstadoSesion)x.Estado == EstadoSesion.Bloqueado)
                .ToList().ForEach(x =>
                {
                    x.Estado = (short)EstadoSesion.Confirmado;
                    x.UsuarioModificacion = oldTurno.UsuarioModificacion;
                    x.FechaModificacion = oldTurno.FechaModificacion;
                    unitOfWork.RepoSesion.Edit(x);
                });
            unitOfWork.RepoTurno.Edit(oldTurno);
            return oldTurno;
        }

        public void EditDiagnosticoTurno(Turno turno)
        {
            unitOfWork.RepoTurno.Edit(turno);
        }

        public Turno AgregarSesiones(Turno turno, bool continuar)
        {            
            var oldTurno = unitOfWork.RepoTurno.Find(turno.ID);
            List<Sesion> newSesiones = new List<Sesion>();
            if (continuar)
            {
                for (int nroSesion = oldTurno.CantidadSesiones.Value + 1; nroSesion <= turno.CantidadSesiones; nroSesion++)
                {
                    getNextDay(oldTurno.Sesions.ToList(), oldTurno.Turno_Repeticiones.ToList())
                        .ForEach(s =>
                        {
                            s.AgendaID = oldTurno.Sesions.ToList()[0].AgendaID;
                            s.Estado = (EstadoTurno)oldTurno.Estado == EstadoTurno.Reservado? (short)EstadoSesion.Reservado: (short)EstadoSesion.Confirmado;
                            s.Habilitado = true;
                            s.Numero = (short)nroSesion;
                            s.TurnoID = oldTurno.ID;
                            s.TurnoSimultaneo = 0;
                            s.UsuarioModificacion = turno.UsuarioModificacion;
                            s.FechaModificacion = turno.FechaModificacion;
                            oldTurno.Sesions.Add(s);
                        });
                }
            }
            var consultorios = unitOfWork.RepoConsultorio.GetAll();
            var sesiones = oldTurno.Sesions
                .Where(x=>x.ID==0)
                .GroupBy(x => x.Numero)
                .Select(x => x.Key)
                .OrderBy(x => x);
            sesiones.ToList().ForEach(se =>
            {
                DateTime beginDate = oldTurno.Sesions.Where(x => x.Numero == (short)se).Min(x => x.FechaHora);
                DateTime endDate = oldTurno.Sesions.Where(x => x.Numero == (short)se).Max(x => x.FechaHora);
                int idconsultorio = oldTurno.Sesions.Where(s => s.Numero == se).Max(s => s.ConsultorioID);
                short simultaneo = 0;

                int? tipoSesionId = consultorios.Where(x => x.ID == idconsultorio)
                            .Max(x => x.TipoSesionID);

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
                                oldTurno.Sesions.Where(tu => tu.Numero == se).ToList()
                                    .ForEach(tu =>
                                    {
                                        tu.TurnoSimultaneo = simultaneo;
                                        tu.ConsultorioID = idconsultorio;
                                    });
                            }

                        }
                    });

                if (!ValidarNuevasSesiones(oldTurno.Sesions.Where(x => x.Numero == (short)se).ToList()))
                {
                    oldTurno.Sesions.Where(x => x.Numero == (short)se).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                }

            });

            oldTurno.Sesions.Where(x => x.TurnoSimultaneo == 0).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
            oldTurno.Sesions.Where(x => x.ID == 0).ToList().ForEach(s =>
            {
                unitOfWork.RepoSesion.Add(s);
            });
            unitOfWork.RepoTurno.Edit(turno);
            

            return turno;
        }
        #endregion


    }
}
