import { React, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { auth, signInViaGoogle } from '../firebase-config'
import { signInWithEmailAndPassword } from "firebase/auth"

export default function SignIn() {
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[authError, setAuthError] = useState("");
    const currentLoc = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // console.log(currentLoc.state)
            if(currentLoc.state === 'item-card')
                navigate(-1);
            else if(currentLoc.state === null)
                navigate("/");
            else
                navigate(currentLoc.state);

        }
        catch(err) {
            console.log(err);
            setAuthError(err);
        }
    }

    const viaGoogle = (e) => {
        e.preventDefault();
        signInViaGoogle();
        navigate(-1);
        if(currentLoc.state === 'item-card')
            navigate(-1);
        else if(currentLoc.state === null)
            navigate("/");
        else
            navigate(currentLoc.state);
    }

  return (
    <>
        {/* <NavBar/> */}
        <Container className="my-5 sign-in" style={{ maxWidth: "50%" }}>
            {authError && <Alert variant='danger'>{authError.message}</Alert>}
            <h2 className='text-center mb-5'>Sign In</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} required />
                </Form.Group>
                <Button variant="danger" type="submit"  onClick={handleSubmit} style={{display: "block", width: "100%", marginBottom: "1rem"}}>Sign In</Button>
                <Button variant="danger" type="submit" onClick={viaGoogle} style={{display: "block", width: "100%", marginBottom: "2rem"}}>Sign In via <i class="fa-brands fa-google"></i></Button>
            </Form>

            <Row className="mt-3 d-sm-flex justify-content-between">
                <Col as={Link} to="/sign-up">Don't have an account!</Col>
                <Col className="text-end" as={Link} to="/forget-password">Forgot password</Col>
            </Row>
        </Container>

        {/* <Footer/> */}
    </>
  )
}
