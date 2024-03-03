import { DataObject, DataSchema } from "@iexec/dataprotector";
import { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { useConnect, useAccount } from 'wagmi'
import { listGrantedAccess, listProtectedData, protectData } from "../../services/iexecDataProtectorService";
import "../../styles/dataProtectedView.scss"
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import SpinnerLoader from "../../components/SpinnerLoader";
import { ArrowBarRight, Send } from 'react-bootstrap-icons';


const DataProtectedView = (props: any) => {
    const account = useAccount()
    const { connectors, connect, status, error } = useConnect()
    const [userEmail, setUserEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [submitState, setSubmitState] = useState<boolean>(false);
    const [loadingUserProtectData, setLoadingUserProtectedData] = useState<boolean>(true);
    const [ownerProtectedDatas, setOwnerProtectedData] = useState<any>([]);


    const fetchAllUserProtectedData = async () => {
        setLoadingUserProtectedData(true)
        const protectDataList = await listProtectedData(connectors[0], account.address)
        if (protectDataList.length > 0) {
            const protectedEmails: any = protectDataList.filter(item => item.schema.hasOwnProperty("People_Plus_Local_App"));
            if (!protectedEmails) {
                return null;
            }
            setOwnerProtectedData(protectedEmails)
        }
        setLoadingUserProtectedData(false);
    }


    useEffect(() => {
        (async () => {
            await fetchAllUserProtectedData()
        })();
    }, [])

    const onSubmitHandler = async (e: any) => {
        e.preventDefault();
        setSubmitState(true)
        let data: DataObject = { email: userEmail, "People_Plus_Local_App": true }
        const result: any = await protectData(connectors[0], data, userName)
        setUserEmail("")
        setUserName("")
        setSubmitState(false);
        await fetchAllUserProtectedData()

    }



    const LoadingSpinner = () => {
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    }

    return <Container className="data-protected-view">
        <Row>
            <Col>
                <div className="cta-button-block">
                    <Button variant="success" disabled={ownerProtectedDatas.length == 0} onClick={props.onComponseEmail}>Compose New Email</Button>
                </div>
            </Col>
        </Row>
        <Row>
            <Col>
                <div className="form-block">
                    <p style={{ textAlign: "center" }}>
                        Add new email, to message using Web3mail
                    </p>
                    <Form onSubmit={onSubmitHandler}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" defaultValue={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your name" defaultValue={userName} onChange={(e) => setUserName(e.target.value)} />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" type="submit">
                                {!submitState && "Submit"}
                                {submitState && <LoadingSpinner />}
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </Col>
            <Col>
                <div className="list-block">
                    <p style={{ textAlign: "center" }}>
                        All you protectData's for messaging using Web3mail
                    </p>
                    {loadingUserProtectData && <SpinnerLoader message={"Loading..."} />}
                    {}
                    <ListGroup>
                        {ownerProtectedDatas.map((data: any, index: number) => {
                            return <ListGroup.Item key={index}>
                                <Row>
                                    <Col>
                                        <ArrowBarRight className="list-icon" />
                                        {data.name}
                                    </Col>
                                    <Col>
                                        <div className="list-button-block">
                                            <Button variant="warning" size="sm" onClick={() => props.onSendEmail(data)}>
                                                <Send className="me-1"/> Send Mail
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        })}
                    </ListGroup>
                </div>
            </Col>
        </Row>
    </Container>
}

export default DataProtectedView;