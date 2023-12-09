import React, {useEffect, useState} from 'react';
import MainCard from 'ui-component/cards/MainCard';
import {restService} from 'service/restService';
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import containerStatus from "../../utils/constants";
import Loader from "../../ui-component/Loader";

const DockerList = () => {
    const [containers, setContainers] = useState([]);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        getContainers();
    }, []);

    const getContainers = () => {
        restService
            .get('docker/get-containers', setLoader)
            .then((response) => {
                console.log(response);
                setContainers(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    function killContainer(id) {
        alert(id);
        restService.get('docker/kill-container?containerId='+id,setLoader)
            .then(()=>{

            alert('success');
        }).catch(()=>{
            alert('error');
        })
    }

    return (
        <>
            {loader && <Loader/>}
            <MainCard title="Sample Card">
                <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {containers && containers.map((row) => (
                                <TableRow key={row.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                    <TableCell component="th" scope="row">
                                        {row.names ? row.names[0] : ''}
                                    </TableCell>
                                    <TableCell>{row.image}</TableCell>
                                    <TableCell>{row.state}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell>
                                        <Button>Restart</Button>
                                        {row.state === containerStatus.EXITED &&
                                            <Button>Run</Button>
                                        }
                                        {row.state === containerStatus.RUNNING &&
                                            <Button onClick={()=>killContainer(row.id)}>Kill</Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </MainCard>
        </>
    );
};

export default DockerList;
