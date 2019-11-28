(function () {

    let options = {};
    let presetSessionStorage = () => {
        sessionStorage.setItem('FechaGrillaTurnos', new Date(2018, 2, 20));
        sessionStorage.setItem('VistaGrillaTurnos', 's');
    };

    let updating = () => {
        options.updating = true;
        options.divGrilla.querySelector('.procesando').style.display = 'block';
        if (options.intervalId) {
            clearInterval(options.intervalId);
        }
    };

    let updated = () => {
        options.divGrilla.querySelector('.procesando').style.display = 'none';
        options.intervalId = window.setInterval(sesionesIsUpdating, options.timeInterval);
        options.updating = false;
    };

    let loadFromSesionStorage = () => {
        let sesionST = {};
        if (sessionStorage) {
            sesionST.vista = sessionStorage.getItem('VistaGrillaTurnos');
            sesionST.fecha = sessionStorage.getItem('FechaGrillaTurnos');
            sessionStorage.removeItem('VistaGrillaTurnos');
            sessionStorage.removeItem('FechaGrillaTurnos');
        }
        return sesionST;
    };

    let renderAusencias = () => {
        let divAusencias = options.notificationBar.querySelector("#divAusenciasGrilla");
                
        if (!divAusencias) {
            divAusencias = document.createElement("div");
            options.notificationBar.appendChild(divAusencias);
        }
        
        divAusencias.id = "divAusenciasGrilla";
        if (options.ausencias && options.ausencias.length > 0) {


            let notifi = `<div class ="ausenciasProfesionalesComponent bar-component">
                <p>
                <span class="icon-stethoscope"></span>
            </p>
            <p>
                <ul>`;

            options.ausencias.forEach(s => {
                notifi += `<li>${s.Profesional} desde ${moment(s.FechaDesde).format("DD/MM/YYYY")} hasta ${moment(s.FechaHasta).format("DD/MM/YYYY")}</li>`;
            });

            notifi += `        </ul>
            </p></div>`;
            divAusencias.innerHTML = notifi;
        }
        else {
            divAusencias.innerHTML = "";
        }
    };

    let showModalAngularComponent = (modalName, elementName, value) => {

        modal = options.divGrilla.querySelector(modalName);
        if (modal) {
            if (Array.isArray(elementName)) {

                for (let pos = 0; pos < elementName.length; pos++) {
                    let elementID = modal.querySelector(elementName[pos]);
                    if (elementID) {
                        let evt = document.createEvent("HTMLEvents");
                        evt.initEvent("input", false, true);
                        if (elementID.value == value[pos]) {
                            elementID.value = 0;
                            elementID.dispatchEvent(evt);
                        }
                        elementID.value = value[pos];
                        elementID.dispatchEvent(evt);
                    }
                }
                $(modalName).modal("show");
            }
            else {
                let elementID = modal.querySelector(elementName);
                if (elementID) {
                    let evt = document.createEvent("HTMLEvents");
                    evt.initEvent("input", false, true);
                    if (elementID.value == value) {
                        elementID.value = 0;
                        elementID.dispatchEvent(evt);
                    }


                    elementID.value = value;
                    elementID.dispatchEvent(evt);

                    $(modalName).modal("show");
                }
            }

        }
    };

    let btnVistaHoy_Click = (e) => {
        e.preventDefault();
        e.stopPropagation();
        options.fechaDia = new Date();
        options.fecha = new Date();
        options.vista = 'd';
        dibujarGrilla();
    };

    //let btnVistaProximo_Click = (e) => {
    //    e.preventDefault();
    //    e.stopPropagation();
    //    options.fechaDia = new Date();
    //    options.fecha = new Date();
    //    options.vista = 'd';
    //    options.fecha = getNextDate(options.fechaDia);
    //    dibujarGrilla();
    //};

    let btnVistaDiaSemana_Click = (e) => {
        e.preventDefault();
        e.stopPropagation();
        options.fechaDia = new Date();
        options.fecha = new Date();
        options.vista = 'd';
        options.fecha = getDayOfWeek(options.fechaDia, e.target.dataset.dia);
        dibujarGrilla();
    };

    let btnVistaSemanal_Click = (e) => {
        e.preventDefault();
        e.stopPropagation();
        options.fechaSemana = new Date();
        options.fecha = new Date();
        options.vista = 's';
        dibujarGrilla();
    };

    //////////////////////////////////////
    let btnCantidadSesionesModal_click = e => {
        $("#cantidadSesionesModal").modal("hide");
        updating();
        let divCantidadSesiones = options.divGrilla.querySelector('#cantidadSesionesModal');
        e.preventDefault();
        e.stopPropagation();        
        let sobreturnos = [];
        let _turno = {
            "PacienteID": null,
            "Estado": 1,
            "Habilitado": true,
            "UsuarioModificacion": null,
            "FechaModificacion ": null,
            "CantidadSesiones": parseInt( divCantidadSesiones.querySelector("#cmbCantidadSesiones").value),
            "Diagnostico": "",
            "Fecha": new Date(),
            "Sesions": []
        };

        options.sesionesReservadas.forEach((s, i) => {
            s.sesiones.forEach(se => {
                let _sesion = {
                    "AgendaID": 1,
                    "TurnoID": null,
                    "Numero": i + 1,
                    "ConsultorioID": se.ConsultorioID,
                    "TurnoSimultaneo": se.TurnoSimultaneo,
                    "Estado": se.Estado,
                    "FechaHora": parseFechaHora(se.fecha, se.hora),
                    "Habilitado": true,
                    "UsuarioModificacion": null,
                    "FechaModificacion ": null
                };
                _turno.Sesions.push(_sesion);
            });
            if (s.sobreturno) {
                sobreturnos.push(i + 1);
            }
        });

        let params = {};
        params.model = _turno;
        params.sobreturnos = sobreturnos;

        let promise = ajaxPromise('POST', Domain + 'Sesion/Reservar', params);
        promise.then(data => {
            let turnoNuevo = JSON.parse(data);
            options.sesionesReservadas = [];
            showModalAngularComponent('#TurnoAsignarPacienteModal', '#TurnoID', turnoNuevo.ID);
            renderListaReservas();
            dibujarGrilla();            

        }
            , data => {
                showErrorMessage('Reservas', data);
                updated();
            });

        //'Sesion/Reservar'

        //renderListaReservas();
    };

    let btnPosponerSesion_click = e => {        
        e.stopPropagation();
        e.preventDefault();
        updating();
        $("#posponerTurnoModal").modal('hide');

        let modal = options.divGrilla.querySelector('#posponerTurnoModal');
        //e.target.removeEventListener('click', btnPosponerSesion_click);

        let turnoID = modal.dataset.turnoid;
        let numero = modal.dataset.numero;
        let motivo = modal.querySelector('#cmbMotivoPosponerTurno').value;
        let _sesiones = options.sesiones.filter(s => s.TurnoID == turnoID && s.Numero == numero);
        let _newSesiones = [];



        _sesiones.forEach(s => {
            s.Estado = motivo;
            delete s.sesiones;
        });

        _newSesiones = _newSesiones.concat(_sesiones);
        let url = Domain + "Sesion/Posponer";
        ////modificar aca ahora
        let promise = ajaxPromise("PUT", url, _newSesiones);
        promise.then(data => {
            //url = Domain + `Paciente/Turno/${turnoID}/IsSuperpuesto`;
            //let newPromise = ajaxPromise("PUT", url, _newSesiones);
            //newPromise.then(answer => {

            //});
            updated();
            showModalAngularComponent('#TurnoAsignarPacienteModal', '#TurnoID', turnoID);
            dibujarGrilla();
        }
            , data => {
                updated();
                showErrorMessage('Posponer Turno', data);
                dibujarGrilla();
            });


    };

    let clickReservarBloquear = e => {
        e.preventDefault();
        e.stopPropagation();
        let modal = options.divGrilla.querySelector("#bloquearReservarModal");        
        if (modal.dataset.bloquear=='true') {
            clickBloquear(e);
        }
        else {
            clickReservar(e);
        }
    };

    let clickReservar = e => {        
        updating();
        $('#bloquearReservarModal').modal('hide');
        let _cantidad = parseInt(modal.querySelector('#cmbSesiones').value);
        if (!validarReserva(modal.dataset.id)) {            
            updated();
            showErrorMessage('Reservas', 'Ya existe una reserva para ese día.');            
        }
        else {
            let _celdaID = CeldaIdToObject(modal.dataset.id);
            let _hora = _celdaID.hora;
            let sesionReserva = {
                "AgendaID": 1,
                "Aseguradora": "",
                "AseguradoraColor": "lightpink",
                "ConsultorioID": _celdaID.ConsultorioID,
                "Estado": 1,
                //"FechaHora": parseFechaHora(_celdaID.fecha, _hora),
                "FechaModificacion": new Date(),
                "Habilitado": true,
                "Numero": options.sesionesReservadas.length + 1,
                "Paciente": "",
                "PacienteID": "",
                "Plan": "",
                "TurnoID": 0,
                "TurnoSimultaneo": _celdaID.TurnoSimultaneo,
                "UsuarioModificacion": "",
                "fecha": _celdaID.fecha,
                "hora": _hora
            };

            sesionReserva.sesiones = [];

            for (let c = 0; c < _cantidad; c++) {
                sesionReserva.sesiones.push({
                    "AgendaID": 1,
                    "Aseguradora": "",
                    "AseguradoraColor": "lightpink",
                    "ConsultorioID": _celdaID.ConsultorioID,
                    "Estado": 1,
                    //"FechaHora": parseFechaHora(_celdaID.fecha, _hora),
                    "FechaModificacion": new Date(),
                    "Habilitado": true,
                    "Numero": options.sesionesReservadas.length + 1,
                    "Paciente": "",
                    "PacienteID": "",
                    "Plan": "",
                    "TurnoID": 0,
                    "TurnoSimultaneo": _celdaID.TurnoSimultaneo,
                    "UsuarioModificacion": "",
                    "fecha": _celdaID.fecha,
                    "hora": _hora
                });
                _hora = sesionSiguiente(_hora);
            }
            if (validarSesiones(sesionReserva.sesiones)) {
                renderSesion(sesionReserva);
                options.sesionesReservadas.push(sesionReserva);
                renderListaReservas();                
                updated();
            }
            else {                
                updated();
                showErrorMessage('Reservas', 'Existen sesiones ya asignadas a su seleccion.');
            }

        }

    };

    let clickBloquear = e => {        
        //e.target.removeEventListener('click', clickBloquear);
        $('#bloquearReservarModal').modal('hide');
        updating();
        let _cantidad = parseInt(modal.querySelector('#cmbSesiones').value);
        let _hora = modal.dataset.id.substr(modal.dataset.id.indexOf('H') + 1, 4);
        let _fecha = modal.dataset.id.substr(modal.dataset.id.indexOf('F') + 1, 8);
        let turnoBloqueo = {
            "PacienteID": null,
            "Estado": 1,
            "Habilitado": true,
            "UsuarioModificacion": null,
            "FechaModificacion ": null,
            "CantidadSesiones": 1,
            "Diagnostico": "",
            "Fecha": new Date(),
            "Sesions": []
        };

        for (let c = 0; c < _cantidad; c++) {
            turnoBloqueo.Sesions.push({
                "AgendaID": 1,
                "TurnoID": null,
                "Numero": 1,
                "ConsultorioID": modal.dataset.id.substr(modal.dataset.id.indexOf('C') + 1, modal.dataset.id.indexOf('S') - modal.dataset.id.indexOf('C') - 1),
                "TurnoSimultaneo": modal.dataset.id.split('S')[1],
                "Estado": 7,
                "FechaHora": parseFechaHora(_fecha, _hora),
                "Habilitado": true,
                "UsuarioModificacion": null,
                "FechaModificacion ": null
            });
            _hora = sesionSiguiente(_hora);
        }

        if (validarSesiones(turnoBloqueo.Sesions)) {
            let url = Domain + "Agenda/BloquearSesion";

            let promise = ajaxPromise("POST", url, turnoBloqueo);
            promise.then(data => {
                let _sesiones = JSON.parse(JSON.parse(data));
                _sesiones.map(e => {
                    e.FechaHora = moment(e.FechaHora).toDate();
                    e.FechaHora.setHours(e.FechaHora.getHours() - 3);
                    e.FechaHora = e.FechaHora.toISOString();
                });
                let _sesion = JSON.parse(JSON.stringify(_sesiones[0]));
                _sesion.sesiones = _sesiones;
                options.sesiones = options.sesiones.concat(_sesiones);
                renderSesion(_sesion);
                updated();
            }
                , data => {
                    showErrorMessage('Bloqueos', data);
                    updated();
                });

        }
        else {
            showErrorMessage('Bloqueos', 'Existen sesionesss ya asignadas a su seleccion.');
            updated();
        }
        


    };

    let clickCancelarSesion = e => {
        updating();
        e.preventDefault();
        e.stopPropagation();
        $('#cancelarSesionModal').modal('hide');

        if (modal.querySelector('#cmbCancelarSesion').value == 'true') {
            anularSesionesSiguientes(modal.dataset.sesionID);
        }
        else {
            setEstadoCancelado(modal.dataset.sesionID);
        }
        //dibujarGrilla();
    };



    //function CancelarReserva(celda) {
    function CancelarReserva(divReserva) {
        //let divReserva = celda.children[0];
        updating();
        if (divReserva.dataset.turnoid > 0) {
            anularSesionesPendientes(divReserva.dataset.turnoid);
            /*let url = Domain + 'Sesion/Reserva/Delete';
            let param = {};
            param.turnoID = divReserva.dataset.turnoid;
            let promise = ajaxPromise('DELETE', url, param);
            promise.then(data => dibujarGrilla()
                , data => {
                    showErrorMessage('Cancelar Reserva', data);
                    //dibujarGrilla();
                });*/
        }
        else {
            let celda = divReserva.parentElement;
            deleteSesionGrilla(celda);
            let id = CeldaIdToObject(celda.id);
            options.sesionesReservadas = options.sesionesReservadas.filter(sesion => sesion.fecha != id.fecha || sesion.hora != id.hora
                || sesion.ConsultorioID != id.ConsultorioID || sesion.TurnoSimultaneo != id.TurnoSimultaneo);
            renderListaReservas();            
            redibujarGrilla();
            updated();
        }

    }

    async function CancelarBloqueo(opt) {
        updating();
        let idSesion = opt.$trigger[0].dataset.id;
        setEstadoCancelado(idSesion);
        deleteSesionGrilla(options.tabla.querySelector(`#${opt.$trigger[0].id.split('D')[0]}`));
        options.sesiones = await getSesiones();
        updated();
    }

    let showModalBloquearReservar = (celdaId, action, title, bloquear) => {
        modal = options.divGrilla.querySelector("#bloquearReservarModal");
        modal.dataset.id = celdaId;
        modal.dataset.action = action;        
        modal.dataset.bloquear = bloquear;
        modal.querySelector('#bloquearReservarTitle').innerHTML = title;
        modal.querySelector('#cmbSesiones').value = 2;

        //modal.querySelector('#btnBloquearReservarModal').removeEventListener('click', clickReservar);
        //modal.querySelector('#btnBloquearReservarModal').removeEventListener('click', clickBloquear);

        //modal.querySelector('#btnBloquearReservarModal').addEventListener('click', bloquear ? clickBloquear : clickReservar);
        //modal.dataset.action = bloquear ? clickBloquear : clickReservar

        $('#bloquearReservarModal').modal();
    };


    let showModalCancelarSesion = (sesionID, turnoID) => {
        modal = options.divGrilla.querySelector('#cancelarSesionModal');
        modal.querySelector('#cmbCancelarSesion').value = 'false';
        modal.dataset.sesionID = sesionID;
        modal.dataset.turnoID = turnoID;
        //modal.querySelector('#btnCancelarSesionModal').removeEventListener('click', clickCancelarSesion);
        //modal.querySelector('#btnCancelarSesionModal').addEventListener('click', clickCancelarSesion);
        $('#cancelarSesionModal').modal();
    };



    ////////////////////

    let initModalListener = () => {
        let modals = [];
        //CancelarSesion
        modals.push({
            element: options.divGrilla.querySelector('#cancelarSesionModal'),
            evento : 'click',
            nombreObjeto: '#btnCancelarSesionModal',
            callback: clickCancelarSesion
        });        

        //PosponerSesion
        modals.push({
            element: options.divGrilla.querySelector('#posponerTurnoModal'),
            evento: 'click',
            nombreObjeto: '#btnPosponerTurno',
            callback: btnPosponerSesion_click
        });        

        //BloquearReservar
        modals.push({
            element: options.divGrilla.querySelector('#bloquearReservarModal'),
            evento: 'click',
            nombreObjeto: '#btnBloquearReservarModal',
            callback: clickReservarBloquear
        });        

        //CantidadDias
        modals.push({
            element: options.divGrilla.querySelector('#cantidadSesionesModal'),
            evento: 'click',
            nombreObjeto: '#btnCantidadSesionesModal',
            callback: btnCantidadSesionesModal_click
        });        

        modals.push({
            element: options.divGrilla,
            evento: 'click',
            nombreObjeto: '#btnVistaHoy',
            callback: btnVistaHoy_Click
        });        

        modals.push({
            element: options.divGrilla,
            evento: 'click',
            nombreObjeto: '#btnVistaSemanal',
            callback: btnVistaSemanal_Click
        });                                

        let btnsNavegacion = document.querySelectorAll("button[data-dia]");
        
        if (btnsNavegacion) {
            for (i = 0; i < btnsNavegacion.length; i++) {
                modals.push({
                    element: btnsNavegacion[i],
                    evento: 'click',
                    nombreObjeto: undefined,
                    callback: btnVistaDiaSemana_Click
                });                     
            }
        }

        modals.push({
            element: document,
            evento: 'UpdateTurnos',
            nombreObjeto: undefined,
            callback: dibujarGrilla
        });                     
        
                

        setlModalsItemsListener(modals);

    };

    let setlModalsItemsListener = (modals) =>
        modals.forEach(m => setModalItemListener(m));
    

    let setModalItemListener = (modal) => {
        let element = modal.nombreObjeto ? modal.element.querySelector(modal.nombreObjeto) : modal.element;        
        element.addEventListener(modal.evento, modal.callback);
    };

    let init = () => {        
        options.divGrilla = document.querySelector('#GrillaContent');

        let divGrillaContent = options.divGrilla.querySelector('#GrillaTableContent');
        options.notificationBar = document.querySelector('.notification-bar');        

        initModalListener();
        
        let sessionST = loadFromSesionStorage();        
        options.tabla = document.createElement('table');
        options.tabla.id = 'grillaTurnos';
        options.tabla.classList.add('grillaTurnos');
        //options.divGrilla.appendChild(options.tabla);

        divGrillaContent.appendChild(options.tabla);

        options.consultorios = [];
        options.horarios = [];
        options.dias = [];
        options.rangoDias = [];
        options.recesos = [];
        options.bloqueosAgenda = [];
        options.feriados = [];
        options.vista = 's';//'d'
        options.fecha = new Date();
        options.sesionesActual = '';      
        options.updating = false;
        options.timeInterval = 200000;

        options.duracionModulo = 30;

        options.fechaDia = new Date();
        options.fechaSemana = new Date();


        if (sessionST) {
            options.vista = sessionST.vista ? sessionST.vista : options.vista;
            options.fecha = sessionST.fecha ? new Date(sessionST.fecha) : options.fecha;
            options.fechaDia = sessionST.fecha ? new Date(sessionST.fecha) : options.fechaDia;
            options.fechaSemana = sessionST.fecha ? new Date(sessionST.fecha) : options.fechaSemana;
        }

        options.sesiones = [];
        options.sesionesReservadas = [];
        options.intervalId = undefined;
        dibujarGrilla();
        window.setTimeout(() => $('.modal-dialog').draggable({ handle: ".modal-header" }), 5000);
        $('.modal-dialog').draggable({ handle: ".modal-header" });        
    };
    //window.addEventListener('load', init());

    $(document).ready(function () {
        init();
    });
    

    function validarSesiones(_sesiones) {        
        return options.sesiones.findIndex(se =>
            se.ConsultorioID == _sesiones[0].ConsultorioID &&
            se.TurnoSimultaneo == _sesiones[0].TurnoSimultaneo &&
            se.fecha == _sesiones[0].fecha &&
            parseInt(se.hora) >= parseInt(_sesiones[0].hora) &&
            parseInt(se.hora) <= parseInt(_sesiones[_sesiones.length - 1].hora) &&
            !(se.Numero == _sesiones[0].Numero &&
            se.TurnoID == _sesiones[0].TurnoID)

        ) === -1 ? true : false;

    }


    let validarReserva = (id) => {
        let celdaId = CeldaIdToObject(id);
        return options.sesionesReservadas.findIndex(sesion => sesion.fecha == celdaId.fecha) < 0;
    };

    let parseFechaHora = (_fecha, _hora) =>
        new Date(_fecha.substr(0, 4) + '-' + _fecha.substr(4, 2) + '-' + _fecha.substr(6, 2)
            + 'T' + _hora.substr(0, 2) + ':' + _hora.substr(2, 2) + ':00-03:00');




    function showErrorMessage(title, errorMessage) {
        let modalError = options.divGrilla.querySelector("#errorModal");
        modalError.querySelector("#errorModalTitle").innerHTML = title;
        modalError.querySelector("#errorModalMessage").innerHTML = errorMessage;
        $('#errorModal').modal();
    }

    async function sesionesIsUpdating() {
        console.log(new Date());
        if (options.updating === false) {
            if (options.intervalId) {
                window.clearInterval(options.intervalId);
            }
            let mfecha = JSON.stringify(options.fecha);
            let mvista = JSON.stringify(options.vista);
            let awSesiones = getSesiones();
            let newSesiones = await awSesiones;
            if (options.sesionesActual !== JSON.stringify(newSesiones)
                && mfecha === JSON.stringify(options.fecha)
                && mvista === JSON.stringify(options.vista)
            ) {
                dibujarGrillaSesiones(newSesiones);
            }
            else {
                options.intervalId = window.setInterval(sesionesIsUpdating, options.timeInterval);
            }
        }
        else {
            if (options.intervalId) {
                window.clearInterval(options.intervalId);
            }
            options.intervalId = window.setInterval(sesionesIsUpdating, options.timeInterval);
        }
    }

    async function dibujarGrilla() {        
       
        updating();
        let awConsultorios = getConsultorios();
        let awRangoHorario = getRangoHorario();
        let awRangoFecha = getRangoFecha();            

        
        options.consultorios = await awConsultorios;
        options.horarios = await awRangoHorario;
        options.dias = await awRangoFecha;

        let awSesiones = getSesiones();
        let awRecesos = getRecesos();
        let awFeriados = getFeriados();
        let awAusencias = getAusencias();

        options.sesiones = await awSesiones;
        options.sesionesActual = JSON.stringify(options.sesiones);
        options.recesos = await awRecesos;
        options.feriados = await awFeriados;
        options.ausencias = await awAusencias;


        options.bloqueosAgenda = [];

        redibujarGrilla();
        
        //renderGrilla();
        //renderReservado();
        //setCeldasDroppable();
        //setDivsDraggable();        
        //updated();
        //removeContextMenu();
        //setContextMenu();
        //options.tabla.querySelector('#btnPrintDia').addEventListener('click', e => createPDF(options.tabla));        
    }

    async function dibujarGrillaSesiones(sesiones) {        
        updating();
        options.sesionesActual = JSON.stringify(sesiones);
        options.sesiones = sesiones;                
        redibujarGrilla();
        //renderGrilla();
        //renderReservado();
        //setCeldasDroppable();
        //setDivsDraggable();
        //updated();
        //removeContextMenu();
        //setContextMenu();
        //options.tabla.querySelector('#btnPrintDia').addEventListener('click', e => createPDF(options.tabla));
    }

    function redibujarGrilla() {
        updating();
        renderGrilla();
        renderReservado();
        setCeldasDroppable();
        setDivsDraggable();
        //options.divGrilla.querySelector('.procesando').style.display = 'none';
        removeContextMenu();
        setContextMenu();
        options.tabla.querySelector('#btnPrintDia').addEventListener('click', e => createPDF(options.tabla));
        renderAusencias();
        updated();
    }

    function renderListaReservas() {
        let btnDivReservasCancelar_click = e => {
            e.preventDefault();
            e.stopPropagation();
            options.sesionesReservadas.forEach(e => deleteSesionGrilla(options.tabla.querySelector('#' + SesionToCeldaId(e))));
            options.sesionesReservadas = [];
            renderListaReservas();
            redibujarGrilla();
        };

       

        let btnDivReservasAceptar_click = e => {
            e.preventDefault();
            e.stopPropagation();
            divCantidadSesiones.querySelector("#cmbCantidadSesiones").value = options.sesionesReservadas.length <= 20 ? options.sesionesReservadas.length : 20;
            //divCantidadSesiones.querySelector('#btnCantidadSesionesModal').removeEventListener('click', btnCantidadSesionesModal_click);
            //divCantidadSesiones.querySelector('#btnCantidadSesionesModal').addEventListener('click', btnCantidadSesionesModal_click);
            $("#cantidadSesionesModal").modal("show");

        };
        let divCantidadSesiones = options.divGrilla.querySelector('#cantidadSesionesModal');

        let divReservas = options.divGrilla.querySelector('#divReservas');
        divReservas.innerHTML = "";
        if (options.sesionesReservadas.length > 0) {
            let innerDiv = `<p><span class='icon-calendar'>${options.sesionesReservadas.length}</span>
                                    
                                    <span id="btnDivReservasCancelar" class="icon-cancel"></span>
                                    <span id="btnDivReservasAceptar" class="icon-ok"></span>
                                    <span>&nbsp</span>
                                </p>
                                <ul>`;
            options.sesionesReservadas.sort((a, b) => parseInt(a.fecha) - parseInt(b.fecha));            
            options.sesionesReservadas.forEach(e => {
                let _fecha = e.fecha.substr(6, 2) + '/' + e.fecha.substr(4, 2) + '/' + e.fecha.substr(0, 4);
                let _desde = e.hora.substr(0, 2) + ':' + e.hora.substr(2, 2);
                let _hasta = sesionSiguiente(e.sesiones[e.sesiones.length - 1].hora);
                _hasta = _hasta.substr(0, 2) + ':' + _hasta.substr(2, 2);                
                innerDiv += `<li>${e.Numero} ${_fecha} ${_desde} a ${_hasta} </li >`;
            });
            innerDiv += "</ul>";
            divReservas.innerHTML = innerDiv;
            divReservas.querySelector("#btnDivReservasCancelar").addEventListener("click", btnDivReservasCancelar_click);
            divReservas.querySelector("#btnDivReservasAceptar").addEventListener("click", btnDivReservasAceptar_click);
            divReservas.classList.add('show');
        }
        else {
            divReservas.classList.remove('show');
        }
    }

    function addListener() {
        $('#ddatepicker').datepicker({
            format: "dd/mm/yyyy",
            weekStart: 1,
            language: "es",
            daysOfWeekDisabled: "0,6",
            autoclose: true
        });
        $('#ddatepicker').datepicker()
            .on('changeDate', function (e) {
                //options.fecha = e.target.getDate()
                if (options.vista == 'd') {
                    options.fechaDia = $('#ddatepicker').datepicker('getDate');
                    options.fecha = $('#ddatepicker').datepicker('getDate');

                }
                else {
                    options.fechaSemana = $('#ddatepicker').datepicker('getDate');
                    options.fecha = $('#ddatepicker').datepicker('getDate');
                }
                dibujarGrilla();
            });

        $('#ddatepickerP').datepicker({
            format: "dd/mm/yyyy",
            weekStart: 1,
            language: "es",
            daysOfWeekDisabled: "0,6",
            autoclose: true
        });
        $('#ddatepickerP').datepicker()
            .on('changeDate', function (e) {
                //options.fecha = e.target.getDate()

                options.fechaDia = $('#ddatepickerP').datepicker('getDate');
                options.fecha = $('#ddatepickerP').datepicker('getDate');
                dibujarGrilla();
            });

        let calendario = options.tabla.querySelector('#calendarioSesion');
        calendario.addEventListener("change", function (e) {
            e.preventDefault();
            e.stopPropagation();

            //options.fecha = getPrevDate(options.vista == 's' ? options.fechaSemana : options.fechaDia);
            //dibujarGrilla();
        });

        let elements = options.tabla.querySelectorAll('.ref-dia');
        for (var i = 0, total = elements.length; i < total; i++) {
            elements[i].addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (options.vista == 's') {
                    let vFecha = e.target.dataset.fecha.split('/');
                    options.fechaDia = new Date(parseInt(vFecha[2]), parseInt(vFecha[1]) - 1, parseInt(vFecha[0]));
                    options.fecha = options.fechaDia;
                    options.vista = 'd';
                }
                else {
                    options.fecha = options.fechaSemana;
                    options.vista = 's';
                }
                dibujarGrilla();
            });
        }

        elements = options.tabla.querySelectorAll('.celda-turno');
        elements.forEach(e => setElementMarkRowCol(e));

        let boton = options.tabla.querySelector('#btnAnterior');

        boton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            options.fecha = getPrevDate(options.vista == 's' ? options.fechaSemana : options.fechaDia);
            dibujarGrilla();
        });

        boton = options.tabla.querySelector('#btnSiguiente');

        boton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            options.fecha = getNextDate(options.vista == 's' ? options.fechaSemana : options.fechaDia);
            dibujarGrilla();
        });

    }

    function getNextDate(currentDate) {
        currentDate.setDate(currentDate.getDate() + (options.vista == 's' ? 7 : 1));

        while (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return currentDate;
    }

    function getDayOfWeek(currentDate, dayWeek) {
        currentDate.setDate(currentDate.getDate() + 1);

        while (currentDate.getDay() != dayWeek) {
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return currentDate;
    }

    function getPrevDate(currentDate) {
        currentDate.setDate(currentDate.getDate() - (options.vista == 's' ? 7 : 1));
        if (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
            currentDate = getPrevDate(currentDate);
        }
        return currentDate;
    }

    function setElementMarkRowCol(e) {
        let eID = e.id.split('D')[0];
        let idCol = eID.substr(0, 9) + eID.substr(14, e.id.indexOf('S') - 14);
        let idRow = eID.substr(9, 5);
        e.idCol = idCol;
        e.idRow = idRow;
        e.addEventListener('mouseover', ColRowAddClass);
        e.addEventListener('mouseout', ColRowRemoveClass);

        function ColRowAddClass(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            let col = options.tabla.querySelector('#' + ev.target.idCol);
            let row = options.tabla.querySelector('#' + ev.target.idRow);
            if (col && row) {
                col.classList.add('hover-title');
                row.classList.add('hover-title');
            }
        }

        function ColRowRemoveClass(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            let col = options.tabla.querySelector('#' + ev.target.idCol);
            let row = options.tabla.querySelector('#' + ev.target.idRow);
            if (col && row) {
                col.classList.remove('hover-title');
                row.classList.remove('hover-title');
            }
        }
    }

    function removeContextMenu() {
        $.contextMenu('destroy');
    }

    function CeldaIdToObject(idCelda) {
        let objectID = {
            "fecha": idCelda.substr(idCelda.indexOf('F') + 1, 8),
            "hora": idCelda.substr(idCelda.indexOf('H') + 1, 4),
            "ConsultorioID": idCelda.substr(idCelda.indexOf('C') + 1, idCelda.indexOf('S') - idCelda.indexOf('C') - 1),
            "TurnoSimultaneo": idCelda.split('S')[1]
        };
        return objectID;
    }

    function SesionToCeldaId(sesion) {
        return `F${sesion.fecha}H${sesion.hora}C${sesion.ConsultorioID}S${sesion.TurnoSimultaneo}`;
    }


    function setContextMenu() {
        let modal = options.divGrilla.querySelector("#bloquearReservarModal");

        (function setContext() {
            //Libre
            $.contextMenu({
                selector: '.celda-turno[data-estado=0]',
                callback: contextMenuClick,
                items: {
                    "reservar": { name: "Reservar", icon: "" },
                    "bloquear": { name: "Bloquear", icon: "" }
                }
            });

            //Reservado Confirmado
            $.contextMenu({
                selector: '.div-turno[data-estado=1][data-turnoid!=0]',
                callback: contextMenuClick,
                items: {
                    "asignarPaciente": { name: "Asignar Paciente", icon: "" },
                    "cancelar": { name: "Cancelar", icon: "" }
                }
            });

            //Reservado sin Confirmar
            $.contextMenu({
                selector: '.div-turno[data-estado=1][data-turnoid=0]',
                callback: contextMenuClick,
                items: {
                    "cancelar": { name: "Cancelar", icon: "" }
                }
            });

            //Confirmado
            //$.contextMenu({
            //    selector: '.div-turno[data-estado=2]',
            //    callback: contextMenuClick,
            //    items: {
            //        "paciente": {name:"Paciente", id:'pct', icon: ""},
            //        "asistio": { name: "Asistio", icon: "" },
            //        "noAsistio": { name: "No Asistio", icon: "" },
            //        "anularSesion": { name: "Cancelar Sesion", icon: "" },
            //        "cambiarTurno": { name: "CambiarTurno", icon: "" },
            //        "posponer": { name: "Posponer", icon: "" },
            //        "sep1": "---------",
            //        "datosPaciente": { name: "Paciente", icon: "" },
            //        "datosSesiones": { name: "Sesiones", icon: "" },
            //        "datosTurno": { name: "Turno", icon: "" }
            //    }
            //});

            $.contextMenu({
                selector: '.div-turno[data-estado=2]',
                build: function ($triggerElement, e) {
                    return {
                        callback: contextMenuClick,
                        items: {
                            "paciente": { name: `${$triggerElement[0].title}`, icon: "", className: 'font-weight-bold' },
                            "sep1": "---------",
                            "asistio": { name: "Asistio", icon: "" },
                            "noAsistio": { name: "No Asistio", icon: "" },
                            "anularSesion": { name: "Cancelar Sesion", icon: "" },
                            "cambiarTurno": { name: "CambiarTurno", icon: "" },
                            "posponer": { name: "Posponer", icon: "" },
                            "sep2": "---------",
                            //"datosPaciente": { name: "Paciente", icon: "" },
                            "datosSesiones": { name: "Sesiones", icon: "" },
                            "datosTurno": { name: "Turno", icon: "" },
                            "sep3": {
                                "type": "cm_separator",
                                visible: function (key, opt) {
                                    let disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            },
                            "sobreTurno": {
                                name: "Sobre Turno",
                                visible: function (key, opt) {
                                    let disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            }
                        }
                    };
                }
            });

            //Asistio
            $.contextMenu({
                selector: '.div-turno[data-estado=4]',
                build: function ($triggerElement, e) {
                    return {
                        callback: contextMenuClick,
                        items: {
                            "paciente": { name: `${$triggerElement[0].title}`, icon: "", className: 'font-weight-bold' },
                            "sep2": "---------",
                            "confirmado": { name: "Confirmado", icon: "" },
                            "noAsistio": { name: "No Asistio", icon: "" },
                            "sep1": "---------",
                            //"datosPaciente": { name: "Paciente", icon: "" },
                            "datosSesiones": { name: "Sesiones", icon: "" },
                            "datosTurno": { name: "Turno", icon: "" },
                            "sep3": {
                                "type": "cm_separator",
                                visible: function (key, opt) {
                                    let disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            },
                            "sobreTurno": {
                                name: "Sobre Turno",
                                visible: function (key, opt) {
                                    let disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            }
                        }
                    };
                }
            });

            //No Asistio
            $.contextMenu({
                selector: '.div-turno[data-estado=5]',
                build: function ($triggerElement, e) {
                    return {
                        callback: contextMenuClick,
                        items: {
                            "paciente": { name: `${$triggerElement[0].title}`, icon: "", className: 'font-weight-bold' },
                            "sep2": "---------",
                            "confirmado": { name: "Confirmado", icon: "" },
                            "asistio": { name: "Asistio", icon: "" },
                            "sep1": "---------",
                            //"datosPaciente": { name: "Paciente", icon: "" },
                            "datosSesiones": { name: "Sesiones", icon: "" },
                            "datosTurno": { name: "Turno", icon: "" },
                            "sep3": {
                                "type": "cm_separator",
                                visible: function (key, opt) {
                                    let disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            },
                            "sobreTurno": {
                                name: "Sobre Turno",
                                visible: function (key, opt) {
                                    let disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            }
                        }
                    };
                }
            });

            //Bloqueado
            $.contextMenu({
                selector: '.div-turno[data-estado=7]',
                callback: contextMenuClick,
                items: {
                    "asignarPaciente": { name: "Asignar Paciente", icon: "" },
                    "cancelar": { name: "Cancelar", icon: "" }
                }
            });

            /*$.contextMenu({
                selector: '.celda-turno[data-estado=0]',
                callback: contextMenuClick,
                items: {
                    "reservar": { name: "Reservar", icon: "" },
                    "bloquear": { name: "Bloquear", icon: "" },
                    "cancelar": { name: "Cancelar", icon: "" },
                    "asistio": { name: "Asistio", icon: "" },
                    "noAsistio": { name: "No Asistio", icon: "" },
                    "anularSesion": { name: "Anular Sesion", icon: "" },
                    "cambiarTurno": { name: "CambiarTurno", icon: "" },
                    "posponer": { name: "Posponer", icon: "" },
                    "confirmado": { name: "Confirmado", icon: "" },
                    "asignarPaciente": { name: "Asignar Paciente", icon: "" },
                    "sep1": "---------",
                    "datosPaciente": { name: "Paciente", icon: "" },
                    "datosSesiones": { name: "Sesiones", icon: "" }
                }
            });*/

            $.contextMenu({
                selector: '.celda-turno[data-estado=0]',
                callback: contextMenuClick,
                items: {
                    "reservar": { name: "Reservar", icon: "" },
                    "bloquear": { name: "Bloquear", icon: "" },
                    "cancelar": { name: "Cancelar", icon: "" },
                    "asistio": { name: "Asistio", icon: "" },
                    "noAsistio": { name: "No Asistio", icon: "" },
                    "anularSesion": { name: "Anular Sesion", icon: "" },
                    "cambiarTurno": { name: "CambiarTurno", icon: "" },
                    "posponer": { name: "Posponer", icon: "" },
                    "confirmado": { name: "Confirmado", icon: "" },
                    "asignarPaciente": { name: "Asignar Paciente", icon: "" },
                    "sep1": "---------",
                    "datosPaciente": { name: "Paciente", icon: "" },
                    "datosSesiones": { name: "Sesiones", icon: "" },
                    "datosTurno": { name: "Turno", icon: "" }
                }
            });
        })();

        function validarFechaEstado(idcol) {
            let fecha = new Date(parseInt(idcol.substring(1, 5)), parseInt(idcol.substring(5, 7)) - 1, parseInt(idcol.substring(7, 9)));
            let fecha2 = new Date();
            return fecha <= fecha2;
        }

        function contextMenuClick(key, opt, e) {
            switch (key) {
                case 'reservar':
                    showModalBloquearReservar(opt.$trigger[0].id, 'R', 'Reservar Turno', false);
                    break;
                case 'bloquear':
                    showModalBloquearReservar(opt.$trigger[0].id, 'B', 'Bloquear', true);
                    break;
                case 'cancelar':
                    if (opt.$trigger[0].dataset.estado == 7) {
                        CancelarBloqueo(opt);
                    }
                    else {
                        CancelarReserva(opt.$trigger[0]);
                    }
                    break;
                case 'asistio':                                        
                    if (validarFechaEstado(opt.$trigger[0].id)) {
                        setEstadoAsistio(opt.$trigger[0].dataset.id);
                    }
                    
                    break;
                case 'noAsistio':
                    if (validarFechaEstado(opt.$trigger[0].id)) {
                        setEstadoNoAsistio(opt.$trigger[0].dataset.id);
                    }                    
                    break;
                case 'anularSesion':
                    showModalCancelarSesion(opt.$trigger[0].dataset.id, opt.$trigger[0].dataset.turnoid);
                    break;
                case 'cambiarTurno':
                    showModalAngularComponent('#EditSesionGrilla', '#dSesionID', opt.$trigger[0].dataset.id);
                    break;

                case 'datosPaciente':
                    showModalAngularComponent('#agendaViewPaciente', '#hPacienteID', opt.$trigger[0].dataset.pacienteid);
                    break;

                case 'paciente':
                    showModalAngularComponent('#agendaViewPaciente', '#hPacienteID', opt.$trigger[0].dataset.pacienteid);
                    break;

                case 'datosSesiones':
                    //showModalAngularComponent('#sesionesPacienteModal', '#PacienteID', opt.$trigger[0].dataset.pacienteid);
                    showModalAngularComponent('#DatosSesiones', ['#TurnoID', '#PacienteID'], [opt.$trigger[0].dataset.turnoid, opt.$trigger[0].dataset.pacienteid]);
                    break;

                case 'datosTurno':
                    showModalAngularComponent('#sesionesPacienteModal', ['#TurnoID', '#PacienteID'], [opt.$trigger[0].dataset.turnoid, opt.$trigger[0].dataset.pacienteid]);
                    //showModalAngularComponent('#TurnoAsignarPacienteModal', '#TurnoID', opt.$trigger[0].dataset.turnoid);
                    break;

                case 'sobreTurno':
                    let parentNode = opt.$trigger[0].parentNode;
                    let _cantidad = parseInt(parentNode.rowSpan);
                    if (!validarReserva(parentNode.id)) {
                        showErrorMessage('Reservas', 'Ya existe una reserva para ese día.');
                    }
                    else {
                        let _celdaID = CeldaIdToObject(parentNode.id);                        
                        parentNode.dataset.sobreturno = "true";
                        let _hora = _celdaID.hora;
                        let sesionReserva = {
                            "AgendaID": 1,
                            "Aseguradora": "",
                            "AseguradoraColor": "lightpink",
                            "ConsultorioID": _celdaID.ConsultorioID,
                            "Estado": 1,
                            //"FechaHora": parseFechaHora(_celdaID.fecha, _hora),
                            "FechaModificacion": new Date(),
                            "Habilitado": true,
                            "Numero": options.sesionesReservadas.length + 1,
                            "Paciente": "",
                            "PacienteID": "",
                            "Plan": "",
                            "TurnoID": 0,
                            "TurnoSimultaneo": _celdaID.TurnoSimultaneo,
                            "UsuarioModificacion": "",
                            "fecha": _celdaID.fecha,
                            "hora": _hora,
                            "sobreturno": true
                        };

                        sesionReserva.sesiones = [];

                        for (let c = 0; c < _cantidad; c++) {
                            sesionReserva.sesiones.push({
                                "AgendaID": 1,
                                "Aseguradora": "",
                                "AseguradoraColor": "lightpink",
                                "ConsultorioID": _celdaID.ConsultorioID,
                                "Estado": 1,
                                //"FechaHora": parseFechaHora(_celdaID.fecha, _hora),
                                "FechaModificacion": new Date(),
                                "Habilitado": true,
                                "Numero": options.sesionesReservadas.length + 1,
                                "Paciente": "",
                                "PacienteID": "",
                                "Plan": "",
                                "TurnoID": 0,
                                "TurnoSimultaneo": _celdaID.TurnoSimultaneo,
                                "UsuarioModificacion": "",
                                "fecha": _celdaID.fecha,
                                "hora": _hora
                            });
                            _hora = sesionSiguiente(_hora);
                        }
                        //    //if (validarSesiones(sesionReserva.sesiones)) {
                        renderSesion(sesionReserva);
                        options.sesionesReservadas.push(sesionReserva);
                        renderListaReservas();

                        //    //}
                        //    //else {
                        //    //    $('#bloquearReservarModal').modal('hide');
                        //    //    showErrorMessage('Reservas', 'Existen sesiones ya asignadas a su seleccion.');
                        //    //}

                    }
                    break;

                case 'posponer':
                    modal = options.divGrilla.querySelector('#posponerTurnoModal');
                    //let btn = modal.querySelector('#btnPosponerTurno');
                    //btn.removeEventListener('click', btnPosponerSesion_click);
                    //btn.addEventListener('click', btnPosponerSesion_click);
                    modal.dataset.turnoid = opt.$trigger[0].dataset.turnoid;
                    modal.dataset.numero = opt.$trigger[0].dataset.numero;
                    $('#posponerTurnoModal').modal('show');
                    break;

                case 'confirmado':
                    setEstadoConfirmado(opt.$trigger[0].dataset.id);
                    break;

                case 'asignarPaciente':
                    showModalAngularComponent('#TurnoAsignarPacienteModal', '#TurnoID', opt.$trigger[0].dataset.turnoid);
                    break;
            }
        }
    }

    function getTotalConsultorios(consultorios) {
        return consultorios.reduce((a, b) => a + b.TurnosSimultaneos, 0);
    }

    /**
     * Render Grilla
     */

    function getCaption() {
        return `<caption style="caption-side:top;" class="mb-0 pb-0" >
                        <nav class="mb-0 pb-0 badge-light">
                            <ul class="pagination justify-content-center mb-0 pb-0 badge-light">
                                <li class="page-item mb-0 badge-light text-left">
                                    <button class="page-link mb-0 badge-light" id="btnAnterior">anterior</button>
                                </li>
                                <li class="page-item mb-0 badge-light w-100 text-center">
                                    <div class="page-link mb-0 badge-light font-weight-bold">
                                    ${options.vista == "s" ? "Semana  " + options.dias[0].Fecha + " al " + options.dias[4].Fecha
                : "Día " + options.dias[0].Fecha}
                                    <div class="input-group date" id="ddatepicker" data-provide="datepicker"  style="display:inline;">
                                        <input type="hidden" class="form-control date-picker" id="calendarioSesion">
                                        <div class="input-group-addon"  style="display:inline;">
                                            <span class="icon-calendar"></span>
                                        </div>
                                    </div>
                                    <span style="cursor:pointer" class="icon-print" id="btnPrintDia"></span>
                                    </div>
                                </li>
                                <li class="page-item mb-0 badge-light text-right">
                                    <button class="page-link mb-0 badge-light" id="btnSiguiente" style="display:block" >siguiente</button>
                                </li>
                            </ul>
                        </nav>
                    </caption>`;
    }

    function renderGrilla() {
        let tablaInner = '<thead>';
        let totalCol = 0;
        tablaInner += `<tr><td rowspan="2" style="width:auto;margin:0px;padding:0px">Hora</td>`;
        options.dias.forEach(d => {
            tablaInner += `<td colspan=${getTotalConsultorios(options.consultorios)} class="center ref-dia etiqueta-dia" data-fecha="${d.Fecha}">${d.Name}<br>${d.Fecha}</td>`;
            //tablaInner += `<td colspan=${getTotalConsultorios(options.consultorios)} class="center"><span class='etiqueta-dia'>${d.Name}</span> <br> <a href="#" class='ref-dia' data-fecha="${d.Fecha}">${d.Fecha}</a></td>`;
        });

        tablaInner += `</tr><tr>`;

        options.dias.forEach(d => {
            let fechaID = d.Fecha.split('/')[2] + d.Fecha.split('/')[1] + d.Fecha.split('/')[0];
            options.consultorios.forEach(e => {
                tablaInner += `<td class="tabla-consultorio" id="F${fechaID}C${e.ID}" colspan="${e.TurnosSimultaneos}">${e.Descripcion}</td>`;
                totalCol += e.TurnosSimultaneos;
            });
        });

        tablaInner += `</tr></thead><tbody>`;

        options.horarios.forEach(e => {
            let horaID = e.replace(':', '');
            tablaInner += `<tr>
                        <td class="tabla-horario" id="H${horaID}">${e}</td>
                        `;
            options.dias.forEach(d => {
                if (options.recesos.findIndex(r => r.Fecha == d.Fecha) >= 0) {
                    if (e == options.horarios[0]) {
                        tablaInner += `<td class="turno-receso"
                                        id="${d.Fecha}R$"
                                        width:${100 / options.dias.length}%'
                                        rowSpan="${options.horarios.length}" colSpan="${totalCol / options.dias.length}"><p>RECESO</p></td>`;
                    }
                }
                else {
                    if (options.feriados.findIndex(r => r.Fecha == d.Fecha) >= 0) {
                        if (e == options.horarios[0]) {
                            tablaInner += `<td class="turno-feriado"
                                        id="${d.Fecha}R$"
                                        width:${100 / options.dias.length}%'
                                        rowSpan="${options.horarios.length}" colSpan="${totalCol / options.dias.length}"><p>FERIADO</p></td>`;
                        }
                    }
                    else {
                        let fechaID = d.Fecha.split('/')[2] + d.Fecha.split('/')[1] + d.Fecha.split('/')[0];
                        options.consultorios.forEach(c => {
                            let celdaID = 'F' + fechaID + 'H' + horaID + 'C' + c.ID;
                            for (let i = 1; i <= c.TurnosSimultaneos; i++) {
                                tablaInner += `<td class="celda-turno turno-vacio celda-droppable"
                                        id="${celdaID}S${i}" style='background-color:${c.Color};
                                        width:${100 / totalCol}%' data-estado="0" data-bk="${c.Color}"></td>`;
                            }
                        });
                    }
                }

            });

            tablaInner += '</tr>';
        });
        tablaInner += '</tbody>';

        options.tabla.innerHTML = getCaption() + tablaInner;
        addListener();
        renderSesiones();
        renderBloqueosAgenda();
    }

    function renderReservado() {
        options.sesionesReservadas.forEach(sesion => {

            renderSesion(sesion);
        });
    }

    function renderSesiones() {
        let _sesiones = options.sesiones.filter((value, index, self) =>
            self.findIndex(element => element.TurnoID == value.TurnoID && element.Numero == value.Numero && element.Estado == value.Estado) == index);

        _sesiones.forEach(mValue => mValue.sesiones = options.sesiones.filter(fValue => mValue.TurnoID == fValue.TurnoID && mValue.Numero == fValue.Numero
            && fValue.ConsultorioID == mValue.ConsultorioID && fValue.TurnoSimultaneo == mValue.TurnoSimultaneo)
            //.sort((a, b) => a.ID - b.ID)
        );
        //.sort((a, b) => a.ID - b.ID)


        _sesiones.forEach(sesion => {
            renderSesion(sesion);
        });

    }

    function renderSesion(sesion) {
        let rCelda;
        let rowSpan = sesion.sesiones.length;
        sesion.fecha = sesion.fecha ? sesion.fecha : sesion.FechaHora.split('T')[0].replace(/-/g, '');
        sesion.hora = sesion.hora ? sesion.hora : sesion.FechaHora.split('T')[1].substr(0, 5).replace(':', '');


        let celSesionID = `#F${sesion.fecha}H${sesion.hora}C${sesion.ConsultorioID}S${sesion.TurnoSimultaneo}`;

        for (let i = 0, t = sesion.sesiones.length; i < t; i++) {
            let vFecha = sesion.sesiones[i].FechaHora ? sesion.sesiones[i].FechaHora.split('T') : [];
            sesion.sesiones[i].fecha = sesion.sesiones[i].fecha ? sesion.sesiones[i].fecha : vFecha[0].replace(/-/g, '');
            sesion.sesiones[i].hora = sesion.sesiones[i].hora ? sesion.sesiones[i].hora : vFecha[1].substr(0, 5).replace(':', '');
            let idCelda = `#F${sesion.fecha}H${sesion.sesiones[i].hora}C${sesion.ConsultorioID}S${sesion.TurnoSimultaneo}`;
            let celda = options.tabla.querySelector(idCelda);
            if (celda) {
                celda.dataset.sesionId = `${celSesionID}NS${i + 1}`;
                if (i == 0) {

                    //if (celda.style.display == 'none' || celda.classList.contains('turno-tomado')) {
                    if (celda.dataset.parentid) {
                        idCelda = celda.dataset.parentid;
                        //celda.style.display = "flex";

                        celda = options.tabla.querySelector(idCelda);
                        celda.dataset.print = celda.dataset.print ? celda.dataset.print + '\n' : "";
                        celda.dataset.print += sesion.Estado == 7 ? 'BLOQUEADO' : sesion.Estado == 1 ? 'RESERVADO' :
                            `${sesion.Paciente}\n${sesion.Numero} / ${sesion.CantidadSesiones}`;
                        celda.dataset.sobreturno = "true";
                        rCelda = options.tabla.querySelector(idCelda);
                        let divId = idCelda.replace('#', '') + 'D' + sesion.ID;
                        celda.innerHTML += getDivTurno(divId, sesion);
                        celda.innerHTML = celda.innerHTML.replace(/h-100/g, "h-50");
                        setElementMarkRowCol(options.tabla.querySelector('#' + divId));
                        i = t;
                        removeCeldaDroppable(celda);
                    }
                    else {

                        //celda.style.backgroundColor = sesion.Estado == 7 ? 'blue' : sesion.AseguradoraColor;
                        celda.classList.add('turno-tomado');
                        celda.dataset.estado = sesion.Estado;
                        celda.classList.remove('turno-vacio');
                        celda.dataset.parentid = idCelda;
                        celda.dataset.sobreturno = sesion.DobleOrden ? "true" : "false";
                        celda.dataset.print = celda.dataset.print ? celda.dataset.print + '\n' : "";
                        celda.dataset.print += sesion.Estado == 7 ? 'BLOQUEADO' : sesion.Estado == 1 ? 'RESERVADO' :
                            `${sesion.Paciente}\n${sesion.Numero} / ${sesion.CantidadSesiones}`;


                        //if (sesion.Estado == 2) {
                        //    removeCeldaDroppable(celda);
                        //}
                        celda.rowSpan = rowSpan;
                        let divId = idCelda.replace('#', '') + 'D' + sesion.ID;
                        celda.innerHTML = getDivTurno(divId, sesion);
                        setElementMarkRowCol(options.tabla.querySelector('#' + divId));
                        if (sesion.DobleOrden) {
                            removeCeldaDroppable(celda);
                        }
                    }
                }
                else {

                    if (celda.dataset.parentid || celda.innerHTML.includes("div")) {
                        //options.divGrilla.querySelector(celSesionID).rowSpan = i;
                        i = t;
                    }
                    else {
                        celda.style.display = 'none';
                        celda.dataset.parentid = idCelda;
                    }

                }
            }

        }
    }

    function getDivTurno(divId, _sesion) {
        //${_sesion.Estado == 2 ? 'celda-droppable' : '' } "
        let divCelda = `<div id=${divId} class="div-turno h-100 align-middle"
                            style="background-color:${_sesion.Estado == 7 ? 'blue' : _sesion.AseguradoraColor};
                            color:${_sesion.Estado == 7 ? '#fff' : '#000'}"
                            draggable="${_sesion.Estado == 2 ? true : false}"
                            data-id=${_sesion.ID} data-estado=${_sesion.Estado}
                            data-turnoid=${_sesion.TurnoID} data-estadoturno=${_sesion.EstadoTurno}
                            data-pacienteid=${_sesion.PacienteId}
                            data-numero=${_sesion.Numero}                            
                            title="${_sesion.Paciente}">
                            ${getDivTurnoInnerHTML(_sesion)}</div>`;
        return divCelda;
    }

    function getDivTurnoInnerHTML(_sesion) {

        let innerHTML;
        if (_sesion.Estado == 7 || (_sesion.Estado == 1 && _sesion.TurnoID == 0)) {
            innerHTML = `${getNombreEstado(_sesion.Estado)}`;
        }
        else {
            innerHTML = options.vista == 's' ?
                `${_sesion.Numero} / ${_sesion.CantidadSesiones}${_sesion.DobleOrden ? '<span class="icon-calendar" title="Paciente con doble orden"/><br>' : '<br>'}${getNombreEstado(_sesion.Estado)}`
                : `${_sesion.Paciente ? _sesion.Paciente : "Sin Paciente"} ${_sesion.Aseguradora ? '<br>OS: ' + _sesion.Aseguradora + '-' + _sesion.Plan : ''} <br>
                       Sesion: ${_sesion.Numero} / ${_sesion.CantidadSesiones}<br>
                        ${_sesion.Diagnostico ? _sesion.Diagnostico + "<br>" : ''}
                        ${_sesion.Observaciones ? "Obs: " + _sesion.Observaciones + "<br>" : ''}
                        ${_sesion.DobleOrden ? '<span class="icon-calendar"/>Doble Orden<br>' : ''}
                        ${getNombreEstado(_sesion.Estado)}`;
            if (_sesion.SinAsignar) {
                innerHTML += `<span class="icon-attention sin-fecha" title="Sesiones sin fechas asignadas"></span>`;
            }
        }

        return innerHTML;
    }

    function renderBloqueosAgenda() {
        if (options.bloqueosAgenda) {
            options.bloqueosAgenda.forEach(bloqueo => {
                let rCelda;
                let rowSpan = 1;
                bloqueo.fecha = bloqueo.fecha ? bloqueo.fecha : bloqueo.FechaHora.split('T')[0].replace(/-/g, '');
                bloqueo.hora = bloqueo.hora ? bloqueo.hora : bloqueo.FechaHora.split('T')[1].substr(0, 5).replace(':', '');
                let sDesde = bloqueo.TurnoSimultaneo;
                let sHasta = bloqueo.TurnoSimultaneo;
                if (bloqueo.TurnoSimultaneo == 0) {
                    sDesde = 1;
                    sHasta = options.consultorios.find(consultorio => consultorio.ID == bloqueo.ConsultorioID).TurnosSimultaneos;
                }                
                for (let ts = sDesde; ts <= sHasta; ts++) {
                    let celSesionID = `#F${bloqueo.fecha}H${bloqueo.hora}C${bloqueo.ConsultorioID}S${ts}`;
                    let celda = options.divGrilla.querySelector(celSesionID);
                    if (celda) {
                        celda.innerHTML = '';
                        celda.rowSpan = 1;
                        celda.style.display = 'table-cell';
                        celda.className = "celda-turno turno-bloqueo-agenda";
                        celda.style.backgroundColor = 'orangered';
                        celda.draggable = "false";
                        for (let item in celda.dataset) {
                            delete celda.dataset[item];
                        }
                        celda.dataset.estado = "10";
                        celda.draggable = "false";
                    }
                }
            });
        }
    }

    function deleteSesionGrilla(celda) {
        if (celda) {
            let id = CeldaIdToObject(celda.id);
            let hora = id.hora;
            let idCelda = celda.id;
            setCeldaDroppable(options.tabla.querySelector(`#${idCelda}`));
            for (let rs = celda.rowSpan; rs >= 1; rs--) {
                let nuevaHora = sesionSiguiente(hora);
                CleanCelda(options.tabla.querySelector(`#${idCelda}`));
                idCelda = idCelda.replace('H' + hora, 'H' + nuevaHora);
                hora = nuevaHora;
            }
        }

    }

    function CleanCelda(celda) {
        celda.style.backgroundColor = celda.dataset.bk;
        celda.innerHTML = '';
        celda.className = "celda-turno turno-vacio";
        celda.style.display = 'table-cell';
        celda.draggable = "false";
        celda.rowSpan = 1;
        for (let item in celda.dataset) {
            delete celda.dataset[item];
        }
        celda.dataset.estado = "0";
        celda.dataset.bk = celda.style.backgroundColor;
    }
    /**
     *
     */

    /**
    * Drag and Drop
    */

    function setDivsDraggable() {
        let divs = options.tabla.querySelectorAll('[draggable=true]');
        divs.forEach(div => setDivDraggable(div));
    }

    function setDivDraggable(div) {
        div.addEventListener('dragstart', dragStartEvent);
        div.addEventListener('dragend', dragEndEvent);
    }

    function removeDivDraggable(div) {
        div.removeEventListener('dragstart', dragStartEvent);
        div.removeEventListener('dragend', dragEndEvent);
    }

    function dragStartEvent(e) {
        e.dataTransfer.setData('Text', e.target.outerHTML);
        e.dataTransfer.setData('divid', e.target.id);
        e.dataTransfer.dropEffect = 'move';
        e.dataTransfer.effectAllowed = 'move';
    }

    function dragEndEvent(e) {
        let celdaId = e.target.id.split('D')[0];
        let celda = options.tabla.querySelector(celdaId);        
        let col = options.tabla.querySelector('#' + options.idColDrag);
        let row = options.tabla.querySelector('#' + options.idRowDrag);
        if (col && row) {
            col.classList.remove('hover-drag-title');
            row.classList.remove('hover-drag-title');
        }
    }

    function removeCeldaDroppable(celda) {
        celda.removeEventListener('dragenter', dragenterEvent);
        celda.removeEventListener('dragleave', dragleaveEvent);
        celda.removeEventListener('dragover', dragoverEvent);
        celda.removeEventListener('drop', dropEvent);
        celda.classList.remove('celda-droppable');
    }

    function setCeldasDroppable() {
        /*let celdas = options.tabla.querySelectorAll(".turno-vacio");
        celdas.forEach(celda => setCeldaDroppable(celda));*/
        let celdas = options.tabla.querySelectorAll(".celda-droppable");
        celdas.forEach(celda => setCeldaDroppable(celda));
    }

    function setCeldaDroppable(celda) {
        celda.addEventListener('dragenter', dragenterEvent);
        celda.addEventListener('dragleave', dragleaveEvent);
        celda.addEventListener('dragover', dragoverEvent);
        celda.addEventListener('drop', dropEvent);

    }

    function dragenterEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.add('dragenter');        

        //F20191107H1130C5S1
        //let eID = e.target.id.split('D')[0];        
        

    }

    function dragleaveEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove('dragenter');
        let eID = e.target.id;
        let idCol = eID.substr(0, 9) + eID.substr(14, eID.indexOf('S') - 14);
        let idRow = eID.substr(9, 5);
        let col = options.tabla.querySelector('#' + idCol);
        let row = options.tabla.querySelector('#' + idRow);
        if (col && row) {
            //if (options.idRowDrag !== idRow) {
                row.classList.remove('hover-drag-title');
            //}

            //if (options.idColDrag !== idCol) {
                col.classList.remove('hover-drag-title');
            //}
            
            
        }
    }

    function dragoverEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        let eID = e.target.id;
        let idColDrag = eID.substr(0, 9) + eID.substr(14, eID.indexOf('S') - 14);
        let idRowDrag = eID.substr(9, 5);
        let col = options.tabla.querySelector('#' + idColDrag);
        let row = options.tabla.querySelector('#' + idRowDrag);
        if (col && row) {
            col.classList.add('hover-drag-title');
            row.classList.add('hover-drag-title');
        }
    }

    function dropEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        let tdDestino;
        if (e.target.nodeName == 'TD') {
            tdDestino = e.target;

        }
        else {
            tdDestino = e.target.parentElement;
        }
        e.target.classList.remove('dragenter');
        //ver aca
        cambiarTurnoDropped(tdDestino, e.dataTransfer.getData('divId'));

    }

    /**
    * Drag and Drop FIN
    */

    /*Cambiar Turno*/
    function cambiarTurnoDropped(celda, divId) {

        let btnCambiar_click = e => {
            $("#cambiarTurnoDroppedModal").modal('hide');
            updating();
            btnGuardar.onclick = undefined;
            //btnGuardar.removeEventListener('click', btnCambiar_click);
            if (!sobreturno) {
                let _sesiones = options.sesiones.filter(s => s.TurnoID == _sesionAnterior.TurnoID && s.Numero == _sesionAnterior.Numero);
                let _estado = parseInt(_sesiones[0].Estado);

                let _newSesiones = [];
                let _hora = celda.id.substr(celda.id.indexOf('H') + 1, 4);
                let _fecha = celda.id.substr(celda.id.indexOf('F') + 1, 8);
                let _turnoSimultaneo = celda.id.split('S')[1];
                let _consultorioID = celda.id.substr(celda.id.indexOf('C') + 1, celda.id.indexOf('S') - celda.id.indexOf('C') - 1);

                for (let i = 0; i < parseInt(cmbSesiones.value); i++) {
                    let _newSesion = {
                        ID: null,
                        AgendaID: _sesiones[0].AgendaID,
                        TurnoID: _sesiones[0].TurnoID,
                        Numero: _sesiones[0].Numero,
                        ConsultorioID: _consultorioID,
                        TurnoSimultaneo: _turnoSimultaneo,
                        Estado: _estado,
                        FechaHora: parseFechaHora(_fecha, _hora),
                        Habilitado: true,
                        fecha: _fecha,
                        hora: _hora
                    };
                    _newSesiones.push(_newSesion);
                    _hora = sesionSiguiente(_hora);
                }



                if (validarSesiones(_newSesiones)) {
                    _sesiones.forEach(s => {
                        s.Estado = motivo.value;
                        delete s.sesiones;
                    });
                    _newSesiones = _newSesiones.concat(_sesiones);
                    let url = Domain + "Sesion/CambiarFecha";

                    let promise = ajaxPromise("PUT", url, _newSesiones);
                    promise.then(data => dibujarGrilla()
                        , data => {
                            showErrorMessage('Cambio de Turno', data);
                            dibujarGrilla();
                        });

                }
                else {
                    showErrorMessage('Cambio de Turno', 'Existen sesiones ya asignadas a su seleccion.');
                    updated();
                }
            }
            else {
                let _sesiones = options.sesiones.filter(s => s.TurnoID == _sesionAnterior.TurnoID && s.Numero == _sesionAnterior.Numero);
                let _estado = parseInt(_sesiones[0].Estado);

                let _newSesiones = [];
                let _hora = celda.id.substr(celda.id.indexOf('H') + 1, 4);
                let _fecha = celda.id.substr(celda.id.indexOf('F') + 1, 8);
                let _turnoSimultaneo = celda.id.split('S')[1];
                let _consultorioID = celda.id.substr(celda.id.indexOf('C') + 1, celda.id.indexOf('S') - celda.id.indexOf('C') - 1);

                for (let i = 0; i < parseInt(cmbSesiones.value); i++) {
                    let _newSesion = {
                        ID: null,
                        AgendaID: _sesiones[0].AgendaID,
                        TurnoID: _sesiones[0].TurnoID,
                        Numero: _sesiones[0].Numero,
                        ConsultorioID: _consultorioID,
                        TurnoSimultaneo: _turnoSimultaneo,
                        Estado: _estado,
                        FechaHora: parseFechaHora(_fecha, _hora),
                        Habilitado: true,
                        fecha: _fecha,
                        hora: _hora
                    };
                    _newSesiones.push(_newSesion);
                    _hora = sesionSiguiente(_hora);
                }



                _sesiones.forEach(s => {
                    s.Estado = motivo.value;
                    delete s.sesiones;
                });
                _newSesiones = _newSesiones.concat(_sesiones);
                let url = Domain + "Sesion/CambiarFecha/SobreTurno";

                let promise = ajaxPromise("PUT", url, _newSesiones);
                promise.then(data => dibujarGrilla()
                    , data => {
                        showErrorMessage('Cambio de Turno', data);
                        dibujarGrilla();
                    });


            }


            


        };
        

        let modal = options.divGrilla.querySelector('#cambiarTurnoDroppedModal');
        let btnGuardar = modal.querySelector('#btnCambiarTurnoDropped');
        
        let descripcion = modal.querySelector('#cambiarTurnoDroppedDescripcion');
        let cmbSesiones = modal.querySelector('#cmbSesionesCambiarTurnoDropped');
        let motivo = modal.querySelector('#cmbMotivoCambiarTurnoDropped');
        let _sesionAnterior = options.sesiones.find(s => s.ID == options.tabla.querySelector('#' + divId).dataset.id);

        let sobreturno;

        if (celda.classList.contains('turno-tomado')) {
            cmbSesiones.value = celda.rowSpan;
            cmbSesiones.disabled = true;
            sobreturno = true;
        }
        else {
            cmbSesiones.disabled = false;
            cmbSesiones.value = options.tabla.querySelector(`#${divId.split('D')[0]}`).rowSpan;
            sobreturno = false;
        }


        //btnGuardar.removeEventListener('click', btnCambiar_click);
        //btnGuardar.addEventListener('click', btnCambiar_click);
        btnGuardar.onclick = btnCambiar_click;
        console.dir(btnGuardar);
        
        $("#cambiarTurnoDroppedModal").modal();



    }




    function _fechaActual() {
        let fecha = new Date();
        let sDia = "00" + fecha.getDate();
        let sMes = "00" + (fecha.getMonth() + 1);
        let sAnio = fecha.getFullYear();

        let sFecha = sDia.substr(-2) + "/" + sMes.substr(-2) + "/" + sAnio;

        return sFecha;
    }

    function getNombreEstado(idEstado) {
        let resu = '';
        switch (idEstado) {
            case 1:
                resu = options.vista == 's' ? 'R' : 'Reservado';
                break;
            case 4:
                resu = options.vista == 's' ? 'A' : 'Asistio';
                break;
            case 5:
                resu = options.vista == 's' ? 'NA' : 'No Asistio';
                break;
            case 7:
                resu = options.vista == 's' ? 'B' : 'Bloqueado';
                break;
            default:
                resu = '';
                break;
        }
        return resu;
    }

/*Funciones Llamadas ajax*/

    function anularSesionesSiguientes(sesionID) {
        let url = Domain + "Sesion/Siguientes/Anular";
        let params = {};
        params.id = sesionID;
        let promise = ajaxPromise("PUT", url, params);
        promise.then(dibujarGrilla());
    }

    function anularSesionesPendientes(turnoID) {
        let url = Domain + "Sesion/Pendiente/Anular";
        let params = {};
        params.id = turnoID;
        let promise = ajaxPromise("PUT", url, params);
        promise.then(dibujarGrilla());
    }

    function setEstadoCancelado(sesionID) {
        let url = Domain + "Sesion/Estado/Cancelar";
        let params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, dibujarGrilla);
    }

    function setEstadoConfirmado(sesionID) {
        let url = Domain + "Sesion/Estado/Confirmar";
        let params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, changeEstadoOK);
    }

    function setEstadoAsistio(sesionID) {
        let url = Domain + "Sesion/Estado/Asistio";
        let params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, changeEstadoOK);
    }

    function setEstadoNoAsistio(sesionID) {
        let url = Domain + "Sesion/Estado/NoAsistio";
        let params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, changeEstadoOK);
    }

    function changeEstadoSesion(url, params, callback) {
        let promise = ajaxPromise("PUT", url, params);
        promise.then(callback);
    }

    function changeEstadoOK(data) {
        let _sesion = JSON.parse(JSON.parse(data));

        let _divSesion = options.tabla.querySelector(`div[data-id='${_sesion.ID}']`);

        _divSesion.innerHTML = getDivTurnoInnerHTML(_sesion);
        _divSesion.dataset.estado = _sesion.Estado;
        _divSesion.draggable = _sesion.Estado == 2 ? true : false;
    }

    function validarHorarioReservaBloqueo(_idCelda, _cantidad) {

    }

    function sesionSiguiente(currentValue) {
        let horaSesion;
        let _minutos, _hora;
        _minutos = parseInt(currentValue.substr(2, 2)) + options.duracionModulo;
        _hora = parseInt(currentValue.substr(0, 2));
        _hora = _hora + Math.floor(_minutos / 60);
        _minutos = _minutos % 60;
        horaSesion = (_hora.toString().length == 1 ? '0' + _hora.toString() : _hora.toString())
            + (_minutos.toString().length == 1 ? '0' + _minutos.toString() : _minutos.toString());
        return horaSesion;
    }

    async function getConsultorios() {
        let url = Domain + 'api/grilla/Consultorios';
        let responseConsultorios = await fetch(url);
        return await responseConsultorios.json();
    }

    async function getRangoHorario() {
        let url = Domain + 'api/grilla/RangoHorario';
        let responseHorarios = await fetch(url);
        return await responseHorarios.json();
    }

    async function getRangoFecha() {
        url = `${Domain}/api/grilla/RangoFecha/${options.fecha.getDate()}/${options.fecha.getMonth() + 1}/${options.fecha.getFullYear()}/${options.vista}`;
        let responseDias = await fetch(url);
        return await responseDias.json();
    }

    async function getSesiones() {
        url = `${Domain}/api/grilla/sesiones/${options.dias[0].Fecha}/${options.vista}`;
        let responseSesiones = await fetch(url);
        return await responseSesiones.json();
    }

    async function getRecesos() {
        url = `${Domain}/api/grilla/Receso/${options.fecha.getDate()}/${options.fecha.getMonth() + 1}/${options.fecha.getFullYear()}/${options.vista}`;
        let responseDias = await fetch(url);
        return await responseDias.json();
    }

    async function getAusencias() {
        url = `${Domain}/api/grilla/Ausencias/${options.fecha.getDate()}/${options.fecha.getMonth() + 1}/${options.fecha.getFullYear()}/${options.vista}`;
        let responseDias = await fetch(url);
        return await responseDias.json();
    }

    //async function getBloqueosAgenda() {
    //    url = `${Domain}/api/grilla/Bloqueo/${options.fecha.getDate()}/${options.fecha.getMonth() + 1}/${options.fecha.getFullYear()}/${options.vista}`;
    //    let responseDias = await fetch(url);
    //    return await responseDias.json();
    //}

    async function getFeriados() {
        url = `${Domain}/api/grilla/Feriado/${options.fecha.getDate()}/${options.fecha.getMonth() + 1}/${options.fecha.getFullYear()}/${options.vista}`;
        let responseDias = await fetch(url);
        return await responseDias.json();
    }

    /*Llamadas ajax*/
    function ajax(metodo, url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.open(metodo, url);
        xhr.addEventListener('error', xhr_error);
        xhr.addEventListener('load', xhr_load);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();

        function xhr_error(e) {
            //JSONP: Json con Padding

        }

        function xhr_load(e) {
            if (xhr.status == 200 || xhr.status == 201) {
                callback(e.target.response);
            }

        }
    }

    function ajax(metodo, url, callback, params) {

        let xhr = new XMLHttpRequest();
        xhr.open(metodo, url);
        xhr.addEventListener('error', xhr_error);
        xhr.addEventListener('load', xhr_load);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(params));

        function xhr_error(e) {
            //JSONP: Json con Padding

        }

        function xhr_load(e) {
            if (xhr.status == 200 || xhr.status == 201) {
                callback(e.target.response);
            }

        }
    }


    let ajaxPromise = (metodo, url, params) =>
        new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(metodo, url);
            xhr.addEventListener('error', xhr_error);
            xhr.addEventListener('load', xhr_load);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(params ? JSON.stringify(params) : null);

            function xhr_error(e) {
                //JSONP: Json con Padding
                reject("Network Error");

            }

            function xhr_load(e) {
                if (xhr.status == 200 || xhr.status == 201) {
                    resolve(e.target.response);
                }
                else {
                    reject(e.target.response);
                }
            }
        });


    //PDF
    function createPDF(data) {

        function createTableDoc(_tabla) {
            let table = _tabla;
            let content = [];
            let totalConsultorios = getTotalConsultorios(options.consultorios);
            let width = 97 / totalConsultorios;
            let paginas = options.vista == 'd' ? 1 : 5;


            for (let num = 0; num < paginas; num++) {
                let body = [];
                let headerTable = [];
                headerTable.push({
                    text: table.rows[0].cells[num + 1].innerText.split(" ")[0] + ' '
                    + table.rows[0].cells[num + 1].innerText.substr(table.rows[0].cells[num + 1].innerText.length - 10, 10),
                    colSpan: totalConsultorios + 1,
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                });
                for (let i = 0; i < totalConsultorios; i++) {
                    headerTable.push({
                        fillColor: undefined,
                        _maxWidth: 0,
                        _minWidth: 0,
                        _span: true
                    });
                }
                body.push(headerTable);
                headerTable = [];
                let widths = [];
                headerTable.push({
                    text: 'Hora',
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                });
                widths.push('3%');

                options.consultorios.forEach(c => {
                    headerTable.push({
                        text: c.Descripcion,
                        colSpan: c.TurnosSimultaneos,
                        fontSize: 8,
                        bold: true,
                        alignment: 'center'
                    });
                    for (let i = 0; i < c.TurnosSimultaneos; i++) {
                        widths.push(width.toString() + '%');
                        if (i > 0) {
                            headerTable.push({
                                fillColor: undefined,
                                _maxWidth: 0,
                                _minWidth: 0,
                                _span: true
                            });
                        }
                    }
                });
                body.push(headerTable);
                for (var y = 2; y < table.rows.length; y++) {
                    let row = [];
                    row.push({
                        text: table.rows[y].cells[0].innerText,
                        //rowSpan: table.rows[y].cells[0].rowSpan,
                        fontSize: 7
                    });
                    for (let x = num * totalConsultorios + 1; x < (num + 1) * totalConsultorios + 1; x++) {
                        if (table.rows[y].cells[x].style.display != "none")
                            row.push({
                                text: table.rows[y].cells[x].dataset.print ? table.rows[y].cells[x].dataset.print : "",
                                rowSpan: table.rows[y].cells[x].rowSpan,
                                fontSize: 7
                            });
                        else {
                            row.push({
                                fillColor: undefined,
                                _maxWidth: 0,
                                _minWidth: 0,
                                _span: true
                            });
                        }
                    }
                    body.push(row);
                }

                content.push({
                    style: 'tableExample',
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 2,
                        widths: widths,
                        body: body
                    }
                });
                content.push({ text: '', pageBreak: 'after' });
            }





            var docDefinition = {
                content: content,
                pageSize: 'A4',

                // by default we use portrait, you can change it to landscape if you wish
                pageOrientation: 'landscape'
            };

            return docDefinition;
        }
        pdfMake.createPdf(createTableDoc(data)).download();


    }

})();




