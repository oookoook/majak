<template>
    <div>
        <transition appear name="questionHeading" 
            enter-active-class="animated bounceInRight"
            leave-active-class="animated bounceOutLeft"
            mode="out-in">
            <div v-bind:key="question.id">
                <h2>{{ question.heading }}</h2>
                <p class="robot">{{ question.text }}</p>
                <div class="alert alert-info" role="alert" v-if="hintAvailable">
                    <h3 class="alert-heading">Napoveda</h3>
                    <p class="robot">{{ hintText() }}</p>
                </div>
                <div class="alert alert-danger" role="alert" v-if="!correct">To je spatna odpoved.</div>
                <input class="form-control form-control-lg" v-model="answer" placeholder="Vase odpoved">
                <button v-on:click="sendAnswer()" type="button" class="btn btn-dark btn-lg btn-block" >Odeslat</button>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    data: function() {
        return {
            hintAvailable: false,
            audio: {
                notification: new Audio(require('../assets/warning.mp3')),
                success: new Audio(require('../assets/warning.mp3')),
                error: new Audio(require('../assets/error.mp3'))
            }
        }
    },
    watch: {
        question: function(val) {
            console.log('Question changed');
            this.answer = '';
            this.audio.success.play();

            // we have to set the hint delay on the client
             if(this.question
            && this.question.hint 
            && this.question.hint.available) {
                this.question.hint.time = (new Date()).getTime() + (this.question.hint.delay * 60 * 1000);
            }

        },

        hintAvailable: function(newVal, oldVal) {
            if(newVal) {
                this.audio.notification.play();
            }
        },

        correct: function(newVal, oldVal) {
            if(!newVal) {
                this.audio.error.play();
            }
        }
        

     },
    methods: {
        hintAvailability: function() {
            if(this.question
            && this.question.hint 
            && this.question.hint.available 
            && (new Date()).getTime() > this.question.hint.time) {
                this.hintAvailable = true;
           }
        },

        hintText: function() {
            if(this.question.hint 
            && this.question.hint.available) {
                return this.question.hint.text;
            }
            return '';
        },

        loadSound: function() {
            this.audio.notification.preload = 'auto';
            this.audio.notification.load();
        },

        sendAnswer: function() {
            var a = this.answer;
            this.$emit('send-answer', a);
        }
    },
    props: [ 'question', 'correct' ],
    timers: {
        hintAvailability: { time: 10000, autostart: true, repeat: true, immediate: true }
    },
    created() {
        // init function
        this.loadSound();
    }
}
</script>
<style scoped>
</style>