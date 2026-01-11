window.onload = init;

function init(){
  fam = document.getElementById("family-filter")
  fam.addEventListener("change", function (e){
    e.preventDefault();
    filterPlanes(fam.options[fam.selectedIndex].text), false;
  })
  fam.addEventListener("change", function (e){
    e.preventDefault();
    filterFamilies(fam.options[fam.selectedIndex].text), false;
  })
  filterPlanes("All")
  filterFamilies("All")
  // Add active class to the current control button (highlight it)
  var btnContainer = document.getElementById("filter-controls");
  var els = btnContainer.getElementsByClassName("select");
  for (var i = 0; i < els.length; i++) {
    els[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}

function filterPlanes(c) {
  var x, i;
  x = document.getElementsByClassName("plane");
  if (c == "All") c = "";
  // Add the "show" class to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

function filterFamilies(c) {
  var x, i;
  x = document.getElementsByClassName("family");
  if (c == "All") c = "";
  // Add the "show" class to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}