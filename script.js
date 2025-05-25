/*--------------------------------------------------------------------------------------------*/
//interface setup
let pageStartUp = 1;
// const warningElements = document.querySelectorAll(".onscreen-warning-message");
// warningElements.forEach(element => {
//     element.style.opacity = "0";
// });
const trackCapacityInput = document.getElementById('disk-track-capacity');
const initialHeadInput = document.getElementById('initial-head');
const requestQueueInput = document.getElementById('IO-request-queue');

const capacityWarning = document.getElementById('capacity-warning-message');
const headWarning = document.getElementById('head-warning-message');
const queueWarning = document.getElementById('queue-warning-message');

clear(capacityWarning);
clear(headWarning);
clear(queueWarning);


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
//eventListeners setup
console.log("D.S.A.S: Page enter function...");

/*--------------------------------------------------------------------------------------------*/
window.addEventListener("load", () => {
    const input = document.getElementById("disk-track-capacity");
    input.focus(); //default focused field
    console.log("D.S.A.S: Defaultly focused input field: Set.");
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
function runSimulation() {
    const trackCapacityInput = document.getElementById('disk-track-capacity');
    const initialHeadInput = document.getElementById('initial-head');
    const requestQueueInput = document.getElementById('IO-request-queue');

    const capacityWarning = document.getElementById('capacity-warning-message');
    const headWarning = document.getElementById('head-warning-message');
    const queueWarning = document.getElementById('queue-warning-message');
    //Validation
    if (!validateInput(trackCapacityInput,capacityWarning) ||
        !validateInput(initialHeadInput, headWarning) ||
        !validateInput(requestQueueInput, queueWarning))
    {
        return;
    }
    //mapping the string
    let mappedQueue = numberMapping(getQueue().value);//is an array
    //sort the array
    const fullArray = Array.from({ length: 200 }, (_, i) => i);
    const selected15 = fullArray.sort(() => Math.random() - 0.5).slice(0, 27);
    const orderedTestArray = [...selected15].sort((a, b) => a - b);
    const shuffledTestArray = [...selected15].sort(() => Math.random() - 0.5);
    
    let sortedQueue = orderedTestArray;//temporary
    //Run the simulator algorithm for a result array
    const simulatedQueue = shuffledTestArray;//temporary
    //Build simulation
    console.log("D.S.A.S: Simulation process commited.");
    constructSimTable(sortedQueue, simulatedQueue, clearSimTable());//clean previous table aswell
    let svg = document.querySelectorAll("svg");
    if(svg.length === 0){
        connectCell(injectSVG());
    }else{
        connectCell(svg[0]);
    }
    // extend web height, in case of small simulation so it have chance to sit in the middle instead of bottom.
    if(pageStartUp === 1){
        document.body.style.height = (document.body.offsetHeight * 1.1) + 'px';
        console.log("D.S.A.S: Stretch web's height by 10%.");
        pageStartUp = 2;
    }
}
function validateInput(input, message){
    //reset
    clear(message);
    // Check each input
    if (input.value.trim() === '') {
        message.textContent = 'Field is required.';
        return false;
    }
    return true;
}
function existInput(input, message) {

}
function clear(obj) {
    obj.textContent='';
}
function constructSimTable(sortedQueue, simulatedQueue, simTable) {
    let darkSpellCount = 0;
    let operationCount = 0;
    //add the header row for the table
    const headerRow = document.createElement('DIV');
    headerRow.className = "sim-row sim-header-row";
        //add the cell for the row
    sortedQueue.forEach(nums => {//need to be replaced with a sorted queue
        const newCell = document.createElement('DIV');
        
        newCell.className = "sim-table-cell";
        newCell.innerText = nums;
        newCell.style.height = "50px";
        headerRow.appendChild(newCell);
        console.log("D.S.A.S: Building head cell...");
    });
    simTable.appendChild(headerRow);//add it all at once
    console.log("D.S.A.S: Building head row...");
    //add the simulated rows
    let i;
        //add row of cells for every values in simulated queue.
        simulatedQueue.forEach(nums => {
        i = sortedQueue.indexOf(nums);
        console.log("DEBUG>>current cell is " + nums + " and its index:" + i);
        
        if(i === -1){
            alert("⚠️ Warning: DEADCELL!\nDetail: One of the value in the simulated queue was not originally exist in the inputed queue.\nResult: One of the simulated row will be marked with an ✖️ instead of ⭕");
            darkSpellCount++;
            console.log("Warning: ⚠️ DEADCELL detected! ⚠️");
        }

        let newSimRow = document.createElement('DIV');
        newSimRow.className = "sim-row";
        
        for (let j = 0; j < simulatedQueue.length; j++) {
            const newCell = document.createElement('DIV');
            newCell.className = "sim-table-cell";
            if(j === i) {
                newCell.innerText = nums;//special cell
                newCell.className = "sim-table-cell liveCell"
            }
            if(i === -1) {
                newCell.innerText = "✖️";//unwanted cell
            }
            newSimRow.appendChild(newCell);
            console.log("D.S.A.S: Building cell...");
        }
        simTable.appendChild(newSimRow);
        console.log("D.S.A.S: Building row...");
        operationCount++;
        //find where the cell should go accordingly to the table
    })
    console.log("D.S.A.S: Building simulation: completed.");
    console.log("DEADCELL Found: " + darkSpellCount + " during total of " + operationCount + " operations.");
}
function clearSimTable() {
    console.log("D.S.A.S: cleaning previous simulation...");
    // Remove all SVG elements (that contain drawed line :DD)
    document.querySelectorAll("line").forEach(line => line.remove());

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

function getQueue() {
    //looking for the I/O queue
    return document.querySelector('#IO-request-queue');
}

function numberMapping(inputStr) {
    console.log("D.S.A.S: retriving I/O requests");
    return inputStr.trim().split(/\s+/).map(Number);
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
    let liveCells = document.querySelectorAll(".liveCell");
    if (liveCells.length < 2) return;

    for (let i = 1; i < liveCells.length; i++) {
        const r1 = liveCells[i - 1].getBoundingClientRect();
        const r2 = liveCells[i].getBoundingClientRect();

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("stroke", "red");
        line.setAttribute("stroke-width", "2");

        line.setAttribute('x1', r1.left + r1.width / 2 + window.scrollX);
        line.setAttribute('y1', r1.top + r1.height / 2 + window.scrollY);
        line.setAttribute('x2', r2.left + r2.width / 2 + window.scrollX);
        line.setAttribute('y2', r2.top + r2.height / 2 + window.scrollY);

        svg.appendChild(line);
    }
}

/*--------------------------------------------------------------------------------------------*/
// Disk scheduling Algorythms