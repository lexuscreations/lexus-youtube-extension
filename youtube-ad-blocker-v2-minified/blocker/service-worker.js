const initialData={isExtensionEnabled:!0,videosSkipped:{today:0,week:0,month:0,total:0}},MessageTypeEnum={SKIPPED_AD_DATA:"SKIPPED_AD_DATA",EXTENSION_STATE_REQUEST:"EXTENSION_STATE_REQUEST",EXTENSION_STATE_RESPONSE:"EXTENSION_STATE_RESPONSE"},reloadYoutubeTabs=async({matchURlPattern:e})=>{(await chrome.tabs.query({url:e})).forEach(({id:e})=>chrome.tabs.reload(e))},getSecondsFromFormattedDuration=e=>{const a=e.split(":");return 60*parseInt(a[0])+parseInt(a[1])},saveData=(e,a)=>{try{if(!a||"object"!=typeof a)throw new Error("Invalid data format");chrome.storage.local.set({[e]:JSON.stringify(a)})}catch(e){console.error(`Error saving data: ${e.message}`)}};chrome.runtime.onInstalled.addListener(e=>{Promise.all(chrome.runtime.getManifest().content_scripts.flatMap(e=>e.matches).map(e=>reloadYoutubeTabs({matchURlPattern:e})))}),chrome.runtime.onMessage.addListener((e,a,s)=>{e.messageType&&(e.messageType===MessageTypeEnum.SKIPPED_AD_DATA?chrome.storage.local.get(["savedSkippedAdsLogs"],({savedSkippedAdsLogs:a})=>{a=a?JSON.parse(a):[];const s=Date.now();let t;t=e.skippedAdData.duration?getSecondsFromFormattedDuration(e.skippedAdData.duration):0,a.push([s,t]),saveData("savedSkippedAdsLogs",a)}):e.messageType===MessageTypeEnum.EXTENSION_STATE_REQUEST&&chrome.storage.local.get(["savedData"],({savedData:e})=>{e?e=JSON.parse(e):saveData("savedData",e=initialData),chrome.tabs.sendMessage(a.tab.id,{messageType:MessageTypeEnum.EXTENSION_STATE_RESPONSE,isExtensionEnabled:e.isExtensionEnabled})})),s()});