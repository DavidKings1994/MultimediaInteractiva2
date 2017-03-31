define(['vue', 'vuex', "./game/Game"],  function(Vue, Vuex, Game) {
    $(document).ready(function() {
        window.addEventListener('keydown', function(e) {
            if(e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
            }
        });

        Vue.use(Vuex);

        Vue.component('leaderboard', require('./views/leaderboard/leaderboard.vue'));
        Vue.component('player-plate', require('./views/leaderboard/plate.vue'));
        Vue.component('config', require('./views/configuration/config.vue'));

        const store = new Vuex.Store({
            state: {
                ready: false,
                score: 0,
                gameStarted: false
            },
            mutations: {
                setScore: function (state, score) {
                    state.score = score;
                },
                setGameState: function(state, e) {
                    state.gameStarted = e;
                },
                setGameReady: function() {
                    state.ready = true;
                }
            }
        });

        new Vue({
            el: '#App',
            data: {

            },
            computed: {
                score: function() {
                    return store.state.score;
                },
                gameStarted: function() {
                    return store.state.gameStarted;
                }
            },
            methods: {
                startGame: function() {
                    store.commit('setGameState', true);
                    $('#gameWindow').initGame();
                },
                uploadInformation: function(parameters) {
                    var self = this;
                    $.post("./../php/registro.php",
                    {
                        nombre: parameters.name,
                        puntos: parseInt(parameters.score.toString()),
                        idPuntuacion: parameters.id.toString(),
                        urlFoto: parameters.url
                    },
                    function(data, status){
                        // self.downloadInformation();
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
                        this.testAPI();
                    } else if (response.status === 'not_authorized') {

                    } else {

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
            }
        });
    });
});
