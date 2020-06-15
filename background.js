// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({refreshTabs: {}}, function() {
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                //pageUrl: {hostEquals: 'developer.chrome.com'},
                //pageUrl: {schemes: ['file']},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

    chrome.alarms.onAlarm.addListener(function() {
        chrome.storage.sync.get('refreshInterval', function(data) {
            let now = new Date().getTime();

            let changed = false;
            let tabs = data['refreshInterval'];
            for (var i in tabs) {
                let tab = tabs[i];

                if (tab.nextTime < now) {
                    changed = true;

                    chrome.tabs.reload(tab.tabId);
                    tab.nextTime = now + tab.intervalInSec * 1000;

                    console.log('Next reload time is ', tab.nextTime)

                    tabs[i] = tab;
                }
            }

            if (changed) {
                data['refreshInterval'] = tabs;

                chrome.storage.sync.set(data, function() {});
            }
        });
    });

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        chrome.storage.sync.get('refreshInterval', function(data) {
            if (data['refreshInterval']['tab_' + activeInfo.tabId]) {
                chrome.browserAction.setBadgeText({text: 'ON'});
            } else {
                chrome.browserAction.setBadgeText({});
            }
        });
    });

    chrome.tabs.onRemoved.addListener(function(tabId) {
        chrome.storage.sync.get('refreshInterval', function(data) {
            delete data['tab_' + tabId];
        });
    });

    // TODO don't set alarm if we don't have timers
    chrome.alarms.create('nextRefresh', {periodInMinutes: 1.0});
});

