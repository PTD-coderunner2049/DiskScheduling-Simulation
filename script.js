// let ioQueue = [1, 2, 3, 4, 5, 6, 7, 8, 9];
function runSimulation() {
    //mapping the string
    let mappedQueue = numberMapping(getQueue().value);//is an array
    //sort the array
    let sortedQueue = [1, 2, 3, 4, 5, 6, 7, 8, 9];//temporary
    //Run the simulator algorithm for a result array
    const simulatedQueue = [8, 2, 3, 5, 6, 4, 7, 1, 9];//temporary
    //Build simulation
    constructSimTable(sortedQueue, simulatedQueue, clearSimTable());
}

function constructSimTable(queue, simulatedQueue, simTable) {
    //add the header row for the table
    const headerRow = document.createElement('DIV');
    headerRow.className = "sim-row sim-header-row";
        //add the cell for the row
    queue.forEach(nums => {//need to be replaced with a sorted queue
        const newCell = document.createElement('DIV');
        
        newCell.className = "sim-table-cell";
        newCell.innerText = nums;
        
        headerRow.appendChild(newCell);
    });
    simTable.appendChild(headerRow);//add it all at once
    
    //add the simulated rows
    let i;
        //add row of cells for every values in simulated queue.
    simulatedQueue.forEach(nums => {
        
        i = queue.indexOf(nums);
        
        if(i === -1){
            alert("⚠️ Warning: Dark magic!\nDetail: One of the value in the simulated queue was not originally exist in the inputed queue.\nResult: One of the simulated row will be marked with an ✖️ instead of ⭕");
        }
        let newSimRow = document.createElement('DIV');
        newSimRow.className = "sim-row";
        
        for (let j = 0; j < simulatedQueue.length; j++) {
            const newCell = document.createElement('DIV');
            newCell.className = "sim-table-cell";
            if(i === j) {
                newCell.innerText = "⭕";//special cell
            }
            if(i === -1) {
                newCell.innerText = "✖️";//unwanted cell
            }
            newSimRow.appendChild(newCell);
        }
        simTable.appendChild(newSimRow);
        //find where the cell should go accordingly to the table
    })


}
function clearSimTable() {
    const simTable = document.querySelector('#sim-table');
    simTable.innerHTML = ""; // removes all children
    return simTable;
}
function getQueue() {
    //looking for the I/O queue
    return document.querySelector('#IO-request-queue');
}
function numberMapping(inputStr) {
    return inputStr.trim().split(/\s+/).map(Number);
    //trim() removes leading and trailing whitespace.
    //split(/\s+/) splits the string on one or more whitespace characters.
    //map(Number) converts each string in the array to a number.
}