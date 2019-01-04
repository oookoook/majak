var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO 

module.exports = {
    led: null,
    currentIndex: 0,
    on: false,
    startTime: (new Date()).getTime(),
    // svetelny rok
    //.../...-/./-/./.-../-./-.--//.-./---/-.-
    
    msg: "x.../...-/./-/./.-../-./-.--|.-./---/-.-xxx",

    
    intervals: {
        // https://cs.wikipedia.org/wiki/Morseova_abeceda#Tempo_%22PARIS%22
        // https://stackoverflow.com/questions/4616202/self-references-in-object-literal-declarations
        dot: 1000,
        init: function() {
            this.dash = 3 * this.dot;
            this.nextSymbol = this.dot;
            this.nextLetter = this.dash - this.nextSymbol; // after each symbol, there is automatically nextSymbol pause added
            this.nextWord = (7 * this.dot) - this.nextSymbol;
            this.pause = 20 * this.dot;
            return this;
        } 
    }.init(),
    
    moveNext : function(t) {
        // if the light is on, just turn it off and don't move the index
        if (t.on) {
            t.on = false;
            //console.log('Pause after symbol');
            return t.intervals.nextSymbol;
        }
        
        var symbol = t.msg[t.currentIndex];
        //console.log('Symbol: ' + symbol);
        
        // looping the msg
        t.currentIndex = (t.currentIndex + 1) % t.msg.length;
        if (symbol == 'x') {
            t.on = false;
            return t.intervals.pause;
        } else if (symbol == '/') {
            t.on = false;
            return t.intervals.nextLetter;
        } else if (symbol == '|') {
            t.on = false;
            return t.intervals.nextWord;
        } else if (symbol == '.') {
            t.on = true;
            return t.intervals.dot;
        } else if (symbol == '-') {
            t.on = true;
            return t.intervals.dash;
        }
    },

    changeState: function(t) {
        var now = (new Date()).getTime();
        //console.log('Time ' + (now - t.startTime));
        t.startTime = now;
        var interval = t.moveNext(t);        
        //console.log('Interval ' + interval);
        // GPIO control will be here
        if(t.led) {
            if(t.on) {            
                t.led.writeSync(1);
            } else {
                t.led.writeSync(0);
            }   
        }

        setTimeout(t.changeState, interval, t);
    },

    start: function(gpio) {
        if(gpio !== false) {
            this.led = new Gpio(gpio, 'out'); //use GPIO pin 4, and specify that it is output
            console.log('Starting morse...');
        }
        this.changeState(this);
    },

    stop: function() {
        if(this.led) {
            console.log('LED unexporting...');
            this.led.unexport();
        }
    }
}