
document.addEventListener('DOMContentLoaded', async function() {
    const baseUrl = 'http://localhost:3000';
    
    let users = await (await fetch(`${baseUrl}/users`)).json();
    let products = await (await fetch(`${baseUrl}/products`)).json();
    let orders = await (await fetch(`${baseUrl}/orders`)).json();

    document.querySelector('.card-icon.users + .card-info p').textContent = users.length;
    document.querySelector('.card-icon.products + .card-info p').textContent = products.length;
    document.querySelector('.card-icon.orders + .card-info p').textContent = orders.length;

    displayUsers(users);
    displayProducts(products);
    displayOrders(orders);

    const searchInput = document.querySelector('.search input');
    const searchButton = document.querySelector('.search button');
    
    async function performSearch(searchTerm) {
        searchTerm = searchTerm.toLowerCase().trim();
        
        if (!searchTerm) {
            displayUsers(users);
            displayProducts(products);
            displayOrders(orders);
            return;
        }
        
        const filteredUsers = users.filter(user => 
            user.name.toLowerCase().includes(searchTerm) || 
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm) ||
            user.id.toString().includes(searchTerm)
        );
        
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.id.toString().includes(searchTerm) ||
            product.price.toString().includes(searchTerm)
        );
        
        const filteredOrders = orders.filter(order => 
            order.id.toString().includes(searchTerm) ||
            order.status.toLowerCase().includes(searchTerm)
        );
        
        displayUsers(filteredUsers);
        displayProducts(filteredProducts);
        displayOrders(filteredOrders);
        
        if (filteredUsers.length === 0 && filteredProducts.length === 0 && filteredOrders.length === 0) {
            alert('no alerts ' + searchTerm);
            displayUsers(users);
            displayProducts(products);
            displayOrders(orders);
        }
    }
    
    function displayUsers(usersToDisplay) {
        const userTable = document.querySelector('#users tbody');
        userTable.innerHTML = usersToDisplay.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="role ${user.role}">${user.role}</span></td>
                <td>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }
    
    function displayProducts(productsToDisplay) {
        const productTable = document.querySelector('#products tbody');
        productTable.innerHTML = productsToDisplay.map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image || 'https://via.placeholder.com/40'}" alt="Product Image" width="40"></td>
                <td>${product.name}</td>
                <td>${product.sellerId ? getUserName(product.sellerId) : 'Unknown'}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td><span class="status ${product.status === 'approved' ? 'approved' : product.status === 'denied' ? 'denied' : 'pending'}">
                    ${product.status === 'approved' ? 'Approved' : product.status === 'denied' ? 'Denied' : 'Pending'}
                </span></td>
                <td>
                    ${product.status === 'pending' ? 
                        `<button class="approve-btn" data-id="${product.id}"><i class="fas fa-check"></i></button>
                         <button class="reject-btn" data-id="${product.id}"><i class="fas fa-times"></i></button>` :
                        `<button class="edit-btn" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                         <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i></button>`
                    }
                </td>
            </tr>
        `).join('');
    }
document.querySelector('#products tbody').addEventListener('click', async (e) => {
    const approveBtn = e.target.closest('.approve-btn');
    const rejectBtn = e.target.closest('.reject-btn');
    
    if (approveBtn) {
        const productId = approveBtn.dataset.id;
        await updateProductStatus(productId, 'approved');
    } else if (rejectBtn) {
        const productId = rejectBtn.dataset.id;
        await updateProductStatus(productId, 'denied');
    }
});

async function updateProductStatus(productId, newStatus) {
    try {
        const response = await fetch(`http://localhost:3000/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            const products = await (await fetch('http://localhost:3000/products')).json();
            displayProducts(products);
            
            document.querySelector('.card-icon.products + .card-info p').textContent = products.length;
        }
    } catch (error) {
        console.error('Error updating product status:', error);
        alert('Failed to update product status');
    }
}
document.querySelector('#productsTable tbody').addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    const editBtn = e.target.closest('.edit-btn');

    if (deleteBtn) {
        const productId = deleteBtn.dataset.id;


//-------------------------------------------------------------


