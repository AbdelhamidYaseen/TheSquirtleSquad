const filterMenuToggle = () => {
    const filterMenu = document.getElementById('filter-menu');
    const filterButton = document.getElementById('filter-btn');

    filterButton.addEventListener('click', () => {
        filterMenu.style.display = 'block';
    });

    document.addEventListener('click', (event) => {
        const isClickInsideFilterMenu = filterMenu.contains(event.target);
        const isClickOnFilterButton = filterButton.contains(event.target);

        if (!isClickInsideFilterMenu && !isClickOnFilterButton) {
            filterMenu.style.display = 'none';
        }
    });
}

const filterTypeMenuToggle = () => {
    const filterMenu = document.getElementById('type-filter-menu');
    const filterButton = document.getElementById('type-selector-btn');

    filterButton.addEventListener('click', () => {
        filterMenu.style.display = 'block';
    });

    document.addEventListener('click', (event) => {
        const isClickInsideFilterMenu = filterMenu.contains(event.target);
        const isClickOnFilterButton = filterButton.contains(event.target);

        if (!isClickInsideFilterMenu && !isClickOnFilterButton) {
            filterMenu.style.display = 'none';
        }
    });
}