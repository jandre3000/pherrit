JX.install('PhabricatorDragAndDropFileUpload',{construct:function(target){if(JX.DOM.isNode(target)){this._node=target;}else{this._sigil=target;}},events:['didBeginDrag','didEndDrag','willUpload','progress','didUpload','didError'],statics:{isSupported:function(){return!!window.FileList;},isPasteSupported:function(){return!!window.FileList;}},members:{_node:null,_sigil:null,_depth:0,_isEnabled:false,setIsEnabled:function(bool){this._isEnabled=bool;return this;},getIsEnabled:function(){return this._isEnabled;},_updateDepth:function(delta){if(this._depth===0&&delta>0){this.invoke('didBeginDrag',this._getTarget());}this._depth+=delta;if(this._depth===0&&delta<0){this.invoke('didEndDrag',this._getTarget());}},_getTarget:function(){return this._target||this._node;},start:function(){function
contains(container,child){do{if(child===container){return true;}child=child.parentNode;}while(child);return false;}var
on_click=JX.bind(this,function(e){if(!this.getIsEnabled()){return;}if(this._depth){e.kill();this._updateDepth(-this._depth);}});var
on_dragenter=JX.bind(this,function(e){if(!this.getIsEnabled()){return;}if(!this._node){var
target=e.getNode(this._sigil);if(target!==this._target){this._updateDepth(-this._depth);this._target=target;}}if(contains(this._getTarget(),e.getTarget())){this._updateDepth(1);}});var
on_dragleave=JX.bind(this,function(e){if(!this.getIsEnabled()){return;}if(!this._getTarget()){return;}if(contains(this._getTarget(),e.getTarget())){this._updateDepth(-1);}});var
on_dragover=JX.bind(this,function(e){if(!this.getIsEnabled()){return;}e.getRawEvent().dataTransfer.dropEffect='copy';e.kill();});var
on_drop=JX.bind(this,function(e){if(!this.getIsEnabled()){return;}e.kill();var
files=e.getRawEvent().dataTransfer.files;for(var
ii=0;ii<files.length;ii++){this.sendRequest(files[ii]);}this._updateDepth(-this._depth);});if(this._node){JX.DOM.listen(this._node,'click',null,on_click);JX.DOM.listen(this._node,'dragenter',null,on_dragenter);JX.DOM.listen(this._node,'dragleave',null,on_dragleave);JX.DOM.listen(this._node,'dragover',null,on_dragover);JX.DOM.listen(this._node,'drop',null,on_drop);}else{JX.Stratcom.listen('click',this._sigil,on_click);JX.Stratcom.listen('dragenter',this._sigil,on_dragenter);JX.Stratcom.listen('dragleave',this._sigil,on_dragleave);JX.Stratcom.listen('dragover',this._sigil,on_dragover);JX.Stratcom.listen('drop',this._sigil,on_drop);}if(JX.PhabricatorDragAndDropFileUpload.isPasteSupported()&&this._node){JX.DOM.listen(this._node,'paste',null,JX.bind(this,function(e){if(!this.getIsEnabled()){return;}var
clipboard=e.getRawEvent().clipboardData;if(!clipboard){return;}var
text=clipboard.getData('text/plain').toString();if(text.length){return;}if(!clipboard.items){return;}for(var
ii=0;ii<clipboard.items.length;ii++){var
item=clipboard.items[ii];if(!/^image\//.test(item.type)){continue;}var
spec=item.getAsFile();if(!spec.name){spec.name='pasted_file';}this.sendRequest(spec);}}));}this.setIsEnabled(true);},sendRequest:function(spec){var
file=new
JX.PhabricatorFileUpload().setRawFileObject(spec).setName(spec.name).setTotalBytes(spec.size);var
threshold=this.getChunkThreshold();if(threshold&&(file.getTotalBytes()>threshold)){this._allocateFile(file);}else{this._sendDataRequest(file);}},_allocateFile:function(file){file.setStatus('allocate').update();this.invoke('willUpload',file);var
alloc_uri=this._getUploadURI(file).setQueryParam('allocate',1);new
JX.Workflow(alloc_uri).setHandler(JX.bind(this,this._didAllocateFile,file)).start();},_getUploadURI:function(file){var
uri=JX.$U(this.getURI()).setQueryParam('name',file.getName()).setQueryParam('length',file.getTotalBytes());if(this.getViewPolicy()){uri.setQueryParam('viewPolicy',this.getViewPolicy());}if(file.getAllocatedPHID()){uri.setQueryParam('phid',file.getAllocatedPHID());}return uri;},_didAllocateFile:function(file,r){var
phid=r.phid;var
upload=r.upload;if(!upload){if(phid){this._completeUpload(file,r);}else{this._failUpload(file,r);}return;}else{if(phid){file.setAllocatedPHID(phid);this._loadChunks(file);}else{this._sendDataRequest(file);}}},_loadChunks:function(file){file.setStatus('chunks').update();var
chunks_uri=this._getUploadURI(file).setQueryParam('querychunks',1);new
JX.Workflow(chunks_uri).setHandler(JX.bind(this,this._didLoadChunks,file)).start();},_didLoadChunks:function(file,r){file.setChunks(r);this._uploadNextChunk(file);},_uploadNextChunk:function(file){var
chunks=file.getChunks();var
chunk;for(var
ii=0;ii<chunks.length;ii++){chunk=chunks[ii];if(!chunk.complete){this._uploadChunk(file,chunk);break;}}},_uploadChunk:function(file,chunk,callback){file.setStatus('upload').update();var
chunkup_uri=this._getUploadURI(file).setQueryParam('uploadchunk',1).setQueryParam('__upload__',1).setQueryParam('byteStart',chunk.byteStart).toString();var
callback=JX.bind(this,this._didUploadChunk,file,chunk);var
req=new
JX.Request(chunkup_uri,callback);var
seen_bytes=0;var
onprogress=JX.bind(this,function(progress){file.addUploadedBytes(progress.loaded-seen_bytes).update();seen_bytes=progress.loaded;this.invoke('progress',file);});req.listen('error',JX.bind(this,this._onUploadError,req,file));req.listen('uploadprogress',onprogress);var
blob=file.getRawFileObject().slice(chunk.byteStart,chunk.byteEnd);req.setRawData(blob).send();},_didUploadChunk:function(file,chunk,r){file.didCompleteChunk(chunk);if(r.complete){this._completeUpload(file,r);}else{this._uploadNextChunk(file);}},_sendDataRequest:function(file){file.setStatus('uploading').update();this.invoke('willUpload',file);var
up_uri=this._getUploadURI(file).setQueryParam('__upload__',1).toString();var
onupload=JX.bind(this,function(r){if(r.error){this._failUpload(file,r);}else{this._completeUpload(file,r);}});var
req=new
JX.Request(up_uri,onupload);var
onprogress=JX.bind(this,function(progress){file.setTotalBytes(progress.total).setUploadedBytes(progress.loaded).update();this.invoke('progress',file);});req.listen('error',JX.bind(this,this._onUploadError,req,file));req.listen('uploadprogress',onprogress);req.setRawData(file.getRawFileObject()).send();},_completeUpload:function(file,r){file.setID(r.id).setPHID(r.phid).setURI(r.uri).setMarkup(r.html).setStatus('done').setTargetNode(this._getTarget()).update();this.invoke('didUpload',file);},_failUpload:function(file,r){file.setStatus('error').setError(r.error).update();this.invoke('didError',file);},_onUploadError:function(req,file,error){file.setStatus('error');if(error){file.setError(error.code+': '+error.info);}else{var
xhr=req.getTransport();if(xhr.responseText){file.setError('Server responded: '+xhr.responseText);}}file.update();this.invoke('didError',file);}},properties:{URI:null,activatedClass:null,viewPolicy:null,chunkThreshold:null}});JX.install('PhabricatorShapedRequest',{construct:function(uri,callback,data_callback){this._uri=uri;this._callback=callback;this._dataCallback=data_callback;},events:['error'],members:{_callback:null,_dataCallback:null,_request:null,_min:null,_defer:null,_last:null,start:function(){this.trigger();},trigger:function(){clearTimeout(this._defer);var
data=this._dataCallback();var
waiting=(this._request);var
recent=(this._min&&(new
Date().getTime()<this._min));if(!waiting&&!recent&&this.shouldSendRequest(this._last,data)){this._last=data;this._request=new
JX.Request(this._uri,JX.bind(this,function(r){this._callback(r);this._min=new
Date().getTime()+this.getRateLimit();clearTimeout(this._defer);this._defer=setTimeout(JX.bind(this,this.trigger),this.getRateLimit());}));this._request.listen('error',JX.bind(this,function(error){this.invoke('error',error,this);}));this._request.listen('finally',JX.bind(this,function(){this._request=null;}));this._request.setData(data);this._request.setTimeout(this.getRequestTimeout());var
routable=this._request.getRoutable();routable.setType('draft').setPriority(750);JX.Router.getInstance().queue(routable);}else{this._defer=setTimeout(JX.bind(this,this.trigger),this.getFrequency());}},shouldSendRequest:function(last,data){if(last===null){return true;}for(var
k
in
last){if(data[k]!==last[k]){return true;}}return false;}},properties:{rateLimit:500,frequency:1000,requestTimeout:20000}});JX.behavior('differential-feedback-preview',function(config){var
action=JX.$(config.action);var
content=JX.$(config.content);var
previewTokenizers={};var
field;for(field
in
config.previewTokenizers){var
tokenizer=JX.$(config.previewTokenizers[field]);previewTokenizers[field]=JX.Stratcom.getData(tokenizer).tokenizer;}var
callback=function(r){var
preview=JX.$(config.preview);var
data=getdata();var
hide=true;for(var
field
in
data){if(field=='action'){continue;}if(data[field]){hide=false;}}if(hide){JX.DOM.hide(preview);}else{JX.DOM.setContent(preview,JX.$H(r));JX.Stratcom.invoke('differential-preview-update',null,{container:preview});JX.DOM.show(preview);}};var
getdata=function(){var
data={content:content.value,action:action.value};for(var
field
in
previewTokenizers){data[field]=JX.keys(previewTokenizers[field].getTokens()).join(',');}return data;};var
request=new
JX.PhabricatorShapedRequest(config.uri,callback,getdata);var
trigger=JX.bind(request,request.trigger);JX.DOM.listen(content,'keydown',null,trigger);JX.DOM.listen(action,'change',null,trigger);for(field
in
previewTokenizers){previewTokenizers[field].listen('change',trigger);}request.start();function
refreshInlinePreview(){new
JX.Request(config.inlineuri,function(r){var
inline=JX.$(config.inline);JX.DOM.setContent(inline,JX.$H(r));JX.Stratcom.invoke('differential-preview-update',null,{container:inline});updateLinks();JX.Stratcom.invoke('resize');}).setTimeout(5000).send();}function
updateLinks(){var
inline=JX.$(config.inline);var
links=JX.DOM.scry(inline,'a','differential-inline-preview-jump');for(var
ii=0;ii<links.length;ii++){var
data=JX.Stratcom.getData(links[ii]);try{JX.$(data.anchor);links[ii].href='#'+data.anchor;JX.DOM.setContent(links[ii],'View');}catch(ignored){}}}JX.Stratcom.listen('differential-inline-comment-update',null,refreshInlinePreview);JX.Stratcom.listen('differential-inline-comment-refresh',null,updateLinks);refreshInlinePreview();});JX.behavior('differential-populate',function(config,statics){var
onredraw=function(page_id){if(statics.pageID===page_id){return;}var
ii;var
old_lists=get_lists(statics.pageID);for(ii=0;ii<old_lists.length;ii++){old_lists[ii].sleep();}statics.pageID=null;if(statics.pages.hasOwnProperty(page_id)){var
new_lists=get_lists(page_id);for(ii=0;ii<new_lists.length;ii++){new_lists[ii].wake();}statics.pageID=page_id;}};var
get_lists=function(page_id){if(page_id===null){return[];}return statics.pages[page_id]||[];};if(!statics.installed){statics.installed=true;statics.pages={};statics.pageID=null;JX.Stratcom.listen('quicksand-redraw',null,function(e){onredraw(e.getData().newResponseID);});}var
changeset_list=new
JX.DiffChangesetList().setTranslations(JX.phtize(config.pht)).setInlineURI(config.inlineURI).setInlineListURI(config.inlineListURI);var
page_id=JX.Quicksand.getCurrentPageID();statics.pages[page_id]=[changeset_list];onredraw(page_id);for(var
ii=0;ii<config.changesetViewIDs.length;ii++){var
id=config.changesetViewIDs[ii];var
node=JX.$(id);var
changeset=changeset_list.newChangesetForNode(node);if(changeset.shouldAutoload()){changeset.setStabilize(true).load();}}var
highlighted=null;var
highlight_class=null;JX.Stratcom.listen(['mouseover','mouseout'],['differential-changeset','tag:td'],function(e){var
t=e.getTarget();if(!t.className.match(/cov|copy/)){return;}if(e.getType()=='mouseout'){JX.Tooltip.hide();if(highlighted){JX.DOM.alterClass(highlighted,highlight_class,false);highlighted=null;}}else{highlight_class=null;var
msg;var
align='W';var
sibling='previousSibling';var
width=120;if(t.className.match(/cov-C/)){msg='Covered';highlight_class='source-cov-C';}else
if(t.className.match(/cov-U/)){msg='Not Covered';highlight_class='source-cov-U';}else
if(t.className.match(/cov-N/)){msg='Not Executable';highlight_class='source-cov-N';}else{var
match=/new-copy|new-move/.exec(t.className);if(match){sibling='nextSibling';width=500;msg=JX.Stratcom.getData(t).msg;highlight_class=match[0];}}if(msg){JX.Tooltip.show(t,width,align,msg);}if(highlight_class){highlighted=t[sibling];JX.DOM.alterClass(highlighted,highlight_class,true);}}});});JX.behavior('differential-diff-radios',function(config){JX.Stratcom.listen('click','differential-new-radio',function(e){var
target=e.getTarget();var
adjust;var
node;var
reset=false;for(var
ii=0;ii<config.radios.length;ii++){node=JX.$(config.radios[ii]);if(parseInt(node.value,10)>=parseInt(target.value,10)){if(node.checked){node.checked=false;reset=true;}node.disabled='disabled';}else{node.disabled='';if(!adjust||adjust.value<node.value){adjust=node;}}}if(reset&&adjust){adjust.checked='checked';}});});JX.behavior('aphront-drag-and-drop-textarea',function(config){var
target=JX.$(config.target);if(JX.PhabricatorDragAndDropFileUpload.isSupported()){var
drop=new
JX.PhabricatorDragAndDropFileUpload(target).setURI(config.uri).setChunkThreshold(config.chunkThreshold);drop.listen('didBeginDrag',function(){JX.DOM.alterClass(target,config.activatedClass,true);});drop.listen('didEndDrag',function(){JX.DOM.alterClass(target,config.activatedClass,false);});drop.listen('didUpload',function(file){JX.TextAreaUtils.insertFileReference(target,file);});drop.start();}});JX.behavior('phabricator-object-selector',function(config){var
n=0;var
phids={};var
display=[];var
handles=config.handles;for(var
k
in
handles){phids[k]=true;}var
query_timer=null;var
query_delay=50;var
inputs=JX.DOM.scry(JX.$(config.form),'input','aphront-dialog-application-input');var
phid_input;for(var
ii=0;ii<inputs.length;ii++){if(inputs[ii].name=='phids'){phid_input=inputs[ii];break;}}var
last_value=JX.$(config.query).value;function
onreceive(seq,r){if(seq!=n){return;}display=[];for(var
k
in
r){handles[r[k].phid]=r[k];display.push({phid:r[k].phid});}redrawList(true);}function
redrawAttached(){var
attached=[];for(var
k
in
phids){attached.push(renderHandle(handles[k],false).item);}if(!attached.length){attached=renderNote('Nothing attached.');}JX.DOM.setContent(JX.$(config.current),attached);phid_input.value=JX.keys(phids).join(';');}function
redrawList(rebuild){var
ii;var
content;if(rebuild){if(display.length){var
handle;content=[];for(ii=0;ii<display.length;ii++){handle=handles[display[ii].phid];display[ii].node=renderHandle(handle,true);content.push(display[ii].node.item);}}else{content=renderNote('No results.');}JX.DOM.setContent(JX.$(config.results),content);}var
phid;var
is_disabled;var
button;var
at_maximum=!canSelectMore();for(ii=0;ii<display.length;ii++){phid=display[ii].phid;is_disabled=false;if(phids.hasOwnProperty(phid)){is_disabled=true;}if(at_maximum){is_disabled=true;}button=display[ii].node.button;JX.DOM.alterClass(button,'disabled',is_disabled);button.disabled=is_disabled;}}function
renderHandle(h,attach){var
some_icon=JX.$N('span',{className:'phui-icon-view phui-font-fa '+'fa-external-link phabricator-object-selector-popicon'},'');var
view_object_link=JX.$N('a',{href:h.uri,target:'_blank'},some_icon);var
select_object_link=JX.$N('a',{href:h.uri,sigil:'object-attacher'},h.name);var
select_object_button=JX.$N('a',{href:'#',sigil:'object-attacher',className:'button small button-grey'},attach?'Select':'Remove');var
cells=[JX.$N('td',{},view_object_link),JX.$N('th',{},select_object_link),JX.$N('td',{},select_object_button)];var
table=JX.$N('table',{className:'phabricator-object-selector-handle'});table.appendChild(JX.$N('tr',{sigil:'object-attach-row',className:'phabricator-object-selector-row',meta:{handle:h,table:table}},cells));return{item:table,button:select_object_button};}function
renderNote(note){return JX.$N('div',{className:'object-selector-nothing'},note);}function
sendQuery(){query_timer=null;JX.DOM.setContent(JX.$(config.results),renderNote('Loading...'));new
JX.Request(config.uri,JX.bind(null,onreceive,++n)).setData({filter:JX.$(config.filter).value,exclude:config.exclude,query:JX.$(config.query).value}).send();}function
canSelectMore(){if(!config.maximum){return true;}if(JX.keys(phids).length<config.maximum){return true;}return false;}JX.DOM.listen(JX.$(config.results),'click','object-attacher',function(e){e.kill();var
data=e.getNodeData('object-attach-row');var
phid=data.handle.phid;if(phids[phid]){return;}if(!canSelectMore()){return;}phids[phid]=true;redrawList(false);redrawAttached();});JX.DOM.listen(JX.$(config.current),'click','object-attacher',function(e){e.kill();var
data=e.getNodeData('object-attach-row');var
phid=data.handle.phid;delete
phids[phid];redrawList(false);redrawAttached();});JX.DOM.listen(JX.$(config.filter),'change',null,function(e){e.kill();sendQuery();});JX.DOM.listen(JX.$(config.query),['change','keydown','keyup','keypress'],null,function(){var
cur_value=JX.$(config.query).value;if(last_value==cur_value){return;}last_value=cur_value;clearTimeout(query_timer);query_timer=setTimeout(sendQuery,query_delay);});sendQuery();redrawList(true);redrawAttached();});JX.behavior('repository-crossreference',function(config,statics){var
highlighted;var
linked=[];function
isMacOS(){return(navigator.platform.indexOf('Mac')>-1);}function
isHighlightModifierKey(e){var
signal_key;if(isMacOS()){signal_key=91;}else{signal_key=17;}return(e.getRawEvent().keyCode===signal_key);}function
hasHighlightModifierKey(e){if(isMacOS()){return e.getRawEvent().metaKey;}else{return e.getRawEvent().ctrlKey;}}var
classHighlight='crossreference-item';var
classMouseCursor='crossreference-cursor';var
class_map={nc:'class',nf:'function',na:null,nb:'builtin',n:null};function
link(element,lang){JX.DOM.alterClass(element,'repository-crossreference',true);linked.push(element);JX.DOM.listen(element,['mouseover','mouseout','click'],'tag:span',function(e){if(e.getType()==='mouseout'){unhighlight();return;}if(!hasHighlightModifierKey(e)){return;}var
target=e.getTarget();try{if(JX.DOM.findAbove(target,'div','differential-inline-comment')){return;}}catch(ex){}if(JX.DOM.isNode(target,'span')&&(target.className==='bright')){target=target.parentNode;}if(e.getType()==='mouseover'){while(target&&target!==document.body){if(JX.DOM.isNode(target,'span')&&(target.className
in
class_map)){highlighted=target;JX.DOM.alterClass(highlighted,classHighlight,true);break;}target=target.parentNode;}}else
if(e.getType()==='click'){openSearch(target,{lang:lang});}});}function
unhighlight(){highlighted&&JX.DOM.alterClass(highlighted,classHighlight,false);highlighted=null;}function
openSearch(target,context){var
symbol=target.textContent||target.innerText;context=context||{};context.lang=context.lang||null;context.repositories=context.repositories||(config&&config.repositories)||[];var
query=JX.copy({},context);if(query.repositories.length){query.repositories=query.repositories.join(',');}else{delete
query.repositories;}query.jump=true;var
c=target.className;c=c.replace(classHighlight,'').trim();if(class_map[c]){query.type=class_map[c];}if(target.hasAttribute('data-symbol-context')){query.context=target.getAttribute('data-symbol-context');}if(target.hasAttribute('data-symbol-name')){symbol=target.getAttribute('data-symbol-name');}var
line=getLineNumber(target);if(line!==null){query.line=line;}if(!query.hasOwnProperty('path')){var
path=getPath(target);if(path!==null){query.path=path;}}var
char=getChar(target);if(char!==null){query.char=char;}var
uri=JX.$U('/diffusion/symbol/'+symbol+'/');uri.addQueryParams(query);window.open(uri.toString());}function
linkAll(){var
blocks=JX.DOM.scry(document.body,'div','remarkup-code-block');for(var
i=0;i<blocks.length;++i){if(blocks[i].hasAttribute('data-code-lang')){var
lang=blocks[i].getAttribute('data-code-lang');link(blocks[i],lang);}}}function
getLineNumber(target){var
cell=JX.DOM.findAbove(target,'td');if(!cell){return null;}var
row=JX.DOM.findAbove(target,'tr');if(!row){return null;}var
ii;var
cell_list=[];for(ii=0;ii<row.childNodes.length;ii++){cell_list.push(row.childNodes[ii]);}cell_list.reverse();var
found=false;for(ii=0;ii<cell_list.length;ii++){if(cell_list[ii]===cell){found=true;}if(found&&JX.DOM.isType(cell_list[ii],'th')){var
int_value=parseInt(cell_list[ii].textContent,10);if(int_value){return int_value;}}}return null;}function
getPath(target){var
changeset;try{changeset=JX.DOM.findAbove(target,'div','differential-changeset');return JX.Stratcom.getData(changeset).path;}catch(ex){}return null;}function
getChar(target){var
cell=JX.DOM.findAbove(target,'td');if(!cell){return null;}var
char=1;for(var
ii=0;ii<cell.childNodes.length;ii++){var
node=cell.childNodes[ii];if(node===target){return char;}var
content=''+node.textContent;content=content.replace(/\u200B/g,'');char+=content.length;}return null;}JX.Stratcom.listen('differential-preview-update',null,function(e){linkAll(e.getData().container);});JX.Stratcom.listen(['keydown','keyup'],null,function(e){if(!isHighlightModifierKey(e)){return;}setCursorMode(e.getType()==='keydown');if(!statics.active){unhighlight();}});JX.Stratcom.listen('blur',null,function(e){if(e.getTarget()){return;}unhighlight();setCursorMode(false);});function
setCursorMode(active){statics.active=active;linked.forEach(function(element){JX.DOM.alterClass(element,classMouseCursor,statics.active);});}if(config&&config.container){link(JX.$(config.container),config.lang);}JX.Stratcom.listen(['mouseover','mouseout','click'],['has-symbols','tag:span'],function(e){var
type=e.getType();if(type==='mouseout'){unhighlight();return;}if(!hasHighlightModifierKey(e)){return;}var
target=e.getTarget();try{if(JX.DOM.findAbove(target,'div','differential-inline-comment')){return;}}catch(ex){}if(JX.DOM.isNode(target,'span')&&(target.className==='bright')){target=target.parentNode;}if(type==='click'){openSearch(target,e.getNodeData('has-symbols').symbols);e.kill();return;}if(e.getType()==='mouseover'){while(target&&target!==document.body){if(!JX.DOM.isNode(target,'span')){target=target.parentNode;continue;}if(!class_map.hasOwnProperty(target.className)){target=target.parentNode;continue;}highlighted=target;JX.DOM.alterClass(highlighted,classHighlight,true);break;}}});});JX.behavior('differential-user-select',function(){var
unselectable;function
isOnRight(node){return node.previousSibling&&node.parentNode.firstChild!=node.previousSibling;}JX.Stratcom.listen('mousedown',null,function(e){var
key='differential-unselectable';if(unselectable){JX.DOM.alterClass(unselectable,key,false);}var
diff=e.getNode('differential-diff');var
td=e.getNode('tag:td');if(diff&&td&&isOnRight(td)){unselectable=diff;JX.DOM.alterClass(diff,key,true);}});});JX.behavior('aphront-more',function(){JX.Stratcom.listen('click','aphront-more-view-show-more',function(e){e.kill();var
node=e.getNode('aphront-more-view');var
more=JX.$H(e.getNodeData('aphront-more-view-show-more').more);JX.DOM.setContent(node,more);});});JX.install('DiffInline',{construct:function(){},members:{_id:null,_phid:null,_changesetID:null,_row:null,_number:null,_length:null,_displaySide:null,_isNewFile:null,_undoRow:null,_replyToCommentPHID:null,_originalText:null,_snippet:null,_isDeleted:false,_isInvisible:false,_isLoading:false,_changeset:null,_isCollapsed:false,_isDraft:null,_isDraftDone:null,_isFixed:null,_isEditing:false,_isNew:false,_isSynthetic:false,_isHidden:false,bindToRow:function(row){this._row=row;var
row_data=JX.Stratcom.getData(row);row_data.inline=this;this._isCollapsed=row_data.hidden||false;var
comment=JX.DOM.find(row,'div','differential-inline-comment');var
data=JX.Stratcom.getData(comment);this._id=data.id;this._phid=data.phid;var
td=comment.parentNode;var
th=td.previousSibling;if(th.parentNode.firstChild!=th){this._displaySide='right';}else{this._displaySide='left';}this._number=parseInt(data.number,10);this._length=parseInt(data.length,10);this._originalText=data.original;this._isNewFile=(this.getDisplaySide()=='right')||(data.left!=data.right);this._replyToCommentPHID=data.replyToCommentPHID;this._isDraft=data.isDraft;this._isFixed=data.isFixed;this._isGhost=data.isGhost;this._isSynthetic=data.isSynthetic;this._isDraftDone=data.isDraftDone;this._changesetID=data.changesetID;this._isNew=false;this._snippet=data.snippet;this.setInvisible(false);return this;},isDraft:function(){return this._isDraft;},isDone:function(){return this._isFixed;},isEditing:function(){return this._isEditing;},isDeleted:function(){return this._isDeleted;},isSynthetic:function(){return this._isSynthetic;},isDraftDone:function(){return this._isDraftDone;},isHidden:function(){return this._isHidden;},isGhost:function(){return this._isGhost;},bindToRange:function(data){this._displaySide=data.displaySide;this._number=parseInt(data.number,10);this._length=parseInt(data.length,10);this._isNewFile=data.isNewFile;this._changesetID=data.changesetID;this._isNew=true;var
parent_row=JX.DOM.findAbove(data.target,'tr');var
target_row=parent_row.nextSibling;while(target_row&&JX.Stratcom.hasSigil(target_row,'inline-row')){target_row=target_row.nextSibling;}var
row=this._newRow();parent_row.parentNode.insertBefore(row,target_row);this.setInvisible(true);return this;},bindToReply:function(inline){this._displaySide=inline._displaySide;this._number=inline._number;this._length=inline._length;this._isNewFile=inline._isNewFile;this._changesetID=inline._changesetID;this._isNew=true;this._replyToCommentPHID=inline._phid;var
changeset=this.getChangeset();var
ancestor_map={};var
ancestor=inline;var
reply_phid;while(ancestor){reply_phid=ancestor.getReplyToCommentPHID();if(!reply_phid){break;}ancestor_map[reply_phid]=true;ancestor=changeset.getInlineByPHID(reply_phid);}var
parent_row=inline._row;var
target_row=parent_row.nextSibling;while(target_row&&JX.Stratcom.hasSigil(target_row,'inline-row')){var
target=changeset.getInlineForRow(target_row);reply_phid=target.getReplyToCommentPHID();if(ancestor_map.hasOwnProperty(reply_phid)){break;}target_row=target_row.nextSibling;}var
row=this._newRow();parent_row.parentNode.insertBefore(row,target_row);this.setInvisible(true);return this;},setChangeset:function(changeset){this._changeset=changeset;return this;},getChangeset:function(){return this._changeset;},setEditing:function(editing){this._isEditing=editing;return this;},setHidden:function(hidden){this._isHidden=hidden;this._redraw();return this;},canReply:function(){if(!this._hasAction('reply')){return false;}return true;},canEdit:function(){if(!this._hasAction('edit')){return false;}return true;},canDone:function(){if(!JX.DOM.scry(this._row,'input','differential-inline-done').length){return false;}return true;},canCollapse:function(){if(!JX.DOM.scry(this._row,'a','hide-inline').length){return false;}return true;},getRawText:function(){return this._originalText;},_hasAction:function(action){var
nodes=JX.DOM.scry(this._row,'a','differential-inline-'+action);return(nodes.length>0);},_newRow:function(){var
attributes={sigil:'inline-row'};var
row=JX.$N('tr',attributes);JX.Stratcom.getData(row).inline=this;this._row=row;this._id=null;this._phid=null;this._isCollapsed=false;this._originalText=null;return row;},setCollapsed:function(collapsed){this._isCollapsed=collapsed;var
op;if(collapsed){op='hide';}else{op='show';}var
inline_uri=this._getInlineURI();var
comment_id=this._id;new
JX.Workflow(inline_uri,{op:op,ids:comment_id}).setHandler(JX.bag).start();this._redraw();this._didUpdate(true);},isCollapsed:function(){return this._isCollapsed;},toggleDone:function(){var
uri=this._getInlineURI();var
data={op:'done',id:this._id};var
ondone=JX.bind(this,this._ondone);new
JX.Workflow(uri,data).setHandler(ondone).start();},_ondone:function(response){var
checkbox=JX.DOM.find(this._row,'input','differential-inline-done');checkbox.checked=(response.isChecked?'checked':null);var
comment=JX.DOM.findAbove(checkbox,'div','differential-inline-comment');JX.DOM.alterClass(comment,'inline-is-done',response.isChecked);JX.DOM.alterClass(comment,'inline-state-is-draft',response.draftState);this._isFixed=response.isChecked;this._isDraftDone=!!response.draftState;this._didUpdate();},create:function(text){var
uri=this._getInlineURI();var
handler=JX.bind(this,this._oncreateresponse);var
data=this._newRequestData('new',text);this.setLoading(true);new
JX.Request(uri,handler).setData(data).send();},reply:function(text){var
changeset=this.getChangeset();return changeset.newInlineReply(this,text);},edit:function(text){var
uri=this._getInlineURI();var
handler=JX.bind(this,this._oneditresponse);var
data=this._newRequestData('edit',text||null);this.setLoading(true);new
JX.Request(uri,handler).setData(data).send();},delete:function(is_ref){var
uri=this._getInlineURI();var
handler=JX.bind(this,this._ondeleteresponse);var
op;if(is_ref){op='refdelete';}else{op='delete';}var
data=this._newRequestData(op);this.setLoading(true);new
JX.Workflow(uri,data).setHandler(handler).start();},getDisplaySide:function(){return this._displaySide;},getLineNumber:function(){return this._number;},getLineLength:function(){return this._length;},isNewFile:function(){return this._isNewFile;},getID:function(){return this._id;},getPHID:function(){return this._phid;},getChangesetID:function(){return this._changesetID;},getReplyToCommentPHID:function(){return this._replyToCommentPHID;},setDeleted:function(deleted){this._isDeleted=deleted;this._redraw();return this;},setInvisible:function(invisible){this._isInvisible=invisible;this._redraw();return this;},setLoading:function(loading){this._isLoading=loading;this._redraw();return this;},_newRequestData:function(operation,text){return{op:operation,id:this._id,on_right:((this.getDisplaySide()=='right')?1:0),renderer:this.getChangeset().getRenderer(),number:this.getLineNumber(),length:this.getLineLength(),is_new:this.isNewFile(),changesetID:this.getChangesetID(),replyToCommentPHID:this.getReplyToCommentPHID()||'',text:text||''};},_oneditresponse:function(response){var
rows=JX.$H(response).getNode();this._drawEditRows(rows);this.setLoading(false);this.setInvisible(true);},_oncreateresponse:function(response){var
rows=JX.$H(response).getNode();this._drawEditRows(rows);},_ondeleteresponse:function(){this._drawUndeleteRows();this.setLoading(false);this.setDeleted(true);this._didUpdate();},_drawUndeleteRows:function(){return this._drawUndoRows('undelete',this._row);},_drawUneditRows:function(text){return this._drawUndoRows('unedit',null,text);},_drawUndoRows:function(mode,cursor,text){var
templates=this.getChangeset().getUndoTemplates();var
template;if(this.getDisplaySide()=='right'){template=templates.r;}else{template=templates.l;}template=JX.$H(template).getNode();this._undoRow=this._drawRows(template,cursor,mode,text);},_drawContentRows:function(rows){return this._drawRows(rows,null,'content');},_drawEditRows:function(rows){this.setEditing(true);return this._drawRows(rows,null,'edit');},_drawRows:function(rows,cursor,type,text){var
first_row=JX.DOM.scry(rows,'tr')[0];var
first_meta;var
row=first_row;var
anchor=cursor||this._row;cursor=cursor||this._row.nextSibling;var
next_row;while(row){next_row=row.nextSibling;JX.Stratcom.getData(row).inline=this;anchor.parentNode.insertBefore(row,cursor);cursor=row;var
row_meta={node:row,type:type,text:text||null,listeners:[]};if(!first_meta){first_meta=row_meta;}if(type=='edit'){row_meta.listeners.push(JX.DOM.listen(row,['submit','didSyntheticSubmit'],'inline-edit-form',JX.bind(this,this._onsubmit,row_meta)));row_meta.listeners.push(JX.DOM.listen(row,'click','inline-edit-cancel',JX.bind(this,this._oncancel,row_meta)));}else
if(type=='content'){}else{row_meta.listeners.push(JX.DOM.listen(row,'click','differential-inline-comment-undo',JX.bind(this,this._onundo,row_meta)));}var
textareas=JX.DOM.scry(row,'textarea','differential-inline-comment-edit-textarea');if(textareas.length){var
area=textareas[0];area.focus();var
length=area.value.length;JX.TextAreaUtils.setSelectionRange(area,length,length);}row=next_row;}JX.Stratcom.invoke('resize');return first_meta;},_onsubmit:function(row,e){e.kill();var
handler=JX.bind(this,this._onsubmitresponse,row);this.setLoading(true);JX.Workflow.newFromForm(e.getTarget()).setHandler(handler).start();},_onundo:function(row,e){e.kill();this._removeRow(row);if(row.type=='undelete'){var
uri=this._getInlineURI();var
data=this._newRequestData('undelete');var
handler=JX.bind(this,this._onundelete);this.setDeleted(false);this.setLoading(true);new
JX.Request(uri,handler).setData(data).send();}if(row.type=='unedit'){if(this.getID()){this.edit(row.text);}else{this.create(row.text);}}},_onundelete:function(){this.setLoading(false);this._didUpdate();},_oncancel:function(row,e){e.kill();var
text=this._readText(row.node);if(text&&text.length&&(text!=this._originalText)){this._drawUneditRows(text);}this._removeRow(row);this.setEditing(false);this.setInvisible(false);this._didUpdate(true);},_readText:function(row){var
textarea;try{textarea=JX.DOM.find(row,'textarea','differential-inline-comment-edit-textarea');}catch(ex){return null;}return textarea.value;},_onsubmitresponse:function(row,response){this._removeRow(row);this.setLoading(false);this.setInvisible(false);this.setEditing(false);this._onupdate(response);},_onupdate:function(response){var
new_row;if(response.markup){new_row=this._drawContentRows(JX.$H(response.markup).getNode()).node;}var
remove_old=true;if(remove_old){JX.DOM.remove(this._row);}if(new_row){this.bindToRow(new_row);}else{this.setDeleted(true);this._row=null;}this._didUpdate();},_didUpdate:function(local_only){if(!local_only){this.getChangeset().getChangesetList().redrawPreview();}this.getChangeset().getChangesetList().redrawCursor();this.getChangeset().getChangesetList().resetHover();JX.Stratcom.invoke('resize');},_redraw:function(){var
is_invisible=(this._isInvisible||this._isDeleted||this._isHidden);var
is_loading=this._isLoading;var
is_collapsed=(this._isCollapsed&&!this._isHidden);var
row=this._row;JX.DOM.alterClass(row,'differential-inline-hidden',is_invisible);JX.DOM.alterClass(row,'differential-inline-loading',is_loading);JX.DOM.alterClass(row,'inline-hidden',is_collapsed);},_removeRow:function(row){JX.DOM.remove(row.node);for(var
ii=0;ii<row.listeners.length;ii++){row.listeners[ii].remove();}},_getInlineURI:function(){var
changeset=this.getChangeset();var
list=changeset.getChangesetList();return list.getInlineURI();}}});JX.install('DiffChangeset',{construct:function(node){this._node=node;var
data=this._getNodeData();this._renderURI=data.renderURI;this._ref=data.ref;this._whitespace=data.whitespace;this._renderer=data.renderer;this._highlight=data.highlight;this._encoding=data.encoding;this._loaded=data.loaded;this._treeNodeID=data.treeNodeID;this._leftID=data.left;this._rightID=data.right;this._displayPath=JX.$H(data.displayPath);this._icon=data.icon;this._inlines=[];},members:{_node:null,_loaded:false,_sequence:0,_stabilize:false,_renderURI:null,_ref:null,_whitespace:null,_renderer:null,_highlight:null,_encoding:null,_undoTemplates:null,_leftID:null,_rightID:null,_inlines:null,_visible:true,_undoNode:null,_displayPath:null,_changesetList:null,_icon:null,_treeNodeID:null,getLeftChangesetID:function(){return this._leftID;},getRightChangesetID:function(){return this._rightID;},setChangesetList:function(list){this._changesetList=list;return this;},getIcon:function(){if(!this._visible){return'fa-file-o';}return this._icon;},getColor:function(){if(!this._visible){return'grey';}return'blue';},getChangesetList:function(){return this._changesetList;},isLoaded:function(){return this._loaded;},setStabilize:function(stabilize){this._stabilize=stabilize;return this;},shouldAutoload:function(){return this._getNodeData().autoload;},load:function(){if(this._loaded){return this;}return this.reload();},reload:function(){this._loaded=true;this._sequence++;var
params=this._getViewParameters();var
pht=this.getChangesetList().getTranslations();var
workflow=new
JX.Workflow(this._renderURI,params).setHandler(JX.bind(this,this._onresponse,this._sequence));this._startContentWorkflow(workflow);JX.DOM.setContent(this._getContentFrame(),JX.$N('div',{className:'differential-loading'},pht('Loading...')));return this;},loadContext:function(range,target,bulk){var
params=this._getViewParameters();params.range=range;var
pht=this.getChangesetList().getTranslations();var
container=JX.DOM.scry(target,'td')[0];JX.DOM.setContent(container,pht('Loading...'));JX.DOM.alterClass(target,'differential-show-more-loading',true);var
workflow=new
JX.Workflow(this._renderURI,params).setHandler(JX.bind(this,this._oncontext,target));if(bulk){this._startContentWorkflow(workflow);}else{workflow.start();}return this;},loadAllContext:function(){var
nodes=JX.DOM.scry(this._node,'tr','context-target');for(var
ii=0;ii<nodes.length;ii++){var
show=JX.DOM.scry(nodes[ii],'a','show-more');for(var
jj=0;jj<show.length;jj++){var
data=JX.Stratcom.getData(show[jj]);if(data.type!='all'){continue;}this.loadContext(data.range,nodes[ii],true);}}},_startContentWorkflow:function(workflow){var
routable=workflow.getRoutable();routable.setPriority(500).setType('content').setKey(this._getRoutableKey());JX.Router.getInstance().queue(routable);},getDisplayPath:function(){return this._displayPath;},_oncontext:function(target,response){var
markup=JX.$H(response.changeset).getFragment();var
len=markup.childNodes.length;var
diff=JX.DOM.findAbove(target,'table','differential-diff');for(var
ii=0;ii<len-1;ii++){diff.parentNode.insertBefore(markup.firstChild,diff);}var
table=markup.firstChild;var
root=target.parentNode;this._moveRows(table,root,target);root.removeChild(target);this._onchangesetresponse(response);},_moveRows:function(src,dst,before){var
rows=JX.DOM.scry(src,'tr');for(var
ii=0;ii<rows.length;ii++){if(JX.DOM.findAbove(rows[ii],'table')!==src){continue;}if(before){dst.insertBefore(rows[ii],before);}else{dst.appendChild(rows[ii]);}}},_getViewParameters:function(){return{ref:this._ref,whitespace:this._whitespace||'',renderer:this.getRenderer()||'',highlight:this._highlight||'',encoding:this._encoding||''};},getRoutable:function(){return JX.Router.getInstance().getRoutableByKey(this._getRoutableKey());},setRenderer:function(renderer){this._renderer=renderer;return this;},getRenderer:function(){if(this._renderer!==null){return this._renderer;}return(JX.Device.getDevice()=='desktop')?'2up':'1up';},getUndoTemplates:function(){return this._undoTemplates;},setEncoding:function(encoding){this._encoding=encoding;return this;},getEncoding:function(){return this._encoding;},setHighlight:function(highlight){this._highlight=highlight;return this;},getHighlight:function(){return this._highlight;},getSelectableItems:function(){var
items=[];items.push({type:'file',changeset:this,target:this,nodes:{begin:this._node,end:null}});if(!this._visible){return items;}var
rows=JX.DOM.scry(this._node,'tr');var
blocks=[];var
block;var
ii;for(ii=0;ii<rows.length;ii++){var
type=this._getRowType(rows[ii]);if(!block||(block.type!==type)){block={type:type,items:[]};blocks.push(block);}block.items.push(rows[ii]);}var
last_inline=null;var
last_inline_item=null;for(ii=0;ii<blocks.length;ii++){block=blocks[ii];if(block.type=='change'){items.push({type:block.type,changeset:this,target:block.items[0],nodes:{begin:block.items[0],end:block.items[block.items.length-1]}});}if(block.type=='comment'){for(var
jj=0;jj<block.items.length;jj++){var
inline=this.getInlineForRow(block.items[jj]);if(inline===last_inline){last_inline_item.nodes.begin=block.items[jj];last_inline_item.nodes.end=block.items[jj];continue;}else{last_inline=inline;}var
is_saved=(!inline.isDraft()&&!inline.isEditing());last_inline_item={type:block.type,changeset:this,target:inline,hidden:inline.isHidden(),collapsed:inline.isCollapsed(),deleted:!inline.getID()&&!inline.isEditing(),nodes:{begin:block.items[jj],end:block.items[jj]},attributes:{unsaved:inline.isEditing(),anyDraft:inline.isDraft()||inline.isDraftDone(),undone:(is_saved&&!inline.isDone()),done:(is_saved&&inline.isDone())}};items.push(last_inline_item);}}}return items;},_getRowType:function(row){if(row.className.indexOf('inline')!==-1){return'comment';}var
cells=JX.DOM.scry(row,'td');for(var
ii=0;ii<cells.length;ii++){if(cells[ii].className.indexOf('old')!==-1||cells[ii].className.indexOf('new')!==-1){return'change';}}},_getNodeData:function(){return JX.Stratcom.getData(this._node);},getVectors:function(){return{pos:JX.$V(this._node),dim:JX.Vector.getDim(this._node)};},_onresponse:function(sequence,response){if(sequence!=this._sequence){return;}var
target=this._node;var
old_pos=JX.Vector.getScroll();var
old_view=JX.Vector.getViewport();var
old_dim=JX.Vector.getDocument();var
sticky=480;var
near_top=(old_pos.y<=sticky);var
near_bot=((old_pos.y+old_view.y)>=(old_dim.y-sticky));if(window.location.hash){near_bot=false;}var
target_pos=JX.Vector.getPos(target);var
target_dim=JX.Vector.getDim(target);var
target_bot=(target_pos.y+target_dim.y);var
above_screen=(target_bot<old_pos.y+64);var
on_target=null;if(window.location.hash){try{var
anchor=JX.$(window.location.hash.replace('#',''));if(anchor){var
anchor_pos=JX.$V(anchor);if((anchor_pos.y>old_pos.y)&&(anchor_pos.y<old_pos.y+96)){on_target=anchor;}}}catch(ignored){}}var
frame=this._getContentFrame();JX.DOM.setContent(frame,JX.$H(response.changeset));if(this._stabilize){if(on_target){JX.DOM.scrollToPosition(old_pos.x,JX.$V(on_target).y-60);}else
if(!near_top){if(near_bot||above_screen){var
delta=(JX.Vector.getDocument().y-old_dim.y);JX.DOM.scrollToPosition(old_pos.x,old_pos.y+delta);}}this._stabilize=false;}this._onchangesetresponse(response);},_onchangesetresponse:function(response){if(response.coverage){for(var
k
in
response.coverage){try{JX.DOM.replace(JX.$(k),JX.$H(response.coverage[k]));}catch(ignored){}}}if(response.undoTemplates){this._undoTemplates=response.undoTemplates;}JX.Stratcom.invoke('differential-inline-comment-refresh');this._rebuildAllInlines();JX.Stratcom.invoke('resize');},_getContentFrame:function(){return JX.DOM.find(this._node,'div','changeset-view-content');},_getRoutableKey:function(){return'changeset-view.'+this._ref+'.'+this._sequence;},getInlineForRow:function(node){var
data=JX.Stratcom.getData(node);if(!data.inline){var
inline=new
JX.DiffInline().setChangeset(this).bindToRow(node);this._inlines.push(inline);}return data.inline;},newInlineForRange:function(origin,target){var
list=this.getChangesetList();var
src=list.getLineNumberFromHeader(origin);var
dst=list.getLineNumberFromHeader(target);var
changeset_id=null;var
side=list.getDisplaySideFromHeader(origin);if(side=='right'){changeset_id=this.getRightChangesetID();}else{changeset_id=this.getLeftChangesetID();}var
is_new=false;if(side=='right'){is_new=true;}else
if(this.getRightChangesetID()!=this.getLeftChangesetID()){is_new=true;}var
data={origin:origin,target:target,number:src,length:dst-src,changesetID:changeset_id,displaySide:side,isNewFile:is_new};var
inline=new
JX.DiffInline().setChangeset(this).bindToRange(data);this._inlines.push(inline);inline.create();return inline;},newInlineReply:function(original,text){var
inline=new
JX.DiffInline().setChangeset(this).bindToReply(original);this._inlines.push(inline);inline.create(text);return inline;},getInlineByID:function(id){return this._queryInline('id',id);},getInlineByPHID:function(phid){return this._queryInline('phid',phid);},_queryInline:function(field,value){var
inline=this._findInline(field,value);if(inline){return inline;}this._rebuildAllInlines();return this._findInline(field,value);},_findInline:function(field,value){for(var
ii=0;ii<this._inlines.length;ii++){var
inline=this._inlines[ii];var
target;switch(field){case'id':target=inline.getID();break;case'phid':target=inline.getPHID();break;}if(target==value){return inline;}}return null;},getInlines:function(){this._rebuildAllInlines();return this._inlines;},_rebuildAllInlines:function(){var
rows=JX.DOM.scry(this._node,'tr');var
ii;for(ii=0;ii<rows.length;ii++){var
row=rows[ii];if(this._getRowType(row)!='comment'){continue;}this.getInlineForRow(row);}},redrawFileTree:function(){var
tree;try{tree=JX.$(this._treeNodeID);}catch(e){return;}var
inlines=this._inlines;var
done=[];var
undone=[];var
inline;for(var
ii=0;ii<inlines.length;ii++){inline=inlines[ii];if(inline.isDeleted()){continue;}if(inline.isSynthetic()){continue;}if(inline.isEditing()){continue;}if(!inline.getID()){continue;}if(inline.isDraft()){continue;}if(!inline.isDone()){undone.push(inline);}else{done.push(inline);}}var
total=done.length+undone.length;var
hint;var
is_visible;var
is_completed;if(total){if(done.length){hint=[done.length,'/',total];}else{hint=total;}is_visible=true;is_completed=(done.length==total);}else{hint='-';is_visible=false;is_completed=false;}JX.DOM.setContent(tree,hint);JX.DOM.alterClass(tree,'filetree-comments-visible',is_visible);JX.DOM.alterClass(tree,'filetree-comments-completed',is_completed);},toggleVisibility:function(){this._visible=!this._visible;var
diff=JX.DOM.find(this._node,'table','differential-diff');var
undo=this._getUndoNode();if(this._visible){JX.DOM.show(diff);JX.DOM.remove(undo);}else{JX.DOM.hide(diff);JX.DOM.appendContent(diff.parentNode,undo);}JX.Stratcom.invoke('resize');},isVisible:function(){return this._visible;},_getUndoNode:function(){if(!this._undoNode){var
pht=this.getChangesetList().getTranslations();var
link_attributes={href:'#'};var
undo_link=JX.$N('a',link_attributes,pht('Show Content'));var
onundo=JX.bind(this,this._onundo);JX.DOM.listen(undo_link,'click',null,onundo);var
node_attributes={className:'differential-collapse-undo'};var
node_content=[pht('This file content has been collapsed.'),' ',undo_link];var
undo_node=JX.$N('div',node_attributes,node_content);this._undoNode=undo_node;}return this._undoNode;},_onundo:function(e){e.kill();this.toggleVisibility();}},statics:{getForNode:function(node){var
data=JX.Stratcom.getData(node);if(!data.changesetViewManager){data.changesetViewManager=new
JX.DiffChangeset(node);}return data.changesetViewManager;}}});JX.install('DiffChangesetList',{construct:function(){this._changesets=[];var
onload=JX.bind(this,this._ifawake,this._onload);JX.Stratcom.listen('click','differential-load',onload);var
onmore=JX.bind(this,this._ifawake,this._onmore);JX.Stratcom.listen('click','show-more',onmore);var
onmenu=JX.bind(this,this._ifawake,this._onmenu);JX.Stratcom.listen('click','differential-view-options',onmenu);var
oncollapse=JX.bind(this,this._ifawake,this._oncollapse,true);JX.Stratcom.listen('click','hide-inline',oncollapse);var
onexpand=JX.bind(this,this._ifawake,this._oncollapse,false);JX.Stratcom.listen('click','reveal-inline',onexpand);var
onedit=JX.bind(this,this._ifawake,this._onaction,'edit');JX.Stratcom.listen('click',['differential-inline-comment','differential-inline-edit'],onedit);var
ondone=JX.bind(this,this._ifawake,this._onaction,'done');JX.Stratcom.listen('click',['differential-inline-comment','differential-inline-done'],ondone);var
ondelete=JX.bind(this,this._ifawake,this._onaction,'delete');JX.Stratcom.listen('click',['differential-inline-comment','differential-inline-delete'],ondelete);var
onreply=JX.bind(this,this._ifawake,this._onaction,'reply');JX.Stratcom.listen('click',['differential-inline-comment','differential-inline-reply'],onreply);var
onresize=JX.bind(this,this._ifawake,this._onresize);JX.Stratcom.listen('resize',null,onresize);var
onscroll=JX.bind(this,this._ifawake,this._onscroll);JX.Stratcom.listen('scroll',null,onscroll);var
onselect=JX.bind(this,this._ifawake,this._onselect);JX.Stratcom.listen('mousedown',['differential-inline-comment','differential-inline-header'],onselect);var
onhover=JX.bind(this,this._ifawake,this._onhover);JX.Stratcom.listen(['mouseover','mouseout'],'differential-inline-comment',onhover);var
onrangedown=JX.bind(this,this._ifawake,this._onrangedown);JX.Stratcom.listen('mousedown',['differential-changeset','tag:th'],onrangedown);var
onrangemove=JX.bind(this,this._ifawake,this._onrangemove);JX.Stratcom.listen(['mouseover','mouseout'],['differential-changeset','tag:th'],onrangemove);var
onrangeup=JX.bind(this,this._ifawake,this._onrangeup);JX.Stratcom.listen('mouseup',null,onrangeup);},properties:{translations:null,inlineURI:null,inlineListURI:null},members:{_initialized:false,_asleep:true,_changesets:null,_cursorItem:null,_focusNode:null,_focusStart:null,_focusEnd:null,_hoverNode:null,_hoverInline:null,_hoverOrigin:null,_hoverTarget:null,_rangeActive:false,_rangeOrigin:null,_rangeTarget:null,_bannerNode:null,_unsavedButton:null,_unsubmittedButton:null,_doneButton:null,_doneMode:null,_dropdownMenu:null,_menuButton:null,_menuItems:null,sleep:function(){this._asleep=true;this._redrawFocus();this._redrawSelection();this.resetHover();this._bannerChangeset=null;this._redrawBanner();},wake:function(){this._asleep=false;this._redrawFocus();this._redrawSelection();this._bannerChangeset=null;this._redrawBanner();if(this._initialized){return;}this._initialized=true;var
pht=this.getTranslations();var
label;label=pht('Jump to next change.');this._installJumpKey('j',label,1);label=pht('Jump to previous change.');this._installJumpKey('k',label,-1);label=pht('Jump to next file.');this._installJumpKey('J',label,1,'file');label=pht('Jump to previous file.');this._installJumpKey('K',label,-1,'file');label=pht('Jump to next inline comment.');this._installJumpKey('n',label,1,'comment');label=pht('Jump to previous inline comment.');this._installJumpKey('p',label,-1,'comment');label=pht('Jump to next inline comment, including collapsed comments.');this._installJumpKey('N',label,1,'comment',true);label=pht('Jump to previous inline comment, including collapsed comments.');this._installJumpKey('P',label,-1,'comment',true);label=pht('Hide or show the current file.');this._installKey('h',label,this._onkeytogglefile);label=pht('Jump to the table of contents.');this._installKey('t',label,this._ontoc);label=pht('Reply to selected inline comment or change.');this._installKey('r',label,JX.bind(this,this._onkeyreply,false));label=pht('Reply and quote selected inline comment.');this._installKey('R',label,JX.bind(this,this._onkeyreply,true));label=pht('Edit selected inline comment.');this._installKey('e',label,this._onkeyedit);label=pht('Mark or unmark selected inline comment as done.');this._installKey('w',label,this._onkeydone);label=pht('Collapse or expand inline comment.');this._installKey('q',label,this._onkeycollapse);label=pht('Hide or show all inline comments.');this._installKey('A',label,this._onkeyhideall);},isAsleep:function(){return this._asleep;},newChangesetForNode:function(node){var
changeset=JX.DiffChangeset.getForNode(node);this._changesets.push(changeset);changeset.setChangesetList(this);return changeset;},getChangesetForNode:function(node){return JX.DiffChangeset.getForNode(node);},getInlineByID:function(id){var
inline=null;for(var
ii=0;ii<this._changesets.length;ii++){inline=this._changesets[ii].getInlineByID(id);if(inline){break;}}return inline;},_ifawake:function(f){if(this.isAsleep()){return;}return f.apply(this,[].slice.call(arguments,1));},_onload:function(e){var
data=e.getNodeData('differential-load');if(data.kill){e.kill();}var
node=JX.$(data.id);var
changeset=this.getChangesetForNode(node);changeset.load();var
routable=changeset.getRoutable();if(routable){routable.setPriority(2000);}},_installKey:function(key,label,handler){handler=JX.bind(this,this._ifawake,handler);return new
JX.KeyboardShortcut(key,label).setHandler(handler).register();},_installJumpKey:function(key,label,delta,filter,show_collapsed){filter=filter||null;var
options={filter:filter,collapsed:show_collapsed};var
handler=JX.bind(this,this._onjumpkey,delta,options);return this._installKey(key,label,handler);},_ontoc:function(manager){var
toc=JX.$('toc');manager.scrollTo(toc);},getSelectedInline:function(){var
cursor=this._cursorItem;if(cursor){if(cursor.type=='comment'){return cursor.target;}}return null;},_onkeyreply:function(is_quote){var
cursor=this._cursorItem;if(cursor){if(cursor.type=='comment'){var
inline=cursor.target;if(inline.canReply()){this.setFocus(null);var
text;if(is_quote){text=inline.getRawText();text='> '+text.replace(/\n/g,'\n> ')+'\n\n';}else{text='';}inline.reply(text);return;}}if(cursor.type=='change'){var
origin=cursor.nodes.begin;var
target=cursor.nodes.end;var
old_list=[];var
new_list=[];var
row=origin;while(row){var
header=row.firstChild;while(header){if(JX.DOM.isType(header,'th')){if(header.className.indexOf('old')!==-1){old_list.push(header);}else
if(header.className.indexOf('new')!==-1){new_list.push(header);}}header=header.nextSibling;}if(row==target){break;}row=row.nextSibling;}var
use_list;if(new_list.length){use_list=new_list;}else{use_list=old_list;}var
src=use_list[0];var
dst=use_list[use_list.length-1];cursor.changeset.newInlineForRange(src,dst);this.setFocus(null);return;}}var
pht=this.getTranslations();this._warnUser(pht('You must select a comment or change to reply to.'));},_onkeyedit:function(){var
cursor=this._cursorItem;if(cursor){if(cursor.type=='comment'){var
inline=cursor.target;if(inline.canEdit()){this.setFocus(null);inline.edit();return;}}}var
pht=this.getTranslations();this._warnUser(pht('You must select a comment to edit.'));},_onkeydone:function(){var
cursor=this._cursorItem;if(cursor){if(cursor.type=='comment'){var
inline=cursor.target;if(inline.canDone()){this.setFocus(null);inline.toggleDone();return;}}}var
pht=this.getTranslations();this._warnUser(pht('You must select a comment to mark done.'));},_onkeytogglefile:function(){var
cursor=this._cursorItem;if(cursor){if(cursor.type=='file'){cursor.changeset.toggleVisibility();return;}}var
pht=this.getTranslations();this._warnUser(pht('You must select a file to hide or show.'));},_onkeycollapse:function(){var
cursor=this._cursorItem;if(cursor){if(cursor.type=='comment'){var
inline=cursor.target;if(inline.canCollapse()){this.setFocus(null);inline.setCollapsed(!inline.isCollapsed());return;}}}var
pht=this.getTranslations();this._warnUser(pht('You must select a comment to hide.'));},_onkeyhideall:function(){var
inlines=this._getInlinesByType();if(inlines.visible.length){this._toggleInlines('all');}else{this._toggleInlines('show');}},_warnUser:function(message){new
JX.Notification().setContent(message).alterClassName('jx-notification-alert',true).setDuration(3000).show();},_onjumpkey:function(delta,options){var
state=this._getSelectionState();var
filter=options.filter||null;var
collapsed=options.collapsed||false;var
wrap=options.wrap||false;var
attribute=options.attribute||null;var
show=options.show||false;var
cursor=state.cursor;var
items=state.items;if((cursor===null)&&(delta<0)){return;}var
did_wrap=false;while(true){if(cursor===null){cursor=0;}else{cursor=cursor+delta;}if(cursor<0){return;}if(cursor>=items.length){if(!wrap){return;}if(did_wrap){return;}cursor=0;did_wrap=true;}if(filter!==null){if(items[cursor].type!==filter){continue;}}if(!collapsed){if(items[cursor].collapsed){continue;}}if(items[cursor].deleted){continue;}if(attribute!==null){if(!(items[cursor].attributes||{})[attribute]){continue;}}if(items[cursor].hidden){if(!show){continue;}items[cursor].target.setHidden(false);}break;}this._setSelectionState(items[cursor],true);},_getSelectionState:function(){var
items=this._getSelectableItems();var
cursor=null;if(this._cursorItem!==null){for(var
ii=0;ii<items.length;ii++){var
item=items[ii];if(this._cursorItem.target===item.target){cursor=ii;break;}}}return{cursor:cursor,items:items};},_setSelectionState:function(item,scroll){this._cursorItem=item;this._redrawSelection(scroll);return this;},_redrawSelection:function(scroll){var
cursor=this._cursorItem;if(!cursor){this.setFocus(null);return;}if(cursor.deleted){this.setFocus(null);return;}this.setFocus(cursor.nodes.begin,cursor.nodes.end);if(scroll){var
pos=JX.$V(cursor.nodes.begin);JX.DOM.scrollToPosition(0,pos.y-60);}return this;},redrawCursor:function(){var
state=this._getSelectionState();if(state.cursor!==null){this._setSelectionState(state.items[state.cursor],false);}},_getSelectableItems:function(){var
result=[];for(var
ii=0;ii<this._changesets.length;ii++){var
items=this._changesets[ii].getSelectableItems();for(var
jj=0;jj<items.length;jj++){result.push(items[jj]);}}return result;},_onhover:function(e){if(e.getIsTouchEvent()){return;}var
inline;if(e.getType()=='mouseout'){inline=null;}else{inline=this._getInlineForEvent(e);}this._setHoverInline(inline);},_onmore:function(e){e.kill();var
node=e.getNode('differential-changeset');var
changeset=this.getChangesetForNode(node);var
data=e.getNodeData('show-more');var
target=e.getNode('context-target');changeset.loadContext(data.range,target);},_onmenu:function(e){var
button=e.getNode('differential-view-options');var
data=JX.Stratcom.getData(button);if(data.menu){return;}e.prevent();var
pht=this.getTranslations();var
node=JX.DOM.findAbove(button,'div','differential-changeset');var
changeset_list=this;var
changeset=this.getChangesetForNode(node);var
menu=new
JX.PHUIXDropdownMenu(button);var
list=new
JX.PHUIXActionListView();var
add_link=function(icon,name,href,local){if(!href){return;}var
link=new
JX.PHUIXActionView().setIcon(icon).setName(name).setHref(href).setHandler(function(e){if(local){window.location.assign(href);}else{window.open(href);}menu.close();e.prevent();});list.addItem(link);return link;};var
reveal_item=new
JX.PHUIXActionView().setIcon('fa-eye');list.addItem(reveal_item);var
visible_item=new
JX.PHUIXActionView().setHandler(function(e){e.prevent();menu.close();changeset.toggleVisibility();});list.addItem(visible_item);add_link('fa-file-text',pht('Browse in Diffusion'),data.diffusionURI);add_link('fa-file-o',pht('View Standalone'),data.standaloneURI);var
up_item=new
JX.PHUIXActionView().setHandler(function(e){if(changeset.isLoaded()){var
inlines=changeset.getInlines();for(var
ii=0;ii<inlines.length;ii++){if(inlines[ii].isEditing()){changeset_list._warnUser(pht('Finish editing inline comments before changing display '+'modes.'));e.prevent();menu.close();return;}}var
renderer=changeset.getRenderer();if(renderer=='1up'){renderer='2up';}else{renderer='1up';}changeset.setRenderer(renderer);}changeset.reload();e.prevent();menu.close();});list.addItem(up_item);var
encoding_item=new
JX.PHUIXActionView().setIcon('fa-font').setName(pht('Change Text Encoding...')).setHandler(function(e){var
params={encoding:changeset.getEncoding()};new
JX.Workflow('/services/encoding/',params).setHandler(function(r){changeset.setEncoding(r.encoding);changeset.reload();}).start();e.prevent();menu.close();});list.addItem(encoding_item);var
highlight_item=new
JX.PHUIXActionView().setIcon('fa-sun-o').setName(pht('Highlight As...')).setHandler(function(e){var
params={highlight:changeset.getHighlight()};new
JX.Workflow('/services/highlight/',params).setHandler(function(r){changeset.setHighlight(r.highlight);changeset.reload();}).start();e.prevent();menu.close();});list.addItem(highlight_item);add_link('fa-arrow-left',pht('Show Raw File (Left)'),data.leftURI);add_link('fa-arrow-right',pht('Show Raw File (Right)'),data.rightURI);add_link('fa-pencil',pht('Open in Editor'),data.editor,true);add_link('fa-wrench',pht('Configure Editor'),data.editorConfigure);menu.setContent(list.getNode());menu.listen('open',function(){var
nodes=JX.DOM.scry(JX.$(data.containerID),'a','show-more');if(nodes.length){reveal_item.setDisabled(false).setName(pht('Show All Context')).setIcon('fa-file-o').setHandler(function(e){changeset.loadAllContext();e.prevent();menu.close();});}else{reveal_item.setDisabled(true).setIcon('fa-file').setName(pht('All Context Shown')).setHandler(function(e){e.prevent();});}encoding_item.setDisabled(!changeset.isLoaded());highlight_item.setDisabled(!changeset.isLoaded());if(changeset.isLoaded()){if(changeset.getRenderer()=='2up'){up_item.setIcon('fa-list-alt').setName(pht('View Unified'));}else{up_item.setIcon('fa-files-o').setName(pht('View Side-by-Side'));}}else{up_item.setIcon('fa-refresh').setName(pht('Load Changes'));}visible_item.setDisabled(true).setIcon('fa-expand').setName(pht('Can\'t Toggle Unloaded File'));var
diffs=JX.DOM.scry(JX.$(data.containerID),'table','differential-diff');if(diffs.length>1){JX.$E('More than one node with sigil "differential-diff" was found in "'+data.containerID+'."');}else
if(diffs.length==1){var
diff=diffs[0];visible_item.setDisabled(false);if(!changeset.isVisible()){visible_item.setName(pht('Expand File')).setIcon('fa-expand');}else{visible_item.setName(pht('Collapse File')).setIcon('fa-compress');}}else{}});data.menu=menu;menu.open();},_oncollapse:function(is_collapse,e){e.kill();var
inline=this._getInlineForEvent(e);inline.setCollapsed(is_collapse);},_onresize:function(){this._redrawFocus();this._redrawSelection();this._redrawHover();this._bannerChangeset=null;this._redrawBanner();var
changesets=this._changesets;for(var
ii=0;ii<changesets.length;ii++){changesets[ii].redrawFileTree();}},_onscroll:function(){this._redrawBanner();},_onselect:function(e){if(e.getTarget()!==e.getNode('differential-inline-header')){return;}var
inline=this._getInlineForEvent(e);if(!inline){return;}e.kill();this.selectInline(inline);},selectInline:function(inline){var
selection=this._getSelectionState();var
item;if(selection.cursor!==null){item=selection.items[selection.cursor];if(item.target===inline){this._setSelectionState(null,false);return;}}var
items=selection.items;for(var
ii=0;ii<items.length;ii++){item=items[ii];if(item.target===inline){this._setSelectionState(item,false);}}},_onaction:function(action,e){e.kill();var
inline=this._getInlineForEvent(e);var
is_ref=false;if(inline===null){var
data=e.getNodeData('differential-inline-comment');inline=this.getInlineByID(data.id);if(inline){is_ref=true;}else{switch(action){case'delete':this._deleteInlineByID(data.id);return;}}}switch(action){case'edit':inline.edit();break;case'done':inline.toggleDone();break;case'delete':inline.delete(is_ref);break;case'reply':inline.reply();break;}},redrawPreview:function(){var
forms=JX.DOM.scry(document.body,'form','transaction-append');if(forms.length){JX.DOM.invoke(forms[0],'shouldRefresh');}this.resetHover();},setFocus:function(node,extended_node){this._focusStart=node;this._focusEnd=extended_node;this._redrawFocus();},_redrawFocus:function(){var
node=this._focusStart;var
extended_node=this._focusEnd||node;var
reticle=this._getFocusNode();if(!node||this.isAsleep()){JX.DOM.remove(reticle);return;}var
p=JX.Vector.getPos(node);var
s=JX.Vector.getAggregateScrollForNode(node);p.add(s).add(-4,-4).setPos(reticle);JX.Vector.getPos(extended_node).add(-p.x,-p.y).add(JX.Vector.getDim(extended_node)).add(8,8).setDim(reticle);JX.DOM.getContentFrame().appendChild(reticle);},_getFocusNode:function(){if(!this._focusNode){var
node=JX.$N('div',{className:'keyboard-focus-focus-reticle'});this._focusNode=node;}return this._focusNode;},_setHoverInline:function(inline){this._hoverInline=inline;if(inline){var
changeset=inline.getChangeset();var
changeset_id;var
side=inline.getDisplaySide();if(side=='right'){changeset_id=changeset.getRightChangesetID();}else{changeset_id=changeset.getLeftChangesetID();}var
new_part;if(inline.isNewFile()){new_part='N';}else{new_part='O';}var
prefix='C'+changeset_id+new_part+'L';var
number=inline.getLineNumber();var
length=inline.getLineLength();try{var
origin=JX.$(prefix+number);var
target=JX.$(prefix+(number+length));this._hoverOrigin=origin;this._hoverTarget=target;}catch(error){this._hoverOrigin=null;this._hoverTarget=null;}}else{this._hoverOrigin=null;this._hoverTarget=null;}this._redrawHover();},_setHoverRange:function(origin,target){this._hoverOrigin=origin;this._hoverTarget=target;this._redrawHover();},resetHover:function(){this._setHoverInline(null);this._hoverOrigin=null;this._hoverTarget=null;},_redrawHover:function(){var
reticle=this._getHoverNode();if(!this._hoverOrigin||this.isAsleep()){JX.DOM.remove(reticle);return;}JX.DOM.getContentFrame().appendChild(reticle);var
top=this._hoverOrigin;var
bot=this._hoverTarget;if(JX.$V(top).y>JX.$V(bot).y){var
tmp=top;top=bot;bot=tmp;}var
l=top;while(JX.DOM.isType(l,'th')){l=l.nextSibling;}var
r=l;while(r.nextSibling&&JX.DOM.isType(r.nextSibling,'td')){r=r.nextSibling;}var
pos=JX.$V(l).add(JX.Vector.getAggregateScrollForNode(l));var
dim=JX.$V(r).add(JX.Vector.getAggregateScrollForNode(r)).add(-pos.x,-pos.y).add(JX.Vector.getDim(r));var
bpos=JX.$V(bot).add(JX.Vector.getAggregateScrollForNode(bot));dim.y=(bpos.y-pos.y)+JX.Vector.getDim(bot).y;pos.setPos(reticle);dim.setDim(reticle);JX.DOM.show(reticle);},_getHoverNode:function(){if(!this._hoverNode){var
attributes={className:'differential-reticle'};this._hoverNode=JX.$N('div',attributes);}return this._hoverNode;},_deleteInlineByID:function(id){var
uri=this.getInlineURI();var
data={op:'refdelete',id:id};var
handler=JX.bind(this,this.redrawPreview);new
JX.Workflow(uri,data).setHandler(handler).start();},_getInlineForEvent:function(e){var
node=e.getNode('differential-changeset');if(!node){return null;}var
changeset=this.getChangesetForNode(node);var
inline_row=e.getNode('inline-row');return changeset.getInlineForRow(inline_row);},getLineNumberFromHeader:function(th){try{return parseInt(th.id.match(/^C\d+[ON]L(\d+)$/)[1],10);}catch(x){return null;}},getDisplaySideFromHeader:function(th){return(th.parentNode.firstChild!=th)?'right':'left';},_onrangedown:function(e){if(e.isRightButton()){return;}if(this._rangeActive){return;}var
target=e.getTarget();var
number=this.getLineNumberFromHeader(target);if(!number){return;}e.kill();this._rangeActive=true;this._rangeOrigin=target;this._rangeTarget=target;this._setHoverRange(this._rangeOrigin,this._rangeTarget);},_onrangemove:function(e){if(e.getIsTouchEvent()){return;}var
is_out=(e.getType()=='mouseout');var
target=e.getTarget();this._updateRange(target,is_out);},_updateRange:function(target,is_out){var
number=this.getLineNumberFromHeader(target);if(!number){return;}if(this._rangeActive){var
origin=this._hoverOrigin;var
origin_side=this.getDisplaySideFromHeader(origin);var
target_side=this.getDisplaySideFromHeader(target);if(origin_side!=target_side){return;}var
origin_table=JX.DOM.findAbove(origin,'table');var
target_table=JX.DOM.findAbove(target,'table');if(origin_table!=target_table){return;}}if(is_out){if(this._rangeActive){}else{this.resetHover();}return;}if(this._rangeActive){this._rangeTarget=target;}else{this._rangeOrigin=target;this._rangeTarget=target;}this._setHoverRange(this._rangeOrigin,this._rangeTarget);},_onrangeup:function(e){if(!this._rangeActive){return;}e.kill();var
origin=this._rangeOrigin;var
target=this._rangeTarget;if(JX.$V(origin).y>JX.$V(target).y){var
tmp=target;target=origin;origin=tmp;}var
node=JX.DOM.findAbove(origin,null,'differential-changeset');var
changeset=this.getChangesetForNode(node);changeset.newInlineForRange(origin,target);this._rangeActive=false;this._rangeOrigin=null;this._rangeTarget=null;this.resetHover();},_redrawBanner:function(){if(this._dropdownMenu){this._dropdownMenu.close();}var
node=this._getBannerNode();var
changeset=this._getVisibleChangeset();if(!changeset){this._bannerChangeset=null;JX.DOM.remove(node);return;}if(this._bannerChangeset===changeset){return;}this._bannerChangeset=changeset;var
inlines=this._getInlinesByType();var
unsaved=inlines.unsaved;var
unsubmitted=inlines.unsubmitted;var
undone=inlines.undone;var
done=inlines.done;var
draft_done=inlines.draftDone;JX.DOM.alterClass(node,'diff-banner-has-unsaved',!!unsaved.length);JX.DOM.alterClass(node,'diff-banner-has-unsubmitted',!!unsubmitted.length);JX.DOM.alterClass(node,'diff-banner-has-draft-done',!!draft_done.length);var
pht=this.getTranslations();var
unsaved_button=this._getUnsavedButton();var
unsubmitted_button=this._getUnsubmittedButton();var
done_button=this._getDoneButton();var
menu_button=this._getMenuButton();if(unsaved.length){unsaved_button.setText(unsaved.length+' '+pht('Unsaved'));JX.DOM.show(unsaved_button.getNode());}else{JX.DOM.hide(unsaved_button.getNode());}if(unsubmitted.length||draft_done.length){var
any_draft_count=unsubmitted.length+draft_done.length;unsubmitted_button.setText(any_draft_count+' '+pht('Unsubmitted'));JX.DOM.show(unsubmitted_button.getNode());}else{JX.DOM.hide(unsubmitted_button.getNode());}if(done.length||undone.length){var
done_text;if(done.length){done_text=[done.length,' / ',(done.length+undone.length),' ',pht('Comments')];}else{done_text=[undone.length,' ',pht('Comments')];}done_button.setText(done_text);JX.DOM.show(done_button.getNode());if(undone.length){this._doneMode='undone';}else{this._doneMode='done';}}else{JX.DOM.hide(done_button.getNode());}var
path_view=[icon,' ',changeset.getDisplayPath()];var
buttons_attrs={className:'diff-banner-buttons'};var
buttons_list=[unsaved_button.getNode(),unsubmitted_button.getNode(),done_button.getNode(),menu_button.getNode()];var
buttons_view=JX.$N('div',buttons_attrs,buttons_list);var
icon=new
JX.PHUIXIconView().setIcon(changeset.getIcon()).getNode();JX.DOM.setContent(node,[buttons_view,path_view]);document.body.appendChild(node);},_getInlinesByType:function(){var
changesets=this._changesets;var
unsaved=[];var
unsubmitted=[];var
undone=[];var
done=[];var
draft_done=[];var
visible_done=[];var
visible_collapsed=[];var
visible_ghosts=[];var
visible=[];var
hidden=[];for(var
ii=0;ii<changesets.length;ii++){var
inlines=changesets[ii].getInlines();var
inline;var
jj;for(jj=0;jj<inlines.length;jj++){inline=inlines[jj];if(inline.isDeleted()){continue;}if(inline.isSynthetic()){continue;}if(inline.isEditing()){unsaved.push(inline);}else
if(!inline.getID()){continue;}else
if(inline.isDraft()){unsubmitted.push(inline);}else{if(inline.isDraftDone()){draft_done.push(inline);}if(!inline.isDone()){undone.push(inline);}else{done.push(inline);}}}for(jj=0;jj<inlines.length;jj++){inline=inlines[jj];if(inline.isDeleted()){continue;}if(inline.isEditing()){continue;}if(inline.isHidden()){hidden.push(inline);continue;}visible.push(inline);if(inline.isDone()){visible_done.push(inline);}if(inline.isCollapsed()){visible_collapsed.push(inline);}if(inline.isGhost()){visible_ghosts.push(inline);}}}return{unsaved:unsaved,unsubmitted:unsubmitted,undone:undone,done:done,draftDone:draft_done,visibleDone:visible_done,visibleGhosts:visible_ghosts,visibleCollapsed:visible_collapsed,visible:visible,hidden:hidden};},_getUnsavedButton:function(){if(!this._unsavedButton){var
button=new
JX.PHUIXButtonView().setIcon('fa-commenting-o').setButtonType(JX.PHUIXButtonView.BUTTONTYPE_SIMPLE);var
node=button.getNode();var
onunsaved=JX.bind(this,this._onunsavedclick);JX.DOM.listen(node,'click',null,onunsaved);this._unsavedButton=button;}return this._unsavedButton;},_getUnsubmittedButton:function(){if(!this._unsubmittedButton){var
button=new
JX.PHUIXButtonView().setIcon('fa-comment-o').setButtonType(JX.PHUIXButtonView.BUTTONTYPE_SIMPLE);var
node=button.getNode();var
onunsubmitted=JX.bind(this,this._onunsubmittedclick);JX.DOM.listen(node,'click',null,onunsubmitted);this._unsubmittedButton=button;}return this._unsubmittedButton;},_getDoneButton:function(){if(!this._doneButton){var
button=new
JX.PHUIXButtonView().setIcon('fa-comment').setButtonType(JX.PHUIXButtonView.BUTTONTYPE_SIMPLE);var
node=button.getNode();var
ondone=JX.bind(this,this._ondoneclick);JX.DOM.listen(node,'click',null,ondone);this._doneButton=button;}return this._doneButton;},_getMenuButton:function(){if(!this._menuButton){var
button=new
JX.PHUIXButtonView().setIcon('fa-bars').setButtonType(JX.PHUIXButtonView.BUTTONTYPE_SIMPLE);var
dropdown=new
JX.PHUIXDropdownMenu(button.getNode());this._menuItems={};var
list=new
JX.PHUIXActionListView();dropdown.setContent(list.getNode());var
map={hideDone:{type:'done'},hideCollapsed:{type:'collapsed'},hideGhosts:{type:'ghosts'},hideAll:{type:'all'},showAll:{type:'show'}};for(var
k
in
map){var
spec=map[k];var
handler=JX.bind(this,this._onhideinlines,spec.type);var
item=new
JX.PHUIXActionView().setHandler(handler);list.addItem(item);this._menuItems[k]=item;}dropdown.listen('open',JX.bind(this,this._ondropdown));var
pht=this.getTranslations();if(this.getInlineListURI()){list.addItem(new
JX.PHUIXActionView().setDivider(true));list.addItem(new
JX.PHUIXActionView().setIcon('fa-external-link').setName(pht('List Inline Comments')).setHref(this.getInlineListURI()));}this._menuButton=button;this._dropdownMenu=dropdown;}return this._menuButton;},_ondropdown:function(){var
inlines=this._getInlinesByType();var
items=this._menuItems;var
pht=this.getTranslations();items.hideDone.setName(pht('Hide "Done" Inlines')).setDisabled(!inlines.visibleDone.length);items.hideCollapsed.setName(pht('Hide Collapsed Inlines')).setDisabled(!inlines.visibleCollapsed.length);items.hideGhosts.setName(pht('Hide Older Inlines')).setDisabled(!inlines.visibleGhosts.length);items.hideAll.setName(pht('Hide All Inlines')).setDisabled(!inlines.visible.length);items.showAll.setName(pht('Show All Inlines')).setDisabled(!inlines.hidden.length);},_onhideinlines:function(type,e){this._dropdownMenu.close();e.prevent();this._toggleInlines(type);},_toggleInlines:function(type){var
inlines=this._getInlinesByType();this._setSelectionState(null);var
targets;var
mode=true;switch(type){case'done':targets=inlines.visibleDone;break;case'collapsed':targets=inlines.visibleCollapsed;break;case'ghosts':targets=inlines.visibleGhosts;break;case'all':targets=inlines.visible;break;case'show':targets=inlines.hidden;mode=false;break;}for(var
ii=0;ii<targets.length;ii++){targets[ii].setHidden(mode);}},_onunsavedclick:function(e){e.kill();var
options={filter:'comment',wrap:true,show:true,attribute:'unsaved'};this._onjumpkey(1,options);},_onunsubmittedclick:function(e){e.kill();var
options={filter:'comment',wrap:true,show:true,attribute:'anyDraft'};this._onjumpkey(1,options);},_ondoneclick:function(e){e.kill();var
options={filter:'comment',wrap:true,show:true,attribute:this._doneMode};this._onjumpkey(1,options);},_getBannerNode:function(){if(!this._bannerNode){var
attributes={className:'diff-banner',id:'diff-banner'};this._bannerNode=JX.$N('div',attributes);}return this._bannerNode;},_getVisibleChangeset:function(){if(this.isAsleep()){return null;}if(JX.Device.getDevice()!='desktop'){return null;}var
margin=480;var
s=JX.Vector.getScroll();if(s.y<margin){return null;}var
detect_height=64;for(var
ii=0;ii<this._changesets.length;ii++){var
changeset=this._changesets[ii];var
c=changeset.getVectors();if(c.pos.y<=(s.y+detect_height)){if((c.pos.y+c.dim.y)>=(s.y+detect_height)){return changeset;}}}return null;}}});