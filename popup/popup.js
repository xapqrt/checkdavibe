document.addEventListener('DOMContentLoaded', () => {



    loadSettings();
    loadStats();
    init();

});

let current_whitelist = [];


function renderWhitelistTags() {


    const container = document.getElementById('whitelist-tags');
    container.innerHTML = '';

    current_whitelist.forEach((item, i) => {

        const tag = document.createElement('div');
        tag.className = 'whitelist-tag';
        tag.innerHTML = `<span>${item}</span><button class="whitelist-remove" data-index="${i}">&times;</button>`;
        container.appendChild(tag);
    });

    //remove buttons
    container.querySelectorAll('.whitelist-remove').forEach(btn => {

        btn.addEventListener('click', (e) => {

            const idx = parseInt(e.target.getAttribute('data-index'));
            current_whitelist.splice(idx, 1);
            renderWhitelistTags();
        });
    });
}


function init() {

    const thresholdSlider = document.getElementById('threshold');
    const thresholdVal = document.getElementById('threshold-val');
    const saveBtn = document.getElementById('save');
    const statusDiv = document.getElementById('status');


    thresholdSlider.addEventListener('input', (e) => {

        thresholdVal.textContent = e.target.value;
    });


    saveBtn.addEventListener('click', () => {

        const settings = {

            enabled: document.getElementById('enabled').checked,
            threshold: parseFloat(document.getElementById('threshold').value),
            block_anger: document.getElementById('block_anger').checked,
            block_sadness: document.getElementById('block_sadness').checked,
            block_toxic: document.getElementById('block_toxic').checked,
            whitelist: current_whitelist

        };


        chrome.storage.sync.set(settings, () => {

            statusDiv.textContent = 'saved!';
            statusDiv.style.color = '#1DB954';

            setTimeout(() => {

                statusDiv.textContent = '';

            }, 2000);
        });
    });


    //whitelist stuff
    const whitelist_input = document.getElementById('whitelist-input');
    const add_btn = document.getElementById('add-whitelist');

    add_btn.addEventListener('click', () => {

        const val = whitelist_input.value.trim();
        if(val && !current_whitelist.includes(val)) {

            current_whitelist.push(val);
            renderWhitelistTags();
            whitelist_input.value = '';
        }
    });

    whitelist_input.addEventListener('keydown', (e) => {

        if(e.key === 'Enter') {
            add_btn.click();
        }
    });



    document.getElementById('clear-stats').addEventListener('click', () => {

        chrome.storage.local.set({stats: {total : 0, anger: 0, sadness: 0, toxic: 0}}, () => {

            loadStats();
        });
    });
}



function loadStats() {

    chrome.storage.local.get(['stats'], (result) => {

        const stats = result.stats || {total: 0, anger: 0, sadness: 0, toxic: 0};

        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-anger').textContent = stats.anger;
        document.getElementById('stat-sadness').textContent = stats.sadness;
        document.getElementById('stat-toxic').textContent = stats.toxic;
    });
}


function loadSettings() {

    chrome.storage.sync.get([


        'enabled',
        'threshold',
        'block_anger',
        'block_sadness',
        'block_toxic',
        'whitelist'
    ], (result) => {

        document.getElementById('enabled').checked = result.enabled ?? true;
        document.getElementById('threshold').value = result.threshold ?? -2.0;

        document.getElementById('threshold-val').textContent = result.threshold ?? -2.0;
        document.getElementById('block_anger').checked = result.block_anger ?? true;
        document.getElementById('block_sadness').checked = result.block_sadness ?? false;

        document.getElementById('block_toxic').checked = result.block_toxic ?? true;

        current_whitelist = result.whitelist || [];
        renderWhitelistTags();
    });
}


