var empty_pair = "nn"

//the genome template
var re_genes_color = [
  /*OUTPUT WILL BE IN THIS ORDER
    gene: gene name, regex, required*/
  //genotype(color)(required)
  ["Extension", new RegExp("^(E|e)(E|e)$"), true],
  ["Agouti", new RegExp("^(A|Ay|Ad|At|a)(A|Ay|Ad|At|a)$"), true],
  //genotype(color)(optional)
  ["C gene", new RegExp("^(n|C)(n|C)$"), false],
  ["B gene", new RegExp("^(n|B)(n|B)$"), false],
  ["Z gene", new RegExp("^(n|Z)(n|Z)$"), false],
  ["D gene", new RegExp("^(n|D)(n|D)$"), false],
  ["Pearl", new RegExp("^(n|prl)(n|prl)$"), false],
  ["X gene", new RegExp("^(n|X)(n|X)$"), false],
  ["Y gene", new RegExp("^(n|Y)(n|Y)$"), false],
  ["O gene", new RegExp("^(n|O|Od)(n|O|Od)$"), false],
  ["P gene", new RegExp("^(n|P)(n|P)$"), false],
  ["R gene", new RegExp("^(n|R|rs)(n|R|rs)$"), false],
  ["Dty gene", new RegExp("^(n|Dty)(n|Dty)$"), false],
  ["Mnt gene", new RegExp("^(n|Mnt)(n|Mnt)$"), false],
  ["V gene", new RegExp("^(n|V)(n|V)$"), false],
  ["Sph gene", new RegExp("^(n|Sph)(n|Sph)$"), false],
  ["U gene", new RegExp("^(n|U)(n|U)$"), false],
  ["f gene", new RegExp("^(n|f)(n|f)$"), false],
  ["Fr gene", new RegExp("^(n|Fr)(n|Fr)$"), false],
  ["Sk gene", new RegExp("^(n|Sk)(n|Sk)$"), false],
  ["Smr gene", new RegExp("^(n|Smr)(n|Smr)$"), false],
  ["M gene", new RegExp("^(n|M)(n|M)$"), false],
  ["Cp gene", new RegExp("^(n|Cp)(n|Cp)$"), false],
  ["Sdl gene", new RegExp("^(n|Sdl)(n|Sdl)$"), false],
  ["Fwl gene", new RegExp("^(n|Fwl)(n|Fwl)$"), false],
  ["G gene", new RegExp("^(n|G)(n|G)$"), false],
  ["Kd gene", new RegExp("^(n|Kd)(n|Kd)$"), false],
  ["Q gene", new RegExp("^(n|Q|q)(n|Q|q)$"), false],
  ["P weird", new RegExp("^(n|Pm|Pp|Pc)(n|Pm|Pp|Pc)$"), false],
  ["wlf gene", new RegExp("^(n|wlf)(n|wlf)$"), false],
  ["Ld gene", new RegExp("^(n|Ld)(n|Ld)$"), false],
  ["Ink gene", new RegExp("^(n|Ink)(n|Ink)$"), false],
  ["Crc gene", new RegExp("^(n|Crc)(n|Crc)$"), false],
  ["Bl gene", new RegExp("^(n|Bl)(n|Bl)$"), false],
  ["Cdr gene", new RegExp("^(n|Cdr)(n|Cdr)$"), false],
  ["Fwn gene", new RegExp("^(n|Fwn)(n|Fwn)$"), false],
  ["I gene", new RegExp("^(n|I)(n|I)$"), false],
  ["S something", new RegExp("^(n|Sp|Sb)(n|Sp|Sb)$"), false],
  ["T gene", new RegExp("^(n|T)(n|T)$"), false],
  ["W gene", new RegExp("^(n|W)(n|W)$"), false],
  ["Bd gene", new RegExp("^(n|Bd)(n|Bd)$"), false],
  ["Gvl gene", new RegExp("^(n|Gvl)(n|Gvl)$"), false],
  ["N gene", new RegExp("^(n|N\\+|N\\-|No)(n|N\\+|N\\-|No)$"), false],
];
var re_genes_other = [
  //genotype(other)(required)
  ["Eye color B", new RegExp("^(B|b)(B|b)$"), true],
  ["Eye color A", new RegExp("^(A|Ah|a)(A|Ah|a)$"), true],
  ["Mane", new RegExp("^(Mn|Mkl|Ms|Mbr)(Mn|Mkl|Ms|Mbr)$"), true],
  ["Fur", new RegExp("^(Tn|Ts|Tnc)(Tn|Ts|Tnc)$"), true],
  ["Tail", new RegExp("^(Ls|Lh|Ll)(Ls|Lh|Ll)$"), true],

  //genotype(other)(optional)
  ["alb", new RegExp("^(n|Alb)(n|Alb)$"), false],
  ["brn", new RegExp("^(n|Brn)(n|Brn)$"), false],
  ["mel", new RegExp("^(n|Mel)(n|Mel)$"), false],
  ["som", new RegExp("^(n|Som)(n|Som)$"), false],
]
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
    return null
  }
  console.log("GENOME PARSED SUCCESSFULLY");
  return genome;
}

function display_genome(genome, output_list_element, re_genes) {
  var genes_output = output_list_element;
  genes_output.innerHTML = "";
  if (genome === null) {
    genes_output.innerHTML = "<li>Not valid genome</li>";
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

