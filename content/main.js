console.log('vibecheck script loaded ', window.location.hostname);


const config = {

    childList: true,
    subtree: true
};

let mut_obs = null;
let scan_delay = 300;
let debounce_timeout = null;
let scan_count = 0;
let last_scan = 0;



let settings = {

    enabled: true,
    threshold : -2.0,
    block_anger: true,
    block_sadness: false,
    block_toxic: true
};





chrome.storage.sync.get(['enabled', 'threshold', 'block_anger', 'block_sadness', 'block_toxic'], (result) => {




    if(result.enabled !== undefined) settings.enabled = result.enabled;
    if(result.threshold !== undefined) settings.threshold = result.threshold;

    if(result.block_anger !== undefined) settings.block_anger = result.block_anger;
    if(result.block_sadness !== undefined) settings.block_sadness = result.block_sadness;

    if(result.block_toxic !== undefined) settings.block_toxic = result.block_toxic;

    console.log('loaded da settings', settings);
});



chrome.storage.onChanged.addListener((changes, area) => {

    if (area === 'sync') {

        if (changes.enabled !== undefined) settings.enabled = changes.enabled.newValue;
        if(changes.threshold !== undefined) settings.threshold = changes.threshold.newValue;
        if(changes.block_anger !== undefined) settings.block_anger = changes.block_anger.newValue;
        if(changes.block_sadness !== undefined) settings.block_sadness = changes.block_sadness.newValue;
        if(changes.block_toxic !== undefined) settings.block_toxic = changes.block_toxic.newValue;
        
        console.log('settings updated: ', settings);
        }
});

const SELECTORS = {


    twitter: '[data-testid="tweet"]',
    reddit: 'shreddit-post',
    linkedin: 'div.feed-shared-update-v2__consent'
};


const REDDIT_BACKUP = 'div[id^="t3_"]';
const LINKEDIN_BACKUP = 'div[data-id^="urn:li:activity"]';







function getPlatform() {


    const host = window.location.hostname;

    if(host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
    if(host.includes('reddit.com')) return 'reddit';
    if (host.includes('linkedin.com')) return 'linkedin';
    return null;

}


const current_platform = getPlatform();
console.log('platform: ', current_platform);

function initWhenReady() {

    const interval = setInterval(() => {

        let selector = SELECTORS[current_platform];
        if (current_platform === 'reddit'){


            if(!document.querySelector(slector)) {

                selector = "REDDIT_BACKUP";
            }
        }

        if (current_platform === 'linkedin') {

            if(!document.querySelector(selector)) {


                selector = LINKEDIN_BACKUP;
            }
        }
        if (document.querySelector(selector)) {

   
            clearInterval(interval);
            console.log("posts found, starting da scanner");
            initScanner();
        }
    }, 500);
}

function initScanner() {
    scanFeed();


    mut_obs = new MutationObserver((mutation) => {

        clearTimeout(debounce_timeout);
        debounce_timeout = setTimeout(()=> {


            console.log('mutation, on scanenr');
            scanFeed();

        }, scan_delay);
    });

    mut_obs.observe(document.body, config);
    console.log('observer active');

}


function scanFeed() {


    const now = Date.now();


    if(now - last_scan < 100) {



        console.log('skipping scan, too soon');
        return;
    }


    last_scan = now;


    const start = performance.now();
    let selector = SELECTORS[current_platform];

    if(current_platform === 'reddit') {

        let posts = document.querySelectorAll('selector');

        if (posts.length === 0) {

            selector = REDDIT_BACKUP;
            console.log("using backup reddit selector for now")
        }
    }

    if(current_platform === 'linkedin') {

        let posts = document.querySelectorAll(selector);
        if(posts.length === 0) {

            selector = LINKEDIN_BACKUP;
            console.log("using da backup linkedin selector for now");
        }
    }
    const posts = document.querySelectorAll(selector);


    let checked_count = 0;
    posts.forEach(post => {
        if (post.getAttribute('vibe-checked')) return;
        const txt = post.innerText || '';

        if (txt.length < 10) {

            post.setAttribute('vibe-checked', 'true');
            return;
        }



        if (txt.length > 5000) {

            console.log('post too long, so amma skip it');
            post.setAttribute('vibe-checked', 'true');
            return;
        }

        //i think the above shi is ok for now
        const vibe_score = analyzeVibe(txt);
        console.log('vibe score: ', vibe_score.toFixed(2));

        if (vibe_score < settings.threshold) {

            injectBlur(post, vibe_score);
        }


        post.setAttribute('vibe-checked', 'true');
        checked_count++;

        
     });

     const elapsed = performance.now() - start;
     

     scan_count++;
     console.log(`scanned ${checked_count} posts in ${elapsed.toFixed(1)}ms (total scans: ${scan_count})`);

        
}



function injectBlur(post, score) {

    if (post.style.position !== 'absolute' && post.style.position !== 'relative') {

        post.style.position = 'relative';

    }



    const overlay = document.createElement('div');
    overlay.className = 'vibe-overlay';

    const warning = document.createElement('div');

    warning.className = 'vibe-warning';
    warning.textContent = `Potentially negative content (score: ${score.toFixed(1)})`;

    const btn = document.createElement('button');
    btn.className = 'vibe-reveal-btn';
    btn.textContent = 'Reveal anyway';


    btn.onclick = () => {

        overlay.remove();
        console.log('revealed post');
    };



    overlay.appendChild(warning);
    overlay.appendChild(btn);

    post.appendChild(overlay);


}




if (current_platform) {

    initWhenReady();

} else {

    console.log('ay this isnt da platform we talked bout')
}
