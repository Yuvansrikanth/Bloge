const { Schema, model } = require('mongoose');

const topicSchema = new Schema({
    

    blogID:  {
        type: Schema.Types.ObjectId,
        ref: 'blog'
    }
});

const Topic = model('topic', topicSchema);

module.exports = Topic;