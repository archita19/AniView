import { React, useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { auth } from "../firebase-config";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [toast, setToast] = useState("");

  const forgetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: "http://localhost:3000/sign-in",
        handleCodeInApp: false,
      });
      setToast(`Email sent to ${email} !`);
      setAuthError("");
    } catch (err) {
      console.log(err);
      setAuthError(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    forgetPassword(email);
  };

  return (
    <>
      <Container className="my-5 sign-in" style={{ maxWidth: "50%" }}>
        {toast && <Alert variant="success">{toast}</Alert>}
        {authError !== "" && (
          <Alert variant="danger">{authError.message}</Alert>
        )}
        <h2 className="text-center mb-5">Forgot Password</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formGroupEmail">
            <Form.Label>Registered Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button
            variant="danger"
            type="submit"
            onClick={handleSubmit}
            style={{ display: "block", width: "100%", marginBottom: "1rem" }}
          >
            Submit
          </Button>
        </Form>

        <Row className="mt-3">
          <Col as={Link} to="/sign-in">
            Already have an account!
          </Col>
        </Row>
      </Container>
    </>
  );
}
