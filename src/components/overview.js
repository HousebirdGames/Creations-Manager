import { getQueryParameterByName, updateOrAddQueryParameter, updateTitleAndMeta, alertPopup, action, debounce, popupManager } from "../../Birdhouse/src/main.js";

let data = {
    Manufacturers: [],
    Vehicles: []
};

const vehicleTemplate = {
    "Manufacturer": "",
    "Name": "",
    "Code": "",
    "Workshop Link": "",
    "Class": "",
    "Usage": [],
    "Location": [],
    "Status": "",
    "Current Version": "",
    "Weight": null,
    "Cost": null,
    "Crew Capacity": null,
    "Passenger Capacity": null,
    "Old Names": null,
    "Video": null,
    "Trailer Support": null,
    "Base Support": false,
    "Comment": null,
    "Last Updated": "",
};

export default async function Example(exampleData) {
    updateTitleAndMeta('Overview');

    action(() => {
        loadDataFromLocalStorage();
        applyDarkModeFromLocalStorage();
        applyExpandRowsFromLocalStorage();
    })

    const actions = [
        {
            type: 'input',
            handler: filterTable,
            selector: '#searchInput',
            debounce: 100
        },
        {
            handler: clearSearch,
            selector: '#clearSearchBtn',

        },
        {
            handler: exportData,
            selector: '#exportBtn',

        },
        {
            handler: () => document.getElementById('fileInput').click(),
            selector: '#importBtn',

        },
        {
            type: 'change',
            handler: importData,
            selector: '#fileInput',

        },
        {
            handler: () => showEditModal(),
            selector: '#addVehicleBtn',

        },
        {
            handler: saveVehicle,
            selector: '#saveVehicle'

        },
        {
            handler: deleteVehicle,
            selector: '#deleteVehicle'

        },
        {
            handler: hideEditModal,
            selector: '#cancelEdit'

        },
        {
            handler: clearData,
            selector: '#clearDataBtn'

        },
        {
            handler: reloadDefaultData,
            selector: '#reloadDataBtn'

        },
        {
            handler: saveDataToLocalStorage,
            selector: '#saveDataBtn'

        },
        {
            handler: expandRowsToggle,
            selector: '#toggleExpandRowsButton'

        },
        {
            selector: '.cell',
            handler: (event) => {
                const index = parseInt(event.target.dataset.index);
                showEditModal(index);
            },
        },
        {
            selector: '.manufacturer',
            handler: (event) => addSearchFilter('manufacturer', event.target.dataset.manufacturer)
        },
        {
            selector: '.class',
            handler: (event) => addSearchFilter('class', event.target.textContent)
        },
        {
            selector: '.tag',
            handler: (event) => addSearchFilter('tag', event.target.textContent)
        }
    ];

    actions.forEach(a => {
        action(a)
    });

    return `
<div id="saveNotification" 
         class="save-notification" 
         role="alert" 
         aria-live="polite">
        Saved (Remember to export)
    </div>	
			<div class="action-buttons" role="toolbar" aria-label="Data management controls">
				<button id="addVehicleBtn" 
						aria-label="Add new vehicle">
					Add Vehicle
				</button>
				<button id="saveDataBtn" 
						aria-label="Save all data">
					Save Data
				</button>
				<button id="exportBtn" 
						aria-label="Export data as JSON">
					Export JSON
				</button>
				<button id="importBtn" 
						aria-label="Import JSON data">
					Import JSON
				</button>
				<input type="file" 
					   id="fileInput" 
					   accept=".json" 
					   class="hidden" 
					   aria-label="Choose JSON file to import">
				<button id="clearDataBtn" 
						aria-label="Clear all data">
					Clear Data
				</button>
				<button id="reloadDataBtn" 
						aria-label="Load Reysn's data">
					Load Reysn's Data
				</button>
				<button id="toggleExpandRowsButton" 
						aria-label="Toggle expanded rows view"
						aria-pressed="false">
					Toggle Expanded Rows
				</button>
			</div>

                        <div class="search-container">
				<label for="searchInput" class="visually-hidden">Search creations</label>
				<input type="text" 
					   id="searchInput" 
					   placeholder="Search..." 
					   aria-label="Search creations"
					   role="searchbox">
				<button id="clearSearchBtn" 
						aria-label="Clear search">
					<span aria-hidden="true">X</span>
				</button>
			</div>

    <main id="main-content" role="main">
            <section id="manufacturersList" aria-labelledby="manufacturers-heading">
                <h2 id="manufacturers-heading">Manufacturers</h2>
                <div class="manufacturers-container" 
                     role="list" 
                     aria-label="List of manufacturers"></div>
            </section>

            <section id="vehiclesList" aria-labelledby="vehicles-heading">
                <h2 id="vehicles-heading">Creations</h2>
                <div class="table-container">
                    <table id="vehiclesTable" 
                           role="grid" 
                           aria-label="creations list"
                           class="expanded">
                        <thead>
                            <tr role="row">
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
    `;
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterTable();
}

function applyDarkModeFromLocalStorage() {
    const darkModeSetting = localStorage.getItem('darkMode');
    const isDarkMode = darkModeSetting === null || darkModeSetting === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

function applyExpandRowsFromLocalStorage() {
    const isExpanded = localStorage.getItem('expandRows') === 'true';
    if (isExpanded) {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => table.classList.add('expanded'));
    }
}

function expandRowsToggle() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => table.classList.toggle('expanded'));

    const isExpanded = tables[0].classList.contains('expanded');
    localStorage.setItem('expandRows', isExpanded);
}

function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem('data');
    if (storedData) {
        data = JSON.parse(storedData);
        renderTable();
        renderManufacturers();
    } else {
        loadData();
    }
}

function saveDataToLocalStorage(saveNotification = true) {
    localStorage.setItem('data', JSON.stringify(data));

    if (saveNotification) {
        showSaveNotification();
    }
}

let saveAnimationPlaying = false;
function showSaveNotification() {
    if (saveAnimationPlaying) return;
    const notification = document.getElementById('saveNotification');
    notification.style.display = 'block';
    saveAnimationPlaying = true;
    setTimeout(() => {
        saveAnimationPlaying = false;
        notification.style.display = 'none';
    }, 4000);
}

function clearData() {
    if (confirm('Are you sure you want to clear all data?')) {
        data = {
            Manufacturers: [],
            Vehicles: []
        };
        renderTable();
        renderManufacturers();
        localStorage.removeItem('data');
    }
}

function reloadDefaultData() {
    if (confirm('Are you sure you want to reload the default data?')) {
        loadData();
    }
}

function loadData() {
    fetch('data/data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(json => {
            data = json;
            renderTable();
            renderManufacturers();
            saveDataToLocalStorage(false);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            console.log('Loading sample data as fallback...');
            loadSampleData();
            saveDataToLocalStorage();
        });
}

function loadSampleData() {
    data = {
        "Manufacturers": [
            {
                "Name": "EINSCHLAG"
            }
        ],
        "Vehicles": [
            {
                "Manufacturer": "EINSCHLAG",
                "Name": "Schnabeltier Base",
                "Code": "S1-B",
                "Class": "Car",
                "Usage": [
                    "BASE"
                ],
                "Location": [
                    "Land"
                ],
                "Status": "Complete",
                "Current Version": "V4",
                "Weight": null,
                "Cost": null,
                "Last Updated": "28.10.2024",
                "Crew Capacity": null,
                "Passenger Capacity": null,
                "Old Names": null,
                "Video": null,
                "Comment": null,
                "Trailer Support": null,
                "Base Support": false,
                "Workshop Link": ""
            },
            {
                "Manufacturer": "EINSCHLAG",
                "Name": "Schnabeltier Emergency Truck",
                "Code": "S1-ET",
                "Class": "Car",
                "Usage": [
                    "Rescue",
                    "Defense"
                ],
                "Location": [
                    "Land",
                    "Sea"
                ],
                "Status": "Complete",
                "Current Version": null,
                "Weight": null,
                "Cost": null,
                "Last Updated": "-",
                "Crew Capacity": null,
                "Passenger Capacity": null,
                "Old Names": null,
                "Video": null,
                "Comment": null,
                "Trailer Support": null,
                "Base Support": false,
                "Workshop Link": ""
            }
        ]
    };
    renderTable();
    renderManufacturers();
}

function sanitizeClassName(value) {
    return value.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
}

function sanitizeLink(link) {
    try {
        const url = new URL(link);
        return url.toString();
    } catch (e) {
        return '';
    }
}

function renderTable() {
    const table = document.getElementById('vehiclesTable');
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';

    applySort();

    Object.keys(vehicleTemplate).forEach(key => {
        const th = document.createElement('th');
        if (key === 'Workshop Link') {
            th.textContent = 'Steam Workshop';
        } else {
            th.textContent = key;
        }
        if (key === sortState.key) {
            const ascending = sortState.direction === 'asc';
            th.textContent += ascending ? ' ▲' : ' ▼';
            th.setAttribute('aria-sort', ascending ? 'ascending' : 'descending');
        }
        th.addEventListener('click', () => sortTable(key));
        thead.appendChild(th);
    });

    data.Vehicles.forEach((vehicle, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;

        Object.keys(vehicleTemplate).forEach(key => {
            const value = vehicle[key];
            const td = document.createElement('td');

            switch (key) {
                case 'Manufacturer':
                    const manufacturerValue = (value || '').toString();
                    const manufacturerElement = document.createElement('p');
                    manufacturerElement.classList.add('manufacturer', `manufacturer-${sanitizeClassName(manufacturerValue)}`);
                    manufacturerElement.dataset.manufacturer = manufacturerValue;
                    manufacturerElement.textContent = manufacturerValue;
                    td.appendChild(manufacturerElement);
                    break;

                case 'Status':
                case 'Video':
                    const statusValue = (value || '').toString();
                    td.textContent = statusValue || '-';
                    td.className = `status-${sanitizeClassName(statusValue)}`;
                    td.classList.add('status');
                    break;

                case 'Workshop Link':
                    const workshopValue = (value || '').toString();
                    td.innerHTML = workshopValue ? `<a href="${sanitizeLink(workshopValue)}" class="workshopLink">Link</a>` : '-';;
                    break;

                case 'Class':
                    const classValue = (value || '').toString();
                    td.textContent = classValue || '-';
                    td.className = `class-${sanitizeClassName(classValue)}`;
                    td.classList.add('class');
                    break;

                case 'Usage':
                    if (Array.isArray(value) && value.length > 0) {
                        td.innerHTML = value.map(usage => {
                            const usageClass = sanitizeClassName(usage);
                            return `<span class="tag usage-${usageClass}">${usage}</span>`;
                        }).join('');
                    } else {
                        td.textContent = '-';
                    }
                    break;

                case 'Location':
                    if (Array.isArray(value) && value.length > 0) {
                        td.innerHTML = value.map(loc => {
                            const locClass = sanitizeClassName(loc);
                            return `<span class="tag location-${locClass}">${loc}</span>`;
                        }).join('');
                    } else {
                        td.textContent = '-';
                    }
                    break;

                case 'Trailer Support':
                case 'Base Support':
                    const normalizedValue = (value === 'true' || value === true) ? true : (value === 'false' || value === false) ? false : value;

                    if (normalizedValue === true) {
                        td.textContent = 'Yes';
                    } else if (normalizedValue === false) {
                        td.textContent = 'No';
                    } else {
                        td.textContent = normalizedValue === null ? '-' : normalizedValue;
                    }
                    td.className = `support-${normalizedValue}`;
                    break;

                default:
                    td.textContent = value === null ? '-' :
                        Array.isArray(value) ? value.join(', ') : value.toString();
            }
            if (key != 'Class') {
                td.classList.add('cell');
            }
            td.dataset.index = index;
            row.appendChild(td);

            row.appendChild(td);
        });

        tbody.appendChild(row);
    });

    filterTable();
}

function sortTable(key, direction = null) {
    if (direction !== null) {
        sortState = { key, direction };
    } else if (sortState.key === key) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sortState = { key, direction: 'asc' };
    }

    renderTable();
}

function applySort() {
    const { key, direction } = sortState;
    const factor = direction === 'asc' ? 1 : -1;

    data.Vehicles.sort((a, b) => {
        const valueA = getSortValue(a, key);
        const valueB = getSortValue(b, key);

        if (valueA === '' || valueB === '') {
            return (valueA === '') - (valueB === '');
        }

        return factor * valueA.localeCompare(valueB, undefined, { numeric: true, sensitivity: 'base' });
    });
}

function getSortValue(vehicle, key) {
    const value = vehicle[key];
    if (value === null || value === undefined) return '';

    const text = Array.isArray(value) ? value.filter(Boolean).join(', ') : value.toString().trim();
    if (text === '-') return '';

    if (key === 'Last Updated') {
        const match = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
        if (match) {
            return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
        }
    }

    return text;
}

function renderManufacturers() {
    const container = document.querySelector('.manufacturers-container');
    container.innerHTML = '';

    if (data.Manufacturers.length === 0) {
        container.textContent = 'No manufacturers available.';
        return;
    }

    const list = document.createElement('ul');
    list.className = 'manufacturer-list';

    data.Manufacturers.forEach(manufacturer => {
        const listItem = document.createElement('li');
        listItem.dataset.manufacturer = manufacturer.Name;
        listItem.textContent = manufacturer.Name;
        listItem.classList.add('manufacturer', `manufacturer-${sanitizeClassName(manufacturer.Name)}`);
        list.appendChild(listItem);
    });

    container.appendChild(list);
}

let sortState = { key: 'Name', direction: 'asc' };

const filterFields = {
    manufacturer: ['Manufacturer'],
    class: ['Class'],
    tag: ['Usage', 'Location']
};

const searchTokenPattern = /(\w+):(?:"([^"]*)"?|(\S*))|"([^"]*)"?|(\S+)/g;

function parseSearch(query) {
    const filters = [];
    const terms = [];

    for (const [token, field, quotedValue, value, phrase, word] of query.matchAll(searchTokenPattern)) {
        const keys = field ? filterFields[field.toLowerCase()] : null;

        if (keys) {
            const fieldValue = (quotedValue ?? value).trim().toLowerCase();
            if (fieldValue) {
                filters.push({ keys, value: fieldValue });
            }
        } else {
            const term = (phrase ?? word ?? token).trim().toLowerCase();
            if (term) {
                terms.push(term);
            }
        }
    }

    return { filters, terms };
}

function filterTable() {
    const { filters, terms } = parseSearch(document.getElementById('searchInput').value);
    const rows = document.querySelectorAll('#vehiclesTable tbody tr');

    rows.forEach(row => {
        const vehicle = data.Vehicles[row.dataset.index];

        const matchesFilters = filters.every(({ keys, value }) =>
            keys.some(key => [].concat(vehicle[key] ?? []).some(v => v.toString().trim().toLowerCase() === value))
        );

        const text = Array.from(row.cells, cell => cell.textContent).join('\n').toLowerCase();
        const matchesTerms = terms.every(term => text.includes(term));

        row.style.display = matchesFilters && matchesTerms ? '' : 'none';
    });
}

function addSearchFilter(field, value) {
    value = (value || '').trim();
    if (!value || value === '-') return;

    const searchInput = document.getElementById('searchInput');
    const token = /[\s"]/.test(value) ? `${field}:"${value.replace(/"/g, '')}"` : `${field}:${value}`;
    let query = searchInput.value.trim();

    if (field === 'tag') {
        const alreadyActive = parseSearch(query).filters.some(f => f.keys === filterFields.tag && f.value === value.toLowerCase());
        if (alreadyActive) return;
    } else {
        const existingToken = new RegExp(`(^|\\s)${field}:("[^"]*"?|\\S+)`, 'gi');
        query = query.replace(existingToken, ' ').replace(/\s+/g, ' ').trim();
    }

    searchInput.value = query ? `${query} ${token}` : token;
    filterTable();
}

function showEditModal(index = null) {
    const form = document.getElementById('vehicleForm');
    form.innerHTML = '';

    const vehicle = index !== null ? data.Vehicles[index] : { ...vehicleTemplate };
    form.dataset.editIndex = index !== null ? index : -1;

    Object.keys(vehicleTemplate).forEach(key => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = key;

        let input;
        if (key === 'Manufacturer') {
            input = document.createElement('select');
            input.name = key;
            input.className = 'manufacturer-select';

            data.Manufacturers.forEach(manufacturer => {
                const option = document.createElement('option');
                option.value = manufacturer.Name;
                option.textContent = manufacturer.Name;
                if (vehicle[key] && manufacturer.Name.toLowerCase() === vehicle[key].toLowerCase()) {
                    option.selected = true;
                }
                input.appendChild(option);
            });

            const newOption = document.createElement('option');
            newOption.value = '__new__';
            newOption.textContent = 'Add New Manufacturer';
            input.appendChild(newOption);

            input.addEventListener('change', function () {
                if (this.value === '__new__') {
                    const newName = prompt('Enter new manufacturer name:');
                    if (newName) {
                        const sanitizedName = newName.trim();
                        if (sanitizedName) {
                            const exists = data.Manufacturers.some(
                                m => m.Name.toLowerCase() === sanitizedName.toLowerCase()
                            );
                            if (!exists) {
                                data.Manufacturers.push({ Name: sanitizedName });
                                renderManufacturers();

                                const option = document.createElement('option');
                                option.value = sanitizedName;
                                option.textContent = sanitizedName;
                                option.selected = true;
                                this.insertBefore(option, newOption);
                            } else {
                                alert('Manufacturer already exists.');
                                this.value = '';
                            }
                        }
                    } else {
                        this.value = '';
                    }
                }
            });
        } else {
            input = document.createElement('input');
            input.type = 'text';
            input.name = key;
            input.value = vehicle[key] || '';
        }

        formGroup.appendChild(label);
        
        if (key === 'Last Updated') {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'input-container';
            inputContainer.appendChild(input);
            
            const todayButton = document.createElement('button');
            todayButton.type = 'button';
            todayButton.textContent = 'Today';
            todayButton.className = 'today-button';
            todayButton.addEventListener('click', function() {
                const today = new Date();
                const day = today.getDate().toString().padStart(2, '0');
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const year = today.getFullYear();
                input.value = `${day}.${month}.${year}`;
            });
            
            inputContainer.appendChild(todayButton);
            formGroup.appendChild(inputContainer);
        } else {
            formGroup.appendChild(input);
        }
        
        form.appendChild(formGroup);
    });

    document.getElementById('modalTitle').textContent = index !== null ? 'Edit Vehicle' : 'Add Vehicle';
    popupManager.openPopup('vehicleFormPopup');
}

function hideEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveVehicle() {
    const form = document.getElementById('vehicleForm');
    const index = parseInt(form.dataset.editIndex);

    const vehicle = {};
    form.querySelectorAll('input, select').forEach(input => {
        if (input.name === 'Usage' || input.name === 'Location') {
            vehicle[input.name] = input.value.split(',').map(item => item.trim());
        }
        else if (input.name === 'Workshop Link') {
            vehicle['Workshop Link'] = sanitizeLink(input.value);
        } else {
            vehicle[input.name] = input.value || null;
        }
    });

    const manufacturerName = vehicle.Manufacturer ? vehicle.Manufacturer.trim() : null;

    if (manufacturerName) {
        const manufacturerExists = data.Manufacturers.some(
            manufacturer => manufacturer.Name.toLowerCase() === manufacturerName.toLowerCase()
        );

        if (!manufacturerExists) {
            data.Manufacturers.push({ Name: manufacturerName });
            renderManufacturers();
        }
    }

    if (index === -1) {
        data.Vehicles.push(vehicle);
    } else {
        data.Vehicles[index] = vehicle;
    }

    renderTable();
    saveDataToLocalStorage();
    hideEditModal();
}

function deleteVehicle() {
    const form = document.getElementById('vehicleForm');
    const index = parseInt(form.dataset.editIndex);

    if (confirm("Delete this vehicle?")) {
        data.Vehicles.splice(index, 1);
        console.log("Vehicle deleted");
        renderTable();
        saveDataToLocalStorage();
        hideEditModal();
    }
    else {
        console.log("Vehicle not deleted");
    }
}

function exportData() {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'creations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function validateFile(file) {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new Error('File too large');
    }
    if (file.type !== 'application/json') {
        throw new Error('Invalid file type');
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        validateFile(file);
    } catch (error) {
        alert('Error importing file: ' + error.message);
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            data = JSON.parse(e.target.result);
            renderTable();
            renderManufacturers();
            saveDataToLocalStorage();
        } catch (error) {
            alert('Error importing file: Invalid JSON format');
        }
    };
    reader.readAsText(file);
}