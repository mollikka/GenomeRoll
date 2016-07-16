function setup_breed_button(parsed_json, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, parent_element, output_element) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Make a baby!";

  button.onclick = function() {
    breed_one_pup(parsed_json, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, output_element);
    console.log("ASD");
  };

  parent_element.appendChild(button);
}

function breed_one_pup(parsed_json, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, pup_output_element) {

  var dad_traits = get_traits_from_input(dad_traits_element);
  var dad_build = dad_build_element.value;

  var mom_traits = get_traits_from_input(mom_traits_element);
  var mom_build = mom_build_element.value;

  var pup_element = document.createElement("div");
  pup_element.className = "offspring";

  var label = document.createElement("h3");
  label.innerHTML = "Child";
  pup_element.appendChild(label);

  var is_male = true;

  var traitsoutput = document.createElement("p");
  traitsoutput.innerHTML = "Traits: " + breed_traits(parsed_json, dad_traits, mom_traits, is_male);
  pup_element.appendChild(traitsoutput);

  var buildoutput = document.createElement("p");
  buildoutput.innerHTML = "Build: " + breed_build(parsed_json, dad_build, mom_build);
  pup_element.appendChild(buildoutput);

  var removebutton = document.createElement("input");
  removebutton.type = "button";
  removebutton.value = "X";
  removebutton.onclick = function() {
    pup_output_element.removeChild(pup_element);
  };
  pup_element.appendChild(removebutton);

  pup_output_element.appendChild(pup_element);
}
