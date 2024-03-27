import React, { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Navbar from "react-bootstrap/Navbar";
import { Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';

function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    birthdate: new Date(),
    age: "",
    gender: "",
  });

  console.log(formData);
  const [onlyuser, setonlyUser] = useState({});
  const [personalInfoList, setPersonalInfoList] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  // const [selectedInfo, setSelectedInfo] = useState(null);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/personalinfo",
          {
            params: { userId: "yourUserId" },
          }
        );
        setPersonalInfoList(response.data);
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleChangeup = (e) => {
    setonlyUser({ ...onlyuser, [e.target.name]: e.target.value });
  };
  const handleChangeDate = (date) => {
    setFormData({ ...formData, birthdate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await axios.post("http://localhost:3000/api/personalinfo", {
        userId: "yourUserId",
        ...formData,
      });
      alert("Personal info added successfully");
      setFormData({
        fullName: "",
        nickname: "",
        birthdate: "",
        age: "",
        gender: "",
      });
      window.location.reload();
    } catch (error) {
      console.error("Error adding personal info:", error);
      alert("Failed to add personal info");
    }
  };

  const handleUpdate = async (info) => {
    // console.log(info)
    try {
      await axios
        .get(`http://localhost:3000/api/personalinfo/${info}`)
        .then((response) => setonlyUser(response.data));
      // setSelectedInfo(info);
      setShowUpdateForm(true);
      // setFormData(info);
    } catch (error) {
      console.error("Error fetching personal info:", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    // console.log('yhuyhyuh',`${onlyuser._id}`)
    // e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/personalinfo/${onlyuser._id}`,
        onlyuser
      );
      alert("Personal info updated successfully");
      setShowUpdateForm(false);
      // setFormData({
      //   fullName: "",
      //   nickname: "",
      //   birthdate: "",
      //   age: "",
      //   gender: "",
      // });
      // Refresh personal info list after update
      const response = await axios.get(
        "http://localhost:3000/api/personalinfo",
        {
          params: { userId: "yourUserId" },
        }
      );
      setPersonalInfoList(response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error updating personal info:", error);
      alert("Failed to update personal info");
    }
  };

  const handleDelete = (_id, nickname) => {
    if (window.confirm(`Are you sure you want to delete ${nickname}?`)) {
      axios.delete(`http://localhost:3000/api/personalinfo/${_id}`);
    } else {
    }
    window.location.reload();
  };

  return (
    <div style={{ margin: "0 auto", maxWidth: "1300px" }}>
      <div style={{backgroundColor: 'pink', textAlign: 'center', fontSize: '30px', padding: '10px',}}><h1 className="text-center">Personal Information Management</h1>
      </div><Navbar className="bg-body-tertiary justify-content-between">
        <Form>
          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="fullName">FullName</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="fullname"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="nickname">Nickname</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="nickname"
                  placeholder="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="birthdate">Birthdate</InputGroup.Text>
                <DatePicker
                  selected={formData.birthdate}
                  onChange={handleChangeDate}
                  dateFormat="yyyy-MM-dd" // Set desired date format
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="age">Age</InputGroup.Text>
                <Form.Control
                  type="text"
                  name="age"
                  placeholder="age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </InputGroup>
            </Col>
            <Row>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="gender">Gender</InputGroup.Text>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Form.Select>
                </InputGroup>
              </Col>

              <Col>
                <button type="info" onClick={handleSubmit} className="add-button">
                  ADD
                </button>
              </Col>
            </Row>
          </Row>
        </Form>
      </Navbar>
      <Table striped bordered hover size="sm">
        <thead>
          <tr className="text-center">
            <th>#</th>
            <th>Full Name</th>
            <th>Nickname</th>
            <th>Birthdate</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {personalInfoList.map((info, index) => (
            <tr className="text-center" key={info._id}>
              <td>{index + 1}</td>
              <td>{info.fullName}</td>
              <td>{info.nickname}</td>
              <td>{new Date(info.birthdate).toLocaleDateString()}</td>
              <td>{info.age}</td>
              <td>{info.gender}</td>
              <td >
                <Button 
                  variant="outline-danger"
                  onClick={() => handleDelete(info._id, info.nickname)}
                >
                  Delete
                </Button>
              </td>
              <td>
                <Button
                  variant="outline-success"
                  onClick={() => handleUpdate(info._id)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showUpdateForm && (
        <div>
          <Form onSubmit={handleUpdateSubmit}>
            {
              <div style={{ margin: "0 auto", maxWidth: "1000px" }}>
                <div style={{backgroundColor: 'pink', textAlign: 'center', fontSize: '30px', padding: '10px',}}><h1 className="text-center">Update</h1>
                </div><Navbar
                  className="bg-body-tertiary justify-content-between"
                  style={{ margin: "0 auto", maxWidth: "300px" }}
                >
                  <Form>
                    <Row>
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="fullName">
                          FullName
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="fullname"
                          value={onlyuser.fullName}
                          onChange={handleChangeup}
                        />
                      </InputGroup>
                    </Row>
                    <Row>
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="nickname">
                          Nickname
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="nickname"
                          placeholder="nickname"
                          value={onlyuser.nickname}
                          onChange={handleChangeup}
                        />
                      </InputGroup>
                    </Row>
                    <InputGroup className="mb-3">
                      <InputGroup.Text id="birthdate">
                        Birthdate
                      </InputGroup.Text>
                      <DatePicker
                        selected={formData.birthdate}
                        onChange={handleChangeDate}
                        dateFormat="yyyy-MM-dd" // Set desired date format
                        className="form-control"
                      />
                    </InputGroup>
                    <Row>
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="age">Age</InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="age"
                          placeholder="age"
                          value={onlyuser.age}
                          onChange={handleChangeup}
                        />
                      </InputGroup>
                    </Row>
                    <Row>
                      <InputGroup className="mb-3">
                        <InputGroup.Text id="gender">Gender</InputGroup.Text>
                        <Form.Select
                          name="gender"
                          value={onlyuser.gender}
                          onChange={handleChangeup}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Form.Select>
                      </InputGroup>
                      {/* <Button type="submit">Save</Button> */}
                      <Button
                        variant="outline-success"
                        onClick={() => handleUpdateSubmit(onlyuser._id)}
                      >
                        Update
                      </Button>
                    </Row>
                  </Form>
                </Navbar>
              </div>
            }
          </Form>
        </div>
      )}
    </div>
  );
}

export default PersonalInfoForm;
