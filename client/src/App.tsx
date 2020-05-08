
import React, { TouchEvent } from 'react';
import { ConfigureEmulatorService, useSubscribeString, usePublishAnalog, useSubscribeAnalog } from "./components/react-ch5/react-ch5";
import logo from './assets/images/logo.svg';
import './App.css';
import PushButton from './components/buttons/PushButton';
import smwEmulator from "./assets/data/smw-emulator.json";

const InterlockedButtons = () => (
  <>
    Interlocked:
    <PushButton publishSignalName="21" subscribeSignalName="21" >A-21</PushButton>
    <PushButton publishSignalName="22" subscribeSignalName="22" >B-22</PushButton>
    <PushButton publishSignalName="23" subscribeSignalName="23" >C-23</PushButton>
    <PushButton publishSignalName="24" subscribeSignalName="24" >D-24</PushButton>
  </>
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
  if (value < min)
    return min;
  else if (value > max)
    return max;

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

const Container: React.FunctionComponent = (props) => (
  <div className="App-container">
    {props.children}
  </div>
)

const VolumeControl = () => (
  <>
    Volume:
    <PushButton publishSignalName="35" subscribeSignalName="35" >-</PushButton>
    <AnalogDiv analogSendSignalName="36" analogSubscribeSignalName="36" />
    <PushButton publishSignalName="34" subscribeSignalName="34" >+</PushButton>
  </>
)

function App() {
  // Use these two lines if using emulator - comment out when live
  const configureEmulatorService: ConfigureEmulatorService = new ConfigureEmulatorService();
  configureEmulatorService.initEmulator(smwEmulator);

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-wrap-logo">
          <img src={logo} className="App-logo" alt="react logo" />
        </div>
        <div>
          <Container><InterlockedButtons /><StringDiv stringSendSignalName="21" stringSubscribeSignalName="21" /></Container>
          <Container><ToggleButtons /></Container>
          <Container><VolumeControl /></Container>
          <Container><StringDiv stringSendSignalName="1" stringSubscribeSignalName="1" /></Container>
          <Container><StringDiv stringSendSignalName="2" stringSubscribeSignalName="2" /></Container>
          <Container><StringDiv stringSendSignalName="3" stringSubscribeSignalName="3" /></Container>
          <Container><StringDiv stringSendSignalName="4" stringSubscribeSignalName="4" /></Container>
        </div>
      </header>
      <footer>
        {window.location.href /* this way, we can see whether we are looking at internal panel url or live dev server*/}
      </footer>
    </div>
  );
}

export default App;
