
const debugTodoList = document.querySelector('#todo-list')
const debugOngoingList = document.querySelector('#ongoing-list')
const debugDoneList = document.querySelector('#done-list')

let mode ='all'
const shadow = document.querySelector('.shadow')
const tabs = document.querySelectorAll('.tab')
tabs.forEach(tab => tab.addEventListener('click', indicator))
// tabs.forEach(tab => tab.addEventListener('click', render))

let myChart = null;

const addButton = document.querySelector('.add')
const input = document.querySelector('.input')
let todoList =[]
let ongoingList=[]
let doneList =[]
let trashList=[]

addButton.addEventListener('click', addToList)
input.addEventListener('keyup', function(e){
    if(e.key == 'Enter'){
        addToList()
    }
})

function indicator(e){
    shadow.style.left = e.target.offsetLeft +'px';
    shadow.style.top = e.target.offsetTop + 'px';
    shadow.style.width = e.target.offsetWidth + 'px';

    shadow.style.height = e.target.offsetHeight + 'px';
    shadow.style.borderTopRightRadius = '10px';

    mode = e.target.id
    render()
}

function addToList(){
    const inputValue = input.value.trim();  
    const uid = Math.random().toString(36).substring(2,18);  
    const item = {id: uid, value: inputValue, isCompleted: false, createdAt: today() }
    console.log(item)
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
    } else if (mode =='trash'){
        renderTrash()
        return;
    }

    let resultHTML =''
    const todoUl = document.querySelector('.todo')
    console.log(todoUl)
    list.forEach( item => {
        if(item.isCompleted == false){
            resultHTML += `
                    <li class="undone" ondblclick="deleteTodo('${item.id}')" draggable="true" id="${item.id}" ondragstart="handleDragStart(event)">
                        <span class="value">${item.value}</span>
                        <div class="icon">
                            <button onclick="checkTodo('${item.id}')"><i class="fa-solid fa-check"></i></button>
                            <button onclick="editTodo('${item.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="deleteTodo('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <span class='date'>${item.createdAt}</span>
                    </li>
            `
        } else {
            resultHTML += `
                    <li class="done" ondblclick="deleteTodo('${item.id}')" draggable="true" id="${item.id}" ondragstart="handleDragStart(event)">
                        <span class="value">${item.value}</span>
                        <div class="icon">
                            <button onclick="checkTodo('${item.id}')"><i class="fa-solid fa-rotate-left"></i></button>
                            <button onclick="editTodo('${item.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onclick="deleteTodo('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <span class='date'>${item.createdAt}</span>
                    </li>
            `
        }       
    })
    todoUl.innerHTML = resultHTML;
    showDebug()
    checkProgress()
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

// 끝난 아이템은 수정 불가
function editTodo(checkedId){
    const item = todoList.find(item => item.id == checkedId)
    const prevValue = item.value;
    const itemIndex = todoList.findIndex(item => item.id == checkedId)
    
    if(!item.isCompleted){
        let newValue = prompt(`기존 할일은 "${prevValue}"입니다.\n새로운 일을 입력하세요.`)
    
        // 사용자가 값을 입력하지 않거나 취소를 누른 경우 처리
        newValue = newValue.trim()
        if (newValue == null || newValue == '') {
            // 입력이 취소되었거나 공백 문자열이면 아무것도 하지 않음
            alert('입력문자가 없습니다.')
            return;
        }
        // 이미 있는 할일과 동일한 할일이 입력된 경우
        let i = todoList.findIndex(item => item.value == newValue)
        if( i != -1){
            alert(`이미 있는 할 일(${newValue})이 입력되었습니다`)
            return;
        }
    
        todoList[itemIndex] = {...todoList[itemIndex], value:newValue}
    
        // ongoingList에서는 기존 value값을 가진 것을 찾아서, newValue로 바꾸어준다.
        i = ongoingList.findIndex(item => item.value == prevValue)
        if(i !=-1){
            ongoingList[i] = {...ongoingList[i], value:newValue} //덮어쓰기가 된다.
        }
        i = doneList.findIndex(item => item.value == prevValue)
        if(i != -1){
            doneList[i] = {...doneList[i], value: newValue}
        }
    
        render()
    } else{
        alert('이미 완료한 일은 수정불가!')
        return;
    }
}


// 진행중에는 삭제 하지 않는 기능 추가
function deleteTodo(checkedId){
    const item = todoList.find(item => item.id == checkedId)
    // todoList에서 지우기 전에, item을 먼저 찾아야 찾아진다.
    if (item.isCompleted){
        todoList = todoList.filter(item => item.id != checkedId)
        console.log(item)
        trashList.push({...item})
    
        render();
    } else{
        alert('진행중인 일은 삭제 불가')
        return;
    }
}


function today(){
    const now = new Date();
    const year = now.getFullYear(); 
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    // 월을 가져오고 0을 붙여 두 자리로 만듭니다.
    const day = String(now.getDate()).padStart(2, '0'); // 일을 가져오고 0을 붙여 두 자리로 만듭니다.

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
}

function handleDragStart(event) {
    // 드래그되는 데이터 설정
    event.dataTransfer.setData("text/plain", event.target.id);
}
function handleDragOver(event){
    event.preventDefault();
}

function handleDrop(event){
    event.preventDefault();
    let checkedId = event.dataTransfer.getData("text/plain")
    console.log('checkedId: ', checkedId)
    deleteTodo(checkedId)
}

function checkProgress(){
    // 할 일 목록과 완료된 항목의 수 가져오기
    const totalTasks = todoList.length;
    const completedTasks = doneList.length;
    const ongoingTasks = totalTasks - completedTasks;
    console.log('completedTasks: ',completedTasks)
    console.log('ongoingTasks: ',ongoingTasks)

    if(myChart){
        myChart.destroy();
    }

    // 파이그래프 데이터
    const data = {
        labels: ['완료', '진행중'],
        datasets: [{
            label: '할 일 진행 상황',
            data: [completedTasks, ongoingTasks],
            backgroundColor: [
                'rgba(85, 124, 254, 0.7)', // 완료 항목의 색상
                'rgb(76, 248, 139, 0.7)'// 진행중 항목의 색상
            ],
            // borderColor: [
                // 'black',
                // 'black'
            // ],
            borderWidth: 1,
            // boxShadow: ['5px', '5px', '10px', 'rgba(0, 0, 0, 0.5)']
        }]
    };

    
    // 파이그래프 설정
    const config = {
        type: 'pie',
        data: data,
        options:{
            responsive:true,
            maintainAspectRatio: false
        }
    };
    // 파이그래프 생성
    myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    document.addEventListener('DOMContentLoaded', function() {
        const canvas = document.getElementById('myChart');
        const container = document.querySelector('.canvas-container');

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
    });
}




function renderTrash(){
    const list = trashList;

    let resultHTML =''
    const todoUl = document.querySelector('.todo')
    console.log(todoUl)
    list.forEach( item => {
        if(item.isCompleted == false){
            resultHTML += `
                    <li disabled="true" class="undone" ondblclick="deleteTodo('${item.id}')" draggable="true" id="${item.id}" ondragstart="handleDragStart(event)">
                        <span class="value">${item.value}</span>
                        <div class="icon">
                            <button disabled="true" onclick="checkTodo('${item.id}')"><i class="fa-solid fa-check"></i></button>
                            <button disabled="true" onclick="editTodo('${item.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button disabled="true" onclick="deleteTodo('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <span class='date'>${item.createdAt}</span>
                    </li>
            `
        } else {
            resultHTML += `
                    <li disabled="true" class="done" ondblclick="deleteTodo('${item.id}')" draggable="true" id="${item.id}" ondragstart="handleDragStart(event)">
                        <span class="value">${item.value}</span>
                        <div class="icon">
                            <button disabled="true" onclick="checkTodo('${item.id}')"><i class="fa-solid fa-rotate-left"></i></button>
                            <button disabled="true" onclick="editTodo('${item.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button disabled="true" onclick="deleteTodo('${item.id}')"><i class="fa-solid fa-trash"></i></button>
                        </div>
                        <span class='date'>${item.createdAt}</span>
                    </li>
            `
        }       
    })
    todoUl.innerHTML = resultHTML;
    showDebug()
    checkProgress()
}


// reset
function reset(){
    todoList =[]
    ongoingList=[]
    doneList =[]
    trashList=[]

    render()
}