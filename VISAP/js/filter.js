// Prepare data for List.js
var values = [];
var keys = Object.keys(palette);
keys.forEach(item => values.push({"name": item, "color": palette[item].color}));

// https://listjs.com/api/
var options = {
  item: (values) => "<button onclick=\"selectItem(event)\" class='speciesItem'>" +
                    "<div class='square' style=background-color:rgb("+values.color.toString()+")>"+
                    "</div>" +
                    "<label class='label' style=text-align:center>"+
                    values.name + "</label>"+
                    "</button>"
};

var optionsSel = {
  item: (values) => "<button onclick=\"deselectItem(event)\" class='selSpeciesItem'>" +
                    "<div class='square' style=background-color:rgb("+values.color.toString()+")>"+
                    "</div>" +
                    "<label class='label' style=text-align:center>"+
                    values.name + "</label>"+
                    "</button>"
}

// Select item
export const selectItem = (e) => {
  let speciesName = e.srcElement.children[1].innerText;
  switchFromList(speciesName, speciesList, selSpeciesList);
};

// Deselect item
export const deselectItem = (e) => {
  let speciesName = e.srcElement.children[1].innerText;
  switchFromList(speciesName, selSpeciesList, speciesList);
}

export const selectAll= () => {
  for (var i = 0; i<speciesList.items.length; i++){
    switchFromList(speciesList.items[i]._values.name, speciesList, selSpeciesList)
    i--;
  }
}

const deselectAll= () => {
  for (var i = 0; i<selSpeciesList.items.length; i++){
    switchFromList(selSpeciesList.items[i]._values.name, selSpeciesList, speciesList)
    i--;
  }
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

var speciesList = new List('speciesEl', options, values);
var selSpeciesList = new List('selSpeciesEl', optionsSel);

export default selectAll;
