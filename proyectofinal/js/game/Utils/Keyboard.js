define(['jquery', 'glMatrix'],  function($, glMatrix) {
    var Kings = window.Kings || {};

    Kings.Keyboard = function(mode) {
        var self = this;
        this.pressedKeys = {};
        this.keys = {
            BACKSPACE: 8,
            TAB:       9,
            RETURN:   13,
            ESC:      27,
            SPACE:    32,
            PAGEUP:   33,
            PAGEDOWN: 34,
            END:      35,
            HOME:     36,
            LEFT:     37,
            UP:       38,
            RIGHT:    39,
            DOWN:     40,
            INSERT:   45,
            DELETE:   46,
            ZERO:     48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54, SEVEN: 55, EIGHT: 56, NINE: 57,
            A:        65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74, K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84, U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
            TILDA:    192
        };
        this.stake = [];
        document.addEventListener( 'keydown', function(evt) { self.onKeyDown(evt) }, false );
        document.addEventListener( 'keyup', function(evt) { self.onKeyUp(evt) }, false );
    };

    Kings.Keyboard.prototype = {
        constructor: Kings.Keyboard,

        isDown: function(keyCode) {
            return this.pressedKeys[keyCode];
        },

        onKeyDown: function(event) {
            this.pressedKeys[event.keyCode] = true;
            this.stake.unshift(event.keyCode);
            if (this.stake.length > 10) {
                this.stake.pop();
            }
        },

        onKeyUp: function(event) {
            delete this.pressedKeys[event.keyCode];
            this.stake.unshift(this.getLastKeyPressed());
        },

        getLastKeyPressed: function() {
            for (var i = 0; i < this.stake.length; i++) {
                if (this.pressedKeys[this.stake[i]]) {
                    return this.stake[i];
                }
            }
            return null;
        },

        firstKeyPressed: function(key1, key2) {
            for (var i = 0; i < this.stake.length; i++) {
                if (this.stake[i] == key1) {
                    if (this.pressedKeys[this.stake[i]]) {
                        return this.stake[i];
                    }
                } else if (this.stake[i] == key2) {
                    if (this.pressedKeys[this.stake[i]]) {
                        return this.stake[i];
                    }
                }
            }
            return null;
        }
    };
});
