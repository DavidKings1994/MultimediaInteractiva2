define(['vue', 'vuex', "./game/Game", './store/store'],  function(Vue, Vuex, Game, Store) {

    Vue.component('leaderboard', require('./views/leaderboard/leaderboard.vue'));
    Vue.component('player-plate', require('./views/leaderboard/plate.vue'));
    Vue.component('config', require('./views/configuration/config.vue'));
    Vue.component('loading', require('./views/game/loading.vue'));
    Vue.component('newrecord', require('./views/game/record.vue'));

    $(document).ready(function() {
        window.addEventListener('keydown', function(e) {
            if(e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
            }
        });

        var store = require('./store/store.js');
        var json = localStorage.getItem('configurationERMI');
        if (json != null) {
            var valores = JSON.parse(json);
            store.commit('setConfig', {
                masterVolume: valores.masterVolume,
                music: valores.music,
                sfx: valores.sfx
            });
        }

        new Vue({
            el: '#App',
            data: {
                showConfig: false,
                showRecord: false,
                usuarioLogeado: true
            },
            computed: {
                score: function() {
                    return store.state.score;
                },
                gameStarted: function() {
                    return store.state.gameStarted;
                },
                gamePaused: function() {
                    return !store.state.gamePause;
                },
                gameReady: function() {
                    return store.state.ready;
                },
                gameOver: function() {
                    return store.state.gameOver;
                }
            },
            watch: {
                gameOver: function() {
                    if (this.gameOver) {
                        this.testAPI();
                        $('meta[property="og:description"]').attr('content', 'Mi puntuacion: ' + this.score + ' km!');
                    }
                }
            },
            methods: {
                startGame: function() {
                    store.commit('setGameState', true);
                    store.commit('setGameOver', false);
                    $( document ).trigger( "gamePause" );
                },
                uploadInformation: function(parameters) {
                    var self = this;
                    $.post("./php/registro.php",
                    {
                        nombre: parameters.name,
                        puntos: parseInt(parameters.score.toString()),
                        idPuntuacion: parameters.id.toString(),
                        urlFoto: parameters.url
                    },
                    function(data, status) {
                        store.commit('setUpdate', true);
                        var resul = $.parseJSON(data);
                        if (resul.resultado == 1) {
                            self.showRecord = true;
                        }
                    });
                },
                checkLoginState: function() {
                    var self = this;
                    FB.getLoginStatus(function(response) {
                        self.statusChangeCallback(response);
                    });
                },
                testAPI: function() {
                    var self = this;
                    FB.api('/me', function(response) {
                        var _id = response.id;
                        var _name = response.name;
                        FB.api("/"+response.id+"/picture?redirect=0", function (response) {
                            if (response && !response.error) {
                                self.uploadInformation({
                                    name: _name,
                                    score: self.score,
                                    id: _id,
                                    url: response.data.url
                                });
                            }
                        });
                    });
                },
                statusChangeCallback: function(response) {
                    if (response.status === 'connected') {
                        this.usuarioLogeado = true;
                        if (this.score > 0) {
                            this.testAPI();
                        }
                    } else if (response.status === 'not_authorized') {
                        this.usuarioLogeado = false;
                    } else {
                        this.usuarioLogeado = false;
                    }
                },
            },
            created: function() {
                var self = this;
                window.fbAsyncInit = function() {
                    FB.init({
                        appId      : '2372239756248316',
                        cookie     : true,
                        xfbml      : true,
                        version    : 'v2.8'
                    });

                    FB.Event.subscribe('auth.login', function(response) {
                        self.checkLoginState();
                    });

                    FB.Event.subscribe('auth.logout', function(response) {
                        self.checkLoginState();
                    });

                    FB.getLoginStatus(function(response) {
                        self.statusChangeCallback(response);
                    });

                };

                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) return;
                    js = d.createElement(s); js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
            },
            mounted: function() {
                $('#gameWindow').initGame();
            }
        });
    });
});
