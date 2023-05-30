const setupButtons = () => {
    const modal = document.querySelector(".modal");

    const btns = document.querySelectorAll(".replace-btn");

    const span = document.querySelector(".close");

    const formModal = document.querySelector(".vervang-pokemon-model");
    const urlParams = new URLSearchParams(window.location.search);
    const urlParam1 = urlParams.get("pokemon1");
    const urlParam2 = urlParams.get("pokemon2");

    if(urlParam1 !== null){
        const param1Form = document.createElement("input");
        param1Form.type = "hidden";
        param1Form.value = urlParam1;
        param1Form.name = "urlParam1";
        formModal.appendChild(param1Form);
    }
    if(urlParam2 !== null){
        const param2Form = document.createElement("input");
        param2Form.type = "hidden";
        param2Form.value = urlParam2;
        param2Form.name = "urlParam2";
        formModal.appendChild(param2Form);

    }

    for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = () => {
            modal.style.display = "block";
            const existingInput = formModal.querySelector(".index");
            if (existingInput) {
                existingInput.remove();
            }
            const input = document.createElement("input");
            input.type = "hidden";
            input.value = i;
            input.name = "index";
            input.classList.add("index");
            formModal.appendChild(input);
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
    
    const options = {
        legend: {
            display: true,
            labels: {
                fontColor: '#000',
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