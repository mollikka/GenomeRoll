function setup_breed_button(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, parent_element, output_element) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Make a baby!";

  button.onclick = function() {
    breed_one_pup(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, output_element);
    console.log("ASD");
  };

  parent_element.appendChild(button);
}

function breed_one_pup(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, pup_output_element) {

  console.log(dad_stats_element);
  console.log(dad_stats_element.value);
  var dad_genes = get_genomes_from_input(parsed_json, dad_genome_input);
  var dad_traits = get_traits_from_input(dad_traits_element);
  var dad_build = dad_build_element.value;
  var dad_stats = parse_stats(parsed_json, dad_stats_element.value);

  var mom_genes = get_genomes_from_input(parsed_json, mom_genome_input);
  var mom_traits = get_traits_from_input(mom_traits_element);
  var mom_build = mom_build_element.value;
  var mom_stats = parse_stats(parsed_json, mom_stats_element.value);
  console.log("DAD STATS",dad_stats);
  console.log("MOM STATS",mom_stats);

  var pup_element = document.createElement("div");
  pup_element.className = "offspring";

  var label = document.createElement("h3");
  label.innerHTML = "Child";
  pup_element.appendChild(label);

  var is_male = breed_ismale();
  var genderoutput = document.createElement("p");
  if (is_male) genderoutput.innerHTML = "Male";
  else genderoutput.innerHTML = "Female";
  pup_element.appendChild(genderoutput);

  console.log(dad_genes);
  console.log(mom_genes);
  var genes = breed_genomes(parsed_json, dad_genes, mom_genes);
  var genomeoutput = document.createElement("p");
  console.log(genes);
  console.log(genomes_to_str(parsed_json, genes));
  genomeoutput.innerHTML = genomes_to_str(parsed_json, genes);
  pup_element.appendChild(genomeoutput);

  var traitsoutput = document.createElement("p");
  traitsoutput.innerHTML = "Traits: " + breed_traits(parsed_json, dad_traits, mom_traits, is_male);
  pup_element.appendChild(traitsoutput);

  var build = breed_build(parsed_json, dad_build, mom_build);
  var buildoutput = document.createElement("p");
  buildoutput.innerHTML = "Build: " + build;
  pup_element.appendChild(buildoutput);

  var statsoutput = document.createElement("p");
  statsoutput.innerHTML = "Stats: " + stats_to_str(calculate_pup_stats(parsed_json, dad_stats, mom_stats, build));
  pup_element.appendChild(statsoutput);

  var removebutton = document.createElement("input");
  removebutton.type = "button";
  removebutton.value = "X";
  removebutton.onclick = function() {
    pup_output_element.removeChild(pup_element);
  };
  pup_element.appendChild(removebutton);

  pup_output_element.appendChild(pup_element);
}
