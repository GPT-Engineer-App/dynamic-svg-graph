document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = d3.csvParse(e.target.result);
            populateDropdowns(data.columns);
            drawChart(data);
        };
        reader.readAsText(file);
    }
}

function populateDropdowns(columns) {
    const xAxis = document.getElementById('xAxis');
    const yAxis = document.getElementById('yAxis');
    const category = document.getElementById('category');
    const series = document.getElementById('series');

    columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column;
        option.text = column;
        xAxis.appendChild(option.cloneNode(true));
        yAxis.appendChild(option.cloneNode(true));
        category.appendChild(option.cloneNode(true));
        series.appendChild(option.cloneNode(true));
    });
}

function drawChart(data) {
    const svg = d3.select("#chart").append("svg")
        .attr("width", 800)
        .attr("height", 400);

    const xAxis = document.getElementById('xAxis').value;
    const yAxis = document.getElementById('yAxis').value;
    const category = document.getElementById('category').value;
    const series = document.getElementById('series').value;

    const groupedData = d3.groups(data, d => d[category]);

    const x = d3.scaleBand()
        .domain(groupedData.map(d => d[0]))
        .range([0, 800])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(groupedData, d => d3.sum(d[1], d => +d[yAxis]))])
        .nice()
        .range([400, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    svg.append("g")
        .selectAll("g")
        .data(groupedData)
        .enter().append("g")
        .attr("transform", d => `translate(${x(d[0])},0)`)
        .selectAll("rect")
        .data(d => d[1])
        .enter().append("rect")
        .attr("x", d => x(d[xAxis]))
        .attr("y", d => y(d[yAxis]))
        .attr("width", x.bandwidth())
        .attr("height", d => 400 - y(d[yAxis]))
        .attr("fill", d => color(d[series]));

    svg.append("g")
        .attr("transform", "translate(0,400)")
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
}