import { useState, React }  from 'react'
import { Container, Form, Button, Row, Col, InputGroup, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, signUpViaGoogle } from '../firebase-config'
import { createUserWithEmailAndPassword } from "firebase/auth"
import { addDoc, collection } from "firebase/firestore";
import '../css/style.css'

export default function SignUp() {
    const[form, setForm] = useState({});
    const[errors, setErrors] = useState({});
    const setField = (field,  value) => {
        setForm({...form,[field]: value})

        if(!!errors[field])
            setErrors({...errors,[field]: null})
    }

    const [authError, setAuthError] = useState('')

    const navigate = useNavigate();

    const validateForm = () => {
        const {userName, email, password, confPassword} = form;
        const newErrors = {};
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/i;

        if(!userName || userName === '' || userName.length > 20 || userName.length < 3) 
            newErrors.userName = 'Please enter valid username!';
        else if(!email || email === '' || !regex.test(email)) 
            newErrors.email = 'Please enter valid email!';
        else if(!password || password === '' || password.length < 8) 
            newErrors.password = 'Please enter valid password! Password should be more than 8 characters';
        else if(!confPassword || confPassword === '' || confPassword !== password) 
            newErrors.confPassword = 'Confirm password mismatch!';

        return newErrors;
    }

    const signUp = async (userName, email, password) => {
        try {
          const res = await createUserWithEmailAndPassword(auth, email, password);
          const user = res.user;
        
          await addDoc(collection(db, "users"), {
            userName: userName,
            uid: user.uid,
            emailId: email,
            authProvider: 'local',
            img: "",
            gender: '',
            dob: '',  
            bio: ''
          });

          navigate("/profile");
        }
        catch(err) {
          console.log(err);
          setAuthError(err);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if(Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        }
        else{
            console.log('form submitted');
            console.log(form);
            
            const {userName, email, password} = form;

            signUp(userName, email, password);
            // console.log(res)
            // if(res !== -1){
            //     navigate("/profile");
            //     console.log(res)
            // }
            // else 
            //     setAuthError(true);
        }
    }

    const viaGoogle = (e) => {
        e.preventDefault();
        signUpViaGoogle();
        navigate("/profile");
    }

    return (
      <>
          <Container className="my-5 sign-in" style={{ maxWidth: "50%"}}>
            {authError && <Alert variant='danger'>{authError.message}</Alert>}
            <h2 className='text-center mb-5'>Sign Up</h2>
            <Form noValidate>
                <Form.Group className="mb-3" controlId="formGroupUsername">
                    <Form.Label>Username</Form.Label>       
                    <InputGroup>
                        <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                        <Form.Control type="text" placeholder="Enter username" value={form.userName} aria-describedby="inputGroupPrepend" required onChange={(e) => setField('userName', e.target.value)} isInvalid={!!errors.userName} />
                        <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                    </InputGroup>
                    <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={form.email} required onChange={(e) => setField('email', e.target.value)} isInvalid={!!errors.email} />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={form.password} required onChange={(e) => setField('password', e.target.value)} isInvalid={!!errors.password} />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                    <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={form.confPassword} required onChange={(e) => setField('confPassword', e.target.value)} isInvalid={!!errors.confPassword} />
                    <Form.Control.Feedback type="invalid">{errors.confPassword}</Form.Control.Feedback>
                    <Form.Text className="text-muted"></Form.Text>
                </Form.Group>
                <Button variant="danger" type="submit" onClick={handleSubmit} style={{display: "block", width: "100%", marginBottom: "1rem"}}>Sign Up</Button>
                <Button variant="danger" type="submit" onClick={viaGoogle} style={{display: "block", width: "100%", marginBottom: "2rem"}}>Sign Up via <i class="fa-brands fa-google"></i></Button>
            </Form>
            <Row className="mt-3">
                <Col as={Link} to="/sign-in" >Already have an account!</Col>
            </Row>
          </Container>

          {/* <Footer/> */}
      </>

  )
}
