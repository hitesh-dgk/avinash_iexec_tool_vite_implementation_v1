"use client"
import { Button } from "react-bootstrap";
import "../../styles/newConnection.scss"
import { useEffect } from "react";
import { ConnectErrorType } from "wagmi/actions";
import Spinner from 'react-bootstrap/Spinner';
import SpinnerLoader from "../SpinnerLoader";

interface NewConnectionProps {
    error: ConnectErrorType | null;
    isConnected: boolean;
    isConnecting: boolean;
    status: any;
    onWalletConnect: any;
}

const NewConnection = (props: NewConnectionProps) => {

    useEffect(() => {
        console.log("NewConnection props: ", props)
    }, [props])

    return <div className="new-connection-block">
            <Button style={{width: "200px"}} variant="primary" onClick={props.onWalletConnect}>
                { props.isConnecting &&  <SpinnerLoader message={"Loading..."} />}
                { !props.isConnecting && "Connect Wallet" }
            </Button>
            { props.isConnecting && <span>Connecting...</span> }
    </div>
}

export default NewConnection;