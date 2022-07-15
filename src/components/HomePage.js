import React, { useState, useEffect } from "react";
import CardSlider from "./CardSlider";
import {
  Carousel,
  Button,
  Container,
  Card,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import {
  query,
  getDocs,
  collection,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import "../css/style.css";

export default function HomePage() {
  const [sortCriteria, setSortCriteria] = useState("Popular");
  const [valueAnimeSort, setValueAnimeSort] = useState("rating");
  const [animeData, setAnimeData] = useState([]);

  const fetchAnimes = async () => {
    try {
      let sortOrder = "desc";
      if (valueAnimeSort === "title") sortOrder = "asc";

      const queryRes = query(
        collection(db, "animes"),
        where("itemType", "==", "anime"),
        orderBy(valueAnimeSort, sortOrder),
        limit(8)
      );
      const docRes = await getDocs(queryRes);
      setAnimeData(docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.log(err);
      alert("An error occured while fetching animes");
    }
  };

  useEffect(() => {
    if (valueAnimeSort === "rating") {
      setSortCriteria("Popular");
    } else if (valueAnimeSort === "title") {
      setSortCriteria("Name");
    } else if (valueAnimeSort === "addedDate") {
      setSortCriteria("Date Added");
    } else if (valueAnimeSort === "yor") {
      setSortCriteria("Latest");
    } else {
      setSortCriteria("Most Watched");
    }

    fetchAnimes();
  }, [valueAnimeSort]);

  const [sortMangaCriteria, setSortMangaCriteria] = useState("Popular");
  const [valueMangaSort, setValueMangaSort] = useState("rating");

  const [mangaData, setMangaData] = useState([]);

  const fetchMangas = async () => {
    try {
      let sortOrder = "desc";
      if (valueMangaSort === "title") sortOrder = "asc";

      const queryRes = query(
        collection(db, "animes"),
        where("itemType", "==", "manga"),
        orderBy(valueMangaSort, sortOrder),
        limit(8)
      );
      const docRes = await getDocs(queryRes);
      setMangaData(docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.log(err);
      alert("An error occured while fetching mangas");
    }
  };

  useEffect(() => {
    if (valueMangaSort === "rating") {
      setSortMangaCriteria("Popular");
    } else if (valueMangaSort === "title") {
      setSortMangaCriteria("Name");
    } else if (valueMangaSort === "addedDate") {
      setSortMangaCriteria("Date Added");
    } else if (valueMangaSort === "yor") {
      setSortMangaCriteria("Latest");
    } else {
      setSortMangaCriteria("Most Reading");
    }

    fetchMangas();
  }, [valueMangaSort]);

  // const [sortUpcomingCriteria, setSortUpcomingCriteria] = useState('Anime');
  const [valueUpcomingSort, setValueUpcomingSort] = useState("anime");
  const [newData, setNewData] = useState([]);

  const fetchNewData = async () => {
    try {
      const queryRes = query(
        collection(db, "animes"),
        where("yor", ">=", new Date().getTime()),
        where("itemType", "==", valueUpcomingSort),
        orderBy("yor", "asc"),
        limit(8)
      );
      const docRes = await getDocs(queryRes);
      setNewData(docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.log(err);
      alert("An error occured while fetching animes");
    }
  };

  useEffect(() => {
    fetchNewData();
  }, [valueUpcomingSort]);

  return (
    <>
      {/* <NavBar /> */}

      <Carousel>
        <Carousel.Item className="car-item">
          <div className="overlay">
            <img
              className="d-block w-100"
              src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6cc57686-5c3b-4158-b341-1ca16d48c82d/dcj8ncn-c33edf0f-eb4d-41e7-b291-276d5b047e52.jpg/v1/fill/w_1024,h_576,q_75,strp/anime_character_collage_by_diamondj3474_dcj8ncn-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNmNjNTc2ODYtNWMzYi00MTU4LWIzNDEtMWNhMTZkNDhjODJkXC9kY2o4bmNuLWMzM2VkZjBmLWViNGQtNDFlNy1iMjkxLTI3NmQ1YjA0N2U1Mi5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.2IO4ZLwR5faiZZ0U7OCB_WHmLmVh2kcObgHCv4275uE"
              alt="First slide"
            />
            <Carousel.Caption className="car-btn">
              <Button
                as={Link}
                to="/browse-animes"
                variant="danger"
                size="lg"
                className="cbtn p-4"
              >
                Browse Animes<i className="fa-solid fa-angle-right"></i>
              </Button>
            </Carousel.Caption>
          </div>
        </Carousel.Item>

        <Carousel.Item className="car-item">
          <div className="overlay">
            <img
              className="d-block w-100 img-fluid"
              src="https://wallpaperaccess.com/full/4233970.png"
              alt="Second slide"
            />

            <Carousel.Caption className="car-btn">
              <Button
                as={Link}
                to="/browse-mangas"
                variant="danger"
                size="lg"
                className="cbtn p-4"
              >
                Browse Mangas<i className="fa-solid fa-angle-right"></i>
              </Button>
            </Carousel.Caption>
          </div>
        </Carousel.Item>
      </Carousel>

      <Container style={{ marginTop: "5rem" }}>
        <div className="d-flex justify-content-between mb-4">
          <h2>Animes</h2>
          <DropdownButton
            id="dropdown-basic-button"
            title={sortCriteria}
            onSelect={(e) => setValueAnimeSort(e)}
            variant="danger"
          >
            <Dropdown.Item eventKey="rating">Popular</Dropdown.Item>
            <Dropdown.Item eventKey="title">Name</Dropdown.Item>
            <Dropdown.Item eventKey="yor">Latest</Dropdown.Item>
            <Dropdown.Item eventKey="addedDate">Date Added</Dropdown.Item>
            <Dropdown.Item eventKey="watched">Most Watched</Dropdown.Item>
          </DropdownButton>
        </div>
        <CardSlider type="anime" data={animeData} date="no" />
      </Container>

      <Container style={{ marginTop: "5rem" }}>
        <div className="d-flex justify-content-between mb-4">
          <h2>Mangas</h2>
          <DropdownButton
            id="dropdown-basic-button"
            title={sortMangaCriteria}
            onSelect={(e) => setValueMangaSort(e)}
            variant="danger"
          >
            <Dropdown.Item eventKey="rating">Popular</Dropdown.Item>
            <Dropdown.Item eventKey="title">Name</Dropdown.Item>
            <Dropdown.Item eventKey="yor">Latest</Dropdown.Item>
            <Dropdown.Item eventKey="addedDate">Date Added</Dropdown.Item>
            <Dropdown.Item eventKey="reading">Most Reading</Dropdown.Item>
          </DropdownButton>
        </div>
        <CardSlider type="manga" data={mangaData} date="no" />
      </Container>

      <Container style={{ marginTop: "5rem" }}>
        <div className="d-sm-flex justify-content-evenly mb-4 gap-5 text-center">
          <Card className="p-5 w-100 bg border-0" as={Link} to="/browse-animes">
            <Card.Body>
              <Card.Title id="home-1">
                More Animes<i className="fa-solid fa-angle-right"></i>
              </Card.Title>
            </Card.Body>
          </Card>

          <Card className="p-5 w-100 bg border-0" as={Link} to="/browse-mangas">
            <Card.Body>
              <Card.Title id="home-2">
                More Mangas<i className="fa-solid fa-angle-right"></i>
              </Card.Title>
            </Card.Body>
          </Card>
        </div>
      </Container>

      <Container style={{ marginTop: "5rem" }}>
        <Card className="text-center p-3 cardBg" border="danger">
          <Card.Body>
            <Card.Title>CAN'T FIND WHAT YOU ARE LOOKING FOR?</Card.Title>
            <Button variant="danger">
              <a
                href="mailto:someone@gmail.com"
                style={{ textDecoration: "none" }}
                className="title"
              >
                Report<i className="fa-solid fa-angle-right"></i>
              </a>
            </Button>
          </Card.Body>
        </Card>
      </Container>

      <Container style={{ marginTop: "5rem", marginBottom: "5rem" }}>
        <div className="d-flex justify-content-between mb-4">
          <h2>Upcoming Releases</h2>
          <DropdownButton
            id="dropdown-basic-button"
            title={`${valueUpcomingSort[0].toUpperCase()}${valueUpcomingSort.slice(
              1
            )}`}
            onSelect={(e) => {
              setValueUpcomingSort(e);
            }}
            variant="danger"
          >
            <Dropdown.Item eventKey="anime">Anime</Dropdown.Item>
            <Dropdown.Item eventKey="manga">Manga</Dropdown.Item>
          </DropdownButton>
        </div>
        <CardSlider type={valueUpcomingSort} data={newData} date="yes" />
      </Container>

      {/* <Footer/> */}
    </>
  );
}
