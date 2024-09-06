import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
const TaskManager = React.lazy(() => import("./component/Taskmanager"));
const CreatePage = React.lazy(() => import("./component/Create"));
const NewTaskPage = React.lazy(() => import("./component/Newtask"));
const EditPage = React.lazy(() => import("./component/Edit"));
const TestPage = React.lazy(() => import("./component/Test"));

export default function App() {
  return (
    <div>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<div>Loading Contact...</div>}>
                  <TaskManager />
                </Suspense>
              }
            />
            <Route
              path="/create"
              element={
                <Suspense fallback={<div>Loading Contact...</div>}>
                  <CreatePage />
                </Suspense>
              }
            />
            <Route
              path="/new-task"
              element={
                <Suspense fallback={<div>Loading Contact...</div>}>
                  <NewTaskPage />
                </Suspense>
              }
            />
            <Route
              path="/TestPage/:id"
              element={
                <Suspense fallback={<div>Loading Contact...</div>}>
                  <TestPage />
                </Suspense>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <Suspense fallback={<div>Loading Contact...</div>}>
                  <EditPage />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
