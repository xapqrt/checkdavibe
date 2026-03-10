//service worker for da manifest v3


console.log('vibecheck service worker is loaded');


chrome.storage.onChanged.addListener((changes, area) => {


    console.log("storage changed: ", changes);

    //ill try ti bittify content scripts later
});


//debug

chrome.runtime.onInstalled.addListener(() => {

    console.log("extention installed");

    chrome.storage.sync.set({

        enabled: true,
        threshold: -2.0,
        block_anger:true,
        block_sadness: false,
        block_toxic: true
    });
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


    if(request.action === 'getStats') {


        sendResponse({status: 'active'});
    }

    return true;
});

