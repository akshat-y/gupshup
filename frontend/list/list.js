document.addEventListener('DOMContentLoaded', async () => {
    new DataTable('#example', {
        layout: {
            topStart: null,
            topEnd: 'search',
            bottomStart: 'info',
            bottomEnd: 'paging'
        }
    });  
})

document.getElementById('new_project_btn').addEventListener('click', (event) => {

    const new_project_btn = document.getElementById('new_project_btn')
    new_project_btn.classList.add("loading")
    new_project_btn.disabled = true

    const project_name_field = document.getElementById('project_name_input')
    const jira_id_field = document.getElementById('jira_id_input')

    project_name_field.disabled = true
    jira_id_field.disabled = true

    const project_name = project_name_field.value
    const jira_id = jira_id_field.value

    if (!validateNewProjectForm(project_name, jira_id)) {
        new_project_btn.classList.remove("loading")
        new_project_btn.disabled = false
        project_name_field.disabled = false
        jira_id_field.disabled = false        
        return
    }

    createProject(project_name, jira_id)
})

function validateNewProjectForm(project_name, jira_id) {

    let error_message = ''
    if (!project_name)
        error_message = 'Project Name Required'
    else if (!jira_id)
        error_message = 'Jira Ticket ID Required'

    const error_field = document.getElementById('new_project_error_info')
    error_field.textContent = error_message
    if (error_message)
        return false

    return true
}

function createProject(project_name, jira_id) {

    console.log(project_name, jira_id, '============')

    fetch('http://127.0.0.1:8000/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            'name': project_name,
            'jira_ticket_id': jira_id
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Project created", data);
        new_project_btn.classList.remove("loading")
        new_project_btn.disabled = false

        const project_name_input = document.getElementById('project_name_input')
        const jira_id_input = document.getElementById('jira_id_input')
        project_name_input.disabled = false        
        jira_id_input.disabled = false        

        if(data.duplicate_project){
            const error_field = document.getElementById('new_project_error_info')
            error_field.textContent = `Project ${project_name} already exists`
        }
        else{                        
            project_name_input.value = ""
            jira_id_input.value = ""
            $('#newProjectModal').modal('hide');
        }
    })
    .catch(error => {
        console.log("Project Creation Failed ", error);        
    })
}