function checkScriptLink() {
    return "📡Javascript index file linking to Algorithm file success."
}

function FCFS(queue) { // array of numbers
    addHead(queue);
    console.log(queue);

    if (queue.length < 2) {
        return 0;
    }

    let seekTime = 0;
    for (let i = 1; i < queue.length; i++) {
        seekTime += Math.abs(queue[i] - queue[i - 1]);
    }
    return seekTime;
}

function SSTF(queue) {
    addHead(queue);
    console.log(queue);

    let workQueue = queue.map(Number); // Ensure all elements are numbers
    let seekTime = 0;

    let current = getHead().value;  //got the head for starting point :)
    let resultOrder = [];

    while (workQueue.length > 0) {
        // Find the index of the request with the shortest seek time
        let closestIndex = 0;
        let minGap = Math.abs(current - workQueue[0]);

        for (let i = 1; i < workQueue.length; i++) {
            const gap = Math.abs(current - workQueue[i]);
            if (gap < minGap) {
                minGap = gap;
                closestIndex = i;
            }
        }

        const next = workQueue.splice(closestIndex, 1)[0];
        seekTime += Math.abs(current - next);
        resultOrder.push(next);
        current = next;
    }
    // Update original queue to reflect the new order
    queue.length = 0;
    queue.push(...resultOrder);

    return seekTime;
}

function SCAN(queue, isUp) {
    console.log("origin ↓");
    console.log(queue);
    touchUp(queue);
    removeDuplicates(queue);
    console.log("touched-up↓");
    console.log(queue);

    let workQueue = queue.map(Number); // Ensure all elements are numbers
    let seekTime = 0;

    let current = Number(getHead().value); //got the head for starting point :)
    let resultOrder = [];
    resultOrder.push(current); //or unshift, whaever...
    
    workQueue = workQueue.sort((a, b) => a - b);
    console.log("sorted ↓");
    console.log(workQueue);
    
    const start = workQueue.indexOf(current);
    
    let last = current;
    switch (isUp) {
        case true:
            for (let i = start+1; i < workQueue.length; i++) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            for (let i = start-1; i >= 0; i--) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            break; 
        case false:
            for (let i = start-1; i >= 0; i--) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            for (let i = start+1; i < workQueue.length; i++) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            break;
        default:
            break;
    }
    console.log(resultOrder);
    // Update original queue to reflect the new order
    queue.length = 0;
    queue.push(...resultOrder);

    return seekTime;
}
function CSCAN(queue, isUp) {
    console.log("origin ↓");
    console.log(queue);
    touchUp(queue);
    removeDuplicates(queue);
    console.log("touched-up↓");
    console.log(queue);

    let workQueue = queue.map(Number); // Ensure all elements are numbers
    let seekTime = 0;

    let current = Number(getHead().value); //got the head for starting point :)
    let resultOrder = [];
    resultOrder.push(current); //or unshift, whaever...
    
    workQueue = workQueue.sort((a, b) => a - b);
    console.log("sorted ↓");
    console.log(workQueue);
    
    const start = workQueue.indexOf(current);
    
    let last = current;
    switch (isUp) {
        case true:
            for (let i = start + 1; i < workQueue.length; i++) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            for (let i = 0; i < start; i++) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            break; 
        case false:
            for (let i = start - 1; i >= 0; i--) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            for (let i = workQueue.length - 1; i > start; i--) {
                const next = workQueue[i];
                seekTime += Math.abs(next - last);
                last = next;
                resultOrder.push(workQueue[i]);
            }
            break;
        default:
            break;
    }
    console.log(resultOrder);
    // Update original queue to reflect the new order
    queue.length = 0;
    queue.push(...resultOrder);

    return seekTime;
}