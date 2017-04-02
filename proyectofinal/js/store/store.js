var Vue = require('vue');
var Vuex = require('vuex');

Vue.use(Vuex);

module.exports = new Vuex.Store({
    state: {
        ready: false,
        update: false,
        score: 0,
        gameStarted: false,
        gamePause: false,
        gameOver: false,
        configuration: {
            masterVolume: 100,
            music: 100,
            sfx: 100
        }
    },
    mutations: {
        setScore: function (state, score) {
            state.score = score;
        },
        setGameState: function(state, e) {
            state.gameStarted = e;
        },
        setGameOver: function(state, e) {
            state.gameOver = e;
        },
        pauseGame: function(state, e) {
            state.gamePause = e;
        },
        setGameReady: function(state) {
            state.ready = true;
        },
        setConfig: function(state, config) {
            state.configuration = config;
        },
        setUpdate: function(state, u) {
            state.update = u;
        }
    }
});
