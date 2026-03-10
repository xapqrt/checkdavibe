function analyzeVibe(text, active_cats) {



if(!text || text.length < 5) return {score:0, emotion: null};


const txt = text.toLowerCase();
const words = txt.split(/\s+/);


let score = 0;
let bad_count = 0;
let good_count = 0;
let detected = null;


words.forEach(word => {
    const clean_word = word.replace(/[.,!?;;'"]/g, '');

    //fah tf did i write


    if(bad_words[clean_word]) {

        const entry = bad_words[clean_word];
        if(!active_cats || active_cats.includes(entry.cat)) {

            score += entry.score;
            bad_count++;

            if(!detected) detected = entry.cat;
        }

    }


    if (good_words[clean_word]) {
        const entry = good_words[clean_word];
        if(!active_cats || active_cats.includes(entry.cat)) {
            score += entry.score;
            good_count++;
        }
    }


});


//all caps multiplier


if(text === text.toUpperCase() && text.length > 10 && bad_count > 0)  {


    score *= 1.5;
}




                return {score: score, emotion: detected};
}


//i think final function


function isToxic(text, threshold, active_cats) {

    const score = analyzeVibe(text, active_cats);
    return score < threshold;

}

