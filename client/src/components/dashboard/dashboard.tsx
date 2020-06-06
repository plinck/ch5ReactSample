import React from 'react';
import { useSubscribeString } from "../react-ch5/react-ch5";
import PushButton from '../buttons/PushButton';
import ButtonCH from '../buttons/ButtonCH';
import ContinuousSliderCH from '../sliders/ContinuousSliderCH';

const InterlockedButtons = () => (
    <div>
    <PushButton publishSignalName="21" subscribeSignalName="21" >A-21</PushButton>
    <PushButton publishSignalName="22" subscribeSignalName="22" >B-22</PushButton>
    <PushButton publishSignalName="23" subscribeSignalName="23" >C-23</PushButton>
    <PushButton publishSignalName="24" subscribeSignalName="24" >D-24</PushButton>
    </div>
)

const ToggleButtons = () => (
    <>
    Toggles:
    <PushButton publishSignalName="31" subscribeSignalName="31" >31</PushButton>
    <PushButton publishSignalName="32" subscribeSignalName="32" >32</PushButton>
    </>
)

type StringDivProps = {
    stringSendSignalName: string,
    stringSubscribeSignalName: string,
}

const StringDiv: React.FunctionComponent<StringDivProps> = (props) => {
    const value = useSubscribeString(props.stringSubscribeSignalName);

    return <div style={{ margin: '0 1rem', display: "flex", justifyContent: 'center', alignItems: 'center', border: '5px solid black', width: '20rem', height: '4rem', backgroundColor: '#aaa' }}>{value}</div>;
}

class Dashboard extends React.Component {
  public render() {
    return (
        <div>
            <InterlockedButtons /><StringDiv stringSendSignalName="21" stringSubscribeSignalName="21" />
            <ToggleButtons />
            <ButtonCH variant="contained"  style={{height: '8rem'}} publishSignalName="32" subscribeSignalName="32" >32</ButtonCH>
            <ContinuousSliderCH publishSignalName="36" subscribeSignalName="36"></ContinuousSliderCH>
            <StringDiv stringSendSignalName="1" stringSubscribeSignalName="1" />
            <StringDiv stringSendSignalName="2" stringSubscribeSignalName="2" />
            <StringDiv stringSendSignalName="3" stringSubscribeSignalName="3" />
            <StringDiv stringSendSignalName="4" stringSubscribeSignalName="4" />
        </div>
    );
  }
}

export default Dashboard;