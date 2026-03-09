console.log('vibecheck script loaded ', window.location.hostname);


const config = {

    childList: true,
    subtree: true
};

let mut_obs = null;
let scan_delay = 300;
let debounce_timeout = null;

const SELECTORS = {


    twitter: '[data-testid="tweet"]',
    reddit: 'shreddit-post, div[data-testid="post-container"]',
    linkedin: 'div.feed-shared-update-v2'
};


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

        const selector = SELECTORS[current_platform];
        if (!selector) return;
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

    const start = performance.now();
    const selector = SELECTORS[current_platform];
    const posts = document.querySelectorAll(selector);


    let checked_count = 0;
    posts.forEach(post => {
        if (post.getAttribute('vibe-checked')) return;
        const txt = post.innerText || '';

        if (txt.length < 10) {

            post.setAttribute('vibe-checked', 'true');
            return;
        }


        const vibe_score = analyzeVibe(txt);
        console.log('vibe score: ', vibe_score.toFixed(2));

        if (vibe_score < -2.0) {

            injectBlur(post, vibe_score);
        }


        post.setAttribute('vibe-checked', 'true');
        checked_count++;

        
     });

     const elapsed = performance.now() - start;
     

        
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
