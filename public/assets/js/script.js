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