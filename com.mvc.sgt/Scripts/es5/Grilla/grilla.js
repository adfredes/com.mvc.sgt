var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    var options = {};
    var presetSessionStorage = function () {
        sessionStorage.setItem('FechaGrillaTurnos', new Date(2018, 2, 20));
        sessionStorage.setItem('VistaGrillaTurnos', 's');
    };
    var updating = function () {
        options.updating = true;
        options.divGrilla.querySelector('.procesando').style.display = 'block';
        if (options.intervalId) {
            clearInterval(options.intervalId);
        }
    };
    var updated = function () {
        options.divGrilla.querySelector('.procesando').style.display = 'none';
        options.intervalId = window.setInterval(sesionesIsUpdating, options.timeInterval);
        options.updating = false;
    };
    var loadFromSesionStorage = function () {
        var sesionST = {};
        if (sessionStorage) {
            sesionST.vista = sessionStorage.getItem('VistaGrillaTurnos');
            sesionST.fecha = sessionStorage.getItem('FechaGrillaTurnos');
            sessionStorage.removeItem('VistaGrillaTurnos');
            sessionStorage.removeItem('FechaGrillaTurnos');
        }
        return sesionST;
    };
    var renderAusencias = function () {
        var divAusencias = options.notificationBar.querySelector("#divAusenciasGrilla");
        if (!divAusencias) {
            divAusencias = document.createElement("div");
            options.notificationBar.appendChild(divAusencias);
        }
        divAusencias.id = "divAusenciasGrilla";
        if (options.ausencias && options.ausencias.length > 0) {
            var notifi_1 = "<div class =\"ausenciasProfesionalesComponent bar-component\">\n                <p>\n                <span class=\"icon-stethoscope\"></span>\n            </p>\n            <p>\n                <ul>";
            options.ausencias.forEach(function (s) {
                notifi_1 += "<li>" + s.Profesional + " desde " + moment(s.FechaDesde).format("DD/MM/YYYY") + " hasta " + moment(s.FechaHasta).format("DD/MM/YYYY") + "</li>";
            });
            notifi_1 += "        </ul>\n            </p></div>";
            divAusencias.innerHTML = notifi_1;
        }
        else {
            divAusencias.innerHTML = "";
        }
    };
    var showModalAngularComponent = function (modalName, elementName, value) {
        modal = options.divGrilla.querySelector(modalName);
        if (modal) {
            if (Array.isArray(elementName)) {
                for (var pos = 0; pos < elementName.length; pos++) {
                    var elementID = modal.querySelector(elementName[pos]);
                    if (elementID) {
                        var evt = document.createEvent("HTMLEvents");
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
                var elementID = modal.querySelector(elementName);
                if (elementID) {
                    var evt = document.createEvent("HTMLEvents");
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
    var btnVistaHoy_Click = function (e) {
        e.preventDefault();
        e.stopPropagation();
        options.fechaDia = new Date();
        options.fecha = new Date();
        options.vista = 'd';
        dibujarGrilla();
    };
    var btnVistaDiaSemana_Click = function (e) {
        e.preventDefault();
        e.stopPropagation();
        options.fechaDia = new Date();
        options.fecha = new Date();
        options.vista = 'd';
        options.fecha = getDayOfWeek(options.fechaDia, e.target.dataset.dia);
        dibujarGrilla();
    };
    var btnVistaSemanal_Click = function (e) {
        e.preventDefault();
        e.stopPropagation();
        options.fechaSemana = new Date();
        options.fecha = new Date();
        options.vista = 's';
        dibujarGrilla();
    };
    var btnCantidadSesionesModal_click = function (e) {
        $("#cantidadSesionesModal").modal("hide");
        updating();
        var divCantidadSesiones = options.divGrilla.querySelector('#cantidadSesionesModal');
        e.preventDefault();
        e.stopPropagation();
        var sobreturnos = [];
        var _turno = {
            "PacienteID": null,
            "Estado": 1,
            "Habilitado": true,
            "UsuarioModificacion": null,
            "FechaModificacion ": null,
            "CantidadSesiones": parseInt(divCantidadSesiones.querySelector("#cmbCantidadSesiones").value),
            "Diagnostico": "",
            "Fecha": new Date(),
            "Sesions": []
        };
        options.sesionesReservadas.forEach(function (s, i) {
            s.sesiones.forEach(function (se) {
                var _sesion = {
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
        var params = {};
        params.model = _turno;
        params.sobreturnos = sobreturnos;
        var promise = ajaxPromise('POST', Domain + 'Sesion/Reservar', params);
        promise.then(function (data) {
            var turnoNuevo = JSON.parse(data);
            options.sesionesReservadas = [];
            showModalAngularComponent('#TurnoAsignarPacienteModal', '#TurnoID', turnoNuevo.ID);
            renderListaReservas();
            dibujarGrilla();
        }, function (data) {
            showErrorMessage('Reservas', data);
            updated();
        });
    };
    var btnPosponerSesion_click = function (e) {
        e.stopPropagation();
        e.preventDefault();
        updating();
        $("#posponerTurnoModal").modal('hide');
        var modal = options.divGrilla.querySelector('#posponerTurnoModal');
        var turnoID = modal.dataset.turnoid;
        var numero = modal.dataset.numero;
        var motivo = modal.querySelector('#cmbMotivoPosponerTurno').value;
        var _sesiones = options.sesiones.filter(function (s) { return s.TurnoID == turnoID && s.Numero == numero; });
        var _newSesiones = [];
        _sesiones.forEach(function (s) {
            s.Estado = motivo;
            delete s.sesiones;
        });
        _newSesiones = _newSesiones.concat(_sesiones);
        var url = Domain + "Sesion/Posponer";
        var promise = ajaxPromise("PUT", url, _newSesiones);
        promise.then(function (data) {
            updated();
            showModalAngularComponent('#TurnoAsignarPacienteModal', '#TurnoID', turnoID);
            dibujarGrilla();
        }, function (data) {
            updated();
            showErrorMessage('Posponer Turno', data);
            dibujarGrilla();
        });
    };
    var clickReservarBloquear = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var modal = options.divGrilla.querySelector("#bloquearReservarModal");
        if (modal.dataset.bloquear == 'true') {
            clickBloquear(e);
        }
        else {
            clickReservar(e);
        }
    };
    var clickReservar = function (e) {
        updating();
        $('#bloquearReservarModal').modal('hide');
        var _cantidad = parseInt(modal.querySelector('#cmbSesiones').value);
        if (!validarReserva(modal.dataset.id)) {
            updated();
            showErrorMessage('Reservas', 'Ya existe una reserva para ese día.');
        }
        else {
            var _celdaID = CeldaIdToObject(modal.dataset.id);
            var _hora = _celdaID.hora;
            var sesionReserva = {
                "AgendaID": 1,
                "Aseguradora": "",
                "AseguradoraColor": "lightpink",
                "ConsultorioID": _celdaID.ConsultorioID,
                "Estado": 1,
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
            for (var c = 0; c < _cantidad; c++) {
                sesionReserva.sesiones.push({
                    "AgendaID": 1,
                    "Aseguradora": "",
                    "AseguradoraColor": "lightpink",
                    "ConsultorioID": _celdaID.ConsultorioID,
                    "Estado": 1,
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
    var clickBloquear = function (e) {
        $('#bloquearReservarModal').modal('hide');
        updating();
        var _cantidad = parseInt(modal.querySelector('#cmbSesiones').value);
        var _hora = modal.dataset.id.substr(modal.dataset.id.indexOf('H') + 1, 4);
        var _fecha = modal.dataset.id.substr(modal.dataset.id.indexOf('F') + 1, 8);
        var turnoBloqueo = {
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
        for (var c = 0; c < _cantidad; c++) {
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
            var url = Domain + "Agenda/BloquearSesion";
            var promise = ajaxPromise("POST", url, turnoBloqueo);
            promise.then(function (data) {
                var _sesiones = JSON.parse(JSON.parse(data));
                _sesiones.map(function (e) {
                    e.FechaHora = moment(e.FechaHora).toDate();
                    e.FechaHora.setHours(e.FechaHora.getHours() - 3);
                    e.FechaHora = e.FechaHora.toISOString();
                });
                var _sesion = JSON.parse(JSON.stringify(_sesiones[0]));
                _sesion.sesiones = _sesiones;
                options.sesiones = options.sesiones.concat(_sesiones);
                renderSesion(_sesion);
                updated();
            }, function (data) {
                showErrorMessage('Bloqueos', data);
                updated();
            });
        }
        else {
            showErrorMessage('Bloqueos', 'Existen sesionesss ya asignadas a su seleccion.');
            updated();
        }
    };
    var clickCancelarSesion = function (e) {
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
    };
    function CancelarReserva(divReserva) {
        updating();
        if (divReserva.dataset.turnoid > 0) {
            anularSesionesPendientes(divReserva.dataset.turnoid);
        }
        else {
            var celda = divReserva.parentElement;
            deleteSesionGrilla(celda);
            var id_1 = CeldaIdToObject(celda.id);
            options.sesionesReservadas = options.sesionesReservadas.filter(function (sesion) { return sesion.fecha != id_1.fecha || sesion.hora != id_1.hora
                || sesion.ConsultorioID != id_1.ConsultorioID || sesion.TurnoSimultaneo != id_1.TurnoSimultaneo; });
            renderListaReservas();
            redibujarGrilla();
            updated();
        }
    }
    function CancelarBloqueo(opt) {
        return __awaiter(this, void 0, void 0, function () {
            var idSesion, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        updating();
                        idSesion = opt.$trigger[0].dataset.id;
                        setEstadoCancelado(idSesion);
                        deleteSesionGrilla(options.tabla.querySelector("#" + opt.$trigger[0].id.split('D')[0]));
                        _a = options;
                        return [4, getSesiones()];
                    case 1:
                        _a.sesiones = _b.sent();
                        updated();
                        return [2];
                }
            });
        });
    }
    var showModalBloquearReservar = function (celdaId, action, title, bloquear) {
        modal = options.divGrilla.querySelector("#bloquearReservarModal");
        modal.dataset.id = celdaId;
        modal.dataset.action = action;
        modal.dataset.bloquear = bloquear;
        modal.querySelector('#bloquearReservarTitle').innerHTML = title;
        modal.querySelector('#cmbSesiones').value = 2;
        $('#bloquearReservarModal').modal();
    };
    var showModalCancelarSesion = function (sesionID, turnoID) {
        modal = options.divGrilla.querySelector('#cancelarSesionModal');
        modal.querySelector('#cmbCancelarSesion').value = 'false';
        modal.dataset.sesionID = sesionID;
        modal.dataset.turnoID = turnoID;
        $('#cancelarSesionModal').modal();
    };
    var initModalListener = function () {
        var modals = [];
        modals.push({
            element: options.divGrilla.querySelector('#cancelarSesionModal'),
            evento: 'click',
            nombreObjeto: '#btnCancelarSesionModal',
            callback: clickCancelarSesion
        });
        modals.push({
            element: options.divGrilla.querySelector('#posponerTurnoModal'),
            evento: 'click',
            nombreObjeto: '#btnPosponerTurno',
            callback: btnPosponerSesion_click
        });
        modals.push({
            element: options.divGrilla.querySelector('#bloquearReservarModal'),
            evento: 'click',
            nombreObjeto: '#btnBloquearReservarModal',
            callback: clickReservarBloquear
        });
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
        var btnsNavegacion = document.querySelectorAll("button[data-dia]");
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
    var setlModalsItemsListener = function (modals) {
        return modals.forEach(function (m) { return setModalItemListener(m); });
    };
    var setModalItemListener = function (modal) {
        var element = modal.nombreObjeto ? modal.element.querySelector(modal.nombreObjeto) : modal.element;
        element.addEventListener(modal.evento, modal.callback);
    };
    var init = function () {
        options.divGrilla = document.querySelector('#GrillaContent');
        var divGrillaContent = options.divGrilla.querySelector('#GrillaTableContent');
        options.notificationBar = document.querySelector('.notification-bar');
        initModalListener();
        var sessionST = loadFromSesionStorage();
        options.tabla = document.createElement('table');
        options.tabla.id = 'grillaTurnos';
        options.tabla.classList.add('grillaTurnos');
        divGrillaContent.appendChild(options.tabla);
        options.consultorios = [];
        options.horarios = [];
        options.dias = [];
        options.rangoDias = [];
        options.recesos = [];
        options.bloqueosAgenda = [];
        options.feriados = [];
        options.vista = 's';
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
        window.setTimeout(function () { return $('.modal-dialog').draggable({ handle: ".modal-header" }); }, 5000);
        $('.modal-dialog').draggable({ handle: ".modal-header" });
    };
    $(document).ready(function () {
        init();
    });
    function validarSesiones(_sesiones) {
        return options.sesiones.findIndex(function (se) {
            return se.ConsultorioID == _sesiones[0].ConsultorioID &&
                se.TurnoSimultaneo == _sesiones[0].TurnoSimultaneo &&
                se.fecha == _sesiones[0].fecha &&
                parseInt(se.hora) >= parseInt(_sesiones[0].hora) &&
                parseInt(se.hora) <= parseInt(_sesiones[_sesiones.length - 1].hora);
        }) === -1 ? true : false;
    }
    var validarReserva = function (id) {
        var celdaId = CeldaIdToObject(id);
        return options.sesionesReservadas.findIndex(function (sesion) { return sesion.fecha == celdaId.fecha; }) < 0;
    };
    var parseFechaHora = function (_fecha, _hora) {
        return new Date(_fecha.substr(0, 4) + '-' + _fecha.substr(4, 2) + '-' + _fecha.substr(6, 2)
            + 'T' + _hora.substr(0, 2) + ':' + _hora.substr(2, 2) + ':00-03:00');
    };
    function showErrorMessage(title, errorMessage) {
        var modalError = options.divGrilla.querySelector("#errorModal");
        modalError.querySelector("#errorModalTitle").innerHTML = title;
        modalError.querySelector("#errorModalMessage").innerHTML = errorMessage;
        $('#errorModal').modal();
    }
    function sesionesIsUpdating() {
        return __awaiter(this, void 0, void 0, function () {
            var mfecha, mvista, awSesiones, newSesiones;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(new Date());
                        if (!(options.updating === false)) return [3, 2];
                        if (options.intervalId) {
                            window.clearInterval(options.intervalId);
                        }
                        mfecha = JSON.stringify(options.fecha);
                        mvista = JSON.stringify(options.vista);
                        awSesiones = getSesiones();
                        return [4, awSesiones];
                    case 1:
                        newSesiones = _a.sent();
                        if (options.sesionesActual !== JSON.stringify(newSesiones)
                            && mfecha === JSON.stringify(options.fecha)
                            && mvista === JSON.stringify(options.vista)) {
                            dibujarGrillaSesiones(newSesiones);
                        }
                        else {
                            options.intervalId = window.setInterval(sesionesIsUpdating, options.timeInterval);
                        }
                        return [3, 3];
                    case 2:
                        if (options.intervalId) {
                            window.clearInterval(options.intervalId);
                        }
                        options.intervalId = window.setInterval(sesionesIsUpdating, options.timeInterval);
                        _a.label = 3;
                    case 3: return [2];
                }
            });
        });
    }
    function dibujarGrilla() {
        return __awaiter(this, void 0, void 0, function () {
            var awConsultorios, awRangoHorario, awRangoFecha, _a, _b, _c, awSesiones, awRecesos, awFeriados, awAusencias, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        updating();
                        awConsultorios = getConsultorios();
                        awRangoHorario = getRangoHorario();
                        awRangoFecha = getRangoFecha();
                        _a = options;
                        return [4, awConsultorios];
                    case 1:
                        _a.consultorios = _h.sent();
                        _b = options;
                        return [4, awRangoHorario];
                    case 2:
                        _b.horarios = _h.sent();
                        _c = options;
                        return [4, awRangoFecha];
                    case 3:
                        _c.dias = _h.sent();
                        awSesiones = getSesiones();
                        awRecesos = getRecesos();
                        awFeriados = getFeriados();
                        awAusencias = getAusencias();
                        _d = options;
                        return [4, awSesiones];
                    case 4:
                        _d.sesiones = _h.sent();
                        options.sesionesActual = JSON.stringify(options.sesiones);
                        _e = options;
                        return [4, awRecesos];
                    case 5:
                        _e.recesos = _h.sent();
                        _f = options;
                        return [4, awFeriados];
                    case 6:
                        _f.feriados = _h.sent();
                        _g = options;
                        return [4, awAusencias];
                    case 7:
                        _g.ausencias = _h.sent();
                        options.bloqueosAgenda = [];
                        redibujarGrilla();
                        return [2];
                }
            });
        });
    }
    function dibujarGrillaSesiones(sesiones) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                updating();
                options.sesionesActual = JSON.stringify(sesiones);
                options.sesiones = sesiones;
                redibujarGrilla();
                return [2];
            });
        });
    }
    function redibujarGrilla() {
        updating();
        renderGrilla();
        renderReservado();
        setCeldasDroppable();
        setDivsDraggable();
        removeContextMenu();
        setContextMenu();
        options.tabla.querySelector('#btnPrintDia').addEventListener('click', function (e) { return createPDF(options.tabla); });
        renderAusencias();
        updated();
    }
    function renderListaReservas() {
        var btnDivReservasCancelar_click = function (e) {
            e.preventDefault();
            e.stopPropagation();
            options.sesionesReservadas.forEach(function (e) { return deleteSesionGrilla(options.tabla.querySelector('#' + SesionToCeldaId(e))); });
            options.sesionesReservadas = [];
            renderListaReservas();
            redibujarGrilla();
        };
        var btnDivReservasAceptar_click = function (e) {
            e.preventDefault();
            e.stopPropagation();
            divCantidadSesiones.querySelector("#cmbCantidadSesiones").value = options.sesionesReservadas.length <= 20 ? options.sesionesReservadas.length : 20;
            $("#cantidadSesionesModal").modal("show");
        };
        var divCantidadSesiones = options.divGrilla.querySelector('#cantidadSesionesModal');
        var divReservas = options.divGrilla.querySelector('#divReservas');
        divReservas.innerHTML = "";
        if (options.sesionesReservadas.length > 0) {
            var innerDiv_1 = "<p><span class='icon-calendar'>" + options.sesionesReservadas.length + "</span>\n                                    \n                                    <span id=\"btnDivReservasCancelar\" class=\"icon-cancel\"></span>\n                                    <span id=\"btnDivReservasAceptar\" class=\"icon-ok\"></span>\n                                    <span>&nbsp</span>\n                                </p>\n                                <ul>";
            options.sesionesReservadas.sort(function (a, b) { return parseInt(a.fecha) - parseInt(b.fecha); });
            options.sesionesReservadas.forEach(function (e) {
                var _fecha = e.fecha.substr(6, 2) + '/' + e.fecha.substr(4, 2) + '/' + e.fecha.substr(0, 4);
                var _desde = e.hora.substr(0, 2) + ':' + e.hora.substr(2, 2);
                var _hasta = sesionSiguiente(e.sesiones[e.sesiones.length - 1].hora);
                _hasta = _hasta.substr(0, 2) + ':' + _hasta.substr(2, 2);
                innerDiv_1 += "<li>" + e.Numero + " " + _fecha + " " + _desde + " a " + _hasta + " </li >";
            });
            innerDiv_1 += "</ul>";
            divReservas.innerHTML = innerDiv_1;
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
            options.fechaDia = $('#ddatepickerP').datepicker('getDate');
            options.fecha = $('#ddatepickerP').datepicker('getDate');
            dibujarGrilla();
        });
        var calendario = options.tabla.querySelector('#calendarioSesion');
        calendario.addEventListener("change", function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        var elements = options.tabla.querySelectorAll('.ref-dia');
        for (var i = 0, total = elements.length; i < total; i++) {
            elements[i].addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                if (options.vista == 's') {
                    var vFecha = e.target.dataset.fecha.split('/');
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
        elements.forEach(function (e) { return setElementMarkRowCol(e); });
        var boton = options.tabla.querySelector('#btnAnterior');
        boton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            options.fecha = getPrevDate(options.vista == 's' ? options.fechaSemana : options.fechaDia);
            dibujarGrilla();
        });
        boton = options.tabla.querySelector('#btnSiguiente');
        boton.addEventListener('click', function (e) {
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
        var eID = e.id.split('D')[0];
        var idCol = eID.substr(0, 9) + eID.substr(14, e.id.indexOf('S') - 14);
        var idRow = eID.substr(9, 5);
        e.idCol = idCol;
        e.idRow = idRow;
        e.addEventListener('mouseover', ColRowAddClass);
        e.addEventListener('mouseout', ColRowRemoveClass);
        function ColRowAddClass(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var col = options.tabla.querySelector('#' + ev.target.idCol);
            var row = options.tabla.querySelector('#' + ev.target.idRow);
            if (col && row) {
                col.classList.add('hover-title');
                row.classList.add('hover-title');
            }
        }
        function ColRowRemoveClass(ev) {
            ev.stopPropagation();
            ev.preventDefault();
            var col = options.tabla.querySelector('#' + ev.target.idCol);
            var row = options.tabla.querySelector('#' + ev.target.idRow);
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
        var objectID = {
            "fecha": idCelda.substr(idCelda.indexOf('F') + 1, 8),
            "hora": idCelda.substr(idCelda.indexOf('H') + 1, 4),
            "ConsultorioID": idCelda.substr(idCelda.indexOf('C') + 1, idCelda.indexOf('S') - idCelda.indexOf('C') - 1),
            "TurnoSimultaneo": idCelda.split('S')[1]
        };
        return objectID;
    }
    function SesionToCeldaId(sesion) {
        return "F" + sesion.fecha + "H" + sesion.hora + "C" + sesion.ConsultorioID + "S" + sesion.TurnoSimultaneo;
    }
    function setContextMenu() {
        var modal = options.divGrilla.querySelector("#bloquearReservarModal");
        (function setContext() {
            $.contextMenu({
                selector: '.celda-turno[data-estado=0]',
                callback: contextMenuClick,
                items: {
                    "reservar": { name: "Reservar", icon: "" },
                    "bloquear": { name: "Bloquear", icon: "" }
                }
            });
            $.contextMenu({
                selector: '.div-turno[data-estado=1][data-turnoid!=0]',
                callback: contextMenuClick,
                items: {
                    "asignarPaciente": { name: "Asignar Paciente", icon: "" },
                    "cancelar": { name: "Cancelar", icon: "" }
                }
            });
            $.contextMenu({
                selector: '.div-turno[data-estado=1][data-turnoid=0]',
                callback: contextMenuClick,
                items: {
                    "cancelar": { name: "Cancelar", icon: "" }
                }
            });
            $.contextMenu({
                selector: '.div-turno[data-estado=2]',
                build: function ($triggerElement, e) {
                    return {
                        callback: contextMenuClick,
                        items: {
                            "paciente": { name: "" + $triggerElement[0].title, icon: "", className: 'font-weight-bold' },
                            "sep1": "---------",
                            "asistio": { name: "Asistio", icon: "" },
                            "noAsistio": { name: "No Asistio", icon: "" },
                            "anularSesion": { name: "Cancelar Sesion", icon: "" },
                            "cambiarTurno": { name: "CambiarTurno", icon: "" },
                            "posponer": { name: "Posponer", icon: "" },
                            "sep2": "---------",
                            "datosSesiones": { name: "Sesiones", icon: "" },
                            "datosTurno": { name: "Turno", icon: "" },
                            "sep3": {
                                "type": "cm_separator",
                                visible: function (key, opt) {
                                    var disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            },
                            "sobreTurno": {
                                name: "Sobre Turno",
                                visible: function (key, opt) {
                                    var disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            }
                        }
                    };
                }
            });
            $.contextMenu({
                selector: '.div-turno[data-estado=4]',
                build: function ($triggerElement, e) {
                    return {
                        callback: contextMenuClick,
                        items: {
                            "paciente": { name: "" + $triggerElement[0].title, icon: "", className: 'font-weight-bold' },
                            "sep2": "---------",
                            "confirmado": { name: "Confirmado", icon: "" },
                            "noAsistio": { name: "No Asistio", icon: "" },
                            "sep1": "---------",
                            "datosSesiones": { name: "Sesiones", icon: "" },
                            "datosTurno": { name: "Turno", icon: "" },
                            "sep3": {
                                "type": "cm_separator",
                                visible: function (key, opt) {
                                    var disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            },
                            "sobreTurno": {
                                name: "Sobre Turno",
                                visible: function (key, opt) {
                                    var disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            }
                        }
                    };
                }
            });
            $.contextMenu({
                selector: '.div-turno[data-estado=5]',
                build: function ($triggerElement, e) {
                    return {
                        callback: contextMenuClick,
                        items: {
                            "paciente": { name: "" + $triggerElement[0].title, icon: "", className: 'font-weight-bold' },
                            "sep2": "---------",
                            "confirmado": { name: "Confirmado", icon: "" },
                            "asistio": { name: "Asistio", icon: "" },
                            "sep1": "---------",
                            "datosSesiones": { name: "Sesiones", icon: "" },
                            "datosTurno": { name: "Turno", icon: "" },
                            "sep3": {
                                "type": "cm_separator",
                                visible: function (key, opt) {
                                    var disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            },
                            "sobreTurno": {
                                name: "Sobre Turno",
                                visible: function (key, opt) {
                                    var disable = opt.$trigger[0].parentNode.dataset.sobreturno == "true" ? false : true;
                                    return disable;
                                }
                            }
                        }
                    };
                }
            });
            $.contextMenu({
                selector: '.div-turno[data-estado=7]',
                callback: contextMenuClick,
                items: {
                    "asignarPaciente": { name: "Asignar Paciente", icon: "" },
                    "cancelar": { name: "Cancelar", icon: "" }
                }
            });
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
            var fecha = new Date(parseInt(idcol.substring(1, 5)), parseInt(idcol.substring(5, 7)) - 1, parseInt(idcol.substring(7, 9)));
            var fecha2 = new Date();
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
                    showModalAngularComponent('#DatosSesiones', ['#TurnoID', '#PacienteID'], [opt.$trigger[0].dataset.turnoid, opt.$trigger[0].dataset.pacienteid]);
                    break;
                case 'datosTurno':
                    showModalAngularComponent('#sesionesPacienteModal', ['#TurnoID', '#PacienteID'], [opt.$trigger[0].dataset.turnoid, opt.$trigger[0].dataset.pacienteid]);
                    break;
                case 'sobreTurno':
                    var parentNode = opt.$trigger[0].parentNode;
                    var _cantidad = parseInt(parentNode.rowSpan);
                    if (!validarReserva(parentNode.id)) {
                        showErrorMessage('Reservas', 'Ya existe una reserva para ese día.');
                    }
                    else {
                        var _celdaID = CeldaIdToObject(parentNode.id);
                        parentNode.dataset.sobreturno = "true";
                        var _hora = _celdaID.hora;
                        var sesionReserva = {
                            "AgendaID": 1,
                            "Aseguradora": "",
                            "AseguradoraColor": "lightpink",
                            "ConsultorioID": _celdaID.ConsultorioID,
                            "Estado": 1,
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
                        for (var c = 0; c < _cantidad; c++) {
                            sesionReserva.sesiones.push({
                                "AgendaID": 1,
                                "Aseguradora": "",
                                "AseguradoraColor": "lightpink",
                                "ConsultorioID": _celdaID.ConsultorioID,
                                "Estado": 1,
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
                        renderSesion(sesionReserva);
                        options.sesionesReservadas.push(sesionReserva);
                        renderListaReservas();
                    }
                    break;
                case 'posponer':
                    modal = options.divGrilla.querySelector('#posponerTurnoModal');
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
        return consultorios.reduce(function (a, b) { return a + b.TurnosSimultaneos; }, 0);
    }
    function getCaption() {
        return "<caption style=\"caption-side:top;\" class=\"mb-0 pb-0\" >\n                        <nav class=\"mb-0 pb-0 badge-light\">\n                            <ul class=\"pagination justify-content-center mb-0 pb-0 badge-light\">\n                                <li class=\"page-item mb-0 badge-light text-left\">\n                                    <button class=\"page-link mb-0 badge-light\" id=\"btnAnterior\">anterior</button>\n                                </li>\n                                <li class=\"page-item mb-0 badge-light w-100 text-center\">\n                                    <div class=\"page-link mb-0 badge-light font-weight-bold\">\n                                    " + (options.vista == "s" ? "Semana  " + options.dias[0].Fecha + " al " + options.dias[4].Fecha
            : "Día " + options.dias[0].Fecha) + "\n                                    <div class=\"input-group date\" id=\"ddatepicker\" data-provide=\"datepicker\"  style=\"display:inline;\">\n                                        <input type=\"hidden\" class=\"form-control date-picker\" id=\"calendarioSesion\">\n                                        <div class=\"input-group-addon\"  style=\"display:inline;\">\n                                            <span class=\"icon-calendar\"></span>\n                                        </div>\n                                    </div>\n                                    <span style=\"cursor:pointer\" class=\"icon-print\" id=\"btnPrintDia\"></span>\n                                    </div>\n                                </li>\n                                <li class=\"page-item mb-0 badge-light text-right\">\n                                    <button class=\"page-link mb-0 badge-light\" id=\"btnSiguiente\" style=\"display:block\" >siguiente</button>\n                                </li>\n                            </ul>\n                        </nav>\n                    </caption>";
    }
    function renderGrilla() {
        var tablaInner = '<thead>';
        var totalCol = 0;
        tablaInner += "<tr><td rowspan=\"2\" style=\"width:auto;margin:0px;padding:0px\">Hora</td>";
        options.dias.forEach(function (d) {
            tablaInner += "<td colspan=" + getTotalConsultorios(options.consultorios) + " class=\"center ref-dia etiqueta-dia\" data-fecha=\"" + d.Fecha + "\">" + d.Name + "<br>" + d.Fecha + "</td>";
        });
        tablaInner += "</tr><tr>";
        options.dias.forEach(function (d) {
            var fechaID = d.Fecha.split('/')[2] + d.Fecha.split('/')[1] + d.Fecha.split('/')[0];
            options.consultorios.forEach(function (e) {
                tablaInner += "<td class=\"tabla-consultorio\" id=\"F" + fechaID + "C" + e.ID + "\" colspan=\"" + e.TurnosSimultaneos + "\">" + e.Descripcion + "</td>";
                totalCol += e.TurnosSimultaneos;
            });
        });
        tablaInner += "</tr></thead><tbody>";
        options.horarios.forEach(function (e) {
            var horaID = e.replace(':', '');
            tablaInner += "<tr>\n                        <td class=\"tabla-horario\" id=\"H" + horaID + "\">" + e + "</td>\n                        ";
            options.dias.forEach(function (d) {
                if (options.recesos.findIndex(function (r) { return r.Fecha == d.Fecha; }) >= 0) {
                    if (e == options.horarios[0]) {
                        tablaInner += "<td class=\"turno-receso\"\n                                        id=\"" + d.Fecha + "R$\"\n                                        width:" + 100 / options.dias.length + "%'\n                                        rowSpan=\"" + options.horarios.length + "\" colSpan=\"" + totalCol / options.dias.length + "\"><p>RECESO</p></td>";
                    }
                }
                else {
                    if (options.feriados.findIndex(function (r) { return r.Fecha == d.Fecha; }) >= 0) {
                        if (e == options.horarios[0]) {
                            tablaInner += "<td class=\"turno-feriado\"\n                                        id=\"" + d.Fecha + "R$\"\n                                        width:" + 100 / options.dias.length + "%'\n                                        rowSpan=\"" + options.horarios.length + "\" colSpan=\"" + totalCol / options.dias.length + "\"><p>FERIADO</p></td>";
                        }
                    }
                    else {
                        var fechaID_1 = d.Fecha.split('/')[2] + d.Fecha.split('/')[1] + d.Fecha.split('/')[0];
                        options.consultorios.forEach(function (c) {
                            var celdaID = 'F' + fechaID_1 + 'H' + horaID + 'C' + c.ID;
                            for (var i = 1; i <= c.TurnosSimultaneos; i++) {
                                tablaInner += "<td class=\"celda-turno turno-vacio celda-droppable\"\n                                        id=\"" + celdaID + "S" + i + "\" style='background-color:" + c.Color + ";\n                                        width:" + 100 / totalCol + "%' data-estado=\"0\" data-bk=\"" + c.Color + "\"></td>";
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
        options.sesionesReservadas.forEach(function (sesion) {
            renderSesion(sesion);
        });
    }
    function renderSesiones() {
        var _sesiones = options.sesiones.filter(function (value, index, self) {
            return self.findIndex(function (element) { return element.TurnoID == value.TurnoID && element.Numero == value.Numero && element.Estado == value.Estado; }) == index;
        });
        _sesiones.forEach(function (mValue) { return mValue.sesiones = options.sesiones.filter(function (fValue) { return mValue.TurnoID == fValue.TurnoID && mValue.Numero == fValue.Numero
            && fValue.ConsultorioID == mValue.ConsultorioID && fValue.TurnoSimultaneo == mValue.TurnoSimultaneo; }); });
        _sesiones.forEach(function (sesion) {
            renderSesion(sesion);
        });
    }
    function renderSesion(sesion) {
        var rCelda;
        var rowSpan = sesion.sesiones.length;
        sesion.fecha = sesion.fecha ? sesion.fecha : sesion.FechaHora.split('T')[0].replace(/-/g, '');
        sesion.hora = sesion.hora ? sesion.hora : sesion.FechaHora.split('T')[1].substr(0, 5).replace(':', '');
        var celSesionID = "#F" + sesion.fecha + "H" + sesion.hora + "C" + sesion.ConsultorioID + "S" + sesion.TurnoSimultaneo;
        for (var i = 0, t = sesion.sesiones.length; i < t; i++) {
            var vFecha = sesion.sesiones[i].FechaHora ? sesion.sesiones[i].FechaHora.split('T') : [];
            sesion.sesiones[i].fecha = sesion.sesiones[i].fecha ? sesion.sesiones[i].fecha : vFecha[0].replace(/-/g, '');
            sesion.sesiones[i].hora = sesion.sesiones[i].hora ? sesion.sesiones[i].hora : vFecha[1].substr(0, 5).replace(':', '');
            var idCelda = "#F" + sesion.fecha + "H" + sesion.sesiones[i].hora + "C" + sesion.ConsultorioID + "S" + sesion.TurnoSimultaneo;
            var celda = options.tabla.querySelector(idCelda);
            if (celda) {
                celda.dataset.sesionId = celSesionID + "NS" + (i + 1);
                if (i == 0) {
                    if (celda.dataset.parentid) {
                        idCelda = celda.dataset.parentid;
                        celda = options.tabla.querySelector(idCelda);
                        celda.dataset.print = celda.dataset.print ? celda.dataset.print + '\n' : "";
                        celda.dataset.print += sesion.Estado == 7 ? 'BLOQUEADO' : sesion.Estado == 1 ? 'RESERVADO' :
                            sesion.Paciente + "\n" + sesion.Numero + " / " + sesion.CantidadSesiones;
                        celda.dataset.sobreturno = "true";
                        rCelda = options.tabla.querySelector(idCelda);
                        var divId = idCelda.replace('#', '') + 'D' + sesion.ID;
                        celda.innerHTML += getDivTurno(divId, sesion);
                        celda.innerHTML = celda.innerHTML.replace(/h-100/g, "h-50");
                        setElementMarkRowCol(options.tabla.querySelector('#' + divId));
                        i = t;
                        removeCeldaDroppable(celda);
                    }
                    else {
                        celda.classList.add('turno-tomado');
                        celda.dataset.estado = sesion.Estado;
                        celda.classList.remove('turno-vacio');
                        celda.dataset.parentid = idCelda;
                        celda.dataset.sobreturno = sesion.DobleOrden ? "true" : "false";
                        celda.dataset.print = celda.dataset.print ? celda.dataset.print + '\n' : "";
                        celda.dataset.print += sesion.Estado == 7 ? 'BLOQUEADO' : sesion.Estado == 1 ? 'RESERVADO' :
                            sesion.Paciente + "\n" + sesion.Numero + " / " + sesion.CantidadSesiones;
                        celda.rowSpan = rowSpan;
                        var divId = idCelda.replace('#', '') + 'D' + sesion.ID;
                        celda.innerHTML = getDivTurno(divId, sesion);
                        setElementMarkRowCol(options.tabla.querySelector('#' + divId));
                        if (sesion.DobleOrden) {
                            removeCeldaDroppable(celda);
                        }
                    }
                }
                else {
                    if (celda.dataset.parentid || celda.innerHTML.includes("div")) {
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
        var divCelda = "<div id=" + divId + " class=\"div-turno h-100 align-middle\"\n                            style=\"background-color:" + (_sesion.Estado == 7 ? 'blue' : _sesion.AseguradoraColor) + ";\n                            color:" + (_sesion.Estado == 7 ? '#fff' : '#000') + "\"\n                            draggable=\"" + (_sesion.Estado == 2 ? true : false) + "\"\n                            data-id=" + _sesion.ID + " data-estado=" + _sesion.Estado + "\n                            data-turnoid=" + _sesion.TurnoID + " data-estadoturno=" + _sesion.EstadoTurno + "\n                            data-pacienteid=" + _sesion.PacienteId + "\n                            data-numero=" + _sesion.Numero + "                            \n                            title=\"" + _sesion.Paciente + "\">\n                            " + getDivTurnoInnerHTML(_sesion) + "</div>";
        return divCelda;
    }
    function getDivTurnoInnerHTML(_sesion) {
        var innerHTML;
        if (_sesion.Estado == 7 || (_sesion.Estado == 1 && _sesion.TurnoID == 0)) {
            innerHTML = "" + getNombreEstado(_sesion.Estado);
        }
        else {
            innerHTML = options.vista == 's' ?
                _sesion.Numero + " / " + _sesion.CantidadSesiones + (_sesion.DobleOrden ? '<span class="icon-calendar" title="Paciente con doble orden"/><br>' : '<br>') + getNombreEstado(_sesion.Estado)
                : (_sesion.Paciente ? _sesion.Paciente : "Sin Paciente") + " " + (_sesion.Aseguradora ? '<br>OS: ' + _sesion.Aseguradora + '-' + _sesion.Plan : '') + " <br>\n                       Sesion: " + _sesion.Numero + " / " + _sesion.CantidadSesiones + "<br>\n                        " + (_sesion.Diagnostico ? _sesion.Diagnostico + "<br>" : '') + "\n                        " + (_sesion.Observaciones ? "Obs: " + _sesion.Observaciones + "<br>" : '') + "\n                        " + (_sesion.DobleOrden ? '<span class="icon-calendar"/>Doble Orden<br>' : '') + "\n                        " + getNombreEstado(_sesion.Estado);
            if (_sesion.SinAsignar) {
                innerHTML += "<span class=\"icon-attention sin-fecha\" title=\"Sesiones sin fechas asignadas\"></span>";
            }
        }
        return innerHTML;
    }
    function renderBloqueosAgenda() {
        if (options.bloqueosAgenda) {
            options.bloqueosAgenda.forEach(function (bloqueo) {
                var rCelda;
                var rowSpan = 1;
                bloqueo.fecha = bloqueo.fecha ? bloqueo.fecha : bloqueo.FechaHora.split('T')[0].replace(/-/g, '');
                bloqueo.hora = bloqueo.hora ? bloqueo.hora : bloqueo.FechaHora.split('T')[1].substr(0, 5).replace(':', '');
                var sDesde = bloqueo.TurnoSimultaneo;
                var sHasta = bloqueo.TurnoSimultaneo;
                if (bloqueo.TurnoSimultaneo == 0) {
                    sDesde = 1;
                    sHasta = options.consultorios.find(function (consultorio) { return consultorio.ID == bloqueo.ConsultorioID; }).TurnosSimultaneos;
                }
                for (var ts = sDesde; ts <= sHasta; ts++) {
                    var celSesionID = "#F" + bloqueo.fecha + "H" + bloqueo.hora + "C" + bloqueo.ConsultorioID + "S" + ts;
                    var celda = options.divGrilla.querySelector(celSesionID);
                    if (celda) {
                        celda.innerHTML = '';
                        celda.rowSpan = 1;
                        celda.style.display = 'table-cell';
                        celda.className = "celda-turno turno-bloqueo-agenda";
                        celda.style.backgroundColor = 'orangered';
                        celda.draggable = "false";
                        for (var item in celda.dataset) {
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
            var id = CeldaIdToObject(celda.id);
            var hora = id.hora;
            var idCelda = celda.id;
            setCeldaDroppable(options.tabla.querySelector("#" + idCelda));
            for (var rs = celda.rowSpan; rs >= 1; rs--) {
                var nuevaHora = sesionSiguiente(hora);
                CleanCelda(options.tabla.querySelector("#" + idCelda));
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
        for (var item in celda.dataset) {
            delete celda.dataset[item];
        }
        celda.dataset.estado = "0";
        celda.dataset.bk = celda.style.backgroundColor;
    }
    function setDivsDraggable() {
        var divs = options.tabla.querySelectorAll('[draggable=true]');
        divs.forEach(function (div) { return setDivDraggable(div); });
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
        var celdaId = e.target.id.split('D')[0];
        var celda = options.tabla.querySelector(celdaId);
        var col = options.tabla.querySelector('#' + options.idColDrag);
        var row = options.tabla.querySelector('#' + options.idRowDrag);
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
        var celdas = options.tabla.querySelectorAll(".celda-droppable");
        celdas.forEach(function (celda) { return setCeldaDroppable(celda); });
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
    }
    function dragleaveEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        e.target.classList.remove('dragenter');
        var eID = e.target.id;
        var idCol = eID.substr(0, 9) + eID.substr(14, eID.indexOf('S') - 14);
        var idRow = eID.substr(9, 5);
        var col = options.tabla.querySelector('#' + idCol);
        var row = options.tabla.querySelector('#' + idRow);
        if (col && row) {
            row.classList.remove('hover-drag-title');
            col.classList.remove('hover-drag-title');
        }
    }
    function dragoverEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        var eID = e.target.id;
        var idColDrag = eID.substr(0, 9) + eID.substr(14, eID.indexOf('S') - 14);
        var idRowDrag = eID.substr(9, 5);
        var col = options.tabla.querySelector('#' + idColDrag);
        var row = options.tabla.querySelector('#' + idRowDrag);
        if (col && row) {
            col.classList.add('hover-drag-title');
            row.classList.add('hover-drag-title');
        }
    }
    function dropEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        var tdDestino;
        if (e.target.nodeName == 'TD') {
            tdDestino = e.target;
        }
        else {
            tdDestino = e.target.parentElement;
        }
        e.target.classList.remove('dragenter');
        cambiarTurnoDropped(tdDestino, e.dataTransfer.getData('divId'));
    }
    function cambiarTurnoDropped(celda, divId) {
        var btnCambiar_click = function (e) {
            $("#cambiarTurnoDroppedModal").modal('hide');
            updating();
            btnGuardar.onclick = undefined;
            if (!sobreturno) {
                var _sesiones = options.sesiones.filter(function (s) { return s.TurnoID == _sesionAnterior.TurnoID && s.Numero == _sesionAnterior.Numero; });
                var _estado = parseInt(_sesiones[0].Estado);
                var _newSesiones = [];
                var _hora = celda.id.substr(celda.id.indexOf('H') + 1, 4);
                var _fecha = celda.id.substr(celda.id.indexOf('F') + 1, 8);
                var _turnoSimultaneo = celda.id.split('S')[1];
                var _consultorioID = celda.id.substr(celda.id.indexOf('C') + 1, celda.id.indexOf('S') - celda.id.indexOf('C') - 1);
                for (var i = 0; i < parseInt(cmbSesiones.value); i++) {
                    var _newSesion = {
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
                    _sesiones.forEach(function (s) {
                        s.Estado = motivo.value;
                        delete s.sesiones;
                    });
                    _newSesiones = _newSesiones.concat(_sesiones);
                    var url = Domain + "Sesion/CambiarFecha";
                    var promise = ajaxPromise("PUT", url, _newSesiones);
                    promise.then(function (data) { return dibujarGrilla(); }, function (data) {
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
                var _sesiones = options.sesiones.filter(function (s) { return s.TurnoID == _sesionAnterior.TurnoID && s.Numero == _sesionAnterior.Numero; });
                var _estado = parseInt(_sesiones[0].Estado);
                var _newSesiones = [];
                var _hora = celda.id.substr(celda.id.indexOf('H') + 1, 4);
                var _fecha = celda.id.substr(celda.id.indexOf('F') + 1, 8);
                var _turnoSimultaneo = celda.id.split('S')[1];
                var _consultorioID = celda.id.substr(celda.id.indexOf('C') + 1, celda.id.indexOf('S') - celda.id.indexOf('C') - 1);
                for (var i = 0; i < parseInt(cmbSesiones.value); i++) {
                    var _newSesion = {
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
                _sesiones.forEach(function (s) {
                    s.Estado = motivo.value;
                    delete s.sesiones;
                });
                _newSesiones = _newSesiones.concat(_sesiones);
                var url = Domain + "Sesion/CambiarFecha/SobreTurno";
                var promise = ajaxPromise("PUT", url, _newSesiones);
                promise.then(function (data) { return dibujarGrilla(); }, function (data) {
                    showErrorMessage('Cambio de Turno', data);
                    dibujarGrilla();
                });
            }
        };
        var modal = options.divGrilla.querySelector('#cambiarTurnoDroppedModal');
        var btnGuardar = modal.querySelector('#btnCambiarTurnoDropped');
        var descripcion = modal.querySelector('#cambiarTurnoDroppedDescripcion');
        var cmbSesiones = modal.querySelector('#cmbSesionesCambiarTurnoDropped');
        var motivo = modal.querySelector('#cmbMotivoCambiarTurnoDropped');
        var _sesionAnterior = options.sesiones.find(function (s) { return s.ID == options.tabla.querySelector('#' + divId).dataset.id; });
        var sobreturno;
        if (celda.classList.contains('turno-tomado')) {
            cmbSesiones.value = celda.rowSpan;
            cmbSesiones.disabled = true;
            sobreturno = true;
        }
        else {
            cmbSesiones.disabled = false;
            cmbSesiones.value = options.tabla.querySelector("#" + divId.split('D')[0]).rowSpan;
            sobreturno = false;
        }
        btnGuardar.onclick = btnCambiar_click;
        console.dir(btnGuardar);
        $("#cambiarTurnoDroppedModal").modal();
    }
    function _fechaActual() {
        var fecha = new Date();
        var sDia = "00" + fecha.getDate();
        var sMes = "00" + (fecha.getMonth() + 1);
        var sAnio = fecha.getFullYear();
        var sFecha = sDia.substr(-2) + "/" + sMes.substr(-2) + "/" + sAnio;
        return sFecha;
    }
    function getNombreEstado(idEstado) {
        var resu = '';
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
    function anularSesionesSiguientes(sesionID) {
        var url = Domain + "Sesion/Siguientes/Anular";
        var params = {};
        params.id = sesionID;
        var promise = ajaxPromise("PUT", url, params);
        promise.then(dibujarGrilla());
    }
    function anularSesionesPendientes(turnoID) {
        var url = Domain + "Sesion/Pendiente/Anular";
        var params = {};
        params.id = turnoID;
        var promise = ajaxPromise("PUT", url, params);
        promise.then(dibujarGrilla());
    }
    function setEstadoCancelado(sesionID) {
        var url = Domain + "Sesion/Estado/Cancelar";
        var params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, dibujarGrilla);
    }
    function setEstadoConfirmado(sesionID) {
        var url = Domain + "Sesion/Estado/Confirmar";
        var params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, changeEstadoOK);
    }
    function setEstadoAsistio(sesionID) {
        var url = Domain + "Sesion/Estado/Asistio";
        var params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, changeEstadoOK);
    }
    function setEstadoNoAsistio(sesionID) {
        var url = Domain + "Sesion/Estado/NoAsistio";
        var params = {};
        params.id = sesionID;
        changeEstadoSesion(url, params, changeEstadoOK);
    }
    function changeEstadoSesion(url, params, callback) {
        var promise = ajaxPromise("PUT", url, params);
        promise.then(callback);
    }
    function changeEstadoOK(data) {
        var _sesion = JSON.parse(JSON.parse(data));
        var _divSesion = options.tabla.querySelector("div[data-id='" + _sesion.ID + "']");
        _divSesion.innerHTML = getDivTurnoInnerHTML(_sesion);
        _divSesion.dataset.estado = _sesion.Estado;
        _divSesion.draggable = _sesion.Estado == 2 ? true : false;
    }
    function validarHorarioReservaBloqueo(_idCelda, _cantidad) {
    }
    function sesionSiguiente(currentValue) {
        var horaSesion;
        var _minutos, _hora;
        _minutos = parseInt(currentValue.substr(2, 2)) + options.duracionModulo;
        _hora = parseInt(currentValue.substr(0, 2));
        _hora = _hora + Math.floor(_minutos / 60);
        _minutos = _minutos % 60;
        horaSesion = (_hora.toString().length == 1 ? '0' + _hora.toString() : _hora.toString())
            + (_minutos.toString().length == 1 ? '0' + _minutos.toString() : _minutos.toString());
        return horaSesion;
    }
    function getConsultorios() {
        return __awaiter(this, void 0, void 0, function () {
            var url, responseConsultorios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Domain + 'api/grilla/Consultorios';
                        return [4, fetch(url)];
                    case 1:
                        responseConsultorios = _a.sent();
                        return [4, responseConsultorios.json()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    }
    function getRangoHorario() {
        return __awaiter(this, void 0, void 0, function () {
            var url, responseHorarios;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Domain + 'api/grilla/RangoHorario';
                        return [4, fetch(url)];
                    case 1:
                        responseHorarios = _a.sent();
                        return [4, responseHorarios.json()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    }
    function getRangoFecha() {
        return __awaiter(this, void 0, void 0, function () {
            var responseDias;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Domain + "/api/grilla/RangoFecha/" + options.fecha.getDate() + "/" + (options.fecha.getMonth() + 1) + "/" + options.fecha.getFullYear() + "/" + options.vista;
                        return [4, fetch(url)];
                    case 1:
                        responseDias = _a.sent();
                        return [4, responseDias.json()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    }
    function getSesiones() {
        return __awaiter(this, void 0, void 0, function () {
            var responseSesiones;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Domain + "/api/grilla/sesiones/" + options.dias[0].Fecha + "/" + options.vista;
                        return [4, fetch(url)];
                    case 1:
                        responseSesiones = _a.sent();
                        return [4, responseSesiones.json()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    }
    function getRecesos() {
        return __awaiter(this, void 0, void 0, function () {
            var responseDias;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Domain + "/api/grilla/Receso/" + options.fecha.getDate() + "/" + (options.fecha.getMonth() + 1) + "/" + options.fecha.getFullYear() + "/" + options.vista;
                        return [4, fetch(url)];
                    case 1:
                        responseDias = _a.sent();
                        return [4, responseDias.json()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    }
    function getAusencias() {
        return __awaiter(this, void 0, void 0, function () {
            var responseDias;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Domain + "/api/grilla/Ausencias/" + options.fecha.getDate() + "/" + (options.fecha.getMonth() + 1) + "/" + options.fecha.getFullYear() + "/" + options.vista;
                        return [4, fetch(url)];
                    case 1:
                        responseDias = _a.sent();
                        return [4, responseDias.json()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    }
    function getFeriados() {
        return __awaiter(this, void 0, void 0, function () {
            var responseDias;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = Domain + "/api/grilla/Feriado/" + options.fecha.getDate() + "/" + (options.fecha.getMonth() + 1) + "/" + options.fecha.getFullYear() + "/" + options.vista;
                        return [4, fetch(url)];
                    case 1:
                        responseDias = _a.sent();
                        return [4, responseDias.json()];
                    case 2: return [2, _a.sent()];
                }
            });
        });
    }
    function ajax(metodo, url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open(metodo, url);
        xhr.addEventListener('error', xhr_error);
        xhr.addEventListener('load', xhr_load);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
        function xhr_error(e) {
        }
        function xhr_load(e) {
            if (xhr.status == 200 || xhr.status == 201) {
                callback(e.target.response);
            }
        }
    }
    function ajax(metodo, url, callback, params) {
        var xhr = new XMLHttpRequest();
        xhr.open(metodo, url);
        xhr.addEventListener('error', xhr_error);
        xhr.addEventListener('load', xhr_load);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(params));
        function xhr_error(e) {
        }
        function xhr_load(e) {
            if (xhr.status == 200 || xhr.status == 201) {
                callback(e.target.response);
            }
        }
    }
    var ajaxPromise = function (metodo, url, params) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(metodo, url);
            xhr.addEventListener('error', xhr_error);
            xhr.addEventListener('load', xhr_load);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(params ? JSON.stringify(params) : null);
            function xhr_error(e) {
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
    };
    function createPDF(data) {
        function createTableDoc(_tabla) {
            var table = _tabla;
            var content = [];
            var totalConsultorios = getTotalConsultorios(options.consultorios);
            var width = 97 / totalConsultorios;
            var paginas = options.vista == 'd' ? 1 : 5;
            var _loop_1 = function (num) {
                var body = [];
                var headerTable = [];
                headerTable.push({
                    text: table.rows[0].cells[num + 1].innerText.split(" ")[0] + ' '
                        + table.rows[0].cells[num + 1].innerText.substr(table.rows[0].cells[num + 1].innerText.length - 10, 10),
                    colSpan: totalConsultorios + 1,
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                });
                for (var i = 0; i < totalConsultorios; i++) {
                    headerTable.push({
                        fillColor: undefined,
                        _maxWidth: 0,
                        _minWidth: 0,
                        _span: true
                    });
                }
                body.push(headerTable);
                headerTable = [];
                var widths = [];
                headerTable.push({
                    text: 'Hora',
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                });
                widths.push('3%');
                options.consultorios.forEach(function (c) {
                    headerTable.push({
                        text: c.Descripcion,
                        colSpan: c.TurnosSimultaneos,
                        fontSize: 8,
                        bold: true,
                        alignment: 'center'
                    });
                    for (var i = 0; i < c.TurnosSimultaneos; i++) {
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
                    var row = [];
                    row.push({
                        text: table.rows[y].cells[0].innerText,
                        fontSize: 7
                    });
                    for (var x = num * totalConsultorios + 1; x < (num + 1) * totalConsultorios + 1; x++) {
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
                        headerRows: 2,
                        widths: widths,
                        body: body
                    }
                });
                content.push({ text: '', pageBreak: 'after' });
            };
            for (var num = 0; num < paginas; num++) {
                _loop_1(num);
            }
            var docDefinition = {
                content: content,
                pageSize: 'A4',
                pageOrientation: 'landscape'
            };
            return docDefinition;
        }
        pdfMake.createPdf(createTableDoc(data)).download();
    }
})();
//# sourceMappingURL=grilla.js.map