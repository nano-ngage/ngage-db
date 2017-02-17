var db = require('../db/helpers');

module.exports = {
  getAnswers: (req, res, next) => {
    if (req.params.id) {
      db.answer.getAnswerByQuestion(req.params.id).then(result => {
        res.send(result.rows);
      }).catch(err => {
        res.status(500).send(err);  
      })
    } else {
      res.status(400).send('question ID not provided');
    }
  },
  postAnswers: (req, res, next) => {
    var qid = req.body.qid;
    var answers = req.body.answers;
    if (qid && answers) {
      var answerString = '';
      for (var i = 0; i < answers.length; i++) {
        answerString += ('(' + qid ',"' + answers[i].answer + '",' + (answers[i].correct ? 1 : 0) + "),");
      }
      answerString = answerString.substring(0, answerString - 2);
      db.answer.postMultiple(answerString).then(result => {
        res.end();
      }).catch(err => {
        res.status(500).send(err);  
      })

    } else {
      res.status(400).send('question ID/answers not provided');
    }
  }


}