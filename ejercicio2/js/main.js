$(document).ready(function() {
    Kings.listaUsuarios = [];
    var borrar = function(usuario) {
        listaUsuarios.pop(usuario);
        localStorage.setItem('Usuarios', JSON.stringify(Kings.listaUsuarios));
    };
    var json = localStorage.getItem('Usuarios');
    if (json != null) {
        Kings.listaUsuarios = JSON.parse(json);
        for (var i = 0; i < Kings.listaUsuarios.length; i++) {
            var usuario = new Kings.Usuario({
                indice: i,
                nombre: Kings.listaUsuarios[i].nombre,
                edad:Kings.listaUsuarios[i].edad,
                correo: Kings.listaUsuarios[i].correo,
                telefono: Kings.listaUsuarios[i].telefono
            });
            usuario.agregarA($('#Lista'));
        }
    }
    $('#btnSave').click(function() {
        var usuario = new Kings.Usuario({
            indice: Kings.listaUsuarios.length,
            nombre: $('input[name="name"]').val(),
            edad: $('input[name="age"]').val(),
            correo: $('input[name="email"]').val(),
            telefono: $('input[name="phone"]').val()
        });
        usuario.agregarA($('#Lista'));
        Kings.listaUsuarios.push(usuario);
        localStorage.setItem('Usuarios', JSON.stringify(Kings.listaUsuarios));
    });
});
