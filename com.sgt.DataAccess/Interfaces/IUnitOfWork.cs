using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.DataAccess.Interfaces
{
    public interface IUnitOfWork
    {
        IAseguradoraRepository RepoAseguradora { get; }
        IPacienteRepository RepoPaciente { get; }
        ILocalidadRepository RepoLocalidad { get; }
        IProvinciaRepository RepoProvincia { get; }

    }
}
