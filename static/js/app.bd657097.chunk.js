(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{122:function(e,t,n){"use strict";n.d(t,"a",(function(){return x}));var a=n(13),r=n.n(a),o=n(5),i=n.n(o),c=n(6),l=n.n(c),s=n(9),u=n.n(s),f=n(2),m=n.n(f),p=n(7),d=n.n(p),h=n(0),g=n(153),v=n(4),y=n(10),b=n(3),w=n(42),E=n(44);function P(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var x=function(e){d()(a,e);var t,n=(t=a,function(){var e,n=m()(t);if(P()){var a=m()(this).constructor;e=Reflect.construct(n,arguments,a)}else e=n.apply(this,arguments);return u()(this,e)});function a(){return i()(this,a),n.apply(this,arguments)}return l()(a,[{key:"render",value:function(){return h.createElement(g.a,{animation:this.props.animationType,duration:500,useNativeDriver:!0},h.createElement(E.a,r()({},"web"===y.a.OS?{onClick:this.props.onPress}:{onPress:this.props.onPress},{style:[C.inner,"web"===y.a.OS?{boxShadow:"0px 1px 4px #888888"}:{}]}),h.createElement(b.a,this.props,this.props.children)))}}]),a}(h.Component),C=v.a.create({inner:{backgroundColor:w.a.white,marginVertical:8,elevation:1}})},189:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var a=n(0),r=n(4),o=n(3);function i(e){var t=r.a.create({palette:{alignItems:"stretch",flexDirection:"row",height:112},color:{flex:1}});return a.createElement(o.a,{style:t.palette},e.colors&&e.colors.map((function(e){return a.createElement(o.a,{style:[t.color,{backgroundColor:e.color}],key:e.color})})))}},190:function(e,t,n){"use strict";var a=n(0),r=n(3);t.a=function(){return a.createElement(r.a,{style:{height:100}})}},292:function(e,t,n){"use strict";(function(e){var a=n(23),r=n.n(a),o=n(12),i=n.n(o),c=n(32),l=n.n(c),s=n(0),u=n.n(s),f=n(29),m=n(4),p=n(103),d=n(3),h=n(21),g=n(10),v=n(62),y=n(54),b=n(293),w=n(83),E=n(63),P=n(42),x=n(301),C=n(75),k=n(155),S=n(94),O=n(294),D=n(128),R=n.n(D),A=n(70),I=n(190),T=n(85),B=n(196),j=n(478),N=n(95),L=n.n(N),_=function(t){var n=h.a.get("window"),a=n.height,o=(n.width,u.a.useContext(E.a)),c=o.isLoading,m=o.allPalettes,D=o.deletedPalettes,N=o.undoDeletionByName,_=o.isPro,z=o.setPurchase,H=Object(s.useState)(!1),F=l()(H,2),W=F[0],G=F[1];return Object(s.useEffect)((function(){!function(){var e;i.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(!k.a.platform.ios){t.next=6;break}return t.next=3,i.a.awrap(S.c(S.b));case 3:e=t.sent,"granted"!==e.status&&alert("Sorry, we need camera roll permissions to make this work!");case 6:case"end":return t.stop()}}),null,null,null,Promise)}(),"android"===g.a.OS&&v.a.getInitialURL().then((function(e){if(e){var n={};e.split("?")[1].split("&").forEach((function(e){var t=e.split("=");n[t[0]]=decodeURIComponent(t[1])})),t.navigation.navigate("SavePalette",{colors:r()(new Set(JSON.parse(n.colors)||[])),name:n.name})}}))}),[]),c?u.a.createElement(p.a,null):u.a.createElement(u.a.Fragment,null,u.a.createElement(d.a,{style:[U.container,{minHeight:a-A.Header.HEIGHT-16}]},W?u.a.createElement(p.a,null):u.a.createElement(d.a,null),u.a.createElement(f.a,{showsVerticalScrollIndicator:!1},Object.keys(m).map((function(e){return u.a.createElement(b.a,{key:e,colors:m[e].colors.slice(0,_?m[e].colors.length:4),name:e,navigation:t.navigation})})),u.a.createElement(I.a,null))),u.a.createElement(w.a,null,Object.keys(D).map((function(e){return u.a.createElement(w.c,{key:e,name:e,undoDeletionByName:N})}))),u.a.createElement(T.a,{bgColor:"rgba(68, 68, 68, 0.6)",hideShadow:"web"===g.a.OS,buttonColor:P.a.accent,offsetY:60,key:"action-button-home",fixNativeFeedbackRadius:!0,style:"web"===g.a.OS?U.actionButtonWeb:{}},u.a.createElement(T.a.Item,{buttonColor:"#9b59b6",title:"Get palette from image",onPress:function(){G(!0),function(){var t;return i.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,i.a.awrap(x.a({mediaTypes:C.a.All,quality:1,base64:!0}));case 2:if(void 0===(t=n.sent).base64){n.next=9;break}return n.next=6,i.a.awrap(R.a.read(new e(t.base64,"base64")));case 6:return n.abrupt("return",n.sent);case 9:return n.next=11,i.a.awrap(R.a.read(t.uri));case 11:return n.abrupt("return",n.sent);case 12:case"end":return n.stop()}}),null,null,null,Promise)}().then((function(e,n){G(!1),t.navigation.navigate("ColorList",{colors:O.a.getProminentColors(e)})})).catch((function(e){"android"==g.a.OS&&y.a.show("Error while processing image: "+e,y.a.LONG),G(!1)}))}},u.a.createElement(B.a,{name:"md-camera",style:U.actionButtonIcon})),u.a.createElement(T.a.Item,{buttonColor:"#3498db",title:"Get palette from color",onPress:function(){t.navigation.navigate("ColorPicker",{onDone:function(e){t.navigation.navigate("Palettes",{color:e.color})}})}},u.a.createElement(B.a,{name:"md-color-palette",style:U.actionButtonIcon})),u.a.createElement(T.a.Item,{buttonColor:"#1abc9c",title:"Add colors manually",onPress:function(){return t.navigation.navigate("AddPaletteManually")}},u.a.createElement(B.a,{name:"md-color-filter",style:U.actionButtonIcon})),"web"===g.a.OS&&u.a.createElement(T.a.Item,{buttonColor:P.a.primary,title:"Get croma on playstore",onPress:function(){return v.a.openURL("https://play.google.com/store/apps/details?id=app.croma")}},u.a.createElement(j.a,{name:"google-play",style:U.actionButtonIcon})),"android"===g.a.OS&&!_&&u.a.createElement(T.a.Item,{buttonColor:P.a.primary,title:"Unlock pro",onPress:function(){!function(){var e;i.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,i.a.awrap(L.a.open());case 3:return t.next=5,i.a.awrap(L.a.purchase("croma_pro"));case 5:e=t.sent,y.a.show("Congrats, You are now a pro user!",y.a.LONG),z(e),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),y.a.show("Purchase unsucceessful "+t.t0,y.a.LONG);case 13:return t.prev=13,t.next=16,i.a.awrap(L.a.close());case 16:return t.finish(13);case 17:case"end":return t.stop()}}),null,null,[[0,10,13,17]],Promise)}()}},u.a.createElement(B.a,{name:"md-unlock",style:U.actionButtonIcon}))))};t.a=_,_.navigationOptions={title:"Croma"};var U=m.a.create({container:{margin:8,justifyContent:"center"},actionButtonIcon:{fontSize:20,height:22,color:"white"},actionButtonWeb:{position:"fixed",transform:"scale(1) rotate(0deg) !important",right:Math.max((h.a.get("window").width-600)/2,0),left:Math.max((h.a.get("window").width-600)/2,0)}})}).call(this,n(467).Buffer)},293:function(e,t,n){"use strict";n.d(t,"a",(function(){return C}));var a=n(13),r=n.n(a),o=n(11),i=n.n(o),c=n(12),l=n.n(c),s=n(32),u=n.n(s),f=n(0),m=n(4),p=n(3),d=n(19),h=n(10),g=n(115),v=n(122),y=n(42),b=n(123),w=n(189),E=n(239),P=n(44),x=n(63),C=function(e){var t=f.useState(!1),n=u()(t,2),a=n[0],o=n[1],c=f.useContext(x.a).deletePaletteByName,s=f.useState("fadeInLeftBig"),m=u()(s,2),y=m[0],C=m[1];return f.createElement(v.a,r()({},e,{onPress:function(){e.navigation.navigate("Palette",e)},animationType:y}),f.createElement(w.a,e),f.createElement(p.a,{style:k.bottom},f.createElement(d.a,{style:k.label},e.name),f.createElement(p.a,{style:k.actionButtonsView},a&&f.createElement(d.a,{style:{position:"absolute",backgroundColor:"rgb(64, 64, 58)",top:"-35px",right:"-10px",width:"148px",color:"#fff",padding:"5px ",textAlign:"center",borderRadius:"6px"}},"Copied to Clipboard!"),"web"===h.a.OS?f.createElement(P.a,{onClick:function(t){t.preventDefault(),t.stopPropagation(),g.a.setString("Croma - Palette Manager\nColors:\n"+e.colors.map((function(e){return e.color})).join("\n")+"\n      \n      https://croma.app/#/Main/SavePalette?name="+encodeURIComponent(e.name)+"&colors="+encodeURIComponent(JSON.stringify(e.colors))),o(!0),setTimeout((function(){o(!1)}),3e3)},style:k.actionButton},f.createElement(E.a,{size:20,name:"share"})):f.createElement(P.a,{onPress:function(){var t;return l.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.prev=0,n.next=3,l.a.awrap(b.a.share({message:"Croma - Palette Manager\nColors:\n"+e.colors.map((function(e){return e.color})).join("\n")+"\n      \n          https://croma.app/#/Main/SavePalette?name="+encodeURIComponent(e.name)+"&colors="+encodeURIComponent(JSON.stringify(e.colors))}));case 3:(t=n.sent).action===b.a.sharedAction?t.activityType:(t.action,b.a.dismissedAction),n.next=10;break;case 7:n.prev=7,n.t0=n.catch(0),alert(n.t0.message);case 10:case"end":return n.stop()}}),null,null,[[0,7]],Promise)},style:k.actionButton},f.createElement(E.a,{size:20,name:"share"})),f.createElement(P.a,r()({},i()({},"web"===h.a.OS?"onClick":"onPress",(function(t){t.preventDefault(),t.stopPropagation(),C("fadeOutRightBig"),setTimeout((function(){c(e.name)}),500)})),{style:k.actionButton}),f.createElement(E.a,{size:20,name:"trash"})))))},k=m.a.create({bottom:{flexDirection:"row",alignItems:"center",padding:16,height:54},actionButtonsView:{flexDirection:"row",alignItems:"flex-end"},actionButton:{padding:8},label:{flex:1,marginHorizontal:16,color:y.a.darkGrey}})},294:function(e,t,n){"use strict";n.d(t,"a",(function(){return m}));var a=n(5),r=n.n(a),o=n(6),i=n.n(o),c=n(300),l=n(128),s=n.n(l),u=n(64),f=n.n(u),m=function(){function e(){r()(this,e)}return i()(e,null,[{key:"getProminentColors",value:function(t){var n=this;t.resize(s.a.AUTO,100);var a=e._prepareDataForKmeans(t),r=(Date.now(),Object(c.a)(a,24,{initialization:"random",maxIterations:20}));r.centroids=r.centroids.sort((function(e,t){return t.size-e.size}));var o=r.centroids.map((function(e){return new f.a(n._labToHex(e.centroid))}));return this._getFinalColors(o).map((function(e){return{color:e.tohex()}}))}},{key:"_getFinalColors",value:function(e){var t=this;e.sort((function(e,n){return t._toArray(e.tohsv())[0]<t._toArray(n.tohsv())[0]}));for(var n=[],a=0;a<e.length;a+=4){for(var r=[],o=0;o<4;o++)r.push(e[a+o]);r.sort((function(e,n){return t._toArray(e.tohsv())[1]<t._toArray(n.tohsv())[1]})),n.push(r[r.length-1]),n.push(r[r.length-2])}for(var i=[],c=0;c<n.length;c+=2)this._toArray(n[c].tohsv())[2]>this._toArray(n[c+1].tohsv())[2]?i.push(n[c]):i.push(n[c+1]);return i}},{key:"_labToHex",value:function(e){return new f.a("lab("+e[0]+", "+e[1]+", "+e[2]+")").tohex()}},{key:"_prepareDataForKmeans",value:function(e){for(var t=[],n=0;n<e.bitmap.width;n++)for(var a=0;a<e.bitmap.height;a++){var r=e.getPixelColor(n,a),o=this._toHexColor(r),i=new f.a(o).tolab();i=i.substr(4,i.length-5).split(", ").map((function(e){return parseFloat(e)})),t.push(i)}return t}},{key:"_toHexColor",value:function(e){var t=s.a.intToRGBA(e);return new f.a("rgb("+t.r+", "+t.g+", "+t.b+")").tohex()}},{key:"_toArray",value:function(e){var t=e.indexOf("(");return(e=e.substr(t+1,e.length-t)).split(", ").map((function(e){return parseFloat(e)}))}}]),e}()},299:function(e,t,n){"use strict";var a=n(12),r=n.n(a),o=n(32),i=n.n(o),c=n(0),l=n.n(c),s=n(10),u=n(71),f=n(4),m=n(3),p=n(42),d=n(281),h=n(70),g=n(62),v=n(29),y=n(19),b=n(115),w=n(54),E=n(239),P=n(44),x=n(64),C=n.n(x);function k(e){var t=Object(c.useState)(-1),n=i()(t,2),a=n[0],r=n[1],o=f.a.create({backgroundColor:{backgroundColor:e.color,height:112,alignSelf:"stretch"},info:{flexDirection:"row",justifyContent:"space-between",padding:10},colorNameText:{fontSize:16,fontWeight:"500"}}),u=new C.a(e.color),p=[{key:"HEX",value:u.tohex()},{key:"RGB",value:u.torgb()},{key:"HSL",value:u.tohsl()},{key:"HSV",value:u.tohsv()},{key:"HWB",value:u.tohwb()},{key:"CMYK",value:u.tocmyk()},{key:"CIELAB",value:u.tolab()},{key:"Luminance",value:(100*u.luminance()).toFixed(2)+"%"},{key:"Darkness",value:(100*u.darkness()).toFixed(2)+"%"}],d=function(e,t){var n;return function(){var a=this,r=arguments;clearTimeout(n),n=setTimeout((function(){return e.apply(a,r)}),t)}}((function(){return r(-1)}),2e3);return l.a.createElement(m.a,{style:{flex:1,flexDirection:"column",padding:8,backgroundColor:"#fff"}},l.a.createElement(m.a,{style:[o.backgroundColor]}),l.a.createElement(m.a,{style:{marginTop:20}},p.map((function(e,t){return l.a.createElement(P.a,{key:e.key,onPress:function(){return function(e,t){"android"===s.a.OS&&w.a.show("Text copied to clipboard!",w.a.LONG),b.a.setString(e),r(t),d()}(e.value,t)}},l.a.createElement(m.a,{style:o.info},l.a.createElement(y.a,{style:o.colorNameText},e.key," : "),l.a.createElement(y.a,null,e.value),t===a&&"web"===s.a.OS&&l.a.createElement(y.a,{style:{position:"absolute",backgroundColor:"rgb(64, 64, 58)",top:"-25px",right:"-10px",color:"#fff",padding:"5px",textAlign:"center",borderRadius:"6px"}},"Copied!"),l.a.createElement(E.a,{name:"copy"})))}))))}var S=n(5),O=n.n(S),D=n(6),R=n.n(D),A=n(9),I=n.n(A),T=n(2),B=n.n(T),j=n(7),N=n.n(j);function L(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var _=function(e){N()(a,e);var t,n=(t=a,function(){var e,n=B()(t);if(L()){var a=B()(this).constructor;e=Reflect.construct(n,arguments,a)}else e=n.apply(this,arguments);return I()(this,e)});function a(){return O()(this,a),n.apply(this,arguments)}return R()(a,[{key:"render",value:function(){var e=this.props,t=e.style,n=e.onPress,a=e.children;return c.createElement(P.a,{style:[U.button,t],onPress:n},c.createElement(y.a,{style:U.text}," ",a," "))}}]),a}(c.Component),U=f.a.create({button:{shadowColor:"rgba(0,0,0, .4)",shadowOffset:{height:1,width:1},shadowOpacity:1,shadowRadius:1,backgroundColor:"#fff",elevation:2,height:50,marginTop:10,marginBottom:10,justifyContent:"center",alignItems:"center"},text:{textTransform:"uppercase",fontWeight:"700",color:"#484a4c"}});function z(e){var t=e.navigation.getParam("color");return l.a.createElement(v.a,{style:H.container,showsVerticalScrollIndicator:!1},l.a.createElement(k,{navigation:e.navigation,color:t},t),l.a.createElement(_,{onPress:function(){return e.navigation.navigate("Palettes",{color:t})}},"See color palettes"))}z.navigationOptions=function(e){return{title:e.navigation.getParam("color")}};var H=f.a.create({container:{flex:1,paddingLeft:12,paddingRight:12}}),F=n(290);var W=f.a.create({container:{flexDirection:"column",margin:8}}),G=n(122),V=n(189);function M(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var J=function(e){N()(a,e);var t,n=(t=a,function(){var e,n=B()(t);if(M()){var a=B()(this).constructor;e=Reflect.construct(n,arguments,a)}else e=n.apply(this,arguments);return I()(this,e)});function a(){return O()(this,a),n.apply(this,arguments)}return R()(a,[{key:"render",value:function(){return c.createElement(G.a,this.props,c.createElement(m.a,null,c.createElement(V.a,this.props),c.createElement(m.a,{style:Y.bottom},c.createElement(y.a,{style:Y.label},this.props.name))))}}]),a}(c.Component),Y=f.a.create({bottom:{flexDirection:"row",alignItems:"center",height:48},label:{flex:1,fontWeight:"500",marginHorizontal:16,color:p.a.darkGrey}});function $(e){var t=new C.a(e.navigation.getParam("color")),n=[];for(var a in t)/.*scheme$/i.test(a)&&"function"===typeof t[a]&&function(){var r,o=[];t[a]().forEach((function(e){return o.push({color:e.tohex()})})),n.push(l.a.createElement(J,{onPress:function(){return e.navigation.navigate("ColorList",{colors:o})},key:a.toString(),colors:o,name:(r=a.toString(),"string"!==typeof r?"":r.replace(/([a-z])([A-Z])/g,"$1 $2").replace(/\b([A-Z]+)([A-Z])([a-z])/,"$1 $2$3").replace(/^./,(function(e){return e.toUpperCase()})))}))}();return l.a.createElement(v.a,{style:K.container,showsVerticalScrollIndicator:!1},n)}$.navigationOptions=function(e){return{title:e.navigation.getParam("color")}};var K=f.a.create({container:{paddingLeft:12,paddingRight:12}}),X=n(23),Z=n.n(X),q=n(51),Q=n(76),ee=n(63),te=n(83),ne=function(e){var t=Object(c.useState)(e.navigation.getParam("name")?e.navigation.getParam("name"):""),n=i()(t,2),a=n[0],o=n[1],s=Object(c.useState)([]),u=i()(s,2),f=u[0],p=u[1],d=Object(c.useState)(!1),h=i()(d,2),g=h[0],v=h[1],b=l.a.useState(!1),w=i()(b,2),E=w[0],P=w[1],x=l.a.useContext(ee.a),C=x.addPalette,k=x.allPalettes,S=x.isPro;Object(c.useEffect)((function(){var t=e.navigation.getParam("colors");"string"===typeof t&&(t=JSON.parse(t));var n=Z()(new Set(t||[]));v(!S&&n.length>4),p(n),setTimeout((function(){v(!1)}),5e3)}),[]);var O=e.title,D=e.navigationPath;return l.a.createElement(Q.c,{style:{margin:8},showsVerticalScrollIndicator:!1},l.a.createElement(J,{colors:f.slice(0,S?f.length:4),name:a}),l.a.createElement(m.a,{style:ae.card},l.a.createElement(y.a,{style:[ae.label,ae.title]},O),l.a.createElement(q.a,{style:ae.input,value:a,placeholder:"Enter a name for the palette",onChangeText:function(e){return o(e)}})),l.a.createElement(_,{onPress:function(){var t;return r.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(!k[a]){n.next=4;break}return P(!0),setTimeout((function(){P(!1)}),3e3),n.abrupt("return",null);case 4:C(t={name:a,colors:f}),"Palette"===D?e.navigation.replace(D,t):e.navigation.navigate(D);case 7:case"end":return n.stop()}}),null,null,null,Promise)}},"Save palette"),E&&l.a.createElement(te.b,{text:"A palette with same name already exists."}),g&&l.a.createElement(te.b,{text:"Unlock pro to save more than 4 colors!"}))},ae=f.a.create({card:{flex:1,flexDirection:"column",justifyContent:"center",shadowColor:"rgba(0,0,0, .4)",shadowOffset:{height:1,width:1},shadowOpacity:1,shadowRadius:1,backgroundColor:"#fff",elevation:2,height:92,marginVertical:10,padding:10},title:{fontWeight:"700"},input:{flex:1,borderBottomColor:"black",borderBottomWidth:1},bottom:{flexDirection:"row",alignItems:"center",padding:16,height:54},label:{flex:1,color:p.a.darkGrey}});function re(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var oe=function(e){N()(a,e);var t,n=(t=a,function(){var e,n=B()(t);if(re()){var a=B()(this).constructor;e=Reflect.construct(n,arguments,a)}else e=n.apply(this,arguments);return I()(this,e)});function a(){return O()(this,a),n.apply(this,arguments)}return R()(a,[{key:"render",value:function(){return c.createElement(m.a,{style:[ie.container,{backgroundColor:this.props.color}]},c.createElement(y.a,{style:ie.colorText},this.props.color))}}]),a}(c.Component),ie=f.a.create({container:{height:56,justifyContent:"center",alignItems:"center"},colorText:{fontWeight:"700",backgroundColor:"rgba(255, 255, 255, .3)",paddingLeft:8,paddingRight:8}});function ce(e){var t=function(e){var t=new Set,n=[];return e.forEach((function(e){t.has(e.color)||n.push(e),t.add(e.color)})),n}(e.navigation.getParam("colors"));return l.a.createElement(v.a,{style:le.listview,showsVerticalScrollIndicator:!1},t.map((function(e){return l.a.createElement(oe,{key:e.color,color:e.color})})),l.a.createElement(_,{onPress:function(){return e.navigation.navigate("SavePalette",{colors:t})}},"SAVE AS NEW PALETTE"))}ce.navigationOptions={title:"Colors"};var le=f.a.create({listview:{margin:8}}),se=n(13),ue=n.n(se),fe=n(11),me=n.n(fe);function pe(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var de=function(e){N()(a,e);var t,n=(t=a,function(){var e,n=B()(t);if(pe()){var a=B()(this).constructor;e=Reflect.construct(n,arguments,a)}else e=n.apply(this,arguments);return I()(this,e)});function a(e){var t;return O()(this,a),(t=n.call(this,e)).state={animationType:"fadeInLeftBig"},t}return R()(a,[{key:"render",value:function(){var e=this;return c.createElement(G.a,ue()({},this.props,{animationType:this.state.animationType}),c.createElement(m.a,null,c.createElement(m.a,{style:{backgroundColor:this.props.color,height:100}}),c.createElement(m.a,{style:he.bottom},c.createElement(y.a,{style:he.label},this.props.color),c.createElement(m.a,{style:he.actionButtonsView},c.createElement(P.a,ue()({},me()({},"web"===s.a.OS?"onClick":"onPress",(function(t){t.preventDefault(),t.stopPropagation(),e.setState({animationType:"fadeOutRightBig"}),setTimeout((function(){e.props.colorDeleteFromPalette()}),400)})),{style:he.actionButton}),c.createElement(E.a,{size:20,name:"trash"}))))))}}]),a}(c.Component),he=f.a.create({bottom:{flexDirection:"row",alignItems:"center",padding:16,height:54},actionButtonsView:{flexDirection:"row",alignItems:"flex-end"},actionButton:{paddingRight:16},label:{flex:1,marginHorizontal:16,fontWeight:"500",color:p.a.darkGrey}}),ge=n(21),ve=n(85),ye=n(190);function be(e){var t=ge.a.get("window"),n=t.height,a=(t.width,e.navigation.getParam("name")),r=l.a.useContext(ee.a),o=r.isPro,i=r.allPalettes,c=r.colorDeleteFromPalette,u=r.undoColorDeletion,f=r.addColorToPalette,d=i[a].colors,g=i[a].deletedColors?i[a].deletedColors:[],y=function(t){c(e.navigation.getParam("name"),t)};return l.a.createElement(l.a.Fragment,null,l.a.createElement(m.a,{style:(we.container,{minHeight:n-h.Header.HEIGHT-16})},l.a.createElement(v.a,{style:we.listview,showsVerticalScrollIndicator:!1},d.slice(0,o?d.length:4).map((function(t,n){return l.a.createElement(de,{key:t.color,onPress:function(){return e.navigation.navigate("ColorDetails",{color:t.color})},color:t.color,colorDeleteFromPalette:function(){y(n)}})})),l.a.createElement(ye.a,null)),l.a.createElement(ve.a,{offsetY:60,bgColor:"rgba(68, 68, 68, 0.6)",hideShadow:"web"===s.a.OS,fixNativeFeedbackRadius:!0,buttonColor:p.a.accent,onPress:function(){"android"===s.a.OS&&d.length>=4&&!1===o?w.a.show("Unlock pro to add more than 4 colors!",w.a.LONG):e.navigation.navigate("ColorPicker",{onDone:function(e){f(a,e)}})},style:"web"===s.a.OS?we.actionButtonWeb:{}})),l.a.createElement(te.a,null,g.map((function(e){return l.a.createElement(te.c,{name:e.color,undoDeletionByName:function(e){u(a,e)}})}))))}be.navigationOptions=function(e){return{title:e.navigation.getParam("name")}};var we=f.a.create({container:{flex:1},listview:{margin:8},actionButtonWeb:{position:"fixed",transform:"scale(1) rotate(0deg) !important",right:Math.max((ge.a.get("window").width-600)/2,0),left:Math.max((ge.a.get("window").width-600)/2,0)}}),Ee=n(292),Pe=n(478),xe=(s.a.select({web:{headerMode:"screen"},default:{}}),Object(h.createStackNavigator)({ColorDetails:z,ColorPicker:function(e){var t=Object(c.useState)("#db0a5b"),n=i()(t,2),a=n[0],r=n[1];return l.a.createElement(v.a,{showsVerticalScrollIndicator:!1},l.a.createElement(m.a,{style:W.container},l.a.createElement(F.a,{onChangeColor:function(e){r(e)},style:[{height:350,flex:1}]}),l.a.createElement(_,{onPress:function(){e.navigation.goBack(),e.navigation.getParam("onDone")({color:a})}},"Done")))},Palettes:$,SavePalette:function(e){return l.a.createElement(v.a,{showsVerticalScrollIndicator:!1},l.a.createElement(ne,{title:"ADD NEW PALETTE",navigationPath:"Home",navigation:e.navigation}))},ColorList:ce,Palette:be,Home:Ee.a,AddPaletteManually:function(e){return l.a.createElement(v.a,{showsVerticalScrollIndicator:!1},l.a.createElement(ne,{title:"ADD PALETTE NAME",navigationPath:"Palette",navigation:e.navigation}))}},{initialRouteName:"Home",cardStyle:{backgroundColor:"rgb(242, 242, 242)"},defaultNavigationOptions:{headerStyle:{backgroundColor:p.a.primary},headerRight:"web"===s.a.OS?l.a.createElement(l.a.Fragment,null,l.a.createElement(P.a,{style:{padding:"5px"},onPress:function(){g.a.openURL("https://play.google.com/store/apps/details?id=app.croma")}},l.a.createElement(Pe.a,{name:"google-play",style:{fontSize:25,height:25,color:"white"}})),l.a.createElement(P.a,{style:{padding:"5px",marginRight:"10px"},onPress:function(){g.a.openURL("https://github.com/croma-app/croma-react")}},l.a.createElement(Pe.a,{name:"github",style:{fontSize:25,height:25,color:"white"}}))):"",headerTintColor:"#fff"}})),Ce=(Object(h.createAppContainer)(xe),xe),ke=Object(h.createSwitchNavigator)({Main:Ce});ke.path="";var Se=Object(d.createBrowserApp)(ke,{history:"hash"}),Oe=n(103);function De(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}var Re=function(e){N()(a,e);var t,n=(t=a,function(){var e,n=B()(t);if(De()){var a=B()(this).constructor;e=Reflect.construct(n,arguments,a)}else e=n.apply(this,arguments);return I()(this,e)});function a(e){var t;return O()(this,a),(t=n.call(this,e)).state={hasError:!1},t}return R()(a,[{key:"componentDidCatch",value:function(e,t){"web"===s.a.OS&&(window.location="/"),this.setState({hasError:!0})}},{key:"render",value:function(){return this.state.hasError?l.a.createElement("h1",null,"Something went wrong."):this.props.children}}]),a}(l.a.Component);function Ae(e){var t=Object(c.useState)(!1),n=i()(t,2),a=n[0],o=n[1],f=Object(ee.b)(ee.c);return Object(c.useEffect)((function(){r.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,r.a.awrap(f.loadInitPaletteFromStore());case 2:o(!0);case 3:case"end":return e.stop()}}),null,null,null,Promise),"web"===s.a.OS&&f.setPurchase({platfrom:"web"})}),[]),a?l.a.createElement(ee.a.Provider,{value:f},l.a.createElement(Re,null,l.a.createElement(m.a,{style:[Ie.container]},l.a.createElement(u.a,{barStyle:"light-content",hidden:!1,backgroundColor:p.a.primaryDark,translucent:!1,networkActivityIndicatorVisible:!0}),l.a.createElement(m.a,{style:[{flex:1,backgroundColor:"transparent",maxWidth:600}],className:"navigation-workplace"},"ios"===s.a.OS&&l.a.createElement(u.a,{barStyle:"default"}),l.a.createElement(Se,null))))):l.a.createElement(m.a,{style:{flex:1,marginTop:"20%"}},l.a.createElement(Oe.a,{size:"large",color:"#ef635f",animating:!0}))}n.d(t,"a",(function(){return Ae}));var Ie=f.a.create({container:{flex:1,justifyContent:"center",backgroundColor:p.a.backgroundColor,flexDirection:"row"}})},302:function(e,t,n){n(303),e.exports=n(472)},303:function(e,t){"serviceWorker"in navigator&&window.addEventListener("load",(function(){navigator.serviceWorker.register("/expo-service-worker.js",{scope:"/"}).then((function(e){})).catch((function(e){console.info("Failed to register service-worker",e)}))}))},42:function(e,t,n){"use strict";t.a={tintColor:"#2f95dc",tabIconDefault:"#ccc",tabIconSelected:"#2f95dc",tabBar:"#fefefe",errorBackground:"red",errorText:"#fff",warningBackground:"#EAEB5E",warningText:"#666804",noticeBackground:"#2f95dc",noticeText:"#fff",primary:"#f1544d",primaryDark:"#c94740",text:"#fff",accent:"#f0d04c",grey:"#888",darkGrey:"#333",lightGrey:"#eee",white:"#fff",black:"#000",fadedBlack:"rgba(0, 0, 0, .5)",backgroundColor:"#f2f2f2"}},63:function(e,t,n){"use strict";var a=n(32),r=n.n(a),o=n(23),i=n.n(o),c=n(12),l=n.n(c),s=n(11),u=n.n(s),f=n(0),m=n.n(f),p=n(5),d=n.n(p),h=n(105),g=function e(){d()(this,e)};function v(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?v(Object(n),!0).forEach((function(t){u()(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):v(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}g.getApplicationState=function(){var e;return l.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l.a.awrap(h.a.getItem("APLICATION_STATE"));case 2:if(!(e=t.sent)){t.next=7;break}return t.abrupt("return",JSON.parse(e));case 7:return t.abrupt("return",{});case 8:case"end":return t.stop()}}),null,null,null,Promise)},g.setApplicationState=function(e){return l.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l.a.awrap(h.a.setItem("APLICATION_STATE",JSON.stringify(e)));case 2:case"end":return t.stop()}}),null,null,null,Promise)},g.setUserAlreadyExists=function(){return l.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.awrap(h.a.setItem("IS_USER_ALREADY_EXIST","true"));case 2:case"end":return e.stop()}}),null,null,null,Promise)},g.checkUserAlreadyExists=function(){return l.a.async((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.awrap(h.a.getItem("IS_USER_ALREADY_EXIST"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),null,null,null,Promise)},n.d(t,"c",(function(){return b})),n.d(t,"b",(function(){return E})),n.d(t,"a",(function(){return P}));var b={allPalettes:{},deletedPalettes:{},isLoading:!1,isPro:!1},w=function(e){return e.colors.sort((function(e,t){return e.color>t.color?1:-1}))};function E(e){var t=function(e){return l.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:u((function(t){var n=t.allPalettes;w(e),e.createdAt||(e.createdAt=(new Date).valueOf()),n[e.name]=e;var a=Object.keys(n).map((function(e){return n[e]}));a.sort((function(e,t){return e.createdAt||(e.createdAt=0),t.createdAt||(t.createdAt=0),new Date(t.createdAt)-new Date(e.createdAt)}));var r={};return a.forEach((function(e){r[e.name]=e})),y({},t,{allPalettes:r})}));case 1:case"end":return t.stop()}}),null,null,null,Promise)},n=function(e){u((function(t){var n=t.deletedPalettes;return clearTimeout(n[e].timeout),delete n[e],y({},t,{deletedPalettes:n})}))},a=function(e,t){u((function(n){var a=n.allPalettes;return a[e].deletedColors.forEach((function(n,r){n.color===t.color&&a[e].deletedColors.splice(r,1)})),clearTimeout(t.timeout),y({},n,{allPalettes:a})}))},o=Object(f.useState)(y({},e,{loadInitPaletteFromStore:function(){var e;return l.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,l.a.awrap(g.getApplicationState());case 2:return e=n.sent,u((function(t){return y({},t,{},e)})),{},n.next=7,l.a.awrap(g.checkUserAlreadyExists());case 7:"true"!=n.sent&&(g.setUserAlreadyExists(),t({name:"Croma example palette",colors:[{color:"#f0675f"},{color:"#f3d163"},{color:"#ebef5c"},{color:"#c9ef5b"}]}));case 9:case"end":return n.stop()}}),null,null,null,Promise)},undoDeletionByName:function(e){u((function(a){var r=a.deletedPalettes;return r[e]&&(t(y({},r[e])),n(e)),y({},a)}))},deletePaletteByName:function(e){return l.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:u((function(t){var a=t.allPalettes,r=t.deletedPalettes;return a[e]?(r[e]=y({},a[e]),delete a[e],r[e].timeout=setTimeout((function(){n(e)}),3e3),y({},t,{allPalettes:a,deletedPalettes:r})):y({},t)}));case 1:case"end":return t.stop()}}),null,null,null,Promise)},addPalette:t,colorDeleteFromPalette:function(e,t){u((function(n){var r=n.allPalettes,o=r[e].colors.splice(t,1);return o[0].timeout=setTimeout((function(){a(e,o[0])}),3e3),r[e].deletedColors?r[e].deletedColors.push(y({},o[0])):r[e].deletedColors=i()(o),y({},n,{allPalettes:r})}))},undoColorDeletion:function(e,t){u((function(n){var a=n.allPalettes;return a[e].colors.push({color:t}),a[e].deletedColors.forEach((function(n,r){n.color===t&&(clearTimeout(n.timeout),a[e].deletedColors.splice(r,1))})),w(a[e]),y({},n,{allPalettes:a})}))},addColorToPalette:function(e,t){u((function(n){var a=n.allPalettes;return a[e].colors=a[e].colors.concat(t),w(a[e]),y({},n,{allPalettes:a})}))},setPurchase:function(e){u((function(t){return y({},t,{isPro:!0,purchaseDetails:e})}))}})),c=r()(o,2),s=c[0],u=c[1];return 0===Object.keys(s.allPalettes).length&&0===Object.keys(s.deletedPalettes).length&&s.isPro===e.isPro||function(e){g.setApplicationState(e)}(s),s}var P=m.a.createContext()},83:function(e,t,n){"use strict";n.d(t,"a",(function(){return m})),n.d(t,"c",(function(){return p})),n.d(t,"b",(function(){return d}));var a=n(0),r=n.n(a),o=n(153),i=n(3),c=n(19),l=n(4),s=n(10),u=n(21),f=n(44),m=function(e){return r.a.createElement(i.a,{style:"web"===s.a.OS?h.DailogContainerWeb:h.DailogContainer},e.children)},p=function(e){var t=e.name,n=e.undoDeletionByName;return r.a.createElement(o.a,{animation:"fadeInUpBig",duration:500,style:[h.undoCard,h.marginAndRadius],useNativeDriver:!0},r.a.createElement(i.a,null,r.a.createElement(c.a,{style:h.undoText},"Deleted ",t,". ")),r.a.createElement(f.a,{onPress:function(e){e.stopPropagation(),e.preventDefault(),n(t)}},r.a.createElement(c.a,{style:h.undoButton}," UNDO ")))},d=function(e){return r.a.createElement(o.a,{animation:"fadeInUp",duration:500,useNativeDriver:!0,style:h.undoCard},r.a.createElement(i.a,null,r.a.createElement(c.a,{style:h.undoText},e.text)))},h=l.a.create({undoCard:{backgroundColor:"#303036",padding:15,flexDirection:"row",display:"flex",justifyContent:"space-between"},marginAndRadius:{margin:2,borderRadius:6},undoText:{color:"#fff",fontSize:15},undoButton:{fontWeight:"bold",color:"#e6be0b",fontSize:15},DailogContainerWeb:{position:"fixed",bottom:0,left:0,width:Math.min(u.a.get("window").width,400)-10,margin:5,zIndex:10},DailogContainer:{position:"absolute",bottom:0,width:"100%",zIndex:10}})}},[[302,1,2]]]);
//# sourceMappingURL=../../d6603ce146c1572a5537.map