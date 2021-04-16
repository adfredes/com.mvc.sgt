using com.sgt.DataAccess;
using com.sgt.DataAccess.Interfaces;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using com.sgt.DataAccess.Enums;
using com.sgt.DataAccess.ExtensionMethod;
using System.Data.Entity;
using System.Globalization;

namespace com.sgt.services.Services
{
    public class PacienteService : IPacienteService
    {
        private IUnitOfWork unitOfWork;

        public PacienteService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        private Paciente SetFormat(Paciente entity)
        {
            entity.Nombre = entity.Nombre.toFirstName();
            entity.Apellido = entity.Apellido.toLastName();
            return entity;
        }

        public void Add(Paciente entity)
        {
            entity = SetFormat(entity);
            entity.Habilitado = true;
            entity.DocumentoTipoID = 1;
            if (!ExistPaciente(entity))
            {                
                this.unitOfWork.RepoPaciente.Add(entity);
            }
            else
            {
                throw new Exception("Documento existente");
            }
        }

        public void Delete(Paciente entity)
        {
            entity.Habilitado = false;
            this.unitOfWork.RepoPaciente.Edit(entity);
        }

        public void Edit(Paciente entity)
        {
            entity = SetFormat(entity);
            if (!ExistPaciente(entity))
            {
                this.unitOfWork.RepoPaciente.Edit(entity);
            }
            else
            {
                throw new Exception("Documento existente");
            }
        }

        public Paciente Find(int id)
        {
            return this.unitOfWork.RepoPaciente.Find(id);
        }

        public IQueryable<Paciente> FindBy(Expression<Func<Paciente, bool>> predicate)
        {
            return this.unitOfWork.RepoPaciente.FindBy(predicate);
        }

        public ICollection<Paciente> GetAll()
        {
            return this.unitOfWork.RepoPaciente.GetAll().ToList();
        }

        private bool ExistPaciente(Paciente paciente)
        {
            var resu = FindBy(x => x.DocumentoTipoID == paciente.DocumentoTipoID
                && x.DocumentoNumero == paciente.DocumentoNumero
                && x.ID != paciente.ID
                && x.Habilitado);
            int pp = resu.Count();
            return resu.Count() == 0 ? false : true;

        }

        public ICollection<Turno> ListarTurnos(int PacienteID)
        {
            var resu = unitOfWork.RepoTurno
                .FindBy(t => t.PacienteID == PacienteID)
                .OrderByDescending(t => t.ID)
                .Where(t =>
                    t.Sesions.Where(
                        s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)
                        || EstadoSesion.SinFechaLibre == (EstadoSesion)s.Estado
                        ).Count() > 0
                ).ToList();

            resu.ForEach(t => t.Sesions = t.Sesions.Where(s => (EstadoSesion)s.Estado != EstadoSesion.Anulado).ToList());

            //    .Select(x => new
            //    {
            //        ID = x.ID,
            //        CantidadSesiones = x.CantidadSesiones,
            //        Estado = x.Estado,
            //        Diagnostico = x.Diagnostico,
            //        Fecha = x.Fecha,
            //        FechaModificacion = x.FechaModificacion,
            //        Habilitado = x.Habilitado,
            //        Paciente = x.Paciente,
            //        PacienteID = x.PacienteID,
            //        UsuarioModificacion = x.UsuarioModificacion,
            //        CodigoPractica = x.CodigoPractica,
            //        TurnoDoble = x.TurnoDoble,
            //        TipoSesionID = x.TipoSesionID,
            //        Sesions = x.Sesions.Where(s => s.Estado != 3).ToList()
            //    }).ToList();

            //var final = resu.Where(x => x.Sesions.Count > 0)
            //    .Select(x => new Turno
            //    {
            //        ID = x.ID,
            //        CantidadSesiones = x.CantidadSesiones,
            //        Estado = x.Estado,
            //        Diagnostico = x.Diagnostico,
            //        Fecha = x.Fecha,
            //        FechaModificacion = x.FechaModificacion,
            //        Habilitado = x.Habilitado,
            //        Paciente = x.Paciente,
            //        PacienteID = x.PacienteID,
            //        UsuarioModificacion = x.UsuarioModificacion,
            //        TurnoDoble = x.TurnoDoble,
            //        TipoSesionID = x.TipoSesionID,
            //        Sesions = x.Sesions
            //    }).ToList();

            return resu;
            //resu.ToList();
        }

        public ICollection<Paciente> ListarPacientesAnualesCondicionSesiones()
        {
            var pacientes = unitOfWork.RepoPaciente.FindBy(x => x.Anual == true);
            List<Paciente> listaPacientes = new List<Paciente>();
            try
            {
                DateTime hoy = DateTime.Now;
                foreach (var paciente in pacientes)
                {
                    int sesionesPendientes = paciente.Turnoes
                        .Sum(x => x.Sesions
                        .Where(s => s.FechaHora >= hoy)
                        .Select(s => new { s.TurnoID, s.Numero, s.Estado })
                        .Where(s => (EstadoSesion)s.Estado == EstadoSesion.Confirmado)
                            .Distinct()
                            .ToList().Count)
                        ;
                    if (sesionesPendientes <= 20)
                    {
                        listaPacientes.Add(paciente);
                    }

                }
            }
            catch(Exception ex)
            {
                throw ex;
            }
            

            return listaPacientes;
        }

        public Imagen AddFile(Imagen imagen)
        {
            imagen = unitOfWork.RepoImagen.Add(imagen);
            return imagen;
        }

        public void DeleteFile(int id, string usuario)
        {
            var imagen = GetFile(id);
            imagen.Habilitado = false;
            imagen.UsuarioModificacion = usuario;
            imagen.FechaModificacion = DateTime.Now;
            unitOfWork.RepoImagen.Edit(imagen);
        }

        public ICollection<Imagen> GetFiles(int PacienteID)
        {
            var imagenes = unitOfWork.RepoImagen.FindBy(x => x.PacienteID == PacienteID && x.Habilitado)
                .OrderBy(x => x.ID);
            return imagenes.ToList();
        }

        public Imagen GetFile(int id)
        {
            var imagen = unitOfWork.RepoImagen.Find(id);
            return imagen;
        }

        public bool TurnosAnteriores(int PacienteID, int TipoSesionID)
        {
            var resu = unitOfWork.RepoTurno
               .FindBy(t => t.PacienteID == PacienteID //&& t.TipoSesionID == TipoSesionID
               && t.Estado == (int)EstadoTurno.Confirmado).FirstOrDefault();


            return resu != null;
        }

        public bool IsSesionesSuperpuestas(int turnoID)
        {
            var turno = unitOfWork.RepoTurno.Find(turnoID);

            return IsSesionesSuperpuestas(turno);
        }

        public bool IsSesionesSuperpuestas(Turno turno)
        {            
            DateTime hoy = DateTime.Now;
            //DateTime minDate = turno.Sesions.Min(x => x.FechaHora);
            //DateTime maxDate = turno.Sesions.Max(x => x.FechaHora);

            hoy = hoy.AddHours(-1 * hoy.Hour).AddMinutes(-1 * hoy.Minute);

            turno.Sesions.ToList()
                .ForEach(s =>
                {
                    s.FechaHora = s.FechaHora.AddHours(-1 * s.FechaHora.Hour).AddMinutes(-1 * s.FechaHora.Minute);
                });

            try
            {

                var sesiones = turno.Sesions
                    .Where(s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)
                    && s.FechaHora >= hoy)
                    .Select(s => s.FechaHora)
                    .Distinct()
                    .ToList();
                //var sesiones = (turno.Sesions
                //.Where(s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado)
                //&& DbFunctions.TruncateTime(s.FechaHora) >= DbFunctions.TruncateTime(hoy))
                //.Select(s => s.FechaHora))
                //.Distinct()).ToList();

                var turnos = unitOfWork.RepoTurno.FindBy(x => x.ID != turno.ID && x.Estado == (int)EstadoTurno.Confirmado
                && x.PacienteID == turno.PacienteID
                && x.Sesions.Where(s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado) && sesiones.Contains(DbFunctions.TruncateTime(s.FechaHora).Value))
                    .Count() > 0
                );



                return turnos.Count() > 0;
            }
            catch
            {
                return false;
            }

        }

        public bool IsSesionSuperpuesta(int sesionID, DateTime fechaHoraSesion)
        {
            var fechaSesion = fechaHoraSesion.AddHours(-1 * fechaHoraSesion.Hour).AddMinutes(-1 * fechaHoraSesion.Minute);
            var sesion = unitOfWork.RepoSesion.Find(sesionID);
            
            var pacienteID = sesion.Turno.PacienteID;
            var turnoID = sesion.Turno.ID;
            var numeroSesion = sesion.Numero;


            try
            {                               
                var turnos = unitOfWork.RepoTurno.FindBy(x => x.Estado == (int)EstadoTurno.Confirmado
                && x.PacienteID == pacienteID
                && x.Sesions.Where(s => EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado) && fechaSesion == DbFunctions.TruncateTime(s.FechaHora).Value
                    && !(s.TurnoID == turnoID && s.Numero == numeroSesion)
                )
                    .Count() > 0
                ).ToList();
                return turnos.Count() > 0;
            }
            catch
            {
                return false;
            }

        }

        public Paciente GetPacienteByDocumento(string documento)
        {
            return this.unitOfWork.RepoPaciente.FindBy(x => x.DocumentoNumero == documento).FirstOrDefault();
        }


    }
}
