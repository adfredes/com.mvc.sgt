﻿using com.sgt.DataAccess;
using com.sgt.DataAccess.Interfaces;
using com.sgt.services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace com.sgt.services.Services
{
    public class ProfesionalService : IProfesionalService
    {
        private IUnitOfWork unitOfWork;

        public ProfesionalService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public void Add(Profesional entity)
        {
            entity.Habilitado = true;
            entity = SetAgendaFechaUsuario(entity);
            this.unitOfWork.RepoProfesional.Add(entity);
        }

        public void Delete(Profesional entity)
        {
            entity.Habilitado = false;
            Edit(entity);
        }

        public void Edit(Profesional entity)
        {
            entity = SetAgendaFechaUsuario(entity);
            this.unitOfWork.RepoProfesional.Edit(entity);
        }

        private Profesional SetAgendaFechaUsuario(Profesional entity)
        {
            entity.Agenda.ToList().ForEach(a => {
                a.UsuarioModificacion = entity.UsuarioModificacion;
                a.FechaModificacion = entity.FechaModificacion;
                a.ProfesionalID = entity.ID;
                a.Descripcion = "Agenda " + entity.Nombre + " " + entity.Apellido;
                a.Habilitado = entity.Habilitado;
                a.Frecuencia = 30;
            });
            return entity;
        }
        

        public Profesional Find(int id)
        {
            return unitOfWork.RepoProfesional.Find(id);
        }

        public IQueryable<Profesional> FindBy(Expression<Func<Profesional, bool>> predicate)
        {
            return unitOfWork.RepoProfesional.FindBy(predicate);
        }

        public ICollection<Profesional> GetAll()
        {
            return unitOfWork.RepoProfesional.FindBy(p=>p.Habilitado==true).OrderBy(p=>p.Apellido).ThenBy(p=>p.Nombre).ToList();
        }

       
        public ICollection<Profesional> GetAll(int page, int count)
        {            
            return unitOfWork.RepoProfesional.FindBy(p => p.Habilitado == true).
                OrderBy(x => x.Apellido).
                ThenBy(x => x.Nombre).
                Skip((page - 1) * count).
                Take(count).
                ToList();
            
        }

        
        public ICollection<Profesional> FindByLetter(string letter, int page, int count)
        {            
                return FindBy(x => x.Apellido.Substring(0, 1).ToUpper() == letter && x.Habilitado == true)                
                .OrderBy(x => x.Apellido).
                ThenBy(x => x.Nombre).
                Skip((page - 1) * count).
                Take(count)
                .ToList();            
        }

        public ICollection<Profesional_Ausencias> GetAllAusencias()
        {
            return unitOfWork.RepoProfesionalAusencias.FindBy(s => DbFunctions.TruncateTime(s.FechaHasta) >= DbFunctions.TruncateTime(DateTime.Now) && s.Habilitado == true && s.Profesional.Habilitado==true)
                .OrderBy(s=>s.FechaDesde)
                .ToList();
        }

        public void SaveAusencia(Profesional_Ausencias entity)
        {
            if (entity.ID > 0)
            {
                unitOfWork.RepoProfesionalAusencias.Edit(entity);
            }
            else
            {
                unitOfWork.RepoProfesionalAusencias.Add(entity);
            }            
        }

        public ICollection<Profesional_Ausencias> GetAusenciasByRango(DateTime desde, DateTime hasta)
        {
            return unitOfWork.RepoProfesionalAusencias
                .FindBy(s => 
                        DbFunctions.TruncateTime(s.FechaHasta) >= DbFunctions.TruncateTime(desde) 
                        && DbFunctions.TruncateTime(s.FechaDesde) <= DbFunctions.TruncateTime(hasta)
                        && s.Habilitado == true
                        && s.Profesional.Habilitado == true
                    )
                .OrderBy(s => s.FechaDesde)
                .ToList();
        }

        public void Delete(int id)
        {
            Delete(Find(id));
        }

        public void SaveSuplencia(Profesional_Suplencias entity)
        {
            if (entity.ID > 0)
            {
                unitOfWork.RepoProfesionalSuplencias.Edit(entity);
            }
            else
            {
                unitOfWork.RepoProfesionalSuplencias.Add(entity);
            }
        }

        public ICollection<Profesional_Suplencias> GetSuplenciasByIdAusencia(int id)
        {
            return unitOfWork.RepoProfesionalSuplencias
                .FindBy(s => s.AusenciaID == id && s.Habilitado == true)
                .ToList();            
        }

        public void DeleteSuplencia(int id)
        {
            var entity = unitOfWork.RepoProfesionalSuplencias.Find(id);
            if (entity != null)
            {
                entity.Habilitado = false;
                unitOfWork.RepoProfesionalSuplencias.Edit(entity);
            }
        }
    }
}
