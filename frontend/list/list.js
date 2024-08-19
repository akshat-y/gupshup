(()=>{

    let projects
    let testCaseDatatable;

    async function authenticateUser(){
        try {
            const response = await fetch(`${window.api_link}/auth-check`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include',
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result, '000000');
                
                if (result.logged_in){
                    document.getElementById('user_name_label').textContent = result.username
                    document.getElementById('user_role_label').textContent = result.role
                    document.getElementById('user_avatar').textContent = result.username.substring(0, 2)
                }                    
                else
                    window.location.href = '/' 
            } 
            else
                window.location.href = '/' 
        } catch (error) {
            window.location.href = '/' 
        }
    }
    
    document.addEventListener('DOMContentLoaded', async () => {

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))    
        
        await authenticateUser()
        
        testCaseDatatable = new DataTable('#test_case_datatable', {
            processing: true,
            scrollX: true,
            serverSide: true,
            pageLength: 5,
            language: {
                searchPlaceholder: "Search..."
            },
            ajax: {
                url: `${window.api_link}/get_testcases`,
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                },         
                data: function(d) {
                    return JSON.stringify(d);
                },       
                dataSrc: function(json) {
                    return json.data;
                }
            },
            columns: [
                { "data": "id" },
                {"data": "username", "className": "nowrap"},
                {"data": "project_name", "className": "nowrap"},
                {"data": "test_case_name", "className": "nowrap"},
                {"data": "type", "className": "nowrap"},
                {"data": "input_data", "className": "nowrap"},
                {"data": "expected_result", "className": "nowrap"},
                {"data": "actual_result", "className": "nowrap"},
                {"data": "status"},
                {"data": "description"},
                {
                    "data": null,
                    "sortable": false,
                    "render": function(data, type, row) {
                        return `
                            <div class="d-flex gap-4 test_case_actions">
                                <svg data-id="${row.id}" data-name="${row.test_case_name}" data-project="${row.project_id}" data-description="${row.description}" data-input="${row.input_data}" data-expected="${row.expected_result}" data-actual="${row.actual_result}" data-type="${row.type}" data-status="${row.status}" class="edit_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    <path d="M13 4L20 11" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                    <path d="M14 22L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>     
                                <svg data-id="${row.id}" class="delete_btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                                    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M9 11.7349H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M10.5 15.6543H13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                    <path d="M3 5.5H21M16.0555 5.5L15.3729 4.09173C14.9194 3.15626 14.6926 2.68852 14.3015 2.39681C14.2148 2.3321 14.1229 2.27454 14.0268 2.2247C13.5937 2 13.0739 2 12.0343 2C10.9686 2 10.4358 2 9.99549 2.23412C9.89791 2.28601 9.80479 2.3459 9.7171 2.41317C9.32145 2.7167 9.10044 3.20155 8.65842 4.17126L8.05273 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                </svg>                       
                            </div>
                        `;
                    }
                },                
            ],
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: 'info',
                bottomEnd: 'paging'
            }
        });  

        getProjects()
        // getTestCases()

        $('#logout_button').on('click', function(){            
            fetch(`${window.api_link}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'                
            })
            .then(response => response.json())
            .then(data => {
                console.log("Logged Out", data);  
                window.location.href = '/'                      
            })
            .catch(error => {
                console.log("Logging out Failed ", error);                
                window.location.href = '/' 
            })
        })

        $('#test_case_datatable').on('click', '.delete_btn', function(){            
            const testCaseToDelete = $(this).data("id")
            deleteTestCase(testCaseToDelete)
        })

        $('#test_case_datatable').on('click', '.edit_btn', function(){            
            const testCaseToEdit = $(this).data("id")            
            $('#editTestCaseModal').modal('show')

            const edit_test_case_btn = document.getElementById('edit_test_case_btn')            

            const test_case = {
                id: $(this).data("id"),
                project_id: $(this).data("project"),
                description: $(this).data("description"),
                test_case_name: $(this).data("name"),
                type: $(this).data("type"),
                input_data: $(this).data("input"),
                expected_result: $(this).data("expected"),
                actual_result: $(this).data("actual"),
                status: $(this).data("status")
            }

            const test_case_project_select = document.getElementById("edit_test_project_select")
            const test_case_name_input = document.getElementById("edit_test_name_input")
            const test_case_description_input = document.getElementById("edit_test_description_input")
            const test_case_data_input = document.getElementById("edit_test_data_input")
            const test_case_expect_result_input = document.getElementById("edit_test_expected_result_input")
            const test_case_actual_result_input = document.getElementById("edit_test_actual_result_input")
            const test_case_type_select = document.getElementById("edit_test_type_select")
            const test_case_status_select = document.getElementById("edit_test_status_select")

            test_case_project_select.innerHTML = ''
            projects.forEach(project => {
                test_case_project_select.append(new Option(project.name, project.id))            
            });

            test_case_name_input.value = test_case.test_case_name
            test_case_description_input.value = test_case.description
            test_case_data_input.value = test_case.input_data
            test_case_expect_result_input.value = test_case.expected_result
            test_case_actual_result_input.value = test_case.actual_result
            test_case_type_select.value = test_case.type
            test_case_status_select.value = test_case.status
            test_case_project_select.value = test_case.project_id            

            $('#editTestCaseModal').unbind().on('click', '#edit_test_case_btn', function(event){

                edit_test_case_btn.classList.add("loading")

                event.preventDefault()
                const updated_test_case = {
                    id: testCaseToEdit,
                    project_id: test_case_project_select.value,
                    description: test_case_description_input.value,
                    test_case_name: test_case_name_input.value,
                    type: test_case_type_select.value,
                    input_data: test_case_data_input.value,
                    expected_result: test_case_expect_result_input.value,
                    actual_result: test_case_actual_result_input.value,
                    status: test_case_status_select.value
                }

                const error_field = document.getElementById('edit_test_case_error_info')     
                if(!validateTestCaseForm(updated_test_case, error_field)){
                    edit_test_case_btn.classList.remove("loading")
                    return
                }                            

                fetch(`${window.api_link}/testcases`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(updated_test_case)
                })
                .then(response => response.json())
                .then(data => {
                    console.log("Test Case updated", data);    
                    $('#editTestCaseModal').modal('hide')   
                    document.getElementById('edit_test_case_form').reset()    
                    edit_test_case_btn.classList.remove("loading")
                    testCaseDatatable.ajax.reload();
                })
                .catch(error => {
                    console.log("Test Case updation Failed ", error);                       
                    error_field.textContent = `Test Case updation failed` 
                    edit_test_case_btn.classList.remove("loading")    
                })

            })
        })        
        
        document.getElementById('customSearch').addEventListener('keyup', debounce(function() {
            var searchTerm = this.value.toLowerCase();
            testCaseDatatable.search(searchTerm).draw();
        }, 300));

    })
    
    async function getProjects(){
        const response = await fetch(`${window.api_link}/projects`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
        });
        projects = await response.json()
        const projectSelect = document.getElementById("test_case_project_select")
        projectSelect.innerHTML = ''

        projects.forEach(project => {
            projectSelect.append(new Option(project.name, project.id))            
        });
        
    }

    async function getTestCases(){
        const response = await fetch(`${window.api_link}/testcases`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
        });
        const test_cases = await response.json()        
    }

    document.getElementById('new_test_case_btn').addEventListener('click', (event) => {

        event.preventDefault()
        const new_test_case_btn = document.getElementById('new_test_case_btn')
        new_test_case_btn.classList.add("loading")

        const selected_project = document.getElementById("test_case_project_select").value
        const test_case_name = document.getElementById("test_case_name_input").value
        const test_case_description = document.getElementById("test_case_description_input").value
        const test_case_data = document.getElementById("test_case_data_input").value
        const test_case_expect_result = document.getElementById("test_case_expected_result_input").value
        const test_case_actual_result = document.getElementById("test_case_actual_result_input").value
        const test_case_type = document.getElementById("test_case_type_select").value
        const test_case_status = document.getElementById("test_case_status_select").value
        
        const test_case = {
            'project_id': Number(selected_project),
            'test_case_name': test_case_name,
            'description': test_case_description,
            'input_data': test_case_data,
            'expected_result': test_case_expect_result,
            'actual_result': test_case_actual_result,
            'type': test_case_type,
            'status': test_case_status
        }

        const error_field = document.getElementById('new_test_case_error_info')     
        if(!validateTestCaseForm(test_case, error_field)){
            new_test_case_btn.classList.remove("loading")
            return
        }
            
        createTestCase(test_case)
    })

    function validateTestCaseForm(test_case, error_field){        
        
        for(prop in test_case){
            if(!test_case[prop]){
                error_field.textContent = `${convertToTitleCase(prop)} is required` 
                return false
            }
        }
        return true
    }

    function createTestCase(test_case) {
    
        const new_test_case_btn = document.getElementById('new_test_case_btn')        

        fetch(`${window.api_link}/testcases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(test_case)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Test Case created", data);       
            document.getElementById('new_test_case_form').reset()    
            $('#newTestCaseModal').modal('hide'); 
            new_test_case_btn.classList.remove("loading")
            testCaseDatatable.ajax.reload();
        })
        .catch(error => {
            console.log("Test Case Creation Failed ", error);   
            const error_field = document.getElementById('new_test_case_error_info')
            error_field.textContent = `Test Case creation failed` 
            new_test_case_btn.classList.remove("loading")    
        })
    }
    
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
    
        const new_project_btn = document.getElementById('new_project_btn')
        fetch(`${window.api_link}/projects`, {
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

    function convertToTitleCase(text) {
        return text.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    function deleteTestCase(test_case_id){
        $('#deleteTestCaseModal').modal('show'); 
        $('#deleteTestCaseModal').unbind().on('click', '#delete_test_case', ()=>{
            console.log('Removing test case id -', test_case_id)
            $('#deleteTestCaseModal').modal('hide');
            fetch(`${window.api_link}/testcases/${test_case_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include'                
            })
            .then(response => response.json())
            .then(data => {
                console.log("Test case deleted", data);                
                testCaseDatatable.ajax.reload();
                $('#deleteTestCaseModal').modal('hide'); 
            })
            .catch(error => {
                console.log("Test case deletion Failed ", error);        
                $('#deleteTestCaseModal').modal('hide'); 
            })
        })
    }
    
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
})()