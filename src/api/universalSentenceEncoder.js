require('@tensorflow/tfjs');
const tf = require("@tensorflow/tfjs-core");
const use = require("@tensorflow-models/universal-sentence-encoder");

let model;

/**
 * Loads the universal sentence encoder. This needs to be called once when your program starts to load the model.
 * It can take a few seconds to load, so it can be helpful to do this once the webpage initially
 * loads so the model is ready to use when needed.
 */
export const loadModel = function() {
    if(model) {
        console.log("Model already loaded");
    } else {
        use.load().then(theModel => {
            model = theModel
            console.log("Model loaded");
        });
    }
};

/**
 * This function takes an array of strings and determines a score (from 0 to 1) of how related each string is to the
 *     text at the comparisonIndex. Higher scores = more related.
 * @param sentences - this is an array of strings that will be compared
 * @param comparisonIndex - this is the index of the string in the array that you are comparing against
 * @returns {Promise<*[]>} - It returns a promise that will yield an array with the scores describing how related each
 * string is to the string at the comparison index.
 */
export const determineRelatednessOfSentences = async (sentences, comparisonIndex) => {
    if (!model) {
        console.log("Model not loaded yet - skipping comparison");
        return;
    }
    const embeddings = await model.embed(sentences);

    let results = []
    const sentenceI = tf.slice(embeddings, [comparisonIndex, 0], [1]);
    const sentenceITranspose = false;

    for (let i = 0; i < sentences.length; i++) {
        const sentenceJ = tf.slice(embeddings, [i, 0], [1]);
        const sentenceJTranspose = true;
        const score =
            tf.matMul(
                sentenceI, sentenceJ, sentenceITranspose, sentenceJTranspose)
                .dataSync();
        // The array contains the score for the index it is being compared against. We could check here
        // and filter out the score for the comparisonIndex, but including it makes it easier to align the
        // indexes for later usage.
        results.push({score: score[0], indexOne: i, indexTwo: comparisonIndex});
    }
    return results;
}
