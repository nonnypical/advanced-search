'use strict';


function loadSettings() {

    function onRestored(settings) {

        function restoreItems(engines) {

            let i = 1;
            let parent = document.getElementById('contextMenuLegend').parentNode;

            for (let engine of engines) {
                let name = 'searchEngine' + i++;
                let checked = settings.hasOwnProperty('contextMenu') && settings.contextMenu.hasOwnProperty(engine.name) ? settings.contextMenu[engine.name] : true;

                let input = document.createElement('input');
                input.id = name + 'Cb';
                input.type = 'checkbox';
                input.setAttribute('name', 'contextMenu');
                input.setAttribute('value', engine.name);
                input.setAttribute('checked', 'checked');
                input.checked = checked;

                let label = document.createElement('label');
                label.id = name;
                label.setAttribute('for', name + 'Cb');
                label.textContent = ' ' + engine.name;

                let div = document.createElement('div');
                div.id = name + 'Div';
                div.title = browser.i18n.getMessage('searchEngineDivTitle');
                div.appendChild(input);
                div.appendChild(label);

                parent.appendChild(div);
            }
        }

        function localizeSettings() {
            document.querySelectorAll('[data-i18n-text]').forEach((element) => {
                element.textContent = browser.i18n.getMessage(element.getAttribute('data-i18n-text'));
            });
            document.querySelectorAll('[data-i18n-title]').forEach((element) => {
                element.title = browser.i18n.getMessage(element.getAttribute('data-i18n-title'));
            });
        }

        browser.search.get().then(restoreItems, onError).then(localizeSettings, onError);
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    browser.storage.sync.get().then(onRestored, onError);
}


function restoreSettings(event) {

    browser.runtime.openOptionsPage();
}


function saveSettings(event) {

    let contextMenuEngines = {};
    document.querySelectorAll('input[name="contextMenu"]').forEach( (engine) => {
        contextMenuEngines[engine.value] = engine.checked;
    });

    browser.storage.sync.set({
        contextMenu: contextMenuEngines
    });

    event.preventDefault();
}


document.addEventListener("DOMContentLoaded", loadSettings);
document.querySelector('#restoreSettings').addEventListener('click', restoreSettings);
document.querySelector('#saveSettings').addEventListener('click', saveSettings);
