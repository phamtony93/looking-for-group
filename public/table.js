document.getElementById('eventSubmit').addEventListener('click', function(event){
  var event = {Title:null, Description:null, Address:null, City:null, State:null, ZIP:null, startDate:null, endDate:null, lowerAge:null, upperAge:null, Gender:null};
  event.Title = document.getElementById('eventTitle').value;
  event.Description = document.getElementById('eventDescription').value;
  event.Address = document.getElementById('eventAddress').value;
  event.City = document.getElementById('eventCity').value;
  event.State = document.getElementById('eventState').value;
  event.ZIP = document.getElementById('eventZIP').value;
  event.startDate = document.getElementById('startDate').value;
  event.endDate = document.getElementById('endDate').value;
  event.lowerAge = document.getElementById('lowerAge').value;
  event.upperAge = document.getElementById('upperAge').value;
  event.Gender = document.getElementById('gender').value;
  if (event.Title != "") {
  var req = new XMLHttpRequest();
  req.open('POST', '/add', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      var table = document.getElementById('eventTable');
      var row = table.insertRow(-1);
      var title = row.insertCell(0);
      title.innerHTML = event.Title;

      var newId = JSON.parse(req.responseText);
      var updateBtn = document.createElement("button");
      updateBtn.innerHTML = "View";
      updateBtn.setAttribute('onClick', 'updateRow(this)');
      var form = document.createElement("form");
      form.appendChild(updateBtn);
      form.setAttribute("id", newId.id);
      var cell = document.createElement("td");
      cell.appendChild(form);
      row.appendChild(cell);
      } else {
        console.log("Error in network request: " + req.statusText);
      }});
  req.send(JSON.stringify(event));
  event.preventDefault();
}
});

function viewRow(button) {
  var id = button.parentNode.id;
  window.location.href ="/view?id=" + id;
}

function updateRow(button) {
  var id = button.parentNode.id;
  window.location.href ="/update?id=" + id;
}

function exerciseUpdate() {
  var event = {Title:null, Description:null, Address:null, City:null, State:null, ZIP:null, startDate:null, endDate:null, lowerAge:null, upperAge:null, Gender:null};
  event.Title = document.getElementById('eventTitle').value;
  event.Description = document.getElementById('eventDescription').value;
  event.Address = document.getElementById('eventAddress').value;
  event.City = document.getElementById('eventCity').value;
  event.State = document.getElementById('eventState').value;
  event.ZIP = document.getElementById('eventZIP').value;
  event.startDate = document.getElementById('startDate').value;
  event.endDate = document.getElementById('endDate').value;
  event.lowerAge = document.getElementById('lowerAge').value;
  event.upperAge = document.getElementById('upperAge').value;
  event.Gender = document.getElementById('gender').value;
  event.id = document.getElementById('updateId').value;
  console.log(event.id);
  if (event.Title != "") {
  var req = new XMLHttpRequest();
  req.open('GET', '/update-table?id=' + event.id + '&Title=' + event.Title + '&Description=' + event.Description + '&Address=' + event.Address + '&City=' + event.City + '&State=' + event.State + '&ZIP=' + event.ZIP + '&startDate=' + event.startDate + '&endDate=' + event.endDate + '&lowerAge=' + event.lowerAge + '&upperAge=' + event.upperAge + '&gender=' + event.gender, true);
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      window.location.href = "/view?id=" + event.id;
      } else {
        console.log("Error in network request: " + req.statusText);
      }});
  req.send(null);
  event.preventDefault();
}
}