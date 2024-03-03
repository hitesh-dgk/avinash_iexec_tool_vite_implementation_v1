import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap"
import { IExecWeb3mail } from "@iexec/web3mail";
import Alert from 'react-bootstrap/Alert';
import { grantAccess, listGrantedAccess, listProtectedData } from "../../services/iexecDataProtectorService";
import { useAccount, useConnect } from "wagmi";
import "../../styles/sendWeb3Mail.scss"
import SpinnerLoader from "../../components/SpinnerLoader";




const SendWeb3MailShowCase = (props: any) => {

    const account = useAccount()
    const { connectors, connect, status, error } = useConnect()
    const [submitState, setSubmitState] = useState<boolean>(false);
    const [subject, setSubject] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [mailSent, setMailSet] = useState<boolean>(false)
    const [loadingUserProtectData, setLoadingUserProtectedData] = useState<boolean>(true);
    const [userGrantedAccess, setUserGrantedAccess] = useState<any>(null);
    const [ownerProtectedData, setOwnerProtectedData] = useState<any>([]);
    const [selectedUserProtectedData, setSelectedUserProtectedData] = useState<any>(props.protectDataAddress)
    const [grantAccessTiggered, setGrantAccessTriggered] = useState<boolean>(false);
    const [selectedUserProtectDataTagValue,setSelectedUserProtectDataTagValue ] = useState<any>("");



    console.log("SendWeb3MailShowCase props")
    console.log(props)

    const fetchAllUserProtectedData = async () => {
        setLoadingUserProtectedData(true)
        const protectDataList = await listProtectedData(connectors[0], account.address)
        console.log("protectDataList ", protectDataList)
        if (protectDataList.length > 0) {
            const protectedEmails: any = protectDataList.filter(item => item.schema.hasOwnProperty("People_Plus_Local_App"));
            if (!protectedEmails) {
                console.warn(`Web3MailProvider ----  - User ${account.address} has no protected email`);
                return null;
            }
            console.log("protectedEmails", protectedEmails)
            setOwnerProtectedData(protectedEmails)
        }
        setLoadingUserProtectedData(false);
    }

    const getherProtectedUserDataAccess = async () => {
        setGrantAccessTriggered(true)
        console.log("connectors[0], selectedUserProtectedData, account.address")
        console.log(connectors[0], selectedUserProtectedData.address, account.address)
        const grantedAccessesResult: any = await listGrantedAccess(connectors[0], selectedUserProtectedData.address, account.address)
        console.log("grantedAccessesResult: ", grantedAccessesResult)
        if (grantedAccessesResult.count == 0) {
            const grantAccessResult = await grantAccess(connectors[0], selectedUserProtectedData.address, account.address)
            setUserGrantedAccess(grantAccessResult)

        } else {
            setUserGrantedAccess(grantedAccessesResult.grantedAccess[0])
        }
        setGrantAccessTriggered(false)
    }

    useEffect(() => {
        (async () => {
            console.log("selectedUserProtectedData: ", selectedUserProtectedData)
            if (selectedUserProtectedData) {
                setUserGrantedAccess(null)
                setLoadingUserProtectedData(false)
                await getherProtectedUserDataAccess()
            } else {
                await fetchAllUserProtectedData()
            }
        })();

    }, [selectedUserProtectedData])


    const onSubmitHandler = async (e: any) => {
        e.preventDefault();
        await getherProtectedUserDataAccess()
        setSubmitState(true)
        setMailSet(false)
        const provider: any = await connectors[0].getProvider()
        const web3mail = new IExecWeb3mail(provider);

        console.log(selectedUserProtectedData)
        console.log({
            protectedData: selectedUserProtectedData.address,
            emailSubject: subject,
            emailContent: content,
        })
        const sendEmail = await web3mail.sendEmail({
            protectedData: selectedUserProtectedData.address,
            emailSubject: subject,
            emailContent: content,
        });

        console.log("sendEmail: ", sendEmail)

        setSubject("")
        setContent("")
        setMailSet(true)
        setSubmitState(false)
    }

    const onSelectChangeHandler = (e: any) => {
        console.log(e.target.value)
        let dataSet = ownerProtectedData.filter((data: any) => data.address === e.target.value)
        setSelectedUserProtectDataTagValue(e.target.value)
        console.log("dataSet")
        console.log(dataSet)
        setSelectedUserProtectedData(dataSet[0])
    }

    const LoadingSpinner = () => {
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    }

    const EmailSuccessEvent = () => {
        return <Alert style={{ "position": "absolute", "top": "15px" }} key={"success"} variant={"success"}>
            Email was sent successfully
        </Alert>
    }


    return <Container className="common-main-block web3mail-block">
        {mailSent && <EmailSuccessEvent />}
        <div className="cta-button">
            <Button variant="primary" onClick={props.onNavigateBack}>
                Back
            </Button>
        </div>
        {!props.protectDataAddress && loadingUserProtectData && <SpinnerLoader message={"Fetching Protected Data"} />}
        {!props.protectDataAddress && !loadingUserProtectData && <div className="protected-data-section-block">
            <Form.Select aria-label="Default select example" value={selectedUserProtectDataTagValue} className="mb-1" onChange={onSelectChangeHandler}>
                <option value="">Select the Receiver</option>
                {ownerProtectedData.map((data: any, index: number) => {
                    let isSelected = false;
                    if (selectedUserProtectedData && selectedUserProtectedData.address === data.address) {
                        console.log("inside")
                        console.log("selectedUserProtectedData: ", selectedUserProtectedData)
                        isSelected = true
                    }
                    return <option key={index} value={data.address}>{data.name}</option>
                })}
            </Form.Select>
        </div>}
        <p className="mt-2 mb-1" style={{ fontSize: "10px" }}>
            {grantAccessTiggered && "Granting Access..."}
        </p>
        {selectedUserProtectedData && <p>
            Sending Email To: {selectedUserProtectedData.name}
        </p>}
        <hr className="mt-1" style={{ width: "100%" }} />
        <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email Subject</Form.Label>
                <Form.Control type="text" placeholder="Enter Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Email Content</Form.Label>
                <Form.Control type="text" placeholder="Enter Content" value={content} onChange={(e) => setContent(e.target.value)} />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group>
                <Button variant="primary" type="submit" disabled={!userGrantedAccess}>
                    {!submitState && "Send Email"}
                    {submitState && <LoadingSpinner />}
                </Button>
            </Form.Group>
        </Form>

    </Container>

}
export default SendWeb3MailShowCase