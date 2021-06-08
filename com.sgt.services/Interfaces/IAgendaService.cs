using com.sgt.DataAccess;
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
        bool AtiendeEl(DateTime fecha);
        bool AtiendeEl(DateTime fecha, Agendum agenda);
        void AddFeriado(Feriado entity);
        void DelFeriado(Feriado entity);
        void DelFeriado(int id);
        void EditFeriado(Feriado entity);        
        Feriado FindFeriado(int id);
        ICollection<Feriado> FindNextFeriado();
        ICollection<Feriado> SearchFeriado(DateTime desde, DateTime hasta);

        Agendum GetAgenda();
        void EditAgenda(Agendum entity);

        ICollection<Sesion> SearchSesions(DateTime beginDate, DateTime endDate);
        Sesion SetSesionEsDoble(int sesionID, bool esDoble);
        Sesion SetSesionCancelada(int sesionID, string usuario);
        Sesion SetSesionAnulada(int sesionID, string usuario);
        Sesion SetSesionAsistio(int sesionID, string usuario);
        Sesion SetSesionNoAsistio(int sesionID, string usuario);
        Sesion SetSesionConfirmado(int sesionID, string usuario);
        bool ChangeCodigoTransaccionSesion(int sesionID, string codigoTransaccion, string usuario);
        ICollection<Sesion> GetSesionConsultorioByDate(DateTime fecha, int consultorioID, int turnoSimultaneo);
        ICollection<Sesion> FindSesion(int sesionID);
        ICollection<Sesion> BloquearSesion(Turno turno);
        ICollection<Sesion> CambiarFechaSesion(ICollection<Sesion> sesiones);
        ICollection<Sesion> CambiarFechaSesionSobreturno(ICollection<Sesion> sesiones);
        ICollection<Sesion_Estado> GetSesionEstados();
        ICollection<Sesion> PosponerSesion(ICollection<Sesion> sesiones);
        ICollection<Sesion> PosponerSesion(ICollection<Sesion> sesiones, DateTime semana);
        ICollection<Sesion> CancelarSesiones(ICollection<Sesion> sesions);

        Turno ReservarSesiones(Turno turno);
        bool ChangeNumeroAutorizacionturno(int turnoID, string numeroAutorizacion, string usuario);
        Turno ReservarSesiones(Turno turno, List<int> sobreturnos);
        void CancelarReserva(int idTurno);
        void CancelarReserva(Turno turno);
        Turno CancelarSesionesPendientes(int idTurno, string user);
        Turno CancelarSesionesPendientes(Turno turno);

        Turno CancelarSesionesSiguientes(int idSesion, string user);
                
        void SetDatosTurnoFacturacion(int id, DateTime? fecha, string factura, decimal? importe);

        
        ICollection<Agenda_Receso> SearchRecesos(DateTime desde, DateTime hasta);
        Agenda_Receso GetReceso(int id);
        void AddReceso(Agenda_Receso entity);
        void EditReceso(Agenda_Receso entity);
        void DelReceso(int id);
        void DelReceso(Agenda_Receso entity);

        void AddBloqueoAgenda(Agenda_Bloqueos entity);
        void EditBloqueoAgenda(Agenda_Bloqueos entity);
        //ICollection<Agenda_Bloqueos> SearchBloqueos(DateTime desde, DateTime hasta);

        Turno GetTurno(int id);
        Turno AsignarPacienteTurno(Turno turno);
        Turno ConfirmarTurno(Turno turno, bool continuar, int? turnoID);
        void EditDiagnosticoTurno(Turno turno);
        Turno AgregarSesiones(Turno turno, int cantidadSesiones, bool continuar);
        Turno CancelarTurno(Turno turno);
        List<Turno> GetTurnosSinFecha();
        List<int> GetNrosTurnosSinDobleOrden(int pacienteID);
        Turno SetTurnoDobleOrden(Turno turno, int? idTurno);

        bool ExisteSesionesRangoFecha(DateTime desde, DateTime hasta);
        

        bool TurnoSendMail(int id);
    }
}
