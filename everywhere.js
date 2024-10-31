/*
This file is loaded on every page and can be used to add custom JavaScript code that should be executed everywhere, like routing, hooks, and more.


By default it comes with many examples and explanations to help you get started. You can remove them or comment them out to clean up the file.


Remember to keep this file up to date with the latest version of the example everywhere.js file as more hooks might become available or necessary in the future.
*/

// Required imports
import * as main from "./Birdhouse/src/main.js";
import { displayError, clearError } from "./Birdhouse/src/modules/input-validation.js";

// Your custom imports
import Example from './src/components/overview.js';

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

function applyDarkModeFromLocalStorage() {
    console.log('Applying dark mode from local storage');
    const darkModeSetting = localStorage.getItem('darkMode');
    const isDarkMode = darkModeSetting === null || darkModeSetting === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

/**
 * This hook will get triggered when the base content is about to be added.
 * 
 * 
 * This is usually the place to i.e. add the menu to the header element.
 * @params menuHTML
 * @shouldReturn Nothing
 */
window.hook('before-adding-base-content', async function (menuHTML) {
    /*     const headerElement = document.getElementById("header");
        if (!headerElement) {
            return;
        }
    
        headerElement.innerHTML = menuHTML; */
    main.action({
        selector: '.darkModeToggle',
        handler: toggleDarkMode
    });
    applyDarkModeFromLocalStorage();
});

/**
 * This hook will get triggered as soon as a route change is started.
 * @shouldReturn Nothing
 */
window.hook('on-handle-route-change', async function () {
});

/**
 * This hook will get triggered, when a component is successfully loaded.
 * @shouldReturn Nothing
 */
window.hook('on-component-loaded', async function () {
});

/**
 * This hook will get triggered, when the content is displayed (i.e. of a component).
 * @shouldReturn Nothing
 */
window.hook('on-content-loaded', async function () {
});

/**
 * This hook will get triggered, before the actions are invoked and set up.
 * You can use this hook to remove actions or add new ones globally.
 * @shouldReturn Nothing
 */
window.hook('before-actions-setup', async function () {
});

/**
 * This hook will get triggered, when the actions are invoked and set up.
 * @shouldReturn Nothing
 */
window.hook('on-actions-setup', async function () {
});

/**
 * Use this hook to set the HTML content of the popup menu.
 * @params menuHTML
 * @shouldReturn HTML as a string or nothing
 */
window.hook('get-popup-menu-html', async function (menuHTML) {
    return `
    <div id="menu" class="popup">
		<div class="menuList fade-left-menu">
            <br>
            ${menuHTML}
            <br>
			<button class="closePopup menu" title="Close Menu"><span class="material-icons md-light spaceRight">close</span>Close</button>
		</div>
	</div>
    `;
});

/**
 * This hook will get triggered, when the page is loaded.
 * @shouldReturn Nothing
 */
window.hook('page-loaded', async function () {
    await onPageLoaded();
});

async function onPageLoaded() {
    main.addBaseContent(`
    <!-- Modal for editing/adding vehicles -->
        <div id="editModal" 
             class="modal" 
             role="dialog" 
             aria-labelledby="modalTitle" 
             aria-modal="true" 
             hidden>
            <div class="modal-content">
                <button type="button" 
                        class="close" 
                        aria-label="Close modal">&times;</button>
                <h2 id="modalTitle">Edit Vehicle</h2>
                <form id="vehicleForm" 
                      aria-label="Vehicle edit form">
                    <!-- Form fields will be dynamically added here -->
                </form>
                <div class="modal-buttons" role="group" aria-label="Form actions">
                    <button type="button" 
                            id="saveVehicle" 
                            aria-label="Save vehicle">Save</button>
                    <button type="button" 
                            id="cancelEdit" 
                            aria-label="Cancel editing">Cancel</button>
                </div>
            </div>
        </div>
    </div>
    `);

    /* main.alertPopup('Welcome!', `
            This page is experimental and may not work as expected.<br>Please use at your own risk.<br>You can manage your creations with this web app. Add, edit, and delete vehicles, and export your data as JSON.
        `); */
}

/**
 * This hook will get triggered, when the user is logged in
 * @shouldReturn Nothing
 */
window.hook('user-logged-in', async function () {
});

/**
 * This hook will get triggered when the default base content is about to be added.
 * You can use this hook to overwrite the default base content by returning HTML as a string.
 * 
 * 
 * This will prevent the get-storage-acknowledgement-popup-content hook from being triggered.
 * @shouldReturn HTML as a string or nothing
 */
window.hook('overwrite-default-base-content', async function () {

});

/**
 * With this hook you can overwrite the default not authorized user page content.
 * 
 * 
 * This content will be loaded like a component instead of the actual component, if the user is not logged in as a user.
 * @shouldReturn HTML as a string or nothing
 */
window.hook('overwrite-not-authorized-user-page-content', async function () {
});

/**
 * With this hook you can overwrite the default not authorized admin page content.
 * 
 * 
 * This content will be loaded like a component instead of the actual component, if the user is not logged in as an admin.
 * @shouldReturn HTML as a string or nothing
 */
window.hook('overwrite-not-authorized-admin-page-content', async function () {
});

/**
 * With this hook you can overwrite the default 404 component content.
 * @shouldReturn HTML as a string or nothing
 */
window.hook('overwrite-404-content', async function () {
});

/**
 * With this hook you can overwrite the default component content that is shown when something goes wrong when loading a component.
 * @shouldReturn HTML as a string or nothing
 */
window.hook('overwrite-oups-content', async function () {
});

/**
 * With this hook you can overwrite the default component content that is shown when a component can't be retrieved (i.e. when offline and not cached).
 * @shouldReturn HTML as a string or nothing
 */
window.hook('overwrite-failed-to-load-content', async function () {
});

/**
 * This hook lets you add additional markdown patterns to the markdown parser.
 * 
 * 
 * Please refer to the example everywhere.js file for more information.
 * @params html
 * @shouldReturn HTML as a string or nothing
 */
window.hook('add-markdown-patterns', async function (html) {
    // Let's add some custom markdown patterns
    const examplePattern = /\[example_pattern\]/g;

    // We can replace the pattern with some HTML, even a with a whole component
    html = html.replace(examplePattern, await Example());

    return html;
});

/**
 * This hook is utilized to dynamically create and manage routing within the application. It allows for the definition
 * of routes based on user roles and other conditions, enabling a flexible navigation structure.
 * 
 * 
 * For more detailed information on how to create the routes, please look at the documentation for the following functions:
 * createPublicRoute, createUserRoute and createAdminRoute
 * @shouldReturn Nothing
 */
window.hook('create-routes', async function () {
    main.createPublicRoute('/', 'Overview', 'article', 'components/overview', false, 'front-page');
    main.createPublicRoute('/index.html', 'Overview', 'article', 'components/overview', false, 'front-page');
});

/**
 * This hook will be used to get a list of cookies that i.e. should be deleted when the user revoked the storage acknowledgement.
 * @shouldReturn Array of cookie names (strings)
 */
window.hook('get-cookies-list', async function () {
    // Let's add some default cookies to the list.

    let cookies = [
        'storageAcknowledgement',
        'lastUpdateNote',
        'PHPSESSID'
    ];

    return cookies;
});

/**
 * This hook is used to determine which paths are still allowed to visit during maintenance mode.
 * @shouldReturn Array of relative paths (strings)
 */
window.hook('get-allowed-paths-during-maintenance', async function () {
    // Let's add some paths that are allowed during maintenance.

    let allowedPathsDuringMaintenance = [
        'login',
        'login-password',
        'logout',
        'contact',
        'privacy-policy',
        'terms-of-service'
    ];

    return allowedPathsDuringMaintenance;
});

/**
 * This hook is used to determine which paths are excluded from the single page application route handling.
 * @shouldReturn Array of relative paths (strings) 
 */
window.hook('get-spa-excluded-links', async function () {
    // Let's add some routes that are excluded from the single page application route handling.

    let excludedRoutes = [
        'database/logout.php',
    ];

    return excludedRoutes;
});

/**
 * This hook is used to overwrite the content of the storage acknowledgement popup.
 * @shouldReturn HTML as a string or nothing
 */
window.hook('get-storage-acknowledgement-popup-content', async function () {
    // Let's add some content to the storage acknowledgement popup.

    const content = `
            <h1>Welcome!</h1>
            <p>This page is experimental and may not work as expected. Please use at your own risk.</p>
            <p>You can manage your creations with this web app. Add, edit, and delete vehicles, and export your data as JSON.</p>
			<p>By clicking "I Understand and Agree", you allow this site to store cookies on your device and use the browsers local storage. These following cookies and local storage entries are used to enable improve your experience:</p>
            <ul>
            <li>A cookie ensures that you won't see this message pop up on your subsequent visits or page reloads.</li>
            <li>Another cookie remembers which version of the website you last confirmed on the Update Notes, saving you from repeated update popups on every page load.</li>
            <li>Local browser storage will be utilized to save the provided data and settings.</li>
            </ul>
            <p>These cookies and the use of local storage entries are necessary for the smooth functioning of our site. If you choose to close this popup without clicking "I Understand and Agree", nothing will be stored. If you deny the permission, session storage will be used to hide this popup. Thank you for your understanding!</p>
        `;

    return content;
});

/**
 * This hook generates the menu HTML based on the menu items that are created with createPublicRoute, createUserRoute and createAdminRoute.
 * 
 * 
 * To learn more about menuItems are generated, view the getMenuItems function in main.js.
 * @params menuItems
 * @shouldReturn HTML as a string
 */
window.hook('generate-menu-html', async function (menuItems) {
    // Here you can modify how the menuHTML is generated from the menu items that are created with createPublicRoute, createUserRoute and createAdminRoute.

    return menuItems
        .map(item => {
            let classes = 'menuButton closePopup';
            let extraHTML = '';
            if (item.materialIcon != '') {
                let additionClass = item.hasName ? "spaceRight" : "";
                extraHTML = `<span class="material-icons ${additionClass}">${item.materialIcon}</span>`;
            }
            return `<a href="${item.path}" class="${classes} text-${item.displayFull}">${extraHTML}<span class="linkText">${item.name}</span></a>`;
        })
        .join('');
});

/**
 * This hook is used to let you implement custom logic for the user login system.
 * 
 * 
 * Here you should fetch the user data from your backend and return it as a JSON response.
 * Please refer to the example everywhere.js for more information.
 * @shouldReturn JSON response
 */
window.hook('fetch-user-data', async function () {
    // Let's return some default user data. Normally you would fetch this from a database.

    //You can try the different user examples by uncommenting them one by one.

    //Remember to set userLoginEnabled to true in config.js to enable the user login system.

    //Admin user
    /* const userData = {
        'loggedIn': true,
        'userId': '0',
        'username': 'Example Admin',
        'isAdmin': true,
        'isUser': true,
    }; */

    //Normal user
    /* const userData = {
        'loggedIn': true,
        'userId': '1',
        'username': 'Example User',
        'isAdmin': false,
        'isUser': true,
    }; */

    //Not logged in user
    const userData = {
        'loggedIn': false,
        'userId': '',
        'username': '',
        'isAdmin': false,
        'isUser': false,
    };

    return new Response(JSON.stringify(userData), {
        headers: { 'Content-Type': 'application/json' },
    });
});

/**
 * If your backend confirms that the user is remembered (i.e. Token accepted), return true.
 * Returning true here, will then reload the page.
 * @shouldReturn Boolean or nothing (returning nothing will equal false)
 */
window.hook('check-remember-me', async function () {
    // If your backend confirms that the user is remembered (i.e. Token accepted), return true.
    // Returning true here, will then reload the page.

    return false;
});

/**
 * This hook is used to let you fetch the current state of the maintenance mode.
 * @shouldReturn Boolean or nothing
 */
window.hook('get-maintenance-mode', async function () {
    // Here you would fetch the maintenance mode status from your backend.

    return false;
});

/**
 * Here you can add some dynamic routes based on the path.
 * For example, you could add a route for each user, based on the user's ID. Or maybe you want to create blog posts that are fetched from a database.
 * 
 * 
 * These routes are only created when the user visits the path. So you can add a lot of dynamic routes without slowing down the initial page load. This also means, that they can not be added to the menu automatically.
 * @params path 
 * @shouldReturn Boolean that should be true if you have added a dynamic route for the path
 */
window.hook('add-dynamic-routes', async function (path) {
    return false;
});

/**
 * This hook is used to fetch a setting from your backend.
 * 
 * 
 * Cache setting will be either 'default' or 'no-store' and can be used in the fetch request.
 * @params name, cacheSetting
 * @shouldReturn JSON response
 */
window.hook('database-get-setting', async function (name, cacheSetting) {
    // Here you would fetch a setting from your backend.
    // In this example, we just return a default setting as a json response.

    return new Response(JSON.stringify({ value: 'exampleSetting' }), {
        headers: { 'Content-Type': 'application/json' },
    });

    // Here is an example fetch request:

    /* const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: cacheSetting
    }); */
});

/**
 * This hook is used to set a setting from at your backend.
 * @params name, value
 * @shouldReturn JSON response
 */
window.hook('database-set-setting', async function (name, value) {
    // Here you would set a setting in your backend.
    // In this example, we just return a success message as a json response.

    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
    });
});

/**
 * This hook is used to send data to your analytics backend.
 * @params value
 * @shouldReturn Nothing
 */
window.hook('send-analytics', async function (value) {
    // Here you would send analytics data to your backend.
    // In this example, we just log the value to the console.

    //console.log('Analytics:', value);
});

/**
 * This hook is used to set a setting from at your backend.
 * 
 * 
 * The serverSide boolean can be used to determine if the validation should be done on the server side.
 * @params input, value, errorElement, serverSide
 * @shouldReturn Boolean where false means, that the input is not valid; true (or returning nothing) means, that the input is valid
 */
window.hook('validate-field', async function (input, value, errorElement, serverSide) {
    // This hook is triggered when a field is validated. You can use it to add custom validation rules.
    // If there are no errors, the error of the field will be cleared automatically if nothing or true is returned.

    if (input.name === 'exampleInput' && value.length != 8) {
        displayError(input, errorElement, 'Example input must be 8 characters long.');
        return false;
    }

    // You can also clear the error of another field (not the one that is currently being validated) by using the clearError(input, errorElement) function.

    if (serverSide) {
        // Here you can add server side validation. For example, you could check if a username already exists in your database.
        // The server side validation has a longer debounce to reduce the amount of requests to your server.

        /* const response = await checkUsernameExistence(value);
        if (response.exists) {
            displayError(input, errorElement, 'Username already exists.');
            return false;
        } */
    }

    //Please remember, that all input/textarea elements should have a label element surrounding them. This is needed for the automatic error message placement.
});

/**
 * This hook is used to set the content that is displayed while the current component is loading.
 * 
 * 
 * If you return false, the page content will not be cleared while the component is loading.
 * @shouldReturn HTML as a string or false
 */
window.hook('get-loading-content', async function () {
    //This will be in the content section until the current component is loaded. You can place skeleton loaders or a loading symbol here or just return an empty string.

    return `
    <p>The page is loading...</p>
    `;
});

/**
 * This hook is used to set the content that is displayed in the placeholder for a component that is loading using the asyncLoad function.
 * 
 * 
 * Important: This hook is not async, so you can't use await in this function. This is because the placeholder needs to be displayed immediately.
 * 
 * 
 * If you return false or nothing, "Loading..." will be displayed in the placeholder.
 * @params identifier
 * @shouldReturn HTML as a string or false
 */
window.hook('get-component-loading-content', function (identifier) {
    //This will be in the placeholder of the asynchronously loaded component until it is loaded. If you give the asyncLoad function an identifier, you can use it here to determine which component is loading and return different content for each component.
    //You can place skeleton loaders or a loading symbol here or just return an empty string.

    return `
    This component is loading...
    `;
});

/**
 * This hook is used to add custom logic that is triggered after a popup is opened through the openPopup function of the popupManager.
 * 
 * 
 * This hook receives the ID of the popup that was opened as a parameter that can be used to identify the popup.
 * @params popupID
 * @shouldReturn Nothing
 */
window.hook('opened-popup', async function (popupID) {
    //This hook is triggered when a popup is opened.
    console.log('Popup opened:', popupID);
});