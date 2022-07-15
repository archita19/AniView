import React from 'react'
import { useState } from 'react'
import { Button, Container, Row, Col, ListGroup} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../css/style.css'

export default function Footer(props) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [btnName, setbtnName] = useState(localStorage.getItem('btnName') || 'Dark');
  const toggleTheme = () => {
      if(theme === 'light') {
        setTheme('dark');
        setbtnName('Light');
        localStorage.setItem("btnName", 'Light')
      } 
      else {
        setTheme('light');
        setbtnName('Dark');
        localStorage.setItem("btnName", 'Dark')
      }

      localStorage.setItem("theme", theme)
      props.getTheme(theme);
  }

  return (
      <>
        <Container fluid className="d-sm-flex justify-content-around py-5 footerBg">
            <Row>
                <Col sm={3} className="f-col-item">
                    <ListGroup>
                        <ListGroup.Item className="border-0 nav-list" as={Link} to="/">Home</ListGroup.Item>
                        <ListGroup.Item className="border-0 nav-list" as={Link} to="/browse-animes">Browse Animes</ListGroup.Item>
                        <ListGroup.Item className="border-0 nav-list" as={Link} to="/browse-mangas">Browse Mangas</ListGroup.Item>
                        <ListGroup.Item className="border-0 nav-list" as={Link} to="/my-fav-list">My FavList</ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col sm={6} className="f-col-item">
                    <h3>About Us</h3>
                    <p>AniView provides you with a varied collection of animes/mangas. One can get more information about any anime/manga and review the same.</p>
                </Col>
                <Col sm={3} className="f-col-item">
                    <Button variant="danger" className="w-100" onClick={toggleTheme}>{btnName} Mode</Button>
                </Col>
            </Row>
        </Container>
        <p className="text-center py-3 mb-0" style={{ background: '#bb2d3b', color: '#fff'}}>
            <i class="fa-solid fa-copyright"></i> AniView 2022
        </p>
      </>
  )
}
