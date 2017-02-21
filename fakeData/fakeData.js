
module.exports = {

  questions: ["This is a question?", "How is this presentation going?", "Isn't our application the coolest?", "Would you like to subscribe to our Premium service?"],

  aString: [
    function(qID) {
      return '(' + qID + ', \'A\', 0), (' + qID + ', \'B\', 0), (' + qID + ', \'C\', 0), (' + qID + ', \'D\', 1)'
    },
      function(qID) {
        return '(' + qID + ', \'Amazing!\', 1), (' + qID + ', \'MOAR ANIMASHUNS\', 0), (' + qID + ', \'Meh...\', 0), (' + qID + ', \'FREEBIRD!\', 0)'
    },
      function(qID) {
        return '(' + qID + ', \'It sure is swell!\', 0), (' + qID + ', \'Its the bees knees!\', 1), (' + qID + ', \'Gee Golly, Mister!\', 0), (' + qID + ', \'You should kill yourself.\', 0)'
    },
      function(qID) {
        return '(' + qID + ', \'What a steal!\', 0), (' + qID + ', \'Tell me more...\', 0), (' + qID + ', \'Premium Schmemium\', 0), (' + qID + ', \'FREEBIRD!\', 1)'
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