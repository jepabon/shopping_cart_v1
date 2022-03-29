async function getItemsActiveOrder() {
    const fetchActiveOrder = await fetch('/api/v1/orders/get_count_items_active_order');
    const response = await fetchActiveOrder.json();
    if (!response.status) {
        let count_items = document.getElementById('count_items');
        count_items.innerHTML = response;
        count_items.classList.remove('d-none');
    }
}

getItemsActiveOrder();
