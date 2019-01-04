<template>
    <div>
        <transition appear enter-active-class="animated slideInUp">
            <div>
                <p class="robot">{{ content.text }}</p>
                <button class="btn btn-dark btn-lg btn-block" v-on:click="playMessage">Spustit zpravu</button>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: ['content'],
    methods: {
        playMessage: function() {
            var msg = new Audio(this.content.link);
            msg.play();
        }
    }
}
</script>
<style scoped>
</style>