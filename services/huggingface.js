const { HfInference } = require('@huggingface/inference');
const hf = new HfInference('replace_with_your_inference_key')

async function generateTags(text) {
    try {
        const result = await hf.textGeneration({
            model: 'fabiochiu/t5-base-tag-generation',
            inputs: text
          })
        // const result = {
        //       generated_text: 'Software, Digital, Developer, Learning, Science, Engineering, Computer Science, Software Development, Programm'        
        //         };
        return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return ;
  }


module.exports = generateTags;


