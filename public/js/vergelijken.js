const setupButtons = () => {
    const modal = document.querySelector(".modal");

    const btns = document.querySelectorAll(".replace-btn");

    const span = document.querySelector(".close");

    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = () => {
            modal.style.display = "block";
        }
    }

    span.onclick = () => {
        modal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

const setupChart = () => {
    const ctx = document.getElementById('acquisitions').getContext('2d');
    const data = {
        labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
        datasets: [{
            label: 'Pokemon 1\'s name',
            data: [65, 59, 90, 81, 56, 55],
            backgroundColor: 'rgba(16, 11, 245, 0.2)',
            borderColor: 'rgba(16, 11, 245, 1)',
            borderWidth: 1
        }, {
            label: 'Pokemon 2\'s name',
            data: [40, 55, 56, 81, 90, 56],
            backgroundColor: 'rgba(245, 49, 49, 0.2)',
            borderColor: 'rgba(245, 49, 49, 1)',
            borderWidth: 1
        }]
    };
    const options = {
        legend: {
            display: false,
            labels: {
                fontColor: '#fff',
            }
        },
        scale: {
            ticks: {
                beginAtZero: true,
                max: 100,
                fontColor: '#000',
                showLabelBackdrop: false
            },
            gridLines: {
                color: 'rgba(000, 000, 000, .6)',
                lineWidth: 1
            },
            pointLabels: {
                fontColor: '#000',
                fontSize: 14
            }
        }
    };
    const myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options
    });
}

setupButtons();
setupChart();