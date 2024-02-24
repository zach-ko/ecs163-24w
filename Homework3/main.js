let abFilter = 25
const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = width/2.5, scatterTop = 0;
let scatterMargin = {top: 10, right: 30, bottom: 30, left: 60},
    scatterWidth = 600 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 400 - scatterMargin.top - scatterMargin.bottom;

let parallelLeft = width/2.5-50, parallelTop = 500;
let parallelMargin = {top: 10, right: 30, bottom: 30, left: 60},
    parallelWidth = 900 - parallelMargin.left - parallelMargin.right,
    parallelHeight = 400 - parallelMargin.top - parallelMargin.bottom;

let barLeft = 0, barTop = 0;
let barMargin = {top: 50, right: 30, bottom: 60, left: 100},
    barWidth = width/2.5 - barMargin.left - barMargin.right,
    barHeight = height - barMargin.top - barMargin.bottom;


d3.csv("ds_salaries.csv").then(rawData =>{
    console.log("rawData", rawData);
    
    rawData.forEach(function(d){
        d.remote_ratio = Number(d.remote_ratio);
        d.salary_in_usd = Number(d.salary_in_usd);
        d.work_year = Number(d.work_year);
        if(!(d.job_title === "Data Engineer") && !(d.job_title === "Data Scientist")){
            d.job_title = "Other";
        }
    });

//used for selecting data points later
var selectedData = rawData.map(x => x);
//time variables
var currTime = new Date();
var prevTime = new Date();
var prevTime1 = new Date();

    
    
//plot 1

    
    


    const svg = d3.select("svg")

    const g1 = svg.append("g")
                .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)

    

    // X ticks
    const x1 = d3.scaleLinear()
    .domain([d3.min(rawData, d => d.work_year), d3.max(rawData, d => d.work_year)])
    .range([scatterLeft, scatterLeft+scatterWidth])

    const xAxisCall = d3.axisBottom(x1)
                        .ticks(4)
    g1.append("g")
    .attr("transform", `translate(0, ${scatterHeight})`)
    .call(xAxisCall)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-40)")

    // Y ticks
    const y1 = d3.scaleLinear()
    .domain([0, 300000])
    .range([scatterHeight, 0])

    const yAxisCall = d3.axisLeft(y1)
                        .ticks(7)
    g1.append("g").call(yAxisCall)
                .attr("transform", `translate(${scatterLeft}, 0)`)

    const line = d3.line()
                .x(d => x1(d.date))
                .y(d => y1(d.average));

    // const line2 = d3.line()
    //             .x(d => x1(d.date))
    //             .y(d => y1(d.average));
    // let defaultData = [
    //                 { date: 2020, average: 0 },
    //                 { date: 2021, average: 0 },
    //                 { date: 2022, average: 0 },
    //                 { date: 2023, average: 0 }
    //               ];

    // g1.append("path")
    //               .datum(defaultData)
    //               .attr("class", "line")
    //               .attr('d', line1)
    //               .trans
    // g1.append("path")
    //               .datum(defaultData)
    //               .attr("class", "line")
    //               .attr('d', line2)
function update1(rawData, selectedData){
    var elapsed = currTime - prevTime1;

    if(elapsed <= 1000){
        return;
    }
    prevTime1 = new Date();
    
    let seData = selectedData.filter(d=>d.experience_level=='SE');
    let miData = selectedData.filter(d=>d.experience_level=='MI');
    let enData = selectedData.filter(d=>d.experience_level=='EN');
    let exData = selectedData.filter(d=>d.experience_level=='EX');

    let seAverages = seData.reduce((s, { work_year }) => (s[work_year] = (s[work_year] || 0) + 1, s), {});
    let miAverages = miData.reduce((s, { work_year }) => (s[work_year] = (s[work_year] || 0) + 1, s), {});
    let enAverages = enData.reduce((s, { work_year }) => (s[work_year] = (s[work_year] || 0) + 1, s), {});
    let exAverages = exData.reduce((s, { work_year }) => (s[work_year] = (s[work_year] || 0) + 1, s), {});

    seTotals = [0,0,0,0];
    miTotals = [0,0,0,0];
    enTotals = [0,0,0,0];
    exTotals = [0,0,0,0];
 
    

    selectedData.forEach(function(d){
        switch(d.experience_level){
            case "SE":
                seTotals[d.work_year-2020] += d.salary_in_usd;
                break;
            case "MI":
                miTotals[d.work_year-2020] += d.salary_in_usd;
                break;
            case "EN":
                enTotals[d.work_year-2020] += d.salary_in_usd;
                break;
            case "EX":
                exTotals[d.work_year-2020] += d.salary_in_usd;
                break;
        }
    });
    for(let i = 0; i<=4; i++){
        seAverages[i+2020] = seTotals[i]/seAverages[i+2020];
        miAverages[i+2020] = miTotals[i]/miAverages[i+2020];
        enAverages[i+2020] = enTotals[i]/enAverages[i+2020];
        exAverages[i+2020] = exTotals[i]/exAverages[i+2020];
    }
    
    
    var formattedSeAverages = Object.entries(seAverages).map(([date,average]) => ({
        date:date,
        average:average
    }))
    var formattedMiAverages = Object.entries(miAverages).map(([date,average]) => ({
        date:date,
        average:average
    }))
    var formattedEnAverages = Object.entries(enAverages).map(([date,average]) => ({
        date:date,
        average:average
    }))
    var formattedExAverages = Object.entries(exAverages).map(([date,average]) => ({
        date:date,
        average:average
    }))
    g1.selectAll("path").remove();
    g1.append("path")
       .datum(formattedSeAverages)
       .attr("fill", "none")
       .attr("stroke", "orange")
       .attr("stroke-width", 3)
       .attr("d", line);
    g1.append("path")
       .datum(formattedMiAverages)
       .attr("fill", "none")
       .attr("stroke", "blue")
       .attr("stroke-width", 3)
       .attr("d", line);
    g1.append("path")
       .datum(formattedEnAverages)
       .attr("fill", "none")
       .attr("stroke", "lightgreen")
       .attr("stroke-width", 3)
       .attr("d", line);
    g1.append("path")
       .datum(formattedExAverages)
       .attr("fill", "none")
       .attr("stroke", "red")
       .attr("stroke-width", 3)
       .attr("d", line);
    // g1.select('path')
    //     .datum(formattedSeAverages)
    //     .transition()
    //     .duration(1000) // Transition duration
    //     .attr('d', line1)
    //     .attr("fill", "none")
    //     .attr("stroke", "orange")
    //     .attr("stroke-width", 3)
    // g1.select('path')
    //     .datum(formattedMiAverages)
    //     .transition()
    //     .duration(1000) // Transition duration
    //     .attr('d', line2)
    //     .attr("fill", "none")
    //     .attr("stroke", "blue")
    //     .attr("stroke-width", 3)
    // var u1 = svg.selectAll(".line1")
    //     .data([formattedSeAverages], function(d){ return d.date });
        
    // u1.enter()
    //     .append("path")
    //     .attr("class","line1")
    //     .merge(u1)
    //     .transition()
    //     .duration(2000)
    //     .attr("d", d3.line()
    //         .x(function(d) { return x1(d.date); })
    //         .y(function(d) { return y1(d.average); }))
    //         .attr("fill", "none")
    //         .attr("stroke", "orange")
    //         .attr("stroke-width", 3)
}
update1(rawData, selectedData);
    //      const line = d3.line()
    //      .x(d => x1(d.date))
    //      .y(d => y1(d.average));

    // g1.append("path")
    //    .datum(formattedSeAverages)
    //    .attr("fill", "none")
    //    .attr("stroke", "orange")
    //    .attr("stroke-width", 3)
    //    .attr("d", line);
    // g1.append("path")
    //    .datum(formattedMiAverages)
    //    .attr("fill", "none")
    //    .attr("stroke", "blue")
    //    .attr("stroke-width", 3)
    //    .attr("d", line);
    // g1.append("path")
    //    .datum(formattedEnAverages)
    //    .attr("fill", "none")
    //    .attr("stroke", "lightgreen")
    //    .attr("stroke-width", 3)
    //    .attr("d", line);
    // g1.append("path")
    //    .datum(formattedExAverages)
    //    .attr("fill", "none")
    //    .attr("stroke", "red")
    //    .attr("stroke-width", 3)
    //    .attr("d", line);

    g1.append("text")
        .attr("x", scatterLeft+250)
        .attr("y", scatterHeight + 50)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Year")
    g1.append("text")
        .attr("x", -(scatterHeight / 2))
        .attr("y", scatterLeft-50)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text("Annual Salary")


    const legend1 = svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${scatterLeft+scatterWidth + 80}, 100)`);

    legend1.append("rect")
          .attr("x", 0)
          .attr("y", 3)
          .attr("width", 20)
          .attr("height", 4)
          .attr("fill", "red");

    legend1.append("text")
          .attr("x", 22)
          .attr("y", 10)
          .text("Executive Level");

    legend1.append("rect")
          .attr("x", 0)
          .attr("y", 23)
          .attr("width", 20)
          .attr("height", 4)
          .attr("fill", "orange");

    legend1.append("text")
          .attr("x", 22)
          .attr("y", 30)
          .text("Senior Level");

    legend1.append("rect")
          .attr("x", 0)
          .attr("y", 43)
          .attr("width", 20)
          .attr("height", 4)
          .attr("fill", "blue");

    legend1.append("text")
          .attr("x", 22)
          .attr("y", 50)
          .text("Mid Level");

    legend1.append("rect")
          .attr("x", 0)
          .attr("y", 63)
          .attr("width", 20)
          .attr("height", 4)
          .attr("fill", "lightgreen");

    legend1.append("text")
          .attr("x", 22)
          .attr("y", 70)
          .text("Entry Level");

//space
    

    let countryCounts = rawData.reduce((s, { employee_residence }) => (s[employee_residence] = (s[employee_residence] || 0) + 1, s), {});
    

    const formattedCounts = Object.entries(countryCounts).map(([country,count]) => ({
        country:country,count:count
    }))
 
    let countryTotals = [];
    for (let i = 0; i<formattedCounts.length; i++){
        let map = [];
        map["country"] = formattedCounts[i].country;
        map["count"] = formattedCounts[i].count
        map["experience_level"] =0;
        map["salary"]=0;
        map["remote_ratio"]=0;
        map["data_engineer"]=0;
        map["data_scientist"]=0;
        countryTotals.push(map);
    }
        
    //remove countries with only one data point
    countryTotals = countryTotals.filter(d=>d.count>=10);
  
    rawData.forEach(function(d){
        for (let i=0;i<countryTotals.length;i++){
            if(d.employee_residence===countryTotals[i].country){
                switch(d.experience_level){
                    case "EN":
                        countryTotals[i].experience_level+=1;
                        break;
                    case "MI":
                        countryTotals[i].experience_level+=2;
                        break;
                    case "SE":
                        countryTotals[i].experience_level+=3;
                        break;
                    case "EX":
                        countryTotals[i].experience_level+=4;
                        break;
                }
                countryTotals[i].salary+=d.salary_in_usd;
                countryTotals[i].remote_ratio+=d.remote_ratio;
                if(d.job_title==="Data Engineer")countryTotals[i].data_engineer+=1;
                if(d.job_title=="Data Scientist")countryTotals[i].data_scientist+=1;
                continue;
            }
        }
    });
    for(let i=0; i<countryTotals.length;i++){
        countryTotals[i].experience_level = countryTotals[i].experience_level/countryTotals[i].count;
        countryTotals[i].salary = countryTotals[i].salary/countryTotals[i].count;
        countryTotals[i].remote_ratio = countryTotals[i].remote_ratio/countryTotals[i].count;
        countryTotals[i].data_engineer = countryTotals[i].data_engineer/countryTotals[i].count*100;
        countryTotals[i].data_scientist = countryTotals[i].data_scientist/countryTotals[i].count*100;
    }
    console.log(countryTotals);

    const g2 = svg.append("g")
                .attr("width", parallelWidth + parallelMargin.left + parallelMargin.right)
                .attr("height", parallelHeight + parallelMargin.top + parallelMargin.bottom)
                .attr("transform", `translate(${parallelLeft}, ${parallelTop})`)
    
    let dimensions = d3.keys(countryTotals[0]).filter(function(d){return d!="country" && d!="count"});
    y2 = {};
    for (let i=0; i<dimensions.length; i++){
        y2[dimensions[i]] = d3.scaleLinear()
                .domain( d3.extent(countryTotals, function(d) { return +d[dimensions[i]]; }) )
                .range([parallelHeight, 0])
    }
    x2 = d3.scalePoint()
                .range([0, parallelWidth])
                .padding(1)
                .domain(dimensions);
    function path(d) {
        return d3.line()(dimensions.map(function(p) { return [x2(p), y2[p](d[p])]; }));
    }
    g2.selectAll("path")
                .data(countryTotals)
                .enter().append("path")
                .attr("d",  path)
                .style("fill", "none")
                .style("stroke", "purple")
                .style("stroke-width", 3)
                .style("opacity", 0.6)

    let labels = {experience_level:"Average Experience Level", salary:"Average Salary", remote_ratio:"Percent Remote", data_engineer:"Percent Data Engineers", data_scientist:"Percent Data Scientists"};
    g2.selectAll("axis")
                .data(dimensions).enter()
                .append("g")
                .attr("transform", function(d) { return "translate(" + x2(d) + ")"; })
                .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y2[d])); })
                .append("text")
                    .style("text-anchor", "middle")
                    .attr("y", -10)
                    .attr("font-size", 12)
                    .text(function(d) { return labels[d]; })
                    .style("fill", "black")
//plot 3

var g3 = svg.append("g")
    .attr("width", barWidth + barMargin.left + barMargin.right)
    .attr("height", barHeight + barMargin.top + barMargin.bottom)
    .attr("transform", `translate(${barLeft+barMargin.left}, ${barTop+barMargin.top})`)

    
// Add X axis
var x3 = d3.scaleLog()
                .domain([1000,100000000])
                .range([barLeft, barLeft+barWidth]);
g3.append("g")
                .attr("transform", "translate(0," + barHeight + ")")
                .call(d3.axisBottom(x3));
g3.append("text")
                .attr("x", (barWidth / 2))
                .attr("y", barHeight+40)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .text("Salary")
// Add Y axis
var y3 = d3.scaleLinear()
                .domain([d3.min(rawData, d => d.salary_in_usd), d3.max(rawData, d => d.salary_in_usd)])
                .range([ barHeight+barTop, barTop]);
g3.append("g")
                .call(d3.axisLeft(y3));
g3.append("text")
                .attr("x", -(barHeight / 2))
                .attr("y", -50)
                .attr("font-size", "20px")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .text("Salary In USD")
// Add dots
var circles = g3.selectAll("circle")
                .data(rawData)
                .enter()
                .append("circle")
                .attr("cx", function (d) { return x3(d.salary); } )
                .attr("cy", function (d) { return y3(d.salary_in_usd); } )
                .attr("r", 1.5)
                .style("fill", "#69b3a2")
update3(rawData, selectedData);
function update3(data, selectedData){
    svg.selectAll("circle")
        .data(data)
        .attr("cx", function (d) { return x3(d.salary); } )
        .attr("cy", function (d) { return y3(d.salary_in_usd); } )
        .attr("r", 1.5)
        .style("fill", "#69b3a2")
    svg.selectAll("circle")
        .data(selectedData)
        .attr("cx", function (d) { return x3(d.salary); } )
        .attr("cy", function (d) { return y3(d.salary_in_usd); } )
        .attr("r", 2)
        .style("fill", "black")
    
    
    // circles = g3.selectAll("circle")
    //             .data(data)
    //             .enter()
    //             .append("circle")
    //             .attr("cx", function (d) { return x3(d.salary); } )
    //             .attr("cy", function (d) { return y3(d.salary_in_usd); } )
    //             .attr("r", 1.5)
    //             .style("fill", "#69b3a2")
    // circles += g3.selectAll("circle")
    //             .data(selectedData)
    //             .enter()
    //             .append("circle")
    //             .attr("cx", function (d) { return x3(d.salary); } )
    //             .attr("cy", function (d) { return y3(d.salary_in_usd); } )
    //             .attr("r", 2)
    //             .style("fill", "black")
}




svg
                .call(d3.brush()
                .extent([[barLeft+barMargin.left, barTop+barMargin.top], [barLeft+barMargin.left+barWidth, barTop+barHeight+barMargin.top]])
                .on("start brush", updateCharts))

//redraw updated charts every half second
const intervalId = setInterval(redrawCharts, 500);

function updateCharts() {
    region = d3.event.selection;
    selectedData = selectData(region, x3, y3);
    redrawCharts();
}

function selectData(region, x, y){
    var xmin = region[0][0] - barMargin.left,
        xmax = region[1][0] - barMargin.left,
        ymin = region[0][1] - barMargin.top,
        ymax = region[1][1] - barMargin.top;
        return rawData.filter(d => xmin <= x(d.salary) && x(d.salary) < xmax && ymin <= y(d.salary_in_usd) && y(d.salary_in_usd) < ymax);
}

function redrawCharts(){
        currTime = new Date();
        var elapsed = currTime - prevTime;
        prevTime = currTime;
        if(elapsed <= 100){ //ms
            return;
        } 
        update3(rawData, selectedData);
        update1(rawData, selectedData);
}

// g3.call(d3.brush().on("start brush end", ({selection}) => {
//     let value = [];
//     if (selection) {
//       const [[x0, y0], [x1, y1]] = selection;
//       value = dot
//         .style("fill", "#69b3a2")
//         .filter(d => x0 <= x3(d.salary) && x3(d.salary) < x1
//                 && y0 <= y3(d.salary_in_usd) && y3(d.salary_in_usd) < y1)
//         .style("fill", "steelblue")
//         .data();
//     } else {
//       dot.style("fill", "#69b3a2");
//     }

//     // Inform downstream cells that the selection has changed.
//     svg.property("value", value).dispatch("input");
// }));



    // var subgroups = ["Small", "Medium", "Large"];

    // var dataSmall = rawData.filter(d=>d.company_size=='S');
    // var dataMed = rawData.filter(d=>d.company_size=='M');
    // var dataLarge = rawData.filter(d=>d.company_size=='L');
    
    // var smallTitles = dataSmall.reduce((s, { job_title }) => (s[job_title] = (s[job_title] || 0) + 1, s), {});
    // var medTitles = dataMed.reduce((s, { job_title }) => (s[job_title] = (s[job_title] || 0) + 1, s), {});
    // var largeTitles = dataLarge.reduce((s, { job_title }) => (s[job_title] = (s[job_title] || 0) + 1, s), {});

    // smallTitles["category"] = "S";
    // medTitles["category"] = "M";
    // largeTitles["category"] = "L";

    // const dataSummary = [smallTitles, medTitles, largeTitles];


    // console.log(dataSummary);
    
    // const g3 = svg.append("g")
    //             .attr("width", barWidth + barMargin.left + barMargin.right)
    //             .attr("height", barHeight + barMargin.top + barMargin.bottom)
    //             .attr("transform", `translate(${barMargin.left}, ${barTop})`)
    
    // const x = d3.scaleBand()
    //             .domain(dataSummary.map(d => d.category))
    //             .range([barLeft, barWidth])
    //             .padding(0.1);

    // const y = d3.scaleLinear()
    //             .domain([0, d3.max(dataSummary, d => Math.max(d["Data Scientist"], d["Data Engineer"], d["Other"]))])
    //             .nice()
    //             .range([barHeight, barTop+barMargin.top]);

    
                
    // g3.selectAll("bar1")
    //             .data(dataSummary)
    //             .enter()
    //             .append("rect")
    //             .attr("class", "bar1")
    //             .attr("x", d => x(d.category))
    //             .attr("y", d => y(d["Data Scientist"]))
    //             .attr("width", x.bandwidth() / 3)
    //             .attr("height", d => barHeight - y(d["Data Scientist"]))
    //             .attr("fill", "steelblue");

    // g3.selectAll("bar2")
    //             .data(dataSummary)
    //             .enter()
    //             .append("rect")
    //             .attr("class", "bar2")
    //             .attr("x", d => x(d.category) + x.bandwidth() / 3)
    //             .attr("y", d => y(d["Data Engineer"]))
    //             .attr("width", x.bandwidth() / 3)
    //             .attr("height", d => barHeight - y(d["Data Engineer"]))
    //             .attr("fill", "orange");

    // g3.selectAll("bar3")
    //             .data(dataSummary)
    //             .enter()
    //             .append("rect")
    //             .attr("class", "bar3")
    //             .attr("x", d => x(d.category) + 2*x.bandwidth() / 3)
    //             .attr("y", d => y(d.Other))
    //             .attr("width", x.bandwidth() / 3)
    //             .attr("height", d => barHeight - y(d.Other))
    //             .attr("fill", "green");

    // g3.append("g")
    //             .attr("class", "x-axis")
    //             .attr("transform", `translate(0,${barHeight})`)
    //             .call(d3.axisBottom(x));

    // g3.append("g")
    //             .attr("class", "y-axis")
    //             .call(d3.axisLeft(y));

    // g3.append("text")
    //             .attr("x", barWidth / 2)
    //             .attr("y", barHeight + 50)
    //             .attr("font-size", "20px")
    //             .attr("text-anchor", "middle")
    //             .text("Company Size")
    // g3.append("text")
    //             .attr("x", -(barHeight / 2))
    //             .attr("y", -40)
    //             .attr("font-size", "20px")
    //             .attr("text-anchor", "middle")
    //             .attr("transform", "rotate(-90)")
    //             .text("Number of Employees")

    // const legend3 = svg.append("g")
    //             .attr("class", "legend")
    //             .attr("transform", `translate(${barWidth - 50}, 100)`);

    // legend3.append("rect")
    //       .attr("x", 0)
    //       .attr("y", 0)
    //       .attr("width", 10)
    //       .attr("height", 10)
    //       .attr("fill", "steelblue");

    // legend3.append("text")
    //       .attr("x", 15)
    //       .attr("y", 10)
    //       .text("Data Scientist");

    // legend3.append("rect")
    //       .attr("x", 0)
    //       .attr("y", 20)
    //       .attr("width", 10)
    //       .attr("height", 10)
    //       .attr("fill", "orange");

    // legend3.append("text")
    //       .attr("x", 15)
    //       .attr("y", 30)
    //       .text("Data Engineer");

    // legend3.append("rect")
    //       .attr("x", 0)
    //       .attr("y", 40)
    //       .attr("width", 10)
    //       .attr("height", 10)
    //       .attr("fill", "green");

    // legend3.append("text")
    //       .attr("x", 15)
    //       .attr("y", 50)
    //       .text("Other");
















}).catch(function(error){
    console.log(error);
});

