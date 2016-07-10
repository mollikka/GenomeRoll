var empty_pair = "nn";

function setup_genome_input(parsed_json, input_element) {
  for (var key in parsed_json.genotypes) {

    /*make an input box for the genotype*/
    var input_container = document.createElement("div");
    input_container.class = "input_container";

    var genome_input = document.createElement("input");
    genome_input.type = "text";
    genome_input.re_genes = get_genome_template(parsed_json, key);

    var label = document.createTextNode("Genome, "+key)

    var genome_output = document.createElement("ul");
    genome_input.output = genome_output;

    input_container.appendChild(label);
    input_container.appendChild(genome_input);
    input_container.appendChild(genome_output);
    input_element.appendChild(input_container);

    genome_input.oninput = function() {
      var genome = str_to_genome(this.value, this.re_genes);
      display_genome(genome, this.output, this.re_genes);
    }
  }
  return genome_input;
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
  console.log("Testing if",str,"is",gene_name," - ",!(gene === null));
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
  console.log("PARSING GENOME",str);
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
      console.log("FAILED TO PARSE GENOME");
      return null;
    } else {
      genome[gene[0]] = [gene[1], gene[2]];
    }
  }
  if (!verify_required(re_genes, genome)) {
    /*a required gene is missing*/
    console.log("REQUIRED GENE MISSING");
    return null;
  }
  console.log("GENOME PARSED SUCCESSFULLY");
  return genome;
}

function display_genome(genome, output_list_element, re_genes) {
  var genes_output = output_list_element;
  genes_output.innerHTML = "";
  if (genome === null) {
    return;
  }
  for (var i=0; i<re_genes.length; i++) {
    var gene_template = re_genes[i];
    var gene_name = gene_template[0];
    if (!(gene_name in genome)) continue;
    genes_output.innerHTML += "<li>";
    genes_output.innerHTML += gene_name;
    genes_output.innerHTML += " - ";
    genes_output.innerHTML += genome[gene_name][0];
    genes_output.innerHTML += ",";
    genes_output.innerHTML += genome[gene_name][1];
    genes_output.innerHTML += "</li>";
  }

}

