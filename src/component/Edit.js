import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import Alert from "@mui/material/Alert";
//import AlertTitle from "@mui/material/AlertTitle";
import "../styles/Edit.scss";

const EditPage = () => {
  const { id } = useParams();
  const [problemTitle, setProblemTitle] = useState("");
  const [problemText, setProblemText] = useState("");
  const [samples, setSamples] = useState([
    { input: "", output: "", explanation: "", enabled: true },
  ]);
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: "", output: "", enabled: true },
  ]);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    samples: samples.map(() => ({ input: "", output: "", explanation: "" })),
    hiddenTestCases: hiddenTestCases.map(() => ({ input: "", output: "" })),
  });
  const lastTestCaseRef = useRef(null);
  const navigate = useNavigate();
  const [originalProblemTitle, setOriginalProblemTitle] = useState("");
  const [originalProblemText, setOriginalProblemText] = useState("");
  const [originalSamples, setOriginalSamples] = useState([]);
  const [originalHiddenTestCases, setOriginalHiddenTestCases] = useState([]);

  useEffect(() => {
    fetch(`http://localhost/Task/task/src/backend/getproblem.php?id=${id}`)
      .then((response) => response.text())
      .then((text) => {
        console.log("Raw response:", text);

        const jsonStartIndex = text.indexOf("{");
        if (jsonStartIndex !== -1) {
          const jsonString = text.substring(jsonStartIndex);

          try {
            const data = JSON.parse(jsonString);

            if (data.status === "success") {
              setProblemTitle(data.data.title);
              setOriginalProblemTitle(data.data.title.trim());
              setProblemText(data.data.description);
              setOriginalProblemText(data.data.description.trim());
              setSamples(data.data.samples || []);
              setOriginalSamples(
                (data.data.samples || []).map((sample) => ({
                  ...sample,
                  input: sample.input.trim(),
                  output: sample.output.trim(),
                  explanation: sample.explanation.trim(),
                  enabled: sample.enabled,
                }))
              );
              setHiddenTestCases(
                (data.data.hiddenTestCases || []).map((testCase) => ({
                  ...testCase,
                  enabled: true,
                }))
              );
              setOriginalHiddenTestCases(
                (data.data.hiddenTestCases || []).map((testCase) => ({
                  ...testCase,
                  input: testCase.input.trim(),
                  output: testCase.output.trim(),
                  enabled: testCase.enabled,
                }))
              );
            } else {
              toast.error(data.message || "An error occurred");
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        } else {
          console.error("No JSON found in the response");
        }
      })
      .catch((error) => console.error("Error fetching problem data:", error));
  }, [id]);

  const handleSampleChange = (index, type, value) => {
    const updatedSamples = [...samples];
    updatedSamples[index][type] = value.trim();
    setSamples(updatedSamples);
  };

  const addSample = () => {
    const newSample = { input: "", output: "", explanation: "", enabled: true };
    setSamples([...samples, newSample]);

    setErrors((prevErrors) => ({
      ...prevErrors,
      samples: [
        ...prevErrors.samples,
        { input: "", output: "", explanation: "" },
      ],
    }));
    setTimeout(() => {
      lastTestCaseRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const toggleSampleTestCase = (index) => {
    if (samples.length === 1) {
      toast.info("At least one sample testcase is mandatory.");
      return;
    }

    if (index < samples.length) {
      const updatedSamples = [...samples];
      updatedSamples[index].enabled = !updatedSamples[index].enabled;
      setSamples(updatedSamples);
    }
  };

  const removeSample = (index) => {
    if (samples.length === 1) {
      toast.error("At least one sample test case is mandatory.");
      return;
    }
    setSamples(samples.filter((_, i) => i !== index));
  };
  const handleHiddenChange = (index, field, value) => {
    const updatedHiddenTestCases = [...hiddenTestCases];
    updatedHiddenTestCases[index][field] = value.trim();
    setHiddenTestCases(updatedHiddenTestCases);
  };

  const addHiddenTestCase = () => {
    const newHiddenTestCase = { input: "", output: "", enabled: true };
    setHiddenTestCases([...hiddenTestCases, newHiddenTestCase]);

    setErrors((prevErrors) => ({
      ...prevErrors,
      hiddenTestCases: [
        ...prevErrors.hiddenTestCases,
        { input: "", output: "" },
      ],
    }));

    setTimeout(() => {
      lastTestCaseRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const toggleHiddenTestCase = (index) => {
    if (hiddenTestCases.length === 1) {
      toast.info("At least one hidden test case is mandatory.");
      return;
    }

    if (index < hiddenTestCases.length) {
      const updatedHiddenTestCases = [...hiddenTestCases];
      updatedHiddenTestCases[index].enabled =
        !updatedHiddenTestCases[index].enabled;
      setHiddenTestCases(updatedHiddenTestCases);
    }
  };

  const removeHiddenTestCase = (index) => {
    if (hiddenTestCases.length === 1) {
      toast.error("At least one hidden test case is mandatory.");
      return;
    }

    setHiddenTestCases(hiddenTestCases.filter((_, i) => i !== index));
  };

  const handleProblemTitleChange = (e) => {
    setProblemTitle(e.target.value.trim());
  };

  const handleProblemTextChange = (e) => {
    setProblemText(e.target.value.trim());
  };

  const validateFields = () => {
    const newErrors = {};
    if (!problemTitle) newErrors.problemTitle = "Problem title is required";
    if (!problemText) newErrors.problemText = "Problem description is required";

    samples.forEach((sample, index) => {
      if (sample.enabled) {
        if (!sample.input)
          newErrors[`sampleInput${index}`] = "Input is required";
        if (!sample.output)
          newErrors[`sampleOutput${index}`] = "Output is required";
        if (!sample.explanation)
          newErrors[`sampleExplanation${index}`] = "Explanation is required";
      }
    });

    hiddenTestCases.forEach((testCase, index) => {
      if (testCase.enabled) {
        if (!testCase.input)
          newErrors[`hiddenInput${index}`] = "Input is required";
        if (!testCase.output)
          newErrors[`hiddenOutput${index}`] = "Output is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const hasChanges = () => {
    if (
      problemTitle !== originalProblemTitle ||
      problemText !== originalProblemText
    ) {
      return true;
    }

    // Check for changes in samples
    const samplesChanged = samples.some((sample, index) => {
      const originalSample = originalSamples[index] || {}; // Default to an empty object if not defined
      return (
        sample.input !== originalSample.input ||
        sample.output !== originalSample.output ||
        sample.explanation !== originalSample.explanation ||
        sample.enabled !== originalSample.enabled
      );
    });

    // Check for changes in hidden test cases
    const hiddenTestCasesChanged = hiddenTestCases.some((testCase, index) => {
      const originalTestCase = originalHiddenTestCases[index] || {}; // Default to an empty object if not defined
      return (
        testCase.input !== originalTestCase.input ||
        testCase.output !== originalTestCase.output ||
        testCase.enabled !== originalTestCase.enabled
      );
    });

    return samplesChanged || hiddenTestCasesChanged;
  };

  const handleback = () => {
    navigate("/");
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!hasChanges()) {
      toast.info("No changes have been made.");
      setTimeout(() => {
        navigate("/");
      }, 1000);
      return;
    }

    const problemData = {
      id,
      title: problemTitle,
      description: problemText,
      samples,
      hiddenTestCases: hiddenTestCases.filter((testCase) => testCase.enabled),
    };

    try {
      const response = await fetch(
        "http://localhost/Task/task/src/backend/updateproblem.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(problemData),
        }
      );

      const text = await response.text();
      console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        console.error("Raw response:", text);
        throw new Error("Invalid JSON response from server");
      }

      if (data.status === "success") {
        toast.success("Problem Updated Successfully");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(data.message || "An error occurred while updating.");
      }
    } catch (error) {
      console.error("Error updating problem data:", error);
      toast.error("An error occurred while updating the problem.");
    }
  };

  return (
    <div className="edit-page">
      <ToastContainer />
      <h2>Edit Problem</h2>
      <div className="tab-content">
        <div className="back">
          <button className="back" onClick={handleback}>
            <i className="bi bi-arrow-left-circle"></i>
          </button>
        </div>
        <div className="problemtitle">
          <h4>Problem Title:</h4>
          <input
            type="text"
            placeholder="Problem Title"
            value={problemTitle}
            onChange={handleProblemTitleChange}
            className={errors.problemTitle ? "error" : ""}
          />
          {errors.problemTitle && (
            <span className="error-message">
              <i className="bi bi-exclamation-circle-fill"></i>{" "}
              {errors.problemTitle}
            </span>
          )}
        </div>
        <div className="description">
          <h4>Description:</h4>
          <textarea
            placeholder="Type the problem here..."
            value={problemText}
            onChange={handleProblemTextChange}
            className={errors.problemText ? "error" : ""}
          />
          {errors.problemText && (
            <span className="error-message">
              <i className="bi bi-exclamation-circle-fill"></i>{" "}
              {errors.problemText}
            </span>
          )}
        </div>
        <div className="add-button">
          <button className="btn add-sample-btn" onClick={addSample}>
            <i className="bi bi-plus"></i> Add Sample Test Case
          </button>
        </div>
        <div>
          {samples.map((sample, index) => (
            <div
              key={index}
              className={`sample ${!sample.enabled ? "blurred" : ""}`}
              ref={lastTestCaseRef}
            >
              <div className="buttons-right">
                <button
                  className="btn enable-disable-btn"
                  onClick={() => toggleSampleTestCase(index)}
                >
                  {sample.enabled ? (
                    <i className="bi bi-toggle2-on green"></i>
                  ) : (
                    <i className="bi bi-toggle2-off"></i>
                  )}
                </button>

                <button
                  className="btn remove-sample-btn"
                  onClick={() => removeSample(index)}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <h5>{`Sample Testcase ${index + 1}`}</h5>
              <input
                type="text"
                placeholder="Input"
                value={sample.input}
                onChange={(e) =>
                  handleSampleChange(index, "input", e.target.value)
                }
                disabled={!sample.enabled}
                className={errors[`sampleInput${index}`] ? "error" : ""}
              />

              <input
                type="text"
                placeholder="Output"
                value={sample.output}
                onChange={(e) =>
                  handleSampleChange(index, "output", e.target.value)
                }
                disabled={!sample.enabled}
              />
              <input
                type="text"
                placeholder="Explanation"
                value={sample.explanation}
                onChange={(e) =>
                  handleSampleChange(index, "explanation", e.target.value)
                }
                disabled={!sample.enabled}
              />
            </div>
          ))}
        </div>
        <div className="add-button">
          <button className="btn add-hidden-btn" onClick={addHiddenTestCase}>
            <i className="bi bi-plus"></i> Add Hidden Test Case
          </button>
        </div>
        <div>
          {hiddenTestCases.map((hiddenTestCase, index) => (
            <div
              key={index}
              className={`hidden-test-case ${
                !hiddenTestCase.enabled ? "blurred" : ""
              }`}
              ref={lastTestCaseRef}
            >
              <div className="buttons-right">
                <button
                  className="btn enable-disable-btn"
                  onClick={() => toggleHiddenTestCase(index)}
                >
                  {hiddenTestCase.enabled ? (
                    <i className="bi bi-toggle2-on green"></i>
                  ) : (
                    <i className="bi bi-toggle2-off"></i>
                  )}
                </button>

                <button
                  className="btn remove-hidden-btn"
                  onClick={() => removeHiddenTestCase(index)}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <h5>{`Hidden Testcase ${index + 1}`}</h5>
              <input
                type="text"
                placeholder="Input"
                value={hiddenTestCase.input}
                onChange={(e) =>
                  handleHiddenChange(index, "input", e.target.value)
                }
                disabled={!hiddenTestCase.enabled}
              />
              <input
                type="text"
                placeholder="Output"
                value={hiddenTestCase.output}
                onChange={(e) =>
                  handleHiddenChange(index, "output", e.target.value)
                }
                disabled={!hiddenTestCase.enabled}
              />
            </div>
          ))}
        </div>
      </div>
      <button className="btn submit-btn" onClick={handleSubmit}>
        Update
      </button>
    </div>
  );
};

export default EditPage;
