var Kings = window.Kings || {};

var Kings = ( function() {
    function Kings() {
        var self = this, dataSettings;
        self.init(true);
    }
    return Kings;
}());

Kings.Producto = function(parametros) {
    this.nombre = parametros.nombre;
    this.detalles = parametros.detalles;
    this.precio = parametros.precio;
};

Kings.Producto.prototype = {
    constructor: Kings.Producto,

    agregarA: function(destino) {
        if (this.nombre != '' && this.detalles != '' && this.precio != '') {
            var nuevo = $('<div />', {
                class: 'product'
            })

            var nombre = $('<p />', { text: this.nombre });
            var detalles = $('<p />', { text: this.detalles });
            var precio = $('<p />', { text: this.precio });

            nuevo.append(nombre);
            nuevo.append(detalles);
            nuevo.append(precio);

            var borrar = $('<input />', {
                type: 'button',
                value: 'Borrar',
                class: 'btnDelete'
            }).click(function() {
                nuevo.remove();
            });

            nuevo.append(borrar);
            destino.append(nuevo);
        }
    },

    getName: function() { return this.nombre },

    getDetails: function() { return this.detalles },

    getPrice: function() { return this.precio },

    setName: function(nombre) { this.nombre  = nombre },

    setDetails: function(detalle) { this.detalles = detalle},

    setPrice: function(precio) { this.precio = precio }
};
