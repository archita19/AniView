import { React, useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from '../firebase-config'
import { confirmPasswordReset } from "firebase/auth"

function useQuery() {
    const location = useLocation();
    return new URLSearchParams(location.search);
}

export default function ResetPassword() {
    const[password, setPassword] = useState("");
    const[confPassword, setConfPassword] = useState("");
    const[authError, setAuthError] = useState("");
    const[errors, setErrors] = useState({});
    const query = useQuery();

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {}

        if(!password || password === '' || password.length < 8) 
            newErrors.password = 'Please enter valid password! Password should be more than 8 characters';
        else if(!confPassword || confPassword === '' || confPassword !== password) 
            newErrors.confPassword = 'Confirm password mismatch!';

        return newErrors;
    }

    const changePassword = async (oobCode, newPassword) => {
        try {
          await confirmPasswordReset(auth, oobCode, newPassword);
          setAuthError("");
        } catch (err) {
          console.log(err);
          setAuthError(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if(Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        }
        else {
            console.log("change password");
            changePassword(query.get('oobCode'), password);
            alert("Password changed successfully!");
            navigate('/sign-in');
        }
    }

  return (
    <>
        <Container className="my-5 sign-in" style={{ maxWidth: "50%" }}>
            {authError !== "" && (
            <Alert variant="danger">{authError.message}</Alert>
            )}
            <h2 className='text-center mb-5'>Reset Password</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} required isInvalid={!!errors.password}/>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGroupConfPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={confPassword} onChange={(e) => {setConfPassword(e.target.value)}} required isInvalid={!!errors.confPassword} />
                    <Form.Control.Feedback type="invalid">{errors.confPassword}</Form.Control.Feedback>
                </Form.Group>
                
                <Button variant="danger" type="submit"  onClick={handleSubmit} style={{display: "block", width: "100%", marginBottom: "1rem"}}>Reset Password</Button>
            </Form>
        </Container>
    </>
  )
}
