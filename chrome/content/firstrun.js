Components.utils.import('resource://brief/common.jsm');
Components.utils.import('resource://gre/modules/Services.jsm');

IMPORT_COMMON(this);

document.addEventListener('DOMContentLoaded', onload, false);
document.addEventListener('unload', onunload, false);

let prefBranch = Services.prefs.getBranch('extensions.brief.');
let prefObserver = {
    observe: function(aSubject, aTopic, aData) {
        if (aTopic == 'nsPref:changed' && aData == 'homeFolder')
            buildHeader();
    }
}
prefBranch.addObserver('', prefObserver, false);


function onload() {
    buildHeader();
    document.removeEventListener('DOMContentLoaded', onload, false);
}

function onunload() {
    prefBranch.removeObserver('', prefObserver);
}

function buildHeader() {
    let bookmarks = Cc['@mozilla.org/browser/nav-bookmarks-service;1']
                    .getService(Ci.nsINavBookmarksService);
    let bundle = Services.strings.createBundle('chrome://brief/locale/brief.properties');

    let folderID = prefBranch.getIntPref('homeFolder');
    let folderName = '<span id="home-folder">' + bookmarks.getItemTitle(folderID) + '</span>';
    let string = bundle.formatStringFromName('howToSubscribeHeader', [folderName], 1);
    document.getElementById('subscribe').innerHTML = string;

    let homeFolderSpan = document.getElementById('home-folder');
    homeFolderSpan.addEventListener('click', openOptions, false);
}

function openOptions() {
    let instantApply = Services.prefs.getBoolPref('browser.preferences.instantApply');
    let modality = instantApply ? 'modal=no,dialog=no' : 'modal';
    let features = 'chrome,titlebar,toolbar,centerscreen,resizable,' + modality;

    window.openDialog('chrome://brief/content/options/options.xul', 'Brief options',
                      features, 'feeds-pane');
}

function openBrief() {
    let topWindow = window.QueryInterface(Ci.nsIInterfaceRequestor)
                          .getInterface(Ci.nsIWebNavigation)
                          .QueryInterface(Ci.nsIDocShellTreeItem)
                          .rootTreeItem
                          .QueryInterface(Ci.nsIInterfaceRequestor)
                          .getInterface(Ci.nsIDOMWindow);
    topWindow.Brief.open(true);
}
