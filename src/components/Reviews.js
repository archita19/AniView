import { React, useState } from 'react'
import { Button, Container, Navbar, Row, Dropdown, DropdownButton } from 'react-bootstrap'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { db, auth } from '../firebase-config'
import { query, getDocs, collection, where, addDoc, updateDoc, doc, orderBy, deleteDoc } from "firebase/firestore"
import { useAuthState } from 'react-firebase-hooks/auth'

function UserReview(props) {
  const { title, type, id, reviewId, itemid, revUsrId, date, story, animation, character, sound, overall, likes, review, art } = props;
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [helpful, setHelpful] = useState(1);
  const [docid, setDocId] = useState('');

  const [revUsr, setRevUsr] = useState({});

  const fetchRevUsr = async () => {
    try {
      const queryRes = query(collection(db, "users"), where("uid", "==", revUsrId));
      const docRes = await getDocs(queryRes);
      const data = docRes.docs[0].data() || null;
      setRevUsr(data);
    }
    catch(err) {
      console.log(err);
    }
  }


  const fetchLikeDislike = async () => {
    try {
      const queryRes = query(collection(db, "likedislike"), where("reviewId", "==", reviewId), where("uid", "==", user.uid));
      const docRes = await getDocs(queryRes);
      // const data = docRes.docs[0].data() || null;
      const docId = docRes.docs[0].id;
      setDocId(docId)
    }
    catch(err) {
      console.log(err);
    }
  }

  const updateHelpfulCount = async(id) => {
    try {
      const resDoc = doc(db, "reviews", id);
      await updateDoc(resDoc, {
        likeCount: Number(likes + helpful),
      })
    }
    catch(err) {
      console.log(err);
    }
  }

  // const updateLikeDislike = async(id) => {
  //   console.log(id)
  //   try {
  //       const resDoc = doc(db, "likedislike", id);
  //       await updateDoc(resDoc, {helpful: helpful})
  //   }
  //   catch(err) {
  //     console.log(err);
  //   }
  // }

  const addLikeDislike = async() => {
    try {
      console.log(docid)
      if(docid) {
        // updateLikeDislike(docid)
        alert("You have already liked the review")
      }
      else {
          await addDoc(collection(db, "likedislike"), {
            uid: user.uid,
            helpful: helpful,
            reviewId: reviewId
          })
          updateHelpfulCount(id)
          navigate(0);
          // window.location.reload(false);
          // navigate(`/reviews/${type}/${title}/${id}`)
      }
    }
    catch(err) {
      console.log(err);
    }
  }

  const addLike = () => {
    // if(!user) 
    //   navigate('/sign-in', {state: `/reviews/${type}/${title}/${itemid}`});

    if(helpful === 1) 
      setHelpful(-1);
    else
      setHelpful(1)


    addLikeDislike()
    // props.help(Math.floor(Math.random() * 100) + 1)
    // navigate(`/reviews/${type}/${title}/${itemid}`)
  }

  const [delDocId, setDelDocId] = useState('');
  const [delUser, setDelUserId] = useState('');
  const [delRevId, setDelRevId] = useState('');
  const fetchCurrentUserReview = async() => {
    try {
      console.log(itemid);
      const delRes = query(collection(db, "reviews"), where("uid", "==", user.uid), where("foreignItemId", "==", itemid));
      const docRes = await getDocs(delRes);
      const data = docRes.docs[0].data() || null;
      const delUid = data.uid;
      setDelUserId(delUid)
      const delRev = data.reviewId
      setDelRevId(delRev)
      const docId = docRes.docs[0].id;
      setDelDocId(docId)
    }
    catch(err) {
      console.log(err);
    }
  }

  const deleteReview = async() => {
    console.log(delDocId)
    try{
      const delDoc = doc(db, "reviews", delDocId);
      await deleteDoc(delDoc);
    }
    catch(err) {
      console.log(err);
    } 
    // navigate(`/reviews/${type}/${title}/${itemid}`)
    window.location.reload(false);
  }

  useEffect(() => {
    fetchLikeDislike()
    fetchCurrentUserReview()
    fetchRevUsr()
  }, [])

  useEffect(() => {
    fetchRevUsr();
  }, [revUsrId])

  useEffect(() => {
    fetchLikeDislike()
  }, [likes, helpful])

  return (
    <div className='mb-4'>
     <div className='d-flex gap-3 align-items-center mb-3'>
      <img className='img-thumbnail rounded-circle' src={revUsr && revUsr.img === "" ? process.env.PUBLIC_URL + '/../imgs/profile-avatar.png' : revUsr && revUsr.img} width={80} height={80} alt="user-profile"/>
      <div>
        <p className='mb-0 fs-4'>{revUsr && revUsr.userName}</p>
        <p>{date}</p>
      </div>
    </div>
    <div className='text-justify mb-3'>
    {review}
    </div>
    <div className='table-responsive-sm mb-3'>
      <table className='table-sm text-center w-100 table-borderless fw-bold'>
        <tr>
          <td>{story}/10</td>
          { type === 'anime' && 
            <>
              <td>{animation}/10</td>
              <td>{sound}/10</td>
            </>
          }
          { type === 'manga' && 
              <td className='w-25'>{art}/10</td>
          }
          <td>{character}/10</td>
          <td>{overall}/10</td>
        </tr>
        <tr>
          <td className='px-4'>Story</td>
          { type === 'anime' && 
              <>
                <td className='px-4'>Animation</td>
                <td className='px-4'>Sound</td>
              </>
          }
          { type === 'manga' && 
              <td className='px-4'>Art</td>
          }
          <td className='px-4'>Characters</td>
          <td className='px-4'>Overall</td>
        </tr>
      </table>
    </div>
    <div className='d-flex justify-content-center gap-2 bg-light py-2 review-sec-bg'>
      <Button variant="outline-danger" className='border-0' onClick={addLike}><i class="fa-solid fa-thumbs-up"></i> {likes} Helpful</Button>
      {delUser === user.uid && delRevId === reviewId && <Button variant="outline-danger" className='border-0' onClick={deleteReview}><i class="fa-solid fa-trash"></i> Delete</Button>}
    </div>
    </div>
  )
}

export default function Reviews() {
  // const title = 'Teenage Mercury';
  const [sortCriteria, setSortCriteria] = useState('Newest')
  const [valueReviewSort, setValueReviewSort] = useState('postedDate');
  // const handleReviewSort = () => {
  //   if(valueReviewSort === 'Newest') {
  //     console.log("newest " + valueReviewSort)
  //     setSortCriteria('postedDate')
  //   }
  //   else if(valueReviewSort === 'Overall Score') {
  //     console.log("os " + valueReviewSort)
  //     setSortCriteria('overallScore')
  //   }
  //   else {
  //     console.log("helpful " + valueReviewSort)
  //     setSortCriteria('likeCount')
  //   }

  //   console.log(sortCriteria);
  //   // fetchReviews()
  //   // setResReviews([]);
  // }

  const { type, name, id } = useParams();

  const [resReviews, setResReviews] = useState([]);

  const fetchReviews = async() => {
    try {
      const queryReviews = query(collection(db, "reviews"), where("foreignItemId", "==", id), orderBy(valueReviewSort, 'desc'));
      const docRes = await getDocs(queryReviews);
      setResReviews(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
    }
    catch(err) {
      console.log(err);
      // alert("An error occured while fetching reviews");
    }
  }

  useEffect(() => {
    if(valueReviewSort === 'postedDate') {
      setSortCriteria('Newest')
      // localStorage.setItem("reviewSortCriteria", 'postedDate')
    }
    else if(valueReviewSort === 'overallScore') {
      setSortCriteria('Overall Score')
      // localStorage.setItem("reviewSortCriteria", 'overallScore')
    }
    else {
      setSortCriteria('Most Helpful')
      // localStorage.setItem("reviewSortCriteria", 'likeCount')
    }

    fetchReviews()
  }, [valueReviewSort]);

  const [temp, setTemp] = useState(0)
  const getHelpful = (val) => {
    setTemp(val)
  }

  useEffect(() => {
    fetchReviews()
  }, [temp])

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if(!user && !localStorage.getItem('User')) 
      navigate('/sign-in', {state: `/reviews/${type}/${name}/${id}`});
    else
      localStorage.setItem('User', user)
  }, [])

  return (
    <>
        {/* <NavBar/> */}

        <Navbar>
            <Container className='border border-2 border-danger border-top-0 border-start-0 border-end-0 pb-2'>
                <Navbar.Brand href={`/reviews/${type}/${name}/${id}`} className='title'>{name}</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
                    <Button variant='danger' as={Link} to={`/add-review/${type}/${name}/${id}`} style={{ color: "#fff" }}><i class="fa-solid fa-plus"></i> Review</Button>
                </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>

        <Container className='d-flex gap-4 my-4 flex-wrap'>
          <h3>{resReviews.length} reviews</h3>
          <DropdownButton id="dropdown-basic-button" title={sortCriteria} onSelect={(e) => setValueReviewSort(e)} variant="danger" className='ms-auto'>
            <Dropdown.Item eventKey='postedDate'>Newest</Dropdown.Item>
            <Dropdown.Item eventKey='likeCount'>Most Helpful</Dropdown.Item>
            <Dropdown.Item eventKey="overallScore">Overall Score</Dropdown.Item>
          </DropdownButton>
        </Container>

        {/* <Container className='d-flex gap-4 my-4 flex-wrap'>
          <span style={{ border: "2px solid #bb2d3b", padding: "0.8rem", borderRadius: "0.5rem"}}>Happy(7)</span>
          <span style={{ border: "2px solid #bb2d3b", padding: "0.8rem", borderRadius: "0.5rem"}}>Boring(19)</span>
          <span style={{ border: "2px solid #bb2d3b", padding: "0.8rem", borderRadius: "0.5rem"}}>Action(5)</span>
          <span style={{ border: "2px solid #bb2d3b", padding: "0.8rem", borderRadius: "0.5rem"}}>Pathetic(20)</span>
          <span style={{ border: "2px solid #bb2d3b", padding: "0.8rem", borderRadius: "0.5rem"}}>Thrilling(7)</span>
          <span style={{ border: "2px solid #bb2d3b", padding: "0.8rem", borderRadius: "0.5rem"}}>Suspense(7)</span>
        </Container> */}

        <Container>
          <Row className='mb-4'>
            {type === 'anime' &&
            resReviews && resReviews.map((rev) => <UserReview type={type} id={rev.id} title={name} itemid={id} reviewId={rev.reviewId} revUsrId={rev.uid} date={(new Date(rev.postedDate)).toLocaleDateString('pt-PT')} 
            story={rev.storyScore} animation={rev.animationScore} character={rev.characterScore} sound={rev.soundScore} overall={rev.overallScore}
            likes={rev.likeCount} review={rev.review} art="" help={getHelpful} /> )}

            {type === 'manga' &&
            resReviews && resReviews.map((rev) => <UserReview type={type} id={rev.id} title={name} itemid={id} reviewId={rev.reviewId} revUsrId={rev.uid} date={(new Date(rev.postedDate)).toLocaleDateString('pt-PT')} 
            story={rev.storyScore} animation="" sound="" art={rev.artScore} character={rev.characterScore} overall={rev.overallScore}
            likes={rev.likeCount} review={rev.review} help={getHelpful} /> )}
          </Row>
        </Container>

        {/* <Footer/> */}
    </>
  )
}
