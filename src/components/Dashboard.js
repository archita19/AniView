import DashboardAnime from "./DashboardAnime";
import DashboardAdd from './DashboardAdd';
import { Tab, Row, Col, Nav } from 'react-bootstrap'
import { auth } from '../firebase-config'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Dashboard() {
    const [user] = useAuthState(auth);
    const navigate = useNavigate()

    useEffect(() => {
        if(!user && !localStorage.getItem('AdminUser'))
            navigate('/admin/sign-in')
        else {
            localStorage.setItem('AdminUser', user)
        }
    }, [])

    return(
        <>
        <p className="text-center my-5 fs-5 d-none msg">Cannot view the admin page on smaller devices</p>
        <div className="main-dashboard">
        <Tab.Container id="left-tabs-example" defaultActiveKey="Animes" className="tab-color">
            <Row className="m-0 min-vh-100">
                {/* <Col md={2} lg={2} className="bg-light p-1"> */}
                <Col md={2} lg={2} className="p-1 cardBg sidebarContainer">
                    {/* <Nav variant="pills" className="flex-column"> */}
                    <Nav variant="pills" style={{marginTop: "4.5rem"}} className="col-md-2 col-lg-2 d-none d-md-block d-lg-block sidebar min-vh-100 fixed-top">
                        <Nav.Item>
                            <Nav.Link eventKey="Animes" style={{cursor: 'pointer'}}>Animes</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Mangas" style={{cursor: 'pointer'}}>Mangas</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="Add" style={{cursor: 'pointer'}}>Add</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={10} lg={10} className="mt-3">
                    <h3 className="px-4 mb-3">Admin Panel</h3>
                    <Tab.Content>
                        <Tab.Pane eventKey="Animes">
                            <DashboardAnime type="anime"/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Mangas">
                            <DashboardAnime type="manga"/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="Add">
                            <DashboardAdd />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        </div>
        </>
    );
}
