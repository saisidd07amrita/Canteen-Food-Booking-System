document.getElementById("menuForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let canteen = document.getElementById("canteenSelect").value;
    let itemName = document.getElementById("itemName").value;
    let itemPrice = document.getElementById("itemPrice").value;

    let response = await fetch(`http://127.0.0.1:5000/menu/${canteen}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, price: parseInt(itemPrice) })
    });

    let result = await response.json();
    alert(result.message);
    fetchMenu();
});

async function fetchMenu() {
    let canteen = document.getElementById("canteenSelect").value;
    let response = await fetch(`http://127.0.0.1:5000/menu/${canteen}`);
    let menuItems = await response.json();

    let menuList = document.getElementById("menuList");
    menuList.innerHTML = "";

    menuItems.forEach(item => {
        let li = document.createElement("li");
        li.innerHTML = `${item.name} - ₹${item.price} 
            <button onclick="deleteItem('${canteen}', '${item.name}')">Delete</button>`;
        menuList.appendChild(li);
    });
}

async function deleteItem(canteen, name) {
    let response = await fetch(`http://127.0.0.1:5000/menu/${canteen}/${name}`, { method: "DELETE" });
    let result = await response.json();
    alert(result.message);
    fetchMenu();
}

fetchMenu();
