// Or if installed from NPM to use with a bundler
import Artyom from "artyom.js";

// const artyom = require("artyom.js");
const artyom = new Artyom();

var commands = [
  {
    indexes: ["Hello noa", "Good night noa", "Good morning noa"],
    action: function(i) {
      switch (i) {
        case 1:
          alert("Hi, how are you ?");
          break;
        case 2:
          alert("Good night, how are you ?");
          break;
        case 3:
          alert("Good morning, how are you ?");
          break;
      }
    }
  }
];

var noa = artyom.addCommands(commands);

export default {
  noa
};
