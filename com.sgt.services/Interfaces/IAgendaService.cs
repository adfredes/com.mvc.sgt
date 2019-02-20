﻿using com.sgt.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Interfaces
{
    public interface IAgendaService
    {
        void AddFeriado(Feriado entity);
        void DelFeriado(Feriado entity);
        void DelFeriado(int id);
        void EditFeriado(Feriado entity);        
        Feriado FindFeriado(int id);
        ICollection<Feriado> FindNextFeriado();
        ICollection<Feriado> SearchFeriado(DateTime desde, DateTime hasta);
        Agendum GetAgenda();
        ICollection<Sesion> SearchSesions(DateTime beginDate, DateTime endDate);
        Sesion SetSesionAnulada(int sesionID, string usuario);
        Sesion SetSesionAsistio(int sesionID, string usuario);
        Sesion SetSesionNoAsistio(int sesionID, string usuario);
        Sesion SetSesionConfirmado(int sesionID, string usuario);
        ICollection<Sesion> GetSesionConsultorioByDate(DateTime fecha, int consultorioID, int turnoSimultaneo);
        ICollection<Sesion> FindSesion(int sesionID);
        ICollection<Sesion> BloquearSesion(Turno turno);
        ICollection<Sesion> CambiarFechaSesion(ICollection<Sesion> sesiones);
        ICollection<Sesion_Estado> GetSesionEstados();
        Turno ReservarSesiones(Turno turno);
        void CancelarReserva(int idTurno);
        void CancelarReserva(Turno turno);
        Turno CancelarSesionesPendientes(int idTurno);
        Turno CancelarSesionesPendientes(Turno turno);

        ICollection<Agenda_Receso> SearchRecesos(DateTime desde, DateTime hasta);

    }
}