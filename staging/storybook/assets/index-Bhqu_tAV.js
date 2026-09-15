function l(i){for(var f=[],c=1;c<arguments.length;c++)f[c-1]=arguments[c];var n=Array.from(typeof i=="string"?[i]:i);n[n.length-1]=n[n.length-1].replace(/\r?\n([\t ]*)$/,"");var s=n.reduce(function(t,g){var a=g.match(/\n([\t ]+|(?!\s).)/g);return a?t.concat(a.map(function(u){var r,e;return(e=(r=u.match(/[\t ]/g))===null||r===void 0?void 0:r.length)!==null&&e!==void 0?e:0})):t},[]);if(s.length){var d=new RegExp(`
[	 ]{`.concat(Math.min.apply(Math,s),"}"),"g");n=n.map(function(t){return t.replace(d,`
`)})}n[0]=n[0].replace(/^\r?\n/,"");var o=n[0];return f.forEach(function(t,g){var a=o.match(/(?:^|\n)( *)$/),u=a?a[1]:"",r=t;typeof t=="string"&&t.includes(`
`)&&(r=String(t).split(`
`).map(function(e,h){return h===0?e:"".concat(u).concat(e)}).join(`
`)),o+=r+n[g+1]}),o}export{l as d};
