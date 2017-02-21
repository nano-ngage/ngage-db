
module.exports = {

  questions: ["This is a question?", "How is this presentation going?", "Isn't our application the coolest?", "Would you like to subscribe to our Premium service?"],

  aString: [
    function(qID) {
      return {
        "questionID": qID,
        "answers": [{"answer": "A", "correct": "false"}, {"answer": "B", "correct": "false"}, {"answer": "C", "correct": "false"}, {"answer": "D", "correct": "true"}]
      };
    },
      function(qID) {
      return {
        "questionID": qID,
        "answers": [{"answer": "Amazing!", "correct": "true"}, {"answer": "MOAR ANIMASHUNS", "correct": "false"}, {"answer": "Meh...", "correct": "false"}, {"answer": "FREEBIRD!", "correct": "false"}]
      };
    },
      function(qID) {
      return {
        "questionID": qID,
        "answers": [{"answer": "It sure is swell!", "correct": "false"}, {"answer": "It's the bee's knees!", "correct": "true"}, {"answer": "Gee Golly, Mister!", "correct": "false"}, {"answer": "You should kill yourself.", "correct": "false"}]
      };
    },
      function(qID) {
      return {
        "questionID": qID,
        "answers": [{"answer": "It's a steal!", "correct": "false"}, {"answer": "Tell me more...", "correct": "false"}, {"answer": "Premium Schmemium", "correct": "false"}, {"answer": "FREEBIRD!", "correct": "true"}]
      };
    },
  ],

  // aString2: function(qID) {
  //   return {
  //     "questionID": qID,
  //     "answers": [{"answer": "Amazing!", "correct": "true"}, {"answer": "MOAR ANIMASHUNS", "correct": "false"}, {"answer": "Meh...", "correct": "false"}, {"answer": "FREEBIRD!", "correct": "false"}]
  //   };
  // },

  // aString3: function(qID) {
  //   return {
  //     "questionID": qID,
  //     "answers": [{"answer": "It sure is swell!", "correct": "false"}, {"answer": "It's the bee's knees!", "correct": "true"}, {"answer": "Gee Golly, Mister!", "correct": "false"}, {"answer": "You should kill yourself.", "correct": "false"}]
  //   };
  // },

  // aString4: function(qID) {
  //   return {
  //     "questionID": qID,
  //     "answers": [{"answer": "It's a steal!", "correct": "false"}, {"answer": "Tell me more...", "correct": "false"}, {"answer": "Premium Schmemium", "correct": "false"}, {"answer": "FREEBIRD!", "correct": "true"}]
  //   };
  // },

}