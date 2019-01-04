<template>
  <div class="container-fluid">
        <h2>{{ heading }}</h2>
        <div class="alert alert-primary" role="alert">
        {{ message }}
        </div>
        <button v-on:click="getStatus()">
            Get status from server
        </button>
        <div class="alert alert-warning" role="alert">
        {{ status.status }}
        </div>
        <div class="alert alert-success" role="alert">
        {{ status.timestamp }}
        </div>

    </div>
</template>

<script>
    export default {
        name: 'Maják',
        data: function () {
            return {
                heading: 'Ahoj devítko!',
                message: 'Tohle je maják',
                status: { status: 'Init', timestamp: new Date() }
            }
        },
        methods: {
            getStatus: function() {
                this.$http.get('/heartbeat').then(function(response) {
                        console.log(response);
                        this.status = response.data;
                });
            },

            heartbeat: function() {
                this.getStatus();
            }
        },
        timers: {
            heartbeat: { time: 30000, autostart: true, repeat: true, immediate: true }
        }
    }
</script>