define(['jquery', 'vue', "./game/Game"],  function($, Vue, Game) {
    $(document).ready(function() {
        $('#gameWindow').KingsGame();
        // new Vue({
        //     el: '#App',
        //     data: {
        //         message: 'Hello Vue.js!'
        //     }
        // });
    });
});
