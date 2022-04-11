{
    const apiID = '0a5befcc';
    const apiKey = '636e5e3d0dbae70083676e8b0c8a799f';

    // get data from dropdown menu
    let city = '';
    function handleOnChange(e) {
        city = e.value;
    }

    // const keyword = 'javascript';

    // let resultArr = [];
    document.querySelector('.btn').addEventListener('click', () => {
        // delete current result data
        const card = document.querySelectorAll('.blog-card');
        card.forEach((data) => {
            data.remove();
        });
        const chart = document.querySelector('svg');
        chart.remove();
        const jobN = document.querySelector('.jobN');
        jobN.innerText = '';
        const meanSal = document.querySelector('.meanSal');
        meanSal.innerText = '';

        // get the keyword text
        const keyword = document.getElementById('search-bar-keyword').value;
        console.log(keyword);

        fetch(
            `http://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${apiID}&app_key=${apiKey}&results_per_page=50&what=${keyword}&content-type=application/json`
        )
            .then((response) => response.json())
            .then((json) => {
                // searched data by keyword and city
                result = json.results.filter((data) => {
                    return data['location']['area'].indexOf(city) > 0;
                });
                console.log(result);

                // job title data
                const jobTitle = result.map((job) => {
                    return job.title;
                });
                // console.log(jobTitle);

                // job ads created date
                const jobDate = result.map((job) => {
                    return job.created.substr(0, 10);
                });
                // console.log(jobDate);

                // job title data
                const jobDesc = result.map((job) => {
                    return job.description;
                });
                // console.log(jobDesc);

                // Job ads links
                const jobLinks = result.map((job) => {
                    return job.redirect_url;
                });
                // console.log(jobLinks);

                // count of job posting
                const jobNum = json.count;
                // console.log(jobNum);
                document.querySelector(
                    '.jobN'
                ).innerText = `Total Number of ${keyword} Job Ads : ${jobNum}`;
                // resultArr.push([jobNum]);

                // mean of salary
                let meanArr = [];
                let sum = 0;
                result.map((data) => {
                    const meanValue = (data.salary_min + data.salary_max) / 2;
                    if (meanValue) meanArr.push(meanValue);
                    sum = 0;
                    for (let i = 0; i < meanArr.length; i++) {
                        sum = sum + meanArr[i];
                    }
                });
                const meanSalary = sum / meanArr.length;
                console.log(meanArr);
                console.log(meanSalary);
                if (meanSalary) {
                    document.querySelector(
                        '.meanSal'
                    ).innerText = `Mean Salary of ${keyword} Job Ads : $${meanSalary}`;
                }
                // if (!meanSalary) resultArr[resultArr.length - 1][1] = 0;
                // else resultArr[resultArr.length - 1][1] = meanSalary;

                for (let i = 0; i < jobTitle.length; i++) {
                    const jobData = document.getElementById('job_data');
                    const newDiv = document.createElement('div');
                    // add div tag with blog-card class name
                    jobData.appendChild(newDiv);
                    const cardDiv = jobData.lastChild;
                    cardDiv.classList.add('blog-card');

                    // add div tag with description class name and h1,h2 tag
                    const newDiv2 = document.createElement('div');
                    cardDiv.appendChild(newDiv2);
                    const descDiv = cardDiv.lastChild;
                    descDiv.classList.add('description');
                    descDiv.innerHTML = `<h1>${jobTitle[i]}</h1>`;
                    const newh3 = document.createElement('h3');
                    descDiv.appendChild(newh3);
                    descDiv.lastChild.innerText = `${jobDate[i]}`;

                    // Add p tag
                    const newP = document.createElement('p');
                    descDiv.appendChild(newP);
                    descDiv.lastChild.innerText = `${jobDesc[i]}`;
                    const newP2 = document.createElement('p');
                    descDiv.appendChild(newP2);
                    const lastP = descDiv.lastChild;
                    lastP.classList.add('read-more');
                    lastP.innerHTML = `<a href="${jobLinks[i]}" target="_blank">Job ads</a>`;
                }
                // console.log(resultArr);
            });

        // histogram of salary
        fetch(
            `https://api.adzuna.com/v1/api/jobs/ca/histogram?app_id=${apiID}&app_key=${apiKey}&what=${keyword}`
        )
            .then((response) => response.json())
            .then((json) => {
                console.log(json['histogram']);

                // ================================================
                // d3.js library for bar chart
                // https://github.com/kriscfoster/d3-barchart/blob/master/index.html

                document.querySelector(
                    '.histogram'
                ).innerText = `Histogram of ${keyword} Job Ads`;

                const jobHisto = json['histogram'];
                const data = Object.entries(jobHisto);

                const width = 700;
                const height = 450;
                const margin = { top: 50, bottom: 50, left: 50, right: 50 };

                // find maximum value of histogram
                let maxValue = 0;
                for (let i = 0; i < data.length; i++) {
                    if (maxValue < data[i][1]) maxValue = data[i][1] + 10;
                }

                const svg = d3
                    .select('#d3-container')
                    .append('svg')
                    .attr('width', width - margin.left - margin.right)
                    .attr('height', height - margin.top - margin.bottom)
                    .attr('viewBox', [0, 0, width, height]);

                const x = d3
                    .scaleBand()
                    .domain(d3.range(data.length))
                    .range([margin.left, width - margin.right])
                    .padding(0.1);

                const y = d3
                    .scaleLinear()
                    .domain([0, maxValue])
                    .range([height - margin.bottom, margin.top]);

                svg.append('g')
                    .attr('fill', 'royalblue')
                    .selectAll('rect')
                    .data(data)
                    .join('rect')
                    .attr('x', (d, i) => x(i))
                    .attr('y', (d) => y(d[1]))
                    .attr('title', (d) => d[1])
                    .attr('class', 'rect')
                    .attr('height', (d) => y(0) - y(d[1]))
                    .attr('width', x.bandwidth());

                function yAxis(g) {
                    g.attr('transform', `translate(${margin.left}, 0)`)
                        .call(d3.axisLeft(y).ticks(null, data.format))
                        .attr('font-size', '15px');
                }

                function xAxis(g) {
                    g.attr(
                        'transform',
                        `translate(0,${height - margin.bottom})`
                    )
                        .call(d3.axisBottom(x).tickFormat((i) => data[i][0]))
                        .attr('font-size', '15px');
                }

                svg.append('g').call(xAxis);
                svg.append('g').call(yAxis);
                svg.node();
            });
    });
}
