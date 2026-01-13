// I know it's sloppy and inefficient I'm just now learning this

var allPlanes = []
var allFamilies = []
window.onload = init;

var fields = ["gen","tier","surv","cost","a2a","a2g","manu","speed","cap", "role","family"]

var searchResults = "";
var searchResultsHeader = "";
var searchResultsSubheader = "";

var filterSet = {};
filterSet.family = {};
filterSet.role = {};
filterSet.gen = {};
filterSet.tier = {};
filterSet.surv = {};
filterSet.cost = {};
filterSet.a2a = {};
filterSet.a2g = {};
filterSet.manu = {};
filterSet.speed = {};
filterSet.cap = {};
var filteringFamily = false;
var currentFamily = "";

function init(){
  allPlanes = Array.from(document.querySelectorAll("td.plane"));
  allFamilies = Array.from(document.querySelectorAll("tr.family"));
  searchResults = document.getElementById("results");
  searchResultsHeader = document.getElementById("results-header");
  searchResultsSubheader = document.getElementById("results-subheader");

  listen();
  resetFilters(false);

  // Add active class to the current control button (highlight it)
  var btnContainer = document.getElementById("filter-controls");
  var els = btnContainer.getElementsByClassName("select");
  for (let i = 0; i < els.length; i++) {
    els[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}

function listen() {
  fam = document.getElementById("family-filter");
  fam.addEventListener("change", function (e){
    e.preventDefault();
    setFilter("family","txt",fam.options[fam.selectedIndex].text, 0, 0), false;
  })

  role = document.getElementById("role-filter");
  role.addEventListener("change", function (e){
    e.preventDefault();
    setFilter("role","txt",role.options[role.selectedIndex].text, 0, 0), false;
  })

  reset_button = document.getElementById("reset");
  reset_button.addEventListener("click", function (e){
    e.preventDefault();
    resetFilters(true);
  })

  for (let i = 0; i <= fields.slice(0, 8).length; i++) {
    console.log('setting up field '+fields[i])
    setNumericListeners(fields[i]);
  }
}

// this is the smart way. which breaks and I'm nto fixing it yet
function setNumericListeners(field) {
  var minimum = document.getElementById(`min-${field}`)
  var maximum = document.getElementById(`max-${field}`)
  console.log("found fields for"+maximum, minimum)

  minimum.addEventListener("change", function (e){
    setFilter(field, "num","", minimum.options[minimum.selectedIndex].text, maximum.options[maximum.selectedIndex].text), false;
  })

  maximum.addEventListener("change", function (e){
    setFilter(field, "num","", minimum.options[minimum.selectedIndex].text, maximum.options[maximum.selectedIndex].text), false;
  })
}

function resetFilters(reload){
  // fuck it. just reload. I'm not dealing with moving all the elements back around, in the right order. who gives a shit,
  if(reload){location.reload();}
  
  filterSet = {};
  filteringFamily = false;
  searchResults.style.display = "none"
  searchResultsHeader.style.display = "none"
  searchResultsSubheader.style.display = "none"
  
  for (let i = 0; i < allPlanes.length; i++) {
    w3AddClass(allPlanes[i], "show");
  }
  for (let i = 0; i < allFamilies.length; i++){
    w3AddClass(allFamilies[i], "show");
    // console.log(`${allFamilies[i].classList}`)
  }
  for (let i = 0; i <= fields.slice(0, 8).length; i++){
    document.getElementById(`min-${fields[i]}`).selectedIndex = 0;
    document.getElementById(`max-${fields[i]}`).selectedIndex = 0;
  }
  document.getElementById(`role-filter`).selectedIndex = 0;
  document.getElementById(`family-filter`).selectedIndex = 0;
}

function setFilter(field, type, text, min, max) {
  var filter = {};

  filter.field = field;
  filter.type = type;
  filter.text = text;
  if(min=="Any"){filter.min=-100;}else{filter.min = min;}
  if(max=="Any"){filter.max=100;}else{filter.max = max;}
  
  // console.log("Appending Filter Set: "+JSON.stringify(filter))
  filterSet[field] = filter;
  filterPlanes(filterSet);
}

function revealPlanes(planesShow, planesHide) {
  // console.log(`revealing ${planesShow.length} planes.`)
  for (let i=0;i<planesShow.length;i++) {
    if(!planesShow[i].classList.contains("show")){w3AddClass(planesShow[i], "show")};
    searchResults.appendChild(planesShow[i]);
  }
  for (let i=0;i<planesHide.length;i++) {
    if(planesHide[i].classList.contains("show")){w3RemoveClass(planesHide[i], "show")};
  }
}

function filterPlanes(filterSet) {
  // console.log(`filter set:${JSON.stringify(filterSet)}`)
  var planesShow = [];
  var planesHide = [];
  var familyShow = [];
  var familyHide = [];
  // filteringFamily = false;
  
  // remove show from all planes and families first
  for (let i = 0; i < allPlanes.length; i++) {
    if(allPlanes[i].classList.contains("show")){w3RemoveClass(allPlanes[i], "show")};
  }
  for (let i = 0; i < allFamilies.length; i++) {
    if(allFamilies[i].classList.contains("show")){w3RemoveClass(allFamilies[i], "show")};
  }
  // console.log("allPlanes removed:"+allPlanes.length);

  // identify targets
  for (let j=0; j<fields.length; j++){
    var currentField = fields[j];
    var currentFilter = filterSet[currentField];
    // console.log(`Field: ${currentField}; Filter:${currentFilter}`)
    searchResults.style.display = 'block'
    searchResultsHeader.style.display = 'block'
    searchResultsSubheader.style.display = 'block'
    if (currentFilter != undefined){

      for (let i = 0; i < allPlanes.length; i++) {
        var planeElement = allPlanes[i];
        var planeData = JSON.parse(planeElement.attributes[2].nodeValue);
        // console.log(`plane family: ${planeData.family}; ${planeData.currentField}`)
        if (!planesHide.includes(planeData.plane)){
          var show = false;
          var currentPlaneValue = planeData[currentField];
          var planeFamily = planeData.family;
          var planeFamilyElement = document.getElementsByClassName(planeFamily)[0];

          if (currentFilter.type == "num"){
            if (Number(currentFilter.min) <= Number(currentPlaneValue) && Number(currentPlaneValue) <= Number(currentFilter.max)){
              show = true;
            }
          }else{
            if(currentFilter.text == "All" || currentFilter.text == currentPlaneValue){
              // console.log(`${currentFilter.field} filter: adding ${planeData.plane} due to ${currentPlaneValue}`)
              show = true;
            }
          }
          if(show){
            // console.log(`Showing ${planeData.plane} based on ${currentField}.`)
            if(!planesShow.includes(planeElement)){
              planesShow.push(planeElement);
            }
            if (!familyShow.includes(planeFamilyElement)){
              if(!filteringFamily){
                familyShow.push(planeFamilyElement);
                // console.log(`show ${planeFamily} due to ${currentFilter.field}`)
              }
            }
          }else{
            if (!planesHide.includes(planeElement)){
              planesHide.push(planeElement);
            }
            if (!familyShow.includes(planeFamilyElement)) {
              if (!familyHide.includes(planeFamilyElement)){
                familyHide.push(planeFamilyElement);
                // console.log(`hide ${planeFamily} due to ${currentFilter.field}`)
              }
            }
          }
        }else{
          // console.log(`Disqualified plane. Not showing:${planeData.plane}`)
        }
      }
    }
    // console.log("Reveal list filled.");
  }
    // add show to the target classes
    // console.log(`showing families:${familyShow}. Hiding families:${familyHide}`)
  revealPlanes(planesShow, planesHide);

  // keep hidden after filter start
  // revealFamilies(familyShow, familyHide);  
}

// https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (let i = 0; i < arr2.length; i++) {
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
  for (let i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}