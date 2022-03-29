window.onload = function () {
    loadProducts();
}

async function loadProducts(url=null) {
    if (url === null) {
        url = '/api/v1/products/'
    }
    const fetchProducts = await fetch(url);
    const response = await fetchProducts.json();
    printProducts(response);
}

function printProducts(data) {
    html = ``;
    let product_list = document.getElementById('product-list');
    product_list.innerHTML = '';
    let dollarUS = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "usd"
    })

    html += `<div class="col-12">`

    for (let i=0; i < data.results.length; i++) {
        html += `
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-4">
                            <img class="custom-img" src="${data.results[i].image ? data.results[i].image:'http://localhost:9001/media/default_product.png'}">
                        </div>
                        <div class="col-4">
                            <div class="align-top">
                                Monitor
                            </div>
                            <div class="align-bottom">
                                ${dollarUS.format(data.results[i].price)}
                            </div>
                        </div>
                        <div class="col-md-4">
                            <input id="amount_${data.results[i].id}" class="col-md-3" type="number" value="1">
                            <a class="btn btn-primary" href="#" onclick="addProductCart(${data.results[i].id})">Agregar al carrito</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    html += `</div>`;

    if (data.previous || data.next) {
        html += `
            <div class="col-12 mt-3">
                <div class="row">
                    <div class="col-6 text-left">`;
        
        if (data.previous) {
            html += `
                <a class="btn btn-primary" href="#" onclick="loadProducts('${data.previous}')">Anterior</a>
            `;
        }
        html += `
            </div>
        <div class="col-6 text-right">`;
        if (data.next) {
            html += `
                <a class="btn btn-primary" href="#" onclick="loadProducts('${data.next}')">Siguiente</a>
            `;
        }
                    
                    
        html += `
                    </div>
                </div>
            </div>
        `;
    }

    product_list.innerHTML += html;
}

async function addProductCart(product) {
    let amount = parseFloat(document.getElementById('amount_'+product).value) || 1;
    let csrf_token = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let data = {
        'id_product': product,
        'amount': amount
    }
    const fetchAddProduct = await fetch('/api/v1/orders/add_product/', {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrf_token
        },
        method: 'POST',
        body: JSON.stringify(data)
    });
    const response = await fetchAddProduct.json();
    if (response.error === false) {
        alert(response.status);
    }
    getItemsActiveOrder();
}