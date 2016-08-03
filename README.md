#Breeding Simulator 2016

This program is a hired work I made for an online adoptables
game. The software is available to third-parties
(The MIT Licence).

Do not use the original JSON files in this repository without
permission, as it is proprietary to the original client.
Learn from them and write your own configuration or ask me
for help.

##Configuration

The breeding system is defined in a single JSON file
(see fantasydog.json for a working example).
The basic structure of the JSON file is as follows

```json
{
  "build": {
    "stats": [...],
    "modifiers": {...},
    "inheritance": {...}
  },
  "genotypes": {...},
  "traits": {...},
  "special": {...},
  "effects": [...]
}
```

###Build

Relevant numerical status attributes are defined in the build category. For example, if you want creatures to have jumping and philosophy skills, the build definition could look like this:

```json
 "build": {
    "stats": [
      "Flying",
      "Philosophy"
    ],
    "modifiers": {
      "S": 1.5,
      "A": 1.8,
      "B": 2
    },
    "inheritance": {
      "SS":["S","S","S","A"],
      "SA":["S","A"],
      "SB":["S","A","A","B"],
      "AA":["S","A","A","B"],
      "AB":["A","B"],
      "BB":["A","B","B","C"]
    }
  },
```

Modifiers are creature-specific things, that affect how offspring inherits status attributes. Offspring_status = (Mom_status + Dad Status)/Offspring_modifier

The child's build modifier is determined by parents' modifiers. In the "inheritance" dict, parents' build modifiers correspond to a list of possible offspring builds (chosen randomly).

####Notes
* In the current version, at least one modifier must exist. (Tell me if you need to change this!)
* In the current version, at least one status name must exist.
* Every combination of two build modifiers must have a corresponding list entry in "inheritance". The key can be "SA" or "AS" for a case where parents have builds "S" and "A". Don't define both at once, though.

###Genotypes

Genotypes are the meat and bones of breeding (they're in it's DNA!). The genes are organized into groups. You could have just one group called "Genome" or you could have a bunch.
In this example there are two gene groups, "color" and "face".

```json
  "genotypes": {
   "color": {
      "Extension": {
        "required": true,
        "genotypes": ["E","e"]},
      "Agouti": {
        "required": true,
        "genotypes": ["A","Ay","Ad","At","a"]},
    },
    "face": {
      "Nose length": {
        "required": true,
        "genotypes": ["No", "Ny"]},
      "Freckles": {
        "required": false,
        "genotypes": ["Fr", "n"]},
    },
  }
```

As in the example, a gene is defined by a dict key (the name of the gene), a list of possible genotypes, and whether or not that gene is "required". Required means that it *must* be explicitly visible in the written genome. Basically it's a good idea to set required as false if there's a chance this gene is empty (= "nn"). When reading user input strings, any implicit genotypes are assumed to be empty.

####Notes

* In the current version, there must be at least one gene group.
* A gene group must have at least one defined gene.
* To be safe, make sure there's no chance of confusion when reading genes. For example, having a required gene with the genotype "n" is probably a bad idea.

###Traits

Traits are random things creatures can have. They're kind of like genes, but they support mutation. Here's a possible list of traits:

```json
  "traits": {
    "Agile": {
      "male": true,
      "female": true,
      "inherit": 0.5,
      "mutate": 0
    },
    "Nosy": {
      "male": true,
      "female": true,
      "inherit": 0.3,
      "mutate": 0
    }
  }
```

Trait name is defined by their dict key. Traits also have other variables: "male" and "female" define whether a specific gender can have this trait (affects what the user can input and what offspring can inherit and mutate). "inherit" is a chance a child would receive this trait if their parent has it (out of 1). If both parents have it, the chance is effectively calculated twice. "mutate" is a chance a child can receive this trait independently without getting it from their parents.

####Notes
* Defining zero traits should be fine. Just leave the "traits" dict empty (`"traits": {}`)

###Special effects

Special effects are extra things the user can activate to affect the results. "special" section in the JSON defines the choices the user can make. This example defines two mutually exclusive options:
```json
"special": {
    "Prime": {
      "disabledwith": [
        "Doubleprime",
      ],
      "activation": ["option"]
    },
    "Doubleprime": {
      "disabledwith": [
        "Prime",
      ],
      "activation": ["option"]
    },
  },
```
Possible values for "activation" are `["option"]` (Give user explicit checkbox for this)
and `["trait",Traitname]` (Activate this option by choosing a specific parental trait - Doesn't matter if both parents or just one parent has it))

Finally, the actual effect the special options have is defined in the "effects" section of the JSON. An effect has a list of required specials (if empty, the effect is active by default), a type (check the list below for available types) and a value (specific to each type). Here's an example:

```json
  "effects": [
    {
      "requires": [],
      "type": "offspringChance",
      "value": [0, 0.25, 0.25, 0.25, 0.25]
    },
    {
      "requires": [],
      "type": "maleChance",
      "value": 0.5
    },
    {
      "requires": ["Prime"],
      "type": "offspringChance",
      "value": [0, 0, 0.3333, 0.3333, 0.3334]
    },
    {
      "requires": ["Doubleprime"],
      "type": "offspringChance",
      "value": [0, 0, 0, 0.5, 0.5]
    }
  ]
```

####Special effect types
|Type              |Description                                         |Values                                 |Default |
|------------------|----------------------------------------------------|----------------------                 |--------|
|maleChance        |Chance that a baby is male                          |Numerical value 0 to 1                 |0.5     |
|offspringChance   |Chance that a litter has a specific amount of babies|List of numerical values adding up to 1 (first value for 0 babies, second for 1, 3rd for 2...)|[0, 1.0]|
|bestAvailableBuild|Always choose the build that gives the best stats   |true or false|false|

####Notes
* The system prefers effects that come later in the list. Put default values first in the list, and the ones that trump everything else in the end.
