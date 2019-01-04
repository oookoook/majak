<template>
  <div id="app" class="container-fluid">
        <h1>{{ heading }}</h1>
        <div v-bind:class="['robot', 'status', 'alert', alertClass]" role="alert">
        {{ alertMsg }}
        </div>
        <Intro v-if="!question && !end" v-on:send-team="sendTeam"/>
        <Question v-if="question"
            v-bind:question="question" 
            v-bind:correct="correct"
            v-on:send-answer="sendAnswer"/>
        <Success v-if="!question && end" v-bind:content="end" />

        <!--
        <div>{{ text }}</div>
        
        <button v-on:click="getStatus()">Test connection</button>
        
        <button v-on:click="audio.warning.play()">Play warning</button>
        <button v-on:click="audio.error.play()">Play error</button>
        -->
    </div>
</template>

<script>
    import Intro from './Intro.vue';
    import Question from './Question.vue';
    import Success from './Success.vue';

    export default {
        name: 'Maják',
        components: {
            Intro,
            Question,
            Success
        },
        data: function () {
            return {
                heading: 'MAJAK 1823',
                // text: '?',
                team: null,
                question: null,  //{ id: null, heading: '', text: '', hint: null },
                correct: true,
                end: null, //{ reached: false, text: '' },
                messages: {
                    heartbeat: {
                        OK: 'Spojeni s majakem je v poradku.',
                        NOK: 'Spojeni s majakem je ztraceno! Vratte se rychle k majaku!',
                        FAIL: 'Spojeni s majakem bylo ztraceno. Musite zacit znova.'
                    }
                },

                errorThreshold: 4,
                status: { status: true, errors: 0, timestamp: new Date() },
                audio: {
                    warning: new Audio(require('../assets/warning.mp3')),
                    error: new Audio(require('../assets/error.mp3'))
                }
            }
        },
        computed: {
                alertClass: function() {
                    if(this.status.status) {
                        return 'alert-success';
                    } else if (this.status.errors < this.errorThreshold) {
                        return 'alert-warning'
                    } else {
                        return 'alert-danger'
                    }
                },
                alertMsg: function() {
                    if(this.status.status) {
                        return this.messages.heartbeat.OK;
                    } else if (this.status.errors < this.errorThreshold) {
                        return this.messages.heartbeat.NOK;
                    } else {
                        return this.messages.heartbeat.FAIL;
                    }
                }
        },
        methods: {
            getStatus: function() {
                this.$http.get('/heartbeat', {timeout: 3000}).then(function(response) {
                    this.status = response.data;
                    console.log(JSON.stringify(this.status));
                    //this.text = JSON.stringify(this.status);
                }, function(response) {
                    var err = ++this.status.errors;
                    this.errorStatus(err);
                    this.status = { status: false, errors: err, timestamp: new Date() };
                    console.log(JSON.stringify(this.status));
                    //this.text = JSON.stringify(this.status);
                });
            },

            sendTeam: function(team) {
                this.team = team;
                this.$http.get('/question?team='+this.team, {timeout: 3000}).then(function(response) {
                    if(response.data != null) {
                        this.question = response.data;
                    }
                }, function(response) {
                });
            },

            sendAnswer: function(answer) {
                this.$http.get('/question?team='+this.team + '&question=' + this.question.id + '&answer=' + answer, 
                {timeout: 3000}).then(function(response) {
                    if(response.data != null) {
                        if(response.data.id == this.question.id) {
                            // we received the same question - wrong answer
                            this.correct = false;
                        } else if(response.data.id != 'END') {
                            console.log('Correct answer');
                            this.question = response.data;
                            this.correct = true;
                        } else {
                            console.log('End reached.');
                            this.question = null;
                            this.end = response.data;
                        }
                    }
                }, function(response) {
                });
            },

            heartbeat: function() {
                this.getStatus();
            },

            disableUi: function() {
                this.team = null;
                this.question = null, //{ id: null, heading: '', text: '', hint: null },
                this.correct = true,
                this.end = null //{ reached: false, text: '' };
            },
            loadSound: function() {
                this.audio.warning.preload = 'auto';
                this.audio.warning.load();
                this.audio.error.preload = 'auto';
                this.audio.error.load();

            },
            errorStatus: function(err) {
                if(err < this.errorThreshold) {
                        this.audio.warning.play();
                } else if(err == this.errorThreshold) {
                    this.audio.error.play();
                    this.disableUi();
                } 
            }

        },
        timers: {
            heartbeat: { time: 10000, autostart: true, repeat: true, immediate: true }
        },
         created() {
             // init function
             this.loadSound();
             //this.text = 'Nacteno';
             
         }
    }
</script>
<style scoped>

</style>