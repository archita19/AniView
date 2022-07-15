import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Navbar,
  Nav,
  Form,
  FormControl,
  NavDropdown,
  Offcanvas,
  Button,
} from "react-bootstrap";
import { db, auth, logOut } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  getDocs,
  orderBy,
  query,
  startAt,
} from "firebase/firestore";
import "../css/style.css";
import { useState } from "react";
import { useEffect } from "react";

export default function NavBar(props) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    localStorage.removeItem("AdminUser");
    localStorage.removeItem("User");
    localStorage.removeItem("UserId");
    navigate("/");
  };

  const [searchText, setSearchText] = useState("");
  const [searchRes, setSearchRes] = useState([]);
  // const [showResult, setShowResult] = useState(true);

  const showResults = () => {
    searchRes.map((i) => console.log(i.title));
    // setShowResult(true)
  };

  const fetchSearchResults = async () => {
    try {
      // console.log(searchText)
      const queryRes = query(
        collection(db, "animes"),
        orderBy("title"),
        startAt(searchText)
      );
      // const queryRes = query(collection(db, "animes"), where("title", ">=", searchText));
      const docRes = await getDocs(queryRes);
      setSearchRes(docRes.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.log(err);
      // alert("An error occured while fetching favlist");
    }
  };

  const capitalizeSearchText = (e) => {
    let str = e.target.value;
    let resStr = str.charAt(0).toUpperCase() + str.slice(1);
    setSearchText(resStr);
    // searchRes.map((i) => console.log(i.title))
    // setSearchText(e.target.value)
  };

  const [searchItem, setSearchItem] = useState('')
  const getItem = () => {
    // console.log(e.target)
    console.log(this.value);
  };

  function handleInputChange() {
    var inputValue = document.getElementById("exampleDataList").value;
    var options = document.getElementById("datalistOptions").childNodes;
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === inputValue) {

        // Send to DB - options[i].attributes.value

        console.log(options[i].attributes.value)
        console.log(options[i].getAttribute('dataItemType'))
        console.log(options[i].getAttribute('dataItemId'))

        navigate(`/${options[i].getAttribute('dataItemType')}/${options[i].getAttribute('dataItemId')}`)
        // window.location.reload(false);
        break;
      }
    }
  }

  useEffect(() => {
    fetchSearchResults();
  }, [searchText]);

  return (
    <Navbar
      key="md"
      bg={props.theme}
      variant={props.theme}
      expand="md"
      className="py-3 border border-top-0 border-start-0 border-end-0 border-danger"
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          AniView
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-md" />

        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-md"
          aria-labelledby="offcanvasNavbarLabel-expand-md"
          placement="end"
        >
          <Offcanvas.Header
            closeButton
            className={props.theme === "light" ? "bg-light" : "bg-dark"}
          >
            <Offcanvas.Title id="offcanvasNavbarLabel-expand-md">
              AniView
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body
            className={props.theme === "light" ? "bg-light" : "bg-dark"}
          >
            <Form className="d-flex flex-grow-1 mx-4 search-sec">
              {/* <FormControl
                            type="search"
                            placeholder="Search..."
                            className="me-2"
                            aria-label="Search"
                            onChange={(e) => {setSearchText(e.target.value)}}
                            value={searchText}
                        />
                        <Button variant="outline-danger" onClick={showResults}><i className="fa-solid fa-magnifying-glass"></i></Button> */}

              <input
                class="form-control me-2"
                list="datalistOptions"
                id="exampleDataList"
                placeholder="Type to search..."
                onChange={(e) => {
                  capitalizeSearchText(e);
                  handleInputChange();
                }}
              />
              <datalist id="datalistOptions">
                {searchText.length > 0 &&
                  searchRes.map((i) => {
                    return (
                      // <li style={{listStyle: "none"}}><a className='title text-decoration-none' href={`/${i.itemType}/${i.animeId}`}>{i.title}</a></li>
                      <option key={i.animeId} value={i.title} dataItemType={i.itemType} dataItemId={i.animeId}>
                        {i.itemType}
                      </option>
                    );
                  })}
              </datalist>
              {/* <Button variant="outline-danger">
                <i className="fa-solid fa-magnifying-glass"></i>
              </Button> */}
            </Form>

            {/* <div className={`ms-4 w-50 d-none small-device-search ${props.theme === 'light' ? 'bg-light' : 'bg-dark'}`}>
                    {showResult && searchText.length > 0 && searchRes.map((i) => {
                        return (<li style={{listStyle: "none"}}><a className='title text-decoration-none' href={`/${i.itemType}/${i.animeId}`}>{i.title}</a></li>)
                    })
                    }
                    </div> */}

            <Nav className="justify-content-end pe-3">
              <NavDropdown title="Menu" id="offcanvasNavbarDropdown-expand-md">
                <NavDropdown.Item as={Link} to="/">
                  Home
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/browse-animes">
                  Browse Animes
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/browse-mangas">
                  Browse Mangas
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-fav-list">
                  My FavList
                </NavDropdown.Item>
              </NavDropdown>
              {/* <Nav.Link as={Link} to="/my-fav-list">My FavList</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/sign-in">Sign In</Nav.Link> */}
              {!user && (
                <Nav.Link as={Link} to="/sign-in">
                  Sign In
                </Nav.Link>
              )}
              {user && (
                <NavDropdown title={user.email}>
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogOut}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Offcanvas.Body>
          {/* <div style={{position: "relative", zIndex: "2"}} className={`ms-4 w-50 ${props.theme === 'light' ? 'bg-light' : 'bg-dark'} large-device-search`}>
                    {showResult && searchText.length > 0 && searchRes.map((i) => {
                        return (<li style={{listStyle: "none"}}><a className='title text-decoration-none' href={`/${i.itemType}/${i.animeId}`}>{i.title}</a></li>)
                    })
                } 
                </div> */}
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
