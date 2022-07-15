import { deleteDoc, doc, collection, query, getDocs, where } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Table } from "react-bootstrap"
import '../css/Dashboard.css'
import { db } from "../firebase-config";
import { Link } from 'react-router-dom';

export default function DashboardAnime(props) {
    const {type} = props;
    const [results, setResults] = useState([])
    const [delState, setDelState] = useState(false)

    const fetchResults = async() => {
        try {
            const queryRes = query(collection(db, "animes"), where("itemType", "==", type));
            const docRes = await getDocs(queryRes);
            setResults(docRes.docs.map(doc => ({...doc.data(), id: doc.id})))
        }
        catch(err) {
            console.log(err);
        }
    }

    const deleteItem = async(docId) => {
        try {
            const delDoc = doc(db, "animes", docId)
            await deleteDoc(delDoc);
        }
        catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchResults()
    }, [])

    useEffect(() => {
        fetchResults()
        setDelState(false)
    }, [delState])

    return(
        <div className="mx-4">
        <span>Count: {results.length}</span>
        <Table striped bordered className='admin mt-3'>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>No. of {type === 'anime' ? 'Episodes' : 'Chapters'}</th>
                    <th>{type === 'anime' ? 'Animation' : 'Publication'} Studio</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            {
                results && results.map((res) => {
                    return (
                    <tr>
                        <td><img src={res.imgRef} width={60} height={60} alt={res.title}/></td>
                        <td>{res.title}</td>
                        {type === 'anime' ? <td>{res.noOfEpisodes}</td> : <td>{res.noOfEpisodes}</td>}
                        <td>{res.animationStudio}</td>
                        <td>
                            <Button variant="outline-danger" className="border-0" as={Link} to={`/admin-dashboard-edit/${res.itemType}/${res.animeId}`}>
                                <i class="fa-solid fa-pen"></i>
                            </Button>                   
                            <Button variant="outline-danger" className="border-0" onClick={() => {deleteItem(res.id); setDelState(true)}}>
                                <i class="fa-solid fa-trash"></i>
                            </Button>
                        </td>
                    </tr>
                )
                }

                )
            }
            </tbody>
        </Table>
        </div>
    );
}