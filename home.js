const addBtn = document.getElementById("add-button");
const closeBtn = document.getElementById("close-button");
const modal = document.getElementById("modal");
const currentUser = localStorage.getItem("currentUser");

// These keys will now be like "alice_items", "bob_income", etc.
const itemsKey = `${currentUser}_items`;
const incomeKey = `${currentUser}_income`;
const spentKey = `${currentUser}_spent`;


var items = JSON.parse(localStorage.getItem(itemsKey)) || [];
var totalSpent = items.reduce((sum, item) => sum + Number(item.price), 0);
// to not have 100 in my spent var totalSpent = Number(localStorage.getItem("totalSpent")) || 0;
var editingIndex = null;

const now = new Date();
let currentMonthIndex = now.getMonth();
let currentYear = now.getFullYear();

function getCurrentMonthKey() {
  return `${currentYear}-${currentMonthIndex}`;
}

var incomeInput = document.getElementById("income-input");
incomeInput.value = localStorage.getItem(incomeKey) || 0;

addBtn.addEventListener("click", () =>{
    modal.classList.add("open");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");

    document.getElementById("price").value = "";
    document.getElementById("name").value = "";
    document.querySelectorAll('input[name="category"]').forEach(r => r.checked = false);

    // Reset editing state (optional, but recommended)
    editingIndex = null;
});
    
const listArea = document.querySelector(".list-area");

function renderItems() {
  const selectedCategory = document.getElementById("category-select").value;

    listArea.innerHTML = '';     
items
  .filter(item => item.month === getCurrentMonthKey())
  .filter(item => selectedCategory === "All" || item.category === selectedCategory)
  .forEach(function(itemData) {
    const item = document.createElement("div");
    item.classList.add("list-item");
    
    const itemLeft = document.createElement("div");
    itemLeft.classList.add("item-left");

    const category = document.createElement("div");
    category.classList.add("category-pill");
    category.innerText = itemData.category;

    const name = document.createElement("div");
    name.innerText = itemData.name;

    itemLeft.appendChild(category);
    itemLeft.appendChild(name);

    const price = document.createElement("div");
    price.classList.add("price-badge");
    price.innerText = itemData.price;

    const actions = document.createElement("div");
    actions.classList.add("item-actions");

    const editBtn = document.createElement("button");
    editBtn.innerText = "✏️";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "x";
    deleteBtn.classList.add("delete-btn");

    editBtn.addEventListener("click", () => {

        editingIndex = items.indexOf(itemData);
        document.getElementById("price").value = itemData.price;
        document.getElementById("name").value = itemData.name;
        document.getElementById(itemData.category).checked = true;
        // No more old things, and opening stuff up again
    //     listArea.removeChild(item);
    //     items = items.filter(function(i) {
    //     return !(i.name === itemData.name && i.price === itemData.price && i.category === itemData.category);
    // });
    // totalSpent = totalSpent - Number(itemData.price);
    //     localStorage.setItem("items", JSON.stringify(items));
        modal.classList.add("open");
    //     updateStats();
});

deleteBtn.addEventListener("click", () => {
        totalSpent = totalSpent - Number(itemData.price);
        listArea.removeChild(item);
        items = items.filter(function(i) {
        return !(i.name === itemData.name && i.price === itemData.price && i.category === itemData.category);
    });
    localStorage.setItem(itemsKey, JSON.stringify(items));
    updateStats();
    renderItems();
});

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(itemLeft);
    item.appendChild(price);
    item.appendChild(actions);

    listArea.appendChild(item);
});
}

document.getElementById("category-select").addEventListener("change", () => {
  renderItems();
});

function updateStats() {
    var income = Number(incomeInput.value) || 0;
    var monthKey = getCurrentMonthKey();

    totalSpent = items
    .filter(item => item.month === monthKey)
    .reduce((sum, item) => sum + Number(item.price), 0);

    document.getElementById("spent-item").innerText = `Spent: ${totalSpent}`;
    document.getElementById("left-item").innerText = `Left: ${income - totalSpent}`;
    
    localStorage.setItem(`${incomeKey}_${monthKey}`, income);
}

const saveBtn = document.getElementById("save-button");

saveBtn.addEventListener("click", () => {
    // Get the values from inputs
    const price = document.getElementById("price").value;
    const name = document.getElementById("name").value;
    const category = document.querySelector('input[name="category"]:checked');
    
    if (!price || !category) {
        alert("Please write the price and select a category.");
        return;
    } 

    const monthKey = getCurrentMonthKey();

   const itemData = { 
     price: price,
     name: name,
     category: category.value,
     month: monthKey
   };

    if (editingIndex !== null) {
        const oldPrice = Number(items[editingIndex].price);
        items[editingIndex] = itemData;
        totalSpent = totalSpent - oldPrice + Number(price);
        editingIndex = null;
    } else {
        items.push(itemData);
        totalSpent = totalSpent + Number(price);
    }
    
    localStorage.setItem(itemsKey, JSON.stringify(items));
    localStorage.setItem(spentKey, totalSpent);

    renderItems();
    updateStats();

    modal.classList.remove("open");

    document.getElementById("price").value = "";
    document.getElementById("name").value = "";
    document.querySelectorAll('input[name="category"]').forEach(r => r.checked = false);
});
incomeInput.addEventListener("input", updateStats);

renderItems();
updateStats();

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];//so i can go throuh the array and change between months

function updateMonthDisplay() {
  document.getElementById("currentMonthLabel").textContent = ` ${monthNames[currentMonthIndex]} Expenses `;
  const monthKey = getCurrentMonthKey();
  const savedIncome = localStorage.getItem(`${incomeKey}_${monthKey}`);
  incomeInput.value = savedIncome || 0;
  renderItems();  // Update the list for the new month
  updateStats();
}

// Event listeners for month navigation buttons
document.getElementById("prevMonthBtn").addEventListener("click", () => {
  currentMonthIndex = (currentMonthIndex - 1 + 12) % 12;  // // so i dont go in minus when going back like since january is 0 if i went -1 it would be -1 but like this it will be 11 which is december.
  if (currentMonthIndex === 11) {
    currentYear--;  // Move to the previous year if we reach December (11)
  }
  updateMonthDisplay();
});

document.getElementById("nextMonthBtn").addEventListener("click", () => {
  currentMonthIndex = (currentMonthIndex + 1) % 12; 
  if (currentMonthIndex === 0) {
    currentYear++;  // Move to the next year if we reach January (0)
  }
  updateMonthDisplay();
});

updateMonthDisplay(); 


