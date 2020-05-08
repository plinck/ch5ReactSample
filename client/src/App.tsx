import React, { TouchEvent } from 'react';
import { ConfigService, useSubscribeString, usePublishAnalog, useSubscribeAnalog } from "./components/react-ch5/react-ch5";
import logo from './assets/images/logo.svg';
import './App.css';
import PushButton from './components/buttons/PushButton';
import * as buttonEmulator from "./assets/data/button-emulator.json";

console.log(JSON.stringify(buttonEmulator,null,2));

const InterlockedButtons = () => (
  <>
    Interlocked:
    <PushButton publishSignalName="11" subscribeSignalName="11" >A</PushButton>
    <PushButton publishSignalName="12" subscribeSignalName="12" >B</PushButton>
    <PushButton publishSignalName="13" subscribeSignalName="13" >C</PushButton>
    <PushButton publishSignalName="14" subscribeSignalName="14" >D</PushButton>
    <PushButton publishSignalName="15" subscribeSignalName="15" >D</PushButton>
  </>
)

const ToggleButtons = () => (
  <>
    Toggles:
    <PushButton publishSignalName="100" subscribeSignalName="100" >1</PushButton>
    <PushButton publishSignalName="6" subscribeSignalName="6" >2</PushButton>
  </>
)

type StringDivProps = {
  stringsubscribeSignalName: string,
}

const StringDiv: React.FunctionComponent<StringDivProps> = (props) => {
  const value = useSubscribeString(props.stringsubscribeSignalName);

  return <div style={{ margin: '0 1rem', display: "flex", justifyContent: 'center', alignItems: 'center', border: '5px solid black', width: '20rem', height: '4rem', backgroundColor: '#aaa' }}>{value}</div>;
}

type AnalogDivProps = {
  analogSendSignalName: string,
  analogsubscribeSignalName: string,
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
  const value = useSubscribeAnalog(props.analogsubscribeSignalName);
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
    <AnalogDiv analogSendSignalName="21" analogsubscribeSignalName="21" />
    <PushButton publishSignalName="34" subscribeSignalName="34" >+</PushButton>
  </>
)

const configService: ConfigService = new ConfigService();
configService.initEmulator(buttonEmulator);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="App-wrap-logo">
          <img src={logo} className="App-logo" alt="react logo" />
        </div>
        <div>
          <Container><InterlockedButtons /><StringDiv stringsubscribeSignalName="11" /></Container>
          <Container><ToggleButtons /></Container>
          <Container><VolumeControl /></Container>
        </div>
      </header>
      <footer>
        {window.location.href /* this way, we can see whether we are looking at internal panel url or live dev server*/}
      </footer>
    </div>
  );
}

export default App;
