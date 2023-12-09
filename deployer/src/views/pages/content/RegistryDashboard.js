/* eslint-disabled */
import {
    Box,
    Button,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';
import Loader from "../../../ui-component/Loader";
import MainCard from "../../../ui-component/cards/MainCard";
import React, {useEffect, useState} from "react";
import {restService} from "../../../service/restService";
import {IconTrash} from "@tabler/icons";

const RegistryDashboard = () => {
    const [loader, setLoader] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedBranchTag, setSelectedBranchTag] = useState();
    const [deployBranchModalOpen, setDeployBranchModalOpen] = useState(false);
    const [selectedArguments, setSelectedArguments] = useState([{argKey: '', argValue: ''}]);
    const [selectedPort, setSelectedPort] = useState();
    const getImages = () => {
        console.log(selectedBranchTag);
        console.log(images)
        restService.get("deployment/get-images-from-aws", setLoader)
            .then((response) => {
                console.log(response);
                setImages(response);
            }).catch((error) => {
            console.log(error);
        })
    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    useEffect(() => {
        const port = getNumbers(selectedBranchTag);
        setSelectedPort(port);
        getImages();
    }, []);
    const getNumbers = (str) => {
        if (str) {
            return str.replace(/\D/g, '');
        }
        return '';
    }

    function deployImage() {
        const requestObject = {
            branchName: selectedBranchTag,
            port: selectedPort,
            arguments: selectedArguments && selectedArguments.map((arg) => {
                return {
                    key: arg.argKey,
                    value: arg.argValue
                };
            })
        };
        restService.post("deployment/deploy-branch", requestObject, setLoader)
            .then((response) => {
                console.log(response);
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
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
                                <TableCell>Image Tag</TableCell>
                                <TableCell>Image Digest</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {images && images.map((row) => (
                                <TableRow key={row.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                    <TableCell>{row.imageTag}</TableCell>
                                    <TableCell>{row.imageDigest}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => {
                                            setDeployBranchModalOpen(true);
                                            setSelectedBranchTag(row.imageTag);
                                        }}>Deploy</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal
                    open={deployBranchModalOpen}
                    onClose={() => {
                        setSelectedArguments([{argKey: '', argValue: ''}]);
                        setDeployBranchModalOpen(false);
                    }}
                >
                    <Box sx={style}>
                        <Box>
                            <h2>Arguments</h2>
                        </Box>
                        <Box>
                            {
                                selectedArguments && selectedArguments.length !== 0 ? selectedArguments.map((arg, index) => {
                                    return (
                                        <div style={{display: 'flex', flexDirection: 'row', marginTop: '10px'}}
                                             key={index}>
                                            <TextField
                                                label="Key"
                                                variant="outlined"
                                                value={arg.argKey}
                                                onChange={(e) => {
                                                    const tempArgs = [...selectedArguments];
                                                    tempArgs[index].argKey = e.target.value;
                                                    setSelectedArguments(tempArgs);
                                                }}/>
                                            <TextField
                                                style={{marginLeft: '10px'}}
                                                label="Value"
                                                variant="outlined"
                                                value={arg.argValue}
                                                onChange={(e) => {
                                                    const tempArgs = [...selectedArguments];
                                                    tempArgs[index].argValue = e.target.value;
                                                    setSelectedArguments(tempArgs);
                                                }}
                                            />
                                            <Button>
                                                <IconTrash onClick={() => {
                                                    const tempArgs = [...selectedArguments];
                                                    tempArgs.splice(index, 1);
                                                    setSelectedArguments(tempArgs);
                                                }}/>
                                            </Button>
                                        </div>
                                    )
                                }) : <h3>There is no Arguments</h3>
                            }

                            <Box style={{marginTop: '20px'}}>
                                <TextField
                                    label="Port"
                                    variant="outlined"
                                    value={selectedPort}
                                    onChange={(e) => setSelectedPort(e.target.value)}
                                />
                            </Box>
                            <Box style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                                <Button onClick={() => {
                                    setSelectedArguments([...selectedArguments, {argKey: '', argValue: ''}])
                                }}>Add New Argument</Button>
                            </Box>


                            <Box style={{display: 'flex', justifyContent: 'flex-end', marginTop: '10px'}}>
                                <Button onClick={() => deployImage()}>Deploy</Button>
                            </Box>

                        </Box>
                    </Box>
                </Modal>
            </MainCard>
        </>
    )
        ;
};
export default RegistryDashboard;
