(function(){if(window.JX){return;}window.JX={};var
holding_queues={};function
makeHoldingQueue(name){if(JX[name]){return;}holding_queues[name]=[];JX[name]=function(){holding_queues[name].push(arguments);};}JX.flushHoldingQueue=function(name,fn){for(var
ii=0;ii<holding_queues[name].length;ii++){fn.apply(null,holding_queues[name][ii]);}holding_queues[name]={};};makeHoldingQueue('install');makeHoldingQueue('behavior');makeHoldingQueue('install-init');var
loaded=false;var
onload=[];var
master_event_queue=[];var
root=document.documentElement;var
has_add_event_listener=!!root.addEventListener;window.__DEV__=!!root.getAttribute('data-developer-mode');JX.__rawEventQueue=function(what){master_event_queue.push(what);var
ii;var
Stratcom=JX['Stratcom'];if(!loaded&&what.type=='domready'){var
initializers=[];var
tags=JX.DOM.scry(document.body,'data');for(ii=0;ii<tags.length;ii++){if(tags[ii].parentNode!==document.body){continue;}var
tag_kind=tags[ii].getAttribute('data-javelin-init-kind');var
tag_data=tags[ii].getAttribute('data-javelin-init-data');tag_data=JX.JSON.parse(tag_data);initializers.push({kind:tag_kind,data:tag_data});}Stratcom.initialize(initializers);loaded=true;}if(loaded){var
local_queue=master_event_queue;master_event_queue=[];for(ii=0;ii<local_queue.length;++ii){var
evt=local_queue[ii];try{var
test=evt.type;}catch(x){continue;}if(evt.type=='domready'){document.body&&(document.body.id='');for(var
jj=0;jj<onload.length;jj++){onload[jj]();}}Stratcom.dispatch(evt);}}else{var
target=what.srcElement||what.target;if(target&&(what.type
in{click:1,submit:1})&&target.getAttribute&&target.getAttribute('data-mustcapture')==='1'){what.returnValue=false;what.preventDefault&&what.preventDefault();document.body.id='event_capture';if(!add_event_listener&&document.createEventObject){master_event_queue.pop();master_event_queue.push(document.createEventObject(what));}return false;}}};JX.enableDispatch=function(target,type){if(__DEV__){JX.__allowedEvents[type]=true;}if(target.addEventListener){target.addEventListener(type,JX.__rawEventQueue,true);}else
if(target.attachEvent){target.attachEvent('on'+type,JX.__rawEventQueue);}};var
document_events=['click','dblclick','change','submit','keypress','mousedown','mouseover','mouseout','keyup','keydown','input','drop','dragenter','dragleave','dragover','paste','touchstart','touchmove','touchend','touchcancel','load'];if(!has_add_event_listener){document_events.push('focusin','focusout');}if(window.opera){document_events.push('focus','blur');}if(__DEV__){JX.__allowedEvents={};if('onpagehide'in
window){JX.__allowedEvents.unload=true;}}var
ii;for(ii=0;ii<document_events.length;++ii){JX.enableDispatch(root,document_events[ii]);}var
window_events=[('onpagehide'in
window)?'pagehide':'unload','resize','scroll','focus','blur','popstate','hashchange','mouseup'];if(window.localStorage){window_events.push('storage');}for(ii=0;ii<window_events.length;++ii){JX.enableDispatch(window,window_events[ii]);}JX.__simulate=function(node,event){if(!has_add_event_listener){var
e={target:node,type:event};JX.__rawEventQueue(e);if(e.returnValue===false){return false;}}};if(has_add_event_listener){document.addEventListener('DOMContentLoaded',function(){JX.__rawEventQueue({type:'domready'});},true);}else{var
ready='if (this.readyState == "complete") {'+'JX.__rawEventQueue({type: "domready"});'+'}';document.write('<script'+' defer="defer"'+' onreadystatechange="'+ready+'"'+'><\/sc'+'ript'+'>');}JX.onload=function(func){if(loaded){func();}else{onload.push(func);}};})();