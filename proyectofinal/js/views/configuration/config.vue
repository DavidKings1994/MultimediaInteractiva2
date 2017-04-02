<template>
    <transition name="slide-fade">
        <div id="configWindow">
            <div class="config-content">
                <div class="row config-row">
                    <div class="col-xs-12">
                        <p class="config-text" style="text-align: center;">Configuraciones</p>
                    </div>
                </div>
                <!-- master -->
                <div class="row config-row">
                    <div class="col-xs-4">
                        <p class="config-text">Volumen General</p>
                    </div>
                    <div class="col-xs-8">
                        <div class="col-xs-2 config-input config-text">
                            <span class="glyphicon glyphicon-volume-down"></span>
                        </div>
                        <div class="col-xs-8 config-input">
                            <input type="range" v-model="masterVolume" id="masterVolume" value="masterVolume">
                        </div>
                        <div class="col-xs-2 config-input config-text">
                            <span class="glyphicon glyphicon-volume-up"></span>
                        </div>
                    </div>
                </div>
                <!-- music -->
                <div class="row config-row">
                    <div class="col-xs-4">
                        <p class="config-text">Musica</p>
                    </div>
                    <div class="col-xs-8">
                        <div class="col-xs-2 config-input config-text">
                            <span class="glyphicon glyphicon-volume-down"></span>
                        </div>
                        <div class="col-xs-8 config-input">
                            <input type="range" v-model="music" id="music" value="music">
                        </div>
                        <div class="col-xs-2 config-input config-text">
                            <span class="glyphicon glyphicon-volume-up"></span>
                        </div>
                    </div>
                </div>
                <!-- sfx -->
                <div class="row config-row">
                    <div class="col-xs-4">
                        <p class="config-text">Efectos</p>
                    </div>
                    <div class="col-xs-8">
                        <div class="col-xs-2 config-input config-text">
                            <span class="glyphicon glyphicon-volume-down"></span>
                        </div>
                        <div class="col-xs-8 config-input">
                            <input type="range" v-model="sfx" id="sfx" value="sfx">
                        </div>
                        <div class="col-xs-2 config-input config-text">
                            <span class="glyphicon glyphicon-volume-up"></span>
                        </div>
                    </div>
                </div>
                <div class="row config-row">
                    <div class="col-xs-12">
                        <input type="button" value="Aceptar" v-on:click="close()" class="btn btn-success btn-block">
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    var store = require('./../../store/store.js');
    module.exports = {
        data() {
            return {
                masterVolume: 100,
                music: 100,
                sfx: 100
            };
        },
        watch: {
            masterVolume: function() {
                this.saveConfig();
            },
            music: function() {
                this.saveConfig();
            },
            sfx: function() {
                this.saveConfig();
            }
        },
        created: function() {
            this.loadConfig();
        },
        methods: {
            loadConfig: function() {
                var json = localStorage.getItem('configurationERMI');
                if (json != null) {
                    var valores = JSON.parse(json);
                    this.masterVolume = valores.masterVolume;
                    this.music = valores.music;
                    this.sfx = valores.sfx;
                    this.saveConfig();
                }
            },
            saveConfig: function() {
                store.commit('setConfig', {
                    masterVolume: this.masterVolume,
                    music: this.music,
                    sfx: this.sfx
                });
                $( document ).trigger( "volumeSet" );
                localStorage.setItem('configurationERMI', JSON.stringify(store.state.configuration));
            },
            close: function() {
                this.$emit('cerrar');
            }
        }
    }
</script>

<style>
    #configWindow {
        border-style: solid;
        border-width: 3px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 60vw;
        max-height: 500px;
        overflow-y: scroll;
        background: rgb(69,72,77); /* Old browsers */
        background: -moz-linear-gradient(-45deg, rgba(69,72,77,1) 0%, rgba(0,0,0,1) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(-45deg, rgba(69,72,77,1) 0%,rgba(0,0,0,1) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(135deg, rgba(69,72,77,1) 0%,rgba(0,0,0,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#45484d', endColorstr='#000000',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
        z-index: 100;
        padding: 25px 10px;
        border-radius: 10px;
        color: white;
    }
    .config-text {
        font-family: digital;
        font-size: 23px;
        position: relative;
        transform: translateY(-50%);
        display: block;
        top: 50%;
    }
    .config-row {
        height: 50px;
    }
    .config-row > * {
        height: 100%;
        margin-bottom: 20px;
    }
    .config-content {
        width: 80%;
        margin: 0 auto;
    }
    .config-input {
        text-align: center;
        font-size: 30px;
    }
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to {
        transform: translateX(10px);
        opacity: 0;
    }
</style>
