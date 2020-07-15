let addevent = document.getElementsByClassName('add_icon')[0];

let addinput = document.getElementsByClassName('add_input')[0];

let wait = document.getElementsByClassName('wait_item_container')[0];

let done = document.getElementsByClassName('done_item_container')[0];

let controlModify=true;

addevent.onclick = async function(){
    let addcontent = addinput.value.trim();
    if(addcontent === ""){
        alert("还没写东西呢亲");
    }else{
        let xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/list', true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("content="+addcontent);
        xhttp.onreadystatechange = async function () {
            if (this.readyState === 4 && this.status === 200) {
                //addWaitItem(addcontent);
                await fetchWaitItems();
                addinput.value = "";
            }
        };
    }
};

async function clearWaitList(){
    while(wait.firstChild){
        wait.removeChild(wait.firstChild)
    }
}

async function clearDoneList(){
    while(done.firstChild){
        done.removeChild(done.firstChild)
    }
}

function removeChild(item){
    while(item.firstChild){
        item.removeChild(item.firstChild)
    }
    item.remove();
}

async function fetchWaitItems(){
    //console.log("fetch called");
    await clearWaitList();
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/list/incomplete', true);
    xhttp.send();
    xhttp.responseType = "json";
    xhttp.onreadystatechange = async function () {
        if (this.readyState === 4 && this.status === 200) {
            //console.log("response arrived")
            //await console.log(this.response);
            this.response.forEach(item => {
                addWaitItem(item._id, item.content)
            })
        }
    };
}

async function fetchDoneItems(){
    await clearDoneList();
    let xhttp = new XMLHttpRequest();
    xhttp.open('GET', '/list/completed', true);
    xhttp.send();
    xhttp.responseType = "json";
    xhttp.onreadystatechange = async function () {
        if (this.readyState === 4 && this.status === 200) {
            //console.log("response arrived")
            //await console.log(this.response);
            this.response.forEach(item => {
                addDoneItem(item._id, item.content)
            })
        }
    };
}

function addWaitItem(id, content){
    let waitItem = document.createElement("div");
    let waitItemText = document.createElement("div");
    let waitItemIcons = document.createElement("div");
    let waitItemIconsModify = document.createElement("div");
    let waitItemIconsTrash = document.createElement("div");
    let waitItemIconsDone = document.createElement("div");
    let waitItemId = document.createElement("div");

    waitItem.className="wait_item";
    waitItemText.className="wait_item_text";
    waitItemIcons.className="wait_item_icons";
    waitItemIconsModify.className="wait_item_icons_modify";
    waitItemIconsTrash.className="wait_item_icons_trash";
    waitItemIconsDone.className="wait_item_icons_done";
    waitItemId.className="wait_item_id";
    waitItemId.id=id;

    waitItemId.innerHTML=id;
    waitItemText.innerHTML=content;

    waitItemIconsModify.innerHTML="<img src=\"/image/edit.svg\">";
    waitItemIconsTrash.innerHTML="<img src=\"/image/trash-2.svg\">";
    waitItemIconsDone.innerHTML="<img src=\"/image/circle.svg\">";

    waitItemIcons.appendChild(waitItemIconsModify);
    waitItemIcons.appendChild(waitItemIconsTrash);
    waitItemIcons.appendChild(waitItemIconsDone);
    waitItem.appendChild(waitItemText);
    waitItem.appendChild(waitItemIcons);
    waitItem.appendChild(waitItemId);

    wait.appendChild(waitItem);

    //modify
    waitItemIconsModify.onclick=function(event){
        modifyItem(id, content, event);
    };

    /*waitItemIconsModify.addEventListener("click", modifyItem(id, content, event)
    });*/

    //delete
    waitItemIconsTrash.onclick=function(){
        deleteItem(id)
    };

    //done
    waitItemIconsDone.onclick=function() {
        markComplete(id)
    }
}

function modifyItem(id, content, event){
    if(controlModify){
        controlModify=false;
        let waitItem = document.getElementById(id).parentElement;
        let waitItemText = waitItem.getElementsByClassName('wait_item_text')[0];
        waitItemText.innerHTML="<input class=\"wait_item_text_input\" type=\"text\">";
        let waitItemTextInput = waitItem.getElementsByClassName("wait_item_text_input")[0];
        waitItemTextInput.value = content;
        waitItemTextInput.focus();
        event=window.addevent || event;
        event.stopPropagation() ? event.stopPropagation() : event.cancelBubble=true;
        document.onclick=function(){
            let xhttp = new XMLHttpRequest();
            let item = document.getElementById(id).parentElement;
            xhttp.open('PUT', '/list/' +id +'/' + waitItemTextInput.value, true);
            xhttp.send();
            xhttp.onreadystatechange = function(){
                if (this.readyState === 4 && this.status === 200) {
                    waitItemText.innerHTML=waitItemTextInput.value;
                }
            };
            controlModify=true;
        }
    }
}

function deleteItem(id){
    let xhttp = new XMLHttpRequest();
    let item = document.getElementById(id).parentElement;
    xhttp.open('DELETE', '/list/' + id, true);
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200) {
            removeChild(item);
        }
    }
}

function markComplete(id){
    if (controlModify) {
        let xhttp = new XMLHttpRequest();
        let waitItem = document.getElementById(id).parentElement;
        xhttp.open('PUT', '/list/' + id, true);
        xhttp.send();
        xhttp.onreadystatechange = async function () {
            if (this.readyState === 4 && this.status === 200) {
                await fetchDoneItems();
                removeChild(waitItem);
            }
        }
    }
}

function markIncomplete(id){
    if (controlModify){
        let xhttp = new XMLHttpRequest();
        let doneItem = document.getElementById(id).parentElement;
        xhttp.open('PUT', '/list/' + id, true);
        xhttp.send();
        xhttp.onreadystatechange = async function () {
            if (this.readyState === 4 && this.status === 200) {
                await fetchWaitItems();
                removeChild(doneItem);
            }
        }
    }
}

function addDoneItem(id, doneContent){
    let doneItem = document.createElement("div");
    let doneItemText = document.createElement("div");
    let doneItemIcons = document.createElement("div");
    let doneItemIconsModify = document.createElement("div");
    let doneItemIconsTrash = document.createElement("div");
    let doneItemIconsDone = document.createElement("div");
    let doneItemId = document.createElement("div");

    doneItem.className="done_item";
    doneItemText.className="done_item_text";
    doneItemIcons.className="done_item_icons";
    doneItemIconsTrash.className="done_item_icons_trash";
    doneItemIconsDone.className="done_item_icons_done";
    doneItemId.className="done_item_id";

    doneItemId.innerHTML=id;
    doneItemText.innerHTML=doneContent;

    doneItemIconsModify.innerHTML="<img src=\"/image/edit.svg\">";
    doneItemIconsTrash.innerHTML="<img src=\"/image/trash-2.svg\">";
    doneItemIconsDone.innerHTML="<img src=\"/image/circle.svg\">";

    doneItemIcons.appendChild(doneItemIconsTrash);
    doneItemIcons.appendChild(doneItemIconsDone);
    doneItem.appendChild(doneItemText);
    doneItem.appendChild(doneItemIcons);
    doneItem.appendChild(doneItemId);

    done.appendChild(doneItem);

    //delete
    doneItemIconsTrash.onclick=function(){
        deleteItem(id);
    };

    //wait
    doneItemIconsDone.onclick=function(){
        addWaitItem(doneItemText.innerHTML);
        doneItem.parentNode.removeChild(doneItem);
    }
}