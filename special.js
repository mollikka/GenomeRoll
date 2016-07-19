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
  return container;
}

function get_user_specials(parsed_json, dad_traits_element, mom_traits_element, user_specials_element) {
  var mom_traits = get_traits_from_input(mom_traits_element);
  var dad_traits = get_traits_from_input(dad_traits_element);
  var chosen_specials = [];

  var o_els = user_specials_element.getElementsByTagName("input");
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
  return maybe_active_specials;
}

function get_active_specials(parsed_json, dad_traits_element, mom_traits_element, user_specials_element) {

  var maybe_active_specials = get_user_specials(parsed_json, dad_traits_element, mom_traits_element, user_specials_element);
  var specialsdata = parsed_json.special;

  /*go through active specials again to see if there are conflicts*/
  var active_specials = maybe_active_specials.slice();
  for (var i=0; i<maybe_active_specials.length; i++) {
    /*skip if already deactivated*/
    var special = maybe_active_specials[i];
    if (active_specials.indexOf(special) == -1) {continue;}
    var conflicts = specialsdata[special].disabledwith;
    for (var j=0; j<conflicts.length; j++) {
      if (maybe_active_specials.indexOf(conflicts[j]) > -1) {
        active_specials.splice(active_specials.indexOf(special), 1);
        break;
      }
    }
  }
  return active_specials;
}

function specials_to_effects(parsed_json, active_specials) {

  var active_effects = {};

  var pass_requirements = function(active_specials, requirements) {
    for (var i=0; i<requirements.length; i++) {
      if (active_specials.indexOf(requirements[i])<0) {
        return false;
      }
    }
    return true;
  };

  var effectsdata = parsed_json.effects;
  for (var key in effectsdata) {
    var effecttype = effectsdata[key].type;
    var requirements = effectsdata[key].requires;
    var effectvalue = effectsdata[key].value;
    if (!pass_requirements(active_specials, requirements)) continue;
    active_effects[effecttype] = effectvalue;
  }
  console.log(active_effects);
  return active_effects;
}

function get_effect_value(active_effects, key, default_value) {
  var value = default_value;
  if (key in active_effects) {
    value = active_effects[key];
  }
  return value;
}

function breed_ismale(active_effects) {
  var male_chance = get_effect_value(active_effects, "maleChance", 0.5);
  if (Math.random() < male_chance)
    return true;
  return false;
}

function breed_pupcount(active_effects) {
  var pup_chance = get_effect_value(active_effects, "offspringChance", [0, 1]);
  var luck = Math.random();
  var cumulative_chance = 0;
  var count;
  for (count=0; count<pup_chance.length; count++) {
    cumulative_chance += pup_chance[count];
    if (luck < cumulative_chance) break;
  }
  return count;
}
