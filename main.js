const debugTodoList = document.querySelector('#todo-list')
const debugOngoingList = document.querySelector('#ongoing-list')
const debugDoneList = document.querySelector('#done-list')

let mode ='all'
const shadow = document.querySelector('.shadow')
const tabs = document.querySelectorAll('.tab')
tabs.forEach(tab => tab.addEventListener('click', indicator))
// tabs.forEach(tab => tab.addEventListener('click', render))

function indicator(e){
    shadow.style.left = e.target.offsetLeft +'px';
    shadow.style.top = e.target.offsetTop + 'px';
    shadow.style.width = e.target.offsetWidth + 'px';

    shadow.style.height = e.target.offsetHeight + 'px';
    
    mode = e.target.id
    render()
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
    const uid = Math.random().toString(36).substring(2,18);  
    const item = {id: uid, value: inputValue, isDone: false }
    // 중복값 못들어가게 
    const i = todoList.findIndex(todo => todo.value == inputValue);
    if( inputValue !=''){
        //빈문자열은 걸러내고,
        // 이미 들어 있지 않은 일만 추가
        // 객체는 참조형 자료라서, 독립된 새로운 값으로 각기 다른 리스트에 넣는다.
        if(i == -1){
            todoList.push(item)
            ongoingList.push({...item}) // 독립되게
            console.log(todoList)
            input.value =''
            render()
            
        }
    }
    //입력되는 순간 indicator가 '모두'탭을 가리키게 한다.
    // indicator는 해당탭을 클릭(event)로 작동하므로
    const allTab = document.querySelector('#all')
    allTab.click();
}

function showDebug(){
    ongoingList = todoList.filter(item => item.isCompleted ==false)
    doneList = todoList.filter(item => item.isCompleted ==true)
    debugTodoList.innerHTML=''
    debugOngoingList.innerHTML=''
    debugDoneList.innerHTML=''
    debugTodoList.innerHTML=`todoList : ${JSON.stringify(todoList)}`
    debugOngoingList.innerHTML=`ongoingList: ${JSON.stringify(ongoingList)}`
    debugDoneList.innerHTML =`doneList : ${JSON.stringify(doneList)}`
}



function render(){
    let list;
    if(mode =='all'){
        list = todoList;
    } else if (mode == 'ongoing'){
        list = todoList.filter(item => item.isCompleted == false)
    } else if (mode =='done'){
        list = todoList.filter(item => item.isCompleted == true)
    }

    let resultHTML =''
    const taskBoard = document.querySelector('.task-board')
    
    list.forEach( item => {
        if(item.isCompleted == false){
            resultHTML += `
                <ul class='todo'>
                    <li class="undone">
                        <span>${item.value}</span>
                        <div>
                            <button onclick='checkTodo('${item.id}')'><i class="fa-solid fa-check"></i></button>
                            <button onclick='deleteTodo('${item.id}')'><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </li>
                </ul>
            `
        } else {
            resultHTML += `
                <ul class='todo'>
                    <li class="done">
                        <span>${item.value}</span>
                        <div>
                            <button onclick="checkTodo('${item.id}')"><i class="fa-solid fa-rotate-left"></i></button>
                            <button onclick="deleteTodo('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </li>
                </ul>
            `
        }       
    })

    taskBoard.innerHTML = resultHTML;
    showDebug()
}

function checkTodo(checkedId){
    let checkedItem;
    todoList.forEach(item => {
        if(item.id == checkedId){
            item.isCompleted = !item.isCompleted; 
        }
    })
    render();
}


function deleteTodo(checkedId){
    todoList = todoList.filter(item => item.id != checkedId)

    render();
}

