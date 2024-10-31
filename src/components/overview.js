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
            handler: (event) => {
                const manufacturer = event.target.dataset.manufacturer;
                document.getElementById('searchInput').value = `${manufacturer}`;
                filterTable();
            }

        },
        {
            selector: '.tag, .class',
            handler: (event) => {
                const searchTerm = event.target.textContent.toLowerCase();
                document.getElementById('searchInput').value = searchTerm;
                filterTable();
            }
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
                                <!-- Headers will be dynamically added by JavaScript -->
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Vehicle data will be dynamically added here -->
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

    // Use vehicleTemplate to control the order of the columns
    Object.keys(vehicleTemplate).forEach(key => {
        const th = document.createElement('th');
        if (key === 'Workshop Link') {
            th.textContent = 'Steam Workshop';
        } else {
            th.textContent = key;
        }
        th.addEventListener('click', () => sortTable(key));
        thead.appendChild(th);
    });

    data.Vehicles.forEach((vehicle, index) => {
        const row = document.createElement('tr');

        Object.keys(vehicleTemplate).forEach(key => {
            const value = vehicle[key];
            const td = document.createElement('td');

            switch (key) {
                case 'Manufacturer':
                    const manufacturerValue = (value || '').toString();
                    td.innerHTML = `<p class="manufacturer manufacturer-${sanitizeClassName(manufacturerValue)}" data-manufacturer="${sanitizeClassName(manufacturerValue)}">` + manufacturerValue + '</p>' || '-';
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
                    // Normalize the value to handle boolean values represented as strings
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

let sortDirections = {};

function sortTable(key) {
    if (!sortDirections[key]) {
        sortDirections[key] = 'asc';
    } else {
        sortDirections[key] = sortDirections[key] === 'asc' ? 'desc' : 'asc';
    }

    const direction = sortDirections[key];

    data.Vehicles.sort((a, b) => {
        const valueA = a[key] === null ? '' : a[key].toString().toLowerCase();
        const valueB = b[key] === null ? '' : b[key].toString().toLowerCase();

        if (direction === 'asc') {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    });

    renderTable();
}

function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#vehiclesTable tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
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
        formGroup.appendChild(input);
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
    const maxSize = 5 * 1024 * 1024; // 5MB
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