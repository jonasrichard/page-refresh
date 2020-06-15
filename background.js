// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({refreshTabs: []}, function() {
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
        console.log('Alarm fired');
        chrome.storage.sync.get('refreshInterval', function(data) {
            console.log('Get data', data);
        });
    });

    chrome.tabs.onActivated.addListener(function(activeInfo) {
        chrome.storage.sync.get('refreshInterval', function(data) {
            if (data['tab_' + activeInfo.tabId]) {
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
});

