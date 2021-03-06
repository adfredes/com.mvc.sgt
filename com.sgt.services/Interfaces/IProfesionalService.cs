﻿using com.sgt.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Interfaces
{
    public interface IProfesionalService:ICrudService<Profesional>
    {
        void Delete(int id);
        ICollection<Profesional> GetAll(int page, int count);
        ICollection<Profesional> FindByLetter(string letter, int page, int count);
        ICollection<Profesional_Ausencias> GetAllAusencias();
        void SaveAusencia(Profesional_Ausencias entity);
        ICollection<Profesional_Ausencias> GetAusenciasByRango(DateTime desde, DateTime hasta);
        void SaveSuplencia(Profesional_Suplencias entity);
        void DeleteSuplencia(int id);
        ICollection<Profesional_Suplencias> GetSuplenciasByIdAusencia(int id);
    }
}
