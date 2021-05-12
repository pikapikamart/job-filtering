let currentStack = [];
let filters = {};

const container = document.querySelector(".container");
const currentitems = document.querySelector(".current-stack");
const clearButton = document.querySelector(".clear-btn");

clearButton.addEventListener("click", clearAllFilters);

fetch("data.json").then(response => {
   return response.json();
}).then(information => {

   // Populate
   createInitialElements(information);
   return information;
}).then(data => {
   // Needs to add listeners
   const filterItems = document.querySelectorAll("[data-label=filterItem]");

   filterItems.forEach(item => {
      item.addEventListener("click", function (event) {
         let filterClone = this.cloneNode(true);
         filterClone.setAttribute("data-label", "filteredItem");
         if (!filters[item.textContent]) {
            filterStack(item.textContent, filterClone);
            filteredEvent(filterClone);
         }
      })
   })
})

function createInitialElements(peopleData) {

   peopleData.forEach(person => {
      let change = document.createElement("div");
      change.className = `block flex flex--a-center flex--j-between ${person.featured? 'featured' : ''}`
      let element = `
            <div class="flex flex--a-center flex--name-gap">
                <img class="website-image" src="${person.logo}" alt="logo of website">
                <div class="flex flex--column flex--j-around flex--company-gap">
                    <div class="flex flex--a-center flex--feature-gap">
                        <p class="f-15 f-700 dd-cyan">${person.company}</p>
                        ${person.new? '<div class="new dd-cyan-bg f-700">NEW!</div>' : ''}
                        ${person.featured? '<div class="featured-true vdg-cyan-bg f-700">FEATURED</div>' : ''}
                    </div>
                    <p class="f-20 f-700">${person.position}</p>
                    <div class="flex flex--contract-gap">
                        <p class="n-links f-15 l-dark">${person.postedAt}</p>
                        <p class="n-links f-15 l-dark">${person.contract}</p>
                        <p class="n-links f-15 l-dark">${person.location}</p>
                    </div>
                </div>
            </div>

            <div class="flex flex--skills-gap">
                <button data-label="filterItem" class="f-14">${person.role}</button>
                <button data-label="filterItem" class="f-14">${person.level}</button>
                ${Array(person.languages.length)
                .fill()
                .map((item, index) =>{
                    return `
                    <button data-label="filterItem" class="f-14">${person.languages[index]}</button>
                    `
                })
                .join("")}
                ${Array(person.tools.length)
                .fill()
                .map((item, index) => {
                    return `
                    <button data-label="filterItem" class="f-14">${person.tools[index]}</button>
                    `
                })
                .join("")}
            </div>
        `;
      change.innerHTML = element;
      container.appendChild(change);
      currentStack.push({
         attributes: [person.role, person.level, ...person.languages, ...person.tools],
         available: true,
         domElement: change
      });
   })
}

function filterStack(filter, element) {
   currentitems.prepend(element);
   currentStack.forEach(stack => {
      if (stack.available && !stack.attributes.includes(filter)) {
         stack.domElement.classList.add("d-none");
         stack.available = false
      }
   })
   // Filter is working
   filters[filter] = filter;
   checkFilterContainer();
}

function checkFilterContainer() {
   if (Math.floor(currentitems.childNodes.length / 2) == 1) {
      currentitems.classList.add("d-none")
   } else {
      currentitems.classList.remove("d-none")
   }
}

function filteredEvent(filter) {
   filter.addEventListener("click", () => {
      delete filters[filter.textContent];
      filter.remove();
      checkFilterContainer();
      unFilterStack();
   })
}


function unFilterStack() {
   const filterKeys = Object.keys(filters);
   currentStack.forEach(stack =>{
      let check = filterKeys.every(key => stack.attributes.includes(key));
      if (check) {
         stack.domElement.classList.remove("d-none");
         stack.available = true;
      }
   })
}

function clearAllFilters() {
   const filterItems = document.querySelectorAll("[data-label=filteredItem]");
   filterItems.forEach(filter => filter.remove());
   currentStack.forEach(stack => {
      stack.domElement.classList.remove("d-none");
      stack.available = true;
   })
   checkFilterContainer();
   filters = {};
}