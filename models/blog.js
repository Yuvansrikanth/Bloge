const { Schema, model } = require('mongoose');
const generateTags = require('../services/huggingface');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    body: {
        type: String,
        required: true,
    },

    thumbnailURL: {
        type: String,
        default: "/images/blogThumbnail.png",
    },
    
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
    },

    topics: { type: [String], default: [] },
},
{ timestamps: true }
);

blogSchema.post('save', async function(doc, next) {
    const blog = doc;
    if (blog.topics && blog.topics.length > 0) {
        // Skip processing if the document is not new
        return next();
    }
    try{
        const text = await generateTags(blog.body);
        if(!text) return;
        const tags = text.generated_text.split(',').map(item => item.trim());
        const selectedTags = tags.slice(0, Math.min(tags.length, 5));
        selectedTags.push('marker');
        this.topics = selectedTags;
        doc.save();
    }
    catch(error){
        console.error("Error in post-save hook:", error);
    }
    return next();
});

const Blog = model('blog', blogSchema);

module.exports = Blog;