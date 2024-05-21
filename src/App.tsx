import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge, Button, Input, InputGroup, InputGroupText, Table } from "reactstrap";

const completedStatus = "completed";
const pendingStatus = "pending";

// description, status (completed)
const itemsList = [
  {
    task: "Do laundry",
    status: pendingStatus,
  },
  {
    task: "Go to the gym",
    status: pendingStatus,
  },
  {
    task: "Read DUNE",
    status: completedStatus,
  },
];

function App() {
  // task text input
  const [taskText, setTaskText] = useState("");
  const [taskList, setTaskList] = useState(itemsList);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState(null);

  // edit
  const addNewTask = () => {
    setTaskList((prevArray) => prevArray.concat({ task: taskText, status: pendingStatus }));
    setTaskText("");
  };

  const editTask = (index) => {
    // edit task here
    setEditItemIndex(index);
  };

  const saveUpdates = (updatedTask, index) => {
    setTaskList((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[index] = { ...updatedArray[index], task: updatedTask };
      return updatedArray;
    });

    setEditItemIndex(null);
  };

  // delete element from array
  const deleteTask = (index: number) => {
    setTaskList((prevArray) => [...prevArray.slice(0, index), ...prevArray.slice(index + 1)]);
    if (editItemIndex === index) {
      setEditItemIndex(null);
    }
  };

  const markTaskAsCompleted = (index: number) => {
    setTaskList((prevArray) => {
      const updatedArray = [...prevArray];
      updatedArray[index] = {
        ...updatedArray[index],
        status: updatedArray[index].status === pendingStatus ? completedStatus : pendingStatus,
      };
      return updatedArray;
    });

    setEditItemIndex(null);
  };

  useEffect(() => {
    localStorage.setItem("taskList", JSON.stringify(taskList));
  }, [itemsList]);

  useEffect(() => {
    const taskListLoaded = localStorage.getItem("taskList");

    if (taskListLoaded) {
      setTaskList(JSON.parse(taskListLoaded));
    }
  }, []);

  return (
    <>
      <h1 className="todoTitle">Jhimy TODO List</h1>
      <div className="addTask">
        <InputGroup>
          <Input
            type="text"
            placeholder="add here the task"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
          />
          <InputGroupText>
            <Button color="primary" onClick={addNewTask}>
              Add new task
            </Button>
          </InputGroupText>
        </InputGroup>
      </div>

      <div className="tableTask">
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {taskList.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Input
                      type="checkbox"
                      checked={item.status === completedStatus}
                      onChange={() => markTaskAsCompleted(index)}
                    />{" "}
                    {index === editItemIndex ? (
                      <input defaultValue={item.task} onChange={(e) => setEditedTaskText(e.target.value)} />
                    ) : (
                      item.task
                    )}
                  </td>
                  <td>
                    {item.status === pendingStatus ? (
                      <Badge color="warning">Pending</Badge>
                    ) : (
                      <Badge color="success">Completed</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={() => editTask(index)}
                      disabled={index === editItemIndex}
                    >
                      edit
                    </Button>{" "}
                    <Button
                      color="primary"
                      size="sm"
                      onClick={() => saveUpdates(editedTaskText, index)}
                      disabled={index !== editItemIndex}
                    >
                      save
                    </Button>{" "}
                    <Button color="danger" size="sm" onClick={() => deleteTask(index)}>
                      delete
                    </Button>{" "}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default App;
