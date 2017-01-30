define(['vue', "./game/Game"],  function(Vue, Game) {
    $(document).ready(function() {
        new Vue({
            el: '#App',
            data: {
                gameStarted: false,
                welcome: 'New game'
            },
            computed: {},
            watch: {
                gameStarted: function(state) {
                    console.log('game started');
                }
            },
            methods: {
                start: function() {
                    this.gameStarted = true;
                }
            },
            updated: function() {
                if (this.gameStarted) {
                    $('#gameWindow').initGame();
                }
            }
        });
    });
});
