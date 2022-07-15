import { React, useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom';
import '../css/style.css'
import { auth, db } from '../firebase-config'
import { addDoc, collection, query, getDocs, where } from "firebase/firestore"
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AddReview() {
  const { type, name, id } = useParams();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
//   const [currentUser, setCurrentUser] = useState(['']);
  const [reviewDone, setReviewDone] = useState('');

  const [story, setStory] = useState(0);
  const [animation, setAnimation] = useState(0);
  const [art, setArt] = useState(0);
  const [sound, setSound] = useState(0);
  const [character, setCharacter] = useState(0);
  const [overall, setOverall] = useState(0);
  const [review, setReview] = useState("");

  const [error, setError] = useState({});
//   const setFieldErrors = (field, value) => {
//       if(!!error[field])
//         setError({...error, [field]: null});
//   }

  const validate = () => {
      const newErrors = {};

      if(story < 0 || story > 10)
        newErrors.story = "Story score should be between 0 to 10";
      if(animation < 0 || animation > 10)
        newErrors.animation = "Animation score should be between 0 to 10";
      if(art < 0 || art > 10)
        newErrors.art = "Art score should be between 0 to 10";
      if(sound < 0 || sound > 10)
        newErrors.sound = "Sound score should be between 0 to 10";
      if(character < 0 || character > 10)
        newErrors.character = "Character score should be between 0 to 10";
      if(!overall || overall < 0 || overall > 10 || overall === '')
        newErrors.overall = "Overall score should be non-empty and should be between 0 to 10";
      if(!review || review === '')
        newErrors.review = "Review should be non-empty";

    return newErrors;
  }

  const createReview = async (e) => {
    e.preventDefault();

    console.log(reviewDone)
    if(reviewDone) {
        alert(`You have already reviewed the ${type}`);
        navigate(-1);
    }
    else {
        const resErrors = validate();
        if(Object.keys(resErrors).length > 0) {
            setError(resErrors);
        }
        else {
            try {
                await addDoc(collection(db, "reviews"), {
                    reviewId: String(new Date().getTime()),
                    uid: user.uid,
                    foreignItemId: id,
                    storyScore: story,
                    animationScore: animation,
                    soundScore: sound,
                    characterScore: character,
                    artScore: art,
                    overallScore: Number(overall),
                    postedDate: Number(new Date().getTime()),
                    likeCount: 0,
                    review: review
                });

                navigate(`/reviews/${type}/${name}/${id}`);
            }
            catch(err) {
                console.log(err);
            }
        }
    }
}

const fetchReviews = async() => {
    try {
        const queryRes = query(collection(db, "reviews"), where('uid', '==', user.uid), where('foreignItemId', '==', id));
        const docRes = await getDocs(queryRes);
        // setReviewDone(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
        const data = docRes.docs[0].data() || null;
        setReviewDone(data.review);
    }
    catch(err) {
        console.log(err)
    }  
}

  useEffect(() => {

    // const fetchUsers = async() => {
    //     try {
    //         const queryRes = query(collection(db, "users"), where('uid', '==', user.uid));
    //         const docRes = await getDocs(queryRes);
    //         setCurrentUser(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
    //     }
    //     catch(err) {
    //         console.log(err)
    //     }  
    // }

    if(!user)
        navigate("/sign-in", {state: `/add-review/${type}/${name}/${id}`})
    else {
        // fetchUsers()
        fetchReviews()
    }
  }, [user]
)


  return (
    <>
        {/* <NavBar/> */}

        <Container>
            <h2 className='text-center mt-5'>Add a review for {name}</h2>

            <Row className="mt-5">
                <Form>
                    <Row>
                        <Col sm>
                            <Form.Group as={Row} className="mb-3" controlId="formBasicStory">
                                <Form.Label column sm={4}>
                                    Story
                                </Form.Label>
                                {/* <Form.Control style={{ fontSize: 12, padding: 6, width: 70 }} type="number"/> */}
                                <Col sm={3} md={3} lg={3}>
                                    <Form.Control type="number" max={10} min={0} onChange={(e) => setStory(e.target.value)} isInvalid={!!error.story}/>
                                    <Form.Control.Feedback type="invalid">{error.story}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            {type === 'anime' &&
                                <Form.Group as={Row} className="mb-3" controlId="formBasicAnimation">
                                    <Form.Label column sm={4}>
                                        Animation 
                                    </Form.Label>
                                        {/* <Form.Control style={{ fontSize: 12, padding: 6, width: 70 }} type="number"/> */}
                                    <Col sm={3} md={3} lg={3}>
                                        <Form.Control type="number" max={10} min={0} onChange={(e) => setAnimation(e.target.value)} isInvalid={!!error.animation}/>
                                        <Form.Control.Feedback type="invalid">{error.animation}</Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            }

                            {type === 'manga' && 
                                <Form.Group as={Row} className="mb-3" controlId="formBasicArt">
                                    <Form.Label column sm={4}>
                                        Art
                                    </Form.Label>
                                        {/* <Form.Control style={{ fontSize: 12, padding: 6, width: 70 }} type="number"/> */}
                                    <Col sm={3} md={3} lg={3}>
                                        <Form.Control type="number" max={10} min={0} onChange={(e) => setArt(e.target.value)} isInvalid={!!error.art}/>
                                        <Form.Control.Feedback type="invalid">{error.art}</Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            }

                            {type === 'anime' &&
                                <Form.Group as={Row} className="mb-3" controlId="formBasicSound">
                                    <Form.Label column sm={4}>
                                        Sound 
                                    </Form.Label>
                                    {/* <Form.Control style={{ fontSize: 12,padding: 6, width: 70 }} type="number"/> */}
                                    <Col sm={3} md={3} lg={3}>
                                        <Form.Control type="number" max={10} min={0} onChange={(e) => setSound(e.target.value)} isInvalid={!!error.sound}/>
                                        <Form.Control.Feedback type="invalid">{error.sound}</Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            }

                            <Form.Group as={Row} className="mb-3" controlId="formBasicCharacter">
                                <Form.Label column sm={4}>
                                    Character
                                </Form.Label>
                                {/* <Form.Control style={{ fontSize: 12,padding: 6, width: 70 }} type="number"/> */}
                                <Col sm={3} md={3} lg={3}>
                                    <Form.Control type="number" max={10} min={0} onChange={(e) => setCharacter(e.target.value)} isInvalid={!!error.character}/>
                                    <Form.Control.Feedback type="invalid">{error.character}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3" controlId="formBasicOverall">
                                <Form.Label column sm={4}>
                                    Overall
                                </Form.Label>
                                {/* <Form.Control style={{ fontSize: 12,padding: 6, width: 70 }} type="number"/> */}
                                <Col sm={3} md={3} lg={3}>
                                    <Form.Control type="number" max={10} min={0} onChange={(e) => setOverall(e.target.value)} isInvalid={!!error.overall}/>
                                    <Form.Control.Feedback type="invalid">{error.overall}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col sm>
                            <Form.Group className="mb-3" controlId="Review.ControlTextarea1">
                                <Form.Label>Review</Form.Label>
                                <Form.Control as="textarea" rows={7}  placeholder="Review..." onChange={(e) => setReview(e.target.value)} isInvalid={!!error.review}/>
                                <Form.Control.Feedback type="invalid">{error.review}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="text-center my-5">
                        <Form.Group as={Col} className="mb-3">
                            <Button type="submit" onClick={createReview} variant='danger' className='w-100'>Save Review</Button>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3">
                            <Button type="reset" variant='danger' className='w-100'>Reset Review</Button>
                        </Form.Group>
                    </Row>

                </Form>
            </Row>
        </Container>

        {/* <Footer/> */}
    </>
  )
}
