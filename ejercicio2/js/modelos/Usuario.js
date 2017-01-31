var Kings = window.Kings || {};

var Kings = ( function() {
    function Kings() {
        var self = this, dataSettings;
        self.init(true);
    }
    return Kings;
}());

Kings.Usuario = function(parametros) {
    this.indice = parametros.indice;
    this.nombre = parametros.nombre;
    this.edad = parametros.edad;
    this.correo = parametros.correo;
    this.telefono = parametros.telefono;
};

Kings.Usuario.prototype = {
    constructor: Kings.Usuario,

    agregarA: function(destino) {
        console.log(this);
        var self = this;
        if (this.nombre != '' && this.edad != '' && this.correo != '' && this.telefono != '') {
            var nuevo = $('<div />', {
                class: 'usuario'
            })

            var nombre = $('<p />', { text: this.nombre });
            var edad = $('<p />', { text: this.edad });
            var correo = $('<p />', { text: this.correo });
            var telefono = $('<p />', { text: this.telefono });

            var borrar = $('<input />', {
                type: 'button',
                value: 'Borrar',
                class: 'btnDelete'
            }).click(function() {
                nuevo.remove();
                self.borrar();
            });

            nuevo.append(nombre);
            nuevo.append(edad);
            nuevo.append(correo);
            nuevo.append(telefono);
            nuevo.append(borrar);

            destino.append(nuevo);
        }
    },

    borrar: function() {
        console.log(this.indice);
        Kings.listaUsuarios.splice(this.indice,1);
        localStorage.setItem('Usuarios', JSON.stringify(Kings.listaUsuarios));
    }
};
