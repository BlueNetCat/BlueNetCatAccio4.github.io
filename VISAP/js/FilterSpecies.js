

class FilterSpecies {

  constructor(originalData){
    // Prepare data for List.js
    this.keys;

    // Lists objects
    this.speciesList;//new List('speciesEl', options, values);
    this.selSpeciesList;//new List('selSpeciesEl', optionsSel);
  }

  // Select item
  selectItem(e){
    e.stopPropagation();
    //console.log(e.srcElement.innerText.split("■ ")[1]);
    let speciesName = e.currentTarget.innerText.split("■ ")[1];
    this.switchFromList(speciesName, this.speciesList, this.selSpeciesList);
  };

  // Deselect item
  deselectItem(e){
    e.stopPropagation();
    let speciesName = e.currentTarget.innerText.split("■ ")[1];
    this.switchFromList(speciesName, this.selSpeciesList, this.speciesList);
  }

  selectAll(e){
    e.stopPropagation();
    for (var i = 0; i<this.speciesList.items.length; i++){
      this.switchFromList(this.speciesList.items[i]._values.name, this.speciesList, this.selSpeciesList)
      i--;
    }
  }

  deselectAll(){
    event.stopPropagation();
    for (var i = 0; i<this.selSpeciesList.items.length; i++){
      this.switchFromList(this.selSpeciesList.items[i]._values.name, this.selSpeciesList, this.speciesList)
      i--;
    }
  }

  // Return a list with the species names
  getSelected(){
    let selectedSpecies = [];
    for (var i = 0; i<this.selSpeciesList.items.length; i++)
      selectedSpecies[i] = this.selSpeciesList.items[i]._values.name;

    return selectedSpecies;
  }

  // Switch values from one list to the other
  switchFromList(speciesName, removeFromList, insertToList){
    let item = removeFromList.get("name", speciesName)[0];
    removeFromList.remove("name", speciesName);

    insertToList.add({
      "name": speciesName,
      "color":  item._values.color
    })
  }

  // Initalization function
  init(){

    // Selected items
    let selValues = undefined;

    // Prepare data for List.js once
    let values = [];
    if (this.keys === undefined){
      this.keys = Object.keys(palette);
      this.keys.forEach(item => values.push({"name": item, "color": palette[item].color}));
    } // Filter was already used
    else {
      this.speciesList.items.forEach(item => values.push(item._values));
      selValues = [];
      this.selSpeciesList.items.forEach(item => selValues.push(item._values));
    }

    // https://listjs.com/api/
    let options = {
      item: (values) => "<button class='btn btn-sm btn-outline-light m-2 speciesItem'>" +
                        "<span style='color:rgb("+values.color.toString()+")'> ■ </span>" +
                        values.name +
                        "</button>"
    };

    let optionsSel = {
      item: (values) => "<button class='btn btn-sm btn-light m-2 selSpeciesItem'>" +
                        "<span style='color:red'> ✖ </span>" +
                        "<span style='color:rgb("+values.color.toString()+")'> ■ </span>" +
                        values.name +
                        "</button>"
    }




    // Create HTML button elements
    this.speciesList = new List('speciesEl', options, values);
    // Add click events
    this.speciesList.list.childNodes.forEach((el)=>el.addEventListener("click", (e)=>this.selectItem(e)));
    // HTML list of selected items
    this.selSpeciesList = new List('selSpeciesEl', optionsSel, selValues);
    // Add click events
    this.selSpeciesList.list.childNodes.forEach((el)=>el.addEventListener("click", (e)=>this.deselectItem(e)));

  }



  // Filter the data
  filterData(selectedSpecies, dataForD3){
    let filteredData = JSON.parse(JSON.stringify(dataForD3));

    this.markItems(filteredData, selectedSpecies, null);
    return filteredData;
  }

  // This function is not optimal, but real-time is not requiered
  markItems(itemJSON, selectedSpecies, parentJSON){
    // Has children and its not selected (higher level than species)
    if (itemJSON.children && selectedSpecies.indexOf(itemJSON.name) == -1) {
      itemJSON.children.forEach((child) => this.markItems(child, selectedSpecies, itemJSON)); // Go to children
    }
    // One of the higher levels is selected
    else if (itemJSON.children && selectedSpecies.indexOf(itemJSON.name) != -1) {
      // Get the tags in the same level
      parentJSON.children.forEach((child) => {if((selectedSpecies.indexOf(child.name) == -1) || (selectedSpecies.indexOf(child.species) == -1) ) hideHigherLevel(child)})
    }
    // Lower level (species)
    else if (selectedSpecies.indexOf(itemJSON.species) == -1){ // If species is not in the array
      itemJSON.value = 0;
    }
  }

  // Set children values to 0
  hideHigherLevel(itemJSON){
    // Has children, continue
    if (itemJSON.children)
      itemJSON.children.forEach((child) => hideHigherLevel(child));
    else
      itemJSON.value = 0;
  }
}


export {FilterSpecies}
