const apiUrl = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
let usersData = [];
let currentPage = 1;
const itemsPerPage = 10;
let selectedRows = [];

function getUsers() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      usersData = data;
      renderTable();
    })
    .catch(error => console.log(error));
}

function renderTable() {
  const tableBody = document.querySelector('#userTable tbody');
  tableBody.innerHTML = '';

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToDisplay = usersData.slice(startIndex, endIndex);

  usersToDisplay.forEach(user => {
    const row = document.createElement('tr');
    row.dataset.id = user.id;
    row.innerHTML = `
      <td><input type="checkbox" class="rowCheckbox"></td>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
    `;
    tableBody.appendChild(row);
  });

  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(usersData.length / itemsPerPage);
  const currentPageSpan = document.querySelector('#currentPage');
  currentPageSpan.textContent = `Page ${currentPage} of ${totalPages}`;

  const firstPageButton = document.querySelector('#firstPage');
  const prevPageButton = document.querySelector('#prevPage');
  const nextPageButton = document.querySelector('#nextPage');
  const lastPageButton = document.querySelector('#lastPage');

  firstPageButton.disabled = currentPage === 1;
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
  lastPageButton.disabled = currentPage === totalPages;
}

function filterTable() {
  const searchInput = document.querySelector('#searchInput');
  const searchTerm = searchInput.value.toLowerCase();

  const filteredUsers = usersData.filter(user => {
    return (
      user.id.toLowerCase().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
  });

  usersData = filteredUsers;
  currentPage = 1;
  renderTable();
}

function selectRow(row) {
  const rowId = row.dataset.id;

  if (selectedRows.includes(rowId)) {
    selectedRows = selectedRows.filter(id => id !== rowId);
    row.classList.remove('selected');
  } else {
    selectedRows.push(rowId);
    row.classList.add('selected');
  }
}

function selectAllRows() {
  const checkboxes = document.querySelectorAll('.rowCheckbox');
  selectedRows = [];

  checkboxes.forEach(checkbox => {
    checkbox.checked = true;
    const row = checkbox.parentNode.parentNode;
    row.classList.add('selected');
    selectedRows.push(row.dataset.id);
  });
}

function deselectAllRows() {
  const checkboxes = document.querySelectorAll('.rowCheckbox');
  selectedRows = [];

  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    const row = checkbox.parentNode.parentNode;
    row.classList.remove('selected');
  });
}

function deleteSelectedRows() {
  usersData = usersData.filter(user => !selectedRows.includes(user.id));
  deselectAllRows();
  renderTable();
}

// Event listeners
document.addEventListener('DOMContentLoaded', getUsers);

document.querySelector('#searchInput').addEventListener('input', filterTable);

document.querySelector('#firstPage').addEventListener('click', () => {
  currentPage = 1;
  renderTable();
});

document.querySelector('#prevPage').addEventListener('click', () => {
  currentPage--;
  renderTable();
});

document.querySelector('#nextPage').addEventListener('click', () => {
  currentPage++;
  renderTable();
});

document.querySelector('#lastPage').addEventListener('click', () => {
  const totalPages = Math.ceil(usersData.length / itemsPerPage);
  currentPage = totalPages;
  renderTable();
});

document.querySelector('#selectAll').addEventListener('click', selectAllRows);

document.querySelector('#deleteSelected').addEventListener('click', deleteSelectedRows);

document.querySelector('tbody').addEventListener('click', event => {
  const row = event.target.parentNode.parentNode;
  if (event.target.classList.contains('rowCheckbox')) {
    selectRow(row);
  }
});

