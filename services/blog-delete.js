const fs = require('fs');
const path = require('path');

async function del_blog(Blog, blog_id)
{
    const blog = await Blog.findById(blog_id);
    const fileurl = blog.thumbnailURL;
    if (fileurl && fileurl != "/images/blogThumbnail.png")
    {   
        const oldImagePath = path.join(__dirname, '..', 'public', fileurl);
        //delete old image
        if (fs.existsSync(oldImagePath))
        {
        fs.unlink(oldImagePath, (err) => {
            console.log(oldImagePath);
            if (err) {
                console.log('Error deleting old image:', err);
            } else {
                console.log('Old image deleted successfully');
            }
            });
        }
    }
    try {
        const result = await Blog.findByIdAndDelete(blog_id);
        if (result) {
          console.log('Document deleted:', result);
        } else {
          console.log('No document found with the given ID');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
}

module.exports = del_blog;