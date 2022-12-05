!function(o,H){function n(a){throw new Error("Pagination: "+a)}void 0===H&&n("Pagination requires jQuery.");var r="pagination",s="__pagination-";H.fn.pagination&&(r="pagination2"),H.fn[r]=function(a){if(void 0===a)return this;var t,l=H(this),S=H.extend({},H.fn[r].defaults,a),e={initialize:function(){var e,t=this;l.data("pagination")||l.data("pagination",{}),!1!==t.callHook("beforeInit")&&(l.data("pagination").initialized&&H(".paginationjs",l).remove(),t.disabled=!!S.disabled,e=t.model={pageRange:S.pageRange,pageSize:S.pageSize},t.parseDataSource(S.dataSource,function(a){t.isAsync=u.isString(a),u.isArray(a)&&(e.totalNumber=S.totalNumber=a.length),t.isDynamicTotalNumber=t.isAsync&&S.totalNumberLocator;a=t.render(!0);S.className&&a.addClass(S.className),e.el=a,l["bottom"===S.position?"append":"prepend"](a),t.observer(),l.data("pagination").initialized=!0,t.callHook("afterInit",a)}))},render:function(a){var e=this,t=e.model,i=t.el||H('<div class="paginationjs"></div>'),o=!0!==a;e.callHook("beforeRender",o);var n=t.pageNumber||S.pageNumber,r=S.pageRange||0,s=e.getTotalPage(),a=n-r,t=n+r;return s<t&&(a=(a=(t=s)-2*r)<1?1:a),a<=1&&(a=1,t=Math.min(2*r+1,s)),i.html(e.generateHTML({currentPage:n,pageRange:r,rangeStart:a,rangeEnd:t})),S.hideWhenLessThanOnePage&&i[s<=1?"hide":"show"](),e.callHook("afterRender",o),i},generatePageNumbersHTML:function(a){var e,t=a.currentPage,i=this.getTotalPage(),o=a.rangeStart,n=a.rangeEnd,r="",s=S.pageLink,l=S.ellipsisText,u=S.classPrefix,c=S.activeClassName,a=S.disableClassName;if(null===S.pageRange){for(e=1;e<=i;e++)r+=e==t?'<li class="'+u+"-page J-paginationjs-page "+c+'" data-num="'+e+'"><a>'+e+"</a></li>":'<li class="'+u+'-page J-paginationjs-page" data-num="'+e+'"><a href="'+s+'">'+e+"</a></li>";return r}if(o<=3)for(e=1;e<o;e++)r+=e==t?'<li class="'+u+"-page J-paginationjs-page "+c+'" data-num="'+e+'"><a>'+e+"</a></li>":'<li class="'+u+'-page J-paginationjs-page" data-num="'+e+'"><a href="'+s+'">'+e+"</a></li>";else S.showFirstOnEllipsisShow&&(r+='<li class="'+u+"-page "+u+'-first J-paginationjs-page" data-num="1"><a href="'+s+'">1</a></li>'),r+='<li class="'+u+"-ellipsis "+a+'"><a>'+l+"</a></li>";for(e=o;e<=n;e++)r+=e==t?'<li class="'+u+"-page J-paginationjs-page "+c+'" data-num="'+e+'"><a>'+e+"</a></li>":'<li class="'+u+'-page J-paginationjs-page" data-num="'+e+'"><a href="'+s+'">'+e+"</a></li>";if(i-2<=n)for(e=n+1;e<=i;e++)r+='<li class="'+u+'-page J-paginationjs-page" data-num="'+e+'"><a href="'+s+'">'+e+"</a></li>";else r+='<li class="'+u+"-ellipsis "+a+'"><a>'+l+"</a></li>",S.showLastOnEllipsisShow&&(r+='<li class="'+u+"-page "+u+'-last J-paginationjs-page" data-num="'+i+'"><a href="'+s+'">'+i+"</a></li>");return r},generateHTML:function(a){var e=this,t=a.currentPage,i=e.getTotalPage(),o=e.getTotalNumber(),n=S.showPrevious,r=S.showNext,s=S.showPageNumbers,l=S.showNavigator,u=S.showGoInput,c=S.showGoButton,g=S.pageLink,p=S.prevText,d=S.nextText,f=S.goButtonText,m=S.classPrefix,b=S.disableClassName,h=S.ulClassName,v="",N='<input type="text" class="J-paginationjs-go-pagenumber">',y='<input type="button" class="J-paginationjs-go-button" value="'+f+'">',k=H.isFunction(S.formatNavigator)?S.formatNavigator(t,i,o):S.formatNavigator,P=H.isFunction(S.formatGoInput)?S.formatGoInput(N,t,i,o):S.formatGoInput,j=H.isFunction(S.formatGoButton)?S.formatGoButton(y,t,i,o):S.formatGoButton,x=H.isFunction(S.autoHidePrevious)?S.autoHidePrevious():S.autoHidePrevious,w=H.isFunction(S.autoHideNext)?S.autoHideNext():S.autoHideNext,T=H.isFunction(S.header)?S.header(t,i,o):S.header,f=H.isFunction(S.footer)?S.footer(t,i,o):S.footer;return T&&(v+=e.replaceVariables(T,{currentPage:t,totalPage:i,totalNumber:o})),(n||s||r)&&(v+='<div class="paginationjs-pages">',v+=h?'<ul class="'+h+'">':"<ul>",n&&(t<=1?x||(v+='<li class="'+m+"-prev "+b+'"><a>'+p+"</a></li>"):v+='<li class="'+m+'-prev J-paginationjs-previous" data-num="'+(t-1)+'" title="Previous page"><a href="'+g+'">'+p+"</a></li>"),s&&(v+=e.generatePageNumbersHTML(a)),r&&(i<=t?w||(v+='<li class="'+m+"-next "+b+'"><a>'+d+"</a></li>"):v+='<li class="'+m+'-next J-paginationjs-next" data-num="'+(t+1)+'" title="Next page"><a href="'+g+'">'+d+"</a></li>"),v+="</ul></div>"),l&&k&&(v+='<div class="'+m+'-nav J-paginationjs-nav">'+e.replaceVariables(k,{currentPage:t,totalPage:i,totalNumber:o})+"</div>"),u&&P&&(v+='<div class="'+m+'-go-input">'+e.replaceVariables(P,{currentPage:t,totalPage:i,totalNumber:o,input:N})+"</div>"),c&&j&&(v+='<div class="'+m+'-go-button">'+e.replaceVariables(j,{currentPage:t,totalPage:i,totalNumber:o,button:y})+"</div>"),f&&(v+=e.replaceVariables(f,{currentPage:t,totalPage:i,totalNumber:o})),v},findTotalNumberFromRemoteResponse:function(a){this.model.totalNumber=S.totalNumberLocator(a)},go:function(a,t){function e(a){if(!1===r.callHook("beforePaging",i))return!1;var e;s.direction=void 0===s.pageNumber?0:i>s.pageNumber?1:-1,s.pageNumber=i,r.render(),r.disabled&&r.isAsync&&r.enable(),l.data("pagination").model=s,S.formatResult&&(e=H.extend(!0,[],a),u.isArray(a=S.formatResult(e))||(a=e)),l.data("pagination").currentPageData=a,r.doCallback(a,t),r.callHook("afterPaging",i),1==i&&r.callHook("afterIsFirstPage"),i==r.getTotalPage()&&r.callHook("afterIsLastPage")}var i,o,n,r=this,s=r.model;r.disabled||(i=a,!(i=parseInt(i))||i<1||(n=S.pageSize,o=r.getTotalNumber(),a=r.getTotalPage(),0<o&&a<i||(r.isAsync?((o={})[(a=S.alias||{}).pageSize||"pageSize"]=n,o[a.pageNumber||"pageNumber"]=i,n=H.isFunction(S.ajax)?S.ajax():S.ajax,a={type:"get",cache:!1,data:{},contentType:"application/x-www-form-urlencoded; charset=UTF-8",dataType:"json",async:!0},H.extend(!0,a,n),H.extend(a.data,o),a.url=S.dataSource,a.success=function(a){r.isDynamicTotalNumber?r.findTotalNumberFromRemoteResponse(a):r.model.totalNumber=S.totalNumber,e(r.filterDataByLocator(a))},a.error=function(a,e,t){S.formatAjaxError&&S.formatAjaxError(a,e,t),r.enable()},r.disable(),H.ajax(a)):e(r.getDataFragment(i)))))},doCallback:function(a,e){var t=this.model;H.isFunction(e)?e(a,t):H.isFunction(S.callback)&&S.callback(a,t)},destroy:function(){!1!==this.callHook("beforeDestroy")&&(this.model.el.remove(),l.off(),H("#paginationjs-style").remove(),this.callHook("afterDestroy"))},previous:function(a){this.go(this.model.pageNumber-1,a)},next:function(a){this.go(this.model.pageNumber+1,a)},disable:function(){var a=this,e=a.isAsync?"async":"sync";!1!==a.callHook("beforeDisable",e)&&(a.disabled=!0,a.model.disabled=!0,a.callHook("afterDisable",e))},enable:function(){var a=this,e=a.isAsync?"async":"sync";!1!==a.callHook("beforeEnable",e)&&(a.disabled=!1,a.model.disabled=!1,a.callHook("afterEnable",e))},refresh:function(a){this.go(this.model.pageNumber,a)},show:function(){this.model.el.is(":visible")||this.model.el.show()},hide:function(){this.model.el.is(":visible")&&this.model.el.hide()},replaceVariables:function(a,e){for(var t in e)var i=e[t],o=new RegExp("<%=\\s*"+t+"\\s*%>","img"),n=(n||a).replace(o,i);return n},getDataFragment:function(a){var e=S.pageSize,t=S.dataSource,i=this.getTotalNumber(),o=e*(a-1)+1,i=Math.min(a*e,i);return t.slice(o-1,i)},getTotalNumber:function(){return this.model.totalNumber||S.totalNumber||0},getTotalPage:function(){return Math.ceil(this.getTotalNumber()/S.pageSize)},getLocator:function(a){var e;return"string"==typeof a?e=a:H.isFunction(a)?e=a():n('"locator" is incorrect. (String | Function)'),e},filterDataByLocator:function(t){var i,a=this.getLocator(S.locator);if(u.isObject(t)){try{H.each(a.split("."),function(a,e){i=(i||t)[e]})}catch(t){}i?u.isArray(i)||n("dataSource."+a+" must be an Array."):n("dataSource."+a+" is undefined.")}return i||t},parseDataSource:function(a,e){var t=this;u.isObject(a)?e(S.dataSource=t.filterDataByLocator(a)):u.isArray(a)?e(S.dataSource=a):H.isFunction(a)?S.dataSource(function(a){u.isArray(a)||n('The parameter of "done" Function should be an Array.'),t.parseDataSource.call(t,a,e)}):"string"==typeof a?(/^https?|file:/.test(a)&&(S.ajaxDataType="jsonp"),e(a)):n('Unexpected type of "dataSource".')},callHook:function(a){var t,e=l.data("pagination"),i=Array.prototype.slice.apply(arguments);return i.shift(),S[a]&&H.isFunction(S[a])&&!1===S[a].apply(o,i)&&(t=!1),e.hooks&&e.hooks[a]&&H.each(e.hooks[a],function(a,e){!1===e.apply(o,i)&&(t=!1)}),!1!==t},observer:function(){var i=this,t=i.model.el;l.on(s+"go",function(a,e,t){(e=parseInt(H.trim(e)))&&(H.isNumeric(e)||n('"pageNumber" is incorrect. (Number)'),i.go(e,t))}),t.delegate(".J-paginationjs-page","click",function(a){var e=H(a.currentTarget),t=H.trim(e.attr("data-num"));if(t&&!e.hasClass(S.disableClassName)&&!e.hasClass(S.activeClassName))return!1!==i.callHook("beforePageOnClick",a,t)&&(i.go(t),i.callHook("afterPageOnClick",a,t),!!S.pageLink&&void 0)}),t.delegate(".J-paginationjs-previous","click",function(a){var e=H(a.currentTarget),t=H.trim(e.attr("data-num"));if(t&&!e.hasClass(S.disableClassName))return!1!==i.callHook("beforePreviousOnClick",a,t)&&(i.go(t),i.callHook("afterPreviousOnClick",a,t),!!S.pageLink&&void 0)}),t.delegate(".J-paginationjs-next","click",function(a){var e=H(a.currentTarget),t=H.trim(e.attr("data-num"));if(t&&!e.hasClass(S.disableClassName))return!1!==i.callHook("beforeNextOnClick",a,t)&&(i.go(t),i.callHook("afterNextOnClick",a,t),!!S.pageLink&&void 0)}),t.delegate(".J-paginationjs-go-button","click",function(a){var e=H(".J-paginationjs-go-pagenumber",t).val();if(!1===i.callHook("beforeGoButtonOnClick",a,e))return!1;l.trigger(s+"go",e),i.callHook("afterGoButtonOnClick",a,e)}),t.delegate(".J-paginationjs-go-pagenumber","keyup",function(a){if(13===a.which){var e=H(a.currentTarget).val();if(!1===i.callHook("beforeGoInputOnEnter",a,e))return!1;l.trigger(s+"go",e),H(".J-paginationjs-go-pagenumber",t).focus(),i.callHook("afterGoInputOnEnter",a,e)}}),l.on(s+"previous",function(a,e){i.previous(e)}),l.on(s+"next",function(a,e){i.next(e)}),l.on(s+"disable",function(){i.disable()}),l.on(s+"enable",function(){i.enable()}),l.on(s+"refresh",function(a,e){i.refresh(e)}),l.on(s+"show",function(){i.show()}),l.on(s+"hide",function(){i.hide()}),l.on(s+"destroy",function(){i.destroy()});var a=Math.max(i.getTotalPage(),1),e=S.pageNumber;i.isDynamicTotalNumber&&(e=1),S.triggerPagingOnInit&&l.trigger(s+"go",Math.min(e,a))}};if(l.data("pagination")&&!0===l.data("pagination").initialized){if(H.isNumeric(a))return l.trigger.call(this,s+"go",a,arguments[1]),this;if("string"==typeof a){var i=Array.prototype.slice.apply(arguments);switch(i[0]=s+i[0],a){case"previous":case"next":case"go":case"disable":case"enable":case"refresh":case"show":case"hide":case"destroy":l.trigger.apply(this,i);break;case"getSelectedPageNum":return(l.data("pagination").model?l.data("pagination").model:l.data("pagination").attributes).pageNumber;case"getTotalPage":return Math.ceil(l.data("pagination").model.totalNumber/l.data("pagination").model.pageSize);case"getSelectedPageData":return l.data("pagination").currentPageData;case"isDisabled":return!0===l.data("pagination").model.disabled;default:n("Unknown action: "+a)}return this}t=l,H.each(["go","previous","next","disable","enable","refresh","show","hide","destroy"],function(a,e){t.off(s+e)}),t.data("pagination",{}),H(".paginationjs",t).remove()}else u.isObject(a)||n("Illegal options");return(i=S).dataSource||n('"dataSource" is required.'),"string"==typeof i.dataSource?void 0===i.totalNumberLocator?void 0===i.totalNumber?n('"totalNumber" is required.'):H.isNumeric(i.totalNumber)||n('"totalNumber" is incorrect. (Number)'):H.isFunction(i.totalNumberLocator)||n('"totalNumberLocator" should be a Function.'):u.isObject(i.dataSource)&&(void 0===i.locator?n('"dataSource" is an Object, please specify "locator".'):"string"==typeof i.locator||H.isFunction(i.locator)||n(i.locator+" is incorrect. (String | Function)")),void 0===i.formatResult||H.isFunction(i.formatResult)||n('"formatResult" should be a Function.'),e.initialize(),this},H.fn[r].defaults={totalNumber:0,pageNumber:1,pageSize:10,pageRange:2,showPrevious:!0,showNext:!0,showPageNumbers:!0,showNavigator:!1,showGoInput:!1,showGoButton:!1,pageLink:"",prevText:"&laquo;",nextText:"&raquo;",ellipsisText:"...",goButtonText:"Go",classPrefix:"paginationjs",activeClassName:"active",disableClassName:"disabled",inlineStyle:!0,formatNavigator:"<%= currentPage %> / <%= totalPage %>",formatGoInput:"<%= input %>",formatGoButton:"<%= button %>",position:"bottom",autoHidePrevious:!1,autoHideNext:!1,triggerPagingOnInit:!0,hideWhenLessThanOnePage:!1,showFirstOnEllipsisShow:!0,showLastOnEllipsisShow:!0,callback:function(){}},H.fn.addHook=function(a,e){arguments.length<2&&n("Missing argument."),H.isFunction(e)||n("callback must be a function.");var t=H(this),i=t.data("pagination");i||(t.data("pagination",{}),i=t.data("pagination")),i.hooks||(i.hooks={}),i.hooks[a]=i.hooks[a]||[],i.hooks[a].push(e)},H[r]=function(a,e){var t;if(arguments.length<2&&n("Requires two parameters."),(t="string"!=typeof a&&a instanceof jQuery?a:H(a)).length)return t.pagination(e),t};var u={};H.each(["Object","Array","String"],function(a,t){u["is"+t]=function(a){return("object"==(a=typeof(e=a))?null==e?"null":Object.prototype.toString.call(e).slice(8,-1):a).toLowerCase()===t.toLowerCase();var e}}),"function"==typeof define&&define.amd&&define(function(){return H})}(this,window.jQuery);