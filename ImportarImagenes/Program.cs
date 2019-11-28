using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using com.sgt.services;
using com.sgt.DataAccess;
using com.sgt.DataAccess.Enums;
using com.sgt.services.Interfaces;
using com.sgt.services.Services;
using System.Data.Entity;

namespace ImportarImagenes
{
    class Program
    {
        static void Main(string[] args)
        {
            int[] turnosID = new int[] {20660
,20667
,20668
,21918
,24336
//,24343
//,24348
,24369
            };
            turnosID.ToList().ForEach(t =>
            {
                LecturaTurno(t);
            });
            


        }

        static void ViejoMain()
        {
            string ruta = @"K:\FotosPacientes\";
            IPacienteService servicio = new PacienteService(new UnitOfWork(new TurnosDB()));
            foreach (string fileRut in System.IO.Directory.GetFiles(ruta))
            {
                Console.WriteLine(fileRut.Replace(ruta, ""));
                try
                {
                    int PacienteID = Convert.ToInt32(fileRut.Replace(ruta, "").Replace(".jpg", ""));
                    var paciente = servicio.Find(PacienteID);
                    Byte[] bytes = File.ReadAllBytes(fileRut);
                    String fileB64 = "data:image/jpeg;base64," + Convert.ToBase64String(bytes);
                    paciente.Foto = fileB64;
                    servicio.Edit(paciente);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.ToString());
                    //Console.ReadKey();
                }

            }
            Console.ReadKey();
        }

        static void setTurnoRepeticiones()
        {
            try
            {

            
            AgendaService servicio = new AgendaService(new UnitOfWork(new TurnosDB()));
            var turnos = servicio.GetTurnos();
            int ct = turnos.Count();
            turnos.ToList().ForEach(turno =>
            {
                turno = servicio.GetTurno(turno.ID);
                for(int nro = 1; nro < 5; nro++)
                {
                    var sesiones = turno.Sesions
                    .Where(s => s.Numero == nro && EstadoSesionCondicion.Ocupado.Contains((EstadoSesion)s.Estado))
                    .OrderBy(s => s.ID).ToList();
                    int count = sesiones.Count();
                    //(sesiones[0].FechaHora).DayOfWeek
                    //int repe = turno.Turno_Repeticiones.Where(tr => tr.DiaSemana == (int)(sesiones[0].FechaHora).DayOfWeek).Count();
                    if (sesiones.Count() > 0 && turno.Turno_Repeticiones.Where(tr => tr.DiaSemana == (int)(sesiones[0].FechaHora).DayOfWeek).Count() == 0)
                    {
                        var sesion = sesiones[0];
                        Turno_Repeticiones repeticion = new Turno_Repeticiones
                        {
                            ConsultorioID = sesion.ConsultorioID,
                            DiaSemana = (int)sesion.FechaHora.DayOfWeek,
                            Frecuencia = 7,
                            Hora = sesion.FechaHora,
                            Modulos = sesiones.Count(),
                            TurnoID = sesion.TurnoID,
                            Posicion = nro,
                            FechaModificacion = sesion.FechaModificacion,
                            UsuarioModificacion = sesion.UsuarioModificacion
                        };
                        turno.Turno_Repeticiones.Add(repeticion);                            
                    }
                }

                servicio.EditTurno(turno);

            });
            }
            catch(Exception ex)
            {
                Console.Write(ex.InnerException);
                Console.ReadKey();
            }
        }


        static void LecturaTurno(int id)
        {
            var uof = new UnitOfWork(new TurnosDB());
            AgendaService servicio = new AgendaService(uof);
            
            DateTime modi = Convert.ToDateTime("04/11/2019");
            var turno = servicio.GetTurno(id);
            //var sesiones = turno.Sesions.Where(x => x.Estado == 6 && x.FechaModificacion == modi);
            //var pedro = sesiones.ToList();
            //uof.RepoSesion.FindBy(x => x.TurnoID == id && x.Estado == 6 && x.FechaModificacion > modi);

            var fechas = uof.RepoSesion.FindBy(x => x.TurnoID == id && x.Estado == 6 && DbFunctions.TruncateTime(x.FechaModificacion) == modi)
                .Select(x => new { fecha = DbFunctions.TruncateTime(x.FechaHora), modi = x.FechaModificacion })
                .Distinct()
                .OrderBy(x => x.fecha)
                .ToList();

            short numero = (short)turno.CantidadSesiones;
            fechas.ForEach(s =>
            {
                numero++;
                var sesiones = uof.RepoSesion.FindBy(x => x.TurnoID == id && x.Estado == 6 && x.FechaModificacion == s.modi
                && DbFunctions.TruncateTime(x.FechaHora) == s.fecha).ToList();
                DateTime modificado = DateTime.Now;
                sesiones.ForEach(p =>
                {
                    p.Numero = numero;
                    p.Estado = (short)2;
                    p.FechaModificacion = modificado;
                    p.UsuarioModificacion = "sistema";
                    uof.RepoSesion.Edit(p);
                });                                
            });
            turno.CantidadSesiones = numero;
            uof.RepoTurno.Edit(turno);
        }

    }
}
