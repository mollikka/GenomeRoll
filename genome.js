var empty_pair = "nn";

function setup_genome_input(parsed_json, input_element) {
  var input_container = document.createElement("div");
  input_container.className = "input_container";
  var label = document.createElement("h3");
  label.innerHTML = "Genome";
  input_container.appendChild(label);

  for (var key in parsed_json.genotypes) {

    /*make an input box for the genotype*/
    var genome_input = document.createElement("input");
    genome_input.type = "text";
    genome_input.re_genes = get_genome_template(parsed_json, key);

    var label = document.createElement("h4");
    label.innerHTML = key;

    var genome_output = document.createElement("div");
    genome_input.output = genome_output;

    input_container.appendChild(label);
    input_container.appendChild(genome_input);
    input_container.appendChild(genome_output);


    genome_input.oninput = function() {
      if (this.value == "") {
        this.className = "";
      } else if (str_to_genome(this.value, this.re_genes)===null) {
        this.className = "invalid_input";
      } else {
        this.className = "valid_input";
      }
    }
  }
  input_element.appendChild(input_container);
  return input_container;
}

function get_genome_template(jsondata,genome_name) {
  var data = jsondata.genotypes[genome_name];
  var genome = [];
  for (var key in data) {
    var gene_name = key;
    var genotypes = data[key].genotypes;
    var gene_required = data[key].required;
    var gene_string = genotypes.join("|");
    var gene_regex = new RegExp("^("+gene_string+")("+gene_string+")$");
    var gene = [gene_name, gene_regex, gene_required];
    genome.push(gene);
  }
  return genome;
}

function str_to_gene(re_genes, re_genes_index, str) {
  var i = re_genes_index;
  var gene_name = re_genes[i][0];
  var re_gene = re_genes[i][1];
  var gene = str.match(re_gene);
  if (gene === null) {
    /*failed to identify the gene*/
    return null;
  }

  gene_left = gene[1];
  gene_right = gene[2];
  return [gene_name, gene_left, gene_right];
}

function verify_required(re_genes, genome) {
  for (var i=0; i<re_genes.length; i++) {
    var gene_template = re_genes[i];
    var gene_required = gene_template[2];
    var gene_name = gene_template[0];
    if (gene_required && !(gene_name in genome)) {
      return false;
    }
  }
  return true;
}

function str_to_genome(str, re_genes) {
  var genome = {};
  var re_geneseparator = /[ ]+/;
  var re_gene_index = 0; //remembers how many genes from the template (in order) have been tested so far

  var genelist = str.split(re_geneseparator);
  for (var i=0; i<genelist.length; i++) {
    var genestr = genelist[i];
    if (genestr === "") continue; //first or last might be empty because of splitting
    if (genestr === empty_pair) continue; //explicitly ignore empty pairs
    var gene = null;
    for (var j=re_gene_index; j<re_genes.length; j++) {
      var gene_maybe = str_to_gene(re_genes, j, genestr);
      if (! (gene_maybe === null )) {
        gene = gene_maybe;
        re_gene_index = j+1;
        break;
      }
    }
    if (gene === null) {
      /*wrong gene order, duplicates, or unknown genes*/
      return null;
    } else {
      genome[gene[0]] = [gene[1], gene[2]];
    }
  }
  if (!verify_required(re_genes, genome)) {
    /*a required gene is missing*/
    return null;
  }
  return genome;
}

function get_genomes_from_input(parsed_json, input_element) {
  var genomes = {};
  var inputs = input_element.getElementsByTagName("input");

  for (var i=0; i<inputs.length; i++) {
    var genome_name = Object.keys(parsed_json.genotypes)[i];
    var re_genes = inputs[i].re_genes;
    genomes[genome_name] = str_to_genome(inputs[i].value, re_genes);
  }

  return genomes;
}

function genomes_to_str(parsed_json, genomes) {
  str = "";
  for (var key in genomes) {
    str += key + ": " + genome_to_str(parsed_json, key, genomes[key]) + "<br>";
  }
  return str;
}

function genome_to_str(parsed_json, genomename, genome) {
  var genes = [];

  //sort the displayed genotypes according to their order in the genome definition
  function compare(key) {
    var f = function(a, b) {
      return parsed_json.genotypes[genomename][key].genotypes.indexOf(a) - parsed_json.genotypes[genomename][key].genotypes.indexOf(b);
    };
    return f;
  }

  for (var key in genome) {
    if (genome[key][0]=="n" && genome[key][1]=="n") {
      continue;
    }
    var g_sorted = genome[key].slice(0).sort(compare(key));
    genes.push(g_sorted.join(""));
  }
  return genes.join(" ");
}

function breed_genomes(parsed_json, dad_genes, mom_genes) {
  var genedata = parsed_json.genotypes;
  var kidgenomes = {};
  for (var key in genedata) {
    var kidgenome = {};
    for (var gname in genedata[key]) {
      var MG, FG;
      MG = dad_genes[key][gname];
      FG = mom_genes[key][gname];

      if (MG === undefined) MG = ["n", "n"];
      if (FG === undefined) FG = ["n", "n"];

      var K1 = MG[Math.floor(Math.random() * 2)];
      var K2 = FG[Math.floor(Math.random() * 2)];
      kidgenome[gname] = [K1, K2];
    }
    kidgenomes[key] = kidgenome;
  }
  return kidgenomes;
}
