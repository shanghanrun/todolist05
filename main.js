const debugTodoList = document.querySelector('#todo-list')
const debugOngoingList = document.querySelector('#ongoing-list')
const debugDoneList = document.querySelector('#done-list')

const shadow = document.querySelector('.shadow')
const tabs = document.querySelectorAll('.tab')
tabs.forEach(tab => tab.addEventListener('click', indicator))
tabs.forEach(tab => addEventListener('click', render))

function indicator(e){
    shadow.style.left = e.target.offsetLeft +'px';
    shadow.style.top = e.target.offsetTop + 'px';
    shadow.style.width = e.target.offsetWidth + 'px';

    shadow.style.height = e.target.offsetHeight + 'px'; 
}

const addButton = document.querySelector('.add')
const input = document.querySelector('.input')
let todoList =[]
let ongoingList=[]
let doneList =[]




addButton.addEventListener('click', addToList)
input.addEventListener('keyup', function(e){
    if(e.key == 'Enter'){
        addToList()
    }
})

function addToList(){
    const inputValue = input.value.trim();   
    const item = {value: inputValue, status: 'ongoing' }
    // 중복값 못들어가게 
    const i = todoList.findIndex(todo => todo.value == inputValue);
    if( inputValue !=''){
        //빈문자열은 걸러내고,
        // 이미 들어 있지 않은 일만 추가
        if(i == -1){
            todoList.push(item)
            ongoingList.push({...item}) // 독립되게
            console.log(todoList)
            input.value =''
            renderTodoList()
            
        }
    }
    //입력되는 순간 indicator가 '모두'탭을 가리키게 한다.
    // indicator는 해당탭을 클릭(event)로 작동하므로
    const allTab = document.querySelector('#all')
    allTab.click();
}

function showDebug(){
    debugTodoList.innerHTML=''
    debugOngoingList.innerHTML=''
    debugDoneList.innerHTML=''
    debugTodoList.innerHTML=`todoList : ${JSON.stringify(todoList)}`
    debugOngoingList.innerHTML=`ongoingList: ${JSON.stringify(ongoingList)}`
    debugDoneList.innerHTML =`doneList : ${JSON.stringify(doneList)}`
}



function renderTodoList(){
    let resultHTML =''
    const taskBoard = document.querySelector('.task-board')
    taskBoard.innerHTML = resultHTML;

    todoList.forEach( item => {
        const li = document.createElement('li')
        const span = document.createElement('span') 
        li.classList.add('todo')
        li.classList.add(item.status)
        li.setAttribute('data-key', item.value)
         //나중에 getAttribute('data-key')로 받는다.
         // 혹은 li.key?
        span.innerText = item.value

        const div = document.createElement('div')   
        const doneButton = document.createElement('button')
        doneButton.innerHTML = '완료'
        doneButton.addEventListener('click', checkTodo)
            
        const deleteButton = document.createElement('button')
        deleteButton.innerHTML='삭제'
        deleteButton.addEventListener('click', deleteTodo)

        div.appendChild(doneButton)
        div.appendChild(deleteButton)

        li.appendChild(span)
        li.appendChild(div)
        li.style.display = 'flex';
        li.style.justifyContent = 'space-between'
        li.style.borderBottom = '1px solid gray';
        if (item.status == 'ongoing'){
            li.style.background ='#b9d4c3'
            li.style.color = 'black'
        } else{
            li.style.background ='lightgray'
            li.style.color = 'gray'
        }        
    
        todoUl.appendChild(li)
    })

    showDebug()
}

function checkTodo(event){
    const button = event.target;
    const div = button.parentNode;
    const li = div.parentNode;
    const span = li.firstChild
    const value = span.textContent;
    // const key = li.getAttribute('data-key')
    const key = li.dataset.key
    console.log('value: ', value)
    console.log('key :', key)
    const itemIndex = todoList.findIndex( item => item.value == value)
    const item = todoList.find(item => item.value == value)
    console.log('itemIndex: ',itemIndex)
    console.log(todoList[itemIndex])

    todoList[itemIndex].status ='done'
    
    // ongoingList에서 해당 item을 삭제한다.
    ongoingList = ongoingList.filter(item => item.value != value)
    console.log('ongoingList :', ongoingList)
    // doneList에 해당 item을 추가한다.
    doneList = [...doneList, {value: value, status: 'done'}]
    console.log('doneList :', doneList)
        

    // renderTodoList();
    // 바로 다시 랜더하면 화면이 지워진다.
    //그리고 사실 다시 랜더할 필요없이, 아래 사항만 바뀌면 된다.
    if (item.status == 'ongoing'){
            li.style.background ='#b9d4c3'
            li.style.color = 'black'
        } else{
            li.style.background ='lightgray'
            li.style.color = 'gray'
        }    

    showDebug()

}


function deleteTodo(event){
    const button = event.target;
    const div = button.parentNode;
    const li = div.parentNode;
    const span = li.firstChild
    const value = span.textContent;
    const key = li.getAttribute('data-key')
    
    ongoingList = ongoingList.filter(item => item.value != value)
    doneList = doneList.filter(item => item.value != value)
    todoList = todoList.filter(item => item.value != value)

    renderTodoList();
    showDebug()

}

function render(event){
    const tab = event.target
    if (tab.id =='all'){
        renderTodoList()
    } else{
        renderOtherList(tab.id)
    }
}


function renderOtherList(id){
    let list =[]
    if (id == 'ongoing'){
        list = ongoingList
    }
    if (id =='done'){
        list = doneList
    }

    todoUl.innerHTML ='';

    list.forEach( item => {
        const li = document.createElement('li')
        const span = document.createElement('span') 
        span.innerText = item.value

        li.appendChild(span)
        if (item.status == 'ongoing'){
            li.style.background ='#b9d4c3'
            li.style.color = 'black'
        } else{
            li.style.background ='lightgray'
            li.style.color = 'gray'
        }        
    
        todoUl.appendChild(li)
    })

    showDebug()
}


/// 완료를 누를 때, 리스트 목록이 삭제되는 문제 해겷해야 된다.