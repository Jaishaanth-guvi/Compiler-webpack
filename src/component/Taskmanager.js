import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Taskmanager.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Tooltip from "@mui/material/Tooltip";

const TaskManager = () => {
  const [problems, setProblems] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost/Task/task/src/backend/Fetchproblem.php")
      .then((response) => response.text())
      .then((text) => {
        try {
          const data = JSON.parse(text);
          setProblems(data);
        } catch (error) {
          console.error("Error parsing JSON:", error, "Response text:", text);
        }
      })
      .catch((error) => console.error("Error fetching problems:", error));
  }, []);

  const handleEditClick = (problemId) => {
    navigate(`/edit/${problemId}`);
  };

  const handleplayClick = (problemId) => {
    navigate(`/TestPage/${problemId}`);
  };

  const handleDeleteClick = (problemId) => {
    setSelectedProblemId(problemId);
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost/Task/task/src/backend/deleteproblem.php?id=${selectedProblemId}`,
        {
          method: "DELETE",
        }
      );

      const text = await response.text();

      const jsonString = text.replace(/^[^{]*/, "");

      let data;
      try {
        data = JSON.parse(jsonString);
      } catch (error) {
        console.error("Failed to parse JSON:", jsonString);
        return;
      }

      if (data.status === "success") {
        setProblems(
          problems.filter((problem) => problem._id !== selectedProblemId)
        );
        setShowPopup(false);
        setSelectedProblemId(null);
      } else {
        console.error("Error deleting problem:", data.message);
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
    setSelectedProblemId(null);
  };

  const totalPages = Math.ceil(problems.length / problemsPerPage);

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="task-manager">
      <div className="task">
        <div className="button-container">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/create")}
          >
            Create
          </button>
          <button
            className="btn btn-success"
            onClick={() => navigate("/new-task")}
          >
            New Task
          </button>
        </div>
        <div className="accordion" id="problemAccordion">
          {currentProblems.map((problem, index) => (
            <div className="accordion-item" key={problem._id}>
              <h2 className="accordion-header" id={`heading-${index}`}>
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${index}`}
                  aria-expanded={index === 0 ? "true" : "false"}
                  aria-controls={`collapse-${index}`}
                >
                  {problem.title}
                </button>
              </h2>
              <div
                id={`collapse-${index}`}
                className={`accordion-collapse collapse ${
                  index === 0 ? "show" : ""
                }`}
                aria-labelledby={`heading-${index}`}
                data-bs-parent="#problemAccordion"
              >
                <div className="accordion-body">
                  <p className="problem-description">{problem.description}</p>
                  <div className="problem-actions d-flex justify-content-end">
                    <Tooltip title="Test" arrow>
                      <Button
                        className="icon test"
                        startIcon={<PlayCircleIcon />}
                        onClick={() => handleplayClick(problem._id)}
                      />
                    </Tooltip>
                    <Tooltip title="Edit" arrow>
                      <Button
                        className="icon edit"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditClick(problem._id)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <Button
                        className="icon delete-icon"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(problem._id)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <Stack spacing={1} className="pagination-container">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              className="custom-pagination"
            />
          </Stack>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-content">
              <p>Are you sure you want to delete this problem?</p>
              <div className="popup-buttons">
                <button className="cancel-btn" onClick={cancelDelete}>
                  Cancel
                </button>
                <button className="confirm-btn" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
