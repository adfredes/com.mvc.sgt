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

        public UnitOfWork(DbContext dbContext)
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


        public IAseguradoraRepository RepoAseguradora
        {
            get
            {
                if (aseguradoraRepository == null)
                    aseguradoraRepository = new AseguradoraRepository(dbContext);
                return aseguradoraRepository;
            }
        }            

        public IPacienteRepository RepoPaciente
        {
            get
            {
                if (pacienteRepository == null)
                    pacienteRepository = new PacienteRepository(dbContext);
                return pacienteRepository;
            }
        }

        public ILocalidadRepository RepoLocalidad
        {
            get
            {
                if (localidadRepository == null)
                    localidadRepository = new LocalidadRepository(dbContext);
                return localidadRepository;
            }
        }

        public IProvinciaRepository RepoProvincia
        {
            get
            {
                if (provinciaRepository == null)
                    provinciaRepository = new ProvinciaRepository(dbContext);
                return provinciaRepository;
            }
        }
    }
}
