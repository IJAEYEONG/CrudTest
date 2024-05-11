var http = require('http');
var fs = require('fs');
var url = require('url'); // URL 모듈

//template 내용 HTML 뼈대를 함수로 만들기.
function templateHTML(title, list, body){ 
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}

//리스트를 자동으로 만들어주는 코드를 함수로 만들기.
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i+=1;
  }
  list = list +'</ul>';
  return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url; //URL 요청
    var queryData = url.parse(_url, true).query; //URL을 분석하는 모듈 중, querystring 값
    var pathname = url.parse(_url, true).pathname; // URL을 분석하는 모듈 중, pathname 값

    //요청한 pathname이 루트값이라면 , if문이 실행
    if(pathname === '/'){
      if(queryData.id === undefined){
          fs.readdir('./data', function(err, filelist){
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200); // 페이지가 정상적으로 출력되면 200, 오류페이지면 404.
            response.end(template); //화면출력하는부분
          });

      //요청한 pathname이 루트값이 아니라면,대신 queryData.id가 있다면, else문 실행.
      } else {
        fs.readdir('./data', function(err, filelist){
        //파일을 읽는 함수. description변수가 파일.
          fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
            var title = queryData.id
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
            response.writeHead(200); // 페이지가 정상적으로 출력되면 200, 오류페이지면 404.
            response.end(template); //화면출력하는부분
          });
        });
      }
    //요청한 pathname이 루트값이 아니고, qeuryData.id가 없다면 실행.
    } else {
      response.writeHead(404); // 페이지가 정상적으로 출력되면 200, 오류페이지면 404.
      response.end('NOT FOUND'); //화면출력하는부분
    }

});
app.listen(3000);