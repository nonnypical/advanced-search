'use strict';


function showMenuItems(info, tab) {

    function onShown(settings) {

        function removeItems(engines) {
            browser.contextMenus.removeAll();
            return engines;
        }

        function showItems(engines) {

            function onCreated() {
                if (browser.runtime.lastError) {
                    console.log(`Error: ${browser.runtime.lastError}`);
                }
            }

            for (let engine of engines) {
                let showEngine = settings.hasOwnProperty('contextMenu') && settings.contextMenu.hasOwnProperty(engine.name) ? settings.contextMenu[engine.name] : true;
                if (showEngine) {
                    browser.contextMenus.create({
                        id: '__SE_' + engine.name,
                        title: engine.name,
                        contexts: ['link', 'selection'],
                        icons: {
                            '16': engine.favIconUrl,
                            '32': engine.favIconUrl
                        }
                    }, onCreated);
                }
            }
            browser.contextMenus.create({
                id: 'separator',
                type: 'separator',
                contexts: ['link', 'selection']
            }, onCreated);
            browser.contextMenus.create({
                id: 'openSettingsPage',
                title: browser.i18n.getMessage('openSettingsPageText'),
                contexts: ['link', 'selection']
            }, onCreated);

            browser.contextMenus.refresh();
        }

        browser.search.get().then(removeItems).then(showItems);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    browser.storage.sync.get().then(onShown, onError);
}


function clickMenuItems(info, tab) {

    if (info.menuItemId !== 'openSettingsPage') {

        let query = '';
        if (info.hasOwnProperty('selectionText')) {
            query = info.selectionText;
        }
        else if (info.hasOwnProperty('linkText')) {
            query = info.linkText;
        }

        browser.search.search({
            engine: info.menuItemId.substring(5),
            query: query
        });
    }
    else {

        browser.runtime.openOptionsPage();
    }
}


browser.contextMenus.onShown.addListener(showMenuItems);
browser.contextMenus.onClicked.addListener(clickMenuItems);
