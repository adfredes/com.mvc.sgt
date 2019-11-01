(function () {
    var sgtApp = angular.module("sgtApp");
    

    sgtApp.component('profesionalEdit', {
        templateUrl: Domain + 'Profesional/CreateOrEdit',
        controller: ['crudService', '$filter', profesionalEditController],
        bindings: {
            profesional: "<",
            diasSemana: "<",
            saveCallback: "="
        }
    });


    function profesionalEditController(crudService, $filter) {
        let vm = this;
        vm.error = '';
        vm.Tipos = [];
        vm.checkBoxTipos = {};
        vm.minHours = '';
        vm.maxHours = '';        
        vm.NuevoDia = {};
        let agenda;
        

        vm.$onInit = () => {
            let promise = crudService.GetPHttp('api/tiposesion/all/cmb');
            promise.then(data => {
                vm.Tipos = data;
                vm.checkBoxTipos = {};
            })
                .catch(err => {
                    vm.Tipos = [];
                    vm.checkBoxTipos = {};
                });

            let promise2 = crudService.GetPHttp('Agenda/JSON');
            promise2.then(data => {
                agenda = JSON.parse(data);
                vm.minHours = agenda.HoraDesde.split("T")[1];
                vm.maxHours = agenda.HoraHasta.split("T")[1];                                
            })
                .catch(err => {                    
                }); 

            

            
        };

        vm.addDay = (dia) => {            
            if (dia.diaSemana > 0
                //&& dia.desde >= agenda.HoraDesde && dia.hasta <= agenda.HoraHasta
                && dia.desde < dia.hasta) {
                if (!vm.profesional.Horarios) {
                    vm.profesional.Horarios = [];
                }
                vm.profesional.Horarios.push(JSON.parse(JSON.stringify(dia)));
                vm.NuevoDia = {diaSemana: null, desde: null, hasta: null};
            }                        
        };

        vm.removeDay = (index) => {
            vm.profesional.Horarios.splice(index, 1);
        };

        vm.nameOfDay = (numero) => {               
            return vm.diasSemana.find(e => e.Value == numero);
        };

        //(function GetTiposSesion() {

        //    var promise = crudService.GetPHttp('api/tiposesion/all/cmb');
        //    promise.then(data => {
        //        vm.Tipos = data;                
        //        vm.checkBoxTipos = {};
        //    })
        //        .catch(err => {
        //            vm.Tipos = [];
        //            vm.checkBoxTipos = {};
        //        });
        //})();

        vm.$onChanges = (change) => {            
            if (change.profesional && !change.profesional.isFirstChange()) {
                SetFalseCheckboxes(vm.Tipos, vm.checkBoxTipos);
                SetTrueCheckboxes(vm.checkBoxTipos, vm.profesional.TiposDeSesiones);
                //vm.Tipos.forEach(e => {
                //    vm.checkBoxTipos[e.Value] = false;
                //});
                //if (vm.profesional.TiposDeSesiones) {
                //    vm.profesional.TiposDeSesiones.forEach((e) => vm.checkBoxTipos[e.TipoSesionID.toString()] = true);
                //}
            }
        };

        SetFalseCheckboxes = (sesiones, checkboxes) => sesiones.forEach(e => checkboxes[e.Value] = false);


        SetTrueCheckboxes = (checkboxes, sesiones) => {
            if (sesiones) {
                sesiones.forEach((e) => checkboxes[e.TipoSesionID.toString()] = true);
            }
        };


        vm.AddOrDelete = function (idTipo) {
            if (!vm.checkBoxTipos[idTipo]) {
                vm.profesional.TiposDeSesiones = vm.profesional.TiposDeSesiones ? vm.profesional.TiposDeSesiones : [];
                vm.profesional.TiposDeSesiones.push({
                    'ID': 0,
                    'TipoSesionID': idTipo,
                    'ProfesionalID': vm.profesional.ID
                });
            }
            else {
                var i = vm.profesional.TiposDeSesiones.findIndex(e => e.TipoSesionID === idTipo);
                vm.profesional.TiposDeSesiones.splice(i, 1);
            }
        };

        vm.save = function (data) {

            var promise = crudService.PostHttp('/Profesional/CreateOrEdit', data);
            promise.then(function (data) {
                $('#CreateOrUpdate').modal('hide');
                vm.saveCallback();
            })
                .catch(function (error) {                    
                    vm.error = error.data;
                }
                );
        };

        vm.changeHour = function (setValue, element) {
            //let setTimeValue = $filter('date')(setValue, 'HH:mm');
          
            //vm.profesional.Agenda[0].HoraDesde = new Date('1970', '01', '01', setTimeValue.split(':')[0], setTimeValue.split(':')[1]);
            //element = setTimeValue;
        
        };
    }
})();