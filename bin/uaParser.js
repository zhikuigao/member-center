/**!
 * cynomys.jwis.cn - bin/uaParser.js
 *
 * Copyright(c) afterloe.
 * ISC Licensed
 *
 * Authors:
 *   afterloe <afterloeliu@jwis.cn> (http://blog.sina.com.cn/afterloe)
 */
"use strict";

eval(function(d,e,a,c,b,f){b=function(a){return(a<e?"":b(parseInt(a/e)))+(35<(a%=e)?String.fromCharCode(a+29):a.toString(36))};if(!"".replace(/^/,String)){for(;a--;)f[b(a)]=c[a]||b(a);c=[function(a){return f[a]}];b=function(){return"\\w+"};a=1}for(;a--;)c[a]&&(d=d.replace(new RegExp("\\b"+b(a)+"\\b","g"),c[a]));return d}("\"6A 4i\";(B(d,e){E 2c='0.7.10',29='',20='?',1p='B',1o='3Q',1A='2i',2m='2M',1Z='1q',r='1j',f='3E',t='4g',o='1Y',m='L',U='3r',17='3L',D='12',G='1X',18='2t',1g='43',1W='4B';E Y={2a:B(a,b){19(E i 1r b){C(\"I 1y Z 1C R\".2r(i)!==-1&&b[i].Q%2===0){a[i]=b[i].8m(a[i])}}y a},1V:B(a,b){C(K a===\"2M\"){y b.1U().2r(a.1U())!==-1}V{y 4d}},1n:B(a){y a.1U()},1q:B(a){y K(a)===2m?a.4s(\".\")[0]:e}};E M={1e:B(){E H,i=0,j,k,p,q,1d,O,1t=4q;2A(i<1t.Q&&!1d){E 1Q=1t[i],1a=1t[i+1];C(K H===1o){H={};19(p 1r 1a){C(1a.7X(p)){q=1a[p];C(K q===1A){H[q[0]]=e}V{H[q]=e}}}}j=k=0;2A(j<1Q.Q&&!1d){1d=1Q[j++].3c(u.1u());C(!!1d){19(p=0;p<1a.Q;p++){O=1d[++k];q=1a[p];C(K q===1A&&q.Q>0){C(q.Q==2){C(K q[1]==1p){H[q[0]]=q[1].1O(u,O)}V{H[q[0]]=q[1]}}V C(q.Q==3){C(K q[1]===1p&&!(q[1].3c&&q[1].3Z)){H[q[0]]=O?q[1].1O(u,O,q[2]):e}V{H[q[0]]=O?O.2j(q[1],q[2]):e}}V C(q.Q==4){H[q[0]]=O?q[3].1O(u,O.2j(q[1],q[2])):e}}V{H[q]=O?O:e}}}}i+=2}y H},16:B(a,b){19(E i 1r b){C(K b[i]===1A&&b[i].Q>0){19(E j=0;j<b[i].Q;j++){C(Y.1V(b[i][j],a)){y(i===20)?e:i}}}V C(Y.1V(b[i],a)){y(i===20)?e:i}}y a}};E 13={I:{2z:{L:{'1.0':'/8','1.2':'/1','1.3':'/3','2.0':'/4K','2.0.2':'/5i','2.0.3':'/5Y','2.0.4':'/60','?':'/'}}},Z:{2B:{1j:{'6D 2D':['81','88']}},1B:{1j:{'8p 3m 4G':'3q'},1Y:{'2T':'3A','2X':'2X'}}},R:{W:{L:{'3M':'4.3O','P 3.11':'3S.51','P 4.0':'3U.0','3Y':'P 5.0','40':['P 5.1','P 5.2'],'41':'P 6.0','7':'P 6.1','8':'P 6.2','8.1':'P 6.3','10':['P 6.4','P 10.0'],'46':'4a'}}}};E 1N={I:[[/(1s\\4p)\\/([\\w\\.-]+)/i,/(1s\\s[4t]+).+L\\/([\\w\\.-]+)/i,/(1s).+L\\/([\\w\\.]+)/i,/(1s)[\\/\\s]+([\\w\\.]+)/i],[f,m],[/\\s(4v)\\/([\\w\\.]+)/i],[[f,'4w'],m],[/(2p)\\/([\\w\\.]+)/i,/(4E|4F|3h|4L|4M)[\\/\\s]?([\\w\\.]+)*/i,/(4P\\s|4Q|4R|4T)(?:I)?[\\/\\s]?([\\w\\.]*)/i,/(?:4W|\\()(4X)\\s([\\w\\.]+)/i,/(52)\\/([\\w\\.]+)*/i,/(54|5a|5c|5f|5g|1K|5l|5p|5r|5A|5D|5P|5W)\\/([\\w\\.-]+)/i],[f,m],[/(2x).+1J[:\\s]([\\w\\.]+).+62\\68/i],[[f,'6i'],m],[/(6l)\\/((\\d+)?[\\w\\.]+)/i],[f,m],[/(6n)\\/([\\w\\.]+)/i],[[f,'6p'],m],[/(6u)\\/([\\w\\.]+)/i],[[f,/N/g,' '],m],[/(6Q|7a|7j|[7I]{5}\\s?I)\\/v?([\\w\\.]+)/i,/(7Z)[\\/\\s]?([\\w\\.]+)/i],[f,m],[/(80\\s?I)[\\/\\s]?([\\w\\.]+)/i,/2K.+(82)[\\/\\s]?([\\w\\.]+)/i,/83.+(2K)[\\/\\s]?([\\w\\.]+)/i],[[f,'84'],m],[/(85)\\/([\\w\\.]+)/i],[[f,'87'],m],[/((?:J.+)8a|8b)\\/([\\w\\.]+)/i],[[f,'8c'],m],[/8h\\/8i\\/([\\w\\.]+)/i],[m,[f,'8j 2R']],[/J.+L\\/([\\w\\.]+)\\s+(?:12\\s?15|15)/i],[m,[f,'3i 2R']],[/3j\\/([\\w\\.]+);/i],[m,[f,'3k']],[/3l\\/([\\w\\.-]+)/i],[m,[f,'2W']],[/L\\/([\\w\\.]+).+?12\\/\\w+\\s(15)/i],[m,[f,'3n 3o']],[/L\\/([\\w\\.]+).+?(12\\s?15|15)/i],[m,f],[/1R.+?(12\\s?15|15)(\\/[\\w\\.]+)/i],[f,[m,M.16,13.I.2z.L]],[/(3p)\\/([\\w\\.]+)/i,/(1R|30)\\/([\\w\\.]+)/i],[f,m],[/(1D|3s)\\/([\\w\\.-]+)/i],[[f,'3t'],m],[/(3u)/i,/(3v|3w|3x|3y|3z|33\\3B|3C|3D)[\\/\\s]?([\\w\\.\\+]+)/i,/(35|3F|k-3G|3H|3I|3J|3K)\\/([\\w\\.-]+)/i,/(37)\\/([\\w\\.]+).+1J\\:.+1F\\/\\d+/i,/(3N|3d|3P|3e|3R|3f|3g|26|3T)[\\/\\s]?([\\w\\.]+)/i,/(27)\\s\\(([\\w\\.]+)/i,/(3V)\\/?([\\w\\.]+)*/i,/(3W\\s?I)\\/v?([\\w\\.N]+)/i,/(3X)[\\/\\s]([\\w\\.]+)/i],[f,m]],1y:[[/(?:(28|x(?:(?:86|64)[N-])?|42|1G)64)[;\\)]/i],[[U,'44']],[/(2b(?=;))/i],[[U,Y.1n]],[/((?:i[47]|x)86)[;\\)]/i],[[U,'2b']],[/W\\s(48|12);\\49;/i],[[U,'1H']],[/((?:4b|4c)(?:64)?)(?:\\2d|;|\\))/i],[[U,/4e/,'',Y.1n]],[/(4f\\w)[;\\)]/i],[[U,'2e']],[/((?:4h|8q(?=;))|4j(?=\\))|1H(?:64|(?=v\\d+;))|(?=4k\\s)4l|(?:4m|4n|2e)(?:64)?(?=;)|4o-2f)/i],[[U,Y.1n]]],Z:[[/\\((2g|4r);[\\w\\s\\);-]+(2h|1I)/i],[r,o,[t,G]],[/4u\\/[\\w\\.]+ \\((2g)/],[r,[o,'1z'],[t,G]],[/(1I\\s{0,1}2k)/i],[[r,'1z 4y'],[o,'1z']],[/(4z)\\s(4A?)/i,/(2l).+(4C)/i,/(2p)\\/([\\w\\.]+)/i,/\\s(4D)[\\w\\s]+1b\\/(\\w+)/i,/(2n)\\s(4H[4I\\s\\d]*[\\4J])/i],[o,r,[t,G]],[/(2o[A-z]+)\\14\\/[\\w\\.]+.*1K\\//i],[r,[o,'2q'],[t,G]],[/(4N|2o)[4O]+\\14\\/[\\w\\.]+.*1K\\//i],[[r,M.16,13.Z.2B.1j],[o,'2q'],[t,D]],[/\\((1L[2s|\\s\\w*]+);.+(1I)/i],[r,o,[t,D]],[/\\((1L[2s|\\s\\w*]+);/i],[r,[o,'1z'],[t,D]],[/(1M)[\\s-]?(\\w+)/i,/(1M|4S|2u(?=\\-)|4U|4V|2v|2n|2w|4Y|4Z|50)[\\1f-]?([\\w-]+)*/i,/(2l)\\s([\\w\\s]+\\w)/i,/(2v)-?(\\w+)/i],[o,r,[t,D]],[/\\(53;\\s(\\w+)/i],[r,[o,'2y'],[t,D]],[/J.+(55[57\\s]{4,10}\\s\\w+|58|59\\s\\w+|1m 7)/i],[r,[o,'5b'],[t,G]],[/(1v)\\s(1X\\s[5d])\\14\\//i,/(1v)?(?:5e.+)\\14\\//i],[[o,'1P'],[r,'2C 5h'],[t,G]],[/(?:1v)?(?:(?:(?:c|d)\\d{4})|(?:5j[-l].+))\\14\\//i],[[o,'1P'],[r,'2C 2D'],[t,D]],[/\\s(5k)\\s/i,/(2E)\\s([5m]+)/i],[o,r,[t,17]],[/J.+;\\s(5n)\\14/i],[r,[o,'5o'],[t,17]],[/(2F\\s[5q]+)/i],[r,[o,'1P'],[t,17]],[/(1B\\s(\\w+))/i],[[o,M.16,13.Z.1B.1Y],[r,M.16,13.Z.1B.1j],[t,D]],[/(2G)\\s?(S(?:5s|5t)+(?:[-][\\w+]))/i],[o,r,[t,G]],[/(5u)[;N\\s-]+([\\w\\s]+(?=\\))|\\w+)*/i,/(5v)-(\\w+)*/i,/(5w|5x|2w|2G|5y|5z|(?=;\\s)1v)[N\\s-]?([\\w-]+)*/i],[o,[r,/N/g,' '],[t,D]],[/(1m\\2H)/i],[r,[o,'2T'],[t,G]],[/[\\s\\(;](5B(?:\\5C)?)[\\s\\);]/i],[r,[o,'2I'],[t,17]],[/(5E\\.[5F]{3})/i],[[r,/\\./g,' '],[o,'2I'],[t,D]],[/\\s(5G|5H(?:[2-4x]|\\s(?:5I|5J|5K|5L))?(:?\\5M)?)[\\w\\s]+1b\\//i,/5N[\\s-]?(\\w+)*/i,/(5O\\d{3,4}) 1b\\//i,/(1m\\s[6])/i],[r,[o,'2J'],[t,D]],[/J.+\\s(5Q\\d|5R[\\5S]{0,2})\\14\\//i],[r,[o,'2J'],[t,G]],[/J.+((5T-i[89]0\\d|5U-5V|1E-p\\d{4}|1E-5X|2L-5Z[56]9|1m 10))/i,/((61-T\\w+))/i],[[o,'2N'],r,[t,G]],[/((s[63]h-\\w+|1E-\\w+|65\\66|67-2O))/i,/(69[6a]*)[\\s-]*(\\w+-?[\\w-]*)*/i,/6b-((2L\\w+))/i],[[o,'2N'],r,[t,D]],[/(6c);2t/i],[o,r,[t,18]],[/\\(6d[\\);].+(6e)/i],[r,[o,'6f'],[t,18]],[/6g-(\\w+)*/i],[r,[o,'6h'],[t,D]],[/(33|2P).*(2O|6j\\s\\d+)/i,/(2P)[\\1f-]?([\\w-]+)*/i],[[o,'6k'],r,[t,D]],[/J\\2Q\\.[\\s\\w;-]{10}(a\\d{3})/i],[r,[o,'6m'],[t,G]],[/J\\2Q\\.[\\s\\w;-]{10}(1S?)-([6o]{3,4})/i],[[o,'2S'],r,[t,G]],[/(1S) 6q\\.2k/i],[o,r,[t,18]],[/(1m\\s[45])/i,/1S[e;\\s\\/-]+(\\w+)*/i],[r,[o,'2S'],[t,D]],[/J.+(6r[a-6s-9\\-\\s]+)/i],[r,[o,'6t'],[t,G]],[/1T;.+((6v));/i],[o,r,[t,D]],[/((6w))6x\\/[\\d\\.]+\\s/i],[o,r,[t,1g]],[/J.+;\\s(6y)\\s\\d/i],[r,[o,'6z'],[t,1g]],[/J.+(\\w+)\\s+1b\\/2U\\1/i,/J.+(2U[\\s\\-N]*6B?[\\1f]*(?:\\d\\w)?)\\s+1b/i,/J.+(6C[\\s\\-N]*(?:2V|2V[\\1f]6E)?[\\1f]*(?:\\d\\w)?)\\s+1b/i],[[r,/N/g,' '],[o,'6F'],[t,D]],[/\\s(1X)[;\\/\\s]/i,/\\s(12)[;\\/\\s]/i],[[t,Y.1n],o,r]],1C:[[/W.+\\6G\\/([\\w\\.]+)/i],[m,[f,'6H']],[/(6I)\\/([\\w\\.]+)/i,/(1R|2x|3h|26|3f|3d|3g)\\/([\\w\\.]+)/i,/(30|6J|27)[\\/\\s]\\(?([\\w\\.]+)/i,/(3e)[\\/\\s]([23]\\.[\\d\\.]+)/i],[f,m],[/1J\\:([\\w\\.]+).*(1F)/i],[m,f]],R:[[/6K\\s(W)\\s(6L|6M)/i],[f,m],[/(W)\\6N\\6O\\.2;\\s(1H)/i,/(W\\6P(?:\\1k)*|W\\6R|W)[\\s\\/]?([6S\\d\\.\\s]+\\w)/i],[f,[m,M.16,13.R.W.L]],[/(1G(?=3|9|n)|1G\\6T\\s)([6U\\d\\.]+)/i],[[f,'6V'],[m,M.16,13.R.W.L]],[/\\((6W)(10);/i],[[f,'2y'],m],[/(1M)\\w*\\/?([\\w\\.]+)*/i,/(6X)[\\/\\s]([\\w\\.]+)/i,/(J|6Y|2u\\1k|6Z|70|2h\\71\\1k|72|73)[\\/\\s-]?([\\w\\.]+)*/i,/1T;.+(74);/i],[f,m],[/(75\\s?R|76|77(?=;))[\\/\\s-]?([\\w\\.]+)*/i],[[f,'78'],m],[/\\((79);/i],[f],[/37.+\\(12;.+1F.+35/i],[[f,'2W 1x'],m],[/(2E|2F)\\s([7b]+)/i,/(7c)[\\/\\s\\(]?(\\w+)*/i,/(7d|7e)[;\\s]/i,/(7f|[7g]?7h|7i|[2Y]*7k|7l|(?=\\s)7m|7n|7o|7p|7q|7r|7s|7t|7u)[\\/\\s-]?([\\w\\.-]+)*/i,/(7v|1T)\\s?([\\w\\.]+)*/i,/(7w)\\s?([\\w\\.]+)*/i],[f,m],[/(7x)\\s[\\w]+\\s([\\w\\.]+\\w)/i],[[f,'7y 1x'],m],[/(7z)\\s?([\\w\\.]+\\d)*/i],[[f,'7A'],m],[/\\s([7B-]{0,4}7C|7D)\\s?([\\w\\.]+)*/i],[f,m],[/(1L[7E]+)(?:.*R\\s([\\w]+)*\\7F\\2d|;\\7G)/i],[[f,'7H'],[m,/N/g,'.']],[/(2Z\\1k\\7J)\\s?([\\w\\s\\.]+\\w)*/i,/(7K|2Z(?=7L)\\s)/i],[[f,'7M 1x'],[m,/N/g,'.']],[/((?:2Y)?7N)[\\/\\s-]?([\\w\\.]+)*/i,/(7O)\\s(\\w+)/i,/(7P)\\s((\\d)(?=\\.|\\)|\\s)[\\w\\.]*)*/i,/(7Q\\2H|7R|7S|R\\/2|7T|7U|2f\\1k|7V)/i,/(7W)\\s?([\\w\\.]+)*/i],[f,m]]};E F=B(b,c){C(!(u 7Y F)){y 31 F(b,c).1w()}E X=b||((d&&d.1D&&d.1D.34)?d.1D.34:29);E 1c=c?Y.2a(1N,c):1N;u.36=B(){E I=M.1e.1l(u,1c.I);I.1q=Y.1q(I.L);y I};u.38=B(){y M.1e.1l(u,1c.1y)};u.39=B(){y M.1e.1l(u,1c.Z)};u.3a=B(){y M.1e.1l(u,1c.1C)};u.3b=B(){y M.1e.1l(u,1c.R)};u.1w=B(){y{X:u.1u(),I:u.36(),1C:u.3a(),R:u.3b(),Z:u.39(),1y:u.38()}};u.1u=B(){y X};u.21=B(a){X=a;y u};u.21(X);y u};F.m=2c;F.8d={f:f,1Z:1Z,m:m};F.8e={U:U};F.8f={r:r,o:o,t:t,17:17,D:D,18:18,G:G,1g:1g,1W:1W};F.8g={f:f,m:m};F.1x={f:f,m:m};C(K(1h)!==1o){C(K 22!==1o&&22.1h){1h=22.1h=F}1h.F=F}V{C(K(24)===1p&&24.28){24(B(){y F})}V{d.F=F}}E $=d.8k||d.8l;C(K $!==1o){E 1i=31 F();$.X=1i.1w();$.X.8n=B(){y 1i.1u()};$.X.8o=B(a){1i.21(a);E H=1i.1w();19(E 25 1r H){$.X[25]=H[25]}}}})(K 32==='2i'?32:u);",
    62,523,"               NAME       VERSION  VENDOR   MODEL  TYPE this    return   function if MOBILE let UAParser TABLET result browser android typeof version mapper _ match NT length os   ARCHITECTURE else windows ua util device   mobile maps sbuild safari str CONSOLE SMARTTV for props build rgxmap matches rgx s_ WEARABLE exports parser model sos apply nexus lowerize UNDEF_TYPE FUNC_TYPE major in opera args getUA sony getResult OS cpu Apple OBJ_TYPE sprint engine navigator gt gecko win arm apple rv silk ip blackberry regexes call Sony regex webkit lg linux toLowerCase has EMBEDDED tablet vendor MAJOR UNKNOWN setUA module  define prop netsurf links amd EMPTY extend ia32 LIBVERSION smac sparc risc ipad rim object replace tv hp STR_TYPE dell kf kindle Amazon indexOf honed smarttv palm asus huawei trident BlackBerry oldsafari while amazon Xperia Phone nintendo playstation lenovo s9 Microsoft Motorola ucweb sgh string Samsung n900 nokia s3 Browser LG HTC hm one Firefox Sprint open mac khtml new window maemo userAgent firefox getBrowser mozilla getCPU getDevice getEngine getOS exec lynx icab amaya w3m netfront Android FBAV Facebook fxios Shift Mobile Safari konqueror 7373KT architecture netscape Netscape swiftfox icedragon iceweasel camino chimera fennec APA sbrowser minimo conkeror name seamonkey meleon icecat iceape firebird phoenix console ME polaris 90 dillo undefined doris NT3 sleipnir NT4 gobrowser ice mosaic 2000 test XP Vista wow wearable amd64  RT 346 ce sppc ARM ppc powerpc false ower sun4 type avr32 strict 68k atmel avr irix mips pa smini arguments playbook split mobiletab applecoremedia opr Opera  TV archos gamepad2 embedded touchpad nook lunascape maxthon  strea kpr dko 412 jasmine blazer sd 0349hijorstuw avant iemobile slim benq baidu sonyericsson acer ms ie meizu motorola polytron  rekonq bb10 chromium transfo  prime eeepc slider flock Asus rockmelt ps sgp midori epiphany Tablet 416 so ouya skyfire wids3u shield Nvidia ovibrowser 34portablevi bolt 5000 6000 htc zte alcatel geeksphone nexian panasonic iron xbox sone vivaldi kin onetw milestone droid bionic x2 pro razr s4g mot XT iridium mz60 xoom s2 sch shw m380s phantomjs n8000 417 t8 419 SM like cgp  galaxy snexus sm sgecko sam sung sec samsung dtv aquos Sharp sie Siemens IE lumia Nokia edge Acer yabrowser 06cv9 Yandex netcast ideatab z0 Lenovo comodo_dragon jolla pebble app glass Google use note mi Fire plus Xiaomi sedge EdgeHTML presto tasman microsoft vista xp snt s6 sphone chrome smobile ntce s9x nt Windows bb tizen webos qnx bada stablet meego contiki sailfish symbian symbos s60 Symbian series40 omniweb wids34portablevu mint mageia vectorlinux joli kxln ubuntu debian arora suse gentoo arch slackware fedora mandriva centos pclinuxos redhat zenwalk linpus hurd gnu cros Chromium sunos Solaris frentopc bsd dragonfly honead slike sopera iOS tizenoka sx macintosh _powerpc Mac solaris haiku aix plan minix beos amigaos morphos openvms unix hasOwnProperty instanceof qqbrowser uc SD ucbrowser JUC UCBrowser dolfin  Dolphin KF  crmo crios Chrome BROWSER CPU DEVICE ENGINE XiaoMi MiuiBrowser MIUI jQuery Zepto concat get set Evo ia64".split(" "),
    0,{}));