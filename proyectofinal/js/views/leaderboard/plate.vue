<template>
    <div class="row player">
        <div class="col-xs-2" style="height: 130px;">
            <img :src="'/MI2/proyectofinal/Assets/img/Screw-Transparent.png'" class="player-screw screw-up screw-left">
            <img :src="'/MI2/proyectofinal/Assets/img/Screw-Transparent.png'" class="player-screw screw-down screw-left">
        </div>
        <div class="col-xs-8">
            <h1 class="col-xs-12 text">{{ player.puntos }} km</h1>
            <h4 class="col-xs-12 text">{{ player.usuario }}</h4>
        </div>
        <div class="col-xs-2" style="height: 130px;">
            <img :src="'/MI2/proyectofinal/Assets/img/Screw-Transparent.png'" class="player-screw screw-up screw-right">
            <img :src="'/MI2/proyectofinal/Assets/img/Screw-Transparent.png'" class="player-screw screw-down screw-right">
        </div>
        <div class="player-foto-place">
            <img :src="player.urlFoto" class="player-foto">
        </div>
    </div>
</template>

<script>
    module.exports = {
        data() {
            return {

            }
        },
        props: ['player']
    }
</script>

<style>
    .player {
        height: 130px;
        color: white;
        border-style: solid;
        border-color: dimgray;
        border-width: 3px;
        border-radius: 10px;
        margin: 20px 0;
        background: #a90329; /* Old browsers */
        background: -moz-linear-gradient(top, #a90329 0%, #8f0222 74%, #6d0019 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top, #a90329 0%,#8f0222 74%,#6d0019 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom, #a90329 0%,#8f0222 74%,#6d0019 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a90329', endColorstr='#6d0019',GradientType=0 ); /* IE6-9 */
    }
    .player:hover {
        background: #930324; /* Old browsers */
        background: -moz-linear-gradient(top, #930324 0%, #7e021f 29%, #600016 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(top, #930324 0%,#7e021f 29%,#600016 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(to bottom, #930324 0%,#7e021f 29%,#600016 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#930324', endColorstr='#600016',GradientType=0 ); /* IE6-9 */
    }
    .player-foto-place {
        height: 50px;
        width: 50px;
        position: absolute;
        top: 22px;
        left: 12%;
        z-index: 0;
    }
    .player-foto {
        border-style: solid;
        border-color: white;
        border-width: 3px;
        border-bottom-width: 15px;
        height: 90px;
        transform: rotate(-18deg);
    }
    .text {
        display: block;
        text-align: center;
        transform: translateY(50%);
    }
    .player-screw {
        display: block;
        height: 30px;
        width: auto;
        margin: 0px auto;
        z-index: 10;
    }
    .screw-up {
        position: absolute;
        top: 8px;
    }
    .screw-down {
        position: absolute;
        bottom: 12px;
    }
    .screw-right {
        position: absolute;
        right: 12px;
    }
    .screw-left {
        position: absolute;
        left: 12px;
    }
</style>
