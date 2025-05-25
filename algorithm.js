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
    const numericQueue = queue.map(Number); // Convert all values to numbers
    const closest = [];

    // Clone the numericQueue to a working copy we will mutate
    let workQueue = [...numericQueue];

    // Start from the first element (or pick a custom head if desired)
    let current = workQueue.shift(); // pick and remove the first element
    workQueue.unshift(current);
    while (workQueue.length > 0) {
        let minGap = Infinity;
        let nextIndex = -1;

        for (let i = 0; i < workQueue.length; i++) {
            const gap = Math.abs(current - workQueue[i]);
            if (gap < minGap) {
                minGap = gap;
                nextIndex = i;
            }
        }

        const next = workQueue.splice(nextIndex, 1)[0]; // Remove and get next
        closest.push({ current, closest: next });
        current = next; // Update current to continue
    }
    // Count seektime
    let seekTime = 0;
    for (let i = 0; i < closest.length; i++) {
        const a = Number(closest[i].current);
        const b = Number(closest[i].closest);
        seekTime += Math.abs(a - b);
    }

    // Overwrite original queue with result (as objects showing movement)
    queue.length = 0; // Clear original queue
    queue.push(...closest.map(pair => pair.closest)); // Replace with final order if desired
    return seekTime; // Always return true
}


