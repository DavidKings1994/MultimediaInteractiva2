<template>
    <div class="loadingWindow">
        <img :src="'Assets/img/loading.jpg'" alt="loading" class="background">
        <button
            v-on:click='start()'
            class="btn btn-danger btn-lg"
            v-bind:class="{ disabled: !ready }"
            id="startButon">
            {{ buttonText }}
        </button>
    </div>
</template>

<script>
    var store = require('./../../store/store.js');
    module.exports = {
        data: function() {
            return {

            };
        },
        computed: {
            paused: function() {
                return store.state.gamePause;
            },
            ready: function() {
                $('#startButon').prop('disabled', false);
                return store.state.ready;
            },
            buttonText: function() {
                return (this.ready ? (this.paused ? 'Continuar' : 'Iniciar!') : 'Cargando...');
            }
        },
        methods: {
            start: function() {
                this.$emit('start');
            }
        },
        mounted: function() {
            if (!this.ready) {
                $('#startButon').prop('disabled', true);
            }
        }
    }
</script>

<style>
    .loadingWindow, .loadingWindow .background {
        width: 100%;
        height: 100%;
    }
    #startButon {
        width: 300px;
        height: 100px;
        font-size: 30px;
        font-family: digital;
        position: absolute;
        bottom: 10%;
        right: 10%;
    }
</style>
