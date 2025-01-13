import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import EnhancedTableTest from './TableTest';
import axios from 'axios';
import { useGlobeId } from '../context/GlobeIdContext';
import { FindDistribution } from '../Function/FindDistribution';

const MainPage = () => {
  const { id, range,setRange } = useGlobeId();
  const [employeeData, setEmployeeData] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [selectedName,setSelectedName] = useState("");
  const [state, setState] = React.useState({
    series: [
      {
        name: "Score",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#0A3981"], // Custom color for the line
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Rank Trend by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
        title: {
          text: "Months", // Title for the x-axis
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          },
        },
      },
      yaxis: {
        min: 0, // Start y-axis at 0
        max: 100, // Set the maximum value to 100
        tickAmount: 4, // Divide y-axis into 4 intervals (0, 25, 50, 75, 100)
        labels: {
          formatter: (value) => value.toFixed(0), // Ensure labels are integers
        },
        title: {
          text: "Rank", // Title for the x-axis
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return `${value}`;
          },
        },
      },
    },
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/employees")
      .then((response) => {
        const distri = FindDistribution(response.data, id,setRange);
        setDistribution(distri);
        setEmployeeData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error); 
      });
  }, [id]);  
  useEffect(() => {
    if (id) {
      const selectedEmployee = employeeData.find(
        (employee) => employee.id === id
      );  
      if (selectedEmployee && selectedEmployee.ScoresOverMonths) {
        setState((prevState) => ({
          ...prevState,
          series: [
            {
              data: selectedEmployee.ScoresOverMonths,
            },
          ],
          options: {
            ...prevState.options,
              title: 
              {
                text:`Rank Trend by Month (${selectedEmployee.name})`
              },
          },
        }));
        setBarGraphStyle((prevState)=>({
          ...prevState,
          options:{
            ...prevState.options,
            title:
            {
              text:`Rank Distribution (${selectedEmployee.name})`
            }
          }
        }))
      }
    }
  }, [id, employeeData]);

  const rowData = employeeData.map(({ id, name, role, score }) => ({
    id,
    name,
    role,
    score,
  }));
const updateBarColors = () => {
  const resetColors = new Array(barGraphStyle.options.colors.length).fill(
    "#808080"
  );

  resetColors[range] = "#0A3981"; 

  setBarGraphStyle((prevState) => ({
    ...prevState,
    options: {
      ...prevState.options,
      colors: resetColors, 
    },
  }));
};

useEffect(() => {
  updateBarColors();
}, [range]);

const [barGraphStyle, setBarGraphStyle] = React.useState({
  series: [
    {
      data: [21, 22, 10, 28, 16, 21, 13, 30],
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        },
      },
    },
    title: {
      text: "Rank Distribution",
      align: "left",
    },
    colors: [
      "#808080",
      "#808080",
      "#808080",
      "#808080",
      "#808080",
      "#808080",
      "#808080",
      "#808080",
      "#808080",
      "#808080",
    ],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      style: {
        colors: ["#F8FAFC"],
        fontSize: "12px",
        fontWeight: "bold",
      },
      offsetY: -10,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        ["0-10"],
        ["11-20"],
        ["21-30"],
        ["31-40"],
        ["41-50"],
        ["51-60"],
        ["61-70"],
        ["71-80"],
        ["81-90"],
        ["91-100"],
      ],
      labels: {
        style: {
          colors: ["#808080"],
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
});

  useEffect(() => {
    setBarGraphStyle((prevState) => ({
      ...prevState,
      series: [
        {
          data: distribution, 
        },
      ]
    }));
  }, [distribution]);

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4 h-auto md:h-screen bg-[#D4EBF8]">
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3 h-full">
        <EnhancedTableTest rowData={rowData} />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3 h-full">
        <div className="text-2xl font-semibold">Rank Trend</div>
        <div className="mt-10">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="line"
            height={350}
          />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3 h-full">
        <div className="text-2xl font-semibold">Rank Distribution</div>
        <div className="mt-10">
          <ReactApexChart
            options={barGraphStyle.options}
            series={barGraphStyle.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
