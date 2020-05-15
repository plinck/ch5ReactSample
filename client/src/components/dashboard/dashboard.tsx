import React, { TouchEvent } from 'react';
import { useSubscribeString, usePublishAnalog, useSubscribeAnalog } from "../react-ch5/react-ch5";
import PushButton from '../buttons/PushButton';
import ButtonCR from '../buttons/ButtonCR';
import ButtonCH from '../buttons/ButtonCH';

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

type AnalogDivProps = {
    analogSendSignalName: string,
    analogSubscribeSignalName: string,
}

function clamp(value: number, min: number, max: number) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }

    return value;
}

const AnalogDiv: React.FunctionComponent<AnalogDivProps> = (props) => {
    const publish = usePublishAnalog(props.analogSendSignalName);
    const value = useSubscribeAnalog(props.analogSubscribeSignalName);
    const divref = React.useRef<HTMLDivElement>(null);

    const percent = value * 100 / 65535;

    const percentString = percent + '%';

    const touch = (event:TouchEvent<HTMLDivElement>) => {
    if (divref.current) {
        const clientRect = divref.current.getBoundingClientRect();
        const width = clientRect.right - clientRect.left;

        for (var i = 0; i < event.changedTouches.length; i++) {
        const value = clamp(Math.round(65535 * (event.changedTouches[i].pageX - clientRect.left) / width), 0, 65535);
        publish(value);
        console.log(value);
        }
    }
    }

    return (
    <div ref={divref} onTouchStart={touch} onTouchMove={touch} style={{ margin: '0 1rem', border: '1px solid black', display: 'inline-block', width: '20rem', height: '4rem', backgroundColor: '#aaa' }}> 
        <div style={{backgroundColor: '#2f2', width: percentString, height: '4rem'}}></div>
    </div>
    );
}

const VolumeControl = () => (
    <>
    Volume:
    <PushButton publishSignalName="35" subscribeSignalName="35" >-</PushButton>
    <AnalogDiv analogSendSignalName="36" analogSubscribeSignalName="36" />
    <PushButton publishSignalName="34" subscribeSignalName="34" >+</PushButton>
    </>
)  

class Dashboard extends React.Component {
  public render() {
    return (
        <div>
            <InterlockedButtons /><StringDiv stringSendSignalName="21" stringSubscribeSignalName="21" />
            <ToggleButtons />
            <VolumeControl />
            <ButtonCR variant="contained" publishSignalName="32" subscribeSignalName="32" >32</ButtonCR>
            <ButtonCH variant="contained"  style={{height: '8rem'}} publishSignalName="32" subscribeSignalName="32" >32</ButtonCH>
            <StringDiv stringSendSignalName="1" stringSubscribeSignalName="1" />
            <StringDiv stringSendSignalName="2" stringSubscribeSignalName="2" />
            <StringDiv stringSendSignalName="3" stringSubscribeSignalName="3" />
            <StringDiv stringSendSignalName="4" stringSubscribeSignalName="4" />
        </div>
    );
  }
}

export default Dashboard;