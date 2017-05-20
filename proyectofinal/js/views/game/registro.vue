<template>
    <transition name="bounce-animation" appear>
        <div id="registroWindow">
            <span>Nueva puntuacion!</span>
            <input type="text" name="nombre" placeholder="nombre">
            <input type="button" class="btn-danger" value="Guardar" v-on:click="guardar()">
        </div>
    </transition>
</template>

<script>
    var store = require('./../../store/store.js');
    module.exports = {
        data: function() {
            return {

            };
        },
        methods: {
            guardar: function() {
                var self = this;
                if ($('#registroWindow input[name="nombre"]').val().trim() != '') {
                    $.post("./php/registroAnonimo.php",
                    {
                        nombre: $('#registroWindow input[name="nombre"]').val().trim(),
                        puntos: store.state.score
                    },
                    function(data, status) {
                        store.commit('setUpdate', true);
                        var resul = $.parseJSON(data);
                        if (resul.resultado == 1) {
                            self.$emit('cerrarConRecord');
                        } else {
                            self.$emit('cerrar');
                        }
                    });
                }
                this.$emit('cerrar');
            }
        },
        mounted: function() {
            $('#registroWindow input[name="nombre"]').on('keyup', function(evt) {
                evt.stopPropagation();
            });
            $('#registroWindow input[name="nombre"]').on('keydown', function(evt) {
                evt.stopPropagation();
            });
        }
    }
</script>

<style>
    #registroWindow {
        width: 400px;
        padding: 20px 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -75px;
        margin-left: -200px;
        z-index: 100;
        background: #45484d;
        background: -moz-linear-gradient(top, #45484d 0%, #000000 100%);
        background: -webkit-linear-gradient(top, #45484d 0%,#000000 100%);
        background: linear-gradient(to bottom, #45484d 0%,#000000 100%);
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#45484d', endColorstr='#000000',GradientType=0 );
        border-radius: 5px;
        border-style: solid;
        border-color: white;
        border-width: 2px;
    }
    #registroWindow h1 {
        text-align: center;
        color: white;
    }
    #registroWindow img {
        height: 69px;
        width: auto;
        position: absolute;
        top: -37px;
        left: -35px;
        display: inline-block;
        transform: rotate(-30deg);
    }
    #registroWindow span {
        color: white;
        font-size: 30px;
        text-align: center;
        width: 100%;
        display: block;
        margin: 0 0 15px;
    }
    #registroWindow input[type="text"] {
        width: 100%;
        padding: 3px 5px;
        display: block;
        margin: 0px auto 20px;
        color: rgb(50,50,50);
        font-family: digital;
        font-size: 25px;
    }
    #registroWindow input[type="button"] {
        display: block;
        width: 100%;
        height: 50px;
        font-size: 20px;
        font-family: digital;
    }
    .bounce-animation-transition {
        display: inline-block;
        transform: scale(0) !important;
    }
    .bounce-animation-enter {
        animation: bounce-in 2s;
        -webkit-animation: bounce-in 2s;
    }
    .bounce-animation-leave {
        animation: bounce-out 2s;
        -webkit-animation: bounce-out 2s;
    }
    @keyframes bounce-in {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes bounce-out {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.5);
        }
        100% {
            transform: scale(0);
        }
    }
</style>
