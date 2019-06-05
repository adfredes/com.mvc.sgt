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

namespace com.sgt.services.Services
{
    public class PacienteService : IPacienteService
    {
        private IUnitOfWork unitOfWork;

        public PacienteService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void Add(Paciente entity)
        {
            if (!ExistPaciente(entity))
            {
                entity.DocumentoTipoID = 1;
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
                && x.ID != paciente.ID);
            int pp = resu.Count();
            return resu.Count() == 0 ? false : true;

        }

        public ICollection<Turno> ListarTurnos(int PacienteID)
        {
            var resu = unitOfWork.RepoTurno
                .FindBy(t => t.PacienteID == PacienteID)
                .OrderByDescending(t => t.ID)
                .Select(x => new
                {
                    ID = x.ID,
                    CantidadSesiones = x.CantidadSesiones,
                    Estado = x.Estado,
                    Diagnostico = x.Diagnostico,
                    Fecha = x.Fecha,
                    FechaModificacion = x.FechaModificacion,
                    Habilitado = x.Habilitado,
                    Paciente = x.Paciente,
                    PacienteID = x.PacienteID,
                    UsuarioModificacion = x.UsuarioModificacion,
                    TurnoDoble = x.TurnoDoble,
                    Sesions = x.Sesions.Where(s => s.Estado != 3).ToList()
                }).ToList();

            var final = resu.Where(x => x.Sesions.Count > 0)
                .Select(x => new Turno
                {
                    ID = x.ID,
                    CantidadSesiones = x.CantidadSesiones,
                    Estado = x.Estado,
                    Diagnostico = x.Diagnostico,
                    Fecha = x.Fecha,
                    FechaModificacion = x.FechaModificacion,
                    Habilitado = x.Habilitado,
                    Paciente = x.Paciente,
                    PacienteID = x.PacienteID,
                    UsuarioModificacion = x.UsuarioModificacion,
                    TurnoDoble = x.TurnoDoble,
                    Sesions = x.Sesions
                }).ToList();

            return final;
            //resu.ToList();
        }

        public ICollection<Paciente> ListarPacientesAnualesCondicionSesiones()
        {
            var pacientes = unitOfWork.RepoPaciente.FindBy(x => x.Anual == true);
            List<Paciente> listaPacientes = new List<Paciente>();

            foreach(var paciente in pacientes)
            {
                int sesionesPendientes = paciente.Turnoes
                    .Sum(x => x.Sesions
                        .Select( s => new { s.TurnoID,s.Numero,s.Estado})
                        .Distinct()
                        .Where(s => (EstadoSesion)s.Estado == EstadoSesion.Confirmado)
                        .ToList().Count)
                    ;
                if (sesionesPendientes <= 20)
                {
                    listaPacientes.Add(paciente);
                }
                
            }

            return listaPacientes;            
        }

        public Imagen AddFile(Imagen imagen)
        {
            imagen = unitOfWork.RepoImagen.Add(imagen);
            return imagen;
        }

        public ICollection<Imagen> GetFiles(int PacienteID)
        {
            var imagenes = unitOfWork.RepoImagen.FindBy(x => x.PacienteID == PacienteID && x.Habilitado)
                .OrderBy(x=> x.ID);
            return imagenes.ToList();
        }

        public Imagen GetFile(int id)
        {
            var imagen = unitOfWork.RepoImagen.Find(id);
            return imagen;
        }
    }
}
