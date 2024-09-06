import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Create.scss";

const CreatePage = () => {
  const [activeTab, setActiveTab] = useState("problem");
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

  const handleSampleChange = (index, type, value) => {
    if (index < samples.length) {
      const updatedSamples = [...samples];
      updatedSamples[index][type] = value;
      setSamples(updatedSamples);
    }
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
    }, 50);
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
    if (index < hiddenTestCases.length) {
      const updatedHiddenTestCases = [...hiddenTestCases];
      updatedHiddenTestCases[index][field] = value;
      setHiddenTestCases(updatedHiddenTestCases);
    }
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

  const handleSampleInputChange = (index, value) => {
    const updatedSamples = [...samples];
    updatedSamples[index].input = value;
    setSamples(updatedSamples);
  };

  const handleSampleOutputChange = (index, value) => {
    const updatedSamples = [...samples];
    updatedSamples[index].output = value;
    setSamples(updatedSamples);
  };

  const handleSampleExplanationChange = (index, value) => {
    const updatedSamples = [...samples];
    updatedSamples[index].explanation = value;
    setSamples(updatedSamples);
  };

  const handleHiddenInputChange = (index, value) => {
    const updatedHiddenTestCases = [...hiddenTestCases];
    updatedHiddenTestCases[index].input = value;
    setHiddenTestCases(updatedHiddenTestCases);
  };

  const handleHiddenOutputChange = (index, value) => {
    const updatedHiddenTestCases = [...hiddenTestCases];
    updatedHiddenTestCases[index].output = value;
    setHiddenTestCases(updatedHiddenTestCases);
  };

  useEffect(() => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      samples: samples.map(() => ({ input: "", output: "", explanation: "" })),
      hiddenTestCases: hiddenTestCases.map(() => ({ input: "", output: "" })),
    }));
  }, [samples, hiddenTestCases]);

  const validateFields = () => {
    let isValid = true;

    const newErrors = {
      title: "",
      description: "",
      samples: samples.map(() => ({ input: "", output: "", explanation: "" })),
      hiddenTestCases: hiddenTestCases.map(() => ({ input: "", output: "" })),
    };

    // Reset input field styles
    document.querySelectorAll(".input-field-empty").forEach((input) => {
      input.classList.remove("input-field-empty");
    });

    // Check if problem title and text are provided
    if (!problemTitle) {
      newErrors.title = "Problem title is required.";
      isValid = false;
    }

    if (!problemText) {
      newErrors.description = "Problem description is required.";
      isValid = false;
    }

    // Check if all sample inputs are filled
    samples.forEach((sample, index) => {
      if (sample.enabled) {
        if (!sample.input) {
          newErrors.samples[index].input = "Sample input is required.";
          isValid = false;
        }
        if (!sample.output) {
          newErrors.samples[index].output = "Sample output is required.";
          isValid = false;
        }
        if (!sample.explanation) {
          newErrors.samples[index].explanation =
            "Sample explanation is required.";
          isValid = false;
        }
      }
    });

    // Check if all hidden test cases inputs are filled
    hiddenTestCases.forEach((hiddenTestCase, index) => {
      if (hiddenTestCase.enabled) {
        if (!hiddenTestCase.input) {
          newErrors.hiddenTestCases[index].input = "Hidden input is required.";
          isValid = false;
        }
        if (!hiddenTestCase.output) {
          newErrors.hiddenTestCases[index].output =
            "Hidden output is required.";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleback = () => {
    navigate("/");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const problemData = {
      title: problemTitle,
      description: problemText,
      samples,
      hiddenTestCases,
    };

    console.log("Problem Data to be sent:", problemData);

    try {
      const response = await fetch(
        "http://localhost/Task/task/src/backend/createproblem.php",
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

      if (data.debug_output) {
        console.warn("Non-JSON output detected:", data.debug_output);
      }

      if (data.success) {
        toast.success("Problem saved successfully");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Error: " + data.message);
        if (data.data) {
          console.error("Additional error data:", data.data);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred: " + error.message);
    }
  };

  return (
    <div className="create-page">
      <ToastContainer />
      <h2>Create Problem</h2>
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
            onChange={(e) => setProblemTitle(e.target.value)}
            className={errors.title ? "input-field-empty" : ""}
          />
          {errors.title && (
            <span className="error-message">
              <i className="bi bi-exclamation-circle-fill"></i> {errors.title}
            </span>
          )}
        </div>
        <div className="description">
          <h4>Description:</h4>
          <textarea
            placeholder="Type the problem here..."
            value={problemText}
            onChange={(e) => setProblemText(e.target.value)}
            className={errors.description ? "input-field-empty" : ""}
          />
          {errors.description && (
            <span className="error-message">
              <i className="bi bi-exclamation-circle-fill"></i>
              {errors.description}
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
                  disabled={samples.length === 1}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <h5>{`Sample Testcase ${index + 1}`}</h5>
              <input
                type="text"
                value={sample.input}
                onChange={(e) => handleSampleInputChange(index, e.target.value)}
                className={
                  errors.samples[index].input ? "input-field-empty" : ""
                }
              />
              {errors.samples[index].input && (
                <span style={{ color: "red" }}>
                  {errors.samples[index].input}
                </span>
              )}
              <input
                type="text"
                value={sample.output}
                onChange={(e) =>
                  handleSampleOutputChange(index, e.target.value)
                }
                className={
                  errors.samples[index].output ? "input-field-empty" : ""
                }
              />
              {errors.samples[index].output && (
                <span style={{ color: "red" }}>
                  {errors.samples[index].output}
                </span>
              )}
              <input
                type="text"
                value={sample.explanation}
                onChange={(e) =>
                  handleSampleExplanationChange(index, e.target.value)
                }
                className={
                  errors.samples[index].explanation ? "input-field-empty" : ""
                }
              />
              {errors.samples[index].explanation && (
                <span style={{ color: "red" }}>
                  {errors.samples[index].explanation}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="add-button">
          <button className="btn add-hidden-btn" onClick={addHiddenTestCase}>
            <i className="bi bi-plus"></i> Add
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
                  disabled={hiddenTestCases.length === 1}
                >
                  <i className="bi bi-x"></i>
                </button>
              </div>
              <h5>{`Hidden Testcase ${index + 1}`}</h5>
              <input
                type="text"
                value={hiddenTestCase.input}
                onChange={(e) => handleHiddenInputChange(index, e.target.value)}
                className={
                  errors.hiddenTestCases[index].input ? "input-field-empty" : ""
                }
              />
              {errors.hiddenTestCases[index].input && (
                <span style={{ color: "red" }}>
                  {errors.hiddenTestCases[index].input}
                </span>
              )}
              <input
                type="text"
                value={hiddenTestCase.output}
                onChange={(e) =>
                  handleHiddenOutputChange(index, e.target.value)
                }
                className={
                  errors.hiddenTestCases[index].output
                    ? "input-field-empty"
                    : ""
                }
              />
              {errors.hiddenTestCases[index].output && (
                <span style={{ color: "red" }}>
                  {errors.hiddenTestCases[index].output}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <button className="btn submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default CreatePage;
