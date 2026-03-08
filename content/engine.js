function analyzeVibe(text) {

if(!text || text.length < 5) return 0;


const txt = text.toLowerCase();
const words = txt.split(/\s+/);


let score = 0;
let bad_count = 0;
let good_count = 0;



words.forEach(word => {
    const clean_word = word.replace(/[.,!?;;'"]/g, '');

    //fah tf did i write


    if(bad_words[clean_word]) {

        score += bad_words[clean_word];
        bad_count++;

    }


    if (good_words[clean_word]) {
        score += good_words[clean_word];

        good_count++;
    }


});


//all caps multiplier


if(text === text.toUpperCase() && text.length > 10)  {


    score *= 1.5;
}




                return score;
}


//i think final function


function isToxic(text, threshold = -2.0) {

    const score = analyzeVibe(text);
    return score < threshold;

}


console.log('fah engine is on')