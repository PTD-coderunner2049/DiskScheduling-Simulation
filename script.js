/// <reference path="algorithm.js" />

/*--------------------------------------------------------------------------------------------*/
//interface setup
let link = checkScriptLink();
console.log(link);
console.log("D.S.A.S: 🚧Page enter function...");
// let pageStartUp = 1;
// const warningElements = document.querySelectorAll(".onscreen-warning-message");
// warningElements.forEach(element => {
//     element.style.opacity = "0";
// });
const trackCapacityInput = getCapacity();
const initialHeadInput = getHead();
const requestQueueInput = getQueue();

clearAllWarnMsg();
/*--------------------------------------------------------------------------------------------*/
//eventListeners setup
window.addEventListener("load", () => {
    const input = document.getElementById("disk-track-capacity");
    input.focus(); //default focused field
    console.log("D.S.A.S: Defaultly focused input field: Set.");
});
const inputs = document.querySelectorAll('.interface-input');
inputs.forEach(input => {
    input.addEventListener('input', clearAllWarnMsg);
    input.addEventListener('input', validateAllInputs);
});
trackCapacityInput.addEventListener('input', function () {
    // Replace anything that's not a digit (0–9) with an empty string
    this.value = this.value.replace(/[^0-9]/g, '');
});
initialHeadInput.addEventListener('input', function () {
    // Replace anything that's not a digit (0–9) with an empty string
    this.value = this.value.replace(/[^0-9]/g, '');
});
requestQueueInput.addEventListener('input', function () {
    // Replace anything that's not a digit (0–9) with an empty string
    this.value = this.value.replace(/[^0-9, |+/.&()]/g, '');
});
/*--------------------------------------------------------------------------------------------*/
//auto stretch I/O request input
const input = document.getElementById("IO-request-queue");
const mirrorer = document.getElementById("input-mirrorer-01");
console.log("D.S.A.S: Autostretch input field: Set.");

//copy input to mirrorer
input.addEventListener("input", () => {
    mirrorer.textContent = input.value || input.placeholder;
    input.style.width = mirrorer.offsetWidth + "px";
    console.log("D.S.A.S: Input field is stretching...");
});
/*--------------------------------------------------------------------------------------------*/
// Simulation Functions
// let ioQueue = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let connectPermission = true;
function runSimulation() {
    //Validation
    if(!validateAllInputs()){
        return;
    }
    //mapping the string
    let mappedQueue = numberMapping(getQueue().value);//is an array
    touchUp(mappedQueue); //add min max and head
    removeDuplicates(mappedQueue);
    const headQueue = [...mappedQueue].sort((a, b) => a - b);
    //[...mappedQueue] mean create temporal copy (shallow copy) to use then discard it
    //Run the simulator algorithm for a result array
    const simulatedQueue = addHead(numberMapping(getQueue().value));
    let seektime = FCFS(simulatedQueue);
    //export seektime
    const seektimeText = document.getElementById('table-describe-seek-time-message');
    seektimeText.textContent = 'Seek Time Accumulated: ' + seektime;
    seektimeText.style.opacity = '1';
    //Build simulation
    console.log("D.S.A.S: Simulation process commited.");
    
    const safeHeadQueue = sanitizeToNumberArray(headQueue);
    const safeSimulatedQueue = sanitizeToNumberArray(simulatedQueue);

    constructSimTable(safeHeadQueue, safeSimulatedQueue, clearSimTable());//clean previous table aswell
    //draw connection, add an svg if not already exist.
    if (connectPermission){
        let svg = document.querySelectorAll("svg");
        if(svg.length === 0){
            connectCell(injectSVG());
        }else{
            connectCell(svg[0]);
        }
    }
    // extend web height, in case of small simulation so it have chance to sit in the middle instead of bottom.
    // if(pageStartUp === 1){
    //     document.body.style.height = (document.body.offsetHeight * 1.1) + 'px';
    //     console.log("D.S.A.S: 🚧Stretch web's height by 10%.");
    //     pageStartUp = 2;
    // }
}
function sanitizeToNumberArray(arr) {// make absolutely sure they are array of numbers, javascript is shitty type.
    if (!Array.isArray(arr)) return [];
    return arr
        .map(num => Number(num))
        .filter(num => !isNaN(num)); // removes NaN
}
//random array of 25
// const fullArray = Array.from({ length: 200 }, (_, i) => i);
// const selected = fullArray.sort(() => Math.random() - 0.5).slice(0, 25);
function validateAllInputs() {
    //version 1
    const trackCapacityInput = getCapacity();
    const initialHeadInput = getHead();
    const requestQueueInput = getQueue();
    
    const capacityWarning = getCapacityMsg();
    const headWarning = getHeadMsg();
    const queueWarning = getQueueMsg();

    if (!validateInput(trackCapacityInput,capacityWarning) ||
        !validateInput(initialHeadInput, headWarning) ||
        !validateInput(requestQueueInput, queueWarning))
    {
        return false;
    }
    return true;

    //version 2
    // const inputs = document.querySelectorAll('.interface-input');
    // const warnings = document.querySelectorAll('.onscreen-warning-message');
    
    // let status = true;
    // inputs.forEach((input, index) => {
    //     if (!validateInput(input, warnings[index])) {
    //         status = false;
    //     }
    // });
    // if (!status) {
    //     return;
    // }
}
function validateInput(input, message){
    if (!existInput(input, message)) {
        return setValidationStyle(input, message, false)
    }
    
    if (input.id === 'disk-track-capacity') {
        console.log('Disk range: 0 - ' + input.value);
        return setValidationStyle(input, message, true);
    }
    if (input.id === 'initial-head') {
        return headValidate(input, message);
    }
    if (input.id === 'IO-request-queue') {
        return queueValidate(input, message);
    }
    return setValidationStyle(input, message, true);
}
function existInput(input, message) {
    clear(message);
    // Check each input
    if (input.value.trim() === '') {
        message.textContent = 'Field is required.';
        return false;
    }
    return true;
}
function headValidate(head, message) {
    headVal = parseInt(head.value);
    capacityVal = parseInt(getCapacity().value);

    if (headVal > capacityVal) {
        console.log('"Warning: ⚠️ Foreign Position detected! ⚠️"')
        message.textContent="Head position is foreign!"
        return setValidationStyle(head, message, false)
    }
    return setValidationStyle(head, message, true);
}
function queueValidate(queue, message) {
    let mappedQueue = numberMapping(queue.value);
    let msg = document.getElementById('queue-describe-message')
    
    if (mappedQueue.length > 25){
        msg.textContent = 'Queue of 25+ lacking connections due to website limitation.';
        msg.style.opacity = 1;
        connectPermission = false;
    }
    else {
        msg.style.opacity = 0;
        connectPermission = true;
    }
    const capacityVal = parseInt(getCapacity().value);

    for (let val of mappedQueue) {
        if (val > capacityVal) {
            message.textContent = `Request ${val} exceeds disk capacity (${capacityVal})`;
            return setValidationStyle(queue, message, false);
        }
    }
    if (!mappedQueue.includes(Number(initialHeadInput.value))) {
        message.textContent = 'The current queue is missing the head position, so it will be added automatically.';
    }
    return setValidationStyle(queue, message, true);
}

function setValidationStyle(input, message, isValid) {
    const addedClass = isValid ? 'valid' : 'invalid';
    const removedClass = isValid ? 'invalid' : 'valid';

    input.classList.add(addedClass);
    input.classList.remove(removedClass);

    message.classList.add(addedClass);
    message.classList.remove(removedClass);

    return isValid;
}
function clearAllWarnMsg() {
    console.log('🚧clearing all messages...');
    const warning = document.querySelectorAll('.onscreen-warning-message');
    warning.forEach(message => {
    clear(message);
    });
}
function clear(obj) {
    obj.textContent='';
    // console.log('🚧clearing: ' + obj.id);
}

function touchUp(queue) {
    addHead(queue);
    addMin(queue);
    addMax(queue);
}
function addHead(queue) {
    const head = Number(initialHeadInput.value);
    if (!queue.includes(head)) {
        queue.unshift(head);
    }
    return queue;
}
function addMin(queue) {
    const min = 0;
    if (!queue.includes(min)) {
        queue.unshift(min);
    }
    return queue;
}
function addMax(queue) {
    const cap = Number(trackCapacityInput.value);
    if (!queue.includes(cap)) {
        queue.push(cap);
    }
    return queue;
}

function removeDuplicates(queue) {
    const seen = new Set();
    for (let i = queue.length - 1; i >= 0; i--) {
        if (seen.has(queue[i])) {
            queue.splice(i, 1); // remove duplicate
        } else {
            seen.add(queue[i]);
        }
    }
}

function constructSimTable(headQueue, simulatedQueue, simTable) {
    console.log(headQueue);
    console.log(simulatedQueue);
    let darkSpellCount = 0;
    let operationCount = 0;
    //add the header row for the table
    const headerRow = document.createElement('DIV');
    headerRow.className = "sim-row sim-header-row";
        //add the cell for the row
    headQueue.forEach(nums => {//need to be replaced with a sorted queue
        const newCell = document.createElement('DIV');
        
        newCell.className = "sim-table-cell";
        newCell.innerText = nums;
        newCell.style.height = "50px";
        addCell(headerRow, newCell);
        console.log("D.S.A.S: Building head cell...");
    });
    addRow(simTable, headerRow);//add it all at once
    console.log("D.S.A.S: Building head row...");
    //add the simulated rows
    let i;
        //add row of cells for every values in simulated queue.
        simulatedQueue.forEach(nums => {
        i = headQueue.indexOf(nums);
        console.log("DEBUG>>current cell is " + nums + " and its index:" + i);
        
        if(i === -1){
            alert("⚠️ Warning: DEADCELL!\nDetail: One of the value in the simulated queue was not originally exist in the inputed queue.\nResult: One of the simulated row will be marked with an ✖️ instead of ⭕");
            darkSpellCount++;
            console.log("Warning: ⚠️ DEADCELL detected! ⚠️");
        }

        let newSimRow = document.createElement('DIV');
        newSimRow.className = "sim-row";
        //add cells to each row of simulatedQueue.
        for (let j = 0; j < headQueue.length; j++) {
            const newCell = document.createElement('DIV');
            newCell.className = "sim-table-cell";
            if(j === i) {
                newCell.innerText = nums;//special cell
                newCell.className = "sim-table-cell liveCell"
            }
            if(i === -1) {
                newCell.innerText = "✖️";//unwanted cell
            }
            addCell(newSimRow, newCell);
            console.log("D.S.A.S: Building cell...");
        }
        addRow(simTable, newSimRow);
        console.log("D.S.A.S: Building row...");
        operationCount++;
        //find where the cell should go accordingly to the table
    })
    console.log("D.S.A.S: Building simulation: completed.");
    console.log("DEADCELL Found: " + darkSpellCount + " during total of " + operationCount + " operations.");
}
function addRow(simTable, simRow) {
    simTable.appendChild(simRow);
    document.body.style.height = (document.body.offsetHeight + 50) + 'px';//add 50px
}
function addCell(simRow, newCell) {
    simRow.appendChild(newCell);
}
function clearSimTable() {
    console.log("D.S.A.S: cleaning previous simulation...");
    // Remove all SVG elements (that contain drawed line :DD)
    document.querySelectorAll("line").forEach(line => line.remove());
    document.body.style.height = '100vh';
    // Remove the entire sim-table element
    const simTable = document.querySelector('#sim-table');
    if (simTable) {
        simTable.innerHTML = ""; // removes all children
        // simTable.remove(); //No because I want to reuse it and save time from create new one.
        //remove itself. I dont do innerHtml cáuse simtable is child to body, that mean rewrite full body html here without svg, lol NO, thank! :)
        console.log("D.S.A.S: removed sim-table and SVG elements.");
    } else {
        console.log("D.S.A.S: sim-table not found, probably first simulation.");
    }
    return simTable;
}
function getCapacity() {
    return document.getElementById('disk-track-capacity');
}
function getQueue() {
    //looking for the I/O queue
    return document.querySelector('#IO-request-queue');
}
function getHead() {
    return document.getElementById('initial-head');
}
function getCapacityMsg() {
    return document.getElementById('capacity-warning-message');
}
function getHeadMsg() {
    return document.getElementById('head-warning-message');
}
function getQueueMsg(){
    return document.getElementById('queue-warning-message');
}
function numberMapping(inputStr) {
    console.log("D.S.A.S: retriving I/O requests");
    // let a = (inputStr.match(/\d+/g) || []).map(Number);
    // console.log("mapped out: " + a[0]);
    return (inputStr.match(/\d+/g) || []).map(Number);
    //inputStr.match(/\d+/g) extracts all digit sequences (like 12, 99, 5) from any messy string.
    //trim() removes leading and trailing whitespace.
    //split(/\s+/) splits the string on one or more whitespace characters.
    //map(Number) converts each string in the array to a number.
}

function injectSVG(simTable){//inject to table
    simTable = document.querySelector('#sim-table');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Use actual body scroll size
    svg.setAttribute("style",
        `position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; z-index: 0;`
    );
    simTable.appendChild(svg);
    return svg;
}

function injectSVG(){//inject to body
    console.log('D.S.A.S: 🚧Attempt to inject an SVG...')
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        // Use actual body scroll size
    const pageWidth = Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth
    );
    const pageHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );
    svg.setAttribute("style",
        `position: absolute;
        top: 0; left: 0;
        width: ${pageWidth}px;
        height: ${pageHeight}px;
        pointer-events: none; z-index: 0;`
    );
    document.body.appendChild(svg);
    return svg;
}
function connectCell(svg) {
    console.log('D.S.A.S: 🚧Attempt to draw conntions onto SVG...')

    let liveCells = document.querySelectorAll(".liveCell");
    if (liveCells.length < 2) return;

    for (let i = 1; i < liveCells.length; i++) {
        const r1 = liveCells[i - 1].getBoundingClientRect();
        const r2 = liveCells[i].getBoundingClientRect();

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.classList.add("svg-simulated-line");

        line.setAttribute('x1', r1.left + r1.width / 2 + window.scrollX);
        line.setAttribute('y1', r1.top + r1.height / 2 + window.scrollY);
        line.setAttribute('x2', r2.left + r2.width / 2 + window.scrollX);
        line.setAttribute('y2', r2.top + r2.height / 2 + window.scrollY);

        svg.appendChild(line);
    }
}

/*--------------------------------------------------------------------------------------------*/
// Disk scheduling algorithms