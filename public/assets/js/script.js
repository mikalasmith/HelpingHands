$(window).load(function(){
    var title = document.getElementsByClassName("display-4")[0].innerText;
    console.log(title);
    var element = document.getElementById("submit_form");
    var element2 = document.getElementById("orgSubmit");
    if (title === "Your request sent successfully"){
        element.classList.add("dispaynone");
        element2.classList.remove("dispaynone");
    }
})

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}