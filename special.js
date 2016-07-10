function setup_special_options(parsed_json, input_element) {
  var special = parsed_json.special;
  var container = document.createElement("div");
  container.className = "input_container";

  var checkbox_list = document.createElement("ul");
  container.appendChild(checkbox_list);

  for (var key in special) {
    if (special[key].activation[0] != "option") continue;

    var listitem = document.createElement("li");
    checkbox_list.appendChild(listitem);

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = key;
    listitem.appendChild(checkbox);

    var label = document.createTextNode(key);
    listitem.appendChild(label);
  }

  input_element.appendChild(container);
}

function get_active_effects(parsed_json, dad_traits_parent, mom_traits_parent, user_specials_parent) {

  var mom_traits = [];
  var dad_traits = [];
  var chosen_specials = [];

  var m_els = mom_traits_parent.getElementsByTagName("input");
  for (var i=0; i<m_els.length; i++) {
    var el = m_els[i];
    if (el.checked) mom_traits.push(el.value);
  }

  var d_els = dad_traits_parent.getElementsByTagName("input");
  for (var i=0; i<d_els.length; i++) {
    var el = d_els[i];
    if (el.checked) dad_traits.push(el.value);
  }

  var o_els = user_specials_parent.getElementsByTagName("input");
  for (var i=0; i<o_els.length; i++) {
    var el = o_els[i];
    if (el.checked) chosen_specials.push(el.value);
  }

  var specialsdata = parsed_json.special;
  var maybe_active_specials = [];

  for (var key in specialsdata) {
    /*go through all defined specials*/
    var special = specialsdata[key];
    var activationmethod = special.activation[0];
    if (activationmethod == "option") {
      /*if this special is activated by user option, see if
      * user has activated this one*/
      if (chosen_specials.indexOf(key) > -1) {
        maybe_active_specials.push(key);
      }
    } else if (activationmethod == "trait") {
      /*if this special is activated by a trait, see if
       * one of the parents has it*/
      var trait = special.activation[1];
      if (mom_traits.indexOf(trait) > -1) {
        maybe_active_specials.push(key);
      } else if (dad_traits.indexOf(trait) > -1) {
        maybe_active_specials.push(key);
      }
    }
  }

  /*go through active specials again to see if there are conflicts*/
  var active_specials = maybe_active_specials.slice();
  console.log("");
  for (var i=0; i<maybe_active_specials.length; i++) {
    /*skip if already deactivated*/
    var special = maybe_active_specials[i];
    if (active_specials.indexOf(special) == -1) {continue;}
    console.log(maybe_active_specials[i]);
    var conflicts = specialsdata[special].disabledwith;
    console.log("disabledwith",conflicts);
    for (var j=0; j<conflicts.length; j++) {
      if (maybe_active_specials.indexOf(conflicts[j]) > -1) {
        active_specials.splice(active_specials.indexOf(special), 1);
        break;
      }
    }
  }

  console.log("actives",active_specials);
}
