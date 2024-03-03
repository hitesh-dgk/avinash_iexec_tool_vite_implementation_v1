
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
    const [sendEmailAction, setSendEmailAction] = useState<boolean>(false)
    const [sendEmailUserProtectedDataAddress, setSendEmailUserProtectedDataAddress] = useState<any>(null)

    const connectWalletHandler = () => {
        connect({ connector: connectors[0] })
    }

    const componseNewEmailHandler = () => {
        setSendEmailAction(true);
    }

    const sendEmailHandler = (protectData: ProtectedData) => {
        setSendEmailAction(true);
        setSendEmailUserProtectedDataAddress(protectData)

    }

    const navigateBackHandler = () => {
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
                account.isConnected && !sendEmailAction && <DataProtectedView isConnected={account.isConnected} onComponseEmail={componseNewEmailHandler} onSendEmail={sendEmailHandler}/>
            }
            {
                sendEmailAction && <SendWeb3MailShowCase protectDataAddress={sendEmailUserProtectedDataAddress} onNavigateBack={navigateBackHandler} />
            }
        </Container>
    );

}

export default Web3Context