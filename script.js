
let button=document.querySelector('button');
let chart;
button.addEventListener('click',()=>getContestData());
async function getContestData() {
    let Dates=[];
    let Ratings=[];
    let username=document.getElementById('username').value;
    let someContainer=document.querySelector(".container");
    let contest=document.querySelector(".d1");
    someContainer.innerHTML="";
    contest.innerHTML="";
    if(chart){
      chart.destroy();
    }
    let res;
    try {
      res = await getData(username);
    } catch(e) {
      res = e;
    }
  
    let contestDetails=res.data.userContestRanking
    let indContest=res.data.userContestRankingHistory
  
    if(!contestDetails){
      someContainer.innerHTML=`<h1>No Data Found</h1>`;
      return
      
    }
    
    let c=0;
    let cd=document.createElement('div');
    cd.setAttribute('class','cd')
    for(let key in contestDetails){
      if(contestDetails[key]!=null){
        let value=contestDetails[key];
        let updKey=updatedKey(key)
        if(key=='attendedContestsCount'){
          c=value;
        }
        if(key=='badge'){
          value=value.name;
        }else{
          if(key!='topPercentage'){
            value=Math.round(value);
          }
        }
        cd.innerHTML+=`<li>${updKey}: ${value}</li>`
      }
    }
    
    let max=0;
    contest.innerHTML+=` <tr>
    <th>#</th>
    <th>Contest</th>
    <th>Start Time</th>
    <th>Problems Solved</th>
    <th>Ranking</th>
    <th>Rating Change</th>
    <th>New Rating</th>
  </tr>`
    for(let i=indContest.length-1;i>=0;i--){
      let contestText=document.createElement('tr');
      let obj=indContest[i];
      if(obj['attended']){
        contestText.innerHTML+=`<td>${c}</td>`;
        c--;
        let prev=0;
        if(i>0){
          prev=indContest[i-1]['rating'];
        }
        Ratings.push(Math.round(obj['rating']));
        Dates.push(new Date(obj['contest'].startTime*1000).toLocaleDateString());
        max=Math.max(max,obj['rating']);
        let cno=obj['contest'].title.split(" ");
        contestText.innerHTML+=`<td><a href="https://leetcode.com/contest/${cno[cno.length-3]}-contest-${cno[cno.length-1]}/" target="_blank" rel="noopener noreferrer">${obj['contest'].title}</a></td>`
        contestText.innerHTML+=`<td>${new Date(obj['contest'].startTime*1000)}</td>`
        contestText.innerHTML+=`<td><a href="https://leetcode.com/contest/${cno[cno.length-3]}-contest-${cno[cno.length-1]}/ranking/${Math.ceil(obj['ranking']/25)}" target="_blank" rel="noopener noreferrer">${obj['problemsSolved']}</a></td>`
        contestText.innerHTML+=`<td>${obj['ranking']}</td>`
        contestText.innerHTML+=`<td>${Math.round(obj['rating']-prev)}</td>`
        contestText.innerHTML+=`<td>${Math.round(obj['rating'])}</td>`
        contest.appendChild(contestText);
    }
  }
  cd.innerHTML+=`<li>Peak Rating: <b>${Math.round(max)}</b></li>`;
  someContainer.appendChild(cd);
  Ratings.push(1500);
  Dates.push(" ");
  Ratings=Ratings.reverse();
  Dates=Dates.reverse();
  const labels = Dates;
  const data = {
    labels: labels,
    datasets: [{
        data: Ratings,
        fill: false,
        borderColor: 'rgb(0,0,0)',
        tension: 0
    }],
    
  };
  const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };
  const config = {
    type: 'line',
    data: data,
    options: {
      plugins:{
        customCanvasBackgroundColor: {
         color: 'white',
       },
       legend: {
        display: false
       },
      },
      
     },
     plugins: [plugin],
  };
  let ctx=document.getElementById("chart").getContext('2d');
  chart=new Chart(ctx,config);
  }
const isUpperCase = (string) => /^[A-Z]*$/.test(string)
function updatedKey(key){
  let s="";
  for(let i=0;i<key.length;i++){
    if(i==0){
      s+=key.charAt(i).toUpperCase();
    }else{
      s+=key.charAt(i);
    } 
    if(i+1<key.length&&isUpperCase(key.charAt(i+1))){
      s+=" ";
    }
  }
  return s;
}
async function getData(username){
var myHeaders = new Headers();
myHeaders.append("authority", "leetcode.com");
myHeaders.append("accept", "*/*");
myHeaders.append("accept-language", "en-US,en;q=0.9");
myHeaders.append("authorization", "");
myHeaders.append("baggage", "sentry-environment=production,sentry-release=7e056274,sentry-transaction=%2Fu%2F%5Busername%5D,sentry-public_key=2a051f9838e2450fbdd5a77eb62cc83c,sentry-trace_id=b7ca77e07e944a6a9dd8ac3a36929c95,sentry-sample_rate=0.03");
myHeaders.append("content-type", "application/json");
myHeaders.append("cookie", "csrftoken=ULeIQ3TFkWseCm06oSef2z4iHJ9cFBYeLFuDFEibkF2DIMuRZTSWYnWkDodiWIc0; __stripe_mid=d46ca048-18af-4a85-9a64-06ea9391031cad0493; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzUyNDY3OCIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNTIyZWM5M2RkNThlM2QzNmYwM2E4YWY0ODhmMWM5MzBmMWY5ZjAxNjZmNGM4NDliMjY2YmM1ZjlkYzJlMGI0OCIsImlkIjozNTI0Njc4LCJlbWFpbCI6InNob2JoaXRiZWhsOThAZ21haWwuY29tIiwidXNlcm5hbWUiOiJzaG9iaGl0YnJ1aCIsInVzZXJfc2x1ZyI6InNob2JoaXRicnVoIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2F2YXRhcnMvYXZhdGFyXzE2ODA1NTAzNjEucG5nIiwicmVmcmVzaGVkX2F0IjoxNjk3MTMyOTQ0LCJpcCI6IjI0MDU6MjAxOjQwMDU6NTEwMzplNWZiOmU4M2I6YzRjNzo4YzgyIiwiaWRlbnRpdHkiOiIyMjIxMGNhNzNiZjFhZjJlYzJlYWNlNzRhOTZlZTM1NiIsInNlc3Npb25faWQiOjQ3ODgyNjMyLCJfc2Vzc2lvbl9leHBpcnkiOjEyMDk2MDB9.CIHQFugZmnBwtBpWLwPACbwF7Rc-Ma3QGDYZjpWIXCY; _dd_s=rum=2&id=1b00e9da-bfa1-4f71-9796-f5e77f2af030&created=1697304085174&expire=1697305658780; LEETCODE_SESSION=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfYXV0aF91c2VyX2lkIjoiMzUyNDY3OCIsIl9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9oYXNoIjoiNTIyZWM5M2RkNThlM2QzNmYwM2E4YWY0ODhmMWM5MzBmMWY5ZjAxNjZmNGM4NDliMjY2YmM1ZjlkYzJlMGI0OCIsImlkIjozNTI0Njc4LCJlbWFpbCI6InNob2JoaXRiZWhsOThAZ21haWwuY29tIiwidXNlcm5hbWUiOiJzaG9iaGl0YnJ1aCIsInVzZXJfc2x1ZyI6InNob2JoaXRicnVoIiwiYXZhdGFyIjoiaHR0cHM6Ly9hc3NldHMubGVldGNvZGUuY29tL3VzZXJzL2F2YXRhcnMvYXZhdGFyXzE2ODA1NTAzNjEucG5nIiwicmVmcmVzaGVkX2F0IjoxNjk3MzA1NzQ3LCJpcCI6IjQ5LjM2LjE0NC4yMzYiLCJpZGVudGl0eSI6IjIyMjEwY2E3M2JmMWFmMmVjMmVhY2U3NGE5NmVlMzU2Iiwic2Vzc2lvbl9pZCI6NDc4ODI2MzIsIl9zZXNzaW9uX2V4cGlyeSI6MTIwOTYwMH0.vnnsFutO3exXBypdZOh1dn0g13RYab6IyBNmxekzqC0; csrftoken=ULeIQ3TFkWseCm06oSef2z4iHJ9cFBYeLFuDFEibkF2DIMuRZTSWYnWkDodiWIc0");
myHeaders.append("origin", "https://leetcode.com");
myHeaders.append("random-uuid", "3d1b6ac5-063f-abe9-84db-21ab17faf4cf");
myHeaders.append("referer", "https://leetcode.com/Shivam_Sikotra/");
myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"118\", \"Brave\";v=\"118\", \"Not=A?Brand\";v=\"99\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "same-origin");
myHeaders.append("sec-gpc", "1");
myHeaders.append("sentry-trace", "b7ca77e07e944a6a9dd8ac3a36929c95-8a1405638a8cba34-0");
myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36");
myHeaders.append("x-csrftoken", "ULeIQ3TFkWseCm06oSef2z4iHJ9cFBYeLFuDFEibkF2DIMuRZTSWYnWkDodiWIc0");
var graphql = JSON.stringify({
  query: "\r\n    query userContestRankingInfo($username: String!) {\r\n  userContestRanking(username: $username) {\r\n    attendedContestsCount\r\n    rating\r\n    globalRanking\r\n    totalParticipants\r\n    topPercentage\r\n    badge {\r\n      name\r\n    }\r\n  }\r\n  userContestRankingHistory(username: $username) {\r\n    attended\r\n    trendDirection\r\n    problemsSolved\r\n    totalProblems\r\n    finishTimeInSeconds\r\n    rating\r\n    ranking\r\n    contest {\r\n      title\r\n      startTime\r\n    }\r\n  }\r\n}\r\n    ",
  variables: {"username":username}
})
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: graphql,
  redirect: 'follow'
};
const url = 'https://corsproxy.io/?' + encodeURIComponent('https://leetcode.com/graphql/');
let res=await fetch(url, requestOptions)
return res.json();
  // .then(response => response.text())
  // .then(result=> console.log(result))
  // .catch(error => console.log('error', error));
}
