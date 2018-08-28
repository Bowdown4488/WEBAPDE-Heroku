const mongoose = require('./connectionModel').connection;

const commentSchema = mongoose.Schema({
    commentOwner: String,
    commentContent: String
});
const commentModel = mongoose.model('comment', commentSchema);

 function addComment(comment, callback){
    var comment = new commentModel(comment);
    c.save().then((newComment) =>{
        callback(newComment);
    }, (err) => {
    })
}

module.exports.addComment = addComment;