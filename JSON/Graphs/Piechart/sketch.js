let colors = ["#61BC67", "#FCA33D", "#5FA3DC", "#C2D94C", "#F25858", "#234567", "#DFCF40", "#710AD2", "#B277E2", "#F974B1", "#B2902A"]
let names = [];
let percentages = [],
    youtube

function preload() {
    youtube = loadJSON("./youtube.json"); // [[username, percentage],[username, percentage]] 
    console.log(youtube);
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    for(let i in youtube){
        percentages.push(youtube[i][1]);
        names.push(youtube[i][0]);
    };
    
}

function draw() {
    pieChart(700, names);
}

function pieChart(diameter, data) {
    let angles = percentages.map(function(percentage) {
        return (percentage / 100) * 360;
    });
    console.log(percentages);
    let lastAngle = 0;
    let pos = names.length * 65;
    background("#0A0E14")
    for (let i = 0; i < data.length; i++) {

        fill(colors[i]);
        arc(
            width / 2 - 400,
            height / 2,
            diameter,
            diameter,
            lastAngle,
            lastAngle + radians(angles[i])
        );
        //todo: here i'll actually draw the users with the colors they corrospond to
        noStroke();
        //! Names;
        textSize(25);
        text(percentages[i] + "%" + "   -     " + names[i], width / 2 + 200, (height - height / names.length) - pos + 10);
        fill(colors[i]);
        pos -= 65;
        //! Colors

        rect(width / 2 + 90, (height - height / names.length) - pos - 112.5 + 10, 10, 60);

        lastAngle += radians(angles[i]);
    }
    noLoop()
}