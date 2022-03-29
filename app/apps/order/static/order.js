window.onload = function () {
    loadActiveOrder()
}

async function loadActiveOrder() {
    const fetchActiveOrder = await fetch('/api/v1/orders/get_active_order');
    const response = await fetchActiveOrder.json();
    printProductsOrder(response);
}

function printProductsOrder(data) {
    html = ``;
    let total_items = 0;
    let product_list = document.getElementById('product-list-order');
    product_list.innerHTML = '';
    let dollarUS = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "usd"
    })

    html += `<div class="col-12">`;

    for (let i=0; i < data.items.length; i++) {
        total_items += data.items[i].price;
        html += `
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-4">
                            <img class="custom-img" src="${data.items[i].image_path ? data.items[i].image_path:'http://localhost:9001/media/default_product.png'}">
                        </div>
                        <div class="col-4">
                            <div class="align-top">
                                Monitor
                            </div>
                            <div class="align-bottom">
                                ${dollarUS.format(data.items[i].price)}
                            </div>
                        </div>
                        <div class="col-md-4">
                            ${data.items[i].amount}
                            <a class="btn" onclick="removeProduct(${data.items[i].id})"><i class="fa fa-trash"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    html += `</div>`;

    html += `
        <div class="col-12 mt-3">
            <div class="row">
                <div class="col-12">
                    Total: ${dollarUS.format(total_items)}
                </div>
                <div class="col-12">
                    pagar
                </div>
            </div>
        </div>
    `;

    product_list.innerHTML += html;
}

async function removeProduct(product) {
    let csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let data = {
        'id': product,
    }

    const fetchRemoveProduct = await fetch('/api/v1/orders/remove_product/', {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token
        },
        method: 'POST',
        body: JSON.stringify(data)
    });

    const response = await fetchRemoveProduct.json();
    printProductsOrder(response);
    getItemsActiveOrder();
}
