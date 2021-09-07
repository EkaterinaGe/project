$(() => {
    let todos = []; 
    let tabStatus = 'all';
    let pageId = 1;

    const ENTER = 'Enter';
    const TODOS_ON_PAGES = 5;
    const $documentPage = $(document);
    const $formControl = $('.form-control');
    const $statusTab = $('.status-tab');
    const $all = $('#all');
    const $todoList = $('.todo-list');
    const $pagination = $('.pagination');
    const $checkAll = $('#check-all');
    const $total = $('.total');
    const $done = $('.done');
    const $undone = $('.undone');

    const render = () => {
        let paginationPagesNumber = 0;
        let renderList = '';
        let pagesArray = '';
        let todoFilteredArray = getFilteredArray();
        let todoCurrentPageArray = [];
        
        count();

        $todoList.empty();

        paginationPagesNumber = Math.ceil(todoFilteredArray.length / TODOS_ON_PAGES);

        todoCurrentPageArray = todoFilteredArray.slice((pageId-1)*TODOS_ON_PAGES, pageId*TODOS_ON_PAGES);

        todoCurrentPageArray.forEach((todo) => {
            renderList += `<li data-id='${todo.id}' class='${todo.checked ? 'doneTodo' : 'unDoneTodo'}'>
            <input type="checkbox" ${todo.checked ? 'checked' : ''} class="check" name=''>    
                <div class="left-cont">    
                    <span> ${_.escape(todo.text)} </span>
                </div>
                <span class="remove"> <i class="material-icons">delete</i> </span>
            </li>`
        });
        $todoList.html(renderList);
        
        for (let i = 1; i <= paginationPagesNumber; i+=1) {
            while (paginationPagesNumber<pageId) pageId-=1;
            pagesArray +=`<a class='page' data-id='${i}' href='#'><button class="${(i == pageId) ? 'pagesSelected' : 'pages'}">${i}</button></a>`;
        }
        $pagination.html(pagesArray);
    }

    function addNewTodoItem() {
        const currentText = $formControl.val();
        tabStatus = 'all'
        $statusTab.removeClass('current-stat');
        $all.addClass('current-stat');
        if (currentText.trim() !== ''){
            let todo = {
                text: currentText,
                id: Date.now(),
                checked: false,
            }
            todos.push(todo)
            $formControl.val('');
            isCheckboxChecked();
            if (pageId < Math.ceil(getFilteredArray().length / TODOS_ON_PAGES)) {
                pageId = Math.ceil(getFilteredArray().length / TODOS_ON_PAGES);
            }
            render();
        }
    }

    function getFilteredArray(){
        let todoFilteredArray = [];
        if (tabStatus == 'all') {
            todoFilteredArray = todos;
        } else {
            todoFilteredArray = todos.filter(todo => todo.checked === (tabStatus == 'completed'));
        }
        return todoFilteredArray;
    }

    function count () {
        let total = todos.length;
        let itemsDone = todos.filter(todo => todo.checked).length;
        let itemsUndone = total - itemsDone;
        $total.html(`${total} tasks total`);
        $done.html(`${itemsDone} tasks done`);
        $undone.html(`${itemsUndone} tasks undone`)
    }

    function isCheckboxChecked () {
        const checkCompleted = (todo) => {
            return todo.checked;
        }
        const isAllTodosChecked = todos.every(checkCompleted);
        $checkAll.prop('checked', isAllTodosChecked)
    }

    $formControl.keypress(function (event) {
        if (event.key === ENTER){
            addNewTodoItem();
        }
    });

    $documentPage.on('click', '.add', addNewTodoItem);

    $documentPage.on('click', '.page', function(){
        let currentId = $(this).data("id");
        pageId = currentId;
        render();
    });

    $documentPage.on('change', '.check', function () {
        const currentLiId = Number($(this).parent().data("id"))
        todos.forEach((todo) => {
            if (todo.id === currentLiId) {
                todo.checked = !todo.checked 
                render();
            }
        })
        render();
    })
    
    $documentPage.on('change', '#check-all', function () {
        todos.forEach((todo) => {
            todo.checked = this.checked
        })
        render();
    })

    $documentPage.on('click', '.clear', function() {
        const filteredTodos = todos.filter(todo => !todo.checked)
        todos = filteredTodos;
        if ($checkAll.is(':checked')) {
            $checkAll.prop('checked', false)
        }
        render();    
        render(); 
    }); 

    $documentPage.on('click', '.remove', function(){
        const currentLiId = Number($(this).parent().data("id"))
        const filteredTodos = todos.filter(todo => todo.id !== currentLiId)
        todos = filteredTodos;
        render();
        render();
    })
    
    $documentPage.on('dblclick', 'li', function(){
        const currentLiId = Number($(this).data("id"))
        const currentTodo = todos.find(todo => todo.id === currentLiId);
        $(this).html("<input class='editing' type='text' value='" + currentTodo.text + "'>");
        const $editing = $('.editing');
        
        function editTodo() {
            todos.forEach((todo) => {
                const editedText = $editing.val();
                if (todo.id === currentLiId) {
                    if (editedText.trim() !== ''){
                        todo.text = editedText;
                    }
                }
                render();
            })
        }        
        $editing.focus();
        $editing.keypress((edit) => {
            if (edit.key === ENTER){
                editTodo()
            }
        }) 
        $editing.blur(function() {
            editTodo()
        })       
    })

    $documentPage.on('click', '.status-tab', function(){
        tabStatus = $(this).data('status');
        $statusTab.removeClass('current-stat');
        $(this).addClass('current-stat');
        render();
    })

    $documentPage.on('change', '.todo-list', function(){
        count();
    })
})
