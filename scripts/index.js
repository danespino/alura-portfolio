const getProjectsWidgetInfo = async () => {
    let projects = JSON.parse(localStorage.getItem('projects'));

    if (projects === null || projects === undefined) {
        try {
            const response = await fetch('./scripts/projects.json');
            if (!response.ok) {
                throw new Error('Error with Network Response');
            }
            const data = await response.json();
            projects = data;
            localStorage.setItem('projects', JSON.stringify(projects));
        } catch (error) {
            console.error(error);
            return null; // Handle or propagate the error as needed
        }
    }
    
    return projects;
}

const processProjectsWidgetInfo = async (filterBy = null, dataFilter = null) => {
    const projects = await getProjectsWidgetInfo();

    const projectFolio = document.getElementById('projectsGal');
    const yearSelector = document.getElementById('yearSelector');
    const stackSelector = document.getElementById('stackSelector');

    let yearSelOptions = [];
    let stackSelOptions = [];

    projectFolio.innerHTML = '';

    if(projects!==null){
        projects.forEach(project => {
            // Populate years that I have developed a project and append it to select
            if(!yearSelOptions.includes(project.year_start)) {
                yearSelOptions.push(project.year_start);
                // Let's draw the new option in the select
                let selectOption = document.createElement('option');
                selectOption.value = project.year_start;
                selectOption.text = project.year_start;
                yearSelector.appendChild(selectOption);
            }

            let selectOption = document.createElement('option');
            if(project.techstack!==undefined && Array.isArray(project.techstack)) {
                project.techstack.forEach(stack => {
                    if(!stackSelOptions.includes(stack)) {
                        console.log(stack);
                        stackSelOptions.push(stack);
                        selectOption.value = stack;
                        selectOption.text = stack;
                        stackSelector.appendChild(selectOption);
                    }
                });
            } else if(project.techstack!==undefined && typeof project.techstack === 'string'){
                if(!stackSelOptions.includes(project.techstack)) {
                    stackSelOptions.push(project.techstack);
                    selectOption.value = stack;
                    selectOption.text = stack;
                    stackSelector.appendChild(selectOption);
                }
            } else {
                return;     // if element is malformed it won't be processed
            }
            
            // Check if filter is applied and if dataFilter has been provided, then we must check if there is a coincidence, otherwise skip to draw element
            if((filterBy!==null && dataFilter!==null) ) {
                switch(filterBy) {
                    case 'year':
                        if(project.year_start!==dataFilter) return;
                    break;
                    case 'stack':
                        if(!project.techstack.includes(dataFilter)) return;
                    break;
                }
            }
            let projectElement = document.createElement('div');
            projectElement.classList.value = 'snap-center snap-always flex flex-shrink-0 items-stretch justify-center relative hover:scale-100 hover:text-2xl';
            projectElement.innerHTML = `
                <a href="${project.website}" target="_blank" class="h-full w-full">
                    <img src="${project.screenshot}" class="justify-center w-full h-auto scale-100 relative z-0" />
                    <div class="w-32 h-16 font-bold text-center text-white absolute top-0 -right-2 z-10">
                        <div class="triangleIndicator hidden hover:inline-block"> <span>${project.year_start}</span></div>
                        
                    </div>
                    <p class="w-full font-bold text-white self-center justify-center absolute inset-x-1/3 inset-y-1/2 z-10">${project.name}</p>
                </a>`;	
            projectFolio.appendChild(projectElement);

            
        });
        
    } else {
        return;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    processProjectsWidgetInfo();
});

document.getElementById('projectsGal').addEventListener('change', () => {
    const yearSelect = document.getElementById('yearSelector');
    
    const selectedYear = yearSelect.value;
});