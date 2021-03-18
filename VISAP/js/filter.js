// Prepare data for List.js
var values = [];
var keys;

// Lists objects
var speciesList;//new List('speciesEl', options, values);
var selSpeciesList;//new List('selSpeciesEl', optionsSel);

// https://listjs.com/api/
var options;
var optionsSel;

// Select item
export const selectItem = (e) => {
  event.stopPropagation();
  //console.log(e.srcElement.innerText.split("■ ")[1]);
  let speciesName = e.currentTarget.innerText.split("■ ")[1];
  switchFromList(speciesName, speciesList, selSpeciesList);
};

// Deselect item
export const deselectItem = (e) => {
  event.stopPropagation();
  let speciesName = e.currentTarget.innerText.split("■ ")[1];
  switchFromList(speciesName, selSpeciesList, speciesList);
}

export const selectAll= () => {
  event.stopPropagation();
  for (var i = 0; i<speciesList.items.length; i++){
    switchFromList(speciesList.items[i]._values.name, speciesList, selSpeciesList)
    i--;
  }
}

export const deselectAll= () => {
  event.stopPropagation();
  for (var i = 0; i<selSpeciesList.items.length; i++){
    switchFromList(selSpeciesList.items[i]._values.name, selSpeciesList, speciesList)
    i--;
  }
}

// Return a list with the species names
export const getSelected = () => {
  let selectedSpecies = [];
  for (var i = 0; i<selSpeciesList.items.length; i++)
    selectedSpecies[i] = selSpeciesList.items[i]._values.name;

  return selectedSpecies;
}

// Switch values from one list to the other
const switchFromList = (speciesName, removeFromList, insertToList) => {
  let item = removeFromList.get("name", speciesName)[0];
  removeFromList.remove("name", speciesName);

  insertToList.add({
    "name": speciesName,
    "color":  item._values.color
  })
}

// Initalization function
export const init = () => {
  // Register button events
  window.selectItem = selectItem;
  window.deselectItem = deselectItem;
  window.selectAll = selectAll;
  window.deselectAll = deselectAll;

  // Prepare data for List.js once
  if (keys === undefined){
    keys = Object.keys(palette);
    keys.forEach(item => values.push({"name": item, "color": palette[item].color}));

    // https://listjs.com/api/
    options = {
      item: (values) => "<button onclick=\"selectItem(event)\" class='btn btn-sm btn-outline-light m-2 speciesItem'>" +
                        "<span style='color:rgb("+values.color.toString()+")'> ■ </span>" +
                        values.name +
                        "</button>"
    };

    optionsSel = {
      item: (values) => "<button onclick=\"deselectItem(event)\" class='btn btn-sm btn-light m-2 selSpeciesItem'>" +
                        "<span style='color:red'> ✖ </span>" +
                        "<span style='color:rgb("+values.color.toString()+")'> ■ </span>" +
                        values.name +
                        "</button>"
    }

  }

  // Create HTML button elements
  speciesList = new List('speciesEl', options, values);
  selSpeciesList = new List('selSpeciesEl', optionsSel);

}



// Filter the data
export const filterData = (selectedSpecies, dataForD3) => {
  let filteredData = JSON.parse(JSON.stringify(dataForD3));

  markItems(filteredData, selectedSpecies);
  return filteredData;
}

const markItems = (itemJSON, selectedSpecies) => {
  if (itemJSON.children) {
    itemJSON.children.forEach((child) => markItems(child, selectedSpecies));
  } else if (selectedSpecies.indexOf(itemJSON.species) == -1){ // If species is not in the array
    itemJSON.value = 0;
  }
}


export default {selectAll, selectItem, deselectItem, deselectAll, init, getSelected};
