let setRefresh = document.getElementById('setRefresh');

chrome.storage.sync.get('refreshInterval', function(data) {
    //changeColor.style.backgroundColor = data.color;
    //changeColor.setAttribute('value', data.color);
});

setRefresh.onclick = function(element) {
    let interval = document.getElementById('refreshInterval').value;

    chrome.tabs.query({active: true, currentWindow: true}, function(currentTabs) {
        chrome.storage.sync.get('refreshInterval', function(data) {
            let tabs = data['refreshInterval'];
            let tabId = currentTabs[0].id;
            let tabKey = 'tab_' + tabId;

            if (tabs[tabKey]) {
                delete tabs[tabKey];

                data['refreshInterval'] = tabs;

                chrome.browserAction.setBadgeText({});
            } else {
                let tabValue = {
                    tabId: tabId,
                    intervalInSec: interval,
                    nextTime: new Date().getTime() + interval * 1000
                };

                data['refreshInterval'][tabKey] = tabValue;

                chrome.browserAction.setBadgeText({text: 'ON'});
            }

            chrome.storage.sync.set(data, function() {
                console.log(data);
            });
        });
    });
};
