// To be filterd 
let stackElements = [];
let filteredStack = [];
let currentStack = {};

const container = document.querySelector(".container");
const currentitems = document.querySelector(".current-stack");
const clearButton = document.querySelector(".clear-btn");

// Listeners
clearButton.addEventListener("click", event =>{
    event.preventDefault();
    let items = els("[data-label=filteredItem]");
    items.forEach(node => node.remove())
    stackElements.forEach(stack => {
        stack.element.classList.remove("d-none");
        stack.available = true;
    })
    checkFilterContainer();
    currentStack = {};
})


// Getters
function el(e) {
    return document.querySelector(e);
}

function els(e) {
    return document.querySelectorAll(e);
}

// Manipulate
// Sorry for the naming of variable or classes, I got used to
// naming things so short because that's what we do when doing
// competitive programming

function filterStack(item, element) {
    let ar = [];
    currentitems.prepend(element);
    stackElements.forEach(stack => {
        if (stack.available && !stack.filter.includes(item)) {
            stack.element.classList.add("d-none");
            ar.push(stack.element);
            stack.available = false;
        }  
    })
    currentStack[item] = ar;
    checkFilterContainer();
}

function filterEvent(element) {
    element.addEventListener("click", (e) => {
        e.preventDefault();
        delete currentStack[element.textContent];
        unFilterStack();
        element.remove();
        checkFilterContainer();
    })
}

function unFilterStack() {
    stackElements.forEach(stack =>{
        let check = Object.keys(currentStack).every(key => stack.filter.includes(key));
        if (check) {
            stack.element.classList.remove("d-none");
            stack.available = true;
        }
    })
}

function checkFilterContainer() {
    if(Math.floor(currentitems.childNodes.length / 2) == 1) {
        currentitems.classList.add("d-none")
    } else{
        currentitems.classList.remove("d-none")
    }
}


// The reason for using promise is that since we are fetching something
// from the server, a promise is proposed in here
const promise = new Promise((resolve, reject) =>{

    const parser = new XMLHttpRequest();
    parser.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            resolve(JSON.parse(this.responseText));
        }
    };
    parser.open("GET", "data.json", true);
    parser.send();
});


promise.then(item => {
    // We fetch the JSON content then continue to pipe it
    // React like but hey, pure js right
    let element = "";

    item.forEach(data => {
        let stack = [];
        let change = document.createElement("div");
        change.className = `block flex flex--a-center flex--j-between ${data.featured? 'featured' : ''}`
        element = `
            <div class="flex flex--a-center flex--name-gap">
                <img class="website-image" src="${data.logo}" alt="logo of website">
                <div class="flex flex--column flex--j-around flex--company-gap">
                    <div class="flex flex--a-center flex--feature-gap">
                        <p class="f-15 f-700 dd-cyan">${data.company}</p>
                        ${data.new? '<div class="new dd-cyan-bg f-700">NEW!</div>' : ''}
                        ${data.featured? '<div class="featured-true vdg-cyan-bg f-700">FEATURED</div>' : ''}
                    </div>
                    <p class="f-20 f-700">${data.position}</p>
                    <div class="flex flex--contract-gap">
                        <p class="n-links f-15 l-dark">${data.postedAt}</p>
                        <p class="n-links f-15 l-dark">${data.contract}</p>
                        <p class="n-links f-15 l-dark">${data.location}</p>
                    </div>
                </div>
            </div>

            <div class="flex flex--skills-gap">
                <a href="#" data-label="filterItem" class="f-14">${data.role}</a>
                <a href="#" data-label="filterItem" class="f-14">${data.level}</a>
                ${Array(data.languages.length)
                .fill()
                .map((item, index) =>{
                    return `
                    <a href="#" data-label="filterItem" class="f-14">${data.languages[index]}</a>
                    `
                })
                .join("")}
                ${Array(data.tools.length)
                .fill()
                .map((item, index) => {
                    return `
                    <a href="#" data-label="filterItem" class="f-14">${data.tools[index]}</a>
                    `
                })
                .join("")}
            </div>
        `
        stack.push(data.role, data.level, ...data.languages, ...data.tools);
        change.innerHTML = element;
        container.appendChild(change);
        stackElements.push({element: change, filter: stack, available: true});
    })
    
    return item;

}).then(data =>{    
    const filterItems = els("[data-label=filterItem]");

    
    filterItems.forEach(item =>{
        item.addEventListener("click", function(event) {
            event.preventDefault();
            let a = this.cloneNode(true);
            a.setAttribute("data-label", "filteredItem");

            if(Object.keys(currentStack).length){ 
                if(!(item.textContent in currentStack)){
                    filterStack(item.textContent, a);
                    filterEvent(a);
                }
            } else {
                filterStack(item.textContent, a);
                filterEvent(a);
            }
        })
    })
})

// Needs to be prevented default