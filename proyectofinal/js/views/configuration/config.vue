<template>
    <transition name="slide-fade">
        <div class="">
            
        </div>
    </transition>
</template>

<script>
    module.exports = {
        data() {
            return {
                masterVolume: 100,
                music: 100,
                sfx: 100
            };
        },
        mounted: function() {
            this.loadConfig();
        },
        methods: {
            loadConfig: function() {

            },
            saveConfig: function() {

            }
        }
    }
</script>

<style>
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
