<template>
    <div class="leaderboard content">
        <div class="col-xs-12">
            <h1><img class="crown" :src="'Assets/img/crown.png'" alt="corona">Ranking</h1>
        </div>
        <div class="col-md-6" v-for="player in players">
            <player-plate :player="player"></player-plate>
        </div>
    </div>
</template>

<script>
    var store = require('./../../store/store.js');
    module.exports = {
        data() {
            return {
                players: []
            };
        },
        computed: {
            update: function() {
                return store.state.update;
            }
        },
        watch: {
            update: function() {
                if (this.update) {
                    store.commit('setUpdate', false);
                    this.downloadInformation();
                }
            }
        },
        methods: {
            downloadInformation: function() {
                var self = this;
                $.post("./php/consulta.php",{},
                function(json, status){
                    this.players = $.parseJSON(json);
                }.bind(this));
            },
        },
        mounted: function() {
            this.downloadInformation();
        },
    }
</script>

<style>
    .leaderboard {
        background: #45484d; /* Old browsers */
        background: -moz-linear-gradient(top, #45484d 0%, #000000 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top, #45484d 0%,#000000 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom, #45484d 0%,#000000 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#45484d', endColorstr='#000000',GradientType=0 ); /* IE6-9 */
        padding: 15px 20px;
        width: 80vw;
        height: 500px;
        overflow-y: scroll;
        margin: 50px auto;
    }
    .leaderboard h1 {
        text-align: center;
        color: white;
    }
    .leaderboard .crown {
        height: 50px;
        width: auto;
        vertical-align: bottom;
    }
</style>
