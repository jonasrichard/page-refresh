let setRefresh = document.getElementById('setRefresh');

chrome.storage.sync.get('refreshInterval', function(data) {
    //changeColor.style.backgroundColor = data.color;
    //changeColor.setAttribute('value', data.color);
});

setRefresh.onclick = function(element) {
    let interval = document.getElementById('refreshInterval').value;
    console.log('Refresh page in every ' + interval + ' seconds');


    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.storage.sync.get('refreshInterval', function(data) {
            let tabId = tabs[0].id;
            let tabKey = 'tab_' + tabId;
            let tabValue = {
                tabId: tabId,
                intervalInMin: interval / 60.0,
                nextTime: new Date().getTime() + interval * 1000
            };

            data[tabKey] = tabValue;

            chrome.storage.sync.set({'refreshInterval': data}, function() {
                console.log(data);
            });
        });
    });

    chrome.alarms.create('nextRefresh', {delayInMinutes: interval / 60.0});
};
