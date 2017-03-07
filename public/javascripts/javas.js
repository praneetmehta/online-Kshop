function redirect()
{
    window.alert("yeah");
    window.location.assign("https://www.google.com");
}

function showTable(){
  document.getElementById("dbase").style.display="block";
  document.getElementById("navigation").style.display="block";
  //document.querySelectorAll('[id="navigation"]').style.display="block";
  //makeShake();
}

function makeShake() {
	document.getElementsByName("firstName")[0].className += " animated shake";
	document.getElementsByName("firstName")[0].className += " animated shake";
	console.log("Hello");
}

  $(function(){
    $("button").on("click", function() {
        $("input[name=firstName]").addClass("animated shake");
        //document.getElementsByName("firstName")[0].class += " animated shake";

    })

  });

    $(document).ready(function(){
      $("#karuturi").slideDown(500); $("#container").fadeIn("slow");
      $("#thisText").effect("bounce", {times:1}, 200);
    });

function view(){
  var param = this.value;
  window.location.href = '/view?view='+param;
}