const fs = require('fs');
const path = require('path');

async function del_comment(Comment, comment_id)
{
    const comment = await Comment.findById(comment_id);
    try {
        const result = await Comment.findByIdAndDelete(comment_id);
        if (result) {
          console.log('Document deleted:', result);
        } else {
          console.log('No document found with the given ID');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
}

module.exports = del_comment;