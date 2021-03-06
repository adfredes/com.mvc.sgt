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

        #region Feriados

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
            var fecha = DateTime.Now.AddDays(-1);
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

        void IAgendaService.EditAgenda(Agendum entity)
        {
            unitOfWork.RepoAgenda.Edit(entity);
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
        public Agenda_Receso GetReceso(int id)
        {
            return unitOfWork.RepoAgendaReceso.Find(id);
        }

        public void AddReceso(Agenda_Receso entity)
        {
            entity.AgendaId = 1;
            unitOfWork.RepoAgendaReceso.Add(entity);
        }

        public void EditReceso(Agenda_Receso entity)
        {
            entity.AgendaId = 1;
            unitOfWork.RepoAgendaReceso.Edit(entity);
        }

        public void DelReceso(int id)
        {
            DelReceso(GetReceso(id));
        }

        public void DelReceso(Agenda_Receso entity)
        {
            unitOfWork.RepoAgendaReceso.Delete(entity);
        }

        #endregion

        #region Bloqueos
        public void AddBloqueoAgenda(Agenda_Bloqueos entity)
        {
            entity.AgendaId = 1;

            /*int turnoSimultaneo = entity.TurnoSimultaneo == 0 ? 1 : entity.TurnoSimultaneo; ;
            int turnoSimultaneoHasta = entity.TurnoSimultaneo == 0 ? 
                unitOfWork.RepoConsultorio.Find(entity.ConsultorioId).TurnosSimultaneos : 
                entity.TurnoSimultaneo;
                for (int s = turnoSimultaneo; s <= turnoSimultaneoHasta; s++)
                {

                }*/
            if(entity.ConsultorioId == 0)
            {
                var consultorios = unitOfWork.RepoConsultorio.GetAll();
                consultorios.ToList().ForEach(consultorio =>
                {
                    entity.ConsultorioId = consultorio.ID;
                    addBloqueoAgendaSesion(entity);
                });
                entity.ConsultorioId = 0;
            }
            else
            {
                addBloqueoAgendaSesion(entity);
            }
            

            unitOfWork.RepoAgendaBloqueos.Add(entity);
        }

        private List<bool> parseBloqueosDiaSemana(Agenda_Bloqueos entity)
        {
            if(entity.bDomingo.Value == false &&
                entity.bLunes.Value == false &&
                entity.bMartes.Value == false &&
                entity.bMiercoles.Value == false &&
                entity.bJueves.Value == false &&
                entity.bViernes.Value == false &&
                entity.bSabado.Value == false)
            {
                return new List<bool> {
                    true,
                    true,
                    true,
                    true,
                    true,
                    true,
                    true
                };
            }
            else
            {
                return new List<bool> {
                    entity.bDomingo.Value,
                    entity.bLunes.Value,
                    entity.bMartes.Value,
                    entity.bMiercoles.Value,
                    entity.bJueves.Value,
                    entity.bViernes.Value,
                    entity.bSabado.Value
                };
            }
            
        }
        private void addBloqueoAgendaSesion(Agenda_Bloqueos entity)
        {
            short ts = entity.TurnoSimultaneo > 0 ? entity.TurnoSimultaneo : (short)1;
            short tfs = entity.TurnoSimultaneo > 0 ? entity.TurnoSimultaneo : unitOfWork.RepoConsultorio.Find(entity.ConsultorioId).TurnosSimultaneos;
            
            var diasSemana = parseBloqueosDiaSemana(entity);
            
            for (DateTime desde = entity.FechaDesde; desde <= entity.FechaHasta; desde = desde.AddDays(1))
            {
                if (diasSemana[(int) desde.DayOfWeek])
                {
                    var agenda = unitOfWork.RepoAgenda.Find(1);
                    if (entity.TodoElDia.HasValue && entity.TodoElDia.Value)
                    {
                        entity.HoraDesde = agenda.HoraDesde;
                        entity.HoraHasta = agenda.HoraHasta.AddMinutes(agenda.Frecuencia);
                    }
                    for (DateTime horadesde = entity.HoraDesde.Value; horadesde < entity.HoraHasta.Value; horadesde = horadesde.AddMinutes(agenda.Frecuencia))
                    {
                        for (short tsimultaneo = ts; tsimultaneo <= tfs; tsimultaneo++)
                        {


                            try
                            {
                                Sesion sesion = new Sesion
                                {
                                    AgendaID = entity.AgendaId,
                                    ConsultorioID = entity.ConsultorioId,
                                    Habilitado = true,
                                    Numero = 1,
                                    TurnoSimultaneo = tsimultaneo,
                                    FechaHora = desde.AddHours(horadesde.Hour).AddMinutes(horadesde.Minute),
                                };
                                ICollection<Sesion> sesiones = new List<Sesion>();
                                sesiones.Add(sesion);

                                Turno turno = new Turno
                                {
                                    CantidadSesiones = 1,
                                    Fecha = DateTime.Now,
                                    FechaModificacion = DateTime.Now,
                                    UsuarioModificacion = "sistema",
                                    Sesions = sesiones
                                };
                                BloquearSesion(turno);

                            }

                            catch
                            {

                            }
                        }
                    }
                }                
            }
        }

        public void EditBloqueoAgenda(Agenda_Bloqueos entity)
        {            
            var bloqueo = unitOfWork.RepoAgendaBloqueos.Find(entity.ID);
            var agenda = unitOfWork.RepoAgenda.Find(1);
            var diasSemana = parseBloqueosDiaSemana(bloqueo);
            DateTime desde;
            DateTime hasta;
            if (bloqueo.TodoElDia.HasValue && bloqueo.TodoElDia.Value)
            {
                desde = bloqueo.FechaDesde.AddHours(agenda.HoraDesde.Hour).AddMinutes(agenda.HoraDesde.Minute);
                hasta = bloqueo.FechaHasta.AddHours(agenda.HoraHasta.Hour).AddMinutes(agenda.HoraHasta.Minute);
                hasta = hasta.AddMinutes(30);
            }
            else
            {
                desde = bloqueo.FechaDesde.AddHours(bloqueo.HoraDesde.Value.Hour).AddMinutes(bloqueo.HoraDesde.Value.Minute);
                hasta = bloqueo.FechaHasta.AddHours(bloqueo.HoraHasta.Value.Hour).AddMinutes(bloqueo.HoraHasta.Value.Minute);
            }
            var sesiones = unitOfWork.RepoSesion.FindBy(
                x => x.Estado == (short)EstadoSesion.Bloqueado
                    && desde <= x.FechaHora && hasta > x.FechaHora                    
                ).ToList();
            if(entity.ConsultorioId != 0)
            {
                sesiones = sesiones.Where(s => s.ConsultorioID == entity.ConsultorioId).ToList();
            }
            sesiones.ForEach(s =>
            {
                if (diasSemana[(int)s.FechaHora.DayOfWeek])
                {
                    s.Estado = (short)EstadoSesion.Cancelado;
                    unitOfWork.RepoSesion.Edit(s);
                }
                    
            });
            entity.AgendaId = 1;
            if (entity.Habilitado)
            {
                if (entity.ConsultorioId == 0)
                {
                    var consultorios = unitOfWork.RepoConsultorio.GetAll();
                    consultorios.ToList().ForEach(consultorio =>
                    {
                        entity.ConsultorioId = consultorio.ID;
                        addBloqueoAgendaSesion(entity);
                    });
                    entity.ConsultorioId = 0;
                }
                else
                {
                    addBloqueoAgendaSesion(entity);
                }
            }
            unitOfWork.RepoAgendaBloqueos.Edit(entity);
        }

        //public ICollection<Agenda_Bloqueos> SearchBloqueos(DateTime desde, DateTime hasta)
        //{

        //    var recesos = unitOfWork.RepoAgendaBloqueos
        //        .FindBy(x =>
        //        DbFunctions.TruncateTime(desde) <= DbFunctions.TruncateTime(x.FechaHasta)
        //        && DbFunctions.TruncateTime(hasta) >= DbFunctions.TruncateTime(x.FechaDesde)
        //        && x.Habilitado
        //        ).ToList();
        //    return recesos;

        //}

        public bool isBlocked(DateTime desde, DateTime hasta, int consultorioID, int turnoSimultaneo)
        {
            bool resu = false;
            //var recesos = unitOfWork.RepoAgendaBloqueos
            //    .FindBy(x =>
            //        DbFunctions.TruncateTime(desde) <= DbFunctions.TruncateTime(x.FechaHasta)
            //        && DbFunctions.TruncateTime(hasta) >= DbFunctions.TruncateTime(x.FechaDesde)
            //        && x.Habilitado && consultorioID == x.ConsultorioId &&
            //        (turnoSimultaneo == x.TurnoSimultaneo || x.TurnoSimultaneo == 0)
            //    ).ToList();


            //recesos.ForEach(receso =>
            //{
            //    if (receso.TodoElDia.HasValue || (
            //    desde.TimeOfDay < receso.HoraHasta.Value.TimeOfDay &&
            //    hasta.TimeOfDay >= receso.HoraDesde.Value.TimeOfDay))
            //    {
            //        resu = true;
            //    }

            //});
            return resu;
        }

        //modificado
        public bool isDobleOrdenExist(DateTime desde, DateTime hasta)
        {
            var recesos = unitOfWork.RepoSesion
                .FindBy(x =>
                    desde <= x.FechaHora
                    && hasta >= x.FechaHora
                    && x.Habilitado &&
                    EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado)
                    && x.Turno.TurnoDoble > 0
                ).ToList();

            return recesos.Count() > 0;
        }
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
                    oldRepeticion.Frecuencia = oldRepeticion.Frecuencia == 0 ? (int)(s.FechaHora - oldRepeticion.Hora.AddHours(-oldRepeticion.Hora.Hour)).TotalDays
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
                DateTime fecha = sesiones.Where(s => s.FechaHora.DayOfWeek == (DayOfWeek)r.DiaSemana)
               .Select(f => f.FechaHora)
               .DefaultIfEmpty()
               .Max();
                fecha = r.Hora > fecha ? r.Hora : fecha;
                fecha = fecha.AddMinutes(-fecha.Minute);
                fecha = fecha.AddHours(-fecha.Hour);
                while (fecha < lastDay
                    || SearchFeriado(fecha, fecha).Count > 0
                    || SearchRecesos(fecha, fecha).Count > 0
                )
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
            var consultorios = unitOfWork.RepoConsultorio.GetAll().ToList();
            turno.Estado = (short)EstadoTurno.Reservado;

            var tiposSesiones = turno.Sesions
                .Select(x => consultorios.FirstOrDefault(c => c.ID == x.ConsultorioID).TipoSesionID)
                .Distinct();

            if (tiposSesiones.Count() == 1)
            {
                turno.TipoSesionID = tiposSesiones.FirstOrDefault();
            }
            else
            {

                turno.TipoSesionID = tiposSesiones.Where(x => x.Value == 2).ToList().Count() > 0 ? 2 : tiposSesiones.Min();
            }

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

                //modificado
                if (!ValidarNuevasSesiones(turno.Sesions.Where(x => x.Numero == (short)se).ToList(), turno.TurnoDoble.HasValue))
                {
                    turno.Sesions.Where(x => x.Numero == (short)se).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                }

            });
            turno.Sesions.Where(x => x.TurnoSimultaneo == 0).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
            turno = unitOfWork.RepoTurno.Add(turno);


            return turno;
        }

        public Turno ReservarSesiones(Turno turno, List<int> sobreturnos = null)
        {
            int cantidadSesionesAsignadas = turno.Sesions.Max(x => x.Numero);
            var consultorios = unitOfWork.RepoConsultorio.GetAll().ToList();
            turno.Estado = (short)EstadoTurno.Reservado;

            var tiposSesiones = turno.Sesions
                .Select(x => consultorios.FirstOrDefault(c => c.ID == x.ConsultorioID).TipoSesionID)
                .Distinct();

            if (tiposSesiones.Count() == 1)
            {
                turno.TipoSesionID = tiposSesiones.FirstOrDefault();
            }
            else
            {
                turno.TipoSesionID = tiposSesiones.Where(x => x.Value == 2).ToList().Count() > 0 ? 2 : tiposSesiones.Min();
            }

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

            sesiones.ToList().ForEach(se =>
            {
                if (sobreturnos == null || !sobreturnos.Contains(se))
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

                    //modificado
                    if (!ValidarNuevasSesiones(turno.Sesions.Where(x => x.Numero == (short)se).ToList(), turno.TurnoDoble.HasValue))
                    {
                        turno.Sesions.Where(x => x.Numero == (short)se).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                    }
                }
                else
                {
                    if (!ValidarNuevasSesiones(turno.Sesions.Where(x => x.Numero == (short)se).ToList(), turno.TurnoDoble.HasValue, true))
                    {
                        turno.Sesions.Where(x => x.Numero == (short)se).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                    }
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

        public bool ChangeNumeroAutorizacionturno(int turnoID, string numeroAutorizacion, string usuario)
        {
            var turno = unitOfWork.RepoTurno.Find(turnoID);
            
            DateTime fechaModificacion = DateTime.Now;

            turno.FechaModificacion = fechaModificacion;
            turno.UsuarioModificacion = usuario;
            turno.NumeroAutorizacion = numeroAutorizacion;
            unitOfWork.RepoTurno.Edit(turno);            
            return true;
        }

        public Turno ConfirmarTurno(Turno turno, bool continuar, int? turnoID)
        {
            Turno oldTurno = GetTurno(turno.ID);
            var sesiones = oldTurno.Sesions.ToList();
            Turno saveTurno;

            if (continuar)
            {

                var lastTurno = GetTurno(turnoID.Value);
                //    unitOfWork.RepoTurno.FindBy(t => t.PacienteID == turno.PacienteID
                //&& (EstadoTurno)t.Estado == EstadoTurno.Confirmado
                ////&& t.TipoSesionID == turno.TipoSesionID
                //)
                //.OrderByDescending(t =>
                //t.Sesions.Where(
                //        s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)).Max(s => s.FechaHora)
                //    )
                //.Take(1).FirstOrDefault();

                if (lastTurno != null)
                {
                    lastTurno.CantidadSesiones = lastTurno.Sesions.Max(s => s.Numero) + oldTurno.CantidadSesiones;

                    //oldTurno.CantidadSesiones = lastTurno.CantidadSesiones;

                    saveTurno = lastTurno;

                    oldTurno.UsuarioModificacion = turno.UsuarioModificacion;
                    oldTurno.FechaModificacion = turno.FechaModificacion;
                    oldTurno.Estado = (short)EstadoTurno.Cancelado;
                    oldTurno.Paciente = null;
                    oldTurno.PacienteID = null;
                    oldTurno.Habilitado = false;
                    unitOfWork.RepoTurno.Edit(oldTurno);
                }
                else
                {
                    saveTurno = oldTurno;
                }

            }
            else
            {
                saveTurno = oldTurno;
            }

            saveTurno.UsuarioModificacion = turno.UsuarioModificacion;
            saveTurno.FechaModificacion = turno.FechaModificacion;
            saveTurno.Estado = (short)EstadoTurno.Confirmado;

            sesiones.ForEach(x =>
            {
                x.Estado = (EstadoSesion)x.Estado == EstadoSesion.Reservado ||
                (EstadoSesion)x.Estado == EstadoSesion.Bloqueado ?
                (short)EstadoSesion.Confirmado :
                x.Estado;
                x.Numero = continuar ? (short)(x.Numero + saveTurno.CantidadSesiones - oldTurno.CantidadSesiones) : x.Numero;
                x.TurnoID = saveTurno.ID;
                x.UsuarioModificacion = saveTurno.UsuarioModificacion;
                x.FechaModificacion = saveTurno.FechaModificacion;
                unitOfWork.RepoSesion.Edit(x);
            });


            unitOfWork.RepoTurno.Edit(saveTurno);
            saveTurno.Sesions = SortSesiones(saveTurno.ID);

            return saveTurno;
        }

        public void EditDiagnosticoTurno(Turno turno)
        {
            var oldTurno = GetTurno(turno.ID);
            oldTurno.TipoSesionID = turno.TipoSesionID;
            oldTurno.Diagnostico = turno.Diagnostico;
            oldTurno.CodigoPractica = turno.CodigoPractica;
            unitOfWork.RepoTurno.Edit(oldTurno);
        }

        public Turno AgregarSesiones(Turno turno, int cantidadSesiones, bool continuar)
        {
            var oldTurno = GetTurno(turno.ID);
            //modifico
            turno.TurnoDoble = oldTurno.TurnoDoble;
            List<Sesion> newSesiones = new List<Sesion>();
            oldTurno.CantidadSesiones = oldTurno.Sesions.Max(s => s.Numero);
            turno.CantidadSesiones = continuar ? oldTurno.CantidadSesiones + cantidadSesiones : cantidadSesiones;

            if (!continuar)
            {
                turno.ID = 0;
                //modifico
                turno.TurnoDoble = null;
                turno.Fecha = DateTime.Now;
                oldTurno.Turno_Repeticiones.ToList().ForEach(r =>
                {
                    turno.Turno_Repeticiones.Add(new Turno_Repeticiones
                    {
                        FechaModificacion = turno.FechaModificacion,
                        UsuarioModificacion = turno.UsuarioModificacion,
                        ConsultorioID = r.ConsultorioID,
                        DiaSemana = r.DiaSemana,
                        Frecuencia = r.Frecuencia,
                        Hora = r.Hora,
                        Modulos = r.Modulos,
                        Posicion = r.Posicion
                    });
                });
            }

            for (int nroSesion = continuar ? oldTurno.CantidadSesiones.Value + 1 : 1; nroSesion <= turno.CantidadSesiones; nroSesion++)
            {
                getNextDay(oldTurno.Sesions.ToList(), oldTurno.Turno_Repeticiones.ToList())
                    .ForEach(s =>
                    {
                        s.AgendaID = oldTurno.Sesions.ToList()[0].AgendaID;
                        s.Estado = (EstadoTurno)oldTurno.Estado == EstadoTurno.Reservado ? (short)EstadoSesion.Reservado : (short)EstadoSesion.Confirmado;
                        s.Habilitado = true;
                        s.Numero = (short)nroSesion;
                        s.TurnoID = turno.ID;
                        s.TurnoSimultaneo = 0;
                        s.UsuarioModificacion = turno.UsuarioModificacion;
                        s.FechaModificacion = turno.FechaModificacion;
                        newSesiones.Add(s);
                        oldTurno.Sesions.Add(s);
                    });
            }


            turno.Sesions = newSesiones;


            var consultorios = unitOfWork.RepoConsultorio.GetAll();
            var sesiones = turno.Sesions
                .GroupBy(x => x.Numero)
                .Select(x => x.Key)
                .OrderBy(x => x);

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

                if (!ValidarNuevasSesiones(turno.Sesions.Where(x => x.Numero == (short)se).ToList(), turno.TurnoDoble.HasValue))
                {
                    turno.Sesions.Where(x => x.Numero == (short)se).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                }

            });

            turno.Sesions.Where(x => x.TurnoSimultaneo == 0).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
            if (continuar)
            {
                //modificado
                //if (turno.TurnoDoble.HasValue && turno.TurnoDoble.Value > 0)
                //{
                //    turno.Sesions.ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                //}

                turno.Sesions.Where(x => x.ID == 0).ToList().ForEach(s =>
                {
                    unitOfWork.RepoSesion.Add(s);
                });
                unitOfWork.RepoTurno.Edit(turno);
                SortSesiones(turno.ID);
                CalcNroSesiones(turno.ID);
            }
            else
            {
                unitOfWork.RepoTurno.Add(turno);
            }
            turno.Sesions = oldTurno.Sesions.Concat(turno.Sesions).ToList();
            return turno;
        }



        public Turno CancelarTurno(Turno turno)
        {
            turno.Sesions = unitOfWork.RepoTurno.Find(turno.ID).Sesions;
            turno.Estado = (short)EstadoTurno.Cancelado;
            turno = CancelarSesionesPendientes(turno);
            unitOfWork.RepoTurno.Edit(turno);
            return turno;
        }


        public List<Turno> GetTurnosSinFecha()
        {
            DateTime fecha = DateTime.Now.AddDays(-30);
            var sesiones = unitOfWork.RepoSesion.FindBy(s => (EstadoSesion)s.Estado == EstadoSesion.SinFechaLibre
            && s.FechaHora > fecha)
                .Select(s => s.TurnoID).Distinct().ToList();

            return unitOfWork.RepoTurno.FindBy(x =>
                sesiones.Contains(x.ID) && x.PacienteID.HasValue && (EstadoTurno)x.Estado != EstadoTurno.Cancelado
            )
                .Distinct()
                .OrderBy(t => t.Paciente.Apellido)
                .ThenBy(t => t.Paciente.Nombre).ToList();
        }

        public List<int> GetNrosTurnosSinDobleOrden(int pacienteID)
        {
            var turnos = unitOfWork.RepoTurno.FindBy(t => t.PacienteID == pacienteID && t.TurnoDoble.HasValue == false && t.Estado == (short)EstadoTurno.Confirmado)
                .OrderByDescending(x => x.ID);
            List<int> listaTurnos = new List<int>();
            turnos.ToList().ForEach(t => listaTurnos.Add(t.ID));
            return listaTurnos;
        }

        public Turno SetTurnoDobleOrden(Turno turno, int? idTurno)
        {
            //var turnoAnular = unitOfWork.RepoTurno.FindBy(t => t.TurnoDoble == turno.ID).FirstOrDefault();
            //if(turnoAnular != null)
            //{
            //    turnoAnular.TurnoDoble = null;
            //    unitOfWork.RepoTurno.Edit(turnoAnular);
            //}            

            if (idTurno.HasValue && idTurno.Value > 0)
            {
                turno.TurnoDoble = 1;
            }
            else
            {
                turno.TurnoDoble = null;
            }
            unitOfWork.RepoTurno.Edit(turno);

            //if (idTurno.HasValue)
            //{
            //    var turnoD = unitOfWork.RepoTurno.Find(idTurno.Value);
            //    turnoD.TurnoDoble = turno.ID;
            //    unitOfWork.RepoTurno.Edit(turnoD);
            //}


            return turno;
        }

        public IQueryable<Turno> GetTurnos()
        {
            return unitOfWork.RepoTurno.GetAll().Include(t => t.Sesions);
        }

        public void EditTurno(Turno turno)
        {
            turno.Turno_Repeticiones.ToList().ForEach(r =>
            {
                unitOfWork.RepoTurnoRepeticiones.Add(r);
            });
        }

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

        public Sesion SetSesionEsDoble(int sesionID, bool esDoble)
        {
            //return ChangeStateSesion(sesionID, (short)EstadoSesion.Cancelado, usuario);
            var sesiones = SearchSesion(sesionID);
            sesiones.ToList().ForEach(s =>
            {
                s.FueDobleOrden = esDoble;
                unitOfWork.RepoSesion.Edit(s);
            });
            return sesiones.FirstOrDefault();
        }

        public Sesion SetSesionCancelada(int sesionID, string usuario)
        {
            return ChangeStateSesion(sesionID, (short)EstadoSesion.Cancelado, usuario);
        }



        public Sesion SetSesionAnulada(int sesionID, string usuario) =>
            ChangeStateSesion(sesionID, (short)EstadoSesion.Anulado, usuario, false);

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


        private Sesion ChangeStateSesion(int sesionID, short estado, string usuario, bool hab = true)
        {
            //Sesion rSesion = null;
            ICollection<Sesion> sesiones = SearchSesion(sesionID);

            short nroSesion = sesiones.FirstOrDefault().Numero;
            int turnoID = sesiones.FirstOrDefault().TurnoID;
            DateTime fechaModificacion = DateTime.Now;
            foreach (Sesion sesion in sesiones)
            {
                sesion.FechaModificacion = fechaModificacion;
                sesion.UsuarioModificacion = usuario;
                sesion.Estado = estado;
                sesion.Habilitado = hab;
                sesion.Numero = (EstadoSesion)estado == EstadoSesion.Cancelado ? (short)0 : sesion.Numero;
                unitOfWork.RepoSesion.Edit(sesion);
            }

            if (EstadoSesion.Cancelado == (EstadoSesion)estado)
            {
                sesiones = unitOfWork.RepoSesion.FindBy(x => x.Numero == nroSesion && x.TurnoID == turnoID).ToList();
                foreach (Sesion sesion in sesiones)
                {
                    sesion.FechaModificacion = fechaModificacion;
                    sesion.UsuarioModificacion = usuario;
                    sesion.Estado = (short)EstadoSesion.Anulado;
                    sesion.Habilitado = false;
                    sesion.Numero = 0;
                    unitOfWork.RepoSesion.Edit(sesion);
                }
                SortSesiones(turnoID);
                CalcNroSesiones(turnoID);
            }

            return unitOfWork.RepoSesion.Find(sesionID);

        }


        public bool ChangeCodigoTransaccionSesion(int sesionID, string codigoTransaccion, string usuario)
        {
            //Sesion rSesion = null;
            ICollection<Sesion> sesiones = SearchSesion(sesionID);

            short nroSesion = sesiones.FirstOrDefault().Numero;
            int turnoID = sesiones.FirstOrDefault().TurnoID;
            DateTime fechaModificacion = DateTime.Now;
            foreach (Sesion sesion in sesiones)
            {
                sesion.FechaModificacion = fechaModificacion;
                sesion.UsuarioModificacion = usuario;
                sesion.CodigoTransaccion = codigoTransaccion;                
                unitOfWork.RepoSesion.Edit(sesion);
            }
            return true;
        }




        private short SearchTurnosSimultaneoByDate(DateTime begin, DateTime end, int consultorioID)
        {
            var consultorio = unitOfWork.RepoConsultorio.Find(consultorioID);
            int cantidad = consultorio.TurnosSimultaneos;
            short simultaneo = 0;
            for (short t = 1; t <= cantidad; t++)
            {
                if (SearchSesionByDateAndConsultorio(begin, end, consultorioID, t).Count == 0
                    && !isBlocked(begin, end, consultorioID, t))
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

        private ICollection<Sesion> SortSesiones(int turnoID)
        {
            var sesiones = unitOfWork.RepoSesion.FindBy(x => x.TurnoID == turnoID);
            return SortSesiones(sesiones.ToList());
        }

        private Turno CalcNroSesiones(int id)
        {
            var turno = unitOfWork.RepoTurno.Find(id);
            turno.CantidadSesiones = turno.Sesions.Max(x => x.Numero);
            unitOfWork.RepoTurno.Edit(turno);
            return turno;
        }

        private ICollection<Sesion> SortSesiones(ICollection<Sesion> sesiones)
        {
            var sortSesiones = sesiones
                .Where(x => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado)
                    || EstadoSesion.SinFechaLibre == (EstadoSesion)x.Estado)
                .OrderBy(x => x.FechaHora);


            var sesionesCancelada = sesiones.Where(x => (EstadoSesion.Cancelado == (EstadoSesion)x.Estado && x.Numero != 0))
                    .ToList();

            sesionesCancelada.ForEach(s =>
            {
                sesiones.Where(x => x.Numero == s.Numero)
                .ToList().ForEach(x =>
                {
                    x.Numero = 0;
                    if (EstadoSesion.Cancelado != (EstadoSesion)x.Estado)
                    {
                        x.Estado = (short)EstadoSesion.Anulado;
                        x.Habilitado = false;
                    }
                });
            });

            List<short> order = new List<short>();
            short prevNum = 0;


            sortSesiones.ToList().ForEach(s =>
            {
                if (prevNum != s.Numero)
                {
                    order.Add(s.Numero);
                    prevNum = s.Numero;
                }
            });

            for (short num = 1; num <= order.Count; num++)
            {
                sesiones.Where(x => x.Numero == order[num - 1])
                    .ToList()
                    .ForEach(s =>
                    {
                        s.Numero = (short)(num * -1);
                    });
            }

            sesiones.ToList()
                   .ForEach(s =>
                   {
                       s.Numero = (short)(s.Numero * -1);
                       unitOfWork.RepoSesion.Edit(s);
                   });




            return sesiones;
        }

        //private ICollection<Sesion> CambiarFechaSesion(ICollection<Sesion> sesiones, bool sobreturno)
        //{
        //    var turno = unitOfWork.RepoTurno.Find(sesiones.FirstOrDefault().TurnoID);
        //    var sesionesViejasID = sesiones.Where(x => x.ID > 0).Select(x => x.ID).ToList();

        //    if (turno.Sesions.Where(x => EstadoSesionCondicion.Libre.Contains((EstadoSesion)x.Estado) && EstadoSesion.SinFechaLibre != (EstadoSesion)x.Estado && sesionesViejasID.Contains(x.ID)).ToList().Count() > 0)
        //    {
        //        throw new Exception("Los datos de la sesion no se encuentran actualizados.");
        //    }



        //    var estadoTurno = turno.Estado;
        //    var sesionesNuevas = sesiones.Where(x => x.ID == 0).ToList();
        //    if (!sobreturno)
        //    {
        //        DateTime beginDate = sesiones.Where(x => x.ID == 0).Min(x => x.FechaHora);
        //        DateTime endDate = sesiones.Where(x => x.ID == 0).Max(x => x.FechaHora);
        //        short simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, sesionesNuevas.FirstOrDefault().ConsultorioID);

        //        if (simultaneo == 0)
        //        {
        //            throw new Exception("Existen sesiones ya asignadas a su seleccion.");
        //        }
        //        else
        //        {
        //            sesionesNuevas.ForEach(_s =>
        //            {
        //                _s.TurnoSimultaneo = (short)simultaneo;
        //                _s.Estado = (EstadoTurno)estadoTurno == EstadoTurno.Reservado ? (short)EstadoSesion.Reservado : (short)EstadoSesion.Confirmado;
        //            });
        //        }
        //    }
        //    //cambio
        //    if (ValidarNuevasSesiones(sesionesNuevas, turno.TurnoDoble.HasValue, sobreturno))
        //    {
        //        sesiones.ToList().ForEach(s =>
        //        {
        //            if (s.ID > 0)
        //                unitOfWork.RepoSesion.Edit(s);
        //            else
        //                unitOfWork.RepoSesion.Add(s);
        //        });
        //        SortSesiones(sesiones.FirstOrDefault().TurnoID);
        //        //Usar using com.sgt.DataAccess.ExtensionMethod;                
        //    }
        //    else
        //    {
        //        if (turno.TurnoDoble.HasValue)
        //        {
        //            throw new Exception("Existen sesiones ya asignadas a su seleccion o existe un paciente con doble orden en el mismo horario.");
        //        }
        //        else
        //        {
        //            throw new Exception("Existen sesiones ya asignadas a su seleccion.");
        //        }
        //    }
        //    return sesiones;

        //}

        private ICollection<Sesion> CambiarFechaSesion(ICollection<Sesion> sesiones, bool sobreturno)
        {

            
            var turno = unitOfWork.RepoTurno.Find(sesiones.FirstOrDefault().TurnoID);
            var sesionesViejasID = sesiones.Where(x => x.ID > 0).Select(x => x.ID).ToList();

            if (turno.Sesions.Where(x => EstadoSesionCondicion.Libre.Contains((EstadoSesion)x.Estado) && EstadoSesion.SinFechaLibre != (EstadoSesion)x.Estado && sesionesViejasID.Contains(x.ID)).ToList().Count() > 0)
            {                
                throw new Exception("Los datos de la sesion no se encuentran actualizados.");                
            }



            var estadoTurno = turno.Estado;
            var sesionesNuevas = sesiones.Where(x => x.ID == 0).ToList();
            if (!sobreturno)
            {
                sesiones.Where(s => s.ID > 0).ToList().ForEach(s =>
                {
                    unitOfWork.RepoSesion.Edit(s);
                });

                DateTime beginDate = sesiones.Where(x => x.ID == 0).Min(x => x.FechaHora);
                DateTime endDate = sesiones.Where(x => x.ID == 0).Max(x => x.FechaHora);
                short simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, sesionesNuevas.FirstOrDefault().ConsultorioID);

                if (simultaneo == 0)
                {
                    sesiones.Where(s => s.ID > 0).ToList().ForEach(s =>
                    {
                        s.Estado = sesiones.Where(ss => ss.ID ==0).FirstOrDefault().Estado;
                        unitOfWork.RepoSesion.Edit(s);
                    });
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
            //cambio
            if (ValidarNuevasSesiones(sesionesNuevas, turno.TurnoDoble.HasValue, sobreturno))
            {
                sesiones.ToList().ForEach(s =>
                {
                    if (s.ID > 0)
                        unitOfWork.RepoSesion.Edit(s);
                    else
                        unitOfWork.RepoSesion.Add(s);
                });
                SortSesiones(sesiones.FirstOrDefault().TurnoID);
                //Usar using com.sgt.DataAccess.ExtensionMethod;                
            }
            else
            {
                if (!sobreturno)
                {
                    sesiones.Where(s => s.ID > 0).ToList().ForEach(s =>
                    {
                        s.Estado = sesiones.Where(ss => ss.ID == 0).FirstOrDefault().Estado;
                        unitOfWork.RepoSesion.Edit(s);
                    });
                }                
                if (turno.TurnoDoble.HasValue)
                {
                    throw new Exception("Existen sesiones ya asignadas a su seleccion o existe un paciente con doble orden en el mismo horario.");
                }
                else
                {
                    throw new Exception("Existen sesiones ya asignadas a su seleccion.");
                }
            }
            return sesiones;

        }

        public ICollection<Sesion> PosponerSesion(ICollection<Sesion> sesiones)
        {
            var sesionPospuesta = sesiones.FirstOrDefault();
            PosponerSesion(sesionPospuesta, sesionPospuesta.FechaHora, sesionPospuesta.UsuarioModificacion, sesionPospuesta.FechaModificacion);
            return sesiones;

        }


        private List<Sesion> getNextDay(DateTime fechaSemana, List<Sesion> sesiones, List<Turno_Repeticiones> repeticiones, int tipoSesion = 0)
        {
            List<DateTime> fechas = new List<DateTime>();
            List<Sesion> newSesiones = new List<Sesion>();

            sesiones = sesiones
                .Where(s => (EstadoSesion)s.Estado == EstadoSesion.SinFechaLibre || EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado))
                .ToList();

            DateTime lastDay = fechaSemana;

            repeticiones.ForEach(r =>
            {
                if (r.Consultorio.TipoSesionID == tipoSesion || tipoSesion == 0)
                {
                    DateTime fecha = sesiones.Where(s => s.FechaHora.DayOfWeek == (DayOfWeek)r.DiaSemana)
                    .Select(f => f.FechaHora)
                    .DefaultIfEmpty(r.Hora)
                    .Max()
                    .AddDays(r.Frecuencia);


                    //.AddDays(r.Frecuencia);

                    fecha = fecha.AddMinutes(-fecha.Minute);
                    fecha = fecha.AddHours(-fecha.Hour);
                    while (fecha < lastDay
                        || SearchFeriado(fecha, fecha).Count > 0
                        || SearchRecesos(fecha, fecha).Count > 0
                    )
                    {
                        fecha = fecha.AddDays(r.Frecuencia);
                    }
                    fechas.Add(fecha);
                }

            });
            if (fechas.Count > 0)
            {
                DateTime nextDay = fechas.Where(
                                f => f >= lastDay
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
            }

            return newSesiones;

        }

        private Sesion PosponerSesion(Sesion sesion, DateTime semana, string usuarioModificacion, DateTime fechaModificacion)
        {
            var consultorios = unitOfWork.RepoConsultorio.GetAll().ToList();
            var motivo = (EstadoSesion)sesion.Estado == EstadoSesion.Confirmado
                || (EstadoSesion)sesion.Estado == EstadoSesion.Reservado
                ? (short)EstadoSesion.Anulado : sesion.Estado;

            var turno = unitOfWork.RepoTurno.Find(sesion.TurnoID);
            var sesionBase = turno.Sesions.Where(x => x.ID == sesion.ID).FirstOrDefault();



            if (EstadoSesionCondicion.Libre.Contains((EstadoSesion)sesionBase.Estado))
            {
                throw new Exception("Los datos de la sesion no se encuentran actualizados.");
            }

            sesion = turno.Sesions.FirstOrDefault(s => s.ID == sesion.ID);

            var sesionesPospuestas = turno.Sesions
                                        .Where(s => s.Numero == sesion.Numero && s.Estado == sesion.Estado)
                                        .ToList();


            DateTime lastDate = turno.Sesions
                                        .Where(s => (EstadoSesion)s.Estado == EstadoSesion.SinFechaLibre ||
                                            EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado))
                                        .Max(s => s.FechaHora);

            lastDate = lastDate.AddDays(1);

            lastDate = lastDate > semana ? lastDate : semana;
            lastDate = lastDate.AddMinutes(-lastDate.Minute).AddHours(-lastDate.Hour);

            List<Sesion> newSesiones = getNextDay(lastDate, turno.Sesions.ToList(), turno.Turno_Repeticiones.ToList());
           

            if (newSesiones.Count > 0)
            {
                

                DateTime beginDate = newSesiones.Min(x => x.FechaHora);
                DateTime endDate = newSesiones.Max(x => x.FechaHora);

                //var sesionSuperpuestas = unitOfWork
                //.RepoSesion
                //.FindBy(s =>
                //    !(s.TurnoID ==  turno.ID) &&
                //    s.Turno.PacienteID == turno.PacienteID &&
                //    DbFunctions.TruncateTime(s.FechaHora) == DbFunctions.TruncateTime(beginDate) &&
                //    EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)
                //    && s.Turno.TipoSesionID == turno.TipoSesionID
                //).OrderBy(x => x.FechaHora).ToList();

                var sesionSuperpuestas = unitOfWork
                .RepoSesion
                .FindBy(s =>
                    !(s.TurnoID == turno.ID) &&
                    s.Turno.PacienteID == turno.PacienteID &&
                    DbFunctions.TruncateTime(s.FechaHora) >= DbFunctions.TruncateTime(lastDate) &&
                    DbFunctions.TruncateTime(s.FechaHora) <= DbFunctions.TruncateTime(beginDate) &&
                    EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)
                    && s.Turno.TipoSesionID == turno.TipoSesionID
                ).OrderBy(x => x.FechaHora).ToList();

                var sesionSuperpuesta = sesionSuperpuestas.FirstOrDefault();

                //existen sesiones superpuestas
                if (sesionSuperpuesta != null &&
                    ((EstadoSesion)sesionSuperpuesta.Estado == EstadoSesion.Confirmado ||
                    (EstadoSesion)sesionSuperpuesta.Estado == EstadoSesion.Reservado ||
                    (EstadoSesion)sesionSuperpuesta.Estado == EstadoSesion.Bloqueado)
                    )
                {

                    newSesiones = sesionSuperpuestas.Where(s => s.TurnoID == sesionSuperpuesta.TurnoID && s.Numero == sesionSuperpuesta.Numero).ToList();

                    newSesiones.Clear();
                    sesionSuperpuestas
                        .Where(s => s.TurnoID == sesionSuperpuesta.TurnoID && s.Numero == sesionSuperpuesta.Numero)
                        .ToList().ForEach(s =>
                        {
                            Sesion sesion1 = new Sesion() {
                                Estado = sesion.Estado,
                                FechaModificacion = fechaModificacion,
                                Numero = sesion.Numero,
                                Habilitado = sesion.Habilitado,
                                TurnoID = sesion.TurnoID,
                                UsuarioModificacion = usuarioModificacion,
                                ID = 0,
                                AgendaID = s.AgendaID,
                                ConsultorioID = s.ConsultorioID,
                                FechaHora = s.FechaHora,
                                TurnoSimultaneo = s.TurnoSimultaneo
                            };
                            newSesiones.Add(sesion1);
                        });

                    PosponerSesion(sesionSuperpuesta, sesionSuperpuesta.FechaHora, usuarioModificacion, fechaModificacion);
                    
                }

                //no existen sesiones superpuestas
                else
                {
                    newSesiones.ForEach(s =>
                    {
                        s.ConsultorioID = sesion.ConsultorioID;
                        s.Estado = sesion.Estado;
                        s.AgendaID = sesion.AgendaID;
                        s.FechaModificacion = fechaModificacion;
                        s.Numero = sesion.Numero;
                        s.Habilitado = sesion.Habilitado;
                        s.TurnoID = sesion.TurnoID;
                        s.TurnoSimultaneo = 0;
                        s.UsuarioModificacion = usuarioModificacion;
                    });

                    int idconsultorio = sesion.ConsultorioID;
                    short simultaneo = 0;

                    int? tipoSesionId = consultorios.FirstOrDefault(x => x.ID == idconsultorio).TipoSesionID;

                    idconsultorio = 0;
                    consultorios.Where(x => x.TipoSesionID == tipoSesionId).ToList()
                        .ForEach(x =>
                        {
                            if (idconsultorio == 0)
                            {
                                simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, x.ID);
                                if (simultaneo > 0)
                                {
                                    idconsultorio = x.ID;
                                    newSesiones.ForEach(tu =>
                                    {
                                        tu.TurnoSimultaneo = simultaneo;
                                        tu.ConsultorioID = idconsultorio;
                                    });
                                }

                            }
                        });

                    if (!ValidarNuevasSesiones(newSesiones, turno.TurnoDoble.HasValue))
                    {
                        newSesiones.ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                    }




                    newSesiones.Where(x => x.TurnoSimultaneo == 0).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
                }



                newSesiones.ForEach(s =>
                {
                    unitOfWork.RepoSesion.Add(s);
                });

                sesionesPospuestas.ForEach(s =>
                {
                    s.Estado = motivo;
                    s.FechaModificacion = fechaModificacion;
                    s.UsuarioModificacion = usuarioModificacion;
                    unitOfWork.RepoSesion.Edit(s);
                });

                SortSesiones(turno.ID);
            }

            return sesion;
        }

        //private Sesion PosponerSesion(Sesion sesion, DateTime semana, string usuarioModificacion, DateTime fechaModificacion)
        //{
        //    var consultorios = unitOfWork.RepoConsultorio.GetAll().ToList();
        //    var motivo = (EstadoSesion)sesion.Estado == EstadoSesion.Confirmado
        //        || (EstadoSesion)sesion.Estado == EstadoSesion.Reservado
        //        ? (short)EstadoSesion.Anulado : sesion.Estado;

        //    var turno = unitOfWork.RepoTurno.Find(sesion.TurnoID);
        //    var sesionBase = turno.Sesions.Where(x => x.ID == sesion.ID).FirstOrDefault();



        //    if (EstadoSesionCondicion.Libre.Contains((EstadoSesion)sesionBase.Estado))
        //    {
        //        throw new Exception("Los datos de la sesion no se encuentran actualizados.");
        //    }

        //    sesion = turno.Sesions.FirstOrDefault(s => s.ID == sesion.ID);

        //    var sesionesPospuestas = turno.Sesions
        //                                .Where(s => s.Numero == sesion.Numero && s.Estado == sesion.Estado)
        //                                .ToList();


        //    DateTime lastDate = turno.Sesions
        //                                .Where(s => (EstadoSesion)s.Estado == EstadoSesion.SinFechaLibre ||
        //                                    EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado))
        //                                .Max(s => s.FechaHora);

        //    lastDate = lastDate.AddDays(1);

        //    lastDate = lastDate > semana ? lastDate : semana;
        //    lastDate = lastDate.AddMinutes(-lastDate.Minute).AddHours(-lastDate.Hour);

        //    List<Sesion> newSesiones = getNextDay(lastDate, turno.Sesions.ToList(), turno.Turno_Repeticiones.ToList());
        //    newSesiones.ForEach(s =>
        //    {
        //        s.ConsultorioID = sesion.ConsultorioID;
        //    });

        //    if (newSesiones.Count > 0)
        //    {
        //        newSesiones.ForEach(s =>
        //        {
        //            s.Estado = sesion.Estado;
        //            s.AgendaID = sesion.AgendaID;
        //            s.FechaModificacion = fechaModificacion;
        //            s.Numero = sesion.Numero;
        //            s.Habilitado = sesion.Habilitado;
        //            s.TurnoID = sesion.TurnoID;
        //            s.TurnoSimultaneo = 0;
        //            s.UsuarioModificacion = usuarioModificacion;
        //        });

        //        DateTime beginDate = newSesiones.Min(x => x.FechaHora);
        //        DateTime endDate = newSesiones.Max(x => x.FechaHora);

        //        var sesionSuperpuesta = unitOfWork
        //        .RepoSesion
        //        .FindBy(s =>
        //            s.TurnoID > turno.ID &&
        //            s.Turno.PacienteID == turno.PacienteID &&
        //            s.FechaHora >= beginDate &&
        //            s.FechaHora <= endDate &&
        //            /*(EstadoSesion)s.Estado == EstadoSesion.Confirmado ||
        //            (EstadoSesion)s.Estado == EstadoSesion.Reservado ||
        //            (EstadoSesion)s.Estado == EstadoSesion.Bloqueado */
        //            EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)
        //        ).OrderBy(x => x.FechaHora).FirstOrDefault();

        //        if (sesionSuperpuesta != null && sesionSuperpuesta.TurnoID > turno.ID &&
        //            ((EstadoSesion)sesionSuperpuesta.Estado == EstadoSesion.Confirmado ||
        //            (EstadoSesion)sesionSuperpuesta.Estado == EstadoSesion.Reservado ||
        //            (EstadoSesion)sesionSuperpuesta.Estado == EstadoSesion.Bloqueado)
        //            )
        //        {

        //            PosponerSesion(sesionSuperpuesta, sesionSuperpuesta.FechaHora, usuarioModificacion, fechaModificacion);
        //        }

        //        int idconsultorio = newSesiones.FirstOrDefault().ConsultorioID;
        //        short simultaneo = 0;

        //        int? tipoSesionId = consultorios.FirstOrDefault(x => x.ID == idconsultorio).TipoSesionID;

        //        idconsultorio = 0;
        //        consultorios.Where(x => x.TipoSesionID == tipoSesionId).ToList()
        //            .ForEach(x =>
        //            {
        //                if (idconsultorio == 0)
        //                {
        //                    simultaneo = SearchTurnosSimultaneoByDate(beginDate, endDate, x.ID);
        //                    if (simultaneo > 0)
        //                    {
        //                        idconsultorio = x.ID;
        //                        newSesiones.ForEach(tu =>
        //                        {
        //                            tu.TurnoSimultaneo = simultaneo;
        //                            tu.ConsultorioID = idconsultorio;
        //                        });
        //                    }

        //                }
        //            });

        //        if (!ValidarNuevasSesiones(newSesiones, turno.TurnoDoble.HasValue))
        //        {
        //            newSesiones.ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);
        //        }




        //        newSesiones.Where(x => x.TurnoSimultaneo == 0).ToList().ForEach(s => s.Estado = (short)EstadoSesion.SinFechaLibre);

        //        newSesiones.ForEach(s =>
        //        {
        //            unitOfWork.RepoSesion.Add(s);
        //        });

        //        sesionesPospuestas.ForEach(s =>
        //        {
        //            s.Estado = motivo;
        //            s.FechaModificacion = fechaModificacion;
        //            s.UsuarioModificacion = usuarioModificacion;
        //            unitOfWork.RepoSesion.Edit(s);
        //        });

        //        SortSesiones(turno.ID);
        //    }

        //    return sesion;
        //}

        public ICollection<Sesion> PosponerSesion(ICollection<Sesion> sesiones, DateTime semana)
        {
            sesiones.OrderBy(x => x.Numero).ToList()
                .ForEach(s =>
                {
                    PosponerSesion(s, semana, s.UsuarioModificacion, s.FechaModificacion);
                });
            return sesiones;

        }

        //trabajando
        public Turno CancelarSesionesSiguientes(int idSesion, string user)
        {
            var sesionVieja = unitOfWork.RepoSesion.Find(idSesion);
            var turno = unitOfWork.RepoTurno.Find(sesionVieja.TurnoID);

            if (turno != null)
            {
                turno.FechaModificacion = DateTime.Now;
                turno.UsuarioModificacion = user;

                short numero = 0;
                var sesiones =
                turno.Sesions.Where(x => x.FechaHora >= sesionVieja.FechaHora &&
                (x.Estado == (short)EstadoSesion.Confirmado || x.Estado == (short)EstadoSesion.SinFechaLibre || x.Estado == (short)EstadoSesion.Reservado || x.Estado == (short)EstadoSesion.Bloqueado)
                )
                    .ToList();
                sesiones.ForEach(sesion =>
                {
                    if (sesion.Numero != numero)
                    {
                        SetSesionCancelada(sesion.ID, turno.UsuarioModificacion);
                        numero = sesion.Numero;
                    }
                });


            }
            return unitOfWork.RepoTurno.Find(turno.ID);
        }

        public Turno CancelarSesionesPendientes(int idTurno, string user)
        {
            var turno = unitOfWork.RepoTurno.Find(idTurno);
            if (turno != null)
            {
                turno.FechaModificacion = DateTime.Now;
                turno.UsuarioModificacion = user;
                turno = CancelarSesionesPendientes(turno);
            }
            return turno;
        }

        public Turno CancelarSesionesPendientes(Turno turno)
        {
            short numero = 0;
            var sesiones =
            turno.Sesions.Where(x => x.Estado == (short)EstadoSesion.Confirmado || x.Estado == (short)EstadoSesion.SinFechaLibre || x.Estado == (short)EstadoSesion.Reservado || x.Estado == (short)EstadoSesion.Bloqueado)
                .ToList();
            sesiones.ForEach(sesion =>
            {
                if (sesion.Numero != numero)
                {
                    SetSesionCancelada(sesion.ID, turno.UsuarioModificacion);
                    numero = sesion.Numero;
                }
            });
            return unitOfWork.RepoTurno.Find(turno.ID);
        }

        public ICollection<Sesion_Estado> GetSesionEstados() =>
            unitOfWork.RepoSesionEstados.GetAll().ToList();



        //private bool ValidarNuevasSesiones(List<Sesion> sesiones, bool sobreturno = false)
        //{
        //    bool isValid = true;
        //    int cantidad = sobreturno ? 1 : 0;
        //    var pp = GetAgenda();

        //    if (sesiones.Where(s => s.FechaHora.Hour > pp.HoraHasta.Hour
        //        || (s.FechaHora.Hour == pp.HoraHasta.Hour && s.FechaHora.Minute > pp.HoraHasta.Minute)
        //        ).ToList().Count() > 0)
        //    {
        //        isValid = false;
        //        throw new Exception("La sesión finaliza despues del horario de cierre del consultorio.");
        //    }
        //    else
        //    {
        //        foreach (var sesion in sesiones)
        //        {
        //            if (unitOfWork.RepoSesion.FindBy(x => x.FechaHora == sesion.FechaHora && x.ConsultorioID == sesion.ConsultorioID
        //             && x.TurnoSimultaneo == sesion.TurnoSimultaneo &&
        //             EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado)).Count() > cantidad)
        //            {
        //                isValid = false;
        //                break;
        //            }
        //        }
        //        isValid = SearchFeriado(sesiones[0].FechaHora, sesiones[0].FechaHora).Count > 0 ? false : isValid;
        //        isValid = SearchRecesos(sesiones[0].FechaHora, sesiones[0].FechaHora).Count > 0 ? false : isValid;
        //        isValid = isBlocked(sesiones[0].FechaHora, sesiones[sesiones.Count() - 1].FechaHora, sesiones[0].ConsultorioID, sesiones[0].TurnoSimultaneo) ? false : isValid;
        //    }


        //    return isValid;
        //}

        private bool ValidarNuevasSesiones(List<Sesion> sesiones, bool dobleOrden, bool sobreturno = false)
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
                if (sesiones.Where(s => pp.HoraDesde.Hour > s.FechaHora.Hour
                || (s.FechaHora.Hour == pp.HoraDesde.Hour && pp.HoraDesde.Minute > s.FechaHora.Minute)
                ).ToList().Count() > 0)
                {
                    isValid = false;
                    throw new Exception("La sesión comienza antes del horario de apertura.");
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
                    isValid = isBlocked(sesiones[0].FechaHora, sesiones[sesiones.Count() - 1].FechaHora, sesiones[0].ConsultorioID, sesiones[0].TurnoSimultaneo) ? false : isValid;
                    //modifico
                    if (dobleOrden)
                    {
                        isValid = isDobleOrdenExist(sesiones[0].FechaHora, sesiones[sesiones.Count() - 1].FechaHora) ? false : isValid;

                    }
                }
            }


            return isValid;
        }


        #endregion




        #endregion


        #region Common
        #endregion
        public bool TurnoSendMail(int id)
        {
            var turno = unitOfWork.RepoTurno.Find(id);
            if (string.IsNullOrEmpty(turno.Paciente.Mail))
            {
                throw new Exception("El paciente no tiene un mail registrado.");
            }
            string body = GetBodyTurno(turno);
            var smtpClient = new MailClientService(unitOfWork);
            smtpClient.SendMail(turno.Paciente.Mail, "Sesiones kinesiología", body);


            return true;
        }

        private string GetBodyTurno(Turno turno)
        {
            string body = "<html>";
            int frecuencia = unitOfWork.RepoAgenda.Find(1).Frecuencia;
            var sesiones = turno.Sesions
                   .Where(s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado))
                   .OrderBy(s => s.Numero)
                   .ToList();
            var estados = unitOfWork.RepoSesionEstados.GetAll().ToList();
            body += "<head>";
            body += "</head>";            


            body += "<body>";
            body += "<h2>Turnos de kinesiología.Licenciada Elvira Y.De Lorenzo MN 14.957 </h2><b>Chacabuco 194 3°C </b><br>";
            body += "Actuemos con conciencia y de manera responsable, si tiene síntomas compatibles con Covid-19 por favor <b>NO ASISTIR</b>.<br>";
            body += "Al ingresar al consultorio lavarse las manos y secarse con su propia toalla que deberá traer.<br>";
            body += "El tapaboca es de uso <b>OBLIGATORIO</b>.<br>";
            body += "Asistir sin acompañantes.<br><br>";                        
            body += turno.Paciente.Apellido + " " + turno.Paciente.Nombre + " (DNI " + turno.Paciente.DocumentoNumero + ")<br>";
            body += "Diagnóstico: " +  turno.Diagnostico + "<br>";
            body += "<table><thead><tr><th style='padding-right:40px;'>Número</th><th>Dia</th><th>Hora</th></tr></thead>";
            body += "<tbody>";

            for (int numero = 1; numero <= turno.CantidadSesiones; numero++)
            {
                DateTime beginDate = sesiones.Where(s => s.Numero == numero).Min(s => s.FechaHora);
                DateTime endDate = sesiones.Where(s => s.Numero == numero).Max(s => s.FechaHora).AddMinutes(frecuencia);
                var estado = estados.FirstOrDefault(e => e.ID == sesiones.Where(s => s.Numero == numero).FirstOrDefault().Estado);
                body += "<tr>";
                body += "<td style='padding-right:40px;'>";
                body += numero < 10 ? "0" : "";
                body += numero;
                body += "</td>";
                body += "<td style='padding-right:40px;'>" + beginDate.ToString("dd/MM/yyyy") + "</td>";
                body += "<td style='padding-right:40px;'>" + beginDate.ToShortTimeString() + "</td>";
                body += "</tr>";
            }
            body += "</tbody></table>";
            body += "<br><br>";
            body += "<p>En caso de ausencia con aviso previo de 24hs, se reprogramarán <strong>SÓLO</strong> dos sesiones de las asignadas.</p>";
            body += "<p>La ausencia sin previo aviso se computará la sesión.</p>";
            body += "<p>Ante la segunda ausencia sin aviso, se cancelarán <strong>TODOS</strong> los turnos subsiguiente</p>";
            body += "</body></html>";
            return body;
        }

        public bool ExisteSesionesRangoFecha(DateTime desde, DateTime hasta)
        {
            bool existe = unitOfWork.RepoSesion.FindBy(x => DbFunctions.TruncateTime(x.FechaHora) >= DbFunctions.TruncateTime(desde)
               && DbFunctions.TruncateTime(x.FechaHora) <= DbFunctions.TruncateTime(hasta)
               && EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)x.Estado)
               ).ToList().Count() > 0 ? true : false;
            return existe;
        }

        public ICollection<Sesion> CancelarSesiones(ICollection<Sesion> sesions)
        {
            sesions.ToList().ForEach(s =>
            {
                SetSesionCancelada(s.ID, s.UsuarioModificacion);
                //var sesiones = unitOfWork.RepoSesion.FindBy(rs => rs.TurnoID == s.TurnoID
                //&& rs.Numero == s.Numero && s.Estado == rs.Estado).ToList();

                //sesiones.ForEach(sesion =>
                //{

                //    sesion.FechaModificacion = s.FechaModificacion;
                //    sesion.UsuarioModificacion = s.UsuarioModificacion;
                //    sesion.Estado = (short)EstadoSesion.Cancelado;
                //    unitOfWork.RepoSesion.Edit(sesion);

                //});
                //s.Estado = (short)EstadoSesion.Cancelado;
            });
            //var sesiones = unitOfWork.RepoSesion.FindBy()
            return sesions;
        }

        public ICollection<Sesion> BloquearSesion(Turno turno)
        {
            turno.Estado = (short)EstadoTurno.Bloqueado;
            turno.Turno_Repeticiones.Add(
                new Turno_Repeticiones
                {
                    ConsultorioID = turno.Sesions.ToList()[0].ConsultorioID,
                    DiaSemana = (int)turno.Sesions.ToList()[0].FechaHora.DayOfWeek,
                    FechaModificacion = turno.FechaModificacion,
                    Frecuencia = 7,
                    Modulos = turno.Sesions.ToList().Count(),
                    Posicion = 1,
                    UsuarioModificacion = turno.UsuarioModificacion,
                    Hora = turno.Sesions.ToList()[0].FechaHora
                }
                );
            foreach (var sesion in turno.Sesions)
            {
                sesion.Estado = (short)EstadoSesion.Bloqueado;
                sesion.FechaModificacion = turno.FechaModificacion;
                sesion.UsuarioModificacion = turno.UsuarioModificacion;

            }
            if (ValidarNuevasSesiones(turno.Sesions.ToList(), false))
            {
                turno = unitOfWork.RepoTurno.Add(turno);
            }
            else
            {
                throw new Exception("Existen sesiones ya asignadas a su seleccion.");
            }

            return turno.Sesions;
        }

        public void SetDatosTurnoFacturacion(int id, DateTime? fecha, string factura, decimal? importe)
        {
            Turno entity = GetTurno(id);
            entity.FechaFactura = fecha;
            entity.Factura = factura;
            entity.importe = importe;
            unitOfWork.RepoTurno.Edit(entity);
        }

        public bool AtiendeEl(DateTime fecha)
        {
            return AtiendeEl(fecha, GetAgenda());
        }

        public bool AtiendeEl(DateTime fecha, Agendum agenda)
        {
            bool resu = false;
            switch ((int)fecha.DayOfWeek)
            {
                case (int)DayOfWeek.Monday:
                    resu = agenda.AtiendeLunes;
                    break;
                case (int)DayOfWeek.Tuesday:
                    resu = agenda.AtiendeMartes;
                    break;
                case (int)DayOfWeek.Wednesday:
                    resu = agenda.AtiendeMiercoles;
                    break;
                case (int)DayOfWeek.Thursday:
                    resu = agenda.AtiendeJueves;
                    break;
                case (int)DayOfWeek.Friday:
                    resu = agenda.AtiendeViernes;
                    break;
                case (int)DayOfWeek.Saturday:
                    resu = agenda.AtiendeSabado;
                    break;
                case (int)DayOfWeek.Sunday:
                    resu = agenda.AtiendeDomingo;
                    break;


            }
            return resu;
        }
    }
}
