import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig.js";
import { ref, set } from "firebase/database";
import { jsPDF } from "jspdf";
import { Header  } from "./Header.tsx";

const ViewData = () => {
  const [currentUser, setCurrentUser] = useState("");
  const userId = currentUser?.uid;
  const { dataId } = useParams(); // Get the dataId from the URL
  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  const[partABloomsLevel, setPartABloomsLevel] = useState('');
  const[partBBloomsLevel, setPartBBloomsLevel] = useState('');
  const[collegeName, setCollegeName] = useState('');
  const[affilatedUniversity, setAffilatedUniversity] = useState('');
  const[program, setProgram] = useState('');
  const[questionPaperName, setQuestionPaperName] = useState('');
  const[subject, setSubject] = useState('');
  const[logoBase64, setLogobase64] = useState('');
  const[logoFormat, setLogoFormat] = useState('');
  const[questionsLength, setQuestionsLength] = useState(null);

  const[partA, setPartA] = useState([]);
  const[partB, setPartB] = useState([]);

  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle any errors

  const savePdfToDb = (base64Pdf, fileName, subject, questionsLength, userId) => {
    const pdfRef = ref(db, 'pdfs/' + new Date().getTime());
    const pdfData = {
      name: fileName,
      subject:subject,
      questionsLength: questionsLength,
      content: base64Pdf,
      uploadedAt: Date.now(),
      userId: userId,
    };
    set(pdfRef, pdfData)
    .then(() => {
      console.log("Pdf saved successfully!");
    })
    .catch((error) => {
      console.error("error saving pdf", error);
    });
  };
    
    useEffect(() => {
      onAuthStateChanged(auth, (currentUser) => {
        setCurrentUser(currentUser);
      });
    }, []);

  // Function to process the data into Part A and Part B
  const processParts = useCallback((data) => {
    const shuffleArray = (array) => {
      return array
        .map((item) => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
    };

    const partA = [];
    const partB = [];
    const partAQuestionCount = {};
    let totalQuestionsInPartB = 0;

    const shuffledData = shuffleArray(data);

    shuffledData.forEach((unit) => {
      const unitId = unit.unit;
      const unitQuestions = unit.questions || [];
      partAQuestionCount[unitId] = 0;

      for (let i = 0; i < unitQuestions.length; i++) {
        if (
          partAQuestionCount[unitId] < 2 &&
          unitQuestions[i].bloomsLevel === partABloomsLevel
        ) {
          partA.push(unitQuestions[i]);
          partAQuestionCount[unitId] += 1;
        }
      }
    });

    const allUnitsQuestions = data.flatMap((unit) => unit.questions || []);
    const pickedUnits = {};

    allUnitsQuestions.forEach((question) => {
      const unitId = question.unit || "unknown";
      if (!pickedUnits[unitId]) pickedUnits[unitId] = 0;

      if (
        totalQuestionsInPartB < 10 &&
        pickedUnits[unitId] < allUnitsQuestions.length &&
        question.bloomsLevel === partBBloomsLevel
      ) {
        partB.push(question);
        pickedUnits[unitId] += 1;
        totalQuestionsInPartB++;
      }
    });

    console.log("partA", partA);
    console.log("partB", partB);

    return { partA, partB };
  }, [partABloomsLevel, partBBloomsLevel]);
  

  const generatePDF = async () => {
    if (!partA.length || !partB.length) {
      alert("Questions not loaded properly!");
      return;
    }  
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.getWidth();
    // Add title
    doc.setFont("Times", "bold");
    doc.setFontSize(14);

    doc.addImage(logoBase64, logoFormat, 10, 5, 15, 15);

    const title1Width = doc.getTextWidth(collegeName);
    doc.text(collegeName, (pageWidth - title1Width) / 2, 15);

    doc.setFontSize(10);
  
    const title2Width = doc.getTextWidth(affilatedUniversity);
    doc.text(affilatedUniversity, (pageWidth - title2Width) / 2, 25);
    
    const examTypeTextWidth = doc.getTextWidth(program);
    doc.text(program, (pageWidth - examTypeTextWidth) / 2 , 35)

    doc.setFontSize(12);
    doc.text("Name: _________________________________", 10, 45);

    const textWidthClass = doc.getTextWidth("Class: _______________");
    doc.text("Class: _______________", pageWidth - textWidthClass - 10, 45);

    doc.text("RollNo: ____________", 10, 60);

    const textWidthMarks = doc.getTextWidth("Max.Marks: 60");
    doc.text("Max.Marks: 60", pageWidth - textWidthMarks - 10, 60);

    const startX = 10;
    const endX = pageWidth - 10;
    const lineY = 65;

    doc.line(startX, lineY, endX, lineY);

    // Add Part A
    doc.setFontSize(14);
    const partATextWidth = doc.getTextWidth("Part A:");
    doc.text("Part A:", (pageWidth - partATextWidth) / 2, 90);
    const partARules = "Answer all TEN questions."
    const partARulesTextWidth = doc.getTextWidth(partARules);
    doc.text(partARules, (pageWidth - partARulesTextWidth) / 2, 100);


    doc.setFontSize(12);
    const textWidthPartA = doc.getTextWidth("10 x 1 = 10");
    doc.text("10 x 1 = 10", pageWidth - textWidthPartA - 10, 110);

    doc.setFont("Helvetica", "normal");
    let y = 120;
    partA.forEach((q, index) => {
      doc.text(`${index + 1}. ${q.question}`, 10, y);
      y += 14;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    doc.addPage();
    y = 0;
    // Add Part 
    doc.setFont("Times", "bold");
    doc.setFontSize(14);
    const partBHeadingTextWidth = doc.getTextWidth("Part B:");
    doc.text("Part B:", (pageWidth - partBHeadingTextWidth) / 2, y + 20);

    const partBRules = "Answer FIVE questions, choosing one from each set.";
    const partBRulesTextWidth = doc.getTextWidth("Answer FIVE questions, choosing one from each set.");
    doc.text(partBRules, (pageWidth - partBRulesTextWidth) / 2, y + 30);

    doc.setFontSize(12);
    const textWidthPartB = doc.getTextWidth("5 x 10 = 50");
    doc.text("5 x 10 = 50", pageWidth - textWidthPartB - 10, y + 40);

    doc.setFont("Helvetica", "normal");
    y += 50;
    partB.forEach((q, index) => {
      if (index % 2 === 0) {
        doc.text(`${Math.floor(index / 2) + 1}. a) ${q.question}`, 10, y);
        y += 10;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        doc.text("(OR)", 45, y);
        y += 10;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      } else {
        doc.text(`b) ${q.question}`, 15, y);
        y += 10;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
        y += 10; // Add extra space after each pair
      }
    });
    doc.save("Question_Paper.pdf");
    const pdfBase64 = doc.output('datauristring');
    if(pdfBase64) {
      savePdfToDb(pdfBase64, questionPaperName || "Question paper", subject, questionsLength, userId);
    }else{
      console.log("file not converted to base64");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/view/${dataId}`, {
          headers: {
            'Referrer': 'http://localhost:5000/'
          }
        });        
        if (response.ok) {
          const data = await response.json();

          setPartABloomsLevel(data.structuredData.selectedPartALevel);
          setPartBBloomsLevel(data.structuredData.selectedPartBLevel);
          setCollegeName(data.structuredData.collegeName);
          setAffilatedUniversity(data.structuredData.affilatedUniversity);
          setProgram(data.structuredData.program);
          setQuestionPaperName(data.structuredData.questionPaperName);
          setSubject(data.structuredData.subject);
          setLogobase64(data.structuredData.logoBase64);
          setLogoFormat(data.structuredData.logoFormat);


          const { partA, partB } = processParts(data.structuredData.structuredData);

          if(partA.length && partB.length){
            setPartA(partA);
            setPartB(partB);
            const totalLength = partA.length + partB.length;
            setQuestionsLength(totalLength)
          }else{
            console.log("no valid Data found in part A and part B");
          }
        } else {
          setError("Data not found or server error");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dataId, processParts]);
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  // Process the structured data into Part A and Part B

  return (
    <>
    < Header />
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
              <p>{q.question} ({q.bloomsLevel})</p>
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
                        {Math.floor(index / 2) + 1}. a) {q.question} ({q.bloomsLevel})
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
                      b) {q.question} ({q.bloomsLevel})
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
    </>
  );
};

export default ViewData;