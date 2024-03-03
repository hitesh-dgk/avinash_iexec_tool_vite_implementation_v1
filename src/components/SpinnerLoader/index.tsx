
import Spinner from 'react-bootstrap/Spinner';


const SpinnerLoader = (props: any) => {
    return <Spinner animation="border" role="status">
    <span className="visually-hidden">{props.message}</span>
  </Spinner>
}

export default SpinnerLoader;