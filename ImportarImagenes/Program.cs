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

namespace ImportarImagenes
{
    class Program
    {
        static void Main(string[] args)
        {
           
            setTurnoRepeticiones();
            return;

            string ruta = @"K:\FotosPacientes\";
            IPacienteService servicio = new PacienteService(new UnitOfWork(new TurnosDB()));
            foreach (string fileRut in System.IO.Directory.GetFiles(ruta))
            {
                Console.WriteLine(fileRut.Replace(ruta,""));
                try
                {                    
                    int PacienteID = Convert.ToInt32(fileRut.Replace(ruta, "").Replace(".jpg", ""));
                    var paciente = servicio.Find(PacienteID);
                    Byte[] bytes = File.ReadAllBytes(fileRut);
                    String fileB64 = "data:image/jpeg;base64," + Convert.ToBase64String(bytes);
                    paciente.Foto = fileB64;
                    servicio.Edit(paciente);
                }
                catch(Exception ex)
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


    }
}
