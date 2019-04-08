let str = `
<%if(user){%>
   hello <%=user.name%>
<%}else{%>
   hello guest
<%}%>
<ul>
<%for(let i=0;i<total;i++){%>
  <li><%=i%></li>
<%}%>
</ul>
`;


let options = { user: { name: 'plus' }, total: 5 };

function render(str, options, callback) {
   let head = 'with(obj){\n let tpl = `'
   str = str.replace(/<%=([\s\S]+?)%>/g,function(){
        return '${' + arguments[1] + '}'
   })
   str = str.replace(/<%([\s\S]+?)%>/g,function(){
        return  '`;\n ' + arguments[1] + 'tpl += `'
   })
   let tail = '`\nreturn tpl;}'
   let html = head + str + tail

   let render = new Function('obj',html)
   let result = render(options)

   return callback(result)
}
let result = render(str, options,(result) => console.log(result));//hello 



// (function anonymous(obj) {
//     let tpl =``; 
//     with(obj){ 
//         tpl += ``;
//      if(user){ 
//          tpl += `hello ${user.name}`;
//      }else{ 
//          tpl += `hello guest`;
//      } 
//      tpl += `<ul>`;
//      {;
//         window.runnerWindow.protect.protect({ line: 8, reset: true });
//         for(let i=0;i<total;i++){;
//             if(window.runnerWindow.protect.protect({ line: 8 })) break;
//             tpl += ` <li>${i}</li>`;
//         }
//      } 
//      tpl += `</ul>`
//     }
//     return tpl;
// })