/*
    This is an example file for the update notes. It is used to demonstrate the structure of the update notes data.

    
    Update notes are used to inform users about the changes in the application with each version update and
    will be displayed in the application in a popup when a new version is activated. You can disable this feature
    by setting the `showNewUpdateNotes` property to false in the `config.js` file.
*/

export const updateNotes = [
    {
        "version": "1.0.1",
        "title": "Better Sorting & Filtering",
        "notes": [
            "Sorting a column now keeps your current search and filters.",
            "Numbers and dates (e.g. Weight, Cost, Last Updated) now sort correctly, and empty values always appear at the end.",
            "Clicking a manufacturer, class or tag now filters by exactly that value (e.g. manufacturer:EINSCHLAG, class:Plane) and can be combined with other filters and search words.",
            "The sorted column is now marked with ▲ or ▼.",
            "Manufacturers can now be added, renamed, removed and colored with the new \"Manage Manufacturers\" button.",
        ]
    },
    {
        "version": "1.0.0",
        "title": "First Release",
        "notes": [
            "Ported the Creations Manager to the Birdhouse Framework.",
        ]
    }
];  