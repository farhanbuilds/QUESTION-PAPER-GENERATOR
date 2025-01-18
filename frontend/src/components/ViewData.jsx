import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";

const ViewData = () => {
  const { dataId } = useParams(); // Get the dataId from the URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedPartABloomsLevel = queryParams.get("levelA"); // Get the Part A Bloom's level from the URL
  const selectedPartBBloomsLevel = queryParams.get("levelB"); // Get the Part B Bloom's level from the URL

  const [structuredData, setStructuredData] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle any errors

  // Function to process the data into Part A and Part B
  const processParts = (data) => {
    const partA = [];
    const partB = [];
    const partAQuestionCount = {}; // To track the number of questions taken per unit for Part A
    let totalQuestionsInPartB = 0;

    let unitData = {};
    data.forEach((entry) => {
      if (!unitData[entry.unit]) {
        unitData[entry.unit] = 0;
      }

      unitData[entry.unit]++;
    });

    let totalUnits = Object.keys(unitData).length;
    console.log("Total units 2 : ", totalUnits);
    console.log("question per unit : ", unitData);

    let selectedQuestions = [];
    let unitQuestionsMap = {};

    data.forEach((item) => {
      if (!unitQuestionsMap[item.unit]) {
        unitQuestionsMap[item.unit] = new Set();
      }

      if (unitQuestionsMap[item.unit].size < 2) {
        unitQuestionsMap[item.unit].add(item.questions);
      }
    });

    for (let unit in unitQuestionsMap) {
      Array.from(unitQuestionsMap[unit]).forEach((questions) => {
        selectedQuestions.push({ unit: unit, question: questions });
      });
    }

    console.log("selected ", selectedQuestions);
    selectedQuestions.forEach((item) => {
      console.log(item.question);
    });

    // Part A: 2 questions per unit, filtered by Bloom's level
    data.forEach((unit) => {
      const unitId = unit.unit; // Identify the unit
      const unitQuestions = unit.questions || []; // Ensure unit has questions
      partAQuestionCount[unitId] = 0; // Initialize count for this unit

      for (let i = 0; i < unitQuestions.length; i++) {
        if (
          partAQuestionCount[unitId] < 2 &&
          unitQuestions[i].bloomsLevel === selectedPartABloomsLevel
        ) {
          partA.push(unitQuestions[i]); // Add question to Part A
          partAQuestionCount[unitId] += 1; // Increment count for this unit
        } else {
          break; // Stop once 2 questions have been added
        }
      }
    });

    // Part B: 10 questions in total
    const allUnitsQuestions = data.flatMap((unit) => unit.questions || []); // Combine all questions from all units
    const pickedUnits = {}; // To track questions picked per unit in Part B

    allUnitsQuestions.forEach((question) => {
      const unitId = question.unit || "unknown"; // Ensure unitId exists
      if (!pickedUnits[unitId]) pickedUnits[unitId] = 0; // Initialize if not exists

      // Pick questions round-robin style from all units
      if (
        totalQuestionsInPartB < 10 &&
        pickedUnits[unitId] < allUnitsQuestions.length &&
        question.bloomsLevel === selectedPartBBloomsLevel
      ) {
        partB.push(question); // Add question to Part B
        pickedUnits[unitId] += 1; // Increment count for this unit in Part B
        totalQuestionsInPartB++; // Increment total question count for Part B
      }
    });
    console.log("PART A", partA);
    console.log("PART B", partB);
    return { partA, partB };
  };

  const generatePDF = () => {
    const { partA, partB } = processParts(structuredData);
    const doc = new jsPDF();
    const imgData = "";
    const pageWidth = doc.internal.pageSize.getWidth();
    // Add title
    doc.setFont("Times", "bold");
    doc.setFontSize(18);

    doc.addImage(imgData, "JPEG", 10, 15, 25, 25);

    const title1 = "CMR COLLEGE OF ENGINEERING & TECHNOLOGY";
    const title1Width = doc.getTextWidth(title1);
    doc.text(title1, (pageWidth - title1Width) / 2, 15);

    doc.setFontSize(14);
    const title2 = "(UGC AUTONOOMUS)";
    const title2Width = doc.getTextWidth(title2);
    doc.text(title2, (pageWidth - title2Width) / 2, 25);

    doc.text("Name: ..............", 10, 45);

    const textWidthClass = doc.getTextWidth("Class: .............");
    doc.text("Class: .............", pageWidth - textWidthClass - 10, 45);

    doc.text("RollNo: ............", 10, 55);

    const textWidthMarks = doc.getTextWidth("Max.Marks: 60");
    doc.text("Class: .............", pageWidth - textWidthMarks - 10, 55);

    const startX = 10;
    const endX = pageWidth - 10;
    const lineY = 60;

    doc.line(startX, lineY, endX, lineY);

    // Add Part A
    doc.setFontSize(14);
    doc.text("Part A:", 10, 80);

    doc.setFontSize(12);
    const textWidthPartA = doc.getTextWidth("10 x 1 = 10");
    doc.text("10 x 1 = 10", pageWidth - textWidthPartA - 10, 90);

    doc.setFont("Helvetica", "normal");
    let y = 100;
    partA.forEach((q, index) => {
      doc.text(`${index + 1}. ${q.question}`, 10, y);
      y += 14;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    // Add Part B
    doc.setFontSize(14);
    doc.text("Part B:", 10, y + 10);

    const textWidthPartB = doc.getTextWidth("5 x 10 = 50");
    doc.text("5 x 10 = 50", pageWidth - textWidthPartB - 10, y + 20);

    y += 40;
    partB.forEach((q, index) => {
      if (index % 2 === 0) {
        doc.text(`${Math.floor(index / 2) + 1}. ${q.question}`, 10, y);
        y += 14;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        doc.text("(OR)", 45, y);
        y += 14;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      } else {
        doc.text(`${q.question}`, 15, y);
        y += 14;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        y += 10; // Add extra space after each pair
      }
    });

    doc.save("Question_Paper.pdf");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/view/${dataId}`);

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Data:", data);
          setStructuredData(data.structuredData); // Set the fetched data
        } else {
          setError("Data not found or server error");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false); // Set loading to false after data is fetched or error occurred
      }
    };

    fetchData();
  }, [dataId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  // Process the structured data into Part A and Part B
  const { partA, partB } = processParts(structuredData);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Extracted Data</h1>

      <div className="mt-4">
        <button
          onClick={generatePDF}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download PDF
        </button>
      </div>

      {/* Part A */}
      <div className="bg-white shadow-md p-6 rounded-lg mb-4">
        <h2 className="text-2xl font-bold mb-3">Part A:</h2>
        <ul className="list-decimal font-normal ml-6">
          {partA.map((q, index) => (
            <li key={index}>
              <p>{q.question}({q.bloomsLevel})</p>
              <br />
              <br />
            </li>
          ))}
        </ul>
      </div>

      {/* Part B */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-3">Part B: </h2>
        <ul className="list-decimal font-normal ml-6">
          {partB.map((q, index) => (
            <React.Fragment key={index}>
              {index % 2 === 0 && (
                <>
                  <ul>
                    <li>
                      <p>
                        {Math.floor(index / 2) + 1}. {q.question}(
                        {q.bloomsLevel})
                      </p>
                    </li>
                  </ul>
                  <p className="ml-10">(OR)</p>
                </>
              )}
              {index % 2 !== 0 && (
                <>
                  <li className="list-none ml-5">
                    <p>
                      {q.question}({q.bloomsLevel})
                    </p>
                  </li>
                  <br />
                </>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewData;