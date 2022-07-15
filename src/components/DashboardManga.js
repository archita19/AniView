// import onePunchMan from'./Images/onePunchMan.jpg';
// import edit from './Images/edit.png';
// import deleteBin from './Images/deleteBin.png';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import '../css/Dashboard.css';

export default function DashboardManga() {
    return(
        <>
        <span>Count: </span>
        <Table striped bordered className='admin'>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Publication Studio</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        {/* <img src={onePunchMan} alt="OnePunchMan" width={150} height={100} /> */}
                    </td>
                    <td>One Punch Man</td>
                    <td>Madhouse (season 1), J.C.Staff (season 2)</td>
                    <td>
                        <Button variant="outline-secondary" className="m-1 p-0">
                            {/* <img src={edit} alt="edit image" width={20} height={20}/> */}
                        </Button>
                        <Button variant="outline-secondary" className="m-1 p-0">
                            {/* <img src={deleteBin} alt="delete image" width={20} height={20} /> */}
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
        </>
    );
}