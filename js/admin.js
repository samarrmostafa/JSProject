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
                <td><img src="https://via.placeholder.com/40" alt="Product Image"></td>
                <td>${product.name}</td>
                <td>${getUserName(product.sellerId)}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td><span class="status ${product.approved ? 'approved' : 'pending'}">${product.approved ? 'Approved' : 'Pending'}</span></td>
                <td>
                    ${product.approved ? 
                        `<button class="edit-btn"><i class="fas fa-edit"></i></button>
                         <button class="delete-btn"><i class="fas fa-trash"></i></button>` :
                        `<button class="approve-btn"><i class="fas fa-check"></i></button>
                         <button class="reject-btn"><i class="fas fa-times"></i></button>
                         <button class="edit-btn"><i class="fas fa-edit"></i></button>`
                    }
                </td>
            </tr>
        `).join('');
    }
    
    function displayOrders(ordersToDisplay) {
        const orderTable = document.querySelector('#orders tbody');
        orderTable.innerHTML = ordersToDisplay.map(order => `
            <tr>
                <td>#ORD-${order.id}</td>
                <td>${getUserName(order.customerId)}</td>
                <td>${new Date().toLocaleDateString()}</td>
                <td>$${calculateOrderTotal(order)}</td>
                <td><span class="status paid">Paid</span></td>
                <td>
                    <select class="status-select">
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td>
                    <button class="view-btn"><i class="fas fa-eye"></i></button>
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                </td>
            </tr>
        `).join('');
    }
    
    function getUserName(userId) {
        const user = users.find(u => u.id == userId);
        return user ? user.name : 'Unknown';
    }
    
    function calculateOrderTotal(order) {
        return order.products.length * 100;
    }
    
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    const API_URL = `${baseUrl}/users`;
    const addUserBtn = document.getElementById("addUserBtn");
    const addUserModal = document.getElementById("addUserModal");
    const addUserForm = document.getElementById("addUserForm");

    addUserBtn.onclick = () => addUserModal.style.display = "flex";
    addUserModal.querySelector(".close-btn").onclick = () => addUserModal.style.display = "none";

    addUserForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const newUser = {
            name: document.getElementById("userName").value,
            email: document.getElementById("userEmail").value,
            role: document.getElementById("userRole").value,
            password: document.getElementById("userPassword").value
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
        
        const addedUser = await response.json();
        users.push(addedUser);
        displayUsers(users);
        
        addUserModal.style.display = "none";
        addUserForm.reset();
    };
});

document.querySelector('#users tbody').addEventListener('click', async (e) => {
    if (e.target.closest('.delete-btn')) {
        const row = e.target.closest('tr');
        const userId = row.querySelector('td:first-child').textContent;

        if (confirm('Are you sure ?')) {
            try {
                await fetch(`http://localhost:3000/users/${userId}`, {
                    method: 'DELETE'
                });

                row.remove();

                const userCountElement = document.querySelector('.card-icon.users + .card-info p');
                userCountElement.textContent = parseInt(userCountElement.textContent) - 1;

            } catch (error) {
                alert('are you sure to delete this user ?: ' + error.message);
            }
        }
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    const baseUrl = 'http://localhost:3000';
    let users = await (await fetch(`${baseUrl}/users`)).json();

    const usersTable = document.querySelector('#users tbody');
    if (!usersTable) {
        console.error('not exist!');
        return;
    }

    usersTable.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.edit-btn');
        if (editBtn) {
            const row = editBtn.closest('tr');
            const userId = row.cells[0].textContent;
            const user = users.find(u => u.id.toString() === userId.toString());
            
            if (!user) {
                console.error('the user is not exist ');
                return;
            }

            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            
            const modal = document.getElementById('addUserModal');
            if (!modal) {
                console.error('not exist');
                return;
            }
            
            modal.style.display = 'flex';
            modal.querySelector('h3').textContent = 'edit user';

            const form = document.getElementById('addUserForm');
            form.onsubmit = null;

            form.onsubmit = async (e) => {
                e.preventDefault();
                
                try {
                    const response = await fetch(`${baseUrl}/users/${userId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: document.getElementById('userName').value,
                            email: document.getElementById('userEmail').value,
                            role: document.getElementById('userRole').value
                        })
                    });

                    if (!response.ok) throw new Error('Failed !!');
                    
                    users = await (await fetch(`${baseUrl}/users`)).json();
                    displayUsers(users);
                    
                    modal.style.display = 'none';
                    alert('succussfully');
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed: ' + error.message);
                }
            };
        }
    });

    function displayUsers(usersArray) {
        usersTable.innerHTML = usersArray.map(user => `
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
});

//end User Management

//pagination
document.addEventListener('DOMContentLoaded', async function() {
    const baseUrl = 'http://localhost:3000';
    
    // إعدادات الترقيم العامة
    const paginationConfig = {
        users: {
            tableId: 'users',
            rowsPerPage: 5,
            currentPage: 1
        },
        products: {
            tableId: 'products',
            rowsPerPage: 5,
            currentPage: 1
        },
        orders: {
            tableId: 'orders',
            rowsPerPage: 5,
            currentPage: 1
        }
    };

    // جلب جميع البيانات
    const [users, products, orders] = await Promise.all([
        fetch(`${baseUrl}/users`).then(res => res.json()),
        fetch(`${baseUrl}/products`).then(res => res.json()),
        fetch(`${baseUrl}/orders`).then(res => res.json())
    ]);

    // دالة عرض موحدة للترقيم
    function setupPagination(dataType, data) {
        const config = paginationConfig[dataType];
        const table = document.querySelector(`#${config.tableId} tbody`);
        const prevBtn = document.querySelector(`#${dataType}-prev`);
        const nextBtn = document.querySelector(`#${dataType}-next`);
        const pageInfo = document.querySelector(`#${dataType}-pageInfo`);

        function displayData() {
            const start = (config.currentPage - 1) * config.rowsPerPage;
            const end = start + config.rowsPerPage;
            const paginatedData = data.slice(start, end);

            table.innerHTML = paginatedData.map(item => {
                if (dataType === 'users') {
                    return `
                        <tr>
                            <td>${item.id}</td>
                            <td>${item.name}</td>
                            <td>${item.email}</td>
                            <td><span class="role ${item.role}">${item.role}</span></td>
                            <td>
                                <button class="edit-btn"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                } else if (dataType === 'products') {
                    return `
                        <tr>
                            <td>${item.id}</td>
                            <td><img src="https://via.placeholder.com/40" alt="Product"></td>
                            <td>${item.name}</td>
                            <td>${item.price}</td>
                            <td>${item.category}</td>
                            <td><span class="status ${item.approved ? 'approved' : 'pending'}">${item.approved ? 'Approved' : 'Pending'}</span></td>
                            <td>
                                ${item.approved ? 
                                    '<button class="edit-btn"><i class="fas fa-edit"></i></button>' : 
                                    '<button class="approve-btn"><i class="fas fa-check"></i></button>'
                                }
                                <button class="delete-btn"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                }
                // يمكنك إضافة بناء الجدول للطلبات هنا
            }).join('');
        }

        function updatePagination() {
            const totalPages = Math.ceil(data.length / config.rowsPerPage);
            prevBtn.disabled = config.currentPage <= 1;
            nextBtn.disabled = config.currentPage >= totalPages;
            pageInfo.textContent = `Page ${config.currentPage} of ${totalPages}`;
        }

        prevBtn.onclick = () => {
            if (config.currentPage > 1) {
                config.currentPage--;
                displayData();
                updatePagination();
            }
        };

        nextBtn.onclick = () => {
            if (config.currentPage < Math.ceil(data.length / config.rowsPerPage)) {
                config.currentPage++;
                displayData();
                updatePagination();
            }
        };

        displayData();
        updatePagination();
    }

    // تهيئة الترقيم لجميع الجداول
    setupPagination('users', users);
    setupPagination('products', products);
    setupPagination('orders', orders);
});


