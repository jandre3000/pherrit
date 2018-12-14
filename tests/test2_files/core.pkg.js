JX.$E=function(message){var
e=new
Error(message);var
caller_fn=JX.$E.caller;if(caller_fn){e.caller_fn=caller_fn.caller;}throw e;};JX.$A=function(object){var
r=[];for(var
ii=0;ii<object.length;ii++){r.push(object[ii]);}return r;};JX.$AX=function(maybe_scalar){return JX.isArray(maybe_scalar)?maybe_scalar:[maybe_scalar];};JX.isArray=Array.isArray||function(maybe_array){return Object.prototype.toString.call(maybe_array)=='[object Array]';};JX.copy=function(copy_dst,copy_src){for(var
k
in
copy_src){copy_dst[k]=copy_src[k];}return copy_dst;};JX.bind=function(context,func,more){if(__DEV__){if(typeof
func!='function'){JX.$E('JX.bind(context, <yuck>, ...): '+'Attempting to bind something that is not a function.');}}var
bound=JX.$A(arguments).slice(2);if(func.bind){return func.bind.apply(func,[context].concat(bound));}return function(){return func.apply(context||window,bound.concat(JX.$A(arguments)));};};JX.bag=function(){};JX.keys=Object.keys||function(obj){var
r=[];for(var
k
in
obj){r.push(k);}return r;};JX.id=function(any){return any;};if(!window.console||!window.console.log){if(window.opera&&window.opera.postError){window.console={log:function(m){window.opera.postError(m);}};}else{window.console={log:function(){}};}}JX.log=function(message){window.console.log(message);};if(__DEV__){window.alert=(function(native_alert){var
recent_alerts=[];var
in_alert=false;return function(msg){if(in_alert){JX.log('alert(...): '+'discarded reentrant alert.');return;}in_alert=true;recent_alerts.push(JX.now());if(recent_alerts.length>3){recent_alerts.splice(0,recent_alerts.length-3);}if(recent_alerts.length>=3&&(recent_alerts[recent_alerts.length-1]-recent_alerts[0])<5000){if(window.confirm(msg+'\n\nLots of alert()s recently. Kill them?')){window.alert=JX.bag;}}else{native_alert(msg);}in_alert=false;};})(window.alert);}JX.now=(Date.now||function(){return new
Date().getTime();});JX.install=function(new_name,new_junk){if(new_name
in
JX){if(__DEV__){JX.$E('JX.install("'+new_name+'", ...): '+'trying to reinstall something that has already been installed.');}return;}if(__DEV__){if('name'in
new_junk){JX.$E('JX.install("'+new_name+'", {"name": ...}): '+'trying to install with "name" property.'+'Either remove it or call JX.createClass directly.');}}(JX.install._queue||(JX.install._queue=[])).push([new_name,new_junk]);var
name;do{var
junk;var
initialize;name=null;for(var
ii=0;ii<JX.install._queue.length;++ii){junk=JX.install._queue[ii][1];if(junk.extend&&!JX[junk.extend]){continue;}name=JX.install._queue.splice(ii,1)[0][0];--ii;if(junk.extend){junk.extend=JX[junk.extend];}initialize=junk.initialize;delete
junk.initialize;junk.name='JX.'+name;JX[name]=JX.createClass(junk);if(initialize){if(JX['Stratcom']&&JX['Stratcom'].ready){initialize.apply(null);}else{JX['install-init'](initialize);}}}}while(name);};JX.createClass=function(junk){var
name=junk.name||'';var
k;var
ii;if(__DEV__){var
valid={construct:1,statics:1,members:1,extend:1,properties:1,events:1,name:1};for(k
in
junk){if(!(k
in
valid)){JX.$E('JX.createClass("'+name+'", {"'+k+'": ...}): '+'trying to create unknown property `'+k+'`.');}}if(junk.constructor!=={}.constructor){JX.$E('JX.createClass("'+name+'", {"constructor": ...}): '+'property `constructor` should be called `construct`.');}}var
Class=(function(name,junk){var
result=function(){this.__id__='__obj__'+(++JX.install._nextObjectID);return(junk.construct||junk.extend||JX.bag).apply(this,arguments);};if(__DEV__){var
inner=result;result=function(){if(this==window||this==JX){JX.$E('<'+Class.__readable__+'>: '+'Tried to construct an instance without the "new" operator.');}return inner.apply(this,arguments);};}return result;})(name,junk);Class.__readable__=name;for(k
in
junk.statics){Class[k]=junk.statics[k];}var
proto;if(junk.extend){var
Inheritance=function(){};Inheritance.prototype=junk.extend.prototype;proto=Class.prototype=new
Inheritance();}else{proto=Class.prototype={};}proto.__class__=Class;var
setter=function(prop){return function(v){this[prop]=v;return this;};};var
getter=function(prop){return function(){return this[prop];};};for(k
in(junk.properties||{})){var
base=k.charAt(0).toUpperCase()+k.substr(1);var
prop='__auto__'+k;proto[prop]=junk.properties[k];proto['set'+base]=setter(prop);proto['get'+base]=getter(prop);}if(__DEV__){for(var
member_name
in
junk.members){if(junk.extend&&member_name[0]=='_'){JX.$E('JX.createClass("'+name+'", ...): '+'installed member "'+member_name+'" must not be named with '+'a leading underscore because it is in a subclass. Variables '+'are analyzed and crushed one file at a time, and crushed '+'member variables in subclasses alias crushed member variables '+'in superclasses. Remove the underscore, refactor the class so '+'it does not extend anything, or fix the minifier to be '+'capable of safely crushing subclasses.');}var
member_value=junk.members[member_name];if(typeof
member_value=='object'&&member_value!==null){JX.$E('JX.createClass("'+name+'", ...): '+'installed member "'+member_name+'" is not a scalar or '+'function. Prototypal inheritance in Javascript aliases object '+'references across instances so all instances are initialized '+'to point at the exact same object. This is almost certainly '+'not what you intended. Make this member static to share it '+'across instances, or initialize it in the constructor to '+'prevent reference aliasing and give each instance its own '+'copy of the value.');}}}for(k
in
junk.members){proto[k]=junk.members[k];}var
enumerables=JX.install._enumerables;if(junk.members&&enumerables){ii=enumerables.length;while(ii--){var
property=enumerables[ii];if(junk.members[property]){proto[property]=junk.members[property];}}}var
parent=junk.extend||{};var
old_events=parent.__events__;var
new_events=junk.events||[];var
has_events=old_events||new_events.length;if(has_events){var
valid_events={};if(__DEV__){for(var
key
in
old_events||{}){valid_events[key]=true;}for(ii=0;ii<new_events.length;++ii){valid_events[junk.events[ii]]=true;}}Class.__events__=valid_events;Class.__name__='class:'+name;var
ancestry=parent.__path__||[];Class.__path__=ancestry.concat([Class.__name__]);proto.invoke=function(type){if(__DEV__){if(!(type
in
this.__class__.__events__)){JX.$E(this.__class__.__readable__+'.invoke("'+type+'", ...): '+'invalid event type. Valid event types are: '+JX.keys(this.__class__.__events__).join(', ')+'.');}}return JX['Stratcom'].invoke('obj:'+type,this.__class__.__path__.concat([this.__id__]),{args:JX.$A(arguments).slice(1)});};proto.listen=function(type,callback){if(__DEV__){if(!(type
in
this.__class__.__events__)){JX.$E(this.__class__.__readable__+'.listen("'+type+'", ...): '+'invalid event type. Valid event types are: '+JX.keys(this.__class__.__events__).join(', ')+'.');}}return JX['Stratcom'].listen('obj:'+type,this.__id__,JX.bind(this,function(e){return callback.apply(this,e.getData().args);}));};Class.listen=function(type,callback){if(__DEV__){if(!(type
in
this.__events__)){JX.$E(this.__readable__+'.listen("'+type+'", ...): '+'invalid event type. Valid event types are: '+JX.keys(this.__events__).join(', ')+'.');}}return JX['Stratcom'].listen('obj:'+type,this.__name__,JX.bind(this,function(e){return callback.apply(this,e.getData().args);}));};}else
if(__DEV__){var
error_message='class does not define any events. Pass an "events" property to '+'JX.createClass() to define events.';Class.listen=Class.listen||function(){JX.$E(this.__readable__+'.listen(...): '+error_message);};Class.invoke=Class.invoke||function(){JX.$E(this.__readable__+'.invoke(...): '+error_message);};proto.listen=proto.listen||function(){JX.$E(this.__class__.__readable__+'.listen(...): '+error_message);};proto.invoke=proto.invoke||function(){JX.$E(this.__class__.__readable__+'.invoke(...): '+error_message);};}return Class;};JX.install._nextObjectID=0;JX.flushHoldingQueue('install',JX.install);(function(){for(var
i
in{toString:1}){return;}JX.install._enumerables=['toString','hasOwnProperty','valueOf','isPrototypeOf','propertyIsEnumerable','toLocaleString','constructor'];})();JX.install('Event',{members:{stop:function(){var
r=this.getRawEvent();if(r){r.cancelBubble=true;r.stopPropagation&&r.stopPropagation();}this.setStopped(true);return this;},prevent:function(){var
r=this.getRawEvent();if(r){r.returnValue=false;r.preventDefault&&r.preventDefault();}this.setPrevented(true);return this;},kill:function(){this.prevent();this.stop();return this;},getSpecialKey:function(){var
r=this.getRawEvent();if(!r){return null;}return JX.Event._keymap[r.keyCode]||null;},isRightButton:function(){var
r=this.getRawEvent();return r.which==3||r.button==2;},isNormalMouseEvent:function(){var
supportedEvents={'click':1,'mouseup':1,'mousedown':1};if(!(this.getType()in
supportedEvents)){return false;}var
r=this.getRawEvent();if(r.metaKey||r.altKey||r.ctrlKey||r.shiftKey){return false;}if(('which'in
r)&&(r.which!=1)){return false;}if(('button'in
r)&&r.button){if('which'in
r){return false;}else
if(r.button!=1){return false;}}return true;},isNormalClick:function(){if(this.getType()!='click'){return false;}return this.isNormalMouseEvent();},getNode:function(key){return this.getNodes()[key]||null;},getNodeData:function(key){return JX['Stratcom'].getData(this.getNode(key));}},statics:{_keymap:{8:'delete',9:'tab',10:'return',13:'return',27:'esc',37:'left',38:'up',39:'right',40:'down',63232:'up',63233:'down',62234:'left',62235:'right'}},properties:{rawEvent:null,type:null,target:null,data:null,path:[],stopped:false,prevented:false,nodes:{},nodeDistances:{},isTouchEvent:false},initialize:function(){if(__DEV__){JX.Event.prototype.toString=function(){var
path='['+this.getPath().join(', ')+']';var
type=this.getType();if(this.getIsTouchEvent()){type=type+'/touch';}return'Event<'+type+', '+path+', '+this.getTarget()+'>';};}}});JX.install('Stratcom',{statics:{ready:false,_targets:{},_handlers:[],_need:{},_auto:'*',_data:{},_execContext:[],_touchState:null,_dataBlock:2,_dataIndex:0,invoke:function(type,path,data){if(__DEV__){if(path&&typeof
path!=='string'&&!JX.isArray(path)){throw new
Error('JX.Stratcom.invoke(...): path must be a string or an array.');}}path=JX.$AX(path);return this._dispatchProxy(new
JX.Event().setType(type).setData(data||{}).setPath(path||[]));},listen:function(types,paths,func){if(__DEV__){if(arguments.length!=3){JX.$E('JX.Stratcom.listen(...): '+'requires exactly 3 arguments. Did you mean JX.DOM.listen?');}if(typeof
func!='function'){JX.$E('JX.Stratcom.listen(...): '+'callback is not a function.');}}var
ids=[];types=JX.$AX(types);if(!paths){paths=this._auto;}if(!JX.isArray(paths)){paths=[[paths]];}else
if(!JX.isArray(paths[0])){paths=[paths];}var
listener={_callback:func};for(var
ii=0;ii<types.length;++ii){var
type=types[ii];if(('onpagehide'in
window)&&type=='unload'){type='pagehide';}if(!(type
in
this._targets)){this._targets[type]={};}var
type_target=this._targets[type];for(var
jj=0;jj<paths.length;++jj){var
path=paths[jj];var
id=this._handlers.length;this._handlers.push(listener);this._need[id]=path.length;ids.push(id);for(var
kk=0;kk<path.length;++kk){if(__DEV__){if(path[kk]=='tag:#document'){JX.$E('JX.Stratcom.listen(..., "tag:#document", ...): '+'listen for all events using null, not "tag:#document"');}if(path[kk]=='tag:window'){JX.$E('JX.Stratcom.listen(..., "tag:window", ...): '+'listen for window events using null, not "tag:window"');}}(type_target[path[kk]]||(type_target[path[kk]]=[])).push(id);}}}listener.remove=function(){if(listener._callback){delete
listener._callback;for(var
ii=0;ii<ids.length;ii++){delete
JX.Stratcom._handlers[ids[ii]];}}};return listener;},removeCurrentListener:function(){var
context=this._execContext[this._execContext.length-1];var
listeners=context.listeners;var
cursor=context.cursor-1;if(listeners[cursor]){listeners[cursor].handler.remove();}},dispatch:function(event){var
path=[];var
nodes={};var
distances={};var
push=function(key,node,distance){if(!nodes.hasOwnProperty(key)){nodes[key]=node;distances[key]=distance;path.push(key);}};var
target=event.srcElement||event.target;if(target&&target.nodeType===3){target=target.parentNode;}if(!target||!target.getAttribute){target=null;}var
distance=1;var
cursor=target;while(cursor&&cursor.getAttribute){push('tag:'+cursor.nodeName.toLowerCase(),cursor,distance);var
id=cursor.id;if(id){push('id:'+id,cursor,distance);}var
sigils=cursor.getAttribute('data-sigil');if(sigils){sigils=sigils.split(' ');for(var
ii=0;ii<sigils.length;ii++){push(sigils[ii],cursor,distance);}}var
auto_id=cursor.getAttribute('data-autoid');if(auto_id){push('autoid:'+auto_id,cursor,distance);}++distance;cursor=cursor.parentNode;}var
etype=event.type;if(etype=='focusin'){etype='focus';}else
if(etype=='focusout'){etype='blur';}var
touch_map={touchstart:true,touchend:true,mousedown:true,mouseup:true,click:true,mouseover:false,mouseout:false,mousemove:false,touchmove:false};if(etype=='touchstart'){this._touchState={};}if(touch_map[etype]&&this._touchState){if(!this._touchState[etype]){this._touchState[etype]=true;}else{this._touchState=null;}}var
is_touch=(etype
in
touch_map)&&(this._touchState!==null);var
proxy=new
JX.Event().setRawEvent(event).setData(event.customData).setType(etype).setTarget(target).setNodes(nodes).setNodeDistances(distances).setIsTouchEvent(is_touch).setPath(path.reverse());return this._dispatchProxy(proxy);},_dispatchProxy:function(proxy){var
scope=this._targets[proxy.getType()];if(!scope){return proxy;}var
path=proxy.getPath();var
distances=proxy.getNodeDistances();var
len=path.length;var
hits={};var
hit_distances={};var
matches;var
far_away=1000000;for(var
root=-1;root<len;++root){matches=scope[(root==-1)?this._auto:path[root]];if(matches){var
distance=distances[path[root]]||far_away;for(var
ii=0;ii<matches.length;++ii){var
match=matches[ii];hits[match]=(hits[match]||0)+1;hit_distances[match]=Math.min(hit_distances[match]||distance,distance);}}}var
listeners=[];for(var
k
in
hits){if(hits[k]==this._need[k]){var
handler=this._handlers[k];if(handler){listeners.push({distance:hit_distances[k],handler:handler});}}}listeners.sort(function(a,b){if(__DEV__){return(a.distance-b.distance)||(Math.random()-0.5);}return a.distance-b.distance;});this._execContext.push({listeners:listeners,event:proxy,cursor:0});this.pass();this._execContext.pop();return proxy;},pass:function(){var
context=this._execContext[this._execContext.length-1];var
event=context.event;var
listeners=context.listeners;while(context.cursor<listeners.length){var
cursor=context.cursor++;if(listeners[cursor]){var
handler=listeners[cursor].handler;handler._callback&&handler._callback(event);}if(event.getStopped()){break;}}return event.getStopped()||event.getPrevented();},context:function(){var
len=this._execContext.length;return len?this._execContext[len-1].event:null;},initialize:function(initializers){var
frameable=false;for(var
ii=0;ii<initializers.length;ii++){var
kind=initializers[ii].kind;var
data=initializers[ii].data;switch(kind){case'behaviors':JX.initBehaviors(data);break;case'merge':JX.Stratcom.mergeData(data.block,data.data);JX.Stratcom.ready=true;break;case'frameable':frameable=!!data;break;}}if(!frameable){if(window.top!=window.self){window.top.location.replace(window.self.location.href);}}},mergeData:function(block,data){if(this._data[block]){if(__DEV__){for(var
key
in
data){if(key
in
this._data[block]){JX.$E('JX.Stratcom.mergeData('+block+', ...); is overwriting '+'existing data.');}}}JX.copy(this._data[block],data);}else{this._data[block]=data;if(block===0){JX.flushHoldingQueue('install-init',function(fn){fn();});JX.__rawEventQueue({type:'start-queue'});}}},hasSigil:function(node,sigil){if(__DEV__){if(!node||!node.getAttribute){JX.$E('JX.Stratcom.hasSigil(<non-element>, ...): '+'node is not an element. Most likely, you\'re passing window or '+'document, which are not elements and can\'t have sigils.');}}var
sigils=node.getAttribute('data-sigil')||false;return sigils&&(' '+sigils+' ').indexOf(' '+sigil+' ')>-1;},addSigil:function(node,sigil){if(__DEV__){if(!node||!node.getAttribute){JX.$E('JX.Stratcom.addSigil(<non-element>, ...): '+'node is not an element. Most likely, you\'re passing window or '+'document, which are not elements and can\'t have sigils.');}}var
sigils=node.getAttribute('data-sigil')||'';if(!JX.Stratcom.hasSigil(node,sigil)){sigils+=' '+sigil;}node.setAttribute('data-sigil',sigils);},getData:function(node){if(__DEV__){if(!node||!node.getAttribute){JX.$E('JX.Stratcom.getData(<non-element>): '+'node is not an element. Most likely, you\'re passing window or '+'document, which are not elements and can\'t have data.');}}var
meta_id=(node.getAttribute('data-meta')||'').split('_');if(meta_id[0]&&meta_id[1]){var
block=this._data[meta_id[0]];var
index=meta_id[1];if(block&&(index
in
block)){return block[index];}else
if(__DEV__){JX.$E('JX.Stratcom.getData(<node>): Tried to access data (block '+meta_id[0]+', index '+index+') that was not present. This '+'probably means you are calling getData() before the block '+'is provided by mergeData().');}}var
data={};if(!this._data[1]){this._data[1]={};}this._data[1][this._dataIndex]=data;node.setAttribute('data-meta','1_'+(this._dataIndex++));return data;},addData:function(node,data){if(__DEV__){if(!node||!node.getAttribute){JX.$E('JX.Stratcom.addData(<non-element>, ...): '+'node is not an element. Most likely, you\'re passing window or '+'document, which are not elements and can\'t have sigils.');}if(!data||typeof
data!='object'){JX.$E('JX.Stratcom.addData(..., <nonobject>): '+'data to attach to node is not an object. You must use '+'objects, not primitives, for metadata.');}}return JX.copy(JX.Stratcom.getData(node),data);},allocateMetadataBlock:function(){return this._dataBlock++;}}});JX.behavior=function(name,control_function){if(__DEV__){if(JX.behavior._behaviors.hasOwnProperty(name)){JX.$E('JX.behavior("'+name+'", ...): '+'behavior is already registered.');}if(!control_function){JX.$E('JX.behavior("'+name+'", <nothing>): '+'initialization function is required.');}if(typeof
control_function!='function'){JX.$E('JX.behavior("'+name+'", <garbage>): '+'initialization function is not a function.');}var
enumerables={toString:true,hasOwnProperty:true,valueOf:true,isPrototypeOf:true,propertyIsEnumerable:true,toLocaleString:true,constructor:true};if(enumerables[name]){JX.$E('JX.behavior("'+name+'", <garbage>): '+'do not use this property as a behavior.');}}JX.behavior._behaviors[name]=control_function;JX.behavior._statics[name]={};};JX.initBehaviors=function(map){var
missing_behaviors=[];for(var
name
in
map){if(!(name
in
JX.behavior._behaviors)){missing_behaviors.push(name);continue;}var
configs=map[name];if(!configs.length){if(JX.behavior._initialized.hasOwnProperty(name)){continue;}configs=[null];}for(var
ii=0;ii<configs.length;ii++){JX.behavior._behaviors[name](configs[ii],JX.behavior._statics[name]);}JX.behavior._initialized[name]=true;}if(missing_behaviors.length){JX.$E('JX.initBehavior(map): behavior(s) not registered: '+missing_behaviors.join(', '));}};JX.behavior._behaviors={};JX.behavior._statics={};JX.behavior._initialized={};JX.flushHoldingQueue('behavior',JX.behavior);JX.install('Resource',{statics:{_loading:{},_loaded:{},_links:[],_callbacks:[],load:function(list,callback){var
resources={},uri,resource,path;list=JX.$AX(list);if(!list.length){setTimeout(callback,0);return;}for(var
ii=0;ii<list.length;ii++){uri=new
JX.URI(list[ii]);resource=uri.toString();path=uri.getPath();resources[resource]=true;if(JX.Resource._loaded[resource]){setTimeout(JX.bind(JX.Resource,JX.Resource._complete,resource),0);}else
if(!JX.Resource._loading[resource]){JX.Resource._loading[resource]=true;if(path.indexOf('.css')==path.length-4){JX.Resource._loadCSS(resource);}else{JX.Resource._loadJS(resource);}}}JX.Resource._callbacks.push({resources:resources,callback:callback});},_loadJS:function(uri){var
script=document.createElement('script');var
load_callback=function(){JX.Resource._complete(uri);};var
error_callback=function(){JX.$E('Resource: JS file download failure: '+uri);};JX.copy(script,{type:'text/javascript',src:uri});script.onload=load_callback;script.onerror=error_callback;script.onreadystatechange=function(){var
state=this.readyState;if(state=='complete'||state=='loaded'){load_callback();}};document.getElementsByTagName('head')[0].appendChild(script);},_loadCSS:function(uri){var
link=JX.copy(document.createElement('link'),{type:'text/css',rel:'stylesheet',href:uri,'data-href':uri});document.getElementsByTagName('head')[0].appendChild(link);JX.Resource._links.push(link);if(!JX.Resource._timer){JX.Resource._timer=setInterval(JX.Resource._poll,20);}},_poll:function(){var
sheets=document.styleSheets,ii=sheets.length,links=JX.Resource._links;while(ii--){var
link=sheets[ii],owner=link.ownerNode||link.owningElement,jj=links.length;if(owner){while(jj--){if(owner==links[jj]){JX.Resource._complete(links[jj]['data-href']);links.splice(jj,1);}}}}if(!links.length){clearInterval(JX.Resource._timer);JX.Resource._timer=null;}},_complete:function(uri){var
list=JX.Resource._callbacks,current,ii;delete
JX.Resource._loading[uri];JX.Resource._loaded[uri]=true;var
errors=[];for(ii=0;ii<list.length;ii++){current=list[ii];delete
current.resources[uri];if(!JX.Resource._hasResources(current.resources)){try{current.callback();}catch(error){errors.push(error);}list.splice(ii--,1);}}if(errors.length){throw errors[0];}},_hasResources:function(resources){for(var
hasResources
in
resources){return true;}return false;}},initialize:function(){var
list=JX.$A(document.getElementsByTagName('link')),ii=list.length,node;while((node=list[--ii])){if(node.type=='text/css'&&node.href){JX.Resource._loaded[(new
JX.URI(node.href)).toString()]=true;}}list=JX.$A(document.getElementsByTagName('script'));ii=list.length;while((node=list[--ii])){if(node.type=='text/javascript'&&node.src){JX.Resource._loaded[(new
JX.URI(node.src)).toString()]=true;}}}});JX.install('Request',{construct:function(uri,handler){this.setURI(uri);if(handler){this.listen('done',handler);}},events:['start','open','send','statechange','done','error','finally','uploadprogress'],members:{_xhrkey:null,_transport:null,_sent:false,_finished:false,_block:null,_data:null,_getSameOriginTransport:function(){try{try{return new
XMLHttpRequest();}catch(x){return new
ActiveXObject('Msxml2.XMLHTTP');}}catch(x){return new
ActiveXObject('Microsoft.XMLHTTP');}},_getCORSTransport:function(){try{var
xport=new
XMLHttpRequest();if('withCredentials'in
xport){}else
if(typeof
XDomainRequest!='undefined'){xport=new
XDomainRequest();}return xport;}catch(x){return new
XDomainRequest();}},getTransport:function(){if(!this._transport){this._transport=this.getCORS()?this._getCORSTransport():this._getSameOriginTransport();}return this._transport;},getRoutable:function(){var
routable=new
JX.Routable();routable.listen('start',JX.bind(this,function(){JX.Stratcom.pass(JX.Stratcom.context());this.send();}));this.listen('finally',JX.bind(routable,routable.done));return routable;},send:function(){if(this._sent||this._finished){if(__DEV__){if(this._sent){JX.$E('JX.Request.send(): '+'attempting to send a Request that has already been sent.');}if(this._finished){JX.$E('JX.Request.send(): '+'attempting to send a Request that has finished or aborted.');}}return;}this.invoke('start',this);if(this._finished){return;}var
xport=this.getTransport();xport.onreadystatechange=JX.bind(this,this._onreadystatechange);if(xport.upload){xport.upload.onprogress=JX.bind(this,this._onuploadprogress);}var
method=this.getMethod().toUpperCase();if(__DEV__){if(this.getRawData()){if(method!='POST'){JX.$E('JX.Request.send(): '+'attempting to send post data over GET. You must use POST.');}}}var
list_of_pairs=this._data||[];list_of_pairs.push(['__ajax__',true]);this._block=JX.Stratcom.allocateMetadataBlock();list_of_pairs.push(['__metablock__',this._block]);var
q=(this.getDataSerializer()||JX.Request.defaultDataSerializer)(list_of_pairs);var
uri=this.getURI();if(method=='GET'||this.getRawData()){uri+=((uri.indexOf('?')===-1)?'?':'&')+q;}if(this.getTimeout()){this._timer=setTimeout(JX.bind(this,this._fail,JX.Request.ERROR_TIMEOUT),this.getTimeout());}xport.open(method,uri,true);this.invoke('open',this);if(this._finished){return;}this.invoke('send',this);if(this._finished){return;}if(method=='POST'){if(this.getRawData()){xport.send(this.getRawData());}else{xport.setRequestHeader('Content-Type','application/x-www-form-urlencoded');xport.send(q);}}else{xport.send(null);}this._sent=true;},abort:function(){this._cleanup();},_onuploadprogress:function(progress){this.invoke('uploadprogress',progress);},_onreadystatechange:function(){var
xport=this.getTransport();var
response;try{this.invoke('statechange',this);if(this._finished){return;}if(xport.readyState!=4){return;}if(xport.status!==0&&(xport.status<200||xport.status>=300)){this._fail();return;}if(__DEV__){var
expect_guard=this.getExpectCSRFGuard();if(!xport.responseText.length){JX.$E('JX.Request("'+this.getURI()+'", ...): '+'server returned an empty response.');}if(expect_guard&&xport.responseText.indexOf('for (;;);')!==0){JX.$E('JX.Request("'+this.getURI()+'", ...): '+'server returned an invalid response.');}if(expect_guard&&xport.responseText=='for (;;);'){JX.$E('JX.Request("'+this.getURI()+'", ...): '+'server returned an empty response.');}}response=this._extractResponse(xport);if(!response){JX.$E('JX.Request("'+this.getURI()+'", ...): '+'server returned an invalid response.');}}catch(exception){if(__DEV__){JX.log('JX.Request("'+this.getURI()+'", ...): '+'caught exception processing response: '+exception);}this._fail();return;}try{this._handleResponse(response);this._cleanup();}catch(exception){setTimeout(function(){throw exception;},0);}},_extractResponse:function(xport){var
text=xport.responseText;if(this.getExpectCSRFGuard()){text=text.substring('for (;;);'.length);}var
type=this.getResponseType().toUpperCase();if(type=='TEXT'){return text;}else
if(type=='JSON'||type=='JAVELIN'){return JX.JSON.parse(text);}else
if(type=='XML'){var
doc;try{if(typeof
DOMParser!='undefined'){var
parser=new
DOMParser();doc=parser.parseFromString(text,'text/xml');}else{doc=new
ActiveXObject('Microsoft.XMLDOM');doc.async=false;doc.loadXML(xport.responseText);}return doc.documentElement;}catch(exception){if(__DEV__){JX.log('JX.Request("'+this.getURI()+'", ...): '+'caught exception extracting response: '+exception);}this._fail();return null;}}if(__DEV__){JX.$E('JX.Request("'+this.getURI()+'", ...): '+'unrecognized response type.');}return null;},_fail:function(error){this._cleanup();this.invoke('error',error,this);this.invoke('finally');},_done:function(response){this._cleanup();if(response.onload){for(var
ii=0;ii<response.onload.length;ii++){(new
Function(response.onload[ii]))();}}var
payload;if(this.getRaw()){payload=response;}else{payload=response.payload;JX.Request._parseResponsePayload(payload);}this.invoke('done',payload,this);this.invoke('finally');},_cleanup:function(){this._finished=true;clearTimeout(this._timer);this._timer=null;if(this._transport&&this._transport.readyState!=4){this._transport.abort();}},setData:function(dictionary){this._data=null;this.addData(dictionary);return this;},addData:function(dictionary){if(!this._data){this._data=[];}for(var
k
in
dictionary){this._data.push([k,dictionary[k]]);}return this;},setDataWithListOfPairs:function(list_of_pairs){this._data=list_of_pairs;return this;},_handleResponse:function(response){if(this.getResponseType().toUpperCase()=='JAVELIN'){if(response.error){this._fail(response.error);}else{JX.Stratcom.mergeData(this._block,response.javelin_metadata||{});var
when_complete=JX.bind(this,function(){this._done(response);JX.initBehaviors(response.javelin_behaviors||{});});if(response.javelin_resources){JX.Resource.load(response.javelin_resources,when_complete);}else{when_complete();}}}else{this._cleanup();this.invoke('done',response,this);this.invoke('finally');}}},statics:{ERROR_TIMEOUT:-9000,defaultDataSerializer:function(list_of_pairs){var
uri=[];for(var
ii=0;ii<list_of_pairs.length;ii++){var
pair=list_of_pairs[ii];var
name=encodeURIComponent(pair[0]);var
value=encodeURIComponent(pair[1]);uri.push(name+'='+value);}return uri.join('&');},_parseResponsePayload:function(parent,index){var
recurse=JX.Request._parseResponsePayload;var
obj=(typeof
index!=='undefined')?parent[index]:parent;if(JX.isArray(obj)){for(var
ii=0;ii<obj.length;ii++){recurse(obj,ii);}}else
if(obj&&typeof
obj=='object'){if(('__html'in
obj)&&(obj.__html!==null)){parent[index]=JX.$H(obj.__html);}else{for(var
key
in
obj){recurse(obj,key);}}}}},properties:{URI:null,dataSerializer:null,method:'POST',rawData:null,raw:false,timeout:null,expectCSRFGuard:true,CORS:false,responseType:'JAVELIN'}});JX.$V=function(x,y){return new
JX.Vector(x,y);};JX.install('Vector',{construct:function(x,y){if(typeof
y=='undefined'){return JX.Vector.getPos(x);}this.x=(x===null)?null:parseFloat(x);this.y=(y===null)?null:parseFloat(y);},members:{x:null,y:null,setPos:function(node){node.style.left=(this.x===null)?'':(parseInt(this.x,10)+'px');node.style.top=(this.y===null)?'':(parseInt(this.y,10)+'px');return this;},setDim:function(node){node.style.width=(this.x===null)?'':(parseInt(this.x,10)+'px');node.style.height=(this.y===null)?'':(parseInt(this.y,10)+'px');return this;},add:function(x,y){if(x
instanceof
JX.Vector){y=x.y;x=x.x;}return new
JX.Vector(this.x+parseFloat(x),this.y+parseFloat(y));}},statics:{_viewport:null,getPos:function(node){JX.Event&&(node
instanceof
JX.Event)&&(node=node.getRawEvent());if(node.getBoundingClientRect){var
rect;try{rect=node.getBoundingClientRect();}catch(e){rect={top:0,left:0};}return new
JX.Vector(rect.left+window.pageXOffset,rect.top+window.pageYOffset);}if(('pageX'in
node)||('clientX'in
node)){var
c=JX.Vector._viewport;return new
JX.Vector(node.pageX||(node.clientX+c.scrollLeft),node.pageY||(node.clientY+c.scrollTop));}var
x=0;var
y=0;do{var
offsetParent=node.offsetParent;var
scrollLeft=0;var
scrollTop=0;if(offsetParent&&offsetParent!=document.body){scrollLeft=offsetParent.scrollLeft;scrollTop=offsetParent.scrollTop;}x+=(node.offsetLeft-scrollLeft);y+=(node.offsetTop-scrollTop);node=offsetParent;}while(node&&node!=document.body);return new
JX.Vector(x,y);},getDim:function(node){return new
JX.Vector(node.offsetWidth,node.offsetHeight);},getScroll:function(){var
b=document.body;var
e=document.documentElement;return new
JX.Vector(window.pageXOffset||b.scrollLeft||e.scrollLeft,window.pageYOffset||b.scrollTop||e.scrollTop);},getAggregateScrollForNode:function(node){var
x=0;var
y=0;do{if(node==document.body||node==document.documentElement){break;}x+=node.scrollLeft||0;y+=node.scrollTop||0;node=node.parentNode;}while(node);return new
JX.$V(x,y);},getPosWithScroll:function(node){return JX.$V(node).add(JX.Vector.getAggregateScrollForNode(node));},getViewport:function(){var
c=JX.Vector._viewport;return new
JX.Vector(window.innerWidth||c.clientWidth||0,window.innerHeight||c.clientHeight||0);},getDocument:function(){var
c=JX.Vector._viewport;return new
JX.Vector(c.scrollWidth||0,c.scrollHeight||0);}},initialize:function(){JX.Vector._viewport=document.documentElement||document.body;if(__DEV__){JX.Vector.prototype.toString=function(){return'<'+this.x+', '+this.y+'>';};}}});JX.$=function(id){if(__DEV__){if(!id){JX.$E('Empty ID passed to JX.$()!');}}var
node=document.getElementById(id);if(!node||(node.id!=id)){if(__DEV__){if(node&&(node.id!=id)){JX.$E('JX.$(\''+id+'\'): '+'document.getElementById() returned an element without the '+'correct ID. This usually means that the element you are trying '+'to select is being masked by a form with the same value in its '+'"name" attribute.');}}JX.$E('JX.$(\''+id+'\') call matched no nodes.');}return node;};JX.install('HTML',{construct:function(str){if(str
instanceof
JX.HTML){this._content=str._content;return;}if(__DEV__){if((typeof
str!=='string')&&(!str||!str.match)){JX.$E('new JX.HTML(<empty?>): '+'call initializes an HTML object with an empty value.');}var
tags=['legend','thead','tbody','tfoot','column','colgroup','caption','tr','th','td','option'];var
evil_stuff=new
RegExp('^\\s*<('+tags.join('|')+')\\b','i');var
match=str.match(evil_stuff);if(match){JX.$E('new JX.HTML("<'+match[1]+'>..."): '+'call initializes an HTML object with an invalid partial fragment '+'and can not be converted into DOM nodes. The enclosing tag of an '+'HTML content string must be appendable to a document fragment. '+'For example, <table> is allowed but <tr> or <tfoot> are not.');}var
really_evil=/<script\b/;if(str.match(really_evil)){JX.$E('new JX.HTML("...<script>..."): '+'call initializes an HTML object with an embedded script tag! '+'Are you crazy?! Do NOT do this!!!');}var
wont_work=/<object\b/;if(str.match(wont_work)){JX.$E('new JX.HTML("...<object>..."): '+'call initializes an HTML object with an embedded <object> tag. IE '+'will not do the right thing with this.');}}this._content=str;},members:{_content:null,getFragment:function(){var
wrapper=JX.$N('div');wrapper.innerHTML=this._content;var
fragment=document.createDocumentFragment();while(wrapper.firstChild){fragment.appendChild(wrapper.removeChild(wrapper.firstChild));}return fragment;},getNode:function(){var
fragment=this.getFragment();if(__DEV__){if(fragment.childNodes.length<1){JX.$E('JX.HTML.getNode(): Markup has no root node!');}if(fragment.childNodes.length>1){JX.$E('JX.HTML.getNode(): Markup has more than one root node!');}}return fragment.firstChild;}}});JX.$H=function(str){return new
JX.HTML(str);};JX.$N=function(tag,attr,content){if(typeof
content=='undefined'&&(typeof
attr!='object'||attr
instanceof
JX.HTML)){content=attr;attr={};}if(__DEV__){if(tag.toLowerCase()!=tag){JX.$E('$N("'+tag+'", ...): '+'tag name must be in lower case; '+'use "'+tag.toLowerCase()+'", not "'+tag+'".');}}var
node=document.createElement(tag);if(attr.style){JX.copy(node.style,attr.style);delete
attr.style;}if(attr.sigil){JX.Stratcom.addSigil(node,attr.sigil);delete
attr.sigil;}if(attr.meta){JX.Stratcom.addData(node,attr.meta);delete
attr.meta;}if(__DEV__){if(('metadata'in
attr)||('data'in
attr)){JX.$E('$N('+tag+', ...): '+'use the key "meta" to specify metadata, not "data" or "metadata".');}}for(var
k
in
attr){if(attr[k]===null){continue;}node[k]=attr[k];}if(content){JX.DOM.setContent(node,content);}return node;};JX.install('DOM',{statics:{_autoid:0,_uniqid:0,_metrics:{},_frameNode:null,_contentNode:null,setContent:function(node,content){if(__DEV__){if(!JX.DOM.isNode(node)){JX.$E('JX.DOM.setContent(<yuck>, ...): '+'first argument must be a DOM node.');}}while(node.firstChild){JX.DOM.remove(node.firstChild);}JX.DOM.appendContent(node,content);},prependContent:function(node,content){if(__DEV__){if(!JX.DOM.isNode(node)){JX.$E('JX.DOM.prependContent(<junk>, ...): '+'first argument must be a DOM node.');}}this._insertContent(node,content,this._mechanismPrepend,true);},appendContent:function(node,content){if(__DEV__){if(!JX.DOM.isNode(node)){JX.$E('JX.DOM.appendContent(<bleh>, ...): '+'first argument must be a DOM node.');}}this._insertContent(node,content,this._mechanismAppend);},_mechanismPrepend:function(node,content){node.insertBefore(content,node.firstChild);},_mechanismAppend:function(node,content){node.appendChild(content);},_insertContent:function(parent,content,mechanism,reverse){if(JX.isArray(content)){if(reverse){content=[].concat(content).reverse();}for(var
ii=0;ii<content.length;ii++){JX.DOM._insertContent(parent,content[ii],mechanism,reverse);}}else{var
type=typeof
content;if(content
instanceof
JX.HTML){content=content.getFragment();}else
if(type=='string'||type=='number'){content=document.createTextNode(content);}if(__DEV__){if(content&&!content.nodeType){JX.$E('JX.DOM._insertContent(<node>, ...): '+'second argument must be a string, a number, '+'a DOM node or a JX.HTML instance');}}content&&mechanism(parent,content);}},remove:function(node){node.parentNode&&JX.DOM.replace(node,null);return node;},replace:function(node,replacement){if(__DEV__){if(!node.parentNode){JX.$E('JX.DOM.replace(<node>, ...): '+'node has no parent node, so it can not be replaced.');}}var
mechanism;if(node.nextSibling){mechanism=JX.bind(node.nextSibling,function(parent,content){parent.insertBefore(content,this);});}else{mechanism=this._mechanismAppend;}var
parent=node.parentNode;parent.removeChild(node);this._insertContent(parent,replacement,mechanism);return node;},convertFormToListOfPairs:function(form){var
elements=form.getElementsByTagName('*');var
data=[];for(var
ii=0;ii<elements.length;++ii){if(!elements[ii].name){continue;}if(elements[ii].disabled){continue;}var
type=elements[ii].type;var
tag=elements[ii].tagName;if((type
in{radio:1,checkbox:1}&&elements[ii].checked)||type
in{text:1,hidden:1,password:1,email:1,tel:1,number:1}||tag
in{TEXTAREA:1,SELECT:1}){data.push([elements[ii].name,elements[ii].value]);}}return data;},convertFormToDictionary:function(form){var
data={};var
pairs=JX.DOM.convertFormToListOfPairs(form);for(var
ii=0;ii<pairs.length;ii++){data[pairs[ii][0]]=pairs[ii][1];}return data;},isNode:function(node){return!!(node&&node.nodeName&&(node!==window));},isType:function(node,of_type){node=(''+(node.nodeName||'')).toUpperCase();of_type=JX.$AX(of_type);for(var
ii=0;ii<of_type.length;++ii){if(of_type[ii].toUpperCase()==node){return true;}}return false;},listen:function(node,type,path,callback){var
auto_id=['autoid:'+JX.DOM._getAutoID(node)];path=JX.$AX(path||[]);if(!path.length){path=auto_id;}else{for(var
ii=0;ii<path.length;ii++){path[ii]=auto_id.concat(JX.$AX(path[ii]));}}return JX.Stratcom.listen(type,path,callback);},invoke:function(node,type,data){if(__DEV__){if(type
in
JX.__allowedEvents){throw new
Error('JX.DOM.invoke(..., "'+type+'", ...): '+'you cannot invoke with the same type as a native event.');}}return JX.Stratcom.dispatch({target:node,type:type,customData:data});},uniqID:function(node){if(!node.getAttribute('id')){node.setAttribute('id','uniqid_'+(++JX.DOM._uniqid));}return node.getAttribute('id');},alterClass:function(node,className,add){if(__DEV__){if(add!==false&&add!==true){JX.$E('JX.DOM.alterClass(...): '+'expects the third parameter to be Boolean: '+add+' was provided');}}var
has=((' '+node.className+' ').indexOf(' '+className+' ')>-1);if(add&&!has){node.className+=' '+className;}else
if(has&&!add){node.className=node.className.replace(new
RegExp('(^|\\s)'+className+'(?:\\s|$)','g'),' ').trim();}},htmlize:function(str){return(''+str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');},show:function(){var
ii;if(__DEV__){for(ii=0;ii<arguments.length;++ii){if(!arguments[ii]){JX.$E('JX.DOM.show(...): '+'one or more arguments were null or empty.');}}}for(ii=0;ii<arguments.length;++ii){arguments[ii].style.display='';}},hide:function(){var
ii;if(__DEV__){for(ii=0;ii<arguments.length;++ii){if(!arguments[ii]){JX.$E('JX.DOM.hide(...): '+'one or more arguments were null or empty.');}}}for(ii=0;ii<arguments.length;++ii){arguments[ii].style.display='none';}},textMetrics:function(node,pseudoclass,x){if(!this._metrics[pseudoclass]){var
n=JX.$N('var',{className:pseudoclass});this._metrics[pseudoclass]=n;}var
proxy=this._metrics[pseudoclass];document.body.appendChild(proxy);proxy.style.width=x?(x+'px'):'';JX.DOM.setContent(proxy,JX.$H(JX.DOM.htmlize(node.value).replace(/\n/g,'<br />')));var
metrics=JX.Vector.getDim(proxy);document.body.removeChild(proxy);return metrics;},scry:function(root,tagname,sigil){if(__DEV__){if(!JX.DOM.isNode(root)){JX.$E('JX.DOM.scry(<yuck>, ...): '+'first argument must be a DOM node.');}}var
nodes=root.getElementsByTagName(tagname);if(!sigil){return JX.$A(nodes);}var
result=[];for(var
ii=0;ii<nodes.length;ii++){if(JX.Stratcom.hasSigil(nodes[ii],sigil)){result.push(nodes[ii]);}}return result;},find:function(root,tagname,sigil){if(__DEV__){if(!JX.DOM.isNode(root)){JX.$E('JX.DOM.find(<glop>, "'+tagname+'", "'+sigil+'"): '+'first argument must be a DOM node.');}}var
result=JX.DOM.scry(root,tagname,sigil);if(__DEV__){if(result.length>1){JX.$E('JX.DOM.find(<node>, "'+tagname+'", "'+sigil+'"): '+'matched more than one node.');}}if(!result.length){JX.$E('JX.DOM.find(<node>, "'+tagname+'", "'+sigil+'"): '+'matched no nodes.');}return result[0];},findAbove:function(anchor,tagname,sigil){if(__DEV__){if(!JX.DOM.isNode(anchor)){JX.$E('JX.DOM.findAbove(<glop>, "'+tagname+'", "'+sigil+'"): '+'first argument must be a DOM node.');}}var
result=anchor.parentNode;while(true){if(!result){break;}if(!tagname||JX.DOM.isType(result,tagname)){if(!sigil||JX.Stratcom.hasSigil(result,sigil)){break;}}result=result.parentNode;}if(!result){JX.$E('JX.DOM.findAbove(<node>, "'+tagname+'", "'+sigil+'"): '+'no matching node.');}return result;},focus:function(node){try{node.focus();}catch(lol_ie){}},setContentFrame:function(frame_node,content_node){JX.DOM._frameNode=frame_node;JX.DOM._contentNode=content_node;},getContentFrame:function(){return JX.DOM._contentNode||document.body;},scrollTo:function(node){var
pos=JX.Vector.getPosWithScroll(node);JX.DOM.scrollToPosition(0,pos.y);},scrollToPosition:function(x,y){var
self=JX.DOM;if(self._frameNode){self._frameNode.scrollLeft=x;self._frameNode.scrollTop=y;}else{window.scrollTo(x,y);}},_getAutoID:function(node){if(!node.getAttribute('data-autoid')){node.setAttribute('data-autoid','autoid_'+(++JX.DOM._autoid));}return node.getAttribute('data-autoid');}}});JX.install('JSON',{statics:{parse:function(data){if(typeof
data!='string'){return null;}if(window.JSON&&JSON.parse){var
obj;try{obj=JSON.parse(data);}catch(e){}return obj||null;}return eval('('+data+')');},stringify:function(val){if(window.JSON&&JSON.stringify){return JSON.stringify(val);}var
out=[];if(val===null||val===true||val===false||typeof
val=='number'){return''+val;}if(val.push&&val.pop){var
v;for(var
ii=0;ii<val.length;ii++){v=(typeof
val[ii]=='undefined')?null:val[ii];out.push(JX.JSON.stringify(v));}return'['+out.join(',')+']';}if(typeof
val=='string'){return JX.JSON._esc(val);}for(var
k
in
val){out.push(JX.JSON._esc(k)+':'+JX.JSON.stringify(val[k]));}return'{'+out.join(',')+'}';},_escexp:/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,_meta:{'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},_esc:function(str){JX.JSON._escexp.lastIndex=0;return JX.JSON._escexp.test(str)?'"'+str.replace(JX.JSON._escexp,JX.JSON._replace)+'"':'"'+str+'"';},_replace:function(m){if(m
in
JX.JSON._meta){return JX.JSON._meta[m];}return'\\u'+(('0000'+m.charCodeAt(0).toString(16)).slice(-4));}}});JX.$U=function(uri){return new
JX.URI(uri);};JX.install('URI',{statics:{_uriPattern:/(?:([^:\/?#]+):)?(?:\/\/([^:\/?#]*)(?::(\d*))?)?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,_defaultQuerySerializer:function(obj){var
kv_pairs=[];for(var
key
in
obj){if(obj[key]!==null){var
value=encodeURIComponent(obj[key]);kv_pairs.push(encodeURIComponent(key)+(value?'='+value:''));}}return kv_pairs.join('&');},_decode:function(str){return decodeURIComponent(str.replace(/\+/g,' '));}},construct:function(uri){this.setQueryParams({});if(uri){var
result=JX.URI._uriPattern.exec(uri);this.setProtocol(result[1]||undefined);this.setDomain(result[2]||undefined);this.setPort(result[3]||undefined);var
path=result[4];var
query=result[5];this.setFragment(result[6]||undefined);this.setPath(path.charAt(0)=='/'?path:'/'+path);if(query&&query.length){var
dict={};var
parts=query.split('&');for(var
ii=0;ii<parts.length;ii++){var
part=parts[ii];if(!part.length){continue;}var
pieces=part.split('=');var
name=pieces[0];if(!name.length){continue;}var
value=pieces.slice(1).join('=')||'';dict[JX.URI._decode(name)]=JX.URI._decode(value);}this.setQueryParams(dict);}}},properties:{protocol:undefined,port:undefined,path:undefined,queryParams:undefined,fragment:undefined,querySerializer:undefined},members:{_domain:undefined,addQueryParams:function(map){JX.copy(this.getQueryParams(),map);return this;},setQueryParam:function(key,value){var
map={};map[key]=value;return this.addQueryParams(map);},setDomain:function(domain){var
re=new
RegExp('[\\x00-\\x2c\\x2f\\x3b-\\x40\\x5c\\x5e\\x60\\x7b-\\x7f'+'\\uFDD0-\\uFDEF\\uFFF0-\\uFFFF'+'\\u2047\\u2048\\uFE56\\uFE5F\\uFF03\\uFF0F\\uFF1F]');if(re.test(domain)){JX.$E('JX.URI.setDomain(...): invalid domain specified.');}this._domain=domain;return this;},getDomain:function(){return this._domain;},getRelativeURI:function(){return JX.$U(this.toString()).setProtocol(null).setPort(null).setDomain(null).toString();},toString:function(){if(__DEV__){if(this.getPath()&&this.getPath().charAt(0)!='/'){JX.$E('JX.URI.toString(): '+'Path does not begin with a "/" which means this URI will likely'+'be malformed. Ensure any string passed to .setPath() leads "/"');}}var
str='';if(this.getProtocol()){str+=this.getProtocol()+'://';}str+=this.getDomain()||'';if(this.getPort()){str+=':'+this.getPort();}str+=this.getPath()||(str?'/':'');str+=this._getQueryString();if(this.getFragment()){str+='#'+this.getFragment();}return str;},_getQueryString:function(){var
str=(this.getQuerySerializer()||JX.URI._defaultQuerySerializer)(this.getQueryParams());return str?'?'+str:'';},go:function(){var
uri=this.toString();if(JX.Stratcom.invoke('go',null,{uri:uri}).getPrevented()){return;}if(!uri){uri=window.location.pathname+(window.location.query||'');}window.location=uri;}}});JX.install('Workflow',{construct:function(uri,data){if(__DEV__){if(!uri||uri=='#'){JX.$E('new JX.Workflow(<?>, ...): '+'bogus URI provided when creating workflow.');}}this.setURI(uri);this.setData(data||{});},events:['error','finally','submit','start'],statics:{_stack:[],newFromForm:function(form,data,keep_enabled){var
pairs=JX.DOM.convertFormToListOfPairs(form);for(var
k
in
data){pairs.push([k,data[k]]);}var
inputs;if(keep_enabled){inputs=[];}else{inputs=[].concat(JX.DOM.scry(form,'input'),JX.DOM.scry(form,'button'),JX.DOM.scry(form,'textarea'));for(var
ii=0;ii<inputs.length;ii++){if(inputs[ii].disabled){delete
inputs[ii];}else{inputs[ii].disabled=true;}}}var
workflow=new
JX.Workflow(form.getAttribute('action'),{});workflow._form=form;workflow.setDataWithListOfPairs(pairs);workflow.setMethod(form.getAttribute('method'));var
onfinally=JX.bind(workflow,function(){if(!this._keepControlsDisabled){for(var
ii=0;ii<inputs.length;ii++){inputs[ii]&&(inputs[ii].disabled=false);}}});workflow.listen('finally',onfinally);return workflow;},newFromLink:function(link){var
workflow=new
JX.Workflow(link.href);return workflow;},_push:function(workflow){JX.Mask.show();JX.Workflow._stack.push(workflow);},_pop:function(){var
dialog=JX.Workflow._stack.pop();(dialog.getCloseHandler()||JX.bag)();dialog._destroy();JX.Mask.hide();},disable:function(){JX.Workflow._disabled=true;},_onbutton:function(event){if(JX.Stratcom.pass()){return;}if(JX.Workflow._disabled){return;}var
t=event.getNode('jx-workflow-button')||event.getNode('tag:button');if(JX.Stratcom.getData(t).disableWorkflow){return;}event.prevent();if(t.name=='__cancel__'||t.name=='__close__'){JX.Workflow._pop();}else{var
form=event.getNode('jx-dialog');JX.Workflow._dosubmit(form,t);}},_onsyntheticsubmit:function(e){if(JX.Stratcom.pass()){return;}if(JX.Workflow._disabled){return;}e.prevent();var
form=e.getNode('jx-dialog');var
button=JX.DOM.find(form,'button','__default__');JX.Workflow._dosubmit(form,button);},_dosubmit:function(form,button){var
dom_event=JX.DOM.invoke(form,'didWorkflowSubmit');if(dom_event.getPrevented()){return;}var
data=JX.DOM.convertFormToListOfPairs(form);data.push([button.name,button.value||true]);var
active=JX.Workflow._getActiveWorkflow();active._form=form;var
e=active.invoke('submit',{form:form,data:data});if(!e.getStopped()){button.disabled=true;active.setURI(form.getAttribute('action')||active.getURI()).setDataWithListOfPairs(data).start();}},_getActiveWorkflow:function(){var
stack=JX.Workflow._stack;return stack[stack.length-1];},_onresizestart:function(e){var
self=JX.Workflow;if(self._resizing){return;}var
workflow=self._getActiveWorkflow();if(!workflow){return;}e.kill();var
form=JX.DOM.find(workflow._root,'div','jx-dialog');var
resize=e.getNodeData('jx-dialog-resize');var
node_y=JX.$(resize.resizeY);var
dim=JX.Vector.getDim(form);dim.y=JX.Vector.getDim(node_y).y;if(!form._minimumSize){form._minimumSize=dim;}self._resizing={min:form._minimumSize,form:form,startPos:JX.$V(e),startDim:dim,resizeY:node_y,resizeX:resize.resizeX};},_onmousemove:function(e){var
self=JX.Workflow;if(!self._resizing){return;}var
spec=self._resizing;var
form=spec.form;var
min=spec.min;var
delta=JX.$V(e).add(-spec.startPos.x,-spec.startPos.y);var
src_dim=spec.startDim;var
dst_dim=JX.$V(src_dim.x+delta.x,src_dim.y+delta.y);if(dst_dim.x<min.x){dst_dim.x=min.x;}if(dst_dim.y<min.y){dst_dim.y=min.y;}if(spec.resizeX){JX.$V(dst_dim.x,null).setDim(form);}if(spec.resizeY){JX.$V(null,dst_dim.y).setDim(spec.resizeY);}},_onmouseup:function(){var
self=JX.Workflow;if(!self._resizing){return;}self._resizing=false;}},members:{_root:null,_pushed:false,_data:null,_form:null,_paused:0,_nextCallback:null,_keepControlsDisabled:false,getSourceForm:function(){return this._form;},pause:function(){this._paused++;return this;},resume:function(){if(!this._paused){JX.$E('Resuming a workflow which is not paused!');}this._paused--;if(!this._paused){var
next=this._nextCallback;this._nextCallback=null;if(next){next();}}return this;},_onload:function(r){this._destroy();if(r&&(typeof
r.redirect!='undefined')){if(r.close){this._pop();}this._keepControlsDisabled=true;JX.$U(r.redirect).go();}else
if(r&&r.dialog){this._push();this._root=JX.$N('div',{className:'jx-client-dialog'},JX.$H(r.dialog));JX.DOM.listen(this._root,'click',[['jx-workflow-button'],['tag:button']],JX.Workflow._onbutton);JX.DOM.listen(this._root,'didSyntheticSubmit',[],JX.Workflow._onsyntheticsubmit);JX.DOM.listen(this._root,'mousedown','jx-dialog-resize',JX.Workflow._onresizestart);document.body.appendChild(this._root);var
d=JX.Vector.getDim(this._root);var
v=JX.Vector.getViewport();var
s=JX.Vector.getScroll();var
offset=Math.min(Math.max(20,(v.y-d.y)/2),100);JX.$V(0,s.y+offset).setPos(this._root);try{JX.DOM.focus(JX.DOM.find(this._root,'button','__default__'));var
inputs=JX.DOM.scry(this._root,'input').concat(JX.DOM.scry(this._root,'textarea'));var
miny=Number.POSITIVE_INFINITY;var
target=null;for(var
ii=0;ii<inputs.length;++ii){if(inputs[ii].type!='hidden'){var
p=JX.$V(inputs[ii]);if(p.y<miny){miny=p.y;target=inputs[ii];}}}target&&JX.DOM.focus(target);}catch(_ignored){}window.scrollTo(s.x,s.y);}else
if(this.getHandler()){this.getHandler()(r);this._pop();}else
if(r){if(__DEV__){JX.$E('Response to workflow request went unhandled.');}}},_push:function(){if(!this._pushed){this._pushed=true;JX.Workflow._push(this);}},_pop:function(){if(this._pushed){this._pushed=false;JX.Workflow._pop();}},_destroy:function(){if(this._root){JX.DOM.remove(this._root);this._root=null;}},start:function(){var
next=JX.bind(this,this._send);this.pause();this._nextCallback=next;this.invoke('start',this);this.resume();},_send:function(){var
uri=this.getURI();var
method=this.getMethod();var
r=new
JX.Request(uri,JX.bind(this,this._onload));var
list_of_pairs=this._data;list_of_pairs.push(['__wflow__',true]);r.setDataWithListOfPairs(list_of_pairs);r.setDataSerializer(this.getDataSerializer());if(method){r.setMethod(method);}r.listen('finally',JX.bind(this,this.invoke,'finally'));r.listen('error',JX.bind(this,function(error){var
e=this.invoke('error',error);if(e.getStopped()){return;}}));r.send();},getRoutable:function(){var
routable=new
JX.Routable();routable.listen('start',JX.bind(this,function(){JX.Stratcom.pass(JX.Stratcom.context());this.start();}));this.listen('finally',JX.bind(routable,routable.done));return routable;},setData:function(dictionary){this._data=[];for(var
k
in
dictionary){this._data.push([k,dictionary[k]]);}return this;},addData:function(key,value){this._data.push([key,value]);return this;},setDataWithListOfPairs:function(list_of_pairs){this._data=list_of_pairs;return this;}},properties:{handler:null,closeHandler:null,dataSerializer:null,method:null,URI:null},initialize:function(){function
close_dialog_when_user_presses_escape(e){if(e.getSpecialKey()!='esc'){return;}if(JX.Workflow._disabled){return;}if(JX.Stratcom.pass()){return;}var
active=JX.Workflow._getActiveWorkflow();if(!active){return;}var
buttons=JX.DOM.scry(active._root,'a','jx-workflow-button');if(!buttons.length){return;}var
cancel=null;for(var
ii=0;ii<buttons.length;ii++){if(buttons[ii].name=='__cancel__'){cancel=buttons[ii];break;}}if(!cancel){return;}JX.Workflow._pop();e.prevent();}JX.Stratcom.listen('keydown',null,close_dialog_when_user_presses_escape);JX.Stratcom.listen('mousemove',null,JX.Workflow._onmousemove);JX.Stratcom.listen('mouseup',null,JX.Workflow._onmouseup);}});JX.install('Mask',{statics:{_stack:[],_mask:null,_currentType:null,show:function(mask_type){var
self=JX.Mask;mask_type=mask_type||null;if(!self._stack.length){self._mask=JX.$N('div',{className:'jx-mask',sigil:'jx-mask'});document.body.appendChild(self._mask);}self._adjustType(mask_type);JX.Mask._stack.push(mask_type);},hide:function(){var
self=JX.Mask;var
mask_type=self._stack.pop();self._adjustType(mask_type);if(!self._stack.length){JX.DOM.remove(JX.Mask._mask);JX.Mask._mask=null;}},_adjustType:function(new_type){var
self=JX.Mask;if(self._currentType){JX.DOM.alterClass(self._mask,self._currentType,false);self._currentType=null;}if(new_type){JX.DOM.alterClass(self._mask,new_type,true);self._currentType=new_type;}}}});JX.install('Typeahead',{construct:function(hardpoint,control){this._hardpoint=hardpoint;this._control=control||JX.DOM.find(hardpoint,'input');this._root=JX.$N('div',{className:'jx-typeahead-results'});this._display=[];this._listener=JX.DOM.listen(this._control,['focus','blur','keypress','keydown','input'],null,JX.bind(this,this.handleEvent));JX.DOM.listen(this._root,['mouseover','mouseout'],null,JX.bind(this,this._onmouse));JX.DOM.listen(this._root,'mousedown','tag:a',JX.bind(this,function(e){if(!e.isRightButton()){this._choose(e.getNode('tag:a'));}}));},events:['choose','query','start','change','show'],properties:{allowNullSelection:true},members:{_root:null,_control:null,_hardpoint:null,_listener:null,_value:null,_stop:false,_focus:-1,_focused:false,_placeholderVisible:false,_placeholder:null,_display:null,_datasource:null,_waitingListener:null,_readyListener:null,_completeListener:null,start:function(){this.invoke('start');if(__DEV__){if(!this._datasource){throw new
Error('JX.Typeahead.start(): '+'No datasource configured. Create a datasource and call '+'setDatasource().');}}this.updatePlaceholder();},setDatasource:function(datasource){if(this._datasource){this._datasource.unbindFromTypeahead();this._waitingListener.remove();this._readyListener.remove();this._completeListener.remove();}this._waitingListener=datasource.listen('waiting',JX.bind(this,this.waitForResults));this._readyListener=datasource.listen('resultsready',JX.bind(this,this.showResults));this._completeListener=datasource.listen('complete',JX.bind(this,this.doneWaitingForResults));datasource.bindToTypeahead(this);this._datasource=datasource;},getDatasource:function(){return this._datasource;},setInputNode:function(input){this._control=input;return this;},hide:function(){this._changeFocus(Number.NEGATIVE_INFINITY);this._display=[];this._moused=false;JX.DOM.hide(this._root);},showResults:function(results,value){if(value!=this._value){return;}var
obj={show:results};var
e=this.invoke('show',obj);var
old_focus=null;if(this._focus>=0&&this._display[this._focus]){old_focus=this._display[this._focus].name;}JX.DOM.setContent(this._root,results);this._display=JX.DOM.scry(this._root,'a','typeahead-result');if(this._display.length&&!e.getPrevented()){this._changeFocus(Number.NEGATIVE_INFINITY);var
d=JX.Vector.getDim(this._hardpoint);d.x=0;d.setPos(this._root);if(this._root.parentNode!==this._hardpoint){this._hardpoint.appendChild(this._root);}JX.DOM.show(this._root);if(old_focus!==null){for(var
ii=0;ii<this._display.length;ii++){if(this._display[ii].name==old_focus){this._focus=ii;this._drawFocus();break;}}}}else{this.hide();JX.DOM.setContent(this._root,null);}},refresh:function(){if(this._stop){return;}this._value=this._control.value;this.invoke('change',this._value);},waitForResults:function(){JX.DOM.alterClass(this._hardpoint,'jx-typeahead-waiting',true);},doneWaitingForResults:function(){JX.DOM.alterClass(this._hardpoint,'jx-typeahead-waiting',false);},_onmouse:function(event){this._moused=(event.getType()=='mouseover');this._drawFocus();},_changeFocus:function(d){var
n=Math.min(Math.max(-1,this._focus+d),this._display.length-1);if(!this.getAllowNullSelection()){n=Math.max(0,n);}if(this._focus>=0&&this._focus<this._display.length){JX.DOM.alterClass(this._display[this._focus],'focused',false);}this._focus=n;this._drawFocus();return true;},_drawFocus:function(){var
f=this._display[this._focus];if(f){JX.DOM.alterClass(f,'focused',!this._moused);}},_choose:function(target){var
result=this.invoke('choose',target);if(result.getPrevented()){return;}this._control.value=target.name;this.hide();},clear:function(){this._control.value='';this._value='';this.hide();},enable:function(){this._control.disabled=false;this._stop=false;},disable:function(){this._control.blur();this._control.disabled=true;this._stop=true;},submit:function(){if(this._focus>=0&&this._display[this._focus]){this._choose(this._display[this._focus]);return true;}else{var
result=this.invoke('query',this._control.value);if(result.getPrevented()){return true;}}return false;},setValue:function(value){this._control.value=value;},getValue:function(){return this._control.value;},_update:function(event){if(event.getType()=='focus'){this._focused=true;this.updatePlaceholder();}var
k=event.getSpecialKey();if(k&&event.getType()=='keydown'){switch(k){case'up':if(this._display.length&&this._changeFocus(-1)){event.prevent();}break;case'down':if(this._display.length&&this._changeFocus(1)){event.prevent();}break;case'return':if(this.submit()){event.prevent();return;}break;case'esc':if(this._display.length&&this.getAllowNullSelection()){this.hide();event.prevent();}break;case'tab':return;}}setTimeout(JX.bind(this,function(){if(this._value==this._control.value){return;}this.refresh();}),0);},handleEvent:function(e){if(this._stop||e.getPrevented()){return;}var
type=e.getType();if(type=='blur'){this._focused=false;this.updatePlaceholder();this.hide();}else{this._update(e);}},removeListener:function(){if(this._listener){this._listener.remove();}},setPlaceholder:function(string){this._placeholder=string;this.updatePlaceholder();return this;},updatePlaceholder:function(){if(this._placeholderVisible){if(this._focused||!this._placeholder){this._placeholderVisible=false;this._control.value='';}}else
if(!this._focused){if(this._placeholder&&!this._control.value){this._placeholderVisible=true;}}if(this._placeholderVisible){this._control.value=this._placeholder;}JX.DOM.alterClass(this._control,'jx-typeahead-placeholder',this._placeholderVisible);}}});JX.install('TypeaheadNormalizer',{statics:{normalize:function(str){return(''+str).toLocaleLowerCase().replace(/[\.,\/#!$%\^&\*;:{}=_`~]/g,'').replace(/[-\[\]\(\)]/g,' ').replace(/ +/g,' ').replace(/^\s*|\s*$/g,'');}}});JX.install('TypeaheadSource',{construct:function(){this.resetResults();this.setNormalizer(JX.TypeaheadNormalizer.normalize);this._excludeIDs={};},events:['waiting','resultsready','complete'],properties:{normalizer:null,queryExtractor:null,transformer:null,maximumResultCount:5,sortHandler:null,filterHandler:null},members:{_raw:null,_lookup:null,_excludeIDs:null,_changeListener:null,_startListener:null,bindToTypeahead:function(typeahead){this._changeListener=typeahead.listen('change',JX.bind(this,this.didChange));this._startListener=typeahead.listen('start',JX.bind(this,this.didStart));},unbindFromTypeahead:function(){this._changeListener.remove();this._startListener.remove();},didChange:function(){return;},didStart:function(){return;},clearCache:function(){this._raw={};this._lookup={};},addExcludeID:function(id){if(id){this._excludeIDs[id]=true;}},removeExcludeID:function(id){if(id){delete
this._excludeIDs[id];}},addResult:function(obj){obj=(this.getTransformer()||this._defaultTransformer)(obj);if(obj.id
in
this._raw){return;}if(__DEV__){for(var
k
in{name:1,id:1,display:1,uri:1}){if(!(k
in
obj)){throw new
Error('JX.TypeaheadSource.addResult(): result must have '+'properties \'name\', \'id\', \'uri\' and \'display\'.');}}}this._raw[obj.id]=obj;var
t=this.tokenize(obj.tokenizable||obj.name);for(var
jj=0;jj<t.length;++jj){if(!this._lookup.hasOwnProperty(t[jj])){this._lookup[t[jj]]=[];}this._lookup[t[jj]].push(obj.id);}},waitForResults:function(){this.invoke('waiting');return this;},getResult:function(id){return this._raw[id];},matchResults:function(value,partial){var
match_count={};var
match_fragments={};var
matched={};var
seen={};var
query_extractor=this.getQueryExtractor();if(query_extractor){value=query_extractor(value);}var
t=this.tokenize(value);t.sort(function(u,v){return v.length-u.length;});for(var
ii=0;ii<t.length;++ii){if(t[ii]in
seen){t.splice(ii--,1);continue;}seen[t[ii]]=true;var
fragment=t[ii];for(var
name_fragment
in
this._lookup){if(name_fragment.substr(0,fragment.length)===fragment){if(!(name_fragment
in
matched)){matched[name_fragment]=true;}else{continue;}var
l=this._lookup[name_fragment];for(var
jj=0;jj<l.length;++jj){var
match_id=l[jj];if(!match_fragments[match_id]){match_fragments[match_id]={};}if(!(fragment
in
match_fragments[match_id])){match_fragments[match_id][fragment]=true;match_count[match_id]=(match_count[match_id]||0)+1;}}}}}var
hits=[];for(var
k
in
match_count){if(match_count[k]==t.length&&!this._excludeIDs[k]){hits.push(k);}}this.filterAndSortHits(value,hits);var
nodes=this.renderNodes(value,hits);this.invoke('resultsready',nodes,value,partial);if(!partial){this.invoke('complete');}},filterAndSortHits:function(value,hits){var
objs=[];var
ii;for(ii=0;ii<hits.length;ii++){objs.push(this._raw[hits[ii]]);}var
default_comparator=function(u,v){var
key_u=u.sort||u.name;var
key_v=v.sort||v.name;return key_u.localeCompare(key_v);};var
filter_handler=this.getFilterHandler()||function(value,list){return list;};objs=filter_handler(value,objs);var
sort_handler=this.getSortHandler()||function(value,list,cmp){list.sort(cmp);};sort_handler(value,objs,default_comparator);hits.splice(0,hits.length);for(ii=0;ii<objs.length;ii++){hits.push(objs[ii].id);}},renderNodes:function(value,hits){var
n=Math.min(this.getMaximumResultCount(),hits.length);var
nodes=[];for(var
kk=0;kk<n;kk++){nodes.push(this.createNode(this._raw[hits[kk]]));}return nodes;},createNode:function(data){return JX.$N('a',{sigil:'typeahead-result',href:data.uri,name:data.name,rel:data.id,className:'jx-result'},data.display);},normalize:function(str){return this.getNormalizer()(str);},tokenize:function(str){str=this.normalize(str);if(!str.length){return[];}return str.split(/\s+/g);},resetResults:function(){this._raw={};this._lookup={};},_defaultTransformer:function(object){return{name:object[0],display:object[0],uri:object[1],id:object[2]};}}});JX.install('TypeaheadPreloadedSource',{extend:'TypeaheadSource',construct:function(uri){JX.TypeaheadSource.call(this);this.uri=uri;},members:{ready:false,uri:null,lastValue:null,didChange:function(value){if(this.ready){this.matchResults(value);}else{this.lastValue=value;this.waitForResults();}},didStart:function(){var
r=new
JX.Request(this.uri,JX.bind(this,this.ondata));r.setMethod('GET');r.send();},ondata:function(results){for(var
ii=0;ii<results.length;++ii){this.addResult(results[ii]);}if(this.lastValue!==null){this.matchResults(this.lastValue);}this.ready=true;},setReady:function(ready){this.ready=ready;}}});JX.install('TypeaheadOnDemandSource',{extend:'TypeaheadSource',construct:function(uri){JX.TypeaheadSource.call(this);this.uri=uri;this.haveData={'':true};},properties:{queryDelay:125,auxiliaryData:{}},members:{uri:null,lastChange:null,haveData:null,didChange:function(raw_value,force){this.lastChange=JX.now();var
value=this.normalize(raw_value);if(this.haveData[value]){this.matchResults(raw_value);}else{for(var
ii=value.length-1;ii>0;ii--){var
substr=value.substring(0,ii);if(this.haveData[substr]){this.matchResults(raw_value,true);break;}}this.waitForResults();var
send_request=JX.bind(this,this.sendRequest,this.lastChange,value,raw_value);if(force){send_request();}else{setTimeout(send_request,this.getQueryDelay());}}},sendRequest:function(when,value,raw_value){if(when!=this.lastChange){return;}var
r=new
JX.Request(this.uri,JX.bind(this,this.ondata,this.lastChange,raw_value));r.setMethod('GET');r.setData(JX.copy(this.getAuxiliaryData(),{q:value,raw:raw_value}));r.send();},ondata:function(when,raw_value,results){if(results){for(var
ii=0;ii<results.length;ii++){this.addResult(results[ii]);}}var
value=this.normalize(raw_value);this.haveData[value]=true;if(when!=this.lastChange){return;}this.matchResults(raw_value);}}});JX.install('Tokenizer',{construct:function(containerNode){this._containerNode=containerNode;},events:['change'],properties:{limit:null,renderTokenCallback:null,browseURI:null,disabled:false},members:{_containerNode:null,_root:null,_frame:null,_focus:null,_orig:null,_typeahead:null,_tokenid:0,_tokens:null,_tokenMap:null,_initialValue:null,_seq:0,_lastvalue:null,_placeholder:null,start:function(){if(this.getDisabled()){JX.DOM.alterClass(this._containerNode,'disabled-control',true);return;}if(__DEV__){if(!this._typeahead){throw new
Error('JX.Tokenizer.start(): '+'No typeahead configured! Use setTypeahead() to provide a '+'typeahead.');}}this._orig=JX.DOM.find(this._containerNode,'input','tokenizer-input');this._tokens=[];this._tokenMap={};try{this._frame=JX.DOM.findAbove(this._orig,'div','tokenizer-frame');}catch(e){}if(this._frame){JX.DOM.alterClass(this._frame,'has-browse',!!this.getBrowseURI());JX.DOM.listen(this._frame,'click','tokenizer-browse',JX.bind(this,this._onbrowse));}var
focus=this.buildInput(this._orig.value);this._focus=focus;var
input_container=JX.DOM.scry(this._containerNode,'div','tokenizer-input-container');input_container=input_container[0]||this._containerNode;JX.DOM.listen(focus,['click','focus','blur','keydown','keypress','paste'],null,JX.bind(this,this.handleEvent));input_container.onclick=JX.bag;JX.DOM.listen(input_container,'click',null,JX.bind(this,function(e){if(e.getNode('remove')){this._remove(e.getNodeData('token').key,true);}else
if(e.getTarget()==this._root){this.focus();}}));var
root=JX.$N('div');root.id=this._orig.id;JX.DOM.alterClass(root,'jx-tokenizer',true);root.style.cursor='text';this._root=root;root.appendChild(focus);var
typeahead=this._typeahead;typeahead.setInputNode(this._focus);typeahead.start();setTimeout(JX.bind(this,function(){var
container=this._orig.parentNode;JX.DOM.setContent(container,root);var
map=this._initialValue||{};for(var
k
in
map){this.addToken(k,map[k]);}JX.DOM.appendContent(root,JX.$N('div',{style:{clear:'both'}}));this._redraw();}),0);},setInitialValue:function(map){this._initialValue=map;return this;},setTypeahead:function(typeahead){typeahead.setAllowNullSelection(false);typeahead.removeListener();typeahead.listen('choose',JX.bind(this,function(result){JX.Stratcom.context().prevent();if(this.addToken(result.rel,result.name)){if(this.shouldHideResultsOnChoose()){this._typeahead.hide();}this._typeahead.clear();this._redraw();this.focus();}}));typeahead.listen('query',JX.bind(this,function(query){if(query.length){JX.Stratcom.context().prevent();}}));this._typeahead=typeahead;return this;},shouldHideResultsOnChoose:function(){return true;},handleEvent:function(e){this._typeahead.handleEvent(e);if(e.getPrevented()){return;}if(e.getType()=='click'){if(e.getTarget()==this._root){this.focus();e.prevent();return;}}else
if(e.getType()=='keydown'){this._onkeydown(e);}else
if(e.getType()=='blur'){this._didblur();this._typeahead.updatePlaceholder();}else
if(e.getType()=='focus'){this._didfocus();}else
if(e.getType()=='paste'){setTimeout(JX.bind(this,this._redraw),0);}},refresh:function(){this._redraw(true);return this;},_redraw:function(force){if(JX.keys(this._tokenMap).length){this._typeahead.setPlaceholder(null);}else{this._typeahead.setPlaceholder(this._placeholder);}var
focus=this._focus;if(focus.value===this._lastvalue&&!force){return;}this._lastvalue=focus.value;var
metrics=JX.DOM.textMetrics(this._focus,'jx-tokenizer-metrics');metrics.y=null;metrics.x+=24;metrics.setDim(focus);},setPlaceholder:function(string){this._placeholder=string;return this;},addToken:function(key,value){if(key
in
this._tokenMap){return false;}var
focus=this._focus;var
root=this._root;var
token=this.buildToken(key,value);this._tokenMap[key]={value:value,key:key,node:token};this._tokens.push(key);root.insertBefore(token,focus);this._didChangeValue();return true;},removeToken:function(key){return this._remove(key,false);},buildInput:function(value){return JX.$N('input',{className:'jx-tokenizer-input',type:'text',autocomplete:'off',value:value});},buildToken:function(key,value){var
input=JX.$N('input',{type:'hidden',value:key,name:this._orig.name+'['+(this._seq++)+']'});var
remove=JX.$N('a',{className:'jx-tokenizer-x',sigil:'remove'},'\u00d7');var
display_token=value;var
attrs={className:'jx-tokenizer-token',sigil:'token',meta:{key:key}};var
container=JX.$N('a',attrs);var
render_callback=this.getRenderTokenCallback();if(render_callback){display_token=render_callback(value,key,container);}JX.DOM.setContent(container,[display_token,input,remove]);return container;},getTokens:function(){var
result={};for(var
key
in
this._tokenMap){result[key]=this._tokenMap[key].value;}return result;},_onkeydown:function(e){var
raw=e.getRawEvent();if(raw.ctrlKey||raw.metaKey||raw.altKey){return;}switch(e.getSpecialKey()){case'tab':var
completed=this._typeahead.submit();if(!completed){this._focus.value='';}break;case'delete':if(!this._focus.value.length){var
tok;while(this._tokens.length){tok=this._tokens.pop();if(this._remove(tok,true)){break;}}}break;case'return':break;default:if(this.getLimit()&&JX.keys(this._tokenMap).length==this.getLimit()){e.prevent();}setTimeout(JX.bind(this,this._redraw),0);break;}},_remove:function(index,focus){if(!this._tokenMap[index]){return false;}JX.DOM.remove(this._tokenMap[index].node);delete
this._tokenMap[index];this._redraw(true);focus&&this.focus();this._didChangeValue();return true;},_didChangeValue:function(){if(this.getBrowseURI()){var
button=JX.DOM.find(this._frame,'a','tokenizer-browse');JX.DOM.alterClass(button,'disabled',!!this._shouldLockBrowse());}this.invoke('change',this);},_shouldLockBrowse:function(){var
limit=this.getLimit();if(!limit){return false;}if(limit==1){return false;}if(limit>JX.keys(this.getTokens()).length){return false;}return true;},focus:function(){var
focus=this._focus;JX.DOM.show(focus);JX.DOM.focus(focus);},_didfocus:function(){JX.DOM.alterClass(this._containerNode,'jx-tokenizer-container-focused',true);},_didblur:function(){JX.DOM.alterClass(this._containerNode,'jx-tokenizer-container-focused',false);this._focus.value='';this._redraw();},_onbrowse:function(e){e.kill();var
uri=this.getBrowseURI();if(!uri){return;}if(this._shouldLockBrowse()){return;}new
JX.Workflow(uri,{exclude:JX.keys(this.getTokens()).join(',')}).setHandler(JX.bind(this,function(r){var
source=this._typeahead.getDatasource();source.addResult(r.token);var
result=source.getResult(r.key);if(this.getLimit()==1){for(var
k
in
this.getTokens()){this.removeToken(k);}}this.addToken(r.key,result.name);this.focus();})).start();}}});JX.install('History',{statics:{DEFAULT:Infinity,PUSHSTATE:3,HASHCHANGE:2,POLLING:1,_hash:null,_initialPath:null,_mechanism:null,install:function(mechanism){if(__DEV__){if(JX.History._installed){JX.$E('JX.History.install(): can only install once.');}JX.History._installed=true;}mechanism=mechanism||JX.History.DEFAULT;if(mechanism>=JX.History.PUSHSTATE&&'pushState'in
history){JX.History._mechanism=JX.History.PUSHSTATE;JX.History._initialPath=JX.History._getBasePath(location.href);JX.Stratcom.listen('popstate',null,JX.History._handleChange);}else
if(mechanism>=JX.History.HASHCHANGE&&'onhashchange'in
window){JX.History._mechanism=JX.History.HASHCHANGE;JX.Stratcom.listen('hashchange',null,JX.History._handleChange);}else{JX.History._mechanism=JX.History.POLLING;setInterval(JX.History._handleChange,200);}},getMechanism:function(){if(__DEV__){if(!JX.History._installed){JX.$E('JX.History.getMechanism(): '+'must call JX.History.install() first.');}}return JX.History._mechanism;},getPath:function(){if(__DEV__){if(!JX.History._installed){JX.$E('JX.History.getPath(): '+'must call JX.History.install() first.');}}if(JX.History.getMechanism()===JX.History.PUSHSTATE){return JX.History._getBasePath(location.href);}else{var
parsed=JX.History._parseFragment(location.hash);return parsed||JX.History._getBasePath(location.href);}},push:function(path,state){if(__DEV__){if(!JX.History._installed){JX.$E('JX.History.push(): '+'must call JX.History.install() first.');}}if(JX.History.getMechanism()===JX.History.PUSHSTATE){if(JX.History._initialPath&&JX.History._initialPath!==path){JX.History._initialPath=null;}history.pushState(state||null,null,path);JX.History._fire(path,state);}else{location.hash=JX.History._composeFragment(path);}},replace:function(path){if(__DEV__){if(!JX.History._installed){JX.$E('JX.History.replace(): '+'must call JX.History.install() first.');}}if(JX.History.getMechanism()===JX.History.PUSHSTATE){history.replaceState(null,null,path);JX.History._fire(path);}else{var
uri=JX.$U(location.href);uri.setFragment(JX.History._composeFragment(path));if('replaceState'in
history){history.replaceState(null,null,uri.toString());JX.History._handleChange();}else{location.replace(uri.toString());}}},_handleChange:function(e){var
path=JX.History.getPath();var
state=(e&&e.getRawEvent().state);if(JX.History.getMechanism()===JX.History.PUSHSTATE){if(path===JX.History._initialPath){JX.History._initialPath=null;}else{JX.History._fire(path,state);}}else{if(path!==JX.History._hash){JX.History._hash=path;JX.History._fire(path);}}},_fire:function(path,state){JX.Stratcom.invoke('history:change',null,{path:JX.History._getBasePath(path),state:state});},_getBasePath:function(href){return JX.$U(href).setProtocol(null).setDomain(null).toString();},_composeFragment:function(path){path=JX.History._getBasePath(path);if(JX.History.getPath()===path){var
hash=location.hash;if(hash&&hash.charAt(1)==='!'){return'~!'+path;}}return'!'+path;},_parseFragment:function(fragment){if(fragment){if(fragment.charAt(1)==='!'){return fragment.substr(2);}else
if(fragment.substr(1,2)==='~!'){return fragment.substr(3);}}return null;}}});JX.install('Router',{construct:function(){this._queue=[];},events:['queue','start','done'],members:{_queue:null,_active:0,_limit:5,queue:function(routable){this._queue.push(routable);this.invoke('queue',routable);this._update();},getRoutableByKey:function(key){for(var
ii=0;ii<this._queue.length;ii++){if(this._queue[ii].getKey()==key){return this._queue[ii];}}return null;},_update:function(){var
active=this._active;var
limit=this._limit;if(active>=limit){return;}var
minimum;if((active+1)==limit){minimum=1000;}else{minimum=0;}var
idx=this._getNextRoutable(minimum);if(idx===null){return;}var
routable=this._queue[idx];this._queue.splice(idx,1);routable.listen('done',JX.bind(this,this._done,routable));this._active++;routable.start();this.invoke('start',routable);this._update();},_done:function(routable){this._active--;this.invoke('done',routable);this._update();},_getNextRoutable:function(minimum){var
best=(minimum-1);var
routable=null;for(var
ii=0;ii<this._queue.length;ii++){var
priority=this._queue[ii].getPriority();if(priority>best){best=priority;routable=ii;}}return routable;}},statics:{_instance:null,getInstance:function(){if(!JX.Router._instance){JX.Router._instance=new
JX.Router();}return JX.Router._instance;}}});JX.install('Routable',{construct:function(){this._id=(JX.Routable._nextID++);},properties:{key:null,priority:1000,type:'default'},events:['start','done'],members:{_id:null,getID:function(){return this._id;},start:function(){this.invoke('start');},done:function(){this.invoke('done');}},statics:{_nextID:0}});JX.behavior('aphront-basic-tokenizer',function(config){var
build=JX.Prefab.buildTokenizer(config);if(build){build.tokenizer.start();}});JX.behavior('workflow',function(){var
queue=function(workflow){var
routable=workflow.getRoutable().setPriority(2000).setType('workflow');JX.Router.getInstance().queue(routable);};JX.Stratcom.listen('click',['workflow','tag:form','alternate-submit-button'],function(e){e.prevent();var
target=e.getNode('alternate-submit-button');var
form=e.getNode('tag:form');var
button={};button[target.name]=target.value||true;JX.DOM.invoke(form,'didSyntheticSubmit',{extra:button});});JX.Stratcom.listen(['submit','didSyntheticSubmit'],['workflow','tag:form'],function(e){if(JX.Stratcom.pass()){return;}var
data=e.getData();var
extra=(data&&data.extra)||{};e.prevent();queue(JX.Workflow.newFromForm(e.getNode('tag:form'),extra));});JX.Stratcom.listen('click',['workflow','tag:a'],function(e){if(!e.isNormalClick()){return;}var
workflow_node=e.getNode('workflow');if(JX.DOM.isType(workflow_node,'form')){return;}if(JX.Stratcom.pass()){return;}e.prevent();queue(JX.Workflow.newFromLink(e.getNode('tag:a')));});});JX.behavior('aphront-form-disable-on-submit',function(){var
restore=[];var
root=null;var
new_tab=false;JX.Stratcom.listen('click','tag:button',function(e){var
raw=e.getRawEvent();new_tab=(raw.altKey||raw.ctrlKey||raw.metaKey||raw.shiftKey);});JX.Stratcom.listen('keydown',['tag:form','tag:textarea'],function(e){var
raw=e.getRawEvent();if(!(e.getSpecialKey()==='return'&&(raw.ctrlKey||raw.metaKey))){return;}e.kill();var
form=e.getNode('tag:form');var
r=JX.DOM.invoke(form,'didSyntheticSubmit');if(r.getPrevented()){return;}if(form._disabled){return;}will_submit(form);form.submit();});function
will_submit(root){root._disabled=true;var
buttons=JX.DOM.scry(root,'button');for(var
ii=0;ii<buttons.length;ii++){if(!buttons[ii].disabled){buttons[ii].disabled='disabled';JX.DOM.alterClass(buttons[ii],'disabled',true);restore.push(buttons[ii]);}}}JX.Stratcom.listen('submit','tag:form',function(e){if(e.getNode('workflow')){return;}root=e.getNode('tag:form');if(JX.Stratcom.hasSigil(root,'download')){return;}root.target=(new_tab?'_blank':'');if(new_tab){return;}if(root._disabled){e.kill();}will_submit(root);});JX.Stratcom.listen('unload',null,function(){for(var
ii=0;ii<restore.length;ii++){restore[ii].disabled='';JX.DOM.alterClass(restore[ii],'disabled',false);root._disabled=false;}if(root){delete
root._disabled;}restore=[];root=null;});});JX.install('KeyboardShortcutManager',{construct:function(){this._shortcuts=[];JX.Stratcom.listen('keypress',null,JX.bind(this,this._onkeypress));JX.Stratcom.listen('keydown',null,JX.bind(this,this._onkeydown));JX.Stratcom.listen('keyup',null,JX.bind(this,this._onkeyup));},statics:{_instance:null,_downkeys:{left:1,right:1,up:1,down:1},_altkeys:{'@':1,'\\':1},getInstance:function(){if(!JX.KeyboardShortcutManager._instance){JX.KeyboardShortcutManager._instance=new
JX.KeyboardShortcutManager();}return JX.KeyboardShortcutManager._instance;}},members:{_shortcuts:null,addKeyboardShortcut:function(s){this._shortcuts.push(s);},getShortcutDescriptions:function(){var
desc=[];for(var
ii=0;ii<this._shortcuts.length;ii++){desc.push({keys:this._shortcuts[ii].getKeys(),description:this._shortcuts[ii].getDescription()});}return desc;},scrollTo:function(node){var
scroll_distance=JX.Vector.getAggregateScrollForNode(node);var
node_position=JX.$V(node);JX.DOM.scrollToPosition(0,node_position.y+scroll_distance.y-60);},_onkeypress:function(e){if(!(this._getKey(e)in
JX.KeyboardShortcutManager._downkeys)){this._onkeyhit(e);}},_onkeyhit:function(e){var
self=JX.KeyboardShortcutManager;var
raw=e.getRawEvent();if(raw.ctrlKey||raw.metaKey){return;}var
key=this._getKey(e);if(raw.altKey&&!(key
in
self._altkeys)){return;}var
target=e.getTarget();var
ignore=['input','select','textarea','object','embed'];if(JX.DOM.isType(target,ignore)){return;}var
key=this._getKey(e);var
shortcuts=this._shortcuts;for(var
ii=0;ii<shortcuts.length;ii++){var
keys=shortcuts[ii].getKeys();for(var
jj=0;jj<keys.length;jj++){if(keys[jj]==key){shortcuts[ii].getHandler()(this);e.kill();return;}}}},_onkeydown:function(e){this._handleTooltipKeyEvent(e,true);if(this._getKey(e)in
JX.KeyboardShortcutManager._downkeys){this._onkeyhit(e);}},_onkeyup:function(e){this._handleTooltipKeyEvent(e,false);},_getKey:function(e){return e.getSpecialKey()||String.fromCharCode(e.getRawEvent().charCode);},_handleTooltipKeyEvent:function(e,is_keydown){if(e.getRawEvent().keyCode!=18){return;}var
shortcuts=this._shortcuts;for(var
ii=0;ii<shortcuts.length;ii++){var
handler=shortcuts[ii].getTooltipHandler();handler&&handler(this,is_keydown);}}}});JX.install('KeyboardShortcut',{construct:function(keys,description){keys=JX.$AX(keys);this.setKeys(keys);this.setDescription(description);},properties:{keys:null,description:null,handler:null,tooltipHandler:null},members:{register:function(){JX.KeyboardShortcutManager.getInstance().addKeyboardShortcut(this);return this;}}});JX.behavior('phabricator-keyboard-shortcuts',function(config){var
pht=JX.phtize(config.pht);var
workflow=null;new
JX.KeyboardShortcut('?',pht('?')).setHandler(function(manager){if(workflow){return;}var
desc=manager.getShortcutDescriptions();var
data={keys:JX.JSON.stringify(desc)};workflow=new
JX.Workflow(config.helpURI,data).setCloseHandler(function(){workflow=null;});workflow.start();}).register();if(config.searchID){new
JX.KeyboardShortcut('/',pht('/')).setHandler(function(){var
search=JX.$(config.searchID);search.focus();search.select();}).register();}});JX.behavior('refresh-csrf',function(config){var
current_token=config.current;function
refresh_csrf(){new
JX.Request('/login/refresh/',function(r){current_token=r.token;var
inputs=JX.DOM.scry(document.body,'input');for(var
ii=0;ii<inputs.length;ii++){if(inputs[ii].name==config.tokenName){inputs[ii].value=r.token;}}}).send();}setInterval(refresh_csrf,1000*60*55);JX.Request.listen('open',function(r){var
via=JX.$U(window.location).getRelativeURI();var
xport=r.getTransport();xport.setRequestHeader(config.header,current_token);xport.setRequestHeader(config.viaHeader,via);});var
is_busy_type=function(type){switch(type){case'workflow':return true;}return false;};var
is_bar_type=function(type){switch(type){case'content':return true;}return false;};var
queue={};var
count=0;var
node;var
redraw_bar=function(){if(!count){if(node){node.firstChild.style.width='100%';setTimeout(JX.bind(null,JX.DOM.remove,node),500);}node=null;queue={};return;}if(!node){node=JX.$N('div',{className:'routing-bar'});document.body.appendChild(node);node.appendChild(JX.$N('div',{className:'routing-progress'}));}var
done=0;var
total=0;for(var
k
in
queue){total++;if(queue[k]){done++;}}node.firstChild.style.width=(100*(done/total))+'%';};JX.Router.listen('queue',function(r){var
type=r.getType();if(is_bar_type(type)){queue[r.getID()]=false;count++;redraw_bar();}if(is_busy_type(r.getType())){JX.Busy.start();}});JX.Router.listen('done',function(r){var
type=r.getType();if(is_bar_type(type)){queue[r.getID()]=true;count--;redraw_bar();}if(is_busy_type(r.getType())){JX.Busy.done();}});});JX.behavior('phabricator-watch-anchor',function(){var
highlighted;function
highlight(){highlighted&&JX.DOM.alterClass(highlighted,'anchor-target',false);try{highlighted=JX.$('anchor-'+window.location.hash.replace('#',''));}catch(ex){highlighted=null;}highlighted&&JX.DOM.alterClass(highlighted,'anchor-target',true);}function
defer_highlight(){setTimeout(highlight,0);}function
try_anchor(){var
anchor=window.location.hash.replace('#','');try{if(anchor){JX.$(anchor);}defer_highlight();}catch(e){var
n=50;var
try_anchor_again=function(){try{var
node=JX.$(anchor);var
pos=JX.Vector.getPosWithScroll(node);JX.DOM.scrollToPosition(0,pos.y-60);defer_highlight();}catch(e){if(n--){setTimeout(try_anchor_again,100);}}};try_anchor_again();}}JX.Stratcom.listen('hashchange',null,try_anchor);try_anchor();});JX.behavior('phabricator-autofocus',function(config){try{JX.$(config.id).focus();}catch(x){}});JX.install('PHUIXDropdownMenu',{construct:function(node){this._node=node;JX.DOM.listen(this._node,'click',null,JX.bind(this,this._onclick));JX.Stratcom.listen('mousedown',null,JX.bind(this,this._onanyclick));JX.Stratcom.listen('resize',null,JX.bind(this,this._adjustposition));JX.Stratcom.listen('phuix.dropdown.open',null,JX.bind(this,this.close));JX.Stratcom.listen('keydown',null,JX.bind(this,this._onkey));JX.DOM.listen(this._getMenuNode(),'click','tag:a',JX.bind(this,this._onlink));},events:['open','close'],properties:{width:null,align:'right',offsetX:0,offsetY:0},members:{_node:null,_menu:null,_open:false,_content:null,setContent:function(content){JX.DOM.setContent(this._getMenuNode(),content);return this;},open:function(){if(this._open){return;}this.invoke('open');JX.Stratcom.invoke('phuix.dropdown.open');this._open=true;this._show();return this;},close:function(){if(!this._open){return;}this._open=false;this._hide();this.invoke('close');return this;},_getMenuNode:function(){if(!this._menu){var
attrs={className:'phuix-dropdown-menu',role:'button'};var
menu=JX.$N('div',attrs);this._menu=menu;}return this._menu;},_onclick:function(e){if(this._open){this.close();}else{this.open();}e.prevent();},_onlink:function(e){if(!e.isNormalClick()){return;}if(e.getNode('phuix-action-view')){return;}var
link=e.getNode('tag:a');if(JX.Stratcom.hasSigil(link,'keep-open')){return;}this.close();},_onanyclick:function(e){if(!this._open){return;}if(JX.Stratcom.pass(e)){return;}var
t=e.getTarget();while(t){if(t==this._menu||t==this._node){return;}t=t.parentNode;}this.close();},_show:function(){document.body.appendChild(this._menu);if(this.getWidth()){new
JX.Vector(this.getWidth(),null).setDim(this._menu);}this._adjustposition();JX.DOM.alterClass(this._node,'phuix-dropdown-open',true);this._node.setAttribute('aria-expanded','true');var
links=JX.DOM.scry(this._menu,'a');if(links[0]){JX.DOM.focus(links[0]);}},_hide:function(){JX.DOM.remove(this._menu);JX.DOM.alterClass(this._node,'phuix-dropdown-open',false);this._node.setAttribute('aria-expanded','false');},_adjustposition:function(){if(!this._open){return;}var
m=JX.Vector.getDim(this._menu);var
v=JX.$V(this._node);var
d=JX.Vector.getDim(this._node);switch(this.getAlign()){case'right':v=v.add(d).add(JX.$V(-m.x,0));break;default:v=v.add(0,d.y);break;}v=v.add(this.getOffsetX(),this.getOffsetY());v.setPos(this._menu);},_onkey:function(e){if(!this._open){return;}if(e.getSpecialKey()!='esc'){return;}this.close();JX.DOM.focus(this._node);e.prevent();}}});JX.install('PHUIXActionListView',{construct:function(){this._items=[];},members:{_items:null,_node:null,addItem:function(item){this._items.push(item);this.getNode().appendChild(item.getNode());return this;},getNode:function(){if(!this._node){var
attrs={className:'phabricator-action-list-view'};this._node=JX.$N('ul',attrs);}return this._node;}}});JX.install('PHUIXActionView',{members:{_node:null,_name:null,_icon:'none',_iconColor:null,_disabled:false,_label:false,_handler:null,_selected:false,_divider:false,_iconNode:null,_nameNode:null,setDisabled:function(disabled){this._disabled=disabled;JX.DOM.alterClass(this.getNode(),'phabricator-action-view-disabled',disabled);this._buildIconNode(true);return this;},getDisabled:function(){return this._disabled;},setLabel:function(label){this._label=label;JX.DOM.alterClass(this.getNode(),'phabricator-action-view-label',label);return this;},setDivider:function(divider){this._divider=divider;JX.DOM.alterClass(this.getNode(),'phabricator-action-view-type-divider',divider);return this;},setSelected:function(selected){this._selected=selected;JX.DOM.alterClass(this.getNode(),'phabricator-action-view-selected',selected);return this;},setName:function(name){this._name=name;this._buildNameNode(true);return this;},setHandler:function(handler){this._handler=handler;this._buildNameNode(true);return this;},setIcon:function(icon){this._icon=icon;this._buildIconNode(true);return this;},setIconColor:function(color){this._iconColor=color;this._buildIconNode(true);return this;},setHref:function(href){this._href=href;this._buildNameNode(true);return this;},getNode:function(){if(!this._node){var
classes=['phabricator-action-view'];if(this._href||this._handler){classes.push('phabricator-action-view-href');}if(this._icon){classes.push('action-has-icon');}var
content=[this._buildIconNode(),this._buildNameNode()];var
attr={className:classes.join(' ')};this._node=JX.$N('li',attr,content);JX.Stratcom.addSigil(this._node,'phuix-action-view');}return this._node;},_buildIconNode:function(dirty){if(!this._iconNode||dirty){var
attr={className:['phui-icon-view','phabricator-action-view-icon','phui-font-fa'].join(' ')};var
node=JX.$N('span',attr);var
icon_class=this._icon;if(this._disabled){icon_class=icon_class+' grey';}if(this._iconColor){icon_class=icon_class+' '+this._iconColor;}JX.DOM.alterClass(node,icon_class,true);if(this._iconNode&&this._iconNode.parentNode){JX.DOM.replace(this._iconNode,node);}this._iconNode=node;}return this._iconNode;},_buildNameNode:function(dirty){if(!this._nameNode||dirty){var
attr={className:'phabricator-action-view-item'};var
href=this._href;if(!href&&this._handler){href='#';}if(href){attr.href=href;}var
tag=href?'a':'span';var
node=JX.$N(tag,attr,this._name);JX.DOM.listen(node,'click',null,JX.bind(this,this._onclick));if(this._nameNode&&this._nameNode.parentNode){JX.DOM.replace(this._nameNode,node);}this._nameNode=node;}return this._nameNode;},_onclick:function(e){if(this._handler){this._handler(e);}}}});JX.install('PHUIXIconView',{members:{_node:null,_icon:null,_color:null,setIcon:function(icon){var
node=this.getNode();if(this._icon){JX.DOM.alterClass(node,this._icon,false);}this._icon=icon;JX.DOM.alterClass(node,this._icon,true);return this;},setColor:function(color){var
node=this.getNode();if(this._color){JX.DOM.alterClass(node,this._color,false);}this._color=color;JX.DOM.alterClass(node,this._color,true);return this;},getNode:function(){if(!this._node){var
attrs={className:'phui-icon-view phui-font-fa'};this._node=JX.$N('span',attrs);}return this._node;}}});JX.phtize=function(config){return function(text){if(!(text
in
config)){if(__DEV__){JX.$E('pht("'+text+'"): translation was not configured.');}return text;}return config[text];};};JX.behavior('phabricator-oncopy',function(){var
zws='\u200B';JX.enableDispatch(document.body,'copy');JX.Stratcom.listen(['copy'],null,function(e){var
selection;var
text;if(window.getSelection){selection=window.getSelection();text=selection.toString();}else{selection=document.selection;text=selection.createRange().text;}if(text.indexOf(zws)==-1){return;}var
result=[];var
lines=text.split('\n');var
pos;for(var
ii=0;ii<lines.length;ii++){pos=lines[ii].indexOf(zws);if(pos==-1&&ii!==0){continue;}result.push(lines[ii].substring(pos+1));}result=result.join('\n');var
rawEvent=e.getRawEvent();var
clipboardData='clipboardData'in
rawEvent?rawEvent.clipboardData:window.clipboardData;clipboardData.setData('Text',result);e.prevent();});});JX.install('Tooltip',{statics:{_node:null,_last:null,_lock:0,show:function(root,scale,align,content){var
self=JX.Tooltip;if(self._lock){return;}if(content===null){return;}if(__DEV__){switch(align){case'N':case'E':case'S':case'W':break;default:JX.$E('Only alignments "N" (north), "E" (east), "S" (south), '+'and "W" (west) are supported.');break;}}var
node_inner=JX.$N('div',{className:'jx-tooltip-inner'},[JX.$N('div',{className:'jx-tooltip'},content),JX.$N('div',{className:'jx-tooltip-anchor'})]);var
node=JX.$N('div',{className:'jx-tooltip-container'},node_inner);if(scale=='auto'){node.style.maxWidth='';}else{node.style.maxWidth=scale+'px';}JX.Tooltip.hide();self._node=node;node.style.left='-10000px';document.body.appendChild(node);var
pos=self._getSmartPosition(align,root,node);pos.setPos(node);var
is_recent=false;var
last_tip=self._last;if(last_tip){var
last_tip_age=(new
Date().getTime()-self._last);if(last_tip_age<500){is_recent=true;}}if(!is_recent){JX.DOM.alterClass(node,'jx-tooltip-appear',true);}},_getSmartPosition:function(align,root,node){var
self=JX.Tooltip;var
try_alignments=[align];var
opposites={N:'S',S:'N',E:'W',W:'E'};try_alignments.push(opposites[align]);for(var
k
in
opposites){try_alignments.push(k);}var
use_alignment=null;var
use_pos=null;for(var
ii=0;ii<try_alignments.length;ii++){var
try_alignment=try_alignments[ii];var
pos=self._proposePosition(try_alignment,root,node);if(self.isOnScreen(pos,node)){use_alignment=try_alignment;use_pos=pos;break;}}if(use_alignment===null){use_alignment=align;use_pos=self._proposePosition(use_alignment,root,node);}self._setAnchor(use_alignment);return pos;},_proposePosition:function(align,root,node){var
p=JX.$V(root);var
d=JX.Vector.getDim(root);var
n=JX.Vector.getDim(node);var
l=0;var
t=0;switch(align){case'N':l=parseInt(p.x-((n.x-d.x)/2),10);t=parseInt(p.y-n.y,10);break;case'E':l=parseInt(p.x+d.x,10);t=parseInt(p.y-((n.y-d.y)/2),10);break;case'S':l=parseInt(p.x-((n.x-d.x)/2),10);t=parseInt(p.y+d.y+5,10);break;case'W':l=parseInt(p.x-n.x-5,10);t=parseInt(p.y-((n.y-d.y)/2),10);break;}return new
JX.Vector(l,t);},isOnScreen:function(a,node){var
view=this._getViewBoundaries();var
corners=this._getNodeCornerPositions(a,node);for(var
i=0;i<corners.length;i++){var
corner=corners[i];if(corner.x<view.w||corner.y<view.n||corner.x>view.e||corner.y>view.s){return false;}}return true;},_getNodeCornerPositions:function(pos,node){var
n=JX.Vector.getDim(node);return[new
JX.Vector(pos.x,pos.y),new
JX.Vector(pos.x+n.x,pos.y),new
JX.Vector(pos.x,pos.y+n.y),new
JX.Vector(pos.x+n.x,pos.y+n.y)];},_getViewBoundaries:function(){var
s=JX.Vector.getScroll();var
v=JX.Vector.getViewport();var
max_x=s.x+v.x;var
max_y=s.y+v.y;var
margin=16;return{w:s.x+margin,e:max_x-margin,n:s.y+margin,s:max_y-margin};},_setAnchor:function(align){JX.DOM.alterClass(this._node,'jx-tooltip-align-'+align,true);},hide:function(){if(this._node){JX.DOM.remove(this._node);this._node=null;this._last=new
Date().getTime();}},lock:function(){var
self=JX.Tooltip;self.hide();self._lock++;},unlock:function(){var
self=JX.Tooltip;self._lock--;}}});JX.behavior('phabricator-tooltips',function(){JX.Stratcom.listen(['mouseover','mouseout'],'has-tooltip',function(e){if(e.getType()=='mouseout'){JX.Tooltip.hide();return;}if(e.getIsTouchEvent()){return;}var
data=e.getNodeData('has-tooltip');JX.Tooltip.show(e.getNode('has-tooltip'),data.size||160,data.align||'N',data.tip);});function
wipe(){JX.Tooltip.hide();}JX.Stratcom.listen('keydown',null,wipe);JX.Stratcom.listen('mouseup',null,wipe);JX.Stratcom.listen('unload',null,wipe);});JX.install('Prefab',{statics:{renderSelect:function(map,selected,attrs,order){var
select=JX.$N('select',attrs||{});order=order||JX.keys(map);var
k;for(var
ii=0;ii<order.length;ii++){k=order[ii];select.options[select.options.length]=new
Option(map[k],k);if(k==selected){select.value=k;}}select.value=select.value||order[0];return select;},newTokenizerFromTemplate:function(markup,config){var
template=JX.$H(markup).getFragment().firstChild;var
container=JX.DOM.find(template,'div','tokenizer-container');container.id='';config.root=container;var
build=JX.Prefab.buildTokenizer(config);build.node=template;return build;},buildTokenizer:function(config){config.icons=config.icons||{};var
root;try{root=config.root||JX.$(config.id);}catch(ex){return;}var
datasource;var
ondemand=true;if('ondemand'in
config){ondemand=config.ondemand;}if(ondemand){datasource=new
JX.TypeaheadOnDemandSource(config.src);}else{datasource=new
JX.TypeaheadPreloadedSource(config.src);}datasource.setSortHandler(JX.bind(datasource,JX.Prefab.sortHandler,config));datasource.setTransformer(JX.Prefab.transformDatasourceResults);var
typeahead=new
JX.Typeahead(root,JX.DOM.find(root,'input','tokenizer-input'));typeahead.setDatasource(datasource);var
tokenizer=new
JX.Tokenizer(root);tokenizer.setTypeahead(typeahead);tokenizer.setRenderTokenCallback(function(value,key,container){var
result;if(value&&(typeof
value=='object')&&('id'in
value)){result=value;}else{result=datasource.getResult(key);}var
icon;var
type;var
color;if(result){icon=result.icon;value=result.displayName;type=result.tokenType;color=result.color;}else{icon=(config.icons||{})[key];type=(config.types||{})[key];color=(config.colors||{})[key];}if(icon){icon=JX.Prefab._renderIcon(icon);}type=type||'object';JX.DOM.alterClass(container,'jx-tokenizer-token-'+type,true);if(color){JX.DOM.alterClass(container,color,true);}return[icon,value];});if(config.placeholder){tokenizer.setPlaceholder(config.placeholder);}if(config.limit){tokenizer.setLimit(config.limit);}if(config.value){tokenizer.setInitialValue(config.value);}if(config.browseURI){tokenizer.setBrowseURI(config.browseURI);}if(config.disabled){tokenizer.setDisabled(true);}JX.Stratcom.addData(root,{'tokenizer':tokenizer});return{tokenizer:tokenizer};},sortHandler:function(config,value,list,cmp){var
priority_hits={};var
self_hits={};var
prefix_hits={};var
tokens=this.tokenize(value);var
normal=this.normalize(value);for(var
ii=0;ii<list.length;ii++){var
item=list[ii];if(this.normalize(item.name).indexOf(normal)===0){prefix_hits[item.id]=true;}if(!item.priority){continue;}if(config.username&&item.priority==config.username){self_hits[item.id]=true;}}list.sort(function(u,v){if(self_hits[u.id]!=self_hits[v.id]){return self_hits[v.id]?1:-1;}var
u_open=!u.closed;var
v_open=!v.closed;if(u_open!=v_open){if(u_open){return-1;}else{return 1;}}if(prefix_hits[u.id]!=prefix_hits[v.id]){return prefix_hits[v.id]?1:-1;}if(u.priorityType!=v.priorityType){if(u.priorityType=='user'){return-1;}if(v.priorityType=='user'){return 1;}}var
uf=(u.tokenType=='function');var
vf=(v.tokenType=='function');if(uf!=vf){return uf?1:-1;}return cmp(u,v);});},transformDatasourceResults:function(fields){var
closed=fields[9];var
closed_ui;if(closed){closed_ui=JX.$N('div',{className:'tokenizer-closed'},closed);}var
icon=fields[8];var
icon_ui;if(icon){icon_ui=JX.Prefab._renderIcon(icon);}var
display=JX.$N('div',{className:'tokenizer-result'},[icon_ui,fields[4]||fields[0],closed_ui]);if(closed){JX.DOM.alterClass(display,'tokenizer-result-closed',true);}return{name:fields[0],displayName:fields[4]||fields[0],display:display,uri:fields[1],id:fields[2],priority:fields[3],priorityType:fields[7],imageURI:fields[6],icon:icon,closed:closed,type:fields[5],sprite:fields[10],color:fields[11],tokenType:fields[12],unique:fields[13]||false,autocomplete:fields[14],sort:JX.TypeaheadNormalizer.normalize(fields[0])};},_renderIcon:function(icon){return JX.$N('span',{className:'phui-icon-view phui-font-fa '+icon});}}});JX.install('Device',{statics:{_device:null,_tabletBreakpoint:920,setTabletBreakpoint:function(width){var
self=JX.Device;self._tabletBreakpoint=width;self.recalculate();},getTabletBreakpoint:function(){return JX.Device._tabletBreakpoint;},recalculate:function(){var
v=JX.Vector.getViewport();var
self=JX.Device;var
screen_width=(window.screen&&window.screen.availWidth);if(screen_width){v.x=Math.min(v.x,screen_width);}var
device='desktop';if(v.x<=self._tabletBreakpoint){device='tablet';}if(v.x<=480){device='phone';}if(device==self._device){return;}self._device=device;var
e=document.body;JX.DOM.alterClass(e,'device-phone',(device=='phone'));JX.DOM.alterClass(e,'device-tablet',(device=='tablet'));JX.DOM.alterClass(e,'device-desktop',(device=='desktop'));JX.DOM.alterClass(e,'device',(device!='desktop'));JX.Stratcom.invoke('phabricator-device-change',null,device);},isDesktop:function(){var
self=JX.Device;return(self.getDevice()=='desktop');},getDevice:function(){var
self=JX.Device;if(self._device===null){self.recalculate();}return self._device;}}});JX.behavior('device',function(){JX.Stratcom.listen('resize',null,JX.Device.recalculate);JX.Device.recalculate();});JX.behavior('toggle-class',function(config,statics){function
install(){JX.Stratcom.listen(['touchstart','mousedown'],'jx-toggle-class',function(e){e.kill();var
t=e.getNodeData('jx-toggle-class');t.state=!t.state;for(var
k
in
t.map){JX.DOM.alterClass(JX.$(k),t.map[k],t.state);}});JX.Stratcom.listen(['click'],'jx-toggle-class',function(e){e.kill();});return true;}statics.install=statics.install||install();});JX.behavior('lightbox-attachments',function(){var
lightbox=null;var
prev=null;var
next=null;var
shown=false;function
_toggleComment(e){e.kill();shown=!shown;JX.DOM.alterClass(lightbox,'comment-panel-open',shown);}function
markCommentsLoading(loading){var
frame=JX.$('lightbox-comment-frame');JX.DOM.alterClass(frame,'loading',loading);}function
onLoadCommentsResponse(r){var
frame=JX.$('lightbox-comment-frame');JX.DOM.setContent(frame,JX.$H(r));markCommentsLoading(false);}function
loadComments(phid){markCommentsLoading(true);var
uri='/file/thread/'+phid+'/';new
JX.Workflow(uri).setHandler(onLoadCommentsResponse).start();}function
loadLightBox(e){if(!e.isNormalClick()){return;}if(e.getNode('tag:a')&&!e.getNode('tag:img')){return;}e.kill();activateLightbox(e.getNode('lightboxable'));}function
activateLightbox(target){var
mainFrame=JX.$('main-page-frame');var
links=JX.DOM.scry(mainFrame,'*','lightboxable');var
phids={};var
data;for(var
i=0;i<links.length;i++){data=JX.Stratcom.getData(links[i]);phids[data.phid]=links[i];}var
target_data=JX.Stratcom.getData(target);var
total=JX.keys(phids).length;var
current=1;var
past_target=false;for(var
phid
in
phids){if(past_target){next=phids[phid];break;}else
if(phid==target_data.phid){past_target=true;}else{prev=phids[phid];current++;}}var
img_uri='';var
img='';var
extra_status='';if(target_data.viewable){img_uri=target_data.uri;var
alt_name='';if(typeof
target_data.name!='undefined'){alt_name=target_data.name;}img=JX.$N('img',{className:'loading',alt:alt_name});}else{var
imgIcon=new
JX.PHUIXIconView().setIcon(target_data.icon+' phui-lightbox-file-icon').getNode();var
nameElement=JX.$N('div',{className:'attachment-name'},target_data.name);img=JX.$N('a',{className:'lightbox-icon-frame',sigil:'lightbox-download-submit',href:target_data.dUri,},[imgIcon,nameElement]);}var
imgFrame=JX.$N('div',{className:'lightbox-image-frame',sigil:'lightbox-image-frame',},img);var
commentFrame=JX.$N('div',{className:'lightbox-comment-frame',id:'lightbox-comment-frame'});var
commentClass=(shown)?'comment-panel-open':'';lightbox=JX.$N('div',{className:'lightbox-attachment '+commentClass,sigil:'lightbox-attachment'},[imgFrame,commentFrame]);var
monogram=JX.$N('strong',{},target_data.monogram);var
m_url=JX.$N('a',{href:'/'+target_data.monogram},monogram);var
statusSpan=JX.$N('span',{className:'lightbox-status-txt'},[m_url,current+' / '+total]);var
download_icon=new
JX.PHUIXIconView().setIcon('fa-download phui-icon-circle-icon').getNode();var
download_button=JX.$N('a',{className:'lightbox-download phui-icon-circle hover-sky',href:target_data.dUri},download_icon);var
commentIcon=new
JX.PHUIXIconView().setIcon('fa-comments phui-icon-circle-icon').getNode();var
commentButton=JX.$N('a',{className:'lightbox-comment phui-icon-circle hover-sky',href:'#',sigil:'lightbox-comment'},commentIcon);var
closeIcon=new
JX.PHUIXIconView().setIcon('fa-times phui-icon-circle-icon').getNode();var
closeButton=JX.$N('a',{className:'lightbox-close phui-icon-circle hover-red',href:'#'},closeIcon);var
statusHTML=JX.$N('div',{className:'lightbox-status'},[statusSpan,closeButton,commentButton,download_button]);JX.DOM.appendContent(lightbox,statusHTML);JX.DOM.listen(closeButton,'click',null,closeLightBox);var
leftIcon='';if(next){var
r_icon=new
JX.PHUIXIconView().setIcon('fa-angle-right').setColor('lightgreytext').getNode();leftIcon=JX.$N('a',{className:'lightbox-right',href:'#'},r_icon);JX.DOM.listen(leftIcon,'click',null,JX.bind(null,loadAnotherLightBox,next));}JX.DOM.appendContent(lightbox,leftIcon);var
rightIcon='';if(prev){var
l_icon=new
JX.PHUIXIconView().setIcon('fa-angle-left').setColor('lightgreytext').getNode();rightIcon=JX.$N('a',{className:'lightbox-left',href:'#'},l_icon);JX.DOM.listen(rightIcon,'click',null,JX.bind(null,loadAnotherLightBox,prev));}JX.DOM.appendContent(lightbox,rightIcon);JX.DOM.alterClass(document.body,'lightbox-attached',true);JX.Mask.show('jx-dark-mask');document.body.appendChild(lightbox);if(img_uri){JX.Busy.start();img.onload=function(){JX.DOM.alterClass(img,'loading',false);JX.Busy.done();};img.src=img_uri;}loadComments(target_data.phid);}function
lightBoxHandleKeyDown(e){if(!lightbox){return;}var
raw=e.getRawEvent();if(raw.altKey||raw.ctrlKey||raw.metaKey){return;}if(JX.Stratcom.pass()){return;}var
handler=JX.bag;switch(e.getSpecialKey()){case'esc':handler=closeLightBox;break;case'right':if(next){handler=JX.bind(null,loadAnotherLightBox,next);}break;case'left':if(prev){handler=JX.bind(null,loadAnotherLightBox,prev);}break;}return handler(e);}function
closeLightBox(e){if(!lightbox){return;}e.prevent();JX.DOM.remove(lightbox);JX.Mask.hide();JX.DOM.alterClass(document.body,'lightbox-attached',false);lightbox=null;prev=null;next=null;}function
loadAnotherLightBox(el,e){if(!el){return;}e.prevent();closeLightBox(e);activateLightbox(el);}JX.DOM.listen(JX.$('main-page-frame'),'click',['lightboxable'],loadLightBox);JX.Stratcom.listen('keydown',null,lightBoxHandleKeyDown);JX.Stratcom.listen('click','lightbox-image-frame',function(e){if(!lightbox){return;}if(e.getTarget()!=e.getNode('lightbox-image-frame')){return;}closeLightBox(e);e.kill();});JX.Stratcom.listen('click','lightbox-comment',_toggleComment);var
_sendMessage=function(e){e.kill();var
form=e.getNode('tag:form');JX.Workflow.newFromForm(form).setHandler(onLoadCommentsResponse).start();};JX.Stratcom.listen(['submit','didSyntheticSubmit'],'lightbox-comment-form',_sendMessage);var
_startPageDownload=function(e){e.kill();var
form=e.getNode('tag:form');form.submit();};JX.Stratcom.listen('click','embed-download-form',_startPageDownload);});JX.install('Busy',{statics:{_depth:0,start:function(){var
self=JX.Busy;if(!self._depth){var
icon=JX.$N('span',{className:'phui-icon-view phui-font-fa fa-gear ph-spin'});self._indicator=JX.$N('div',{className:'busy'},icon);self._indicator.style.opacity=0;JX.$('phabricator-standard-page').appendChild(self._indicator);new
JX.FX(self._indicator).setDuration(1000).start({opacity:[0,0.8]});}self._depth++;},done:function(){var
self=JX.Busy;--self._depth;if(!self._depth){JX.DOM.remove(self._indicator);self._indicator=null;}}}});JX.install('Sound',{statics:{_sounds:{},load:function(uri){var
self=JX.Sound;if(!(uri
in
self._sounds)){self._sounds[uri]=JX.$N('audio',{src:uri,preload:'auto'});}},play:function(uri){var
self=JX.Sound;self.load(uri);var
sound=self._sounds[uri];try{sound.play();}catch(ex){JX.log(ex);}}}});JX.install('Aphlict',{construct:function(uri,subscriptions){if(__DEV__){if(JX.Aphlict._instance){JX.$E('Aphlict object is a singleton.');}}this._uri=uri;this._subscriptions=subscriptions;this._setStatus('setup');this._startTime=new
Date().getTime();JX.Aphlict._instance=this;},events:['didChangeStatus'],members:{_uri:null,_socket:null,_subscriptions:null,_status:null,_isReconnect:false,_keepaliveInterval:false,_startTime:null,start:function(){JX.Leader.listen('onBecomeLeader',JX.bind(this,this._lead));JX.Leader.listen('onReceiveBroadcast',JX.bind(this,this._receive));JX.Leader.start();JX.Leader.call(JX.bind(this,this._begin));},getSubscriptions:function(){return this._subscriptions;},setSubscriptions:function(subscriptions){this._subscriptions=subscriptions;JX.Leader.broadcast(null,{type:'aphlict.subscribe',data:this._subscriptions});},clearSubscriptions:function(subscriptions){this._subscriptions=null;JX.Leader.broadcast(null,{type:'aphlict.unsubscribe',data:subscriptions});},getStatus:function(){return this._status;},getWebsocket:function(){return this._socket;},_begin:function(){JX.Leader.broadcast(null,{type:'aphlict.getstatus'});JX.Leader.broadcast(null,{type:'aphlict.subscribe',data:this._subscriptions});},_lead:function(){this._socket=new
JX.WebSocket(this._uri);this._socket.setOpenHandler(JX.bind(this,this._open));this._socket.setMessageHandler(JX.bind(this,this._message));this._socket.setCloseHandler(JX.bind(this,this._close));this._socket.open();},_open:function(){if(this._isReconnect){setTimeout(JX.bind(this,this._didReconnect),100);}this._broadcastStatus('open');JX.Leader.broadcast(null,{type:'aphlict.getsubscribers'});var
keepalive=JX.bind(this,this._keepalive);this._keepaliveInterval=setInterval(keepalive,15000);},_didReconnect:function(){this.replay();this.reconnect();},replay:function(){var
age=60000;var
extra_time=500;var
now=new
Date().getTime();age=Math.min(extra_time+(now-this._startTime),age);var
replay={age:age};JX.Leader.broadcast(null,{type:'aphlict.replay',data:replay});},reconnect:function(){JX.Leader.broadcast(null,{type:'aphlict.reconnect',data:null});},_close:function(){if(this._keepaliveInterval){clearInterval(this._keepaliveInterval);this._keepaliveInterval=null;}this._broadcastStatus('closed');},_broadcastStatus:function(status){JX.Leader.broadcast(null,{type:'aphlict.status',data:status});},_message:function(raw){var
message=JX.JSON.parse(raw);var
id=message.uniqueID||null;if(message.type=='pong'){return;}JX.Leader.broadcast(id,{type:'aphlict.server',data:message});},_receive:function(message,is_leader){switch(message.type){case'aphlict.status':this._setStatus(message.data);break;case'aphlict.getstatus':if(is_leader){this._broadcastStatus(this.getStatus());}break;case'aphlict.getsubscribers':JX.Leader.broadcast(null,{type:'aphlict.subscribe',data:this._subscriptions});break;case'aphlict.subscribe':if(is_leader){this._writeCommand('subscribe',message.data);}break;case'aphlict.replay':if(is_leader){this._writeCommand('replay',message.data);}break;default:var
handler=this.getHandler();handler&&handler(message);break;}},_setStatus:function(status){this._status=status;if(status=='open'){this._isReconnect=true;}this.invoke('didChangeStatus');},_write:function(message){this._socket.send(JX.JSON.stringify(message));},_writeCommand:function(command,message){var
frame={command:command,data:message};return this._write(frame);},_keepalive:function(){this._writeCommand('ping',null);}},properties:{handler:null},statics:{_instance:null,getInstance:function(){var
self=JX.Aphlict;if(!self._instance){return null;}return self._instance;}}});JX.install('Notification',{events:['activate','close'],members:{_container:null,_visible:false,_hideTimer:null,_duration:12000,_asDesktop:false,_asWeb:true,_key:null,_title:null,_body:null,_href:null,_icon:null,show:function(){var
self=JX.Notification;if(!this._visible){this._visible=true;self._show(this);this._updateTimer();}if(self.supportsDesktopNotifications()&&self.desktopNotificationsEnabled()&&this._asDesktop){var
n=new
window.Notification(this._title,{icon:this._icon,body:this._body,tag:this._key,});n.onclick=JX.bind(n,function(href){this.close();window.focus();if(href){JX.$U(href).go();}},this._href);setTimeout(n.close.bind(n),this._duration);}return this;},hide:function(){if(this._visible){this._visible=false;var
self=JX.Notification;self._hide(this);this._updateTimer();}return this;},alterClassName:function(name,enable){JX.DOM.alterClass(this._getContainer(),name,enable);return this;},setContent:function(content){JX.DOM.setContent(this._getContainer(),content);return this;},setShowAsWebNotification:function(mode){this._asWeb=mode;return this;},setShowAsDesktopNotification:function(mode){this._asDesktop=mode;return this;},setTitle:function(title){this._title=title;return this;},setBody:function(body){this._body=body;return this;},setHref:function(href){this._href=href;return this;},setKey:function(key){this._key=key;return this;},setIcon:function(icon){this._icon=icon;return this;},setDuration:function(milliseconds){this._duration=milliseconds;this._updateTimer(false);return this;},_updateTimer:function(){if(this._hideTimer){clearTimeout(this._hideTimer);this._hideTimer=null;}if(this._visible&&this._duration){this._hideTimer=setTimeout(JX.bind(this,this.hide),this._duration);}},_getContainer:function(){if(!this._container){this._container=JX.$N('div',{className:'jx-notification',sigil:'jx-notification'});}return this._container;}},statics:{supportsDesktopNotifications:function(){return'Notification'in
window;},desktopNotificationsEnabled:function(){return window.Notification.permission==='granted';},_container:null,_listening:false,_active:[],_show:function(notification){var
self=JX.Notification;self._installListener();self._active.push(notification);self._redraw();},_hide:function(notification){var
self=JX.Notification;for(var
ii=0;ii<self._active.length;ii++){if(self._active[ii]===notification){notification.invoke('close');self._active.splice(ii,1);break;}}self._redraw();},_installListener:function(){var
self=JX.Notification;if(self._listening){return;}else{self._listening=true;}JX.Stratcom.listen('click','jx-notification',function(e){var
target=e.getNode('jx-notification');for(var
ii=0;ii<self._active.length;ii++){var
n=self._active[ii];if(n._getContainer()===target){var
activation=n.invoke('activate');if(!activation.getPrevented()){n.hide();}return;}}});},_redraw:function(){var
self=JX.Notification;if(!self._active.length){if(self._container){JX.DOM.remove(self._container);self._container=null;}return;}if(!self._container){self._container=JX.$N('div',{className:'jx-notification-container'});document.body.appendChild(self._container);}var
limit=5;var
notifications=[];for(var
ii=0;ii<self._active.length;ii++){if(!self._active[ii]._asWeb){continue;}notifications.push(self._active[ii]._getContainer());if(!(--limit)){break;}}JX.DOM.setContent(self._container,notifications);}}});JX.behavior('aphlict-listen',function(config){var
page_objects=config.pageObjects;var
reload_notification=null;JX.Stratcom.listen('aphlict-server-message',null,function(e){var
message=e.getData();if(message.type!='notification'){return;}JX.Leader.callIfLeader(function(){var
request=new
JX.Request('/notification/individual/',onNotification);var
routable=request.addData({key:message.key}).getRoutable();routable.setType('notification').setPriority(250);JX.Router.getInstance().queue(routable);});});function
onAphlictMessage(message){switch(message.type){case'aphlict.server':JX.Stratcom.invoke('aphlict-server-message',null,message.data);break;case'notification.individual':JX.Stratcom.invoke('aphlict-notification-message',null,message.data);break;case'aphlict.reconnect':JX.Stratcom.invoke('aphlict-reconnect',null,message.data);break;}}function
onNotification(response){if(!response.pertinent){return;}JX.Leader.broadcast(response.uniqueID,{type:'notification.individual',data:response});}JX.Stratcom.listen('aphlict-notification-message',null,function(e){JX.Stratcom.invoke('notification-panel-update',null,{});var
response=e.getData();if(!response.showAnyNotification&&!response.showDesktopNotification){return;}new
JX.Notification().setContent(JX.$H(response.content)).setKey(response.primaryObjectPHID).setShowAsWebNotification(response.showAnyNotification).setShowAsDesktopNotification(response.showDesktopNotification).setTitle(response.title).setBody(response.body).setHref(response.href).setIcon(response.icon).show();if((response.primaryObjectPHID
in
page_objects)&&reload_notification===null){var
reload=new
JX.Notification().setContent('Page updated, click to reload.').alterClassName('jx-notification-alert',true).setDuration(0);reload.listen('activate',function(){if(response.primaryObjectPHID
in
page_objects){JX.$U().go();}});reload.show();reload_notification={dialog:reload,phid:response.primaryObjectPHID};}});var
client=new
JX.Aphlict(config.websocketURI,config.subscriptions);var
start_client=function(){client.setHandler(onAphlictMessage).start();};setTimeout(start_client,0);JX.Stratcom.listen('quicksand-redraw',null,function(e){var
old_data=e.getData().oldResponse;var
new_data=e.getData().newResponse;client.clearSubscriptions(old_data.subscriptions);client.setSubscriptions(new_data.subscriptions);page_objects=new_data.pageObjects;if(reload_notification){if(reload_notification.phid
in
page_objects){return;}reload_notification.dialog.hide();reload_notification=null;}});JX.Leader.listen('onReceiveBroadcast',function(message,is_leader){if(message.type!=='sound'){return;}if(!is_leader){return;}JX.Sound.play(message.data);});});JX.behavior('phabricator-search-typeahead',function(config){var
datasource=new
JX.TypeaheadOnDemandSource(config.src);function
transform(object){object=JX.Prefab.transformDatasourceResults(object);var
attr={className:'phabricator-main-search-typeahead-result'};if(object.imageURI){attr.style={backgroundImage:'url('+object.imageURI+')'};}var
icon=null;if(object.icon){icon=new
JX.PHUIXIconView().setIcon(object.icon).setColor('lightgreytext').getNode();icon=[icon,' '];}var
render=JX.$N('span',attr,[JX.$N('span',{className:object.sprite}),JX.$N('span',{className:'result-name'},object.displayName),icon,JX.$N('span',{className:'result-type'},object.type)]);if(object.closed){JX.DOM.alterClass(render,'result-closed',true);}object.display=render;return object;}datasource.setTransformer(transform);var
sort_handler=function(value,list,cmp){JX.bind(this,JX.Prefab.sortHandler,{},value,list,cmp)();var
ii;var
type_order=['jump','apps','proj','user','repo','wiki','symb','misc'];var
type_map={};for(ii=0;ii<type_order.length;ii++){type_map[type_order[ii]]=true;}var
buckets={};for(ii=0;ii<list.length;ii++){var
item=list[ii];var
type=item.priorityType;if(!type_map.hasOwnProperty(type)){type='misc';}if(!buckets.hasOwnProperty(type)){buckets[type]=[];}buckets[type].push(item);}var
jj;var
results=[];for(ii=0;ii<type_order.length;ii++){var
current_type=type_order[ii];var
type_list=buckets[current_type]||[];for(jj=0;jj<type_list.length;jj++){var
skip=((current_type=='jump')&&(jj>=1))||((list.length>config.limit)&&(jj>=3));if(skip){continue;}results.push(type_list[jj]);}}list.splice.apply(list,[0,list.length].concat(results));};datasource.setSortHandler(JX.bind(datasource,sort_handler));datasource.setMaximumResultCount(config.limit);var
typeahead=new
JX.Typeahead(JX.$(config.id),JX.$(config.input));typeahead.setDatasource(datasource);typeahead.setPlaceholder(config.placeholder);typeahead.listen('choose',function(r){JX.$U(r.href).go();JX.Stratcom.context().kill();});typeahead.start();JX.DOM.listen(JX.$(config.button),'click',null,function(){typeahead.setPlaceholder('');typeahead.updatePlaceHolder();});JX.Stratcom.listen('quicksand-redraw',null,function(e){var
r=e.getData().newResponse;updateCurrentApplication(r.applicationClass,r.applicationSearchIcon);});var
current_app_icon;function
updateCurrentApplication(app_class,app_icon){current_app_icon=app_icon||config.defaultApplicationIcon;var
button=JX.$(config.selectorID);var
data=JX.Stratcom.getData(button);if(data.value==config.appScope){updateIcon(button,data,current_app_icon);}JX.$(config.applicationID).value=app_class;}function
updateIcon(button,data,new_icon){var
icon=JX.DOM.find(button,'span','global-search-dropdown-icon');JX.DOM.alterClass(icon,data.icon,false);data.icon=new_icon;JX.DOM.alterClass(icon,data.icon,true);}JX.Stratcom.listen('click','global-search-dropdown',function(e){var
data=e.getNodeData('global-search-dropdown');var
button=e.getNode('global-search-dropdown');if(data.menu){return;}e.kill();function
updateValue(spec){if(data.value==spec.value){return;}updateIcon(button,data,spec.icon);data.value=spec.value;var
frame=button.parentNode;var
input=JX.DOM.find(frame,'input','global-search-dropdown-input');input.value=data.value;new
JX.Request(config.scopeUpdateURI).setData({value:data.value}).send();}var
menu=new
JX.PHUIXDropdownMenu(button).setAlign('left');data.menu=menu;menu.listen('open',function(){var
list=new
JX.PHUIXActionListView();for(var
ii=0;ii<data.items.length;ii++){var
spec=data.items[ii];if(spec.value==config.appScope){if(current_app_icon!==undefined){spec.icon=current_app_icon;}}var
item=new
JX.PHUIXActionView().setName(spec.name).setIcon(spec.icon);if(spec.value){if(spec.value==data.value){item.setSelected(true);}var
handler=function(spec,e){e.prevent();menu.close();updateValue(spec);};item.setHandler(JX.bind(null,handler,spec));}else
if(spec.href){item.setHref(spec.href);item.setHandler(function(){menu.close();});}else{item.setLabel(true);}list.addItem(item);}menu.setContent(list.getNode());});menu.open();});});JX.behavior('aphlict-dropdown',function(config,statics){statics.visible=statics.visible||null;var
dropdown=JX.$(config.dropdownID);var
bubble=JX.$(config.bubbleID);var
icon=JX.DOM.scry(bubble,'span','menu-icon')[0];var
favicon=config.favicon;var
message_favicon=config.message_favicon;var
count;if(config.countID){count=JX.$(config.countID);}var
request=null;var
dirty=config.local?false:true;function
_updateFavicon(new_count){if((config.countType=='messages')&&(new_count)){JX.Favicon.setFavicon(message_favicon);}else
if(config.countType=='messages'){JX.Favicon.setFavicon(favicon);}}if(config.countType){JX.Title.setCount(config.countType,config.countNumber);_updateFavicon(config.countNumber);}function
_updateCount(number){if(config.countType){JX.Title.setCount(config.countType,number);_updateFavicon(number);}else{return;}JX.DOM.setContent(count,number);if(number===0){JX.DOM.alterClass(bubble,config.unreadClass,false);}else{JX.DOM.alterClass(bubble,config.unreadClass,true);}}function
refresh(){if(dirty){JX.DOM.setContent(dropdown,config.loadingText);JX.DOM.alterClass(dropdown,'phabricator-notification-menu-loading',true);}if(request){return;}request=new
JX.Request(config.uri,function(response){var
number=response.number;_updateCount(number);dirty=false;JX.DOM.alterClass(dropdown,'phabricator-notification-menu-loading',false);JX.DOM.setContent(dropdown,JX.$H(response.content));request=null;});request.send();}JX.Stratcom.listen('quicksand-redraw',null,function(e){var
data=e.getData();if(!data.fromServer){return;}var
new_data=data.newResponse.aphlictDropdownData;update_counts(new_data);});JX.Stratcom.listen('conpherence-redraw-aphlict',null,function(e){update_counts(e.getData());});function
update_counts(new_data){var
updated=false;for(var
ii=0;ii<new_data.length;ii++){if(new_data[ii].countType!=config.countType){continue;}if(!new_data[ii].isInstalled){continue;}updated=true;_updateCount(parseInt(new_data[ii].count));}if(updated){dirty=true;}}function
set_visible(menu,icon){if(menu){statics.visible={menu:menu,icon:icon};if(icon){JX.DOM.alterClass(icon,'menu-icon-selected',true);}}else{if(statics.visible){JX.DOM.hide(statics.visible.menu);if(statics.visible.icon){JX.DOM.alterClass(statics.visible.icon,'menu-icon-selected',false);}}statics.visible=null;}}JX.Stratcom.listen('click',null,function(e){if(!e.getNode('phabricator-notification-menu')){set_visible(null);return;}if(e.getNode('tag:a')){set_visible(null);return;}if(!e.getNode('notification')){return;}var
href=e.getNodeData('notification').href;if(href){JX.$U(href).go();e.kill();set_visible(null);}});JX.DOM.listen(bubble,'click',null,function(e){if(!e.isNormalClick()){return;}if(config.desktop&&JX.Device.getDevice()!='desktop'){return;}e.kill();if(statics.visible){var
previously_visible=statics.visible;set_visible(null);if(previously_visible.menu===dropdown){return;}}if(dirty){refresh();}var
p=JX.$V(bubble);JX.DOM.show(dropdown);p.y=null;if(config.containerDivID){var
pc=JX.$V(JX.$(config.containerDivID));p.x-=(JX.Vector.getDim(dropdown).x-JX.Vector.getDim(bubble).x+pc.x);}else
if(config.right){p.x-=(JX.Vector.getDim(dropdown).x-JX.Vector.getDim(bubble).x);}else{p.x-=6;}p.setPos(dropdown);set_visible(dropdown,icon);});JX.Stratcom.listen('notification-panel-update',null,function(){if(config.local){return;}dirty=true;refresh();});JX.Stratcom.listen('notification-panel-close',null,function(){set_visible(null);});});JX.behavior('history-install',function(){JX.History.install();});JX.behavior('phabricator-gesture',function(){var
target=null;var
swiping=false;var
p0;var
p1;JX.Stratcom.listen(['touchstart','touchcancel','mousedown'],'touchable',function(e){if(JX.Device.getDevice()=='desktop'){return;}if(JX.Stratcom.pass()){return;}if(target){try{JX.DOM.invoke(target,'gesture.swipe.cancel',get_swipe_data());}finally{stop_swipe();}return;}target=e.getNode('touchable');p0=JX.Vector.getPos(e);p1=JX.Vector.getPos(e);});JX.enableDispatch(document.body,'mousemove');JX.Stratcom.listen(['touchmove','mousemove'],null,function(e){if(!target){return;}p1=JX.Vector.getPos(e);if(!swiping){var
dx=(p1.x-p0.x);var
dy=(p1.y-p0.y);var
swipe_radius=20;if((dx*dx)+(dy*dy)>=(swipe_radius*swipe_radius)){if(dy*dy>=dx*dx){stop_swipe();return;}swiping=true;JX.DOM.invoke(target,'gesture.swipe.start',get_swipe_data());}}if(swiping){if(!e.getNode('touchable')){p1=JX.$V(p0);}JX.DOM.invoke(target,'gesture.swipe.move',get_swipe_data());e.prevent();}});JX.Stratcom.listen(['touchend','mouseup'],null,function(){if(!target){return;}try{if(swiping){JX.DOM.invoke(target,'gesture.swipe.end',get_swipe_data());}}finally{stop_swipe();}});function
get_swipe_data(){var
direction=(p1.x>p0.x)?'right':'left';var
length=Math.abs(p1.x-p0.x);return{p0:p0,p1:p1,direction:direction,length:length};}function
stop_swipe(){target=null;swiping=false;}});JX.behavior('phabricator-active-nav',function(config){var
local=JX.$(config.localID);var
selectnav=function(anchor){var
links=JX.DOM.scry(local,'a');var
link;var
link_anchor;var
selected;for(var
ii=0;ii<links.length;ii++){link=links[ii];link_anchor=JX.$U(link.href).getFragment();selected=(link_anchor==anchor);JX.DOM.alterClass(link,'phabricator-active-nav-focus',selected);}};var
updateposition=function(){var
scroll_position=JX.Vector.getScroll().y;var
document_size=JX.Vector.getDocument();var
viewport_size=JX.Vector.getViewport();var
is_at_bottom=(viewport_size.y+scroll_position>=document_size.y);var
markers=JX.DOM.scry(document.body,'legend','marker');var
markinfo=[];var
ii;for(ii=0;ii<markers.length;ii++){markinfo.push({marker:markers[ii],position:JX.$V(markers[ii]).y-15});}markinfo.sort(function(u,v){return(v.position-u.position);});var
active=null;for(ii=0;ii<markinfo.length;ii++){active=markinfo[ii].marker;if(markinfo[ii].position<=scroll_position){break;}if(is_at_bottom){break;}}selectnav(active&&JX.Stratcom.getData(active).anchor);};var
pending=null;var
onviewportchange=function(){pending&&clearTimeout(pending);pending=setTimeout(updateposition,100);};JX.Stratcom.listen('scroll',null,onviewportchange);JX.Stratcom.listen('resize',null,onviewportchange);JX.Stratcom.listen('hashchange',null,onviewportchange);});JX.behavior('phabricator-nav',function(config){var
content=JX.$(config.contentID);var
local=JX.$(config.localID);var
main=JX.$(config.mainID);var
drag=JX.$(config.dragID);var
dragging;var
track;JX.enableDispatch(document.body,'mousemove');JX.DOM.listen(drag,'mousedown',null,function(e){if(!e.isNormalMouseEvent()){return;}dragging=JX.$V(e);JX.DOM.alterClass(document.body,'jx-drag-col',true);track=[{element:local,parameter:'width',start:JX.Vector.getDim(local).x,width:JX.Vector.getDim(local).x,minWidth:1},{element:drag,parameter:'left',start:get_width()},{element:content,parameter:'marginLeft',start:parseInt(getComputedStyle(content).marginLeft,10),width:JX.Vector.getDim(content).x,minWidth:300,minScale:-1}];e.kill();});JX.Stratcom.listen('mousemove',null,function(e){if(!dragging){return;}var
dx=JX.$V(e).x-dragging.x;var
panel;var
k;for(k=0;k<track.length;k++){panel=track[k];if(!panel.minWidth){continue;}var
new_width=panel.width+(dx*(panel.minScale||1));if(new_width<panel.minWidth){dx=(panel.minWidth-panel.width)*panel.minScale;}}for(k=0;k<track.length;k++){panel=track[k];var
v=(panel.start+(dx*(panel.scale||1)));panel.element.style[panel.parameter]=v+'px';}});JX.Stratcom.listen('mouseup',null,function(){if(!dragging){return;}JX.DOM.alterClass(document.body,'jx-drag-col',false);dragging=false;new
JX.Request('/settings/adjust/',JX.bag).setData({key:'filetree.width',value:get_width()}).send();});function
get_width(){return(JX.$V(drag).x-JX.Vector.getScroll().x);}var
saved_width=config.width;function
savedrag(){saved_width=get_width();local.style.width='';drag.style.left='';content.style.marginLeft='';}function
restoredrag(){if(!saved_width){return;}local.style.width=saved_width+'px';drag.style.left=saved_width+'px';content.style.marginLeft=(saved_width+JX.Vector.getDim(drag).x)+'px';}var
collapsed=config.collapsed;JX.Stratcom.listen('differential-filetree-toggle',null,function(){collapsed=!collapsed;if(collapsed){savedrag();}JX.DOM.alterClass(main,'has-local-nav',!collapsed);JX.DOM.alterClass(main,'has-drag-nav',!collapsed);JX.DOM.alterClass(main,'has-closed-nav',collapsed);if(!collapsed){restoredrag();}new
JX.Request('/settings/adjust/',JX.bag).setData({key:'nav-collapsed',value:(collapsed?1:0)}).send();JX.Stratcom.invoke('resize');});function
onresize(){if(JX.Device.getDevice()!='desktop'){return;}var
banner_height=0;try{var
banner=JX.$('diff-banner');banner_height=JX.Vector.getDim(banner).y;}catch(error){}local.style.top=Math.max(0,banner_height,JX.$V(content).y-Math.max(0,JX.Vector.getScroll().y))+'px';}local.style.position='fixed';local.style.bottom=0;local.style.left=0;JX.Stratcom.listen(['scroll','resize'],null,onresize);onresize();JX.Stratcom.listen('phabricator-device-change',null,function(){resetdrag();onresize();});});JX.behavior('phabricator-remarkup-assist',function(config){var
pht=JX.phtize(config.pht);var
root=JX.$(config.rootID);var
area=JX.DOM.find(root,'textarea');var
edit_mode='normal';var
edit_root=null;var
preview=null;var
pinned=false;var
pinned_spacer=JX.$N('div',{className:'remarkup-assist-pinned-spacer'});function
set_edit_mode(root,mode){if(mode==edit_mode){return;}if(edit_root){if(edit_mode=='fullscreen'){JX.DOM.alterClass(edit_root,'remarkup-control-fullscreen-mode',false);JX.DOM.alterClass(document.body,'remarkup-fullscreen-mode',false);JX.Mask.hide('jx-light-mask');}area.style.height='';if(preview){JX.DOM.show(area);resize_preview();JX.DOM.hide(area);}}edit_root=root;edit_mode=mode;if(mode=='fullscreen'){JX.DOM.alterClass(edit_root,'remarkup-control-fullscreen-mode',true);JX.DOM.alterClass(document.body,'remarkup-fullscreen-mode',true);JX.Mask.show('jx-light-mask');if(preview){JX.DOM.show(area);}resizearea();if(preview){resize_preview();JX.DOM.hide(area);}}JX.DOM.focus(area);}function
set_pinned_mode(root,mode){if(mode===pinned){return;}pinned=mode;var
container=get_pinned_container(root);JX.DOM.alterClass(container,'remarkup-assist-pinned',pinned);if(pinned){JX.DOM.appendContent(document.body,pinned_spacer);}else{JX.DOM.remove(pinned_spacer);}resizearea();JX.DOM.focus(area);}function
get_pinned_container(root){return JX.DOM.findAbove(root,'div','phui-comment-form');}function
resizearea(){if(pinned){var
container=get_pinned_container(root);var
d=JX.Vector.getDim(container);d.x=null;d.setDim(pinned_spacer);}if(!edit_root){return;}if(edit_mode!='fullscreen'){return;}var
v=JX.Vector.getViewport();v.x=null;v.y-=26;v.setDim(area);}JX.Stratcom.listen('resize',null,resizearea);JX.Stratcom.listen('keydown',null,function(e){if(e.getSpecialKey()!='esc'){return;}if(edit_mode!='fullscreen'){return;}e.kill();set_edit_mode(edit_root,'normal');set_pinned_mode(root,false);});function
update(area,l,m,r){JX.TextAreaUtils.setSelectionText(area,l+m+r,true);var
range=JX.TextAreaUtils.getSelectionRange(area);JX.TextAreaUtils.setSelectionRange(area,range.start+l.length,range.start+l.length+m.length);}function
prepend_char_to_lines(ch,sel,def){if(sel){sel=sel.split('\n');}else{sel=[def];}if(ch==='>'){for(var
i=0;i<sel.length;i++){if(sel[i][0]==='>'){ch='>';}else{ch='> ';}sel[i]=ch+sel[i];}return sel.join('\n');}return sel.join('\n'+ch);}function
assist(area,action,root,button){var
sel=JX.TextAreaUtils.getSelectionText(area);var
r=JX.TextAreaUtils.getSelectionRange(area);var
ch;switch(action){case'fa-bold':update(area,'**',sel||pht('bold text'),'**');break;case'fa-italic':update(area,'//',sel||pht('italic text'),'//');break;case'fa-link':var
name=pht('name');if(/^https?:/i.test(sel)){update(area,'[[ '+sel+' | ',name,' ]]');}else{update(area,'[[ ',pht('URL'),' | '+(sel||name)+' ]]');}break;case'fa-text-width':update(area,'`',sel||pht('monospaced text'),'`');break;case'fa-list-ul':case'fa-list-ol':ch=(action=='fa-list-ol')?'  # ':'  - ';sel=prepend_char_to_lines(ch,sel,pht('List Item'));update(area,((r.start===0)?'':'\n\n')+ch,sel,'\n\n');break;case'fa-code':sel=sel||'foreach ($list as $item) {\n  work_miracles($item);\n}';var
code_prefix=(r.start===0)?'':'\n';update(area,code_prefix+'```\n',sel,'\n```');break;case'fa-quote-right':ch='>';sel=prepend_char_to_lines(ch,sel,pht('Quoted Text'));update(area,((r.start===0)?'':'\n\n'),sel,'\n\n');break;case'fa-table':var
table_prefix=(r.start===0?'':'\n\n');update(area,table_prefix+'| ',sel||pht('data'),' |');break;case'fa-meh-o':new
JX.Workflow('/macro/meme/create/').setHandler(function(response){update(area,'',sel,(r.start===0?'':'\n\n')+response.text+'\n\n');}).start();break;case'fa-cloud-upload':new
JX.Workflow('/file/uploaddialog/').setHandler(function(response){var
files=response.files;for(var
ii=0;ii<files.length;ii++){var
file=files[ii];var
upload=new
JX.PhabricatorFileUpload().setID(file.id).setPHID(file.phid).setURI(file.uri);JX.TextAreaUtils.insertFileReference(area,upload);}}).start();break;case'fa-arrows-alt':set_pinned_mode(root,false);if(edit_mode=='fullscreen'){set_edit_mode(root,'normal');}else{set_edit_mode(root,'fullscreen');}break;case'fa-eye':if(!preview){preview=JX.$N('div',{className:'remarkup-inline-preview'},null);area.parentNode.insertBefore(preview,area);JX.DOM.alterClass(button,'preview-active',true);JX.DOM.alterClass(root,'remarkup-preview-active',true);resize_preview();JX.DOM.hide(area);update_preview();}else{JX.DOM.show(area);resize_preview(true);JX.DOM.remove(preview);preview=null;JX.DOM.alterClass(button,'preview-active',false);JX.DOM.alterClass(root,'remarkup-preview-active',false);}break;case'fa-thumb-tack':set_edit_mode(edit_root,'normal');set_pinned_mode(root,!pinned);break;}}function
resize_preview(restore){if(!preview){return;}var
src;var
dst;if(restore){src=preview;dst=area;}else{src=area;dst=preview;}var
d=JX.Vector.getDim(src);d.x=null;d.setDim(dst);}function
update_preview(){var
value=area.value;var
data={text:value};var
onupdate=function(r){if(area.value!==value){return;}if(!preview){return;}JX.DOM.setContent(preview,JX.$H(r.content).getFragment());};new
JX.Workflow('/transactions/remarkuppreview/',data).setHandler(onupdate).start();}JX.DOM.listen(root,'click','remarkup-assist',function(e){var
data=e.getNodeData('remarkup-assist');if(!data.action){return;}e.kill();if(config.disabled){return;}assist(area,data.action,root,e.getNode('remarkup-assist'));});var
autocomplete=new
JX.PHUIXAutocomplete().setArea(area);for(var
k
in
config.autocompleteMap){autocomplete.addAutocomplete(k,config.autocompleteMap[k]);}autocomplete.start();if(config.canPin){new
JX.KeyboardShortcut('z',pht('key-help')).setHandler(function(){set_pinned_mode(root,!pinned);}).register();}if(config.sendOnEnter){JX.DOM.listen(area,'keydown',null,function(e){if(e.getSpecialKey()!='return'){return;}if(JX.Stratcom.pass()){return;}var
raw=e.getRawEvent();if(raw.shiftKey){return;}if(edit_mode=='fullscreen'){return;}e.kill();var
form=e.getNode('tag:form');JX.DOM.invoke(form,'didSyntheticSubmit');});}});JX.install('TextAreaUtils',{statics:{getSelectionRange:function(area){var
v=area.value;var
s=v.length;var
e=v.length;if('selectionStart'in
area){s=area.selectionStart;e=area.selectionEnd;}return{start:s,end:e};},getSelectionText:function(area){var
v=area.value;var
r=JX.TextAreaUtils.getSelectionRange(area);return v.substring(r.start,r.end);},setSelectionRange:function(area,start,end){if('setSelectionRange'in
area){var
scroll_top=area.scrollTop;area.focus();area.scrollTop=scroll_top;area.setSelectionRange(start,end);}},setSelectionText:function(area,text,select){var
v=area.value;var
r=JX.TextAreaUtils.getSelectionRange(area);v=v.substring(0,r.start)+text+v.substring(r.end,v.length);area.value=v;var
start=r.start;var
end=r.start+text.length;if(!select){start=end;}JX.TextAreaUtils.setSelectionRange(area,start,end);},insertFileReference:function(area,file){var
ref='{F'+file.getID()+'}';var
range=JX.TextAreaUtils.getSelectionRange(area);var
before=area.value.substring(0,range.start);if(before.match(/\}$/)){ref='\n\n'+ref;}JX.TextAreaUtils.setSelectionText(area,ref,false);},getPixelDimensions:function(area,start,end){var
v=area.value;var
head=v.substring(0,start);var
before=JX.$N('span',{},'\u200b');var
body=v.substring(start,end);var
after=JX.$N('span',{},'\u200b');var
metrics=JX.$N('var',{className:area.className,},[head,before,body,after]);if(area.scrollHeight>area.clientHeight){metrics.style.overflowY='scroll';}area.parentNode.appendChild(metrics);var
metrics_pos=JX.Vector.getPos(metrics);metrics_pos.x+=area.scrollLeft;metrics_pos.y+=area.scrollTop;var
area_pos=JX.Vector.getPos(area);var
before_pos=JX.Vector.getPos(before);var
after_pos=JX.Vector.getPos(after);JX.DOM.remove(metrics);return{start:{x:area_pos.x+(before_pos.x-metrics_pos.x),y:area_pos.y+(before_pos.y-metrics_pos.y)},end:{x:area_pos.x+(after_pos.x-metrics_pos.x),y:area_pos.y+(after_pos.y-metrics_pos.y)}};}}});JX.install('PhabricatorFileUpload',{construct:function(){this._notification=new
JX.Notification();},properties:{name:null,totalBytes:null,uploadedBytes:null,rawFileObject:null,allocatedPHID:null,ID:null,PHID:null,URI:null,status:null,markup:null,targetNode:null,error:null},members:{_notification:null,_chunks:null,_isResume:false,addUploadedBytes:function(bytes){var
uploaded=this.getUploadedBytes();this.setUploadedBytes(uploaded+bytes);return this;},setChunks:function(chunks){var
chunk;for(var
ii=0;ii<chunks.length;ii++){chunk=chunks[ii];if(chunk.complete){this.addUploadedBytes(chunk.byteEnd-chunk.byteStart);this._isResume=true;}}this._chunks=chunks;return this;},getChunks:function(){return this._chunks;},getRemainingChunks:function(){var
chunks=this.getChunks();var
result=[];for(var
ii=0;ii<chunks.length;ii++){if(!chunks[ii].complete){result.push(chunks[ii]);}}return result;},didCompleteChunk:function(chunk){var
chunks=this.getRemainingChunks();for(var
ii=0;ii<chunks.length;ii++){if(chunks[ii].byteStart==chunk.byteStart){if(chunks[ii].byteEnd==chunk.byteEnd){if(!chunks[ii].complete){chunks[ii].complete=true;}break;}}}return this;},update:function(){if(!this._notification){return;}this._notification.setDuration(0).show();var
content;switch(this.getStatus()){case'done':var
link=JX.$N('a',{href:this.getURI()},'F'+this.getID());content=[JX.$N('strong',{},['Upload Complete (',link,')']),JX.$N('br'),this.getName()];this._notification.setContent(content).alterClassName('jx-notification-done',true).setDuration(12000);this._notification=null;break;case'error':content=[JX.$N('strong',{},'Upload Failure'),JX.$N('br'),this.getName(),JX.$N('br'),JX.$N('br'),this.getError()];this._notification.setContent(content).alterClassName('jx-notification-error',true);this._notification=null;break;case'allocate':content='Allocating "'+this.getName()+'"...';this._notification.setContent(content);break;case'chunks':content='Loading chunks for "'+this.getName()+'"...';this._notification.setContent(content);break;default:var
info='';if(this.getTotalBytes()){var
p=this._renderPercentComplete();var
f=this._renderFileSize();info=p+' of '+f;}var
head;if(this._isResume){head='Resuming:';}else
if(this._chunks){head='Uploading chunks:';}else{head='Uploading:';}info=[JX.$N('strong',{},this.getName()),JX.$N('br'),head+' '+info];this._notification.setContent(info);break;}return this;},_renderPercentComplete:function(){if(!this.getTotalBytes()){return null;}var
ratio=this.getUploadedBytes()/this.getTotalBytes();return parseInt(100*ratio,10)+'%';},_renderFileSize:function(){if(!this.getTotalBytes()){return null;}var
s=3;var
n=this.getTotalBytes();while(s&&n>=1000){n=Math.round(n/100);n=n/10;s--;}s=['GB','MB','KB','bytes'][s];return n+' '+s;}}});JX.behavior('global-drag-and-drop',function(config,statics){if(!JX.PhabricatorDragAndDropFileUpload.isSupported()){return;}function
init(){statics.pending=0;statics.files=[];statics.errors=false;statics.enabled=true;if(config.ifSupported){JX.$(config.ifSupported).style.display='';}var
page=JX.$('phabricator-standard-page');statics.drop=new
JX.PhabricatorDragAndDropFileUpload(page).setURI(config.uploadURI).setViewPolicy(config.viewPolicy).setChunkThreshold(config.chunkThreshold);install_extra_listeners();statics.drop.start();return true;}function
install_extra_listeners(){statics.drop.listen('didBeginDrag',function(){if(!statics.enabled){return;}JX.Mask.show('global-upload-mask');JX.DOM.show(JX.$(config.instructions));});statics.drop.listen('didEndDrag',function(){if(!statics.enabled){return;}JX.Mask.hide('global-upload-mask');JX.DOM.hide(JX.$(config.instructions));});statics.drop.listen('willUpload',function(){if(!statics.enabled){return;}statics.pending++;});statics.drop.listen('didUpload',function(f){if(!statics.enabled){return;}statics.files.push(f);statics.pending--;if(statics.pending===0&&!statics.errors){var
uri;var
is_submit=!!config.submitURI;if(is_submit){uri=JX.$U(config.submitURI);}else{uri=JX.$U(config.browseURI);}var
ids=[];for(var
ii=0;ii<statics.files.length;ii++){ids.push(statics.files[ii].getID());}uri.setQueryParam('h',ids.join(','));statics.files=[];if(is_submit){new
JX.Workflow(uri).start();}else{uri.go();}}});statics.drop.listen('didError',function(){if(!statics.enabled){return;}statics.pending--;statics.errors=true;});JX.Stratcom.listen('quicksand-redraw',null,function(e){var
data=e.getData();var
toggle=data.newResponse.globalDragAndDrop;statics.enabled=toggle;statics.drop.setIsEnabled(toggle);});}statics.init=statics.init||init();});JX.behavior('phabricator-reveal-content',function(){JX.Stratcom.listen('click','reveal-content',function(e){e.kill();var
nodes=e.getNodeData('reveal-content');var
ii;for(ii=0;ii<nodes.showIDs.length;ii++){JX.DOM.show(JX.$(nodes.showIDs[ii]));}for(ii=0;ii<nodes.hideIDs.length;ii++){JX.DOM.hide(JX.$(nodes.hideIDs[ii]));}});});JX.install('Hovercard',{statics:{_node:null,_activeRoot:null,_visiblePHID:null,_alignment:null,fetchUrl:'/search/hovercard/',_cards:{},getAnchor:function(){return this._activeRoot;},getCard:function(){var
self=JX.Hovercard;return self._node;},getAlignment:function(){var
self=JX.Hovercard;return self._alignment;},show:function(root,phid){var
self=JX.Hovercard;if(root===this._activeRoot){return;}self.hide();self._visiblePHID=phid;self._activeRoot=root;if(!(phid
in
self._cards)){self._load([phid]);}else{self._drawCard(phid);}},_drawCard:function(phid){var
self=JX.Hovercard;if(self._cards[phid]===true){return;}if(phid!=self._visiblePHID){return;}if(!(phid
in
self._cards)){return;}var
root=self._activeRoot;var
node=JX.$N('div',{className:'jx-hovercard-container'},JX.$H(self._cards[phid]));self._node=node;node.style.left='-10000px';document.body.appendChild(node);var
child=node.firstChild;var
p=JX.$V(root);var
d=JX.Vector.getDim(root);var
n=JX.Vector.getDim(child);var
v=JX.Vector.getViewport();var
s=JX.Vector.getScroll();var
margin=20;var
x=p.x;if((x+n.x+margin)>(s.x+v.x)){x=(s.x+v.x)-n.x-margin;}var
y=p.y-n.y-margin;self._alignment='north';if((y-margin)<s.y){y=p.y+d.y+margin;self._alignment='south';}node.style.left=x+'px';node.style.top=y+'px';},hide:function(){var
self=JX.Hovercard;self._visiblePHID=null;self._activeRoot=null;if(self._node){JX.DOM.remove(self._node);self._node=null;}},_load:function(phids){var
self=JX.Hovercard;var
uri=JX.$U(self.fetchUrl);var
send=false;for(var
ii=0;ii<phids.length;ii++){var
phid=phids[ii];if(phid
in
self._cards){continue;}self._cards[phid]=true;uri.setQueryParam('phids['+ii+']',phids[ii]);send=true;}if(!send){return;}new
JX.Request(uri,function(r){for(var
phid
in
r.cards){self._cards[phid]=r.cards[phid];if(self.getCard()&&phid!=self._visiblePHID){continue;}self._drawCard(phid);}}).send();}}});JX.behavior('phui-hovercards',function(){JX.Stratcom.listen('mousemove','hovercard',function(e){if(JX.Device.getDevice()!='desktop'){return;}var
data=e.getNodeData('hovercard');JX.Hovercard.show(e.getNode('hovercard'),data.hoverPHID);});JX.Stratcom.listen('mousemove',null,function(e){if(!JX.Hovercard.getCard()){return;}var
root=JX.Hovercard.getAnchor();var
node=JX.Hovercard.getCard();var
align=JX.Hovercard.getAlignment();var
mouse=JX.$V(e);var
node_pos=JX.$V(node);var
node_dim=JX.Vector.getDim(node);var
root_pos=JX.$V(root);var
root_dim=JX.Vector.getDim(root);var
margin=20;if(align=='south'){if(mouse.y>node_pos.y+node_dim.y+margin){JX.Hovercard.hide();}if(mouse.y<root_pos.y-margin){JX.Hovercard.hide();}}else{if(mouse.y<node_pos.y-margin){JX.Hovercard.hide();}if(mouse.y>root_pos.y+root_dim.y+margin){JX.Hovercard.hide();}}if(mouse.x<Math.min(root_pos.x,node_pos.x)-margin){JX.Hovercard.hide();}if(mouse.x>Math.max(root_pos.x+root_dim.x,node_pos.x+node_dim.x)+margin){JX.Hovercard.hide();}});JX.Stratcom.listen(['unload','onresize'],null,function(){JX.Hovercard.hide();});});JX.install('Color',{statics:{rgbRegex:new
RegExp('([\\d]{1,3})','g'),rgbToHex:function(str,as_array){var
rgb=str.match(JX.Color.rgbRegex);var
hex=[0,1,2].map(function(index){return('0'+(rgb[index]-0).toString(16)).substr(-2,2);});return as_array?hex:'#'+hex.join('');},hexRegex:new
RegExp('^[#]{0,1}([\\w]{1,2})([\\w]{1,2})([\\w]{1,2})$'),hexToRgb:function(str,as_array){var
hex=str.match(JX.Color.hexRegex);var
rgb=hex.slice(1).map(function(bit){return parseInt(bit.length==1?bit+bit:bit,16);});return as_array?rgb:'rgb('+rgb+')';}}});JX.install('FX',{events:['start','complete'],construct:function(element){this._config={};this.setElement(element);this.setTransition(JX.FX.Transitions.sine);},properties:{fps:50,wait:true,duration:500,element:null,property:null,transition:null},members:{_to:null,_now:null,_from:null,_start:null,_config:null,_interval:null,start:function(config){if(__DEV__){if(!config){throw new
Error('What styles do you want to animate?');}if(!this.getElement()){throw new
Error('What element do you want to animate?');}}if(this._interval&&this.getWait()){return;}var
from={};var
to={};for(var
prop
in
config){from[prop]=config[prop][0];to[prop]=config[prop][1];if(/color/i.test(prop)){from[prop]=JX.Color.hexToRgb(from[prop],true);to[prop]=JX.Color.hexToRgb(to[prop],true);}}this._animate(from,to);return this;},stop:function(){clearInterval(this._interval);this._interval=null;return this;},then:function(func){var
token=this.listen('complete',function(){token.remove();func();});return this;},_animate:function(from,to){if(!this.getWait()){this.stop();}if(this._interval){return;}setTimeout(JX.bind(this,this.invoke,'start'),10);this._from=from;this._to=to;this._start=JX.now();this._interval=setInterval(JX.bind(this,this._tween),Math.round(1000/this.getFps()));this._tween();},_tween:function(){var
now=JX.now();var
prop;if(now<this._start+this.getDuration()){this._now=now-this._start;for(prop
in
this._from){this._config[prop]=this._compute(this._from[prop],this._to[prop]);}}else{setTimeout(JX.bind(this,this.invoke,'complete'),10);this._now=this.getDuration();for(prop
in
this._from){this._config[prop]=this._compute(this._from[prop],this._to[prop]);}this.stop();}this._render();},_compute:function(from,to){if(JX.isArray(from)){return from.map(function(value,ii){return Math.round(this._compute(value,to[ii]));},this);}var
delta=to-from;return this.getTransition()(this._now,from,delta,this.getDuration());},_render:function(){var
style=this.getElement().style;for(var
prop
in
this._config){var
value=this._config[prop];if(prop=='opacity'){value=parseInt(100*value,10);if(window.ActiveXObject){style.filter='alpha(opacity='+value+')';}else{style.opacity=value/100;}}else
if(/color/i.test(prop)){style[prop]='rgb('+value+')';}else{style[prop]=value+'px';}}}},statics:{fade:function(element,visible){return new
JX.FX(element).setDuration(250).start({opacity:visible?[0,1]:[1,0]});},highlight:function(element,color){color=color||'#fff8dd';return new
JX.FX(element).setDuration(1000).start({backgroundColor:[color,'#fff']});},Transitions:{linear:function(t,b,c,d){return c*t/d+b;},sine:function(t,b,c,d){return-c/2*(Math.cos(Math.PI*t/d)-1)+b;},sineIn:function(t,b,c,d){if(t==d){return c+b;}return-c*Math.cos(t/d*(Math.PI/2))+c+b;},sineOut:function(t,b,c,d){if(t==d){return c+b;}return c*Math.sin(t/d*(Math.PI/2))+b;},elastic:function(t,b,c,d,a,p){if(t===0){return b;}if((t/=d)==1){return b+c;}if(!p){p=d*0.3;}if(!a){a=1;}var
s;if(a<Math.abs(c)){a=c;s=p/4;}else{s=p/(2*Math.PI)*Math.asin(c/a);}return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b;},bounce:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b;}else
if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b;}else
if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b;}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b;}}}}});JX.install('DraggableList',{construct:function(sigil,root){this._sigil=sigil;this._root=root||document.body;this._group=[this];JX.enableDispatch(document.body,'mousemove');JX.DOM.listen(this._root,'mousedown',sigil,JX.bind(this,this._ondrag));JX.Stratcom.listen('mousemove',null,JX.bind(this,this._onmove));JX.Stratcom.listen('scroll',null,JX.bind(this,this._onmove));JX.Stratcom.listen('mouseup',null,JX.bind(this,this._ondrop));JX.Stratcom.listen('keypress',null,JX.bind(this,this._onkey));},events:['didLock','didUnlock','shouldBeginDrag','didBeginDrag','didCancelDrag','didEndDrag','didDrop','didSend','didReceive'],properties:{findItemsHandler:null,canDragX:false,outerContainer:null,hasInfiniteHeight:false},members:{_root:null,_dragging:null,_locked:0,_target:null,_targets:null,_ghostHandler:null,_ghostNode:null,_group:null,_cursorPosition:null,_cursorOrigin:null,_cursorScroll:null,_frame:null,_clone:null,_offset:null,_autoscroll:null,_autoscroller:null,_autotimer:null,getRootNode:function(){return this._root;},setGhostHandler:function(handler){this._ghostHandler=handler;return this;},getGhostHandler:function(){return this._ghostHandler||JX.bind(this,this._defaultGhostHandler);},getGhostNode:function(){if(!this._ghostNode){this._ghostNode=JX.$N('li',{className:'drag-ghost'});}return this._ghostNode;},setGhostNode:function(node){this._ghostNode=node;return this;},setGroup:function(lists){var
result=[];var
need_self=true;for(var
ii=0;ii<lists.length;ii++){if(lists[ii]==this){need_self=false;}result.push(lists[ii]);}if(need_self){result.push(this);}this._group=result;return this;},_hasGroup:function(){return(this._group.length>1);},_defaultGhostHandler:function(ghost,target){var
parent;if(!this._hasGroup()){parent=this._dragging.parentNode;}else{parent=this.getRootNode();}if(target&&target.nextSibling){parent.insertBefore(ghost,target.nextSibling);}else
if(!target&&parent.firstChild){parent.insertBefore(ghost,parent.firstChild);}else{parent.appendChild(ghost);}},findItems:function(){var
handler=this.getFindItemsHandler();if(__DEV__){if(!handler){JX.$E('JX.Draggable.findItems(): No findItemsHandler set!');}}var
items=handler();for(var
ii=0;ii<items.length;ii++){if(items[ii]===this._clone){items.splice(ii,1);break;}}return items;},_ondrag:function(e){if(this._dragging){return;}if(this._locked){return;}if(!e.isNormalMouseEvent()){return;}if(this.invoke('shouldBeginDrag',e).getPrevented()){return;}if(e.getNode('tag:a')){return;}if(JX.Stratcom.pass()){return;}e.kill();var
drag=e.getNode(this._sigil);this._autoscroll={};this._autoscroller=setInterval(JX.bind(this,this._onautoscroll),10);this._autotimer=null;for(var
ii=0;ii<this._group.length;ii++){this._group[ii]._clearTarget();}var
pos=JX.$V(drag);var
dim=JX.Vector.getDim(drag);for(var
jj=0;jj<this._group.length;jj++){var
ghost=this._group[jj].getGhostNode();ghost.style.height=dim.y+'px';}var
clone=drag.cloneNode(true);pos.setPos(clone);dim.setDim(clone);JX.DOM.alterClass(drag,'drag-dragging',true);JX.DOM.alterClass(clone,'drag-clone',true);var
frame=JX.$N('div',{className:'drag-frame'});frame.appendChild(clone);document.body.appendChild(frame);this._dragging=drag;this._clone=clone;this._frame=frame;var
cursor=JX.$V(e);this._offset=new
JX.Vector(pos.x-cursor.x,pos.y-cursor.y);JX.Tooltip.lock();this.invoke('didBeginDrag',this._dragging);},_getTargets:function(){if(this._targets===null){var
targets=[];var
items=this.findItems();for(var
ii=0;ii<items.length;ii++){var
item=items[ii];var
ipos=JX.$V(item);targets.push({item:items[ii],y:ipos.y+(JX.Vector.getDim(items[ii]).y/2)});}targets.sort(function(u,v){return v.y-u.y;});this._targets=targets;}return this._targets;},_dirtyTargetCache:function(){if(this._hasGroup()){var
group=this._group;for(var
ii=0;ii<group.length;ii++){group[ii]._targets=null;}}else{this._targets=null;}return this;},_getTargetList:function(p){var
target_list;var
infinity;if(this._hasGroup()){var
group=this._group;for(var
ii=0;ii<group.length;ii++){var
root=group[ii].getRootNode();var
rp=JX.$V(root);var
rd=JX.Vector.getDim(root);if(group[ii].getHasInfiniteHeight()){if(!infinity){infinity=Math.max(JX.Vector.getViewport().y,JX.Vector.getDocument().y);}rp.y=0;rd.y=infinity;}var
is_target=false;if(p.x>=rp.x&&p.y>=rp.y){if(p.x<=(rp.x+rd.x)&&p.y<=(rp.y+rd.y)){is_target=true;target_list=group[ii];}}JX.DOM.alterClass(root,'drag-target-list',is_target);}}else{target_list=this;}return target_list;},_getTarget:function(){return this._target;},_setTarget:function(cur_target){var
ghost=this.getGhostNode();var
target=this._target;if(cur_target!==target){this._clearTarget();if(cur_target!==false){var
ok=this.getGhostHandler()(ghost,cur_target);if(ok===false){cur_target=false;}}this._target=cur_target;}return this;},_clearTarget:function(){var
target=this._target;var
ghost=this.getGhostNode();if(target!==false){JX.DOM.remove(ghost);}this._target=false;this._dirtyTargetCache();return this;},_getCurrentTarget:function(p){var
ghost=this.getGhostNode();var
targets=this._getTargets();var
dragging=this._dragging;var
cur_target=null;var
trigger;for(var
ii=0;ii<targets.length;ii++){trigger=targets[ii].y;if(trigger>=p.y){continue;}cur_target=targets[ii].item;if(!dragging){}else{if(cur_target===dragging){cur_target=false;}if(targets[ii-1]&&(targets[ii-1].item===dragging)){cur_target=false;}}break;}if(dragging&&cur_target===null){var
first_item=targets[targets.length-1].item;if(dragging===first_item){cur_target=false;}}return cur_target;},_onmove:function(e){if(e.getType()=='mousemove'){this._cursorPosition=JX.$V(e);this._cursorOrigin=JX.$V(e);this._cursorScroll=JX.Vector.getScroll();}if(!this._dragging){return;}if(!this._cursorPosition){return;}if(e.getType()=='scroll'){this._dirtyTargetCache();var
s=JX.Vector.getScroll();this._cursorPosition=new
JX.$V(this._cursorOrigin.x-(this._cursorScroll.x-s.x),this._cursorOrigin.y-(this._cursorScroll.y-s.y));}var
p=JX.$V(this._cursorPosition.x,this._cursorPosition.y);var
group=this._group;var
target_list=this._getTargetList(p);var
cur_target=false;if(target_list){cur_target=target_list._getCurrentTarget(p);}for(var
ii=0;ii<group.length;ii++){if(group[ii]==target_list){group[ii]._setTarget(cur_target);}else{group[ii]._clearTarget();}}this._updateAutoscroll(this._cursorPosition);var
f=JX.$V(this._frame);p.x-=f.x;p.y-=f.y;p.y+=this._offset.y;this._clone.style.top=p.y+'px';if(this.getCanDragX()){p.x+=this._offset.x;this._clone.style.left=p.x+'px';}e.kill();},_updateAutoscroll:function(p){var
container=this._getScrollAnchor().parentNode;var
autoscroll={};var
outer=this.getOuterContainer();var
cpos;var
cdim;while(container){if(outer&&(container==outer)){break;}try{cpos=JX.Vector.getPos(container);cdim=JX.Vector.getDim(container);if(container==document.body){cdim=JX.Vector.getViewport();cpos.x+=container.scrollLeft;cpos.y+=container.scrollTop;}}catch(ignored){break;}var
fuzz=64;if(p.y<=cpos.y+fuzz){autoscroll.up=container;}if(p.y>=cpos.y+cdim.y-fuzz){autoscroll.down=container;}if(p.x<=cpos.x+fuzz){autoscroll.left=container;}if(p.x>=cpos.x+cdim.x-fuzz){autoscroll.right=container;}if(container==document.body){break;}container=container.parentNode;}this._autoscroll=autoscroll;},_onkey:function(e){if(this._dragging&&(e.getSpecialKey()=='esc')){e.kill();this._drop(null);return;}},_ondrop:function(e){if(this._dragging){e.kill();}var
p=JX.$V(e);this._drop(p);},_drop:function(cursor){if(!this._dragging){return;}var
dragging=this._dragging;this._dragging=null;clearInterval(this._autoscroller);this._autoscroller=null;JX.DOM.remove(this._frame);this._frame=null;this._clone=null;var
target=false;var
ghost=false;if(cursor){var
target_list=this._getTargetList(cursor);if(target_list){target=target_list._target;ghost=target_list.getGhostNode();}}JX.$V(0,0).setPos(dragging);if(target===false){this.invoke('didCancelDrag',dragging);}else{JX.DOM.remove(dragging);JX.DOM.replace(ghost,dragging);this.invoke('didSend',dragging,target_list);target_list.invoke('didReceive',dragging,this);target_list.invoke('didDrop',dragging,target,this);}var
group=this._group;for(var
ii=0;ii<group.length;ii++){JX.DOM.alterClass(group[ii].getRootNode(),'drag-target-list',false);group[ii]._clearTarget();}JX.DOM.alterClass(dragging,'drag-dragging',false);JX.Tooltip.unlock();this.invoke('didEndDrag',dragging);},_getScrollAnchor:function(){var
group=this._group;for(var
ii=0;ii<group.length;ii++){var
target=group[ii]._getTarget();if(target){return group[ii]._ghostNode;}}return this._dragging;},_onautoscroll:function(){var
u=this._autoscroll.up;var
d=this._autoscroll.down;var
l=this._autoscroll.left;var
r=this._autoscroll.right;var
now=+new
Date();if(!this._autotimer){this._autotimer=now;return;}var
delta=now-this._autotimer;this._autotimer=now;var
amount=12*(delta/10);var
anchor=this._getScrollAnchor();if(u&&(u!=d)){this._tryScroll(anchor,u,'scrollTop',amount);}if(d&&(d!=u)){this._tryScroll(anchor,d,'scrollTop',-amount);}if(l&&(l!=r)){this._tryScroll(anchor,l,'scrollLeft',amount);}if(r&&(r!=l)){this._tryScroll(anchor,r,'scrollLeft',-amount);}},_tryScroll:function(from,to,property,amount){var
value;var
container=from.parentNode;while(container){var
lock=false;if(container===window.document){lock=false;}else{var
lock_sigil;if(property=='scrollTop'){lock_sigil='lock-scroll-y-while-dragging';}if(lock_sigil){lock=JX.Stratcom.hasSigil(container,lock_sigil);}}if(!lock){value=container[property];container[property]-=amount;if(container[property]!=value){break;}if(container==to){break;}}container=container.parentNode;}},lock:function(){for(var
ii=0;ii<this._group.length;ii++){this._group[ii]._lock();}return this;},_lock:function(){this._locked++;if(this._locked===1){this.invoke('didLock');}return this;},unlock:function(){for(var
ii=0;ii<this._group.length;ii++){this._group[ii]._unlock();}return this;},_unlock:function(){if(__DEV__){if(!this._locked){JX.$E('JX.Draggable.unlock(): Draggable is not locked!');}}this._locked--;if(!this._locked){this.invoke('didUnlock');}return this;}}});JX.behavior('phabricator-transaction-list',function(){JX.Stratcom.listen('click',[['transaction-edit'],['transaction-remove'],['transaction-raw']],function(e){if(!e.isNormalClick()){return;}e.prevent();var
anchor=e.getNodeData('tag:a').anchor;var
uri=JX.$U(window.location).setFragment(anchor);JX.Workflow.newFromLink(e.getNode('tag:a')).setHandler(function(){uri.go();window.location.reload();}).start();});JX.Stratcom.listen('click','transaction-quote',function(e){e.prevent();var
data=e.getNodeData('transaction-quote');var
ref=data.ref||'';new
JX.Workflow(data.uri).setData({ref:ref}).setHandler(function(r){var
textarea=JX.$(data.targetID);JX.DOM.scrollTo(textarea);var
value=textarea.value;if(value.length){value+='\n\n';}value+=r.quoteText;value+='\n\n';textarea.value=value;JX.TextAreaUtils.setSelectionRange(textarea,textarea.value.length,textarea.value.length);}).start();});});JX.behavior('phabricator-show-older-transactions',function(config){function
get_hash(){return window.location.hash.replace(/^#/,'');}function
hash_is_hidden(){var
hash=get_hash();if(!hash){return false;}if(!hash.match(/^\d+$/)){return false;}var
id='anchor-'+hash;try{JX.$(id);}catch(not_found_exception){return true;}return false;}function
check_hash(){if(hash_is_hidden()){load_older(load_hidden_hash_callback);}}function
load_older(callback){var
showOlderBlock=null;try{showOlderBlock=JX.DOM.find(JX.$(config.timelineID),'div','show-older-block');}catch(not_found_exception){return;}var
showOlderLink=JX.DOM.find(showOlderBlock,'a','show-older-link');var
workflow=fetch_older_workflow(showOlderLink.href,callback,showOlderBlock);var
routable=workflow.getRoutable().setPriority(2000).setType('workflow');JX.Router.getInstance().queue(routable);}var
show_older=function(swap,r){JX.DOM.replace(swap,JX.$H(r.timeline).getFragment());JX.Stratcom.invoke('resize');};var
load_hidden_hash_callback=function(swap,r){show_older(swap,r);};var
load_all_older_callback=function(swap,r){show_older(swap,r);load_older(load_all_older_callback);};var
fetch_older_workflow=function(href,callback,swap){return new
JX.Workflow(href,config.renderData).setHandler(JX.bind(null,callback,swap));};JX.Stratcom.listen('click',['show-older-block'],function(e){e.kill();var
workflow=fetch_older_workflow(JX.DOM.find(e.getNode('show-older-block'),'a','show-older-link').href,show_older,e.getNode('show-older-block'));var
routable=workflow.getRoutable().setPriority(2000).setType('workflow');JX.Router.getInstance().queue(routable);});JX.Stratcom.listen('hashchange',null,check_hash);check_hash();new
JX.KeyboardShortcut(['@'],'Show all older changes in the timeline.').setHandler(JX.bind(null,load_older,load_all_older_callback)).register();});JX.behavior('phui-dropdown-menu',function(){JX.Stratcom.listen('click','phui-dropdown-menu',function(e){var
data=e.getNodeData('phui-dropdown-menu');if(data.menu){return;}e.kill();var
list;var
placeholder;if(data.items){list=JX.$H(data.items).getFragment().firstChild;}else{list=JX.$(data.menuID);placeholder=JX.$N('span');}var
icon=e.getNode('phui-dropdown-menu');data.menu=new
JX.PHUIXDropdownMenu(icon);data.menu.listen('open',function(){if(placeholder){JX.DOM.replace(list,placeholder);}data.menu.setContent(list);});data.menu.listen('close',function(){if(placeholder){JX.DOM.replace(placeholder,list);}});data.menu.open();});});JX.behavior('doorkeeper-tag',function(config,statics){statics.tags=(statics.tags||[]).concat(config.tags);statics.cache=statics.cache||{};var
load=function(){var
tags=statics.tags;statics.tags=[];if(!tags.length){return;}var
have=[];var
need=[];var
keys={};var
draw=function(tags){for(var
ii=0;ii<tags.length;ii++){try{JX.DOM.replace(JX.$(tags[ii].id),JX.$H(tags[ii].markup));}catch(ignored){}statics.cache[keys[tags[ii].id]]=tags[ii].markup;}};for(var
ii=0;ii<tags.length;ii++){var
key_parts=[];key_parts=key_parts.concat(tags[ii].ref);key_parts.push(tags[ii].view);var
tag_key=key_parts.join(' ');if(tag_key
in
statics.cache){have.push({id:tags[ii].id,markup:statics.cache[tag_key]});}else{need.push(tags[ii]);keys[tags[ii].id]=tag_key;}}if(have.length){draw(have);}if(need.length){var
data={tags:JX.JSON.stringify(need)};new
JX.Workflow('/doorkeeper/tags/',data).setHandler(function(r){draw(r.tags);}).start();}};JX.onload(load);});JX.install('Title',{statics:{_counts:{},_title:null,setCount:function(k,v){var
self=JX.Title;self._counts[k]=v;self._update();},setTitle:function(title){var
self=JX.Title;self._title=title;self._update();},_update:function(){var
self=JX.Title;if(self._title===null){self._title=document.title;}var
sum=0;for(var
k
in
self._counts){sum+=parseInt(self._counts[k],10)||0;}var
title;if(sum){title='('+sum+') '+self._title;}else{title=self._title;}document.title=title;}}});JX.install('Leader',{events:['onBecomeLeader','onReceiveBroadcast'],statics:{_leaseDuration:1500,_interval:null,_timeout:null,_broadcastKey:'JX.Leader.broadcast',_leaderKey:'JX.Leader.id',_isLeader:false,_seen:{},_seenList:[],start:function(){var
self=JX.Leader;self.call(JX.bag);},callIfLeader:function(callback){JX.Leader._callIf(callback,JX.bag);},call:function(callback){JX.Leader._callIf(callback,callback);},_callIf:function(leader_callback,follower_callback){var
self=JX.Leader;if(!window.localStorage){self._becomeLeader();leader_callback();return;}if(!self._id){self._id=1+parseInt(Math.random()*1000000000,10);JX.Stratcom.listen('pagehide',null,self._pagehide);JX.Stratcom.listen('storage',null,self._storage);}var
lease=self._read();var
expire_delay=50;var
usurp_delay=75;var
now=+new
Date();if(lease.until>now){if(lease.id===self._id){var
interval=parseInt(self._leaseDuration/3,10);if(!self._interval&&lease.until>now+(interval*2)){self._interval=window.setInterval(self._write,interval);}self._becomeLeader();leader_callback();}else{if(!self._timeout){var
usurp_at=(lease.until-now)+usurp_delay;self._timeout=window.setTimeout(self._usurp,usurp_at);}follower_callback();}return;}self._write();window.setTimeout(JX.bind(null,self._callIf,leader_callback,follower_callback),expire_delay);},broadcast:function(id,message){var
self=JX.Leader;if(id!==null){if(id
in
self._seen){return;}self._markSeen(id);}if(window.localStorage){var
json=JX.JSON.stringify({id:id,message:message,uniq:parseInt(Math.random()*1000000,10)});window.localStorage.setItem(self._broadcastKey,json);}self._receiveBroadcast(message);},_write:function(){var
self=JX.Leader;var
str=[self._id,((+new
Date())+self._leaseDuration)].join(':');window.localStorage.setItem(self._leaderKey,str);},_read:function(){var
self=JX.Leader;var
leader=window.localStorage.getItem(self._leaderKey)||'0:0';leader=leader.split(':');return{id:parseInt(leader[0],10),until:parseInt(leader[1],10)};},_pagehide:function(){var
self=JX.Leader;if(self._read().id===self._id){window.localStorage.removeItem(self._leaderKey);}},_storage:function(e){var
self=JX.Leader;var
key=e.getRawEvent().key;var
new_value=e.getRawEvent().newValue;switch(key){case
self._broadcastKey:new_value=JX.JSON.parse(new_value);if(new_value.id!==null){if(new_value.id
in
self._seen){return;}self._markSeen(new_value.id);}self._receiveBroadcast(new_value.message);break;case
self._leaderKey:if(new_value===null){self.callIfLeader(JX.bag);}break;}},_receiveBroadcast:function(message){var
self=JX.Leader;new
JX.Leader().invoke('onReceiveBroadcast',message,self._isLeader);},_becomeLeader:function(){var
self=JX.Leader;if(self._isLeader){return;}self._isLeader=true;new
JX.Leader().invoke('onBecomeLeader');},_usurp:function(){var
self=JX.Leader;self._timeout=null;self.call(JX.bag);},_markSeen:function(id){var
self=JX.Leader;self._seen[id]=true;self._seenList.push(id);while(self._seenList.length>128){delete
self._seen[self._seenList[0]];self._seenList.splice(0,1);}}}});JX.install('WebSocket',{construct:function(uri){this.setURI(uri);this._resetDelay();},properties:{URI:null,openHandler:null,messageHandler:null,closeHandler:null},members:{_socket:null,_isOpen:false,_shouldClose:false,_delayUntilReconnect:null,open:function(){if(!window.WebSocket){return;}this._shouldClose=false;this._socket=new
WebSocket(this.getURI());this._socket.onopen=JX.bind(this,this._onopen);this._socket.onmessage=JX.bind(this,this._onmessage);this._socket.onclose=JX.bind(this,this._onclose);},send:function(message){if(this._isOpen){this._socket.send(message);}},close:function(){if(!this._isOpen){return;}this._shouldClose=true;this._socket.close();},reconnect:function(){if(!this._isOpen){return;}this._socket.close();},getReconnectDelay:function(){return this._delayUntilReconnect;},_onopen:function(){this._isOpen=true;this._delayUntilReconnect=0;var
handler=this.getOpenHandler();if(handler){handler();}},_resetDelay:function(){this._delayUntilReconnect=2000;},_onmessage:function(e){var
data=e.data;var
handler=this.getMessageHandler();if(handler){handler(data);}},_onclose:function(){this._isOpen=false;var
done=false;var
handler=this.getCloseHandler();if(handler){done=handler();}if(!done&&!this._shouldClose){setTimeout(JX.bind(this,this._reconnect),this._delayUntilReconnect);}},_reconnect:function(){if(!this._delayUntilReconnect){this._resetDelay();}else{this._delayUntilReconnect=this._delayUntilReconnect*2;}this._delayUntilReconnect=Math.min(this._delayUntilReconnect,300000);this.open();}}});JX.behavior('dashboard-async-panel',function(config){var
panel=JX.$(config.panelID);panel.style.opacity='0.5';var
data={parentPanelPHIDs:config.parentPanelPHIDs.join(','),headerMode:config.headerMode,dashboardID:config.dashboardID};new
JX.Workflow(config.uri).setData(data).setHandler(function(r){JX.DOM.replace(panel,JX.$H(r.panelMarkup));}).start();});JX.behavior('dashboard-tab-panel',function(){JX.Stratcom.listen('click','dashboard-tab-panel-tab',function(e){e.kill();var
ii;var
idx=e.getNodeData('dashboard-tab-panel-tab').idx;var
root=e.getNode('dashboard-tab-panel-container');var
data=JX.Stratcom.getData(root);var
tabs=JX.DOM.scry(root,'li','dashboard-tab-panel-tab');for(ii=0;ii<tabs.length;ii++){JX.DOM.alterClass(tabs[ii],'phui-list-item-selected',(ii==idx));}for(ii=0;ii<data.panels.length;ii++){var
panel=JX.$(data.panels[ii]);if(ii==idx){JX.DOM.show(panel);}else{JX.DOM.hide(panel);}}});});JX.install('Quicksand',{statics:{_id:null,_onpage:0,_cursor:0,_current:0,_content:{},_responses:{},_history:[],_started:false,_frameNode:null,_contentNode:null,_uriPatternBlacklist:[],start:function(first_response){var
self=JX.Quicksand;if(self._started){return;}JX.Stratcom.listen('click','tag:a',self._onclick);JX.Stratcom.listen('history:change',null,self._onchange);self._started=true;var
path=JX.$U(window.location).getRelativeURI();self._id=window.history.state||0;var
id=self._id;self._onpage=id;self._history.push({path:path,id:id});self._responses[id]=first_response;},setFrame:function(frame){var
self=JX.Quicksand;self._frameNode=frame;return self;},getCurrentPageID:function(){var
self=JX.Quicksand;if(self._id===null){self._id=window.history.state||0;}return self._id;},_onclick:function(e){var
self=JX.Quicksand;if(!self._frameNode){return;}if(JX.Stratcom.pass()){return;}if(!e.isNormalClick()){return;}if(e.getNode('workflow')){return;}var
a=e.getNode('tag:a');var
href=a.href;if(!href||!href.length){return;}if(href[0]=='#'){return;}var
uri=new
JX.$U(href);var
here=new
JX.$U(window.location);if(uri.getDomain()!=here.getDomain()){return;}if(uri.getFragment()&&uri.getPath()==here.getPath()){return;}if(self._isURIOnBlacklist(uri)){return;}e.kill();var
discard=(self._history.length-self._cursor)-1;for(var
ii=0;ii<discard;ii++){var
obsolete=self._history.pop();self._responses[obsolete.id]=false;}var
path=JX.$U(uri).getRelativeURI();var
id=++self._id;self._history.push({path:path,id:id});JX.History.push(path,id);self._cursor=(self._history.length-1);self._responses[id]=null;self._current=id;new
JX.Workflow(href,{__quicksand__:true}).setHandler(JX.bind(null,self._onresponse,id)).start();},_onresponse:function(id,r){var
self=JX.Quicksand;if(self._responses[id]===false){return;}var
new_content=JX.$H(r.content).getFragment();self._content[id]=new_content;self._responses[id]=r;if(self._current==id){self._draw(true);}},_draw:function(from_server){var
self=JX.Quicksand;if(self._onpage==self._current){return;}if(!self._responses[self._current]){return;}var
old=window.document.createDocumentFragment();while(self._frameNode.firstChild){JX.DOM.appendContent(old,self._frameNode.firstChild);}self._content[self._onpage]=old;JX.DOM.setContent(self._frameNode,self._content[self._current]);JX.Stratcom.invoke('quicksand-redraw',null,{newResponse:self._responses[self._current],newResponseID:self._current,oldResponse:self._responses[self._onpage],oldResponseID:self._onpage,fromServer:from_server});self._onpage=self._current;JX.DOM.scrollToPosition(0,0);JX.Stratcom.invoke('resize');},_onchange:function(e){var
self=JX.Quicksand;var
data=e.getData();data.state=data.state||null;if(data.state===null){if(JX.$U(window.location).getPath()==self._history[0].path){data.state=0;}}if(data.state!==null){self._current=data.state;for(var
ii=0;ii<self._history.length;ii++){if(self._history[ii].id==self._current){self._cursor=ii;break;}}self._draw(false);}},setURIPatternBlacklist:function(items){var
self=JX.Quicksand;var
list=[];for(var
ii=0;ii<items.length;ii++){list.push(new
RegExp('^'+items[ii]+'$'));}self._uriPatternBlacklist=list;return self;},_isURIOnBlacklist:function(uri){var
self=JX.Quicksand;var
list=self._uriPatternBlacklist;var
path=uri.getPath();for(var
ii=0;ii<list.length;ii++){if(list[ii].test(path)){return true;}}return false;}}});JX.behavior('quicksand-blacklist',function(config){JX.Quicksand.setURIPatternBlacklist(config.patterns);});JX.behavior('high-security-warning',function(config,statics){function
show_warning(message,uri){var
n=new
JX.Notification().setContent(message).setDuration(0).alterClassName('jx-notification-security',true);n.listen('activate',function(){statics.showing=false;JX.$U(uri).go();});n.show();statics.showing=true;}if(statics.showing){return;}if(config.show){show_warning(config.message,config.uri);}JX.Stratcom.listen('quicksand-redraw',null,function(e){var
new_data=e.getData().newResponse.hisecWarningConfig;if(!new_data.fromServer||!new_data.show||statics.showing){return;}show_warning(new_data.message,new_data.uri);});});JX.behavior('read-only-warning',function(config){var
n=new
JX.Notification().setContent(config.message).setDuration(0).alterClassName('jx-notification-read-only',true);n.listen('activate',function(){JX.$U(config.uri).go();});n.show();});JX.install('Scrollbar',{construct:function(frame){this._frame=frame;JX.DOM.listen(frame,'load',null,JX.bind(this,this._onload));this._onload();if(JX.Scrollbar.getScrollbarControlWidth()===0){return;}JX.DOM.alterClass(frame,'jx-scrollbar-frame',true);var
content=JX.$N('div',{className:'jx-scrollbar-content'});while(frame.firstChild){JX.DOM.appendContent(content,frame.firstChild);}var
viewport=JX.$N('div',{className:'jx-scrollbar-viewport'},content);JX.DOM.appendContent(frame,viewport);this._viewport=viewport;this._content=content;this._handle=JX.$N('div',{className:'jx-scrollbar-handle'});this._bar=JX.$N('div',{className:'jx-scrollbar-bar'},this._handle);JX.DOM.prependContent(frame,this._bar);JX.DOM.listen(this._handle,'mousedown',null,JX.bind(this,this._ondrag));JX.DOM.listen(this._bar,'mousedown',null,JX.bind(this,this._onjump));JX.enableDispatch(document.body,'mouseenter');JX.DOM.listen(viewport,'mouseenter',null,JX.bind(this,this._onenter));JX.DOM.listen(frame,'scroll',null,JX.bind(this,this._onscroll));JX.enableDispatch(window,'mousemove');JX.Stratcom.listen('mousemove',null,JX.bind(this,this._onmove));JX.Stratcom.listen('mouseup',null,JX.bind(this,this._ondrop));JX.Stratcom.listen('resize',null,JX.bind(this,this._onresize));this._resizeViewport();this._resizeBar();},statics:{_controlWidth:null,getScrollbarControlWidth:function(){var
self=JX.Scrollbar;if(self._controlWidth===null){var
tmp=JX.$N('div',{className:'jx-scrollbar-test'},'-');document.body.appendChild(tmp);var
d1=JX.Vector.getDim(tmp);tmp.style.overflowY='scroll';var
d2=JX.Vector.getDim(tmp);JX.DOM.remove(tmp);self._controlWidth=(d2.x-d1.x);}return self._controlWidth;},getScrollbarControlMargin:function(){var
self=JX.Scrollbar;if(self.getScrollbarControlWidth()===0){return 12;}return 0;}},members:{_frame:null,_viewport:null,_content:null,_bar:null,_handle:null,_timeout:null,_dragOrigin:null,_scrollOrigin:null,_lastHeight:null,setAsScrollFrame:function(){if(this._viewport){JX.DOM.setContentFrame(this._viewport,this._content);var
focus=document.activeElement;if(!focus||focus==window.document.body){var
link=JX.$N('a',{href:'#',className:'jx-scrollbar-link'});JX.DOM.listen(link,'blur',null,function(){try{JX.DOM.remove(link);}catch(ignored){}});JX.DOM.listen(link,'click',null,function(e){e.kill();});JX.DOM.prependContent(this._viewport,link);JX.DOM.focus(link);}}else{JX.DOM.setContentFrame(this._frame,this._frame);}},_onscroll:function(){this._showBar();},_onenter:function(){this._showBar();},_onresize:function(){this._resizeViewport();this._resizeBar();},_onjump:function(e){if(e.getTarget()===this._handle){return;}var
distance=JX.Vector.getDim(this._viewport).y*(7/8);var
epos=JX.$V(e);var
hpos=JX.$V(this._handle);if(epos.y>hpos.y){this._viewport.scrollTop+=distance;}else{this._viewport.scrollTop-=distance;}},_ondrag:function(e){e.kill();this._dragOrigin=JX.$V(e);this._scrollOrigin=this._viewport.scrollTop;},_onmove:function(e){if(this._dragOrigin===null){return;}var
p=JX.$V(e);var
offset=(p.y-this._dragOrigin.y);var
ratio=offset/JX.Vector.getDim(this._bar).y;var
adjust=ratio*JX.Vector.getDim(this._content).y;if(this._shouldSnapback()){if(Math.abs(p.x-this._dragOrigin.x)>140){adjust=0;}}this._viewport.scrollTop=this._scrollOrigin+adjust;},_shouldSnapback:function(){return(navigator.platform.indexOf('Win')>-1);},_ondrop:function(){this._dragOrigin=null;this._showBar();},_onload:function(){var
viewport=this.getViewportNode();var
height=viewport.scrollHeight;var
visible=JX.Vector.getDim(viewport).y;if(this._lastHeight!==null&&this._lastHeight!=height){if(viewport.scrollTop>0){if((viewport.scrollTop+visible+64)>=this._lastHeight){viewport.scrollTop+=(height-this._lastHeight);}}}this._lastHeight=height;},_resizeViewport:function(){var
fdim=JX.Vector.getDim(this._frame);fdim.x+=JX.Scrollbar.getScrollbarControlWidth();fdim.setDim(this._viewport);},_resizeBar:function(){var
cdim=JX.Vector.getDim(this._content);var
spos=JX.Vector.getAggregateScrollForNode(this._viewport);var
vdim=JX.Vector.getDim(this._viewport);var
ratio=(vdim.y/cdim.y);ratio=ratio*(vdim.y/(vdim.y+4));var
offset=Math.round(ratio*spos.y)+2;var
size=Math.floor(ratio*vdim.y);if(size<cdim.y){this._handle.style.top=offset+'px';this._handle.style.height=size+'px';JX.DOM.show(this._bar);}else{JX.DOM.hide(this._bar);}},_showBar:function(){this._resizeBar();JX.DOM.alterClass(this._handle,'jx-scrollbar-visible',true);this._clearTimeout();this._timeout=setTimeout(JX.bind(this,this._hideBar),1000);},_hideBar:function(){if(this._dragOrigin!==null){return;}JX.DOM.alterClass(this._handle,'jx-scrollbar-visible',false);this._clearTimeout();},_clearTimeout:function(){if(this._timeout){clearTimeout(this._timeout);this._timeout=null;}},getContentNode:function(){return this._content||this._frame;},getViewportNode:function(){return this._viewport||this._frame;},scrollTo:function(scroll){if(this._viewport!==null){this._viewport.scrollTop=scroll;}else{this._frame.scrollTop=scroll;}return this;}}});JX.behavior('scrollbar',function(config){var
bar=new
JX.Scrollbar(JX.$(config.nodeID));if(config.isMainContent){bar.setAsScrollFrame();}});JX.behavior('durable-column',function(config,statics){if(statics.initialized){return;}else{statics.initialized=true;}var
userVisible=config.visible;var
userMinimize=config.minimize;var
show=null;var
loadThreadID=null;var
scrollbar=null;var
margin=JX.Scrollbar.getScrollbarControlMargin();var
quick=JX.$('phabricator-standard-page-body');function
_getColumnNode(){return JX.$('conpherence-durable-column');}function
_getColumnScrollNode(){var
column=_getColumnNode();return JX.DOM.find(column,'div','conpherence-durable-column-main');}function
_updateColumnVisibility(){var
new_value=(userVisible);if(new_value!==show){show=new_value;_drawColumn(show);}}function
_toggleColumn(){userVisible=!userVisible;_updateColumnVisibility();new
JX.Request(config.visibleURI).setData({value:(show?1:0)}).send();}function
_minimizeColumn(e){e.kill();userMinimize=!userMinimize;JX.DOM.alterClass(document.body,'minimize-column',userMinimize);JX.Stratcom.invoke('resize');if(!userMinimize){var
messages=_getColumnMessagesNode();scrollbar.scrollTo(messages.scrollHeight);}new
JX.Request(config.minimizeURI).setData({value:(userMinimize?1:0)}).send();}function
_drawColumn(visible){JX.DOM.alterClass(document.body,'with-durable-column',visible);var
column=_getColumnNode();if(visible){JX.DOM.show(column);threadManager.loadThreadByID(loadThreadID);}else{JX.DOM.hide(column);}JX.Quicksand.setFrame(visible?quick:null);JX.Stratcom.invoke('resize');}JX.Stratcom.listen('click','conpherence-persist-column',_toggleColumn);JX.Stratcom.listen('click','conpherence-minimize-window',_minimizeColumn);scrollbar=new
JX.Scrollbar(_getColumnScrollNode());JX.Quicksand.setFrame(userVisible?quick:null);JX.Quicksand.start(config.quicksandConfig);var
threadManager=new
JX.ConpherenceThreadManager();threadManager.setMessagesRootCallback(function(){return _getColumnMessagesNode();});threadManager.setLoadThreadURI('/conpherence/columnview/');threadManager.setWillLoadThreadCallback(function(){_markLoading(true);});threadManager.setDidLoadThreadCallback(function(r){var
column=_getColumnNode();var
new_column=JX.$H(r.content);JX.DOM.replace(column,new_column);if(show){JX.DOM.show(_getColumnNode());}else{JX.DOM.hide(_getColumnNode());}var
messages=_getColumnMessagesNode();scrollbar=new
JX.Scrollbar(_getColumnScrollNode());scrollbar.scrollTo(messages.scrollHeight);_markLoading(false);loadThreadID=threadManager.getLoadedThreadID();});threadManager.setDidUpdateThreadCallback(function(r){var
messages=_getColumnMessagesNode();scrollbar.scrollTo(messages.scrollHeight);});threadManager.setWillSendMessageCallback(function(){var
textarea=_getColumnTextareaNode();textarea.value='';_focusColumnTextareaNode();});threadManager.setDidSendMessageCallback(function(r,non_update){if(non_update){return;}var
messages=_getColumnMessagesNode();scrollbar.scrollTo(messages.scrollHeight);});threadManager.setWillUpdateWorkflowCallback(function(){JX.Stratcom.invoke('notification-panel-close');});threadManager.setDidUpdateWorkflowCallback(function(r){var
messages=_getColumnMessagesNode();scrollbar.scrollTo(messages.scrollHeight);JX.DOM.setContent(_getColumnTitleNode(),r.conpherence_title);});threadManager.start();JX.Stratcom.listen('click','conpherence-durable-column-header-action',function(e){e.kill();var
data=e.getNodeData('conpherence-durable-column-header-action');var
action=data.action;var
link=e.getNode('tag:a');var
params=null;switch(action){case'go_edit':threadManager.runUpdateWorkflowFromLink(link,{action:action,force_ajax:true,stage:'submit'});break;case'add_person':threadManager.runUpdateWorkflowFromLink(link,{action:action,stage:'submit'});break;case'go_conpherence':JX.$U(link.href).go();break;case'hide_column':JX.Stratcom.invoke('notification-panel-close');_toggleColumn();break;}});JX.Stratcom.listen('click','conpherence-durable-column-thread-icon',function(e){e.kill();var
icons=JX.DOM.scry(JX.$('conpherence-durable-column'),'a','conpherence-durable-column-thread-icon');var
data=e.getNodeData('conpherence-durable-column-thread-icon');var
cdata=null;for(var
i=0;i<icons.length;i++){cdata=JX.Stratcom.getData(icons[i]);JX.DOM.alterClass(icons[i],'selected',cdata.threadID==data.threadID);}JX.DOM.setContent(_getColumnTitleNode(),JX.$H(data.threadTitle));threadManager.loadThreadByID(data.threadID);});JX.Stratcom.listen('resize',null,_updateColumnVisibility);function
_getColumnBodyNode(){var
column=JX.$('conpherence-durable-column');return JX.DOM.find(column,'div','conpherence-durable-column-body');}function
_getColumnMessagesNode(){var
column=JX.$('conpherence-durable-column');return JX.DOM.find(column,'div','conpherence-durable-column-transactions');}function
_getColumnTitleNode(){var
column=JX.$('conpherence-durable-column');return JX.DOM.find(column,'div','conpherence-durable-column-header-text');}function
_getColumnFormNode(){var
column=JX.$('conpherence-durable-column');return JX.DOM.find(column,'form','conpherence-message-form');}function
_getColumnTextareaNode(){var
column=JX.$('conpherence-durable-column');return JX.DOM.find(column,'textarea','conpherence-durable-column-textarea');}function
_focusColumnTextareaNode(){var
textarea=_getColumnTextareaNode();setTimeout(function(){JX.DOM.focus(textarea);},1);}function
_markLoading(loading){var
column=_getColumnNode();JX.DOM.alterClass(column,'loading',loading);}function
_sendMessage(e){e.kill();var
form=_getColumnFormNode();threadManager.sendMessage(form,{});}JX.Stratcom.listen('click','conpherence-send-message',_sendMessage);JX.Stratcom.listen(['submit','didSyntheticSubmit'],'conpherence-message-form',_sendMessage);JX.Stratcom.listen('keydown','conpherence-message-form',function(e){if(e.getSpecialKey()!='return'){return;}var
raw=e.getRawEvent();if(raw.shiftKey){return;}e.kill();_sendMessage(e);});JX.Stratcom.listen(['keydown'],'conpherence-durable-column-textarea',function(e){threadManager.handleDraftKeydown(e);});JX.Stratcom.listen(['focus','blur'],'conpherence-durable-column-textarea',function(e){var
node=e.getTarget();if(e.getType()=='focus'){if(node.placeholder){node.placeholderStorage=node.placeholder;node.placeholder='';}}else{if(node.placeholderStorage){node.placeholder=node.placeholderStorage;node.placeholderStorage='';}}});JX.Stratcom.listen('quicksand-redraw',null,function(e){var
new_data=e.getData().newResponse;var
new_classes=new_data.bodyClasses;if(userMinimize){new_classes=new_classes+' minimize-column';}document.body.className=new_classes;JX.Title.setTitle(new_data.title);});_updateColumnVisibility();});JX.install('ConpherenceThreadManager',{construct:function(){if(__DEV__){if(JX.ConpherenceThreadManager._instance){JX.$E('ConpherenceThreadManager object is a singleton.');}}JX.ConpherenceThreadManager._instance=this;return this;},members:{_loadThreadURI:null,_loadedThreadID:null,_loadedThreadPHID:null,_latestTransactionID:null,_transactionIDMap:null,_transactionCache:null,_canEditLoadedThread:null,_updating:null,_messagesRootCallback:JX.bag,_willLoadThreadCallback:JX.bag,_didLoadThreadCallback:JX.bag,_didUpdateThreadCallback:JX.bag,_willSendMessageCallback:JX.bag,_didSendMessageCallback:JX.bag,_willUpdateWorkflowCallback:JX.bag,_didUpdateWorkflowCallback:JX.bag,setLoadThreadURI:function(uri){this._loadThreadURI=uri;return this;},getLoadThreadURI:function(){return this._loadThreadURI;},isThreadLoaded:function(){return Boolean(this._loadedThreadID);},isThreadIDLoaded:function(thread_id){return this._loadedThreadID==thread_id;},getLoadedThreadID:function(){return this._loadedThreadID;},setLoadedThreadID:function(id){this._loadedThreadID=id;return this;},getLoadedThreadPHID:function(){return this._loadedThreadPHID;},setLoadedThreadPHID:function(phid){this._loadedThreadPHID=phid;return this;},getLatestTransactionID:function(){return this._latestTransactionID;},setLatestTransactionID:function(id){this._latestTransactionID=id;return this;},_updateTransactionIDMap:function(transactions){var
loaded_id=this.getLoadedThreadID();if(!this._transactionIDMap[loaded_id]){this._transactionIDMap[this._loadedThreadID]={};}var
loaded_transaction_ids=this._transactionIDMap[loaded_id];var
transaction;for(var
ii=0;ii<transactions.length;ii++){transaction=transactions[ii];loaded_transaction_ids[JX.Stratcom.getData(transaction).id]=1;}this._transactionIDMap[this._loadedThreadID]=loaded_transaction_ids;return this;},_updateTransactionCache:function(transactions){var
transaction;for(var
ii=0;ii<transactions.length;ii++){transaction=transactions[ii];this._transactionCache[JX.Stratcom.getData(transaction).id]=transaction;}return this;},_getLoadedTransactions:function(){var
loaded_id=this.getLoadedThreadID();var
loaded_tx_ids=JX.keys(this._transactionIDMap[loaded_id]);loaded_tx_ids.sort(function(a,b){var
x=parseFloat(a);var
y=parseFloat(b);if(x>y){return 1;}if(x<y){return-1;}return 0;});var
transactions=[];for(var
ii=0;ii<loaded_tx_ids.length;ii++){transactions.push(this._transactionCache[loaded_tx_ids[ii]]);}return transactions;},_deleteTransactionCaches:function(id){delete
this._transactionCache[id];delete
this._transactionIDMap[this._loadedThreadID][id];return this;},setCanEditLoadedThread:function(bool){this._canEditLoadedThread=bool;return this;},getCanEditLoadedThread:function(){if(this._canEditLoadedThread===null){return false;}return this._canEditLoadedThread;},setMessagesRootCallback:function(callback){this._messagesRootCallback=callback;return this;},setWillLoadThreadCallback:function(callback){this._willLoadThreadCallback=callback;return this;},setDidLoadThreadCallback:function(callback){this._didLoadThreadCallback=callback;return this;},setDidUpdateThreadCallback:function(callback){this._didUpdateThreadCallback=callback;return this;},setWillSendMessageCallback:function(callback){this._willSendMessageCallback=callback;return this;},setDidSendMessageCallback:function(callback){this._didSendMessageCallback=callback;return this;},setWillUpdateWorkflowCallback:function(callback){this._willUpdateWorkflowCallback=callback;return this;},setDidUpdateWorkflowCallback:function(callback){this._didUpdateWorkflowCallback=callback;return this;},_getParams:function(base_params){if(this._latestTransactionID){base_params.latest_transaction_id=this._latestTransactionID;}return base_params;},start:function(){this._transactionIDMap={};this._transactionCache={};JX.Stratcom.listen('aphlict-server-message',null,JX.bind(this,function(e){var
message=e.getData();if(message.type!='message'){return;}if(message.threadPHID!=this._loadedThreadPHID){return;}if(message.messageID<=this._latestTransactionID){return;}if(this._updating&&this._updating.threadPHID==this._loadedThreadPHID){if(message.messageID>this._updating.knownID){this._updating.knownID=message.messageID;if(this._updating.active){return;}}}this._updateThread();}));JX.Stratcom.listen('aphlict-reconnect',null,JX.bind(this,function(){if(!this._loadedThreadPHID){return;}this._updateThread();}));JX.Stratcom.listen('click','show-older-messages',JX.bind(this,function(e){e.kill();var
data=e.getNodeData('show-older-messages');var
node=e.getNode('show-older-messages');JX.DOM.setContent(node,'Loading...');JX.DOM.alterClass(node,'conpherence-show-more-messages-loading',true);new
JX.Workflow(this._getMoreMessagesURI(),data).setHandler(JX.bind(this,function(r){this._deleteTransactionCaches(JX.Stratcom.getData(node).id);JX.DOM.remove(node);this._updateTransactions(r);})).start();}));JX.Stratcom.listen('click','show-newer-messages',JX.bind(this,function(e){e.kill();var
data=e.getNodeData('show-newer-messages');var
node=e.getNode('show-newer-messages');JX.DOM.setContent(node,'Loading...');JX.DOM.alterClass(node,'conpherence-show-more-messages-loading',true);new
JX.Workflow(this._getMoreMessagesURI(),data).setHandler(JX.bind(this,function(r){this._deleteTransactionCaches(JX.Stratcom.getData(node).id);JX.DOM.remove(node);this._updateTransactions(r);})).start();}));},_shouldUpdateDOM:function(r){if(this._updating&&this._updating.threadPHID==this._loadedThreadPHID){if(r.non_update){return false;}if(r.latest_transaction_id<this._updating.knownID){return false;}}return true;},_updateDOM:function(r){this._updateTransactions(r);this._updating.knownID=r.latest_transaction_id;this._latestTransactionID=r.latest_transaction_id;JX.Leader.broadcast('conpherence.message.'+r.latest_transaction_id,{type:'sound',data:r.sound.receive});JX.Stratcom.invoke('conpherence-redraw-aphlict',null,r.aphlictDropdownData);},_updateTransactions:function(r){var
new_transactions=JX.$H(r.transactions).getFragment().childNodes;this._updateTransactionIDMap(new_transactions);this._updateTransactionCache(new_transactions);var
transactions=this._getLoadedTransactions();JX.DOM.setContent(this._messagesRootCallback(),transactions);},cacheCurrentTransactions:function(){var
root=this._messagesRootCallback();var
transactions=JX.DOM.scry(root,'div','conpherence-transaction-view');this._updateTransactionIDMap(transactions);this._updateTransactionCache(transactions);},_updateThread:function(){var
params=this._getParams({action:'load',});var
workflow=new
JX.Workflow(this._getUpdateURI()).setData(params).setHandler(JX.bind(this,function(r){if(this._shouldUpdateDOM(r)){this._updateDOM(r);this._didUpdateThreadCallback(r);}}));this.syncWorkflow(workflow,'finally');},syncWorkflow:function(workflow,stage){this._updating={threadPHID:this._loadedThreadPHID,knownID:this._latestTransactionID,active:true};workflow.listen(stage,JX.bind(this,function(){var
need_sync=this._updating&&(this._updating.knownID>this._latestTransactionID);if(need_sync){return this._updateThread();}this._updating.active=false;}));workflow.start();},runUpdateWorkflowFromLink:function(link,params){params=this._getParams(params);this._willUpdateWorkflowCallback();var
workflow=new
JX.Workflow.newFromLink(link).setData(params).setHandler(JX.bind(this,function(r){if(this._shouldUpdateDOM(r)){this._updateDOM(r);this._didUpdateWorkflowCallback(r);}}));this.syncWorkflow(workflow,params.stage);},loadThreadByID:function(thread_id,force_reload){if(this.isThreadLoaded()&&this.isThreadIDLoaded(thread_id)&&!force_reload){return;}this._willLoadThreadCallback();var
params={};if(thread_id){params.id=thread_id;}params=this._getParams(params);var
handler=JX.bind(this,function(r){var
client=JX.Aphlict.getInstance();if(client){var
old_subs=client.getSubscriptions();var
new_subs=[];for(var
ii=0;ii<old_subs.length;ii++){if(old_subs[ii]==this._loadedThreadPHID){continue;}else{new_subs.push(old_subs[ii]);}}new_subs.push(r.threadPHID);client.clearSubscriptions(client.getSubscriptions());client.setSubscriptions(new_subs);}this._loadedThreadID=r.threadID;this._loadedThreadPHID=r.threadPHID;this._latestTransactionID=r.latestTransactionID;this._canEditLoadedThread=r.canEdit;JX.Stratcom.invoke('conpherence-redraw-aphlict',null,r.aphlictDropdownData);this._didLoadThreadCallback(r);this.cacheCurrentTransactions();if(force_reload){JX.Stratcom.invoke('hashchange');}});new
JX.Workflow(this.getLoadThreadURI()).setData(params).setHandler(handler).start();},sendMessage:function(form,params){var
inputs=JX.DOM.scry(form,'input');var
block_empty=true;for(var
i=0;i<inputs.length;i++){if(inputs[i].type!='hidden'){continue;}if(inputs[i].name=='action'&&inputs[i].value=='join_room'){block_empty=false;continue;}}var
textarea=JX.DOM.find(form,'textarea');if(block_empty&&!textarea.value.length){return;}params=this._getParams(params);var
keep_enabled=true;var
workflow=JX.Workflow.newFromForm(form,params,keep_enabled).setHandler(JX.bind(this,function(r){if(this._shouldUpdateDOM(r)){this._updateDOM(r);this._didSendMessageCallback(r);}else
if(r.non_update){this._didSendMessageCallback(r,true);}}));this.syncWorkflow(workflow,'finally');textarea.value='';this._willSendMessageCallback();},handleDraftKeydown:function(e){var
form=e.getNode('tag:form');var
data=e.getNodeData('tag:form');if(!data.preview){data.preview=new
JX.PhabricatorShapedRequest(this._getUpdateURI(),JX.bag,JX.bind(this,function(){var
data=JX.DOM.convertFormToDictionary(form);data.action='draft';data=this._getParams(data);return data;}));}data.preview.trigger();},_getUpdateURI:function(){return'/conpherence/update/'+this._loadedThreadID+'/';},_getMoreMessagesURI:function(){return'/conpherence/'+this._loadedThreadID+'/';}},statics:{_instance:null,getInstance:function(){var
self=JX.ConpherenceThreadManager;if(!self._instance){return null;}return self._instance;}}});JX.behavior('detect-timezone',function(config){var
offset=new
Date().getTimezoneOffset();var
ignore=config.ignore;if(ignore!==null){if(offset==ignore){return;}new
JX.Request('/settings/adjust/',JX.bag).setData({key:config.ignoreKey,value:''}).send();ignore=null;}if(offset==config.offset){return;}var
notification=new
JX.Notification().alterClassName('jx-notification-alert',true).setContent(config.message).setDuration(0);notification.listen('activate',function(){JX.Stratcom.context().kill();notification.hide();var
uri=config.uri+offset+'/';try{var
guess=Intl.DateTimeFormat().resolvedOptions().timeZone;uri=JX.$U(uri).setQueryParam('guess',guess);}catch(error){}new
JX.Workflow(uri).start();});notification.show();});JX.behavior('setup-check-https',function(config){var
server_https=config.server_https;var
client_uri=new
JX.URI(window.location.href);var
client_protocol=client_uri.getProtocol();var
client_https=(client_protocol==='https');if(server_https===client_https){return;}var
doc_link=JX.$N('a',{href:config.doc_href,target:'_blank'},config.doc_name);var
content=[config.message,' ',doc_link,];new
JX.Notification().alterClassName('jx-notification-alert',true).setContent(content).setDuration(0).show();});JX.behavior('aphlict-status',function(config){var
pht=JX.phtize(config.pht);function
update(){var
client=JX.Aphlict.getInstance();if(!client){return;}var
node;try{node=JX.$(config.nodeID);}catch(ignored){return;}var
status=client.getStatus();var
icon=config.icon[status];var
status_node=JX.$N('span',{className:'connection-status-text aphlict-connection-status-'+status},pht(status));var
icon_node=new
JX.PHUIXIconView().setIcon(icon['icon']).setColor(icon['color']).getNode();var
content=[icon_node,' ',status_node];JX.DOM.setContent(node,content);}JX.Aphlict.listen('didChangeStatus',update);update();});JX.behavior('user-menu',function(config){var
node=JX.$(config.menuID);var
list=JX.$H(config.menu.items).getFragment().firstChild;var
menu=new
JX.PHUIXDropdownMenu(node);menu.listen('open',function(){menu.setContent(list);});JX.Stratcom.listen('quicksand-redraw',null,function(e){var
data=e.getData();var
new_help=data.newResponse.helpItems;var
nodes;if(new_help){nodes=JX.$H(new_help.items).getFragment().firstChild.children;}else{nodes=[];}var
ii;var
tail=[];for(ii=list.children.length-1;ii>=0;ii--){var
node=list.children[ii];if(JX.Stratcom.hasSigil(node.firstChild,'help-item')){JX.DOM.remove(node);}if(JX.Stratcom.hasSigil(node.firstChild,'logout-item')){JX.DOM.remove(node);tail.push(node);}}while(nodes.length){list.appendChild(nodes[0]);}tail.reverse();for(ii=0;ii<tail.length;ii++){list.appendChild(tail[ii]);}});});JX.install('Favicon',{statics:{_favicon:null,setFavicon:function(favicon){var
self=JX.Favicon;self._favicon=favicon;self._update();},_update:function(){var
self=JX.Favicon;var
cur_favicon=JX.$('favicon');if(self._favicon===null){self._favicon=cur_favicon.href;}var
new_favicon=JX.$N('link',{href:self._favicon,id:'favicon',rel:'shortcut icon',});JX.DOM.replace(cur_favicon,new_favicon);}}});