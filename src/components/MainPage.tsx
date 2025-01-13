import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import EnhancedTableTest from './TableTest';
import axios from 'axios';
import { useGlobeId } from '../context/GlobeIdContext';
import { ApexOptions } from "apexcharts";

const { FindDistribution } = require("../Function/FindDistribution") as {
  FindDistribution: (
    employeeData: { id: number; score: number }[],
    id: number | null,
    setRange: (range: number | null) => void,
    distriIds: number[][] | null,
    setDistriIds: (distriIds: number[][] | null) => void
  ) => number[];
};


interface Employee {
  id: number;
  name: string;
  role: string;
  score: number;
  ScoresOverMonths: number[];
}

const MainPage: React.FC = () => {
  const { id, range, setRange,distriIds,setDistriIds } = useGlobeId();
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [distribution, setDistribution] = useState<number[]>([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const[sameRangeMem,setSameRangeMem] = useState<number[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const[selectedBar,setSelectedBar] = useState<number>();
  //line plot
  const [state, setState] = useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions; // Explicit typing
  }>({
    series: [
      {
        name: "Score",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line" as "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#0A3981"],
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
          colors: ["#f3f3f3", "transparent"],
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
          text: "Months",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          },
        },
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 4,
        labels: {
          formatter: (value: number) => value.toFixed(0),
        },
        title: {
          text: "Rank",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#333",
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (value: number) {
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
        const distri = FindDistribution(response.data, id, setRange,distriIds,setDistriIds);
        
        
        setDistribution(distri);
        setEmployeeData(response.data);
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
           name: "Score", // Ensure "name" is included
           data: selectedEmployee.ScoresOverMonths,
         },
       ],
       options: {
         ...prevState.options,
         chart: {
           ...prevState.options.chart,
           type: "line" as "line",
         },
         title: {
           text: `Rank Trend by Month (${selectedEmployee.name})`,
           align: "left", // Add a valid value for align
         },
       },
     }));


    setBarGraphStyle((prevState) => ({
      ...prevState,
      options: {
        ...prevState.options,
        title: {
          text: `Rank Distribution (${selectedEmployee.name})`,
          align: "left", 
        },
      },
    }));

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
    if (range !== null) {
      resetColors[range] = "#0A3981";
    }
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
  useEffect(()=>{
    if (selectedBar!==undefined && distriIds && distriIds[selectedBar]) {
    setIsPopupVisible((prevVisibility) => true);
      const sameRangeMem = distriIds[selectedBar]; 
      setSameRangeMem(sameRangeMem);
      // console.log("Same Range Members:", sameRangeMem);
    }
  },[selectedBar])
 const [barGraphStyle, setBarGraphStyle] = useState({
   series: [
     {
       data: [21, 22, 10, 28, 16, 21, 13, 30, 9, 10],
     },
   ],
   options: {
     chart: {
       height: 350,
       type: "bar" as "bar", // Explicitly typing the value here
       events: {
         dataPointSelection: function (
           event: any,
           chartContext: any,
           config: any
         ) {
           const { seriesIndex, dataPointIndex } = config;

           if (dataPointIndex !== -1) {
             setSelectedBar(dataPointIndex);
             console.log("Data Point Index:", dataPointIndex);
            } else {
              console.log("Click outside data points");
            }
          },
        },
      },
      title: {
       text: "Rank Distribution",
       align: "left" as "left",
      },
      colors: new Array(10).fill("#808080"),
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
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
  
  
  
  console.log("Data Point Index State:", selectedBar);
  useEffect(() => {
    setBarGraphStyle((prevState) => ({
      ...prevState,
      series: [
        {
          data: distribution,
        },
      ],
    }));

  }, [distribution]);
  // console.log("isClick",isPopupVisible);
  console.log("RangeMen",sameRangeMem);
  
  return (
    <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 p-4 h-auto md:h-screen bg-[#D4EBF8]">
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3 h-full">
        <EnhancedTableTest rowData={rowData} />
      </div>
      <div className="flex flex-col justify-between w-full h-full  md:w-1/3">
        <div className="bg-white flex flex-col shadow-md rounded-lg w-full md:w-full h-[48%] ">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="line"
            height="100%"
          />
        </div>
        <div className="bg-white flex flex-col shadow-md rounded-lg w-full md:w-full h-[48%] ">
          <ReactApexChart
            options={barGraphStyle.options}
            series={barGraphStyle.series}
            type="bar"
            height="100%"
          />
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4 w-full md:w-1/3 h-full">
        {isPopupVisible && (
          <div
            className={`fixed top-6 right-7.5 w-[30%] h-auto bg-[#e3e7ea] shadow-lg p-4 ${
              isPopupVisible ? "animate-fade-left delay-[0ms]" : "opacity-0"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">
              Members in the Same Range
            </h2>
            <button
              className="absolute top-4 right-4 text-xl p-2 cursor-pointer"
              onClick={() => setIsPopupVisible(false)}
            >
              &#10005;
            </button>
            <ul className="space-y-2">
              {sameRangeMem.map((id) => {
                const employee = employeeData.find((emp) => emp.id === id); // Find employee by id

                return (
                  employee && (
                    <li key={id} className="p-2 border-b border-gray-300">
                      <div className="text-left">
                        <div className="text-sm text-gray-600 font-medium">
                          Employee ID:{" "}
                          <span className="text-blue-600">{employee.id}</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.role}
                        </div>
                        <div className="text-sm text-gray-700">
                          Score:{" "}
                          <span className="font-bold">{employee.score}</span>
                        </div>
                      </div>
                    </li>
                  )
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
