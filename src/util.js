



var util = (function () {
    return {
        pinFromIntent: function (intent) {
            if(intent.slots) {
                var slots = intent.slots;
                var p1, p2, p3, p4, p5, p6, p7, p8 = null;
                if (slots.PinOne && slots.PinOne.value) {
                    p1 = slots.PinOne.value.toLowerCase();
                }
                if (slots.PinTwo && slots.PinTwo.value) {
                    p2 = slots.PinTwo.value.toLowerCase();
                }
                if (slots.PinThree && slots.PinThree.value) {
                    p3 = slots.PinThree.value.toLowerCase();
                }
                if (slots.PinFour && slots.PinFour.value) {
                    p4 = slots.PinFour.value.toLowerCase();
                }
                if (slots.PinFive && slots.PinFive.value) {
                    p5 = slots.PinFive.value.toLowerCase();
                }
                if (slots.PinSix && slots.PinSix.value) {
                    p6 = slots.PinSix.value.toLowerCase();
                }
                if (slots.PinSeven && slots.PinSeven.value) {
                    p7 = slots.PinSeven.value.toLowerCase();
                }
                if (slots.PinEight && slots.PinEight.value) {
                    p8 = slots.PinEight.value.toLowerCase();
                }

                if (p1 != null, p2 != null, p3 != null, p4 != null, p5 != null, p6 != null, p7 != null, p8 != null) {
                    var pinChars = [p1, p2, p3, p4, p5, p6, p7, p8];
                    return this.pinFromSpokerPin(pinChars);
                } else {
                    return null;
                }
            }
        },
        pinFromSpokerPin: function(pinChars) {
            var pin = null;
            if(pinChars != null) {
                pinChars = pinChars.map(this.numberFromNumberWord);
                console.log("tokens="+pinChars.toString());
                pinChars = pinChars.map(this.cleanString);
                console.log("tokens="+pinChars.toString());
                pin = pinChars.join("");
            }
            return pin;
        },
        numberFromNumberWord: function(numberWord) {
            switch(numberWord) {
                case "one": return 1;
                case "two": return 2;
                case "three": return 3;
                case "four": return 4;
                case "five": return 5;
                case "six": return 6;
                case "seven": return 7;
                case "eight": return 8;
                case "nine": return 9;
                case "zero": return 0;
                default: return numberWord;
            }
        },
        cleanString: function(string) {
            if(typeof string == "string") {
                return string.replace(".", "");
            }
            return string;
        }
    }
})();
module.exports = util;
