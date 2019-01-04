<template>
    <div id="intro">
        <transition appear name="introAppear" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <div>
                <h2>Viteje bytosti</h2>
                <p class="robot">Pripojili jste se k majaku vybudovanem inteligentni rasou, ktera drive obyvala tuto planetu. Pro pristup
                    do systemu je nejdrive treba overit, ze jste take inteligentni bytosti a umite si poradit s nejruznejsimi ukoly,
                    ktere otestuji vyspelost vasi civiliace.</p>    
                <p class="robot">Zadejte tajne heslo:</p>
                <input v-model="team" class="form-control form-control-lg">
                <button type="button" class="btn btn-dark btn-lg btn-block" v-on:click="sendTeam">Odeslat</button>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            team: null,
        }
    },
    methods: {
        sendTeam() {
            this.$emit('send-team', this.team);
        }
    }
}
</script>
<style scoped>
</style>