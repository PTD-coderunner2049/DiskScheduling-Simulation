function checkScriptLink() {
    return "📡Javascript index file linking to Algorithm file success."
}

function FCFS(queue) { // array of numbers
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
    let workQueue = queue.map(Number); // Ensure all elements are numbers
    let current = workQueue.shift();   // Start from the first request
    let seekTime = 0;
    const resultOrder = [];
    resultOrder.unshift(current);

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



