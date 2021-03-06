function setup_breed_button(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, user_specials_element, parent_element, output_element) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Make babies!";

  button.onclick = function() {
    breed_pups(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, user_specials_element, output_element);
  };

  parent_element.appendChild(button);
}

function breed_pups(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, user_specials_element, pup_output_element) {

  var dad_genes = get_genomes_from_input(parsed_json, dad_genome_input);
  var dad_traits = get_traits_from_input(dad_traits_element);
  var dad_build = dad_build_element.value;
  var dad_stats = parse_stats(parsed_json, dad_stats_element.value);

  var mom_genes = get_genomes_from_input(parsed_json, mom_genome_input);
  var mom_traits = get_traits_from_input(mom_traits_element);
  var mom_build = mom_build_element.value;
  var mom_stats = parse_stats(parsed_json, mom_stats_element.value);

  var specials = get_active_specials(parsed_json, dad_traits_element, mom_traits_element, user_specials_element);
  var effects = specials_to_effects(parsed_json, specials);

  var pup_count = breed_pupcount(effects);


  var litter_element = document.createElement("div");

  var removebutton = document.createElement("input");
  removebutton.type = "button";
  removebutton.value = "X";
  removebutton.className = "removebutton";
  removebutton.onclick = function() {
    pup_output_element.removeChild(litter_element);
  };
  litter_element.appendChild(removebutton);

  var label = document.createElement("h3");
  label.innerHTML = "Litter";
  litter_element.appendChild(label);

  for (var pup=0; pup<pup_count; pup++) {
    var pup_element = document.createElement("div");
    pup_element.className = "offspring";

    var label = document.createElement("h3");
    label.innerHTML = "Child";
    pup_element.appendChild(label);

    var is_male = breed_ismale(effects);
    var genderoutput = document.createElement("p");
    if (is_male) genderoutput.innerHTML = "Male";
    else genderoutput.innerHTML = "Female";
    pup_element.appendChild(genderoutput);

    var genes = breed_genomes(parsed_json, dad_genes, mom_genes);
    var genomeoutput = document.createElement("p");
    genomeoutput.innerHTML = genomes_to_str(parsed_json, genes);
    pup_element.appendChild(genomeoutput);

    if (get_effect_value(effects, "extraGenomeRoll", false)) {
      var extra_genes = breed_genomes(parsed_json, dad_genes, mom_genes);
      var extra_genomeoutput = document.createElement("p");
      extra_genomeoutput.innerHTML = "extra roll:<br>" + genomes_to_str(parsed_json, extra_genes);
      pup_element.appendChild(extra_genomeoutput);
    }

    var traitsoutput = document.createElement("p");
    traitsoutput.innerHTML = "Traits: " + breed_traits(parsed_json, dad_traits, mom_traits, is_male);
    pup_element.appendChild(traitsoutput);

    var build = breed_build(parsed_json, dad_build, mom_build, effects);
    var buildoutput = document.createElement("p");
    buildoutput.innerHTML = "Build: " + build;
    pup_element.appendChild(buildoutput);

    var statsoutput = document.createElement("p");
    statsoutput.innerHTML = "Stats: " + stats_to_str(calculate_pup_stats(parsed_json, dad_stats, mom_stats, build));
    pup_element.appendChild(statsoutput);

    litter_element.appendChild(pup_element);
  }
  pup_output_element.insertBefore(litter_element, pup_output_element.childNodes[0]);
}

function setup_stats_button(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, user_specials_element, parent_element, output_element) {
  var button = document.createElement("input");
  button.type = "button";
  button.value = "Statistical average";

  button.onclick = function() {
    breed_statistics_test(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, user_specials_element, output_element);
  };

  parent_element.appendChild(button);
}

function breed_statistics_test(parsed_json, dad_genome_input, mom_genome_input, dad_traits_element, mom_traits_element, dad_build_element, mom_build_element, dad_stats_element, mom_stats_element, user_specials_element, pup_output_element) {

  var dad_genes = get_genomes_from_input(parsed_json, dad_genome_input);
  var dad_traits = get_traits_from_input(dad_traits_element);
  var dad_build = dad_build_element.value;
  var dad_stats = parse_stats(parsed_json, dad_stats_element.value);

  var mom_genes = get_genomes_from_input(parsed_json, mom_genome_input);
  var mom_traits = get_traits_from_input(mom_traits_element);
  var mom_build = mom_build_element.value;
  var mom_stats = parse_stats(parsed_json, mom_stats_element.value);

  var specials = get_active_specials(parsed_json, dad_traits_element, mom_traits_element, user_specials_element);
  var effects = specials_to_effects(parsed_json, specials);


  var stat_output_p = document.createElement("div");

  var removebutton = document.createElement("input");
  removebutton.type = "button";
  removebutton.value = "X";
  removebutton.className = "removebutton";
  removebutton.onclick = function() {
    pup_output_element.removeChild(stat_output_p);
  };
  stat_output_p.appendChild(removebutton);

  var label = document.createElement("h3");
  label.innerHTML = "Statistics test";
  stat_output_p.appendChild(label);

  var repeatbutton = document.createElement("input");
  repeatbutton.type = "button";
  repeatbutton.value = "Repeat";
  repeatbutton.onclick = function() {
    repeat();
  };
  stat_output_p.appendChild(repeatbutton);

  var stat_output_element = document.createElement("div");
  stat_output_element.className = "offspring";
  stat_output_p.appendChild(stat_output_element);

  var repeats_output = document.createElement("p");
  stat_output_element.appendChild(repeats_output);

  var pup_counts_output = document.createElement("p");
  stat_output_element.appendChild(pup_counts_output);

  var gender_count_output = document.createElement("p");
  stat_output_element.appendChild(gender_count_output);

  var male_trait_counts_output = document.createElement("p");
  stat_output_element.appendChild(male_trait_counts_output);

  var female_trait_counts_output = document.createElement("p");
  stat_output_element.appendChild(female_trait_counts_output);

  var build_counts_output = document.createElement("p");
  stat_output_element.appendChild(build_counts_output);

  pup_output_element.insertBefore(stat_output_p, pup_output_element.childNodes[0]);

  var repeat_count = 0;
  var pup_counts = {};
  var build_counts = {};
  var male_trait_counts = {};
  var female_trait_counts = {};
  var male_count = 0;

  var repeat = function() {
    for (var i=0; i<1000; i++) {
      repeat_count += 1;
      var pup_count = breed_pupcount(effects);
      var build = breed_build(parsed_json, dad_build, mom_build, effects);
      var male_traits = breed_traits(parsed_json, dad_traits, mom_traits, true);
      var female_traits = breed_traits(parsed_json, dad_traits, mom_traits, false);

      if (pup_count in pup_counts) {
        pup_counts[pup_count] += 1;
      } else {
        pup_counts[pup_count] = 1;
      }

      if (build in build_counts) {
        build_counts[build] += 1;
      } else {
        build_counts[build] = 1;
      }

      if (breed_ismale(effects)) {
        male_count += 1;
      }

      for (var j=0; j<male_traits.length; j++) {
        var trait = male_traits[j];
        if (trait in male_trait_counts) {
          male_trait_counts[trait] += 1;
        } else {
          male_trait_counts[trait] = 1;
        }
      }

      for (var j=0; j<female_traits.length; j++) {
        var trait = female_traits[j];
        if (trait in female_trait_counts) {
          female_trait_counts[trait] += 1;
        } else {
          female_trait_counts[trait] = 1;
        }
      }
    }

    repeats_output.innerHTML = repeat_count.toString() + " repeats";

    pup_counts_output.innerHTML = "PUPS:<br>";
    for (var i in pup_counts) {
      pup_counts_output.innerHTML += i.toString() + ": " + pup_counts[i]/repeat_count + "<br>";
    }
    gender_count_output.innerHTML = "MALE RATIO:<br>"+male_count/repeat_count;

    build_counts_output.innerHTML = "BUILDS:<br>";
    for (var i in build_counts) {
      build_counts_output.innerHTML += i.toString() + ": " + build_counts[i]/repeat_count + "<br>";
    }

    male_trait_counts_output.innerHTML = "MALE TRAITS:<br>";
    for (var i in male_trait_counts) {
      male_trait_counts_output.innerHTML += i + ": " + male_trait_counts[i]/repeat_count + "<br>";
    }

    female_trait_counts_output.innerHTML = "FEMALE TRAITS:<br>";
    for (var i in female_trait_counts) {
      female_trait_counts_output.innerHTML += i + ": " + female_trait_counts[i]/repeat_count + "<br>";
    }
  };
  repeat();
}
