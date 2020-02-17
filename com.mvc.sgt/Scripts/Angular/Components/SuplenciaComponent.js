(function () {
    var sgtApp = angular.module("sgtApp");


    sgtApp.component('profesionalSuplencia', {
        templateUrl: Domain + 'Profesional/Suplencias',
        controller: ['crudService', '$filter', profesionalSuplenciaController],
        bindings: {
            ausencia: "<",
            saveCallback: "="
        }
    });


    function profesionalSuplenciaController(crudService, $filter) {
        let vm = this;
        vm.Suplencia = {};
        vm.error = '';
        vm.minHours = '';
        vm.maxHours = '';
        vm.NuevoDia = {};
        vm.Profesionales = [];
        vm.SuplenciasAusencias = [];
        let agenda;


        vm.$onInit = () => {
            vm.Suplencia = {};
            getProfesionales();
            getSuplencias();
            let promise2 = crudService.GetPHttp('Agenda/JSON');
            promise2.then(data => {
                agenda = JSON.parse(data);
                vm.minHours = agenda.HoraDesde.split("T")[1];
                vm.maxHours = agenda.HoraHasta.split("T")[1];
            })
                .catch(err => {
                });


            let promise3 = crudService.GetPHttp('Agenda/Dias');
            promise3.then(data => {
                vm.diasSemana = data;
            })
                .catch(err => {
                });

        };

        let getProfesionales = () => {
            var promise = crudService.GetPHttp('/Profesional/Listar/Combo');
            promise.then(function (datos) {
                vm.Profesionales = datos;
            })
                .catch(function (error) {
                    vm.error = error.data;
                }
                );
        };

        let getSuplencias = () => {
            if (vm.ausencia && vm.ausencia.ID > 0) {


                vm.SuplenciasAusencias = [];
                var promise = crudService.GetPHttp('/Profesional/Suplencias/' + vm.ausencia.ID);
                promise.then(function (datos) {
                    vm.SuplenciasAusencias = JSON.parse(datos);
                })
                    .catch(function (error) {
                        vm.error = error.data;
                    }
                    );
            }
        };

        vm.addSuplencia = () => {
            let suplencias = [];
            vm.Suplencia.DiaSemana.forEach(d => {
                let diaSuplencia = {
                    ProfesionalID: vm.Suplencia.ProfesionalID,
                    AusenciaID: vm.ausencia.ID,
                    DiaSemana: d,
                    HoraDesde: vm.Suplencia.HoraDesde,
                    HoraHasta: vm.Suplencia.HoraHasta,
                    Habilitado: 1
                };
                suplencias.push(diaSuplencia);
            });
            save(suplencias);            
        };


        vm.nameOfDay = (numero) => {
            return vm.diasSemana.find(e => e.Value == numero);
        };



        vm.$onChanges = (change) => {
            if (change.ausencia) {
                vm.Suplencia = {};
                getSuplencias();
            }
        };








        let save = function (data) {

            var promise = crudService.PostHttp('/Profesional/Suplencias', data);
            promise.then(function (data) {
                vm.Suplencia = {};
                getSuplencias();
            })
                .catch(function (error) {
                    vm.error = error.data;
                }
                );
        };

        vm.delete = id => {
            var promise = crudService.DeleteHttp(`/Profesional/Suplencias/${id}`);
            promise.then(function (data) {
                vm.Suplencia = {};
                getSuplencias();
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