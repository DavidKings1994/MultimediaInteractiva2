<template>
    <transition name="bounce"
        v-on:enter="enter"
        appear>
        <div id="recordWindow">
            <h1>
                <transition
                    name="bounce"
                    v-if="secondaryAnimation"
                    appear>
                    <img class="crown" :src="'Assets/img/crown.png'" alt="corona">
                </transition>
                Nuevo record personal!
            </h1>
        </div>
    </transition>
</template>

<script>
    module.exports = {
        data: function() {
            return {
                secondaryAnimation: false
            };
        },
        methods: {
            enter: function() {
                var self = this;
                this.secondaryAnimation = true;
                var myVar = setInterval(function(){
                    self.$emit('cerrar');
                    clearInterval(myVar);
                }, 7000);
            }
        }
    }
</script>

<style>
    #recordWindow {
        display: inline-block;
        width: 400px;
        height: 150px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 100;
        background: rgb(169,3,41); /* Old browsers */
        background: -moz-linear-gradient(-45deg, rgba(169,3,41,1) 0%, rgba(143,2,34,1) 44%, rgba(109,0,25,1) 100%); /* FF3.6-15 */
        background: -webkit-linear-gradient(-45deg, rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%); /* Chrome10-25,Safari5.1-6 */
        background: linear-gradient(135deg, rgba(169,3,41,1) 0%,rgba(143,2,34,1) 44%,rgba(109,0,25,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a90329', endColorstr='#6d0019',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
        border-radius: 5px;
        border-style: solid;
        border-color: white;
        border-width: 2px;
    }
    #recordWindow h1 {
        text-align: center;
        color: white;
    }
    #recordWindow img {
        height: 50px;
        width: auto;
        position: relative;
        transform: rotate(-16deg);
    }
    .bounce-transition {
        display: inline-block; /* otherwise scale animation won't work */
    }
    .bounce-enter {
        animation: bounce-in 1s;
    }
    .bounce-leave {
        animation: bounce-out 1s;
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
