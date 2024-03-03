
import { useCallback, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import NewConnection from '../components/NewConnection'
import DataProtectedView from '../feature/DataProtectedFeature/DataProtectedView'
import { grantAccess, listGrantedAccess, listProtectedData } from '../services/iexecDataProtectorService'
import SendWeb3MailShowCase from '../feature/Web3Mail/SendWeb3MailShowCase';
import Spinner from 'react-bootstrap/Spinner';
import SpinnerLoader from '../components/SpinnerLoader'
import { ProtectedData } from '@iexec/dataprotector'


const Web3Context = (props: any) => {

    const account = useAccount()
    const { connectors, connect, status, error } = useConnect()
    const { disconnect } = useDisconnect()
    const [connectionCheckTriggered, setConnectionCheckTriggered] = useState<boolean>(false)
    const [userConnectStatusChanged, setUserConnectStatusChanges] = useState<boolean>(false)
    const [userPortectedDataAddress, setUserProtectDataAddress] = useState("")
    const [userGrantedAccess, setUserGrantedAccess] = useState<any>(null);
    const [userConnectedFetchDetailCompleted, setUserConnectedFetchDetailCompleted] = useState<boolean>(true)
    const [newProtectedDataCreated, setNewProtectedDataCreated] = useState<boolean>(false);
    const [sendEmailAction, setSendEmailAction] = useState<boolean>(false)
    const [sendEmailUserProtectedDataAddress, setSendEmailUserProtectedDataAddress] = useState<any>(null)
    

    // useEffect(() => {
    //     (async() => {
    //         if(account.isConnected) {
    //             if(newProtectedDataCreated) {
    //                 setUserConnectedFetchDetailCompleted(false)
    //                 const protectDataList = await listProtectedData(connectors[0], account.address)
    //                 console.log("protectDataList ", protectDataList)

    //                 if(protectDataList.length > 0) {
    //                     const protectedEmail: any = protectDataList.find(item => item.schema.hasOwnProperty("People_Plus_Local_App"));
    //                     if (!protectedEmail) {
    //                         console.warn(`Web3MailProvider ----  - User ${account.address} has no protected email`);
    //                         return null;
    //                     }
    //                     console.log("protectedEmail", protectedEmail)
    //                     setUserProtectDataAddress(protectedEmail.address)
    //                     const grantedAccessesResult: any = await listGrantedAccess(connectors[0], protectedEmail.address, account.address)
    //                     console.log("grantedAccessesResult: ", grantedAccessesResult)
    //                     if(grantedAccessesResult.count == 0) {
    //                         const grantAccessResult = await grantAccess(connectors[0], protectedEmail.address, account.address)
    //                         setUserGrantedAccess(grantAccessResult)

    //                     } else {
    //                         setUserGrantedAccess(grantedAccessesResult.grantedAccess[0])
    //                     }
    //                 }
    //             }
    //             setUserConnectedFetchDetailCompleted(true)
    //         }

    //     })();

    // }, [account.isConnected, newProtectedDataCreated])
    // useEffect(() => {
    //     // console.log("account: ", account)
    //     if (account.isReconnecting)
    //         setConnectionCheckTriggered(true)
    // }, [account.isReconnecting])

    // useEffect(() => {
    //     // console.log("account: ", account)
    //     if (account.isConnecting)
    //         setConnectionCheckTriggered(true)
    // }, [account.isConnecting])

    const connectWalletHandler = () => {
        setUserConnectStatusChanges(true)
        connect({ connector: connectors[0] })
    }

    const triggerNewProtectedDataCreated = () => {
        setNewProtectedDataCreated(true)   
    }

    const componseNewEmailHandler = () => {
        setSendEmailAction(true);
        console.log("Componse Emailed clicked")
    }

    const sendEmailHandler = (protectData: ProtectedData) => {
        setSendEmailAction(true);
        console.log("protectData: ", protectData)
        setSendEmailUserProtectedDataAddress(protectData)

    }

    const navigateBackHandler = () => {
        console.log("navigateBackHandler")
        setSendEmailUserProtectedDataAddress(null)
        setSendEmailAction(false)
    }

    return (
        <Container style={{ background: "transparent", height: '100%' }}>
            {
                (account.isReconnecting ||  account.isConnecting) && <SpinnerLoader message={"Loading..."} />
            }
            {!account.isConnected && <NewConnection error={error} isConnecting={account.isConnecting} isConnected={account.isConnected} status={status} onWalletConnect={connectWalletHandler} />}
            {
                account.isConnected && !sendEmailAction && <DataProtectedView isConnected={account.isConnected} onSuccess={triggerNewProtectedDataCreated} onComponseEmail={componseNewEmailHandler} onSendEmail={sendEmailHandler}/>
            }
            {
                sendEmailAction && <SendWeb3MailShowCase protectDataAddress={sendEmailUserProtectedDataAddress} onNavigateBack={navigateBackHandler} />
            }
        </Container>
    );

}

export default Web3Context