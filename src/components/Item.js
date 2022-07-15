import { React, useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import {
  query,
  getDocs,
  collection,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import CardComponent from "./CardComponent";
import {
  Button,
  Container,
  Navbar,
  Row,
  Col,
  Modal,
  Form,
  ListGroup,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import "../css/style.css";
import { useAuthState } from "react-firebase-hooks/auth";

function MyVerticallyCenteredModal(props) {
  const [rating, setRating] = useState(0);
  // const {show, onHide, title, currentRating} = props;

  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // const [allRatings, setAllRatings] = useState(['']);
  const [userRating, setUserRating] = useState([""]);

  // const fetchRatings = async() => {
  //   try {
  //     const q = query(collection(db, 'rating'), where('itemId', '==', props.itemId));
  //     const docRatingRes = await getDocs(q);
  //     setAllRatings(docRatingRes.docs.map(doc => ({...doc.data(), id: doc.id})))
  //   }
  //   catch(err) {
  //     console.log(err);
  //     // alert("An error occured while fetching data 1");
  //   }
  // }

  // const [ratingCount, setRatingCount] = useState(0);
  // const fetchItem = async() => {
  //   try {
  //     const queryRes = query(collection(db, 'animes'), where('itemId', '==', props.itemId));
  //     const docRes = await getDocs(queryRes);
  //     // setAllRatings(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
  //     const data = docRes.docs[0].data() || null;
  //     const fetchedRatingCount = data.ratingCount;
  //     setRatingCount(fetchedRatingCount)
  //   }
  //   catch(err) {
  //     console.log(err);
  //     // alert("An error occured while fetching data 1");
  //   }
  // }

  const fetchUserRatings = async () => {
    try {
      const queryRating = query(
        collection(db, "rating"),
        where("itemId", "==", props.itemId),
        where("uid", "==", user.uid)
      );
      const docRes = await getDocs(queryRating);
      // const data = docRes.docs[0].data() || null;
      // setUserRating(data);
      setUserRating(docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.log(err);
      // alert("An error occured while fetching data 1");
    }
  };

  const addRating = async () => {
    console.log(userRating);
    // console.log(allRatings.length)

    if (userRating.length !== 0) {
      alert(`You have already rated the ${props.itemType}`);
    } else {
      try {
        await addDoc(collection(db, "rating"), {
          itemId: props.itemId,
          itemType: props.itemType,
          stars: rating,
          uid: user.uid,
        });

        // console.log(props.currentRating)
        // console.log(allRatings.length)
        // console.log((props.currentRating + rating) / allRatings.length)

        let totalRating = props.currentRating + rating;
        if (props.length !== 0) totalRating = totalRating / (props.length + 1);

        const resDoc = doc(db, "animes", props.docId);
        await updateDoc(resDoc, {
          rating: Number(totalRating),
          ratingCount: Number(props.length + 1),
        });

        // window.location.reload(false);
        props.rating(rating)
        // navigate(`/${props.itemType}/${props.itemId}`)
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // props.rating(rating);
    console.log(user);
    if (!user) navigate("/sign-in");
    else {
      addRating();
      console.log(props.itemId)
      console.log(props.itemType)
      navigate(`/${props.itemType}/${props.itemId}`)
    }
  };

  useEffect(() => {
    // fetchRatings();
    // fetchItem();
    fetchUserRatings();
    // setRating(rating)
  }, [rating]);

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton className="modal-bg">
        <Modal.Title
          id="contained-modal-title-vcenter"
          className="w-100 text-center"
        >
          <span style={{ color: "#bb2d3b", fontWeight: "bold" }}>
            {props.title}
          </span>
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="w-100 text-center modal-body-bg">
          {[...Array(10)].map((star, i) => {
            const ratingVal = i + 1;

            return (
              <label key={ratingVal}>
                <input
                  type="radio"
                  name="rating"
                  style={{ display: "none" }}
                  value={ratingVal}
                  onClick={() => setRating(ratingVal)}
                />
                <i
                  className="fa-solid fa-star px-1"
                  style={{ cursor: "pointer" }}
                  id={ratingVal <= rating ? "on" : "off"}
                ></i>
              </label>
            );
          })}
          <p className="mt-2">Rating is {rating}</p>
        </Modal.Body>
        <Modal.Footer className="modal-bg">
          <Button
            type="submit"
            onClick={props.onHide}
            variant="danger"
            className="w-100 text-center"
          >
            Rate
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

function CharacterCard(props) {
  const { name, role, img } = props;
  return (
    <Col
      xs={12}
      md={4}
      lg={6}
      className="d-flex gap-3 align-items-center p-2 border-danger"
    >
      <img
        className="img-thumbnail rounded-circle"
        src={
          img === ""
            ? process.env.PUBLIC_URL + "/../imgs/profile-avatar.png"
            : img
        }
        width={70}
        height={70}
        alt="user-profile"
      />
      <div>
        <p className="mb-0">{name}</p>
        <p>{role}</p>
      </div>
    </Col>
  );
}

function ReviewCard(props) {
  const { userId, date, review, overallScore, likes } = props;

  const [revUsr, setRevUsr] = useState({});

  const fetchRevUsr = async () => {
    try {
      const queryRes = query(
        collection(db, "users"),
        where("uid", "==", userId)
      );
      const docRes = await getDocs(queryRes);
      const data = docRes.docs[0].data() || null;
      setRevUsr(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRevUsr();
  }, []);

  let revText = "";
  if (review.length > 100) {
    revText = review.substring(0, 100);
    revText += " ...";
  } else revText = review;

  return (
    <Col sm className="border p-2 border-danger">
      <div className="d-flex gap-3 align-items-center mb-1">
        <img
          className="img-thumbnail rounded-circle"
          src={
            revUsr && revUsr.img === ""
              ? process.env.PUBLIC_URL + "/../imgs/profile-avatar.png"
              : revUsr && revUsr.img
          }
          width={55}
          height={55}
          alt="user-profile"
        />
        <div className="text-wrap">
          <p className="mb-0">{revUsr && revUsr.userName}</p>
          <p>{date}</p>
        </div>
        <p className="align-self-start ms-auto">{overallScore}/10</p>
      </div>
      <div className="mb-1">{revText}</div>
      <div className="d-flex gap-2">
        <Button variant="danger disabled" className="border-0 mt-1">
          <i class="fa-solid fa-thumbs-up"></i> {likes} Helpful
        </Button>
        {/* <Button variant="outline-danger" className='border-0'><i class="fa-solid fa-thumbs-down"></i> 3</Button> */}
      </div>
    </Col>
  );
}

export default function Item() {
  const { type, id } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [btnRating, setBtnRating] = useState(0);

  const getRating = (data) => {
    setBtnRating(data);
  };

  const [resData, setResData] = useState([""]);
  const [resChars, setResCharsData] = useState([""]);
  const [resStaffs, setResStaffsData] = useState([""]);

  const fetchData = async () => {
    console.log(id);
    try {
      const queryRes = query(
        collection(db, "animes"),
        where("animeId", "==", id)
      );
      const docRes = await getDocs(queryRes);
      setResData(docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // const data = docRes.docs[0].data();
      // setResData(data);

      const queryResChars = query(
        collection(db, "characters"),
        where("foreignId", "==", id)
      );
      const docResChars = await getDocs(queryResChars);
      setResCharsData(
        docResChars.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );

      const queryResStaffs = query(
        collection(db, "staffs"),
        where("foreignId", "==", id)
      );
      const docResStaffs = await getDocs(queryResStaffs);
      setResStaffsData(
        docResStaffs.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    } catch (err) {
      console.log(err);
      alert("An error occured while fetching data 1");
    }
  };

  const [resMore, setResMoreData] = useState([""]);

  const fetchMoreData = async () => {
    try {
      if (resData[0]) {
        console.log(resData[0].genreArray);
        const queryRes = query(
          collection(db, "animes"),
          where("animeId", "!=", id),
          where("itemType", "==", type),
          where(
            "genreArray",
            "array-contains-any",
            resData[0] && resData[0].genreArray
          ),
          limit(4)
        );
        const docRes = await getDocs(queryRes);
        setResMoreData(
          docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    } catch (err) {
      console.log(err);
      // alert("An error occured while fetching data 2");
    }
  };

  const [resRelated, setRelatedData] = useState([""]);

  const fetchRelatedData = async () => {
    try {
      if (resData[0]) {
        console.log(resData[0].genreArray);
        const queryRes = query(
          collection(db, "animes"),
          where("itemType", "==", type === 'anime' ? 'manga' : 'anime'),
          where(
            "genreArray",
            "array-contains-any",
            resData[0] && resData[0].genreArray
          ),
          limit(4)
        );
        const docRes = await getDocs(queryRes);
        setRelatedData(
          docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    } catch (err) {
      console.log(err);
      // alert("An error occured while fetching data 2");
    }
  };

  const [user] = useAuthState(auth);
  // const [uid, setUid] = useState(userId);

  useEffect(() => {
    // setUid(userId || user.uid)

    fetchData();
    fetchReviews();
    fetchList();
    // fetchMoreData();
  }, [user]);

  useEffect(() => {
    fetchData();
    fetchReviews();
    // fetchMoreData();
  }, [id, type]);

  useEffect(() => {
    fetchData();
  }, [btnRating]);

  useEffect(() => {
    fetchMoreData();
    fetchRelatedData();
    console.log(resMore);
  }, [resData[0]]);

  const [resReviews, setResReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const queryReviews = query(
        collection(db, "reviews"),
        where("foreignItemId", "==", id),
        orderBy("postedDate", "desc"),
        limit(3)
      );
      const docRes = await getDocs(queryReviews);
      setResReviews(docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // docRes.forEach(review => {
      //   var data = review.data();
      //   setResReviews(ele => [...ele, data]);
      // })
    } catch (err) {
      console.log(err);
      alert("An error occured while fetching reviews");
    }
  };

  const [favList, setFavList] = useState("");
  const navigate = useNavigate();
  const fetchList = async () => {
    try {
      // console.log(uid);
      const queryList = query(
        collection(db, "favlist"),
        where("itemId", "==", id),
        where("uid", "==", user.uid)
      );
      const docRes = await getDocs(queryList);
      // setResReviews(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
      const data = docRes.docs[0].data() || null;
      setFavList(data.title);
    } catch (err) {
      console.log(err);
      // alert("An error occured while fetching favlist");
    }
  };

  const addToFavList = async () => {
    let status = "Unwatched";
    if (type === "manga") status = "Unread";

    try {
      await addDoc(collection(db, "favlist"), {
        itemType: type,
        fid: String("favlist" + new Date().getTime()),
        uid: user.uid,
        itemId: id,
        title: resData[0].title,
        status: status,
      });

      navigate("/my-fav-list");
    } catch (err) {
      console.log(err);
    }
  };

  const handleList = () => {
    if (!user)      
      navigate("/sign-in", {state: "item-card"});
    else {
      console.log(favList);
      if (favList) {
        alert(`${favList} is already added in your FavList!`);
        navigate("/my-fav-list");
      } else {
        addToFavList();
      }
    }
  };

  return (
    <>
      {/* <NavBar/> */}

      <Navbar>
        <Container className="border border-2 border-danger border-top-0 border-start-0 border-end-0 pb-2">
          <Navbar.Brand href={`/${type}/${id}`} className="title text-wrap">
            {resData[0].title}
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="d-flex gap-2 align-items-center">
              <span className="title">
                <i className="fa-solid fa-star"></i>
                {(Math.round(resData[0].rating * 100) / 100).toFixed(1)}/10
              </span>
              <Button
                variant="outline-danger"
                onClick={() => setModalShow(true)}
              >
                <i className="fa-solid fa-star"></i> Rate
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        itemType={type}
        title={resData[0].title}
        currentRating={resData[0].rating}
        itemId={id}
        docId={resData[0].id}
        length={resData[0].ratingCount}
        rating={getRating}
      />

      <Container className="my-5">
        <div className="d-sm-flex justify-content-center">
          {type === "anime" && (
            <ReactPlayer
              url={resData[0].trailerURL}
              controls
              width="100%"
              height="390px"
            />
          )}

          {type === "manga" && (
            <img
              className="img-fluid w-100"
              src={resData[0].imgHead}
              style={{ objectFit: "cover", height: "400px" }}
              alt={type}
            />
          )}
        </div>
      </Container>

      <Container className="mb-5">
        <div className="d-flex gap-4 my-4 flex-wrap">
          {resData[0] &&
            resData[0].genre.split(", ").map((genre, i) => (
              <span
                key={i}
                style={{
                  border: "2px solid #bb2d3b",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                {genre}
              </span>
            ))}
        </div>
        <Row>
          <Col sm>
            {type === "anime" ? (
              <>
                <p className="d-flex gap-2">
                  <span className="w-25 fw-bold">No. of episodes</span>:{" "}
                  <span>
                    {resData[0].noOfEpisodes}eps x {resData[0].duration}mins{" "}
                    {resData[0].noOfEpisodes === "1"
                      ? "(Movie)"
                      : "(TV Series)"}
                  </span>
                </p>
                <p className="d-flex gap-2">
                  <span className="w-25 fw-bold">Animation Studio</span>:{" "}
                  <span>{resData[0].animationStudio}</span>
                </p>
                <p className="d-flex gap-2">
                  <span className="w-25 fw-bold">Year of Release & End</span>:{" "}
                  <span>
                    {resData[0] && resData[0].yearOfRelease.substring(0, 4)}-
                    {resData[0].yearOfEnd === ""
                      ? "?"
                      : resData[0] && resData[0].yearOfEnd.substring(0, 4)}
                  </span>
                </p>
              </>
            ) : (
              <>
                <p className="d-flex gap-2">
                  <span className="w-50 fw-bold">No. of chapters</span>:{" "}
                  <span>{resData[0].noOfEpisodes} Chps</span>
                </p>
                <p className="d-flex gap-2">
                  <span className="w-50 fw-bold">Publication Studio</span>:{" "}
                  <span>{resData[0].animationStudio}</span>
                </p>
                <p className="d-flex gap-2">
                  <span className="w-50 fw-bold">Year of Release & End</span>:{" "}
                  <span>
                    {resData[0] && resData[0].yearOfRelease.substring(0, 4)}-
                    {resData[0].yearOfEnd === ""
                      ? "?"
                      : resData[0] && resData[0].yearOfEnd.substring(0, 4)}
                  </span>
                </p>
              </>
            )}
          </Col>
          <Col sm>
            <Button
              variant="danger"
              className="w-100 mb-2"
              onClick={handleList}
            >
              <i className="fa-solid fa-plus"></i>{" "}
              {type === "anime" ? "Watchlist" : "Readlist"}
            </Button>
            <Button
              variant="danger"
              className="w-100 mb-2"
              as={Link}
              to={`/add-review/${type}/${resData[0].title}/${id}`}
              style={{ color: "#fff" }}
            >
              <i class="fa-solid fa-plus"></i> Review
            </Button>
          </Col>
        </Row>
      </Container>

      <Container className="mb-5">
        <h3 className="bg-light py-2 ps-2 mb-3 review-sec-bg">Characters</h3>
        <Row className="px-3">
          {resChars.map((c) => (
            <CharacterCard name={c.name} role={c.vocal} img={c.img} />
          ))}
        </Row>
      </Container>

      <Container className="mb-5">
        <h3 className="bg-light py-2 ps-2 mb-3 review-sec-bg">Staffs</h3>
        <Row className="px-3">
          {resStaffs.map((c) => (
            <CharacterCard name={c.name} role={c.role} img={c.img} />
          ))}
        </Row>
      </Container>

      <Container className="mb-5">
        <h3 className="bg-light py-2 ps-2 mb-3 review-sec-bg">User Reviews</h3>
        <Row className="px-3 gap-3">
          {resReviews.map((r) => (
            <ReviewCard
              userId={r.uid}
              date={new Date(r.postedDate).toLocaleDateString("pt-PT")}
              review={r.review}
              overallScore={r.overallScore}
              likes={r.likeCount}
            />
          ))}
        </Row>
        <Button
          variant="danger"
          className="mt-3 ms-1"
          as={Link}
          to={`/reviews/${type}/${resData[0].title}/${id}`}
        >
          See All Reviews<i className="fa-solid fa-angle-right"></i>
        </Button>
      </Container>

      <Container className="mb-5">
        <h3 className="bg-light py-2 ps-2 mb-3 review-sec-bg">
          More Like This
        </h3>
        {/* {type === 'anime' ? <CardSlider type="anime" arr={resMore} date="no"/> : <CardSlider type="mangas"/>} */}
        {/* <CardSlider type="anime" arr={resMore} date="no"/> */}
        <Row>
          {resMore &&
            resMore.map((d) => {
              return (
                <Col key={d.animeId} xs={12} md={6} lg={3}>
                  <CardComponent
                    type={d.itemType}
                    id={d.animeId}
                    img={d.imgRef}
                    title={d.title}
                    rating={d.rating}
                    btnName={d.itemType === "anime" ? "Watchlist" : "Readlist"}
                    date=""
                  />
                </Col>
              );
            })}
        </Row>
      </Container>

      <Container className="mb-5">
        <h3 className="bg-light py-2 ps-2 mb-3 review-sec-bg">
          Related {type === 'anime' ? 'Mangas' : 'Animes'}
        </h3>
        {/* {type === 'anime' ? <CardSlider type="anime" arr={resMore} date="no"/> : <CardSlider type="mangas"/>} */}
        {/* <CardSlider type="anime" arr={resMore} date="no"/> */}
        <Row>
          {resRelated &&
            resRelated.map((d) => {
              return (
                <Col key={d.animeId} xs={12} md={6} lg={3}>
                  <CardComponent
                    type={d.itemType}
                    id={d.animeId}
                    img={d.imgRef}
                    title={d.title}
                    rating={d.rating}
                    btnName={d.itemType === "anime" ? "Watchlist" : "Readlist"}
                    date=""
                  />
                </Col>
              );
            })}
        </Row>
      </Container>

      <Container className="mb-5">
        <h3 className="bg-light py-2 ps-2 mb-3 review-sec-bg">Storyline</h3>
        <Row className="mb-3">
          <Col sm md={8}>
            <p style={{ textAlign: "justify" }}>{resData[0].storyLine}</p>
          </Col>
          <Col sm>
            <ListGroup>
              {type === "anime" ? (
                <>
                  <ListGroup.Item className="d-flex gap-2 border border-danger list-bg">
                    <span className="w-25">{resData[0].watched}</span> Watched
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex gap-2 border border-danger border-top-0 list-bg">
                    <span className="w-25">{resData[0].watching}</span> Watching
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex gap-2 border border-danger border-top-0 list-bg">
                    <span className="w-25">{resData[0].wantToWatch}</span> Want
                    to Watch
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex gap-2 border border-danger border-top-0 list-bg">
                    <span className="w-25">{resData[0].dropped}</span> Dropped
                  </ListGroup.Item>
                </>
              ) : (
                <>
                  <ListGroup.Item className="d-flex gap-2 border border-danger list-bg">
                    <span className="w-25">{resData[0].reading}</span> Reading
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex gap-2 border border-danger border-top-0 list-bg">
                    <span className="w-25">{resData[0].wantToRead}</span> Want
                    to Read
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex gap-2 border border-danger border-top-0 list-bg">
                    <span className="w-25">{resData[0].dropped}</span> Dropped
                  </ListGroup.Item>
                </>
              )}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          {type === "anime" && (
            <>
              <Col sm>
                <p className="d-flex gap-2">
                  <span className="w-30 fw-bold">Content Warning</span>:{" "}
                  <span>{resData[0].contentWarning}</span>
                </p>
                <p className="d-flex gap-2">
                  <span className="w-30 fw-bold">Sound tracks</span>:{" "}
                  <span>{resData[0].soundTracks}</span>
                </p>
              </Col>
            </>
          )}
          <Col sm>
            <p className="d-flex gap-2">
              <span className="w-30 fw-bold">Genre</span>:{" "}
              <span>{resData[0].genre}</span>
            </p>
          </Col>
          {/* <Col sm>
            {type === 'anime' && 
              <DropdownButton id="dropdown-basic-button" title={valueAnime} onSelect={handleSelectAnime} variant="danger">
                <Dropdown.Item eventKey="Unwatched">Unwatched</Dropdown.Item>
                <Dropdown.Item eventKey="Watched">Watched</Dropdown.Item>
                <Dropdown.Item eventKey="Watching">Watching</Dropdown.Item>
                <Dropdown.Item eventKey="Want to Watch">Want to Watch</Dropdown.Item>
                <Dropdown.Item eventKey="Dropped">Dropped</Dropdown.Item>
              </DropdownButton>
            }
            
            {type === 'manga' && 
              <DropdownButton id="dropdown-basic-button" title={valueManga} onSelect={handleSelectManga} variant="danger">
                <Dropdown.Item eventKey="Unread">Unread</Dropdown.Item>
                <Dropdown.Item eventKey="Reading">Reading</Dropdown.Item>
                <Dropdown.Item eventKey="Want to Read">Want to Read</Dropdown.Item>
                <Dropdown.Item eventKey="Dropped">Dropped</Dropdown.Item>
              </DropdownButton>
            }
            </Col> */}
        </Row>
      </Container>

      {/* <Container className='mb-5'>
          <h3 className='bg-light py-2 ps-2 mb-3 review-sec-bg'>Related {type === 'anime' ? "Mangas" : "Animes"}</h3>
          {type === 'anime' ? <CardSlider type="mangas"/> : <CardSlider type="animes"/>}
        </Container> */}

      {/* <Footer/> */}
    </>
  );
}
