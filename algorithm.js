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
