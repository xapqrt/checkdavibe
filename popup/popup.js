document.addEventListener('DOMContentLoaded', () => {



    loadSettings();
    init();

});

function init() {

    const thresholdSlider = document.getElementById('threshold');
    const thresholdVal = document.getElementById('threshold-val');
    const saveBtn = document.getElementById('save');
    const statusDiv = document.getElementById('status');
}
thresholdSlider.addEventListener('input', (e) => {

    thresholdVal.textContent = e.target.value;
});


saveBtn.addEventListener('click', () => {

    const settings = {

        enabled: document.getElementById('enabled').checked,
        threshold: parseFloat(document.getElementById('threshold').value),
        block_anger: document.getElementById('block_anger').checked,
        block_sadness: document.getElementById('block_sadness').checked,
        block_toxic: document.getElementById('block_toxic').checked

    };


    chrome.storage.sync.set(settings, () => {

        statusDiv.textContent = 'saved!';
        statusDiv.style.color = '#1DB954';

        setTimeout(() => {

            statusDiv.textContent = '';

        }, 2000);
    });
});

function loadSettings() {

    chrome.storage.sync.get([


        'enabled',
        'threshold',
        'block-anger',
        'block_sadness',
        'block_toxic'
    ], (result) => {

        document.getElementById('enabled').checked = result.enabled ?? true;
        document.getElementById('threshold').value = result.threshold ?? -2.0;

        document.getElementById('threshold-val').textContent = result.threshold ?? -2.0;
        document.getElementById('block_anger').checked = result.block_anger ?? true;
        document.getElementById('block_sadness').checked = result.block_sadness ?? false;

        document.getElementById('block_toxic').checked = result.block_toxic ?? true;
    });
}


